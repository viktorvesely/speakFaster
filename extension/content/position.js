const g_default_x = 80;
const g_default_y = 100;
const g_position_key = "position";

class Position {
    constructor(element) {
        this.e = element;
        this.e.style.position = "absolute";
        this.load();

        let ctx = this;
        this.e.onmousedown = e => { this.start.call(ctx, e) };
        window.addEventListener("mousemove", e => { this.drag.call(ctx, e) });
        this.e.onmouseup = e => { this.stop.call(ctx, e) };
        this.dragging = false;
    }


    start(e) {
        if (e.srcElement.nodeName === "INPUT") return;
        this.dragging = true;
    }

    drag(e) {
        if (!this.dragging) return;
        this.updatePosition(e.clientX, e.clientY);
    }

    stop(e) {
        this.dragging = false;
        this.save();
    }

    transform(right, bottom) {
        return [window.innerWidth - right, window.innerHeight - bottom];
    }

    save() {
        let save = {};
        save[g_position_key] = this.getPosition();
        chrome.storage.sync.set(save, ()=>{});
    }

    load() {
        let ctx = this;
        chrome.storage.sync.get([g_position_key], function(result) {
            let pos = result[g_position_key];
            if (!pos) {
                let temp = ctx.transform(g_default_x, g_default_y);
                pos = {
                    x: temp[0],
                    y: temp[1]
                };
            }
            ctx.updatePosition(pos.x, pos.y);
        });
    }

    updatePosition(x, y) {
        this.e.style.top = `${y - 35}px`;
        this.e.style.left =  `${x - 10}px`;
    }

    getPosition() {
        let rect = this.e.getBoundingClientRect();
        return {
            x: rect.x + 10,
            y: rect.y + 35
        };
    }


}