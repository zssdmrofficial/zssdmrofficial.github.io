/* 自製 Liquid Glass 虛擬捲動軸（可重複實例：主頁面 + 聊天室 + 張國語錄文字版） */
/* 版本 2.2.0 - 新增觸控慣性滑動 (Momentum Scrolling) */
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
         * @param {number} [opts.momentumFactor=120] - 觸控慣性滑動的動量因子，數值越大滑行越遠
         * @param {number} [opts.momentumThreshold=0.1] - 觸發慣性滑動的速度閾值 (px/ms)
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
            // [新增] 慣性滑動設定
            this.momentumFactor = opts.momentumFactor || 120;
            this.momentumThreshold = opts.momentumThreshold || 0.1;

            // 內部狀態
            this.viewportH = 0; this.contentH = 0; this.maxScroll = 0;
            this.trackH = 0; this.thumbH = 0;
            this.scrollY = 0; this.targetY = 0;
            this.rafId = null; this.lastActiveTs = 0;

            // 統一拖曳狀態
            this.dragging = false;
            this.dragStartY = 0;
            this.dragStartScroll = 0;
            this.isThumbDrag = false;

            // [新增] 慣性滑動所需狀態
            this.velocity = 0;
            this.velocityHistory = [];
            this.lastMoveTime = 0;
            this.lastMoveY = 0;

            this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            this.root.style.touchAction = 'pan-y';
            this.thumb.style.touchAction = 'none';

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

            this.setTarget(this.targetY, true);
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

        handlePointerDown = (e) => {
            if (e.button && e.button !== 0) return;

            this.isThumbDrag = e.target === this.thumb;
            if (!this.isThumbDrag && !this.content.contains(e.target)) return;

            this.stopRAF(); // [修改] 開始拖曳時，立刻停止任何正在進行的動畫

            e.preventDefault();
            e.stopPropagation();

            this.dragging = true;
            this.dragStartY = e.clientY;
            this.dragStartScroll = this.scrollY;
            this.bar.classList.add('lg-visible');
            document.documentElement.classList.add('lg-dragging');

            // [新增] 重置速度追蹤器
            this.velocity = 0;
            this.velocityHistory = [];
            this.lastMoveTime = e.timeStamp;
            this.lastMoveY = e.clientY;

            (e.target).setPointerCapture(e.pointerId);
        }

        handlePointerMove = (e) => {
            if (!this.dragging) return;

            const dy = e.clientY - this.dragStartY;

            if (this.isThumbDrag) {
                const range = Math.max(1, this.trackH - this.thumbH);
                const scrollDelta = (dy / range) * this.maxScroll;
                this.setTarget(this.dragStartScroll + scrollDelta, true);
            } else {
                this.setTarget(this.dragStartScroll - dy, true);

                // [新增] 計算並記錄速度
                const now = e.timeStamp;
                const clientY = e.clientY;
                const dt = now - this.lastMoveTime;
                const dPos = clientY - this.lastMoveY;

                if (dt > 0) {
                    const currentVelocity = dPos / dt; // 單位: px/ms
                    // 維持一個長度為 5 的速度歷史記錄
                    this.velocityHistory.push(currentVelocity);
                    if (this.velocityHistory.length > 5) {
                        this.velocityHistory.shift();
                    }
                    // 計算平均速度
                    this.velocity = this.velocityHistory.reduce((a, b) => a + b, 0) / this.velocityHistory.length;
                }

                this.lastMoveTime = now;
                this.lastMoveY = clientY;
            }
        }

        handlePointerUp = (e) => {
            if (!this.dragging) return;

            // [修改] 處理慣性滑動
            if (!this.isThumbDrag && Math.abs(this.velocity) > this.momentumThreshold) {
                // 根據最終速度計算滑行距離
                const momentumDistance = this.velocity * this.momentumFactor;
                // 注意方向：手指往下滑(velocity > 0)，內容要往上滾(scroll 減少)
                const newTarget = this.scrollY - momentumDistance;
                this.setTarget(newTarget, false); // 觸發平滑動畫
            } else {
                this.maybeAutoHideSoon(); // 如果沒有慣性，則正常檢查是否隱藏滾動條
            }

            this.dragging = false;
            this.isThumbDrag = false;
            document.documentElement.classList.remove('lg-dragging');
            (e.target).releasePointerCapture(e.pointerId);
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

            this.root.addEventListener('pointerdown', this.handlePointerDown);
            this.thumb.addEventListener('pointerdown', this.handlePointerDown);

            window.addEventListener('pointermove', this.handlePointerMove);
            window.addEventListener('pointerup', this.handlePointerUp);
            window.addEventListener('pointercancel', this.handlePointerUp);

            this.track.addEventListener('mousedown', this.handleTrackMousedown);

            this.ro = new ResizeObserver(this.measure);
            this.ro.observe(this.content);
            this.ro.observe(this.root);
        }

        teardown() {
            this.stopRAF();
            this.root.removeEventListener('wheel', this.handleWheel);
            window.removeEventListener('keydown', this.handleKeyDown);

            this.root.removeEventListener('pointerdown', this.handlePointerDown);
            this.thumb.removeEventListener('pointerdown', this.handlePointerDown);
            window.removeEventListener('pointermove', this.handlePointerMove);
            window.removeEventListener('pointerup', this.handlePointerUp);
            window.removeEventListener('pointercancel', this.handlePointerUp);

            this.track.removeEventListener('mousedown', this.handleTrackMousedown);

            this.ro.disconnect();
            this.ro = null;
        }

        // --- Public API ---
        scrollTo(y) { this.setTarget(y); }
        scrollToEnd() {
            this.measure();
            this.setTarget(this.maxScroll, this.prefersReducedMotion);
        }
    }


    /**
     * 工廠函式 (保持不變)
     */
    function createLGScroll(opts) {
        if (!opts.root || !opts.content || !opts.bar || !opts.track || !opts.thumb) {
            return null;
        }
        const scrollInstance = new LGScroll(opts);
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
        // 您可以在這裡微調主頁面的慣性手感
        // momentumFactor: 150, 
    });

    // ==== 聊天室實例 (已修正) ====
    const chatRoot = document.getElementById('chat-scroll-root');
    const chat = createLGScroll({
        root: chatRoot,
        content: document.getElementById('chat-scroll-content'),
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

        const mo = new MutationObserver(() => {
            chat.scrollToEnd();
        });
        mo.observe(chatBox, { childList: true, subtree: true, characterData: true });

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