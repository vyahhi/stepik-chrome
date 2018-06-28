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
        var seconds = Math.round((new Date().getTime() - result.work_since) / 1000) + ' seconds';
        chrome.storage.local.get('work', function (result) {
            $('#workSince').html(result.work ? seconds : 'OFF');
        });
    });
}

function drawCallback(data) {
    $('#goodDataHere').empty();
    $('#evilDataHere').empty();
    $('#neutralDataHere').empty();

    for (var hostname in data.good) {
        var li = '<li>' + hostname + ': ' + data.good[hostname] + ' sec' + '</li>';
        $('#goodDataHere').append(li);
    }
    for (var hostname in data.evil) {
        var li = '<li>' + hostname + ': ' + data.evil[hostname] + ' sec' + '</li>';
        $('#evilDataHere').append(li);
    }
    for (var hostname in data.neutral) {
        var li = '<li>' + hostname + ': ' + data.neutral[hostname] + ' sec' + '</li>';
        $('#neutralDataHere').append(li);
    }

    var total_sec = data.good_sec + data.evil_sec;
    var good_percent = Math.round(data.good_sec / total_sec * 100);
    var evil_percent = Math.round(data.evil_sec / total_sec * 100);

    var good_bar_msg = '';
    if (good_percent > 10) {
        good_bar_msg += good_percent + '%';
    }
    if (good_percent > 20) {
        good_bar_msg += '<br>' + data.good_sec + ' sec'
    }
    var evil_bar_msg = '';
    if (evil_percent > 10) {
        evil_bar_msg += evil_percent + '%';
    }
    if (evil_percent > 20) {
        evil_bar_msg += '<br>' + data.evil_sec + ' sec';
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