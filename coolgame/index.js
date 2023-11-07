let startTime = performance.now();

let lastTime;
let deltaTime;

let ctx = document.getElementById('canvas').getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight

let mouseX = 0;
let mouseY = 0;
let shootDown = false;

let crosshairX = 0;
let crosshairY = 0;

const shootCoolDownTime = 5;
let shootCoolDown = shootCoolDownTime;

class Particle {

    constructor(x,y,w,h,c,xv,yv,g){

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = c;

        this.xv = xv;
        this.yv = yv;
        this.gravity = g;

        this.counter = 0;
        //this.expire = 20;

    }

    draw(){

        stage.fillStyle = this.color;
        stage.fillRect(this.x, this.y, this.w, this.h);
        stage.fillStyle = '#000';

    }

    physics(){

        this.yv += this.gravity;

        this.x+=this.xv;
        this.y+=this.yv;

    }

}

class Enemy {
    constructor(x, y, w, h, maxhealth){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.maxHealth = maxhealth;
        this.health = this.maxHealth;

        this.dead = false;
    }

    draw(ctx){
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y, this.w, this.h);

        if(!this.dead){
            ctx.fillRect(this.x - this.w/10, this.y - this.h/3, this.w + (this.w/10)* 2, this.h/10);
            ctx.fillStyle = '#268b07';
            ctx.fillRect(this.x - this.w/10, this.y - this.h/3, (this.health/this.maxHealth) * (this.w + (this.w/10)* 2), this.h/10);
        }
    }

    update(){
        if(this.health <= 0){
            this.health = 0;
            this.dead = true;
        }
    }
}

class Bullet {
    constructor(x, y, destX, destY) {
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 10;

        this.destX = destX;
        this.destY = destY;

        this.dirX = this.destX - this.x;
        this.dirY = this.destY - this.y;

        this.spd = 0.1;
        this.length = 100;

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x - this.dirX/25, this.y - this.dirY/25);
        ctx.lineTo(this.x, this.y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ffce00";
        ctx.stroke();
    }

    update() {
        this.x += this.dirX * this.spd;
        this.y += this.dirY * this.spd;
    }

    collision(obj){
        return this.x >= obj.x && this.x <= obj.x + obj.w && this.y >= obj.y && this.y <= obj.y + obj.h;
    }
}

let bullets = [];

let enemies = [new Enemy(700,300,250,250,100)];

function update() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    grd = ctx.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");
    //ctx.fillStyle = '#268b07';
    ctx.fillStyle = grd;
    ctx.fillRect(ctx.canvas.width/4, ctx.canvas.height/2,ctx.canvas.width,ctx.canvas.height/2);

    if(shootDown && shootCoolDown <= 0) {
        bullets.push(new Bullet(100,100,crosshairX, crosshairY));
        shootCoolDown = shootCoolDownTime;
    }

    shootCoolDown--;

    for(e=0;e<enemies.length;e++){
        enemy = enemies[e];
        enemy.draw(ctx);
        enemy.update();
    }

    for(b=0;b<bullets.length;b++){
        bullet = bullets[b];
        bullet.draw(ctx);
        bullet.update();

        enemyCollisionIndex = enemies.findIndex(enemy => bullet.collision(enemy));

        if(enemyCollisionIndex !== -1){
            enemies[enemyCollisionIndex].health -= 10;
            bullets.splice(b, 1);
        }

        try {
            if(bullet.x <= -100 || bullet.x >= ctx.canvas.width+100 || bullet.y <= -100 || bullet.y >= ctx.canvas.height+100){
                bullets.splice(b, 1);
            }
        } catch {}
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(crosshairX,crosshairY-50, 5, 100);
    ctx.fillRect(crosshairX-50, crosshairY, 100, 5);

    crosshairX = mouseX;
    crosshairY = mouseY;

    if(crosshairX <= ctx.canvas.width/4){
        crosshairX = ctx.canvas.width/4;
    }

}

function animationLoop(time) {
    update();
    requestAnimationFrame(animationLoop);

}
requestAnimationFrame(animationLoop);


document.addEventListener('mousemove', function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

document.addEventListener('mousedown', function(event){

    shootDown = true;

});

document.addEventListener('mouseup', function(event){

    shootDown = false;

});