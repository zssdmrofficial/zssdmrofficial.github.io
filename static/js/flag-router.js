function handleFlagRoute() {
    const hash = location.hash;
    const mainRoot = document.getElementById("main-content");
    const quotesRoot = document.getElementById("quotes-text-root");
    const flagRoot = document.getElementById("flag-root");

    if (!flagRoot) {
        return;
    }

    if (hash === "#flag") {
        if (mainRoot) {
            mainRoot.style.display = "none";
        }
        if (quotesRoot) {
            quotesRoot.style.display = "none";
        }
        flagRoot.style.display = "block";
    } else {
        flagRoot.style.display = "none";
        if (mainRoot && hash !== "#quotes-text") {
            mainRoot.style.display = "block";
        }
    }
}

window.addEventListener("DOMContentLoaded", handleFlagRoute);
window.addEventListener("hashchange", handleFlagRoute);
