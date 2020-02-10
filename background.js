window.text = '';

chrome.runtime.onMessage.addListener(request => text = request.text);
