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
        fontsDropdown = document.querySelector('#font_family'),
        weightsDropdown = document.querySelector('#fonts_weight'),
        /**
         * Supported fonts
         */
        fonts = {
            'Fira Code': 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap',
            'Source Code Pro':
                'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200;300;400;500;600;700;900&display=swap',
        };

    initEvents();
    fillFontsDrodown();
    updateUIFromStorage();

    /**
     * Initializes popup DOM elements events
     */
    function initEvents() {
        addEvent(fontsDropdown, 'change', function () {
            //alert();
            var oldSelectedWeight = weightsDropdown.value;

            fillWeightsDropdown();
            //updateSelectedWeight(oldSelectedWeight);
            //weightsDropdown.dispatchEvent(new Event('change'));
            applyFont();

            /**
             * fill weights dropdown options when selecting one of fonts in the font family dropdown
             */
            function fillWeightsDropdown() {
                const font = fontsDropdown.value,
                    link = fonts[font],
                    weights = link.match(/\d{3}/g),
                    weightsNames = {
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

                weightsDropdown.innerHTML = '';

                var i = 0;
                while (i < weights.length) {
                    var weight = weights[i];
                    createOption(`${weight} - ${weightsNames[weight]}`, weight, weightsDropdown);
                    i++;
                }
            }

            function updateSelectedWeight(oldSelectedWeight) {
                var option = weightsDropdown.querySelector(`option[value="${oldSelectedWeight}"]`);
                option && option.setAttribute('selected', '');
                if (!option) {
                    weightsDropdown.dispatchEvent(new Event('change'));
                }
            }

            function applyFont() {
                var fontFamily = fontsDropdown.value;
                applyStyles({ 'font-family': fontFamily });
                chrome.storage.sync.set({ gt_font_family: fontFamily });
                chrome.extension.sendMessage({
                    type: 'loadFont',
                    font: {
                        font: fontFamily,
                        link: fonts[fontFamily],
                    },
                });
            }
        });

        addEvent(weightsDropdown, 'change', function () {
            var fontWeight = weightsDropdown.value;
            applyStyles({ 'font-weight': fontWeight });
            chrome.storage.sync.set({ gt_font_weight: fontWeight });
        });
    }

    /**
     * Populate options of the select font families dropdown
     */
    function fillFontsDrodown() {
        for (var fontName in fonts) {
            if (!Object.prototype.hasOwnProperty.call(fonts, fontName)) {
                continue;
            }

            createOption(fontName, fontName, fontsDropdown);
        }
    }

    /**
     * Get font settings from storage and initialize the select dropdowns
     */
    function updateUIFromStorage() {
        chrome.storage.sync.get(['gt_font_family', 'gt_font_weight'], function (data) {
            if (Object.keys(data).length > 0) {
                fontsDropdown.querySelector(`option[value="${data.gt_font_family}"]`).setAttribute('selected', '');

                // trigger the change event of the font family select dropdown
                fontsDropdown.dispatchEvent(new Event('change'));

                weightsDropdown.querySelector(`option[value="${data.gt_font_weight}"]`).setAttribute('selected', '');
            }
        });
    }

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
