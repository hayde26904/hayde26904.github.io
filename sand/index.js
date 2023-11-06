let ctx = document.getElementById('canvas').getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let lastTime = 0;

const gravity = 3;

let grainColors = ['#C2B280','#8f835d','#cfbd84','#ebd696'];

class Grain {
    constructor(x,y,c){
        this.x = x;
        this.y = y;
        this.c = c[Math.floor(Math.random() * (c.length - 1))];

        this.xv = 0;
        this.yv = 0;

        this.onGround = false;
    }

    draw(ctx){
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, 10,10);
    }

    physics(gravity){
        if(!this.onGround){
            this.yv += gravity;
            this.x += this.xv;
            this.y += this.yv;
        }
    }
}

let grains = [];
let otherGrains = [];

for(i=0;i<100;i++){
    grains.push(new Grain(Math.floor(Math.random()*500),Math.floor(Math.random()*300),grainColors))
}

function update(timestamp){
    const deltaTime = (timestamp - lastTime)/1000;

    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

    otherGrains = grains;

    for(g=0;g<grains.length;g++){
        grain = grains[g];
        grain.draw(ctx);
        grain.physics(gravity);

        if(grain.y >= ctx.canvas.height){
            grain.y = ctx.canvas.height-10;
            grain.onGround = true;
        }



        /*for(o=0;o<grains.length;o++){
            otherGrain = grains[o];
            grainOverlapIndex = grains.findIndex(g => (otherGrain.x == g.x && otherGrain.y == g.y));
            if(grainOverlapIndex !== -1){
                eval('grain.' + ['x+=1;','x-=1;','y+=1','y-=1'][Math.floor(Math.random()*4)]);
            }
            
        }*/
    }

    lastTime = timestamp;
    requestAnimationFrame(update);

}

requestAnimationFrame(update);