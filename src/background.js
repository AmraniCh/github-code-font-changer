// add a listener to onUpdated event
chrome.tabs.onUpdated.addListener(function (tabId, info) {
    // if the tab is completely loaded
    if (info.status === 'complete') {
        chrome.storage.sync.get(['gt_font_family', 'gt_font_weight'], function (data) {
            if (Object.keys(data).length > 0) {
                applyStyles({
                    'font-family': data.gt_font_family,
                    'font-weight': data.gt_font_weight,
                });
            }
        });

        chrome.runtime.onMessage.addListener(function (request) {
            if (request.type === 'loadFont') {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, request);
                });
            }
        });
    }
});

/**
 * Apply the giving css styles to Github code container
 * @param {String} styles
 * @returns true
 */
function applyStyles(styles) {
    const css = stylesToCss(styles);
    chrome.tabs.insertCSS({
        code: `.blob-code-inner {${css}}`,
    });
}

/**
 * Converts the giving css styles object into a regular CSS string
 * @param {Object} styles
 * @returns {String}
 */
function stylesToCss(styles) {
    var parsed = '';
    for (let property in styles) {
        const value = styles[property];
        if (!Object.prototype.hasOwnProperty.call(styles, property) || !value) {
            continue;
        }
        parsed += `${property}: ${value} !important;`;
    }

    return parsed;
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
