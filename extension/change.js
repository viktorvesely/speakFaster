var interval;
var el;

function injectHtml() {
    let inject = document.createElement("div");
    inject.setAttribute("class", "sf-placeholder");
    inject.innerHTML = serveHtml();
    document.body.appendChild(inject);
    el = document.querySelector(".sf-placeholder");
}

function isVisible(el) {
    return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
}

function getVideo() {
    let video = document.querySelector("video");
    video = isVisible(video) ? video : false; 
    return video;
}

function updateText(speed) {
    el.querySelector("span").innerText = speed;
}

function changePlayback(speed) {
    getVideo().playbackRate = speed;
} 

function start() {
    injectHtml();
    updateText(1);
    let slider = el.querySelector("input");
    slider.onchange = e => {
        changePlayback(e.target.value);
    }
    slider.oninput = e => {
        updateText(e.target.value);
    }
}

function detectVideo() {
    let video = getVideo();
    if (!video) return;

    console.log("Now you will speak faster!");
    clearInterval(interval);
    start();
}

interval = setInterval(detectVideo, 200)

function serveHtml() {
    return `
    <input 
    type="range"
    min="0"                   
    max="5"               
    step="0.1"                 
    value="1"/>
    <span id="sf-textholder">            
    </span>`;
}