var states = {

};

function State() {
    this.native = null;
    this.injected = null;
    this.port = null;
}

chrome.runtime.onConnect.addListener(function (port) {
    let state = new State();

    state.injected = false;
    state.port = port;

    state.port.onMessage.addListener(function (msg) {
        switch (msg.intent) {
            case "native":
                state.native = msg.value;
                break;
            default:
                console.error(`Unknown message intent: ${msg.intent}`);
                break;
        }
    });

    states[port.sender.tab.id] = state;
});


chrome.tabs.onRemoved.addListener(function (id, info) {
    state[id] = undefined;
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.value.origin !== "popup") {
        sendResponse(MSG("error", {msg: "Invalid origin"}));
    }
    let state = states[msg.value.id];
    switch (msg.intent) {
        case "status":
            if (!state) {
                sendResponse(MSG("refresh", null));
            }
            else {
                if (state.injected) {
                    sendResponse(MSG("injected", true));
                } else {
                    sendResponse(MSG("native", state.native));
                }
            }
            break;
        case "inject":
            state.port.postMessage(MSG("inject", null));
            state.injected = true;
            sendResponse(MSG("inject", null));
            break;
        default:
            console.error(`Unknown message intent: ${msg.intent}`);
            break;
    }
});
