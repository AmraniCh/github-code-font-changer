const applyBtn = document.querySelector('#changeBtn'),
    fontFamilyInput = document.querySelector('#font_family');

addEvent(document, 'DOMContentLoaded', function () {
    // handle apply button click event
    addEvent(applyBtn, 'click', function () {
        var fonts = fontFamilyInput.value;
        fonts && changeFont(fonts);
    });
});

addEvent(fontFamilyInput, 'input', function () {
    applyBtn.textContent = 'apply';
});

function changeFont(fonts) {
    chrome.tabs.insertCSS({
        code: `.blob-code-inner {
            font-family: ${fonts} !important;
        }`,
    });

    applyBtn.textContent = 'Done!';
}

function addEvent(ele, event, handler) {
    ele.addEventListener(event, handler.bind(this), false);
}
