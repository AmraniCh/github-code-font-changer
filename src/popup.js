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
    selectFontsDropdown = document.querySelector('#fonts_family'),
    selectFontWeightsDropdown = document.querySelector('#fonts_family_weights'),
    fontFamilyInput = document.querySelector('#fonts_family_css'),
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

        createOption(fontName, fontName, selectFontsDropdown);
    }

    // fill font weight dropdown options when selecting one of fonts in the dropdown fonts select
    addEvent(selectFontsDropdown, 'change', function () {
        const font = selectFontsDropdown.value,
            link = fonts[font],
            fontWeights = link.match(/\d{3}/g),
            fontWeightsNames = {
                100: 'thin',
                200: 'extra light',
                300: 'light',
                400: 'regular',
                500: 'medium',
                600: 'semi-bold',
                700: 'bold',
                800: 'extra bold',
                900: 'black',
            };

        var i = 0;
        while (i < fontWeights.length) {
            var weight = fontWeights[i];
            createOption(`${weight} - ${fontWeightsNames[weight]}`, weight, selectFontWeightsDropdown);
            i++;
        }
    });

    // /\d{3}/g

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

/**
 * Create option element for select dropdown
 */
function createOption(textContent, value, append) {
    var option = document.createElement('option');

    option.textContent = textContent;
    option.value = value;

    append.appendChild(option);
}
