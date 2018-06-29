function toggleWork(e) {
    chrome.storage.local.set({'work': e.target.checked});
    chrome.storage.local.set({'work_since': new Date().getTime()});
    drawWorkSince();
}

function clearData() {
    if (confirm('Are you sure?')) {
        chrome.storage.local.set({'hosts': {}});
        drawList();
        alert('OK, cleared');
    }
}

function drawWorkSince() {
    chrome.storage.local.get('work_since', function (result) {
        const seconds =  Math.round((new Date().getTime() - result.work_since) / 1000);
        chrome.storage.local.get('work', function (result) {
            $('#workSince').html(result.work ? displayTime(seconds) : 'OFF');
        });
    });
}

function drawCallback(data) {
    const map = [
        [data.good, $('#goodDataHere')],
        [data.evil, $('#evilDataHere')],
        [data.neutral, $('#neutralDataHere')],
    ];

    for (var i = 0; i < map.length; i++) {
        container = map[i][1];
        container.empty();
        for (var j = 0; j < map[i][0].length; j++) {
            var li = '<li>' + map[i][0][j][1] + ': ' + displayTime(map[i][0][j][0]) + '</li>';
            container.append(li);
        }
    }


    var total_sec = data.good_sec + data.evil_sec;
    var good_percent = Math.round(data.good_sec / total_sec * 100);
    var evil_percent = Math.round(data.evil_sec / total_sec * 100);

    var good_bar_msg = '';
    if (good_percent > 10) {
        good_bar_msg += good_percent + '%';
    }
    if (good_percent > 20) {
        good_bar_msg += '<br>' + displayTime(data.good_sec);
    }
    var evil_bar_msg = '';
    if (evil_percent > 10) {
        evil_bar_msg += evil_percent + '%';
    }
    if (evil_percent > 20) {
        evil_bar_msg += '<br>' + displayTime(data.evil_sec);
    }

    $('#goodBar').css('width', good_percent + '%').html(good_bar_msg);
    $('#evilBar').css('width', evil_percent + '%').html(evil_bar_msg);
}

document.addEventListener('DOMContentLoaded', function () {

    chrome.storage.local.get('work', function (result) {
        if (typeof result.work !== 'boolean') {
            result.work = true; // default
            chrome.storage.local.set({'work': true});
            chrome.storage.local.set({'work_since': new Date().getTime()});
        }
        $('#toggleWork').prop('checked', result.work);
    });

    $('#toggleWork').on('change', toggleWork);
    $('#clearData').on('click', clearData);

    (function redraw() {
        getData(drawCallback);
        drawWorkSince();
        setTimeout(redraw, 1000);
    })();

});