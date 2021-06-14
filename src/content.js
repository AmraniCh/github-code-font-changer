chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    if (message.type === 'loadFont') {
        WebFont.load({
            google: {
                families: ['Droid Sans', 'Droid Serif'],
            },
        });
    }
    return true;
});
