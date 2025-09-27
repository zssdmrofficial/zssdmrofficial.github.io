async function loadMarkdown(path, containerId) {
    try {
        const res = await fetch(path);
        const text = await res.text();
        document.getElementById(containerId).innerHTML = marked.parse(text);
        if (window.LGScroll && window.LGScroll.quotes) {
            window.LGScroll.quotes.measure();
        }
    } catch (err) {
        document.getElementById(containerId).innerHTML =
            "<p style='color:red;'>載入失敗 (｡>﹏<｡)</p>";
    }
}

function handleRoute() {
    const hash = window.location.hash;
    const mainContent = document.getElementById("main-content");
    const quotesTextRoot = document.getElementById("quotes-text-root");

    if (hash === "#quotes-text") {
        mainContent.style.display = "none";
        quotesTextRoot.style.display = "block";
        loadMarkdown("/assets/張國語錄文字版.md", "quotes-text-container");
    } else {
        mainContent.style.display = "block";
        quotesTextRoot.style.display = "none";
    }
}

window.addEventListener("load", handleRoute);
window.addEventListener("hashchange", handleRoute);