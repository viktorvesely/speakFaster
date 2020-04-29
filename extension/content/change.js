const g_videoDetectRate = 200;
const g_maxTries = 200;

function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

function GET(theUrl, callback)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function serveHtml(onLoad, ctx) {
    let url = chrome.runtime.getURL("/content/inject.html");
    GET(url, html => {
        onLoad.call(ctx, html);
    });
}

class Injector {
    constructor() {
        this.interval = null;
        this.video = null;
        this.hmtl = null;
        this.slider = null;
        this.tries = 0;
        this.onVideoFound = null;
    }

    detectVideo() {
        this.tries++;
        this.video = this.getVideo();
        if (!this.video) {
            if (this.tries == g_maxTries) {
                this.onVideoFound(false, null);
                window.clearInterval(this.interval);
            }
            return;
        }

        console.log("Now you will speak faster!");
        window.clearInterval(this.interval);
        serveHtml(this.onLoad, this);
    }

    getVideo() {
        let videos = document.querySelectorAll("video");
        let video = null;

        for (let i = 0; i < videos.length; ++i) {
            video = videos[i];
            video = isVisible(video) ? video : null;
            if (video) break;
        }
        return video;
    }

    start(onVideoFound) {
        this.onVideoFound = onVideoFound;
        let ctx = this;
        this.interval = window.setInterval(() => { ctx.detectVideo.call(ctx) }, g_videoDetectRate);
    }

    updateText(speed) {
        this.html.querySelector("span").innerText = speed;
    }

    onLoad(html) {
        this.html = document.createElement("div");
        this.html.setAttribute("class", "sf-placeholder");
        this.html.innerHTML = html;
        document.body.appendChild(this.html);
        this.updateText(1);
        let slider = this.html.querySelector("input");
        slider.onchange = e => {
            this.changePlayback(e.target.value);
        }
        slider.oninput = e => {
            this.updateText(e.target.value);
        }
        this.onVideoFound(true, this.html);
    }

    changePlayback(speed) {
        this.video.playbackRate = speed;
    }

}

