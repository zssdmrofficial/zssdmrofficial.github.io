window.addEventListener("hashchange", () => {
    const mainRoot = document.getElementById("lg-scroll-root");
    const quotesRoot = document.getElementById("quotes-text-root");
    const flagRoot = document.getElementById("flag-root");

    if (location.hash === "#flag") {
        mainRoot.style.display = "none";
        quotesRoot.style.display = "none";
        flagRoot.style.display = "block";
    } else {
        flagRoot.style.display = "none";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    if (location.hash === "#flag") {
        document.getElementById("lg-scroll-root").style.display = "none";
        document.getElementById("quotes-text-root").style.display = "none";
        document.getElementById("flag-root").style.display = "block";
    }
});