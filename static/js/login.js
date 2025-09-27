/* ================================================================
   登入 UI Demo 互動（純前端 UI，尚未接任何驗證）
   ================================================================ */
const loginToggle = document.getElementById("login-toggle");
const loginModal = document.getElementById("login-modal");
const loginClose = document.getElementById("login-close");
const loginSubmit = document.getElementById("login-submit");
const loginUser = document.getElementById("login-username");
const loginPass = document.getElementById("login-password");
const quotesSec = document.getElementById("quotes-section");
const quotesImg = document.getElementById("quotes-img");

function openLoginModal() {
    loginModal?.classList.remove("hidden");
    setTimeout(() => loginUser?.focus(), 10);
}

function closeLoginModal() {
    loginModal?.classList.add("hidden");
}

function showQuotesSection() {
    if (quotesSec) {
        quotesSec.style.display = "";
    }
    // 之後接後端/加密解鎖時，這裡替換 quotesImg.src
    // 目前 Demo 保留佔位
}

loginToggle?.addEventListener("click", openLoginModal);
loginClose?.addEventListener("click", closeLoginModal);

// 點遮罩關閉
loginModal?.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("login-backdrop")) {
        closeLoginModal();
    }
});

// Esc 關閉
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !loginModal.classList.contains("hidden")) {
        closeLoginModal();
    }
});

// 提交（純 UI Demo，不驗證）
loginSubmit?.addEventListener("click", () => {
    closeLoginModal();
    showQuotesSection();
    if (loginToggle) loginToggle.textContent = "已登入";
});

// Enter 直接送出
loginPass?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        loginSubmit?.click();
    }
});
