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
    fontFamilyInput = document.querySelector('#font_family'),
    selectFontDropdown = document.querySelector('#fonts_select'),
    /**
     * Select Fonts
     */
    fonts = {
        'Fira Code': "url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap')",
    };

// popup document content loaded
addEvent(document, 'DOMContentLoaded', function () {
    // populate options of select fonts dropdown
    for (var fontName in fonts) {
        if (!Object.prototype.hasOwnProperty.call(fonts, fontName)) {
            continue;
        }

        var option = document.createElement('option');

        option.value = fontName;
        option.textContent = fontName;

        selectFontDropdown.appendChild(option);
    }

    // fill the font family input with fonts from storage
    chrome.storage.sync.get('gt_code_fonts', function (data) {
        const fonts = data.gt_code_fonts;
        fonts && (fontFamilyInput.value = fonts);
    });

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
