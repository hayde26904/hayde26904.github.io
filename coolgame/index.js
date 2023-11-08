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

    constructor(x, y, w, h, c, xv, yv, g) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = c;

        this.xv = xv;
        this.yv = yv;
        this.xaccel = 1;
        this.yaccel = 1;
        this.gravity = g;

        this.counter = 50;

        this.onGround = false;

    }

    draw(ctx) {

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = '#000';

    }

    physics() {
        //if(this.willStay) this.counter--;
        this.yv += this.gravity;

        this.x += Math.round(this.xv);
        if(!this.onGround) this.y += Math.round(this.yv);

        if (this.xv < 0 && this.onGround) {
            this.xv+=0.1;
        } else if (this.xv > 0 && this.onGround) {
            this.xv-=0.1;
        }
    }

}

class Enemy {
    constructor(x, y, w, h, maxhealth) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.color = '#FF0000';

        this.maxHealth = maxhealth;
        this.health = this.maxHealth;

        this.dead = false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = '#FF0000';
        if (!this.dead) {
            ctx.fillRect(this.x - this.w / 10, this.y - this.h / 3, this.w + (this.w / 10) * 2, this.h / 10);
            ctx.fillStyle = '#268b07';
            ctx.fillRect(this.x - this.w / 10, this.y - this.h / 3, (this.health / this.maxHealth) * (this.w + (this.w / 10) * 2), this.h / 10);
        }
    }

    update() {
        if (this.health <= 0) {
            //this.health = 0;
            //this.dead = true;
            this.health = 100;
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
        ctx.moveTo(this.x - this.dirX / 25, this.y - this.dirY / 25);
        ctx.lineTo(this.x, this.y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ffce00";
        ctx.stroke();
    }

    update() {
        this.x += this.dirX * this.spd;
        this.y += this.dirY * this.spd;
    }

    collision(obj) {
        return this.x >= obj.x && this.x <= obj.x + obj.w && this.y >= obj.y && this.y <= obj.y + obj.h;
    }
}

function explode(size, x, y, w, h, color, g) {
    explosion = [];
    for (p = 0; p < size; p++) {
        var xv = Math.floor(Math.random() * (10 - -10 + 1)) + -10;
        var yv = Math.floor(Math.random() * (-5 - -15 + 1)) + -15;
        newPart = particles.push(new Particle(x, y, w, h, color, xv, yv, g));
        explosion.push(newPart);
    }

    return explosion;
}

let bullets = [];

let enemies = [new Enemy(700, 300, 100, 100, 100)];

let particles = [];

function update() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    grd = ctx.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");
    //ctx.fillStyle = '#268b07';
    ctx.fillStyle = grd;
    ctx.fillRect(ctx.canvas.width / 4, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height / 2);

    if (shootDown && shootCoolDown <= 0) {
        bullets.push(new Bullet(100, 100, crosshairX, crosshairY));
        shootCoolDown = shootCoolDownTime;
    }

    shootCoolDown--;

    for (e = 0; e < enemies.length; e++) {
        enemy = enemies[e];
        enemy.draw(ctx);
        enemy.update();
    }

    for (b = 0; b < bullets.length; b++) {
        bullet = bullets[b];
        bullet.draw(ctx);
        bullet.update();

        enemyCollisionIndex = enemies.findIndex(enemy => bullet.collision(enemy));

        if (enemyCollisionIndex !== -1) {
            collidedEnemy = enemies[enemyCollisionIndex];
            collidedEnemy.health -= 10;
            newExplosion = explode(1, bullet.x, bullet.y, collidedEnemy.w / 5, collidedEnemy.h / 5, collidedEnemy.color, 1);
            console.log(newExplosion);
            bullets.splice(b, 1);
        }

        try {
            if (bullet.x <= -100 || bullet.x >= ctx.canvas.width + 100 || bullet.y <= -100 || bullet.y >= ctx.canvas.height + 100) {
                bullets.splice(b, 1);
            }
        } catch { }
    }

    for (p = 0; p < particles.length; p++) {
        particle = particles[p];
        particle.draw(ctx);
        particle.physics();
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(crosshairX, crosshairY - 50, 5, 100);
    ctx.fillRect(crosshairX - 50, crosshairY, 100, 5);

    crosshairX = mouseX;
    crosshairY = mouseY;

    if (crosshairX <= ctx.canvas.width / 4) {
        crosshairX = ctx.canvas.width / 4;
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

document.addEventListener('mousedown', function (event) {

    shootDown = true;

});

document.addEventListener('mouseup', function (event) {

    shootDown = false;

});