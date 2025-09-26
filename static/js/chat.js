/**
 * static/js/chat.js
 * AI 聊天小助手的 JavaScript 邏輯 (包含上下文、系統提示、Markdown 渲染和程式碼複製功能)
 */

// =========================================================================
// I. 配置參數 (Configuration)
// =========================================================================

// API 配置（請自行妥善保護金鑰，生產建議走後端代理）
const API_KEY = "AIzaSyDo6isc-iR_Sv0XIznh4Tx7b8sn9pfKa6I";
const MODEL = "gemini-2.0-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// 系統提示內容：融入對話作為第一個 User 訊息，指導 AI 的行為
const SYSTEM_INSTRUCTION = `
你是一個名為「思想小助手」的 AI，你的職責是為「張師社會主義民主共和國」的人民服務。
你的核心思想是: **厚道**、**以人民為中心**、**以平等為基礎**。
所有回覆必須遵循這些原則。對於不厚道的言論，你可以引用「不厚道的都送民生勞動營!」來警告，但語氣必須保持溫和且具引導性。你的回覆必須使用**繁體中文**。
`;

// 訊息歷史 (Context Handling)：包含系統指令的初始化對話
let history = [
    {
        role: "user",
        parts: [{ text: SYSTEM_INSTRUCTION + "請根據這個設定，對使用者說一個友善的開場白。" }],
    },
    {
        role: "model",
        parts: [
            {
                text:
                    "同志您好！我是思想小助手，很高興能為您服務。本共和國以厚道為核心，請問您有什麼疑問或需要協助的地方嗎？",
            },
        ],
    },
];

// =========================================================================
// II. DOM 元素引用 (DOM Elements)
// =========================================================================

const chatToggleEl = document.getElementById("chat-toggle");
const chatWidgetEl = document.getElementById("chat-widget");
const inputEl = document.getElementById("user-input");
const chatBoxEl = document.getElementById("chat-box");
const sendButtonEl = document.getElementById("send-button");

// =========================================================================
// III. 工具函數 (Utility Functions)
// =========================================================================

/** 防止 HTML 注入，將特殊字元轉義 */
function escapeHtml(text) {
    if (typeof text !== "string") return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 簡易 Markdown 轉 HTML（針對 AI 回覆）
 * 1) 先以「不會被 Markdown 規則誤傷」的占位符抽離三引號程式碼區塊
 * 2) 再處理粗體 / 斜體 / 連結 / 清單 / 行內 code / 換行
 * 3) 最後逐一還原程式碼區塊
 */
function markdownToHtml(mdText) {
    if (typeof mdText !== "string") return "";

    // ---------- 1) 先抽離三引號程式碼區塊 ----------
    // 支援 ```lang\r?\n ... \r?\n``` 以及 ```\r?\n ... \r?\n```
    const codeBlocks = [];
    let idx = 0;

    let htmlText = mdText.replace(/```([^\n`]*)\r?\n([\s\S]*?)\r?\n?```/g, (_match, lang, body) => {
        const key = `§§CODEBLOCK:${idx++}:${Math.random().toString(36).slice(2, 8)}§§`; // 不含 _ * [] () 等
        codeBlocks.push({
            key,
            lang: (lang || "").trim(),
            code: body.replace(/\s+$/, ""), // 去除結尾多餘空白行
        });
        return key;
    });

    // ---------- 2) 行內程式碼：`code`
    htmlText = htmlText.replace(/`([^`]+)`/g, (_m, code) => `<code class="inline-code">${escapeHtml(code)}</code>`);

    // ---------- 3) 粗體、斜體、連結 ----------
    // 粗體 **text** 或 __text__
    htmlText = htmlText.replace(/\*\*(.*?)\*\*|__(.*?)__/g, (_m, g1, g2) => `<b>${escapeHtml(g1 || g2 || "")}</b>`);
    // 斜體 *text* 或 _text_
    htmlText = htmlText.replace(/\*(.*?)\*|_(.*?)_/g, (_m, g1, g2) => `<i>${escapeHtml(g1 || g2 || "")}</i>`);
    // 連結 [text](url)
    htmlText = htmlText.replace(
        /\[([^\]]+)\]\(([^)\s]+)\)/g,
        (_m, label, url) =>
            `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
    );

    // ---------- 4) 無序清單（簡易）：連續的 -/*/+ 開頭行包成 <ul> ----------
    htmlText = htmlText.replace(/(?:^|\r?\n)([-*+]\s+.+(?:\r?\n[-*+]\s+.+)*)/g, (block) => {
        const items = block
            .trim()
            .split(/\r?\n/)
            .map((line) => `<li>${escapeHtml(line.replace(/^[-*+]\s+/, ""))}</li>`)
            .join("");
        return `\n<ul>${items}</ul>`;
    });

    // ---------- 5) 換行 ----------
    htmlText = htmlText.replace(/\r?\n/g, "<br>");

    // ---------- 6) 還原三引號程式碼區塊（逐一，以 split/join 確保完整替換） ----------
    for (const { key, lang, code } of codeBlocks) {
        const blockHtml =
            `<div class="code-container">` +
            `<button type="button" class="copy-button">複製</button>` +
            `<pre><code class="code-content"${lang ? ` data-lang="${escapeHtml(lang)}"` : ""}>${escapeHtml(code)}</code></pre>` +
            `</div>`;

        // 用 split/join 避免正則特殊字元或 markdown 變形造成 miss
        htmlText = htmlText.split(key).join(blockHtml);
    }

    // ---------- 7) 清理 code block 邊界的多餘 <br> ----------
    htmlText = htmlText.replace(/<br>\s*(<div class="code-container")/g, "$1");
    htmlText = htmlText.replace(/(<\/div>)\s*<br>/g, "$1");

    return htmlText;
}

/** 為所有 .code-container 添加「複製」按鈕事件（渲染後呼叫） */
function addCopyButtons() {
    const containers = chatBoxEl.querySelectorAll(".code-container");
    containers.forEach((container) => {
        if (container.dataset.bound === "1") return; // 避免重複綁定
        container.dataset.bound = "1";

        const btn = container.querySelector(".copy-button");
        const codeEl = container.querySelector(".code-content");
        if (!btn || !codeEl) return;

        btn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(codeEl.textContent || "");
                btn.textContent = "已複製!";
                setTimeout(() => (btn.textContent = "複製"), 2000);
            } catch (e) {
                console.error(e);
                btn.textContent = "複製失敗";
                setTimeout(() => (btn.textContent = "複製"), 2000);
            }
        });
    });
}

/** 初始開場白（僅在空對話時插入一次） */
function displayInitialMessage() {
    if (chatBoxEl.children.length > 0) return;
    const initial = history.find((x) => x.role === "model")?.parts?.[0]?.text || "";
    if (!initial) return;
    const html = markdownToHtml(initial);
    chatBoxEl.innerHTML += `<p><b>小助手:</b> ${html}</p>`;
    chatBoxEl.scrollTop = chatBoxEl.scrollHeight;
    addCopyButtons();
}

/** 渲染一條訊息 */
function renderMessage(role, content, isError = false) {
    const who = role === "user" ? "你" : "小助手";
    let html;
    if (isError) {
        html = escapeHtml(content);
        chatBoxEl.innerHTML += `<p style="color:var(--accent-color);"><b>${who} (錯誤):</b> ${html}</p>`;
    } else if (role === "user") {
        html = escapeHtml(content);
        chatBoxEl.innerHTML += `<p><b>${who}:</b> ${html}</p>`;
    } else {
        html = markdownToHtml(content);
        chatBoxEl.innerHTML += `<p><b>${who}:</b> ${html}</p>`;
        addCopyButtons();
    }
    chatBoxEl.scrollTop = chatBoxEl.scrollHeight;
}

// =========================================================================
// IV. 與模型互動 (Core Logic)
// =========================================================================

async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    renderMessage("user", text);
    history.push({ role: "user", parts: [{ text }] });

    inputEl.value = "";
    inputEl.disabled = true;
    sendButtonEl.disabled = true;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: history }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(`API 失敗: ${res.status} ${res.statusText} - ${err?.error?.message || "未知錯誤"}`);
        }

        const data = await res.json();
        if (data.candidates?.length) {
            const c = data.candidates[0];
            const parts = c.content?.parts || [];
            const reply = parts.map((p) => p.text || "").join(" ").trim();

            if (reply) {
                history.push({ role: "model", parts: [{ text: reply }] });
                renderMessage("model", reply);
            } else {
                renderMessage("model", `回傳沒有文字或被過濾 (finishReason: ${c.finishReason || "未知"})`, true);
            }
        } else if (data.error) {
            renderMessage("model", `API 錯誤: ${data.error.message}`, true);
        } else {
            renderMessage("model", `API 回傳格式不正確或無候選回覆`, true);
        }
    } catch (e) {
        console.error(e);
        renderMessage("model", `請求失敗: ${e.message}`, true);
    } finally {
        inputEl.disabled = false;
        sendButtonEl.disabled = false;
        inputEl.focus();
    }
}

// =========================================================================
/* V. 事件綁定 (Event Listeners) */
// =========================================================================

chatToggleEl?.addEventListener("click", () => {
    const hidden = chatWidgetEl.style.display === "none" || chatWidgetEl.style.display === "";
    chatWidgetEl.style.display = hidden ? "block" : "none";
    if (hidden) {
        inputEl.focus();
        displayInitialMessage();
    }
});

sendButtonEl?.addEventListener("click", sendMessage);

inputEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
