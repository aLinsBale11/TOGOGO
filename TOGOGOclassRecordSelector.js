// ==UserScript==
// @name         课时确认一键全选
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  课时确认一键全选功能，讲师可以一键全选待确认的课时，兼容所有主流PC和移动端浏览器
// @author       XlinCode
// @match        https://user.togogo.net/education/classRecord.html*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 切换选择框的选中状态
    function toggleSelection(button) {
        const shouldSelect = button.dataset.selected !== 'true';
        document.querySelectorAll('.select_frame.select_single').forEach(frame => {
            if (frame.classList.contains('select_icon') !== shouldSelect) frame.click();
        });
        button.innerText = shouldSelect ? '取消全选' : '一键全选';
        button.dataset.selected = shouldSelect;
    }

    // 创建并插入一键全选按钮
    function createButton(container, reference) {
        if (document.querySelector('.one_click_select_button')) return;

        const button = document.createElement('button');
        button.className = 'one_click_select_button';
        button.innerText = '一键全选';
        button.dataset.selected = 'false';
        button.style.cssText = `
            width:100px; height:28px; background:#1E9FFF; border-radius:4px;
            display:flex; align-items:center; justify-content:center;
            font-family:'Noto Sans S Chinese'; font-weight:350; font-size:12px;
            color:#fff; cursor:pointer; margin-right:16px;
        `;
        button.onclick = () => toggleSelection(button);

        container.insertBefore(button, reference);
    }

    // 监听目标元素出现并初始化按钮
    function observeAndInitialize() {
        const container = document.querySelector('.arrpval_btn_row');
        const referenceButton = document.querySelector('.batch_btn_confirm');
        if (!container || !referenceButton) return console.error('未找到目标容器或参考按钮');

        new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                createButton(container, referenceButton);
                observer.disconnect();
            }
        }).observe(container);
    }

    window.addEventListener('load', observeAndInitialize);
})();
