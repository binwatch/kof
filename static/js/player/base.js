import { GameObject } from "/static/js/game_object/base.js";

class Player extends GameObject {
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;

        // x left to right y top down

        // inital speed
        this.vx = 0;
        this.vy = 0;

        this.speedx = 400;      // speed when move on x
        this.speedy = -1000;    // speed when jump on y

        this.gravity = 50;

        this.ctx = this.root.game_map.ctx;
        
        // 0: idle, 1: forward 2: backward 3: jump 
        // 4: attack 5: attacked 6: dead
        this.status = 3;
        this.animations = new Map();
        this.frame_current_cnt = 0;
    }

    start() {

    }

    update_control() {

    }

    update_move() {
        this.vy += this.gravity;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;


        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;

            if (this.status === 3) this.status = 0;
        }

        if (this.x < 0) {
            this.x = 0;
        }
        
        //let msg = `id = ${this.id} position = (${this.x}, ${this.y})`;
        //console.log(msg);
    }

    update_direction() {

    }

    is_attack() {

    }

    is_collision() {

    }

    update_attack() {

    }

    update() {
        this.update_move();
        this.render();
    }

    render() {
        let status = this.status;

        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.color;
    }
}

export {
    Player
}