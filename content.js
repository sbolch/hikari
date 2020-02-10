window.addEventListener('mouseup', () => {
    chrome.runtime.sendMessage({
        text: window.getSelection().toString().trim()
    });
});
