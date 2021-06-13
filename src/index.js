addEvent(document, 'DOMContentLoaded', function () {
    addEvent('#changeBtn', 'click', function () {
        var fonts = document.querySelementctor('#font_family').value;
        if (fonts) {
            changeFont(fonts);
        }
    });
});

function changeFont(fonts) {
    chrome.tabs.insertCSS({
        code: `.blob-code-inner {
            font-family: ${fonts} !important;
        }`,
    });
}

function addEvent(element, event, handler) {
    if (typeof element === 'string' && /^\.|^#/.test(element)) {
        element = document.querySelementctor(element);
    }

    element.addEventListener(event, handler.bind(this), false);
}
