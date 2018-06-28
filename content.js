(function tracker() {
    chrome.storage.local.get('work', function (result) {
        if (result.work) {
            var hostname = window.location.hostname;
            if (hostname.startsWith('www.')) {
                hostname = hostname.substring(4);
            }
            chrome.storage.local.get('hosts', function (result) {
                if (typeof result.hosts != 'object') {
                    result.hosts = {}; // default
                }
                if (typeof result.hosts[hostname] != 'number') {
                    result.hosts[hostname] = 0; // default
                }
                result.hosts[hostname] += 1;
                chrome.storage.local.set({'hosts': result.hosts});
            });
        }
    });
    setTimeout(tracker, 1000);
})();
