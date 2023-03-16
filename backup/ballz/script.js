var cvs;
var basepos;
var balls;
var bricks;
function setup() {
  cvs = createCanvas(window.innerWidth / 3, window.innerHeight);
  cvs.position(window.innerWidth / 3, 0);
  basepos = new p5.Vector(cvs.width / 2, cvs.height / 1.2);
  balls = [new ballConstructor(basepos.x,basepos.y,10), new ballConstructor(basepos.x,basepos.y,10), new ballConstructor(basepos.x,basepos.y,10), new ballConstructor(basepos.x,basepos.y,10), new ballConstructor(basepos.x,basepos.y,10)];
  bricks = [new brickConstructor(200,200,cvs.width,cvs.height,1)];
}

var mousepos = new p5.Vector();

var linepos = new p5.Vector();

var reallinepos = new p5.Vector();

var mousedown = false;

var shot = false;

var linedistance;

var ballspd = 0;

var brickoffset = 0;


//templineX = linepos.x;
//templineY = linepos.y;
//differenceX = templineX - ballX;
//differenceY = templineY - ballY;
//angle = Math.atan2(differenceY, differenceX) * 180 / Math.PI;
//ballXV = Math.cos(angle * Math.PI / 180) * 5;
//ballYV = Math.sin(angle * Math.PI / 180) * 5;

//var balls = [new ballConstructor(basepos.x,basepos.y,10)];

var timeout = 5;
var certainball = 0;

function drawLine(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 1;
  translate(vec.mag() - arrowSize, 0);
  pop();
}

function draw() {
  background(0);
  if(!shot){
    linepos.x = cvs.width*1.5-mousepos.x;                
    //linepos.y = constrain(-mousepos.y - cvs.height / 4, -1000, -20);
    linepos.y = constrain(cvs.height/2-mousepos.y,-1000, -20);
  }
  //linepos.x = -mousepos.x+cvs.width
  //linepos.y = -mousepos.y;

  reallinepos.x = linepos.x + cvs.width/2;
  reallinepos.y = linepos.y + cvs.height/1.2;

  linedistance = dist(basepos.x,basepos.y,reallinepos.x,reallinepos.y);

  ballspd = constrain(linedistance/25,13,20);

  bricks[0].draw();
  bricks[0].update();

  
  strokeWeight(4);
  stroke(255);
  if(mousedown && !shot){
    drawingContext.setLineDash([10,10]);
    drawLine(basepos, linepos.limit(700), 'white');
  }
  //text(ballspd, 50, 50);

  //for(i=0;i<squares.length;i++){
  drawingContext.setLineDash([]);

  for(b=0;b<balls.length;b++){

    balls[b].draw();
    balls[b].update();
    
  }
  
  if(shot){
    timeout--;
    console.log(timeout);
    if(timeout == 0){

      if(certainball < balls.length){

        balls[certainball].calcangle();
        balls[certainball].shot = true;
        timeout = 5;
      } else {

        certainball = 0;
        timeout = 5;
        
      }

      certainball++;
      
    }
    
  }
    
  //}
  
}


document.addEventListener('mousemove', function(event) {

  mousepos.x = event.clientX;
  mousepos.y = event.clientY;

});

document.addEventListener('mousedown', function(event){

  mousedown = true;
  
});

document.addEventListener('mouseup', function(event){

  mousedown = false;
  shot = true;
});

