// 載入 Markdown 並渲染至指定容器
async function loadMarkdown(path, containerId) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error("無法讀取 Markdown 檔案");
        const text = await res.text();
        document.getElementById(containerId).innerHTML = marked.parse(text);
        // 若有 LGScroll（你的自訂捲動效果）則重新測量
        if (window.LGScroll && window.LGScroll.quotes) {
            window.LGScroll.quotes.measure();
        }
    } catch (err) {
        document.getElementById(containerId).innerHTML =
            "<p style='color:red;'>載入失敗</p>";
    }
}

// 通用路由控制：統一檢測 hash 並顯示相對應區塊
function handleRoute() {
    const hash = location.hash;
    const mainRoot = document.getElementById("main-content");
    const quotesRoot = document.getElementById("quotes-text-root");
    const flagRoot = document.getElementById("flag-root");

    // 若主體不存在就不執行（防呆）
    if (!mainRoot) return;

    // 預設全部隱藏
    if (quotesRoot) quotesRoot.style.display = "none";
    if (flagRoot) flagRoot.style.display = "none";
    mainRoot.style.display = "none";

    // 根據 hash 顯示正確頁面
    if (hash === "#quotes-text" && quotesRoot) {
        quotesRoot.style.display = "block";
        loadMarkdown("/assets/張國語錄文字版.md", "quotes-text-container");
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

// 等 HTML 結構載入完畢就初始化（不必等圖片）
window.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);
