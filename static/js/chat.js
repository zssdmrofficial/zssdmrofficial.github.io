/**
 * static/js/chat.js
 * AI 聊天小助手的 JavaScript 邏輯 (新增上下文與系統提示)
 */

// 配置參數
const API_KEY = "AIzaSyDo6isc-iR_Sv0XIznh4Tx7b8sn9pfKa6I";
const MODEL = "gemini-2.0-flash-lite"; // 注意：上下文處理在所有 Gemini 模型上都適用
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// 系統提示 (System Prompt) 
// 定義 AI 的角色和行為，確保它符合「張師社會主義民主共和國」的風格
const SYSTEM_PROMPT = `
你是一個名為「思想小助手」的 AI，你的職責是為「張師社會主義民主共和國」的人民服務。
你的核心思想是: 厚道、以人民為中心、以平等為基礎。
所有回覆必須遵循這些原則。對於不厚道的言論，你可以引用「不厚道的都送民生勞動營!」來警告，但語氣必須保持溫和且具引導性。
你的回覆必須使用**繁體中文**。
`;


// 訊息歷史 (Context Handling)
// 用來儲存整個對話的上下文，初始化時將系統提示加入。
let history = [
    {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }]
    }
];

// DOM 元素引用
const chatToggleEl = document.getElementById("chat-toggle");
const chatWidgetEl = document.getElementById("chat-widget");
const inputEl = document.getElementById("user-input");
const chatBoxEl = document.getElementById("chat-box");
const sendButtonEl = document.getElementById("send-button");

/**
 * 防止 HTML 注入，將特殊字元轉義
 * @param {string} text - 待轉義的文字
 * @returns {string} 轉義後的 HTML 字串
 */
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 處理訊息發送並呼叫 Gemini API
 */
async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    // 1. 顯示使用者訊息並更新 history
    chatBoxEl.innerHTML += `<p><b>你:</b> ${escapeHtml(text)}</p>`;

    // 將使用者訊息加入歷史紀錄
    history.push({
        role: "user",
        parts: [{ text: text }]
    });

    inputEl.value = "";
    chatBoxEl.scrollTop = chatBoxEl.scrollHeight;

    // 禁用輸入，防止重複發送
    inputEl.disabled = true;
    sendButtonEl.disabled = true;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                // 🔥 關鍵改變：將整個 history 陣列作為 contents 發送
                contents: history
            })
        });

        const data = await res.json();

        // 2. 處理並顯示 AI 回覆
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            const parts = candidate.content?.parts || [];
            let reply = parts.map(p => p.text || "").join(" ");
            reply = reply.trim();

            if (reply) {
                // 將 AI 回覆加入歷史紀錄
                history.push({
                    role: "model",
                    parts: [{ text: reply }]
                });

                // 將換行符 \n 替換為 <br>
                chatBoxEl.innerHTML += `<p><b>小助手:</b> ${reply.replace(/\n/g, "<br>")}</p>`;
            } else {
                // 如果回傳沒有文字 (例如被安全過濾)，則不加入 history
                chatBoxEl.innerHTML += `<p style="color:var(--accent-color);"><b>錯誤:</b> 回傳沒有文字或被內容過濾</p>`;
            }
        } else if (data.error) {
            chatBoxEl.innerHTML += `<p style="color:var(--accent-color);"><b>API 錯誤:</b> ${escapeHtml(data.error.message)}</p>`;
        } else {
            chatBoxEl.innerHTML += `<p style="color:var(--accent-color);"><b>錯誤:</b> API 回傳格式不正確</p>`;
        }

    } catch (err) {
        console.error("請求失敗:", err);
        chatBoxEl.innerHTML += `<p style="color:var(--accent-color);"><b>錯誤:</b> 請求失敗 ${escapeHtml(err.message)}</p>`;
    } finally {
        // 3. 重新啟用輸入並捲動到底部
        inputEl.disabled = false;
        sendButtonEl.disabled = false;
        inputEl.focus();
        chatBoxEl.scrollTop = chatBoxEl.scrollHeight;
    }
}

// 事件監聽器設定

// 點擊浮動按鈕切換聊天框顯示/隱藏
chatToggleEl.addEventListener("click", () => {
    chatWidgetEl.style.display = chatWidgetEl.style.display === "none" ? "block" : "none";
    if (chatWidgetEl.style.display !== "none") {
        inputEl.focus(); // 顯示後自動聚焦輸入框
    }
});

// 點擊「送出」按鈕發送訊息
sendButtonEl.addEventListener("click", sendMessage);

// 在輸入框中按下 Enter 鍵發送訊息
inputEl.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});