class Player {
    constructor(x, y, w, h, c, g, jh) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = c;

        this.currentChunk = [];

        this.OGgravity = g;
        this.gravity = this.OGgravity;
        this.xv = 0;
        this.yv = 0;

        this.gravityDir = 1;

        this.spd = 3;
        this.OGjumpheight = jh;
        this.doubleJumpHeight = this.OGjumpheight * 1.2;
        this.jumpheight = this.OGjumpheight;

        this.doublejump = false;
        this.shield = false;
        this.magnet = false;

        this.activePowerups = [];

        this.jumps = 0;

        this.onGround = false;
        this.jumping = false;

        this.nojump = false;

        this.dead = false;
        this.exploded = false;

        this.currentBlock;

    }

    draw() {

        stage.fillStyle = this.color;
        stage.fillRect(this.x, this.y, this.w, this.h);
        stage.fillStyle = '#000';

        if (this.shield) {

            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);

            stage.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            stage.fillRect(this.x + this.w * 1.1, this.y - 5, 10, this.h + 10);

        }

    }

    physics() {

        var min = this.gravityDir == 1 ? -60 : -25;
        var max = this.gravityDir == 1 ? 25 : 60;    

        //console.log(this.yv);

        this.yv = Math.clamp(this.yv, min, max);

        this.yv += this.gravity * this.gravityDir;

        this.x += this.xv * this.spd;

        if (!this.dead) this.y += this.yv;

    }

    update(){

        for(p=0;p<this.activePowerups.length;p++){

            if(this.activePowerups[p].expireTime <= 0 || this.activePowerups[p].uses == 0){
                eval("player." + this.activePowerups[p].type + " = false;");
                this.activePowerups.splice(p,1);
            }

        }

    }

    hasPowerup(type){

        for(p=0;p<player.activePowerups.length;p++){
            if(player.activePowerups[p].type == type){
                return true;
            }
        }

        return false;

    }

    jump() {
        this.jumpheight = this.jumps == 0.5 ? this.doubleJumpHeight : this.OGjumpheight;
        if(this.jumps == 0.5){
            var DJ = this.activePowerups[this.activePowerups.findIndex(dj => dj.type == "doublejump")]
            DJ.uses-=1;
        }
        
        if (this.jumps < 1) {
            this.onGround = false;
            this.jumping = true;
            this.yv = -this.jumpheight * this.gravityDir;
            this.jumps = this.doublejump ? this.jumps + 0.5 : this.jumps + 1;
        }
    }

}