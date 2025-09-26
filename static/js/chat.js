/**
 * static/js/chat.js
 * AI 聊天小助手的 JavaScript 邏輯
 */

// 配置參數
const API_KEY = "AIzaSyDo6isc-iR_Sv0XIznh4Tx7b8sn9pfKa6I";
const MODEL = "gemini-2.0-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

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

    // 1. 顯示使用者訊息
    chatBoxEl.innerHTML += `<p><b>你:</b> ${escapeHtml(text)}</p>`;
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
                contents: [{ role: "user", parts: [{ text }] }]
            })
        });

        const data = await res.json();

        // 2. 處理並顯示 AI 回覆
        if (data.candidates && data.candidates.length > 0) {
            const parts = data.candidates[0].content?.parts || [];
            let reply = parts.map(p => p.text || "").join(" ");
            reply = reply.trim();
            if (reply) {
                // 將換行符 \n 替換為 <br>
                chatBoxEl.innerHTML += `<p><b>小助手:</b> ${reply.replace(/\n/g, "<br>")}</p>`;
            } else {
                chatBoxEl.innerHTML += `<p style="color:var(--accent-color);"><b>錯誤:</b> 回傳沒有文字</p>`;
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