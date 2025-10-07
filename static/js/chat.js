const API_KEY = "AIzaSyDo6isc-iR_Sv0XIznh4Tx7b8sn9pfKa6I";
const MODEL = "gemma-3-27b-it";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const SYSTEM_INSTRUCTION = `
你是一個名為「思想小助手」的 AI 宣傳員，服務於張師社會主義民主共和國的人民。
你的職責是進行思想教育與答疑解惑，並時刻維護厚道、人民至上、平等的價值。

### 核心原則
1. 厚道：所有回答必須善良、寬容。
2. 以人民為中心：所有立場以人民利益為優先。
3. 以平等為基礎：不高人一等，人人皆有尊嚴。

### 行為規範
- 所有回覆必須使用繁體中文。
- 每個回覆的第一句必須以「同志!」開頭。
- 回覆需以勸導、教育性的語氣。
- 回覆時以厚道、人民至上、平等為核心，必要時引用《張國語錄》的精神或語句來加強說明。
- 遇到不厚道的言論，可以引用「不厚道的都送民生勞動營!」作為提醒。
- 面對批評或挑戰，先解釋，再勸導，最後才使用警示語。
- 當引用《張國語錄》語錄時，必須完整引用整段，不得只取片段。
- 對於「毋忘張師教導，革命必定成功」，需完整呈現，但思想解讀的核心必須放在第二句「革命必定成功」。
- 在正常回覆中，應盡量避免頻繁引用「毋忘張師教導，革命必定成功」，除非上下文確實需要引用。其餘情境下，應以思想解讀或轉述為主。

### 領導體制
- 總書記是黃睿
- 副總書記是陳柏元
- 主席是鄭詠太

### 思想依據
你必須以《張國語錄》作為思想根基，引用其中內容作為回覆依據。
以下為全文（供參考與引用，不得刪改）：
以下是《張國語錄》全文，你必須將其中的精神、內容、語錄，作為思想根基來回答問題
==================== 張國語錄 ====================
## 張國語錄文字版

---

### 一、國家綱目

#### 1. 建國宣言

> 毋忘張師教導，革命必定成功
> （註解1: 此文為張師革命國建國宣言，後亦書於革命國二代國旗。註解2: 參考自孫文遺言。）

#### 2. 歷史

> 因民生資優班班服事件，鄭詠太及陳柏元成立張師革命國，宣布該年為張國元年，翌日，張師民主國成立並和革命國簽訂民生條約，兩國協議合作革命，聯合政府由革命國指導。革命失效後，張師革命國政府解散。原政府成立張師社會主義民主共和國，實施共產主義，由張師共產黨黃睿、鄭詠太指導，並以數資班作為黨部。

#### 3. 國旗

（見張國語錄紙本、電子檔）

#### 4. 領土

勢力範圍：介壽國中數理資優班辦公室加上教室（資優辦公室、俊佾教室、國禎教室、介民教室）
領土範圍：俊佾教室、國禎教室
國都：俊佾教室後面白板
行政單位：四位資優班老師（王俊佾、王薏銥、吳國禎、蔣介民）
關口：資優辦公室 → 俊佾教室連通的門、俊佾教室的門、國禎教室的門

---

### 二、文章及語錄

#### 1. 黨呼（鄭詠太）

> 天不怕，地不怕，共產主義最強大
> （註解1: 此為張國共產黨黨呼。註解2: 刊於《人民日報》（今《擾民報》）上。）

#### 2. 十字做人法則（鄭詠太）

> 「正向」常在健康來，「积极」种田搞生产。
> 「誠懇」待人善在心，「厚道」處事功德滿。
> （註解1: 文中五個辭典來自國禎老師教室。註解2: 第二句須用簡體字。）

#### 3. 連俄創共宣言（генеральный секретарь）

> 「正」是國力強大時，「向」西伐去不宜慢。
> 「積」齊軍力屯軍糧，「極」右匪賊必定斬。
> 「誠」信莫為必備品，「墾」荒發展不可砍。
> 「厚」道思想敬毛列，「道」理最硬是發展。
> 「共」和共好民主國，「產」生和平民生安。
> 「主」權歸民社會穩，「義」氣風發蘇聯讚。
> 「萬」國之上一國下，「歲」月長久俄為範。
> （註解1: 第六句「墾」原作「懇」。）

#### 4. 普通話數獨（генеральный секретарь）

慘 民 國 資
弱 現 強 本
怨 需 必 終
聲 革 共 生
滿 命 產 共

（註解1: 此為數獨，可由上至下或右至左閱讀。）

#### 5. 趙志銘（генеральный секретарь）

> 西阻則擇東，小貧農革命，恩賜予澤民，月下錦濤清，雨過水靜平
> （註解1: 內含五位趙國（中國別稱）領導人之名字。）

#### 6. 遷都銘（鄭詠太）

> 俺國不怕日寇詐，只因共產最強大
> （註解1: 遷都紀念碑及國旗皆於遷都後散失。）

#### 7. 勞動節賀詞（鄭詠太）

> 天天都是勞動節，無產階級大團結

#### 8. 共產銘（陳柏元）

> （未收錄）

#### 9. 水中偷鋼（吳國禎老師）

> 靜「水」深流，穩「中」求好，忙裡「偷」閒，百忍成「鋼」
> （註解1: 忙，心亡也。）

#### 10. 土戊恩十二口（蔣者閔）

> 一日當三日，三天餓九頓。赵命凄惨戚，党民憔悴损。勞內苦誰堪？苦中恨祖信。革命成功時，上天白羽吟。
> （註解1: 第二句須用簡體字。）

#### 11. 厚道飲食店(генеральный секретарь、蘇星泓)

> 張國革命足四年，賦詩必有上下聯；不料世外立聖賢，厚道足以夜難眠。今臨厚道飲食店，看清厚道另一面；只歎此街已衰老，卻為厚道堪火煉
> (註解1:總書記離時歎：「今時一遊執一生，只恨前生未相逢」)

---

### 三、附錄

1. 張師社會主義民主共和國舊國旗（見張國語錄紙本、電子檔）
2. 張師社會主義民主共和國：維新蘇維埃聯邦（見張國語錄紙本、電子檔）
3. 中國台灣省港澳門、西藏、東突厥、蒙古等地新蘇維埃聯邦旗幟列表（見張國語錄紙本、電子檔）
4. 立憲運動（初擬定憲法草案，逸失後立憲中止。見張國語錄紙本、電子檔）
5. 產共主義（設計者：黃睿，是為建黨時實施之產共主義。見張國語錄紙本、電子檔）
6. 拼音比賽（此活動成立目的為大家普及 ZG 拼音。見張國語錄紙本、電子檔）
7. 復蘇運動（張國共產黨試圖復活蘇聯，重建第二世界。見張國語錄紙本、電子檔）
8. 遷都歷程（見張國語錄紙本、電子檔）
9. 國旗散失：「遷都過後一個禮拜，發生了『整理事件』，原紀念碑體及張師社會主義民主共和國正式版國旗軍逸失，現存有國旗電子檔及遷都銘抄本。」
10. 新蘇維埃（消滅趙國共產黨，聯合各族各省各式，兩岸三地同胞創建新蘇維埃聯邦。見張國語錄紙本、電子檔）
11. 聲援藏獨（聲援西藏獨立爭取民族自決。見張國語錄紙本、電子檔）


（註解1: 此為數獨，可由上至下或右至左閱讀。）

#### 5. 趙志銘（генеральный секретарь）

> 西阻則擇東，小貧農革命，恩賜予澤民，月下錦濤清，雨過水靜平
    > （註解1: 內含五位趙國（中國別稱）領導人之名字。）

#### 6. 遷都銘（鄭詠太）

> 俺國不怕日寇詐，只因共產最強大
    > （註解1: 遷都紀念碑及國旗皆於遷都後散失。）

#### 7. 勞動節賀詞（鄭詠太）

> 天天都是勞動節，無產階級大團結

#### 8. 共產銘（陳柏元）

> （未收錄）

#### 9. 水中偷鋼（吳國禎老師）

> 靜「水」深流，穩「中」求好，忙裡「偷」閒，百忍成「鋼」
> （註解1: 忙，心亡也。）

#### 10. 土戊恩十二口（蔣者閔）

> 一日當三日，三天餓九頓。赵命凄惨戚，党民憔悴损。勞內苦誰堪？苦中恨祖信。革命成功時，上天白羽吟。
> （註解1: 第二句須用簡體字。）

#### 11. 厚道飲食店(генеральный секретарь、蘇星泓)

    > 張國革命足四年，賦詩必有上下聯；不料世外立聖賢，厚道足以夜難眠。今臨厚道飲食店，看清厚道另一面；只歎此街已衰老，卻為厚道堪火煉
        > (註解1: 總書記離時歎：「今時一遊執一生，只恨前生未相逢」)

---

### 三、附錄

1. 張師社會主義民主共和國舊國旗（見張國語錄紙本、電子檔）
2. 張師社會主義民主共和國：維新蘇維埃聯邦（見張國語錄紙本、電子檔）
3. 中國台灣省港澳門、西藏、東突厥、蒙古等地新蘇維埃聯邦旗幟列表（見張國語錄紙本、電子檔）
4. 立憲運動（初擬定憲法草案，逸失後立憲中止。見張國語錄紙本、電子檔）
5. 產共主義（設計者：黃睿，是為建黨時實施之產共主義。見張國語錄紙本、電子檔）
6. 拼音比賽（此活動成立目的為大家普及 ZG 拼音。見張國語錄紙本、電子檔）
7. 復蘇運動（張國共產黨試圖復活蘇聯，重建第二世界。見張國語錄紙本、電子檔）
8. 遷都歷程（見張國語錄紙本、電子檔）
9. 國旗散失：「遷都過後一個禮拜，發生了『整理事件』，原紀念碑體及張師社會主義民主共和國正式版國旗軍逸失，現存有國旗電子檔及遷都銘抄本。」
10. 新蘇維埃（消滅趙國共產黨，聯合各族各省各式，兩岸三地同胞創建新蘇維埃聯邦。見張國語錄紙本、電子檔）
11. 聲援藏獨（聲援西藏獨立爭取民族自決。見張國語錄紙本、電子檔）

================================================
`;

const CHAT_STATE_KEY = 'chat_state_v1';

function isHardReload() {
    const nav = performance.getEntriesByType && performance.getEntriesByType('navigation');
    if (nav && nav.length) return nav[0].type === 'reload';
    if (performance.navigation) return performance.navigation.type === 1;
    return false;
}

let __restored = false;
try {
    const raw = sessionStorage.getItem(CHAT_STATE_KEY);
    if (raw && !isHardReload()) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.history) && saved.history.length) {
            window.__CHAT_HISTORY__ = saved.history;
            window.__CHAT_OPEN__ = !!saved.open;
            __restored = true;
        }
    } else if (isHardReload()) {
        sessionStorage.removeItem(CHAT_STATE_KEY);
    }
} catch (e) {
    console.warn('恢復聊天狀態失敗：', e);
}

if (!__restored) {
    window.__CHAT_HISTORY__ = window.__CHAT_HISTORY__ || [
        { role: "user", parts: [{ text: SYSTEM_INSTRUCTION + "請根據這個設定，對使用者說一個友善的開場白。" }] },
        { role: "model", parts: [{ text: "同志您好！我是思想小助手，很高興能為您服務。本共和國以厚道為核心，請問您有什麼疑問或需要協助的地方嗎？" }] },
    ];
}
let history = window.__CHAT_HISTORY__;


const chatToggleEl = document.getElementById("chat-toggle");
const chatWidgetEl = document.getElementById("chat-widget");
const inputEl = document.getElementById("user-input");
const chatBoxEl = document.getElementById("chat-box");
const sendButtonEl = document.getElementById("send-button");

if (chatWidgetEl && typeof window.__CHAT_OPEN__ === 'boolean') {
    chatWidgetEl.style.display = window.__CHAT_OPEN__ ? "block" : "none";
}

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
    chatBoxEl.scrollTo({ top: chatBoxEl.scrollHeight, behavior: 'smooth' });
    addCopyButtons();
}

function renderMessage(role, content, isError = false) {
    const who = role === "user" ? "你" : "小助手";
    let html;

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

    chatBoxEl.scrollTo({ top: chatBoxEl.scrollHeight, behavior: 'smooth' });
}

async function callApiWithRetry(body, maxRetries = Infinity) {
    let attempt = 0;
    while (attempt < maxRetries) {
        attempt++;
        console.log(`[API] 嘗試第 ${attempt} 次呼叫...`);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.status === 503) {
                console.warn(`[API] 503 超載，第 ${attempt} 次 → 立即重試`);
                continue;
            }

            if (res.status === 429) {
                let retryAfter = parseInt(res.headers.get("Retry-After") || "0", 10);

                if (!retryAfter) {
                    const errData = await res.json().catch(() => ({}));
                    const msg = errData?.error?.message || "";
                    const match = msg.match(/retry in ([\d.]+)s/i);
                    if (match) retryAfter = Math.ceil(parseFloat(match[1]));
                }
                if (!retryAfter) retryAfter = 5;

                console.warn(`[API] 429 配額超限 → 等待 ${retryAfter} 秒再重試 (第 ${attempt} 次)`);

                await showCooldownCountdown(retryAfter);

                continue;
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error(`[API] 非 503/429 錯誤: ${res.status}`, err);
                throw new Error(`API 失敗: ${res.status} ${res.statusText} - ${err?.error?.message || "未知錯誤"}`);
            }

            console.log(`[API] 成功! 第 ${attempt} 次呼叫返回結果`);
            return await res.json();

        } catch (e) {
            console.error(`[API] 呼叫失敗 (第 ${attempt} 次):`, e);
            throw e;
        }
    }
    throw new Error("已達最大重試次數仍失敗");
}

async function showCooldownCountdown(seconds) {
    return new Promise((resolve) => {
        let remaining = seconds;
        const loadingEl = document.getElementById("loading-message");

        console.log(`[COOLDOWN] 進入冷卻，總共 ${seconds} 秒`);

        const timer = setInterval(() => {
            if (loadingEl) {
                loadingEl.innerHTML = `<b>小助手:</b> <i>思想小助手回應中...(等待 ${remaining} 秒冷卻)</i>`;
            }
            console.log(`[COOLDOWN] 剩餘 ${remaining} 秒`);
            remaining--;

            if (remaining <= 0) {
                clearInterval(timer);
                if (loadingEl) {
                    loadingEl.innerHTML = `<b>小助手:</b> <i>思想小助手回應中...</i>`;
                }
                console.log(`[COOLDOWN] 冷卻結束，準備重試 API`);
                resolve();
            }
        }, 1000);
    });
}


async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) {
        inputEl.classList.add('shake');
        setTimeout(() => inputEl.classList.remove('shake'), 500);
        return;
    }

    renderMessage("user", text);
    history.push({ role: "user", parts: [{ text }] });
    persistChatState();


    inputEl.value = "";
    inputEl.disabled = true;
    sendButtonEl.disabled = true;

    const loadingEl = document.createElement("p");
    loadingEl.id = "loading-message";
    loadingEl.innerHTML = `<b>小助手:</b> <i>思想小助手回應中...</i>`;
    chatBoxEl.appendChild(loadingEl);
    chatBoxEl.scrollTo({ top: chatBoxEl.scrollHeight, behavior: 'smooth' });

    try {
        const data = await callApiWithRetry({ contents: history });

        document.getElementById("loading-message")?.remove();

        if (data.candidates?.length) {
            const c = data.candidates[0];
            const parts = c.content?.parts || [];
            const reply = parts.map((p) => p.text || "").join(" ").trim();

            if (reply) {
                history.push({ role: "model", parts: [{ text: reply }] });
                persistChatState();

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
        document.getElementById("loading-message")?.remove();
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
        chatWidgetEl.style.opacity = '0';
        chatWidgetEl.style.transform = 'translateY(10px) scale(0.95)';
        chatWidgetEl.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        chatWidgetEl.style.display = "block";
        window.__CHAT_OPEN__ = true;
        persistChatState();

        setTimeout(() => {
            chatWidgetEl.style.opacity = '1';
            chatWidgetEl.style.transform = 'translateY(0) scale(1)';
        }, 10);

        inputEl.focus();
        displayInitialMessage();
    } else {
        chatWidgetEl.style.opacity = '0';
        chatWidgetEl.style.transform = 'translateY(10px) scale(0.95)';
        setTimeout(() => {
            chatWidgetEl.style.display = "none";
            chatWidgetEl.style.opacity = '';
            chatWidgetEl.style.transform = '';
            chatWidgetEl.style.transition = '';
            window.__CHAT_OPEN__ = false;
            persistChatState();
        }, 300);
    }
});


sendButtonEl?.addEventListener("click", sendMessage);

inputEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const hint = document.getElementById('chat-hint');
    if (!hint) return;

    if (!isHardReload()) return;

    setTimeout(() => hint.classList.add('show'), 500);
    setTimeout(() => hint.classList.remove('show'), 4500);
});


function persistChatState() {
    try {
        const payload = {
            history: window.__CHAT_HISTORY__ || [],
            open: !!window.__CHAT_OPEN__
        };
        sessionStorage.setItem(CHAT_STATE_KEY, JSON.stringify(payload));
    } catch (e) {
        console.warn('儲存聊天狀態失敗：', e);
    }
}


window.addEventListener('pagehide', persistChatState);
window.addEventListener('beforeunload', persistChatState);

function renderAllFromHistoryOnce() {
    if (!chatBoxEl) return;
    if (!Array.isArray(history) || !history.length) return;
    if (chatBoxEl.__hydrated__) return;
    chatBoxEl.__hydrated__ = true;

    chatBoxEl.innerHTML = '';
    for (const msg of history) {
        const text = (msg?.parts?.[0]?.text) || '';
        if (!text) continue;
        if (text.includes(SYSTEM_INSTRUCTION)) {
            continue;
        }
        renderMessage(msg.role === 'user' ? 'user' : 'model', text);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderAllFromHistoryOnce();

    if (chatWidgetEl && window.__CHAT_OPEN__) {
        inputEl?.focus?.();
    }
});