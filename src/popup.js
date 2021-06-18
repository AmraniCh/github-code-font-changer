/**
 * Get variables from background
 */
const background = chrome.extension.getBackgroundPage(),
    addEvent = background.addEvent,
    applyStyles = background.applyStyles,
    /**
     * Popup DOM elements
     */
    fontsDropdown = document.querySelector('#font_family'),
    weightsDropdown = document.querySelector('#fonts_weight'),
    /**
     * Supported fonts
     */
    fonts = {
        'Fira Code': 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap',
        'Source Code Pro': 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200;300;400;500;600;700;900&display=swap',
    };

// popup document content loaded
addEvent(document, 'DOMContentLoaded', function () {
    initEvents();
    fillFontsDrodown();
    updateUIFromStorage();
});

/**
 * Binding popup DOM elements to appropiate events
 */
function initEvents() {
    addEvent(fontsDropdown, 'change', function () {
        var oldSelectedWeight = weightsDropdown.value;
        fillWeightsDropdown(fontsDropdown.value);
        applyFontFamily(fontsDropdown.value);
        updateSelectedWeight(oldSelectedWeight);
    });

    addEvent(weightsDropdown, 'change', function () {
        applyFontWeight(weightsDropdown.value);
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
            fillWeightsDropdown(fontsDropdown.value);
            weightsDropdown.querySelector(`option[value="${data.gt_font_weight}"]`).setAttribute('selected', '');
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
         * event to apply the selected font weight.
         */
        weightsDropdown.dispatchEvent(new Event('change'));
    } else {
        option.setAttribute('selected', '');
    }
}

/**
 * Applies the giving font family to the github code container.
 * @param {String} family
 */
function applyFontFamily(family) {
    applyStyles({ 'font-family': family });

    chrome.storage.sync.set({
        gt_font_family: family,
        gt_font_link: fonts[family],
    });

    chrome.extension.sendMessage({
        type: 'loadFont',
        font: {
            font: family,
            link: fonts[family],
        },
    });
}

/**
 * Applies the provided weight to the github code container.
 * @param {String} weight
 */
function applyFontWeight(weight) {
    applyStyles({ 'font-weight': weight });
    chrome.storage.sync.set({ gt_font_weight: weight });
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
