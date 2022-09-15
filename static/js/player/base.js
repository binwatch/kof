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
        this.pressed_keys = this.root.game_map.controller.pressed_keys;
        
        // 0: idle, 1: forward +2: backward 3: jump 
        // 4: attack 5: attacked 6: dead
        this.status = 3;
        this.animations = new Map();
        this.frame_current_cnt = 0;
    }

    start() {

    }

    update_control() {
        let w, a, d, space;

        if (this.id === 0) {    // player 0
            w = this.pressed_keys.has('w') || this.pressed_keys.has('W');
            a = this.pressed_keys.has('a') || this.pressed_keys.has('A');
            d = this.pressed_keys.has('d') || this.pressed_keys.has('D');
            space = this.pressed_keys.has(' ');
        } else {                // player 1
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {
        // when idle or moving (forward or backward)
            if (space) {    // attack
                this.vx = 0;

                this.status = 4;
                this.frame_current_cnt = 0; // restart git
            } else if (w) { // jump
                if (d) {    // go forward
                    this.vx = this.speedx;
                } else if (a) { // go backward
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;

                this.status = 3;
                this.frame_current_cnt = 0; // restart git
            } else if (d) { // forward
                this.vx = this.speedx;

                this.status = 1;
            } else if (a) { // backward
                this.vx = -this.speedx;
                
                this.status = 1;    // same status as forward
            } else {    // no operation, idle
                this.vx = 0;

                this.status = 0;
            }
        }
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
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
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
        this.update_control();
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