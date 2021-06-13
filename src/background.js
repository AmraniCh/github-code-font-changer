// add a listener to onUpdated event
chrome.tabs.onUpdated.addListener(function (tabId, info) {
    // if the tab is completely loaded
    if (info.status === 'complete') {
        chrome.storage.sync.get('gt_code_fonts', function (data) {
            const fonts = data.gt_code_fonts;
            fonts && changeFont(fonts);
        });
    }
});

/**
 * Changes font family for github code
 * @param {String} fonts
 * @returns true
 */
function changeFont(fonts) {
    chrome.tabs.insertCSS({
        code: `.blob-code-inner {
            font-family: ${fonts} !important;
        }`,
    });

    return true;
}

/**
 * Just a shortcut for the native target.addEventListener
 * @param {DOMElement} ele
 * @param {String} event
 * @param {function} handler
 */
function addEvent(ele, event, handler) {
    ele.addEventListener(event, handler.bind(this), false);
}
