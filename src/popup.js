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
        fontFamiliesDropdown = document.querySelector('#font_family'),
        fontWeightsDropdown = document.querySelector('#fonts_weight');
    /**
     * Supported fonts
     */
    fonts = {
        'Fira Code': 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap',
        'Source Code Pro':
            'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300&family=Source+Code+Pro:wght@200;300;400;500;600;700;900&display=swap',
    };

    // populate options of select fonts dropdown
    for (var fontName in fonts) {
        if (!Object.prototype.hasOwnProperty.call(fonts, fontName)) {
            continue;
        }

        createOption(fontName, fontName, fontFamiliesDropdown);
    }

    // get font settings from storage and initialize the select dropdowns
    chrome.storage.sync.get(['gt_font_family', 'gt_font_weight'], function (data) {
        console.log(data);
        if (Object.keys(data).length > 0) {
            fontFamiliesDropdown.querySelector(`option[value="${data.gt_font_family}"]`).setAttribute('selected', '');

            // fir the change event of the font family select dropdown
            fontFamiliesDropdown.dispatchEvent(new Event('change'));

            fontWeightsDropdown.querySelector(`option[value="${data.gt_font_weight}"]`).setAttribute('selected', '');
        }
    });

    // fill font weight dropdown options when selecting one of fonts in the dropdown font family select
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

        fontWeightsDropdown.innerHTML = '';

        var i = 0;
        while (i < fontWeights.length) {
            var weight = fontWeights[i];
            createOption(`${weight} - ${fontWeightsNames[weight]}`, weight, fontWeightsDropdown);
            i++;
        }
    });

    addEvent(fontFamiliesDropdown, 'change', function () {
        var fontFamily = fontFamiliesDropdown.value;
        applyStyles({ 'font-family': fontFamily });
        chrome.storage.sync.set({ gt_font_family: fontFamily });

        chrome.extension.sendMessage({
            type: 'loadFont',
            font: {
                font: fontFamily,
                link: fonts[fontFamily],
            },
        });
    });

    addEvent(fontWeightsDropdown, 'change', function () {
        var fontWeight = fontWeightsDropdown.value;
        applyStyles({ 'font-weight': fontWeight });
        chrome.storage.sync.set({ gt_font_weight: fontWeight });
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
