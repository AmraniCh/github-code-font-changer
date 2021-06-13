chrome.tabs.onUpdated.addListener(function (tabId, info) {
    if (info.status === 'complete') {
        chrome.storage.sync.get('gt_code_fonts', function (data) {
            const fonts = data.gt_code_fonts;
            fonts && changeFont(fonts);
        });
    }
});

function changeFont(fonts) {
    chrome.tabs.insertCSS({
        code: `.blob-code-inner {
            font-family: ${fonts} !important;
        }`,
    });

    return true;
}

function addEvent(ele, event, handler) {
    ele.addEventListener(event, handler.bind(this), false);
}
