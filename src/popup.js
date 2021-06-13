const background = chrome.extension.getBackgroundPage(),
    /**
     * Get variables from background
     */
    addEvent = background.addEvent,
    changeFont = background.changeFont,
    /**
     * Popup DOM elements
     */
    applyBtn = document.querySelector('#change_btn'),
    fontFamilyInput = document.querySelector('#font_family');

addEvent(document, 'DOMContentLoaded', function () {
    // handle apply button click event
    addEvent(applyBtn, 'click', function () {
        var fonts = fontFamilyInput.value;
        if (fonts && changeFont(fonts)) {
            applyBtn.textContent = 'Done!';
            // store the fonts in browser storage
            chrome.storage.sync.set({ gt_code_fonts: fonts });
        }
    });
});

// returns to original apply button text if typing in the font family input
addEvent(fontFamilyInput, 'input', function () {
    applyBtn.textContent = 'apply';
});
