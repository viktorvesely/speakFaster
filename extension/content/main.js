var injector = new Injector();
name = "content";
var start, port, url;

function shouldStart() {
    url = new URL(location.href);
    if (url.host.indexOf("eu.bbcollab.com") != -1) {
        return true;
    }
    if (
        url.href.indexOf("https://nestor.rug.nl/") != -1 &&
        url.href.indexOf(".MP4") != -1
    ) {
        return true;
    }
    return false;
}


function onVideoFound(found) {

}

function initConnection() {
    port = chrome.runtime.connect({ name: name });

    port.postMessage(MSG("native", start));

    port.onMessage.addListener(function (msg) {
        switch (msg.intent) {
            case "inject":
                injector.start(onVideoFound);
                break;
            default:
                console.error(`Unknown message intent: ${msg.intent}`);
                break;
        }
    });
}

function init() {
    start = shouldStart();
    initConnection();

    if (start) {
        injector.start(onVideoFound);
    }
}

init();

