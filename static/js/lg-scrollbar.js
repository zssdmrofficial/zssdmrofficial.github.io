/* 自製 Liquid Glass 虛擬捲動軸（可重複實例：主頁面 + 聊天室 + 張國語錄文字版） */
/* 版本 2.0.0 - 使用 Class 結構重構，同時保持舊有 API 相容性 */
(function () {
    'use strict';

    /**
     * ----------------------------------------------------
     * Liquid Glass 自製捲動軸 (LGScroll Class 核心)
     * ----------------------------------------------------
     * 核心原理: 禁用原生滾動，透過 requestAnimationFrame 
     * 使用 CSS transform 實現平滑滾動。
     * @class LGScroll
     */
    class LGScroll {
        /**
         * @param {object} opts - 選項
         * @param {HTMLElement} opts.root - 滾動的根容器 (viewport)
         * @param {HTMLElement} opts.content - 滾動的內容元素
         * @param {HTMLElement} opts.bar - 整個滾動條容器
         * @param {HTMLElement} opts.track - 滾動條軌道
         * @param {HTMLElement} opts.thumb - 滾動條把手
         * @param {boolean} [opts.stopBubbleOnWheel=false] - 滾動到底/頂時是否阻止事件冒泡
         * @param {number} [opts.minThumb=32] - 把手最小高度 (px)
         * @param {number} [opts.wheelStep=60] - 滾輪滾動一次的距離 (px)
         * @param {number} [opts.easing=0.18] - 滾動平滑動畫的緩動係數 (0-1)
         * @param {number} [opts.autoHideMs=1600] - 停止活動後自動隱藏滾動條的延遲 (ms)
         */
        constructor(opts) {
            this.root = opts.root;
            this.content = opts.content;
            this.bar = opts.bar;
            this.track = opts.track;
            this.thumb = opts.thumb;

            // 設定
            this.stopBubbleOnWheel = opts.stopBubbleOnWheel || false;
            this.minThumb = opts.minThumb || 32;
            this.wheelStep = opts.wheelStep || 60;
            this.easing = opts.easing || 0.18;
            this.autoHideMs = opts.autoHideMs || 1600;

            // 內部狀態
            this.viewportH = 0; this.contentH = 0; this.maxScroll = 0;
            this.trackH = 0; this.thumbH = 0;
            this.scrollY = 0; this.targetY = 0;
            this.rafId = null; this.lastActiveTs = 0;
            this.dragging = false; this.dragStartY = 0; this.dragStartScroll = 0;

            this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            this.bindEvents();
            this.measure();
            this.maybeAutoHideSoon();
        }

        clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

        measure = () => {
            this.viewportH = this.root.clientHeight;
            this.contentH = this.content.scrollHeight;
            this.maxScroll = Math.max(0, this.contentH - this.viewportH);
            this.trackH = this.track.clientHeight;

            const ratio = this.viewportH / Math.max(1, this.contentH);
            this.thumbH = this.clamp(this.minThumb, Math.round(this.trackH * ratio), this.trackH);
            this.thumb.style.height = this.thumbH + 'px';

            this.bar.classList.toggle('lg-hidden', this.maxScroll <= 1);

            this.setTarget(this.targetY, true); // 校正位置
            this.updateThumb();
        }

        updateThumb() {
            if (this.maxScroll <= 0) return;
            const range = this.trackH - this.thumbH;
            const thumbPos = (range * (this.scrollY / this.maxScroll));
            this.thumb.style.transform = `translateY(${thumbPos}px)`;
        }

        applyScrollImmediate(next) {
            this.scrollY = this.clamp(next, 0, this.maxScroll);
            this.content.style.transform = `translate3d(0, ${-this.scrollY}px, 0)`;
            this.updateThumb();
        }

        setTarget(y, immediate = false) {
            this.targetY = this.clamp(y, 0, this.maxScroll);

            if (immediate || this.prefersReducedMotion) {
                this.applyScrollImmediate(this.targetY);
                this.stopRAF();
                this.maybeAutoHideSoon();
            } else {
                this.lastActiveTs = performance.now();
                this.bar.classList.add('lg-visible');
                this.startRAF();
            }
        }

        animate = () => {
            const diff = this.targetY - this.scrollY;
            if (Math.abs(diff) < 0.5) {
                this.applyScrollImmediate(this.targetY);
                this.stopRAF();
                this.maybeAutoHideSoon();
                return;
            }
            this.applyScrollImmediate(this.scrollY + diff * this.easing);
            this.rafId = requestAnimationFrame(this.animate);
        }

        startRAF() { if (!this.rafId) this.rafId = requestAnimationFrame(this.animate); }
        stopRAF() {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        }

        maybeAutoHideSoon() {
            if (this.dragging) return;
            const now = performance.now();
            const timeSinceActive = now - this.lastActiveTs;

            if (timeSinceActive >= this.autoHideMs) {
                this.bar.classList.remove('lg-visible');
            } else {
                setTimeout(() => {
                    if (!this.dragging && performance.now() - this.lastActiveTs >= this.autoHideMs) {
                        this.bar.classList.remove('lg-visible');
                    }
                }, this.autoHideMs - timeSinceActive + 10);
            }
        }

        handleWheel = (e) => {
            e.preventDefault();
            if (this.stopBubbleOnWheel) e.stopPropagation();
            const delta = (e.deltaY || 0);
            const base = e.ctrlKey ? this.wheelStep * 3 : this.wheelStep;
            const step = base * Math.max(1, Math.min(3, Math.abs(delta) / 100));
            this.setTarget(this.targetY + (delta > 0 ? step : -step));
        }

        handleKeyDown = (e) => {
            const ae = document.activeElement;
            if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;
            if (!this.root.matches(':hover')) return;

            let handled = true;
            switch (e.key) {
                case 'ArrowDown': this.setTarget(this.targetY + this.wheelStep); break;
                case 'ArrowUp': this.setTarget(this.targetY - this.wheelStep); break;
                case 'PageDown': this.setTarget(this.targetY + this.viewportH * 0.9); break;
                case 'PageUp': this.setTarget(this.targetY - this.viewportH * 0.9); break;
                case 'Home': this.setTarget(0); break;
                case 'End': this.setTarget(this.maxScroll); break;
                default: handled = false;
            }
            if (handled) e.preventDefault();
        }

        handleThumbMousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dragging = true;
            this.dragStartY = e.clientY;
            this.dragStartScroll = this.scrollY;
            this.bar.classList.add('lg-visible');
            document.documentElement.classList.add('lg-dragging');
        }

        handleWindowMousemove = (e) => {
            if (!this.dragging) return;
            const dy = e.clientY - this.dragStartY;
            const range = Math.max(1, this.trackH - this.thumbH);
            const scrollDelta = (dy / range) * this.maxScroll;
            this.setTarget(this.dragStartScroll + scrollDelta, true); // 拖曳時立即更新
        }

        handleWindowMouseup = () => {
            if (!this.dragging) return;
            this.dragging = false;
            document.documentElement.classList.remove('lg-dragging');
            this.maybeAutoHideSoon();
        }

        handleTrackMousedown = (e) => {
            if (e.target === this.thumb) return;
            e.preventDefault();
            const rect = this.track.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const thumbHalf = this.thumbH / 2;
            const targetThumbY = clickY - thumbHalf;
            const scrollRatio = targetThumbY / (this.trackH - this.thumbH);
            this.setTarget(this.maxScroll * scrollRatio);
        }

        bindEvents() {
            this.root.addEventListener('wheel', this.handleWheel, { passive: false });
            window.addEventListener('keydown', this.handleKeyDown, { passive: false });
            this.thumb.addEventListener('mousedown', this.handleThumbMousedown);
            this.track.addEventListener('mousedown', this.handleTrackMousedown);
            window.addEventListener('mousemove', this.handleWindowMousemove);
            window.addEventListener('mouseup', this.handleWindowMouseup);

            this.ro = new ResizeObserver(this.measure);
            this.ro.observe(this.content);
            this.ro.observe(this.root); // 也觀察根容器尺寸變化
        }

        teardown() {
            this.stopRAF();
            this.root.removeEventListener('wheel', this.handleWheel);
            window.removeEventListener('keydown', this.handleKeyDown);
            this.thumb.removeEventListener('mousedown', this.handleThumbMousedown);
            this.track.removeEventListener('mousedown', this.handleTrackMousedown);
            window.removeEventListener('mousemove', this.handleWindowMousemove);
            window.removeEventListener('mouseup', this.handleWindowMouseup);
            this.ro.disconnect();
            this.ro = null;
        }

        // --- Public API ---
        scrollTo(y) { this.setTarget(y); }
        scrollToEnd() {
            this.measure(); // 滾動到底部前先重新測量，確保捕捉到最新高度
            this.setTarget(this.maxScroll, this.prefersReducedMotion);
        }
    }


    /**
     * 建立一個可重複使用的虛擬捲動實例 (相容舊版的工廠函式)
     * @param {Object} opts
     * @param {HTMLElement} opts.root      － 滾動視窗（固定尺寸／裁切區）
     * @param {HTMLElement} opts.content   － 內容容器（實際位移 transform）
     * @param {HTMLElement} opts.bar       － 捲動軸外框（含 track + thumb）
     * @param {HTMLElement} opts.track     － 捲動軌道
     * @param {HTMLElement} opts.thumb     － 捲動滑塊
     * @param {boolean}     opts.stopBubbleOnWheel － 是否攔截滾輪冒泡（避免影響外層）
     */
    function createLGScroll(opts) {
        // 檢查必要的 DOM 元素是否存在
        if (!opts.root || !opts.content || !opts.bar || !opts.track || !opts.thumb) {
            return null;
        }

        const scrollInstance = new LGScroll(opts);

        // 回傳一個與舊版 API 完全相容的物件，內部代理到 Class 實例的方法
        return {
            measure: scrollInstance.measure,
            scrollTo: (y) => scrollInstance.scrollTo(y),
            scrollToEnd: () => scrollInstance.scrollToEnd(),
            getMaxScroll: () => scrollInstance.maxScroll,
            getScrollY: () => scrollInstance.scrollY,
            teardown: () => scrollInstance.teardown(),
        };
    }

    // ======================================================================
    // ==== 以下實例化程式碼與 old-scrollbar.js 完全相同，無需任何修改 ====
    // ======================================================================

    // ==== 主頁面實例 ====
    const main = createLGScroll({
        root: document.getElementById('lg-scroll-root'),
        content: document.getElementById('lg-scroll-content'),
        bar: document.querySelector('.lg-scrollbar:not(.lg-scrollbar--chat)'),
        track: document.querySelector('.lg-scrollbar:not(.lg-scrollbar--chat) .lg-scrollbar-track'),
        thumb: document.querySelector('.lg-scrollbar:not(.lg-scrollbar--chat) .lg-scrollbar-thumb'),
        stopBubbleOnWheel: false,
    });

    // ==== 聊天室實例 (已修正) ====
    const chatRoot = document.getElementById('chat-scroll-root');
    const chat = createLGScroll({
        root: chatRoot,
        content: document.getElementById('chat-scroll-content'),
        // 使用與 quotes 和 main 實例一致的基礎選擇器 '.lg-scrollbar'
        bar: chatRoot ? chatRoot.querySelector('.lg-scrollbar') : null,
        track: chatRoot ? chatRoot.querySelector('.lg-scrollbar .lg-scrollbar-track') : null,
        thumb: chatRoot ? chatRoot.querySelector('.lg-scrollbar .lg-scrollbar-thumb') : null,
        stopBubbleOnWheel: true,
        minThumb: 24,
    });

    // ==== 張國語錄文字版實例 ====
    const quotesRoot = document.getElementById('quotes-text-root');
    const quotes = createLGScroll({
        root: quotesRoot,
        content: quotesRoot ? quotesRoot.querySelector('.lg-scroll-content') : null,
        bar: quotesRoot ? quotesRoot.querySelector('.lg-scrollbar') : null,
        track: quotesRoot ? quotesRoot.querySelector('.lg-scrollbar .lg-scrollbar-track') : null,
        thumb: quotesRoot ? quotesRoot.querySelector('.lg-scrollbar .lg-scrollbar-thumb') : null,
        stopBubbleOnWheel: false,
    });

    // 聊天室自動滾到底 (使用升級後的 Class API)
    (function autoStickBottom() {
        if (!chatRoot || !chat) return;
        const chatBox = document.getElementById('chat-box');
        if (!chatBox) return;

        // 當聊天內容增加時，自動滾動到底部
        const mo = new MutationObserver(() => {
            chat.scrollToEnd(); // 呼叫我們為 Class 設計的公開 API
        });
        mo.observe(chatBox, { childList: true, subtree: true, characterData: true });

        // 觀察聊天視窗是否開啟 (確保捲軸在開啟時立即正確測量)
        const widget = document.getElementById('chat-widget');
        if (widget) {
            const io = new IntersectionObserver(() => {
                chat.measure();
            });
            io.observe(widget);
        }
    })();

    // 對外暴露 (與舊版相同)
    window.LGScroll = { main, chat, quotes };
})();