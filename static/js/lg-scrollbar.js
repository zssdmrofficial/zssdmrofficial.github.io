/* 自製 Liquid Glass 虛擬捲動軸（主頁面專用，不影響聊天室） */
(function () {
    'use strict';

    const root = document.getElementById('lg-scroll-root');
    const content = document.getElementById('lg-scroll-content');
    const bar = document.querySelector('.lg-scrollbar');
    const track = document.querySelector('.lg-scrollbar-track');
    const thumb = document.querySelector('.lg-scrollbar-thumb');

    if (!root || !content || !bar || !track || !thumb) return;

    // 參數
    const MIN_THUMB = 32;           // 最小滑塊高度
    const WHEEL_STEP = 60;          // 基本滾輪步進
    const EASING = 0.18;            // 慣性係數
    const AUTO_HIDE_MS = 1600;      // 自動隱藏延遲

    // 狀態
    let viewportH = 0;
    let contentH = 0;
    let maxScroll = 0;
    let trackH = 0;
    let thumbH = 0;

    let scrollY = 0;
    let targetY = 0;

    let rafId = null;
    let lastActiveTs = 0;

    let dragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    function measure() {
        viewportH = root.clientHeight;
        contentH = content.scrollHeight;
        maxScroll = Math.max(0, contentH - viewportH);

        // 軌道實際高度（扣除內邊距等）
        trackH = track.clientHeight;

        // 計算滑塊高度（與可視比例成正比）
        const ratio = viewportH / Math.max(1, contentH);
        thumbH = Math.max(MIN_THUMB, Math.round(trackH * ratio));
        thumb.style.height = thumbH + 'px';

        // 若內容高度不足以捲動，隱藏捲動軸
        bar.classList.toggle('lg-hidden', maxScroll <= 1);
        updateThumb();
    }

    function applyScrollImmediate(next) {
        scrollY = clamp(next, 0, maxScroll);
        content.style.transform = `translate3d(0, ${-scrollY}px, 0)`;
        updateThumb();
    }

    function updateThumb() {
        const range = Math.max(1, trackH - thumbH);
        const t = (range * (scrollY / Math.max(1, maxScroll)));
        thumb.style.transform = `translateY(${t}px)`;
    }

    function animate() {
        if (prefersReducedMotion) {
            applyScrollImmediate(targetY);
            stopRAF();
            maybeAutoHideSoon();
            return;
        }
        const diff = targetY - scrollY;
        if (Math.abs(diff) < 0.5) {
            applyScrollImmediate(targetY);
            stopRAF();
            maybeAutoHideSoon();
            return;
        }
        applyScrollImmediate(scrollY + diff * EASING);
        rafId = requestAnimationFrame(animate);
    }

    function startRAF() {
        if (!rafId) rafId = requestAnimationFrame(animate);
    }

    function stopRAF() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function setTarget(y) {
        targetY = clamp(y, 0, maxScroll);
        lastActiveTs = performance.now();
        bar.classList.add('lg-visible');
        startRAF();
    }

    function maybeAutoHideSoon() {
        const now = performance.now();
        const left = AUTO_HIDE_MS - (now - lastActiveTs);
        if (left <= 0) {
            bar.classList.remove('lg-visible');
            return;
        }
        setTimeout(() => {
            const nnow = performance.now();
            if (nnow - lastActiveTs >= AUTO_HIDE_MS) {
                bar.classList.remove('lg-visible');
            }
        }, Math.ceil(left) + 10);
    }

    // === 事件 ===
    // 滾輪
    root.addEventListener('wheel', (e) => {
        e.preventDefault(); // 阻止瀏覽器原生捲動
        const delta = (e.deltaY || 0);
        // Ctrl 加速
        const base = e.ctrlKey ? WHEEL_STEP * 3 : WHEEL_STEP;
        const step = base * Math.max(1, Math.min(3, Math.abs(delta) / 100));
        setTarget(targetY + (delta > 0 ? step : -step));
    }, { passive: false });

    // 鍵盤
    window.addEventListener('keydown', (e) => {
        // 輸入框內不攔截
        const ae = document.activeElement;
        if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;

        let handled = true;
        switch (e.key) {
            case 'ArrowDown': setTarget(targetY + WHEEL_STEP); break;
            case 'ArrowUp': setTarget(targetY - WHEEL_STEP); break;
            case 'PageDown': setTarget(targetY + viewportH * 0.9); break;
            case 'PageUp': setTarget(targetY - viewportH * 0.9); break;
            case 'Home': setTarget(0); break;
            case 'End': setTarget(maxScroll); break;
            default: handled = false;
        }
        if (handled) e.preventDefault();
    }, { passive: false });

    // 觸控
    let touchStartY = 0;
    let touchStartScroll = 0;
    root.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        touchStartY = e.touches[0].clientY;
        touchStartScroll = targetY;
        bar.classList.add('lg-visible');
    }, { passive: true });

    root.addEventListener('touchmove', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        const dy = touchStartY - e.touches[0].clientY;
        setTarget(touchStartScroll + dy);
    }, { passive: true });

    // 軌道點擊（點到空白處＝翻頁）
    track.addEventListener('mousedown', (e) => {
        if (e.target === thumb) return; // 交給拖曳處理
        const rect = track.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const thumbRect = thumb.getBoundingClientRect();
        const insideThumb = (e.clientY >= thumbRect.top && e.clientY <= thumbRect.bottom);
        if (insideThumb) return;

        if (y < thumbRect.top - rect.top) {
            setTarget(targetY - viewportH * 0.9);
        } else {
            setTarget(targetY + viewportH * 0.9);
        }
        e.preventDefault();
    });

    // 滑塊拖曳
    thumb.addEventListener('mousedown', (e) => {
        dragging = true;
        dragStartY = e.clientY;
        dragStartScroll = scrollY;
        bar.classList.add('lg-visible');
        document.documentElement.classList.add('lg-dragging');
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dy = e.clientY - dragStartY;
        const range = Math.max(1, trackH - thumbH);
        const ratio = dy / range;
        setTarget(dragStartScroll + ratio * maxScroll);
    });

    window.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        document.documentElement.classList.remove('lg-dragging');
        maybeAutoHideSoon();
    });

    // 尺寸改變/內容變動
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(content);

    // 讓聊天室自己的滾動不干擾主頁（保守處理）
    const chatWidget = document.getElementById('chat-widget');
    if (chatWidget) {
        chatWidget.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
        chatWidget.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
    }

    // 初始化
    measure();
    applyScrollImmediate(0);
    maybeAutoHideSoon();
})();
