function backgroundCallback(data) {
    if (data.good_sec > data.evil_sec) {
        chrome.browserAction.setBadgeText( { text: 'OK' } );
        chrome.browserAction.setBadgeBackgroundColor({color: [0, 128, 0, 255]});
    }
    else if (data.good_sec < data.evil_sec) {
        chrome.browserAction.setBadgeText( { text: 'NOO' } );
        chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
        sendNotification();
    }
    else {
        chrome.browserAction.setBadgeText( { text: '' } );
    }
}

function sendNotification(progress) {
    var options = {
        type: 'basic',
        title: 'Stepik',
        message: 'Don\'t waste your time. Learn!',
        iconUrl: 'icon.png'
    };
    var id = (Math.floor(Math.random() * 9007199254740992) + 1).toString();
    chrome.notifications.create(id, options);
}

(function backgroundTask() {
    chrome.storage.local.get('work', function (result) {
        if (result.work) {
            getData(backgroundCallback);
        }
    });
    setTimeout(backgroundTask, 1000);
})();