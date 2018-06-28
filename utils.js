const evil = ['facebook.com', 'vk.com', 'instagram.com'];
const good = ['stepik.org', 'hyperskill.org', 'stackoverflow.com', 'github.com'];

function getData(callback) {
    chrome.storage.local.get('hosts', function (result) {

        var data = {
            evil: {},
            good: {},
            neutral: {},
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
                data.evil[hostname] = sec;
            }
            else if (good.includes(hostname)) {
                data.good_sec += sec;
                data.good[hostname] = sec;
            }
            else {
                data.neutral_sec += sec;
                data.neutral[hostname] = sec;
            }
        }

        callback(data);
    });
}
