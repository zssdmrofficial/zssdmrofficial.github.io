const API_KEY = "AIzaSyDo6isc-iR_Sv0XIznh4Tx7b8sn9pfKa6I";
const MODEL = "gemini-2.0-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const SYSTEM_INSTRUCTION = `
你是一個名為「思想小助手」的 AI，你的職責是為「張師社會主義民主共和國」的人民服務。
你的核心思想是: **厚道**、**以人民為中心**、**以平等為基礎**。
所有回覆必須遵循這些原則。對於不厚道的言論，你可以引用「不厚道的都送民生勞動營!」來警告，但語氣必須保持溫和且具引導性。你的回覆必須使用**繁體中文**。
`;

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

const chatToggleEl = document.getElementById("chat-toggle");
const chatWidgetEl = document.getElementById("chat-widget");
const inputEl = document.getElementById("user-input");
const chatBoxEl = document.getElementById("chat-box");
const sendButtonEl = document.getElementById("send-button");

function escapeHtml(text) {
    if (typeof text !== "string") return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function markdownToHtml(mdText) {
    if (typeof mdText !== "string") return "";

    const codeBlocks = [];
    let idx = 0;

    let htmlText = mdText.replace(/```([^\n`]*)\r?\n([\s\S]*?)\r?\n?```/g, (_match, lang, body) => {
        const key = `§§CODEBLOCK:${idx++}:${Math.random().toString(36).slice(2, 8)}§§`;
        codeBlocks.push({
            key,
            lang: (lang || "").trim(),
            code: body.replace(/\s+$/, ""),
        });
        return key;
    });

    htmlText = htmlText.replace(/`([^`]+)`/g, (_m, code) => `<code class="inline-code">${escapeHtml(code)}</code>`);

    htmlText = htmlText.replace(/\*\*(.*?)\*\*|__(.*?)__/g, (_m, g1, g2) => `<b>${escapeHtml(g1 || g2 || "")}</b>`);

    htmlText = htmlText.replace(/\*(.*?)\*|_(.*?)_/g, (_m, g1, g2) => `<i>${escapeHtml(g1 || g2 || "")}</i>`);

    htmlText = htmlText.replace(
        /\[([^\]]+)\]\(([^)\s]+)\)/g,
        (_m, label, url) =>
            `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
    );

    htmlText = htmlText.replace(/(?:^|\r?\n)([-*+]\s+.+(?:\r?\n[-*+]\s+.+)*)/g, (block) => {
        const items = block
            .trim()
            .split(/\r?\n/)
            .map((line) => `<li>${escapeHtml(line.replace(/^[-*+]\s+/, ""))}</li>`)
            .join("");
        return `\n<ul>${items}</ul>`;
    });

    htmlText = htmlText.replace(/\r?\n/g, "<br>");

    for (const { key, lang, code } of codeBlocks) {
        const blockHtml =
            `<div class="code-container">` +
            `<button type="button" class="copy-button">複製</button>` +
            `<pre><code class="code-content"${lang ? ` data-lang="${escapeHtml(lang)}"` : ""}>${escapeHtml(code)}</code></pre>` +
            `</div>`;

        htmlText = htmlText.split(key).join(blockHtml);
    }

    htmlText = htmlText.replace(/<br>\s*(<div class="code-container")/g, "$1");
    htmlText = htmlText.replace(/(<\/div>)\s*<br>/g, "$1");

    return htmlText;
}

function addCopyButtons() {
    const containers = chatBoxEl.querySelectorAll(".code-container");
    containers.forEach((container) => {
        if (container.dataset.bound === "1") return;
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

function displayInitialMessage() {
    if (chatBoxEl.children.length > 0) return;
    const initial = history.find((x) => x.role === "model")?.parts?.[0]?.text || "";
    if (!initial) return;
    const html = markdownToHtml(initial);
    chatBoxEl.innerHTML += `<p><b>小助手:</b> ${html}</p>`;
    // 使用平滑滾動
    chatBoxEl.scrollTo({ top: chatBoxEl.scrollHeight, behavior: 'smooth' });
    addCopyButtons();
}

function renderMessage(role, content, isError = false) {
    const who = role === "user" ? "你" : "小助手";
    let html;

    // 創建新的 p 元素
    const messageEl = document.createElement('p');

    if (isError) {
        html = escapeHtml(content);
        messageEl.style.color = "var(--accent-color)";
        messageEl.innerHTML = `<b>${who} (錯誤):</b> ${html}`;
    } else if (role === "user") {
        html = escapeHtml(content);
        messageEl.innerHTML = `<b>${who}:</b> ${html}`;
    } else {
        html = markdownToHtml(content);
        messageEl.innerHTML = `<b>${who}:</b> ${html}`;
        addCopyButtons();
    }

    chatBoxEl.appendChild(messageEl);

    // 使用平滑滾動確保看到最新訊息
    chatBoxEl.scrollTo({ top: chatBoxEl.scrollHeight, behavior: 'smooth' });
}

async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) {
        // 沒有輸入文字時，加入震動動畫
        inputEl.classList.add('shake');
        setTimeout(() => inputEl.classList.remove('shake'), 500);
        return;
    }

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

chatToggleEl?.addEventListener("click", () => {
    const isHidden = chatWidgetEl.style.display === "none" || chatWidgetEl.style.display === "";

    if (isHidden) {
        // 顯示時加入淡入和微移效果
        chatWidgetEl.style.opacity = '0';
        chatWidgetEl.style.transform = 'translateY(10px) scale(0.95)';
        chatWidgetEl.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        chatWidgetEl.style.display = "block";
        setTimeout(() => {
            chatWidgetEl.style.opacity = '1';
            chatWidgetEl.style.transform = 'translateY(0) scale(1)';
        }, 10); // 讓瀏覽器先渲染 display: block

        inputEl.focus();
        displayInitialMessage();
    } else {
        // 隱藏時加入淡出和微移效果
        chatWidgetEl.style.opacity = '0';
        chatWidgetEl.style.transform = 'translateY(10px) scale(0.95)';
        setTimeout(() => {
            chatWidgetEl.style.display = "none";
            // 重置樣式以備下次打開
            chatWidgetEl.style.opacity = '';
            chatWidgetEl.style.transform = '';
            chatWidgetEl.style.transition = '';
        }, 300); // 等待淡出動畫完成
    }
});

sendButtonEl?.addEventListener("click", sendMessage);

inputEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});