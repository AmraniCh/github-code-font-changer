document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#changeBtn').addEventListener('click', function() {
        chrome.tabs.insertCSS({
            code: `.blob-code-inner {
                font-family: Consolas, sans-serif !important;
            }`
        });
    }, false);
}, false);