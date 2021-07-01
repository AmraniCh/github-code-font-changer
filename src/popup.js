/**
 * Get variables from background
 */
const background = chrome.extension.getBackgroundPage(),
    addEvent = background.addEvent,
    applyStyles = background.applyStyles,
    selectors = background.selectors,
    applyFontFamily = background.applyFontFamily,
    applyFontWeight = background.applyFontWeight,
    showIndentGuides = background.showIndentGuides,
    hideIndentGuides = background.hideIndentGuides,
    fonts = background.fonts,
    /**
     * Popup DOM elements
     */
    fontsDropdown = document.querySelector('#font_family'),
    weightsDropdown = document.querySelector('#fonts_weight'),
    IndentGuidesCheckbox = document.querySelector('#indentGuides');

// popup document content loaded
addEvent(document, 'DOMContentLoaded', function () {
    initEvents();
    fillFontsDrodown();
    updateUIFromStorage();
});

/**
 * Binding the necessary events to popup DOM elements
 */
function initEvents() {
    addEvent(fontsDropdown, 'change', function () {
        var oldSelectedWeight = weightsDropdown.value;
        fillWeightsDropdown(fontsDropdown.value);

        var fontSelected = fontsDropdown.value;
        applyFontFamily(fontSelected);
        chrome.storage.sync.set({ gt_font_family: fontSelected, gt_font_link: fonts[fontSelected] });

        updateSelectedWeight(oldSelectedWeight);
    });

    addEvent(weightsDropdown, 'change', function () {
        var selectedWeight = weightsDropdown.value;
        applyFontWeight(selectedWeight);
        chrome.storage.sync.set({ gt_font_weight: selectedWeight });
    });

    addEvent(IndentGuidesCheckbox, 'change', function (event) {
        var checked = event.target.checked;
        checked ? hideIndentGuides() : showIndentGuides();
        chrome.storage.sync.set({ gt_indent_guide: !checked });
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
    chrome.storage.sync.get(['gt_font_family', 'gt_font_weight', 'gt_indent_guide'], function (data) {
        if (Object.keys(data).length > 0) {
            // make the restored font selected
            fontsDropdown.querySelector(`option[value="${data.gt_font_family}"]`).setAttribute('selected', '');

            // fill the weights dropdown
            fillWeightsDropdown(fontsDropdown.value);

            // make the restored weight selected
            weightsDropdown.querySelector(`option[value="${data.gt_font_weight}"]`).setAttribute('selected', '');

            // update indentation guides checkbox 
            IndentGuidesCheckbox.checked = !data.gt_indent_guide;
        }
    });
}

/**
 * fill weights dropdown options when selecting one of fonts in the font family dropdown
 * @param {String} family - selected font family
 */
function fillWeightsDropdown(family) {
    console.log(family);
    console.log(fonts);
    const link = fonts[family],
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

/**
 * Updates font weights dropdown selected option
 * @param {String} oldSelectedWeight
 */
function updateSelectedWeight(oldSelectedWeight) {
    var option = weightsDropdown.querySelector(`option[value="${oldSelectedWeight}"]`);
    if (option === null) {
        /**
         * The first option was selected and the old font weight isn't supported by
         * the new selected font family, so we trigger the weights dropdown change
         * event to apply the first selected font weight.
         */
        weightsDropdown.dispatchEvent(new Event('change'));
    } else {
        option.setAttribute('selected', '');
    }
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
