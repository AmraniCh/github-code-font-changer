chrome.runtime.onMessage.addListener((req) => {
    if (req.action === 'loadFont') {
        const { link } = req.value;
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(`@import url(${link})`));
        document.head.appendChild(style);

        return true;
    }
});
