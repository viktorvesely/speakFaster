var tick, tickText, id;

tick = document.querySelector(".tick");
tickText = document.querySelector(".tickText");
injectButton = document.querySelector(".injectButton");

function injectStatus() {
    tick.style.backgroundColor = "#e26fdd";
    tickText.innerText = "Widget injected!";
    injectButton.innerText = "Re-inject?";
}

function inject() {
    chrome.runtime.sendMessage(MSG("inject", {origin: "popup", id: id}), response => {
        injectStatus();
    });
}

function reload() {
    chrome.tabs.reload(id);
}

function requestRefresh() {
    tick.style.backgroundColor = "orange";
    tickText.innerText = "Refresh the page";
    injectButton.innerText = "Reload page";
    injectButton.onclick = reload;
}

function setNative(status) {
    if (status) {
        tick.style.backgroundColor = "#4d82c6";
        tickText.innerText = "Current webpage is supported";
        injectButton.innerText = "Do nothing"
    } else {
        tick.style.backgroundColor = "#ef4c4c";
        tickText.innerText = "Current webpage is not supported";
        injectButton.innerText = "Inject anyways?";
        injectButton.onclick = inject;
    }
}




chrome.tabs.query({active: true, currentWindow: true}, tabs => { 
    id = tabs[0].id;
    
    chrome.runtime.sendMessage(MSG("status", {origin: "popup", id: id}), response => {
    
        switch (response.intent) {
            case "native":
                setNative(response.value);
                break;
            case "refresh":
                requestRefresh();
                break;
            case "injected":
                injectStatus();
                break;
            default:
                console.error(`Unknown message intent: ${response.intent}`);
                break;
        }
    });
    

 });

