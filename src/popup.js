function sendMessage(action, value, callback) {
    chrome.runtime.sendMessage({ action, value }, callback);
}

function addEvent(ele, event, handler) {
    ele.addEventListener(event, handler.bind(this), false);
}

/**
 * variables from background
 */
const
// background = chrome.extension.getBackgroundPage(),
// addEvent = background.addEvent,
// applyStyles = background.applyStyles,
// selectors = background.selectors,
// applyFontFamily = background.applyFontFamily,
// applyFontWeight = background.applyFontWeight,
// applyFontSize = background.applyFontSize,
// showIndentGuides = background.showIndentGuides,
// hideIndentGuides = background.hideIndentGuides,
// fonts = background.fonts,
/**
 * Popup DOM elements
 */
    fontsDatalist = document.querySelector('#font_family_list'),
    fontsDatalistInput = document.querySelector('#font_family'),
    weightsDatalist = document.querySelector('#font_weight_list'),
    weightsDatalistInput = document.querySelector('#font_weight'),
    fontSizeInput = document.querySelector('#font_size'),
    IndentGuidesCheckbox = document.querySelector('#indentGuides');



// popup document content loaded
addEvent(document, 'DOMContentLoaded', function() {
    chrome.runtime.sendMessage({ action: "getFonts" }, (response) => {
        const fonts = response.fonts;
        initEvents(fonts);
        fillFontsDrodown(fonts);
        updateUIFromStorage(fonts);
    });
});

/**
 * Binding the necessary events to popup DOM elements
 */
function initEvents(fonts) {
    addEvent(fontsDatalistInput, 'input', function() {
        const oldSelectedWeight = weightsDatalistInput.value,
            fontSelected = fontsDatalistInput.value,
            isLocalFont = Object.keys(fonts).indexOf(fontSelected) === -1;

        // applyFontFamily(fontSelected);

        sendMessage("applyFontFamily", fontSelected);

        chrome.storage.sync.set({
            gt_font_family: fontSelected,
            gt_font_link: fonts[fontSelected],
        });

        if (!isLocalFont) {
            fillWeightsDropdown(fonts, fontsDatalistInput.value);
            updateSelectedWeight(oldSelectedWeight);
        }
    });

    addEvent(weightsDatalistInput, 'input', function() {
        var selectedWeight = weightsDatalistInput.value;
        sendMessage("applyFontWeight", selectedWeight);
        chrome.storage.sync.set({ gt_font_weight: selectedWeight });
    });

    addEvent(fontSizeInput, 'input', function() {
        var typedSize = fontSizeInput.value;
        sendMessage("applyFontSize", selectedWeight);
        chrome.storage.sync.set({ gt_font_size: typedSize });
    });

    addEvent(IndentGuidesCheckbox, 'change', function(event) {
        var checked = event.target.checked;
        checked ? hideIndentGuides() : showIndentGuides();
        chrome.storage.sync.set({ gt_indent_guide: !checked });
    });
}

/**
 * Populate options of the select font families dropdown
 */
function fillFontsDrodown(fonts) {
    const sortedFonts = sortObject(fonts);
    for (var fontName in sortedFonts) {
        if (!Object.prototype.hasOwnProperty.call(fonts, fontName)) {
            continue;
        }

        createOption(fontName, fontName, fontsDatalist);
    }
}

/**
 * Get font settings from storage and initialize the select dropdowns
 */
function updateUIFromStorage(fonts) {
    chrome.storage.sync.get(['gt_font_family', 'gt_font_weight', 'gt_font_size', 'gt_font_size', 'gt_indent_guide'], function(data) {
        if (Object.keys(data).length > 0) {
            const isLocalFont = Object.keys(fonts).indexOf(data.gt_font_family) === -1;

            // update fields
            fontsDatalistInput.value = data.gt_font_family || '';
            weightsDatalistInput.value = data.gt_font_weight || '';
            fontSizeInput.value = data.gt_font_size || '';

            // update indentation guides checkbox
            IndentGuidesCheckbox.checked = !data.gt_indent_guide;

            if (!isLocalFont) {
                // fill the weights dropdown
                fillWeightsDropdown(fonts, fontsDatalistInput.value);
            }
        }
    });
}

/**
 * fill weights dropdown options when selecting one of fonts in the font family dropdown
 * @param {String} family - selected font family
 */
function fillWeightsDropdown(fonts, family) {
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

    weightsDatalist.innerHTML = '';

    var i = 0;
    try {
        while (i < weights.length) {
            var weight = weights[i];
            createOption(`${weight} - ${weightsNames[weight]}`, weight, weightsDatalist);
            i++;
        }
    } catch (error) {
        // fonts which return null on weights.length
        var weight = 400;
        createOption(`${weight} - ${weightsNames[weight]}`, weight, weightsDatalist);
    }
}

/**
 * Updates font weights dropdown selected option
 * @param {String} oldSelectedWeight
 */
function updateSelectedWeight(oldSelectedWeight) {
    var option = weightsDatalist.querySelector(`option[value="${oldSelectedWeight}"]`);
    if (option === null) {
        /**
         * The first option was selected and the old font weight isn't supported by
         * the new selected font family, so we trigger the weights dropdown change
         * event to apply the first selected font weight.
         */
        weightsDatalist.dispatchEvent(new Event('change'));
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

function sortObject(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((accumulator, current) => {
            accumulator[current] = obj[current];
            return accumulator;
        }, {});
}