const evil = ['facebook.com', 'vk.com', 'instagram.com' ];
const good = ['stepik.org', 'hyperskill.org', 'stackoverflow.com', 'github.com'];

function getData(callback) {
    chrome.storage.local.get('hosts', function (result) {

        var data = {
            evil: [],
            good: [],
            neutral: [],
            evil_sec: 0,
            good_sec: 0,
            neutral_sec: 0
        };

        if (typeof result.hosts !== 'object') {
            result.hosts = {}; // default
        }

        for (var hostname in result.hosts) {
            var sec = result.hosts[hostname];
            if (evil.includes(hostname)) {
                data.evil_sec += sec;
                data.evil.push([sec, hostname]);
            }
            else if (good.includes(hostname)) {
                data.good_sec += sec;
                data.good.push([sec, hostname]);
            }
            else {
                data.neutral_sec += sec;
                data.neutral.push([sec, hostname]);
            }
        }

        comparator = function(a, b) {
            return a[0] > b[0] ? -1 : 1;
        };
        data.good.sort(comparator);
        data.evil.sort(comparator);
        data.neutral.sort(comparator);

        callback(data);
    });
}

function displayTime(seconds) {
    ans = '';
    if (seconds > 60*60) {
        ans += Math.ceil(seconds / 60 / 60) + ' h '
        seconds %= 60*60;
    }
    if (seconds > 60) {
        ans += Math.ceil(seconds / 60) + ' min '
        seconds %= 60;
    }
    ans += seconds + ' secs'
    return ans;
}