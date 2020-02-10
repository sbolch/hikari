let data = chrome.extension.getBackgroundPage();
let text = data.text;

document.getElementById('text').innerHTML = text;

if(text.length > 0) {
    document.getElementById('description').innerHTML = '...';
} else {
    document.getElementById('description').innerHTML = 'Nothing is selected.';
}
