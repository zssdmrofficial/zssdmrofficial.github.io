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
const quotesImg = document.getElementById("quotes-img");

function showImage(index) {
    if (index < 0 || index >= quotesImages.length) return;
    currentIndex = index;
    quotesImg.src = quotesImages[currentIndex];

    const parts = quotesImages[currentIndex].split("/");
    let filename = parts[parts.length - 1].replace(/\.(jpg|jpeg|png)$/i, "");
    document.getElementById("page-indicator").textContent = filename;
}

function showPrevImage() {
    if (currentIndex > 0) showImage(currentIndex - 1);
}

function showNextImage() {
    if (currentIndex < quotesImages.length - 1) showImage(currentIndex + 1);
}

showImage(0);

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showPrevImage();
    if (e.key === "ArrowRight") showNextImage();
});
