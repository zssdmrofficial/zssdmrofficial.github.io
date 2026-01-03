const quotesImages = [
    "static/images/張國語錄/封面.jpg",
    "static/images/張國語錄/內頁.jpg",
    "static/images/張國語錄/目錄.jpg",
    "static/images/張國語錄/1.jpg",
    "static/images/張國語錄/2.jpg",
    "static/images/張國語錄/3.jpg",
    "static/images/張國語錄/4.jpg",
    "static/images/張國語錄/5.jpg",
    "static/images/張國語錄/6.jpg",
    "static/images/張國語錄/7.jpg",
    "static/images/張國語錄/8.jpg",
    "static/images/張國語錄/9.jpg",
    "static/images/張國語錄/10.jpg",
    "static/images/張國語錄/11.jpg",
    "static/images/張國語錄/12.jpg",
    "static/images/張國語錄/13.jpg",
    "static/images/張國語錄/14.jpg",
    "static/images/張國語錄/15.jpg",
    "static/images/張國語錄/16.jpg",
    "static/images/張國語錄/17.jpg",
    "static/images/張國語錄/18.jpg",
    "static/images/張國語錄/19.jpg",
    "static/images/張國語錄/20.jpg",
    "static/images/張國語錄/21.jpg",
    "static/images/張國語錄/23.jpg",
    "static/images/張國語錄/24.jpg",
    "static/images/張國語錄/25.jpg",
    "static/images/張國語錄/版權頁.jpg",
    "static/images/張國語錄/封底.jpg"
];

let currentIndex = 0;
const container = document.getElementById("quotes-container");
const imageNodes = [];

function initImages() {
    if (!container) return;
    container.innerHTML = "";

    quotesImages.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.loading = "eager";
        img.alt = "張國語錄圖片";
        img.style.display = index === 0 ? "block" : "none";
        img.style.maxWidth = "100%";
        img.style.maxHeight = "100%";
        img.style.objectFit = "contain";
        img.style.borderRadius = "12px";

        container.appendChild(img);
        imageNodes.push(img);
    });

    updateIndicator();
}

function updateIndicator() {
    const parts = quotesImages[currentIndex].split("/");
    let filename = parts[parts.length - 1].replace(/\.(jpg|jpeg|png)$/i, "");
    const indicator = document.getElementById("page-indicator");
    if (indicator) indicator.textContent = filename;
}

function showImage(index) {
    if (index < 0 || index >= imageNodes.length) return;

    imageNodes[currentIndex].style.display = "none";
    currentIndex = index;
    imageNodes[currentIndex].style.display = "block";

    updateIndicator();
}

function showPrevImage() {
    if (currentIndex > 0) showImage(currentIndex - 1);
}

function showNextImage() {
    if (currentIndex < quotesImages.length - 1) showImage(currentIndex + 1);
}

initImages();

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showPrevImage();
    if (e.key === "ArrowRight") showNextImage();
});