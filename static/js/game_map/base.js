import {GameObject} from '/static/js/game_object/base.js';
import {Controller} from '/static/js/controller/base.js';

class GameMap extends GameObject {
    constructor(root) {
        super();

        this.root = root;
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();
        
        // control key
        this.controller = new Controller(this.$canvas);

        // show hp and timer in $kof in html
        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
    </div>`));
        
        this.time_left = 60000; // ms
        this.$timer = this.root.$kof.find(".kof-head-timer");
    }

    start() {

    }

    update() {
        this.time_left -= this.timedelta;
        if (this.time_left < 0) {   // game over
            this.time_left = 0;

            let [a, b] = this.root.players;
            if (a.status !== 6 && b.status !== 6) {
                a.frame_current_cnt  = b.frame_current_cnt = 0;
                a.vx = b.vx = 0;
                a.status = b.status = 6;
            }
        }
        this.$timer.text(parseInt(this.time_left / 1000));

        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}

export {
    GameMap
}