/**
 * Get variables from background
 */
const background = chrome.extension.getBackgroundPage(),
    addEvent = background.addEvent,
    applyStyles = background.applyStyles;

// popup document content loaded
addEvent(document, 'DOMContentLoaded', function () {
    const /**
         * Popup DOM elements
         */
        applyBtn = document.querySelector('#change_btn'),
        fontFamiliesDropdown = document.querySelector('#fonts_family'),
        fontWeightsDropdown = document.querySelector('#fonts_family_weight'),
        customCssTextArea = document.querySelector('#custom_css'),
        /**
         * Supported fonts
         */
        fonts = {
            'Fira Code':
                "url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap')",
        };

    // populate options of select fonts dropdown
    for (var fontName in fonts) {
        if (!Object.prototype.hasOwnProperty.call(fonts, fontName)) {
            continue;
        }

        createOption(fontName, fontName, fontFamiliesDropdown);
    }

    // fill font weight dropdown options when selecting one of fonts in the dropdown fonts select
    addEvent(fontFamiliesDropdown, 'change', function () {
        const font = fontFamiliesDropdown.value,
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
            createOption(`${weight} - ${fontWeightsNames[weight]}`, weight, fontWeightsDropdown);
            i++;
        }
    });

    // handle apply button click event
    addEvent(applyBtn, 'click', function () {
        var fontFamily = fontFamiliesDropdown.value,
            fontWeight = fontWeightsDropdown.value;

        if (
            applyStyles({
                'font-family': fontFamily,
                'font-weight': fontWeight,
            })
        ) {
            applyBtn.textContent = 'Done!';

            chrome.storage.sync.set({
                gt_font_family: fontFamily,
                gt_font_weight: fontWeight,
            });

            chrome.extension.sendMessage({
                type: 'loadFont',
                font: {
                    font: fontFamily,
                    link: fonts[fontFamily],
                },
            });
        }

        /*
        var fonts = custom_css.value;
        if (fonts && applyStyles(fonts)) {
            applyBtn.textContent = 'Done!';
            // store the fonts in browser storage
            chrome.storage.sync.set({ gt_code_fonts: fonts });
        }*/
    });

    //
    chrome.storage.sync.get(['gt_font_family', 'gt_font_weight'], function (data) {
        if (Object.keys(data).length > 0) {
            fontFamiliesDropdown.querySelector(`option[value="${data.gt_font_family}"]`).setAttribute('selected', '');
            fontFamiliesDropdown.dispatchEvent(new Event('change'));
            fontWeightsDropdown.querySelector(`option[value="${data.gt_font_weight}"]`).setAttribute('selected', '');
        }
    });

    // returns to original apply button text if typing in the font family textarea
    addEvent(custom_css, 'input', function () {
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
});
