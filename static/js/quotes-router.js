async function loadMarkdown(path, containerId) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error("無法讀取 Markdown 檔案");
        const text = await res.text();
        document.getElementById(containerId).innerHTML = marked.parse(text);
    } catch (err) {
        document.getElementById(containerId).innerHTML =
            "<p style='color:red;'>載入失敗</p>";
    }
}

function handleRoute() {
    const hash = location.hash;
    const mainRoot = document.getElementById("main-content");
    const quotesRoot = document.getElementById("quotes-text-root");
    const flagRoot = document.getElementById("flag-root");

    if (!mainRoot) return;

    if (quotesRoot) quotesRoot.style.display = "none";
    if (flagRoot) flagRoot.style.display = "none";
    mainRoot.style.display = "none";

    if (hash === "#quotes-text" && quotesRoot) {
        quotesRoot.style.display = "block";
        loadMarkdown("/static/md/張國語錄文字版.md", "quotes-text-container");
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            quotesRoot.scrollTop = 0;
        });
    } else if (hash === "#flag" && flagRoot) {
        flagRoot.style.display = "block";
    } else {
        mainRoot.style.display = "block";
    }
}

window.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);