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

        this.direction = 1; // to right

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

        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
        this.$hp_div = this.$hp.find('div');
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
        if (this.status === 6) return;

        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
            //let msg = `id = ${this.id}, direction = ${me.direction}`;
            //console.log(msg);
        }

    }

    is_attack() {
        if (this.status === 6) return;

        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - 20, 0);

        this.$hp_div.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 300);
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 600);

        if (this.hp <= 0) { // dead
            this.frame_current_cnt = 0;
            this.vx = 0;
            this.status = 6;
        }

    }

    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 18) {
            let me = this, you = this.root.players[1 - this.id];

            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120,
                    y2: me.y + 40 + 20,
                };
            }

            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            }

            if (this.is_collision(r1, r2)) {
                you.is_attack();
            }
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();
        this.render();
    }

    render() {
        let status = this.status;

        // show the gif for each animation
        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();
            }
        } else {
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
            this.ctx.fillStyle = this.color;
        }

        if (status === 4 || status === 5 || status === 6) {
            if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
                if (status === 6) { // if dead, hold the status
                    this.frame_current_cnt --;
                } else {
                    this.status = 0;
                }
            }
        }

        this.frame_current_cnt ++;
    }
}

export {
    Player
}