function backgroundCallback(data) {
    if (data.good_sec > data.evil_sec) {
        chrome.browserAction.setBadgeText( { text: 'OK' } );
        chrome.browserAction.setBadgeBackgroundColor({color: [0, 128, 0, 255]});
    }
    else if (data.good_sec < data.evil_sec) {
        chrome.browserAction.setBadgeText( { text: 'NOO' } );
        chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    }
}

(function backgroundTask() {
    getData(backgroundCallback);
    setTimeout(backgroundTask, 1000);
})();