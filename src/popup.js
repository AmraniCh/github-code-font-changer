var background = chrome.extension.getBackgroundPage(),
    addEvent = background.addEvent,
    changeFont = background.changeFont;

addEvent(document, 'DOMContentLoaded', function () {
    const applyBtn = document.querySelector('#change_btn'),
        fontFamilyInput = document.querySelector('#font_family');

    addEvent(applyBtn, 'click', function () {
        var fonts = fontFamilyInput.value;
        if (fonts && changeFont(fonts)) {
            applyBtn.textContent = 'Done!';
            chrome.storage.sync.set({ gt_code_fonts: fonts });
        }
    });
});

addEvent(fontFamilyInput, 'input', function () {
    applyBtn.textContent = 'apply';
});

/*
WebFont.load({
    google: {
        families: ['Droid Sans', 'Droid Serif'],
    },
});*/
