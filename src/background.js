var /**
     * Supported fonts
     */
    fonts = {
        'Fira Code': 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap',
        'Source Code Pro': 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200;300;400;500;600;700;900&display=swap',
    },
    selectors = {
        code: '.blob-code-inner',
        dotsIndent: '[data-rgh-whitespace="space"]',
    };

// add a listener to tabs.onUpdated event
chrome.tabs.onUpdated.addListener(function (tabId, info) {
    // if the tab is completely loaded
    if (info.status === 'complete') {
        chrome.storage.sync.get(['gt_font_family', 'gt_font_weight', 'gt_font_link', 'gt_indent_guides'], function (data) {
            console.log(data);
            if (Object.keys(data).length > 0) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: 'loadFont',
                        font: {
                            font: data.gt_font_family,
                            link: data.gt_font_link,
                        },
                    });
                });

                applyFontFamily(data.gt_font_family);
                applyFontWeight(data.gt_font_weight);
                data.gt_indent_guides ? showIndentGuides() : hideIndentGuides();
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
function applyStyles(selector, styles) {
    const css = stylesToCss(styles);
    console.log(selector);
    console.log(css);
    console.log(`${selector} {${css}}`);
    chrome.tabs.insertCSS({
        code: `${selector} {${css}}`,
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
 * Applies the giving font family to the html github code container
 * @param {String} family
 */
function applyFontFamily(family) {
    applyStyles(selectors.code, { 'font-family': family });

    chrome.extension.sendMessage({
        type: 'loadFont',
        font: {
            font: family,
            link: fonts[family],
        },
    });
}

/**
 * Applies the provided weight to the html github code container
 * @param {String} weight
 */
function applyFontWeight(weight) {
    applyStyles(selectors.code, { 'font-weight': weight });
}

function hideIndentGuides() {
    applyStyles(selectors.dotsIndent, {
        visibility: 'hidden',
    });
}

function showIndentGuides() {
    applyStyles(selectors.dotsIndent, {
        visibility: 'visible',
    });
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
