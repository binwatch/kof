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

    update_move() {

    }

    update_control() {

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
        this.render();
    }

    render() {
        let status = this.status;

        
    }
}

export {
    Player
}