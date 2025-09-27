/* ================================================================
   登入 UI + 電子書模式 (逐頁顯示)
   ================================================================ */
const loginToggle = document.getElementById("login-toggle");
const loginModal = document.getElementById("login-modal");
const loginClose = document.getElementById("login-close");
const loginSubmit = document.getElementById("login-submit");
const loginUser = document.getElementById("login-username");
const loginPass = document.getElementById("login-password");
const quotesSec = document.getElementById("quotes-section");
const quotesImg = document.getElementById("quotes-img");

// === 電子書圖片清單 ===
const quotesImages = [
    "static/images/張國語錄/封面.jpg",
    "static/images/張國語錄/內頁.jpg",
    "static/images/張國語錄/目錄+1.jpg",
    "static/images/張國語錄/2-3.jpg",
    "static/images/張國語錄/4-5.jpg",
    "static/images/張國語錄/6-7.jpg",
    "static/images/張國語錄/8-9.jpg",
    "static/images/張國語錄/10-11.jpg",
    "static/images/張國語錄/12-13.jpg",
    "static/images/張國語錄/14-15.jpg",
    "static/images/張國語錄/16-17.jpg",
    "static/images/張國語錄/18-19.jpg",
    "static/images/張國語錄/20-21.jpg",
    "static/images/張國語錄/23-24.jpg",
    "static/images/張國語錄/25-26.jpg",
    "static/images/張國語錄/版權頁.jpg",
    "static/images/張國語錄/封底.jpg",
];

let currentIndex = 0;

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
    showImage(0); // 預設顯示第一頁
}

function showImage(index) {
    if (index < 0 || index >= quotesImages.length) return;
    currentIndex = index;
    quotesImg.src = quotesImages[currentIndex];
    quotesImg.style.display = "block";

    // 更新頁碼
    const pageIndicator = document.getElementById("page-indicator");
    if (pageIndicator) {
        pageIndicator.textContent = `第 ${currentIndex + 1} 頁 / 共 ${quotesImages.length} 頁`;
    }
}

// 切換上一頁 / 下一頁
function showPrevImage() {
    if (currentIndex > 0) {
        showImage(currentIndex - 1);
    }
}
function showNextImage() {
    if (currentIndex < quotesImages.length - 1) {
        showImage(currentIndex + 1);
    }
}

// === 綁定事件 ===
loginToggle?.addEventListener("click", openLoginModal);
loginClose?.addEventListener("click", closeLoginModal);

loginModal?.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("login-backdrop")) {
        closeLoginModal();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !loginModal.classList.contains("hidden")) {
        closeLoginModal();
    }
});

loginSubmit?.addEventListener("click", () => {
    closeLoginModal();
    showQuotesSection();
    if (loginToggle) loginToggle.textContent = "已登入";
});

loginPass?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        loginSubmit?.click();
    }
});

// === 新增：鍵盤 ← → 翻頁 ===
window.addEventListener("keydown", (e) => {
    if (quotesSec && quotesSec.style.display !== "none") {
        if (e.key === "ArrowLeft") showPrevImage();
        if (e.key === "ArrowRight") showNextImage();
    }
});
