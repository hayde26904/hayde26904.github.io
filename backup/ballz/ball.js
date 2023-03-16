function ballConstructor(x,y,spd){

    this.x = x;
    this.y = y;
  
    this.shot = false;
  
    this.templinex = linepos.x;
    this.templiney = linepos.y;
  
    this.calcedangle = false;
  
    this.differencex = this.templinex - this.x;
    this.differencey = this.templiney - this.y;
  
    this.angle = Math.atan2(this.differencex, this.differencey) * 180 / Math.PI;
  
    this.diameter = 10;
  
    this.xv = -Math.cos(this.angle * Math.PI / 180) * this.spd;
    this.yv = -Math.sin(this.angle * Math.PI / 180) * this.spd;
  
    this.draw = function(){
      stroke(255);
      fill(255);
      circle(this.x,this.y,this.diameter);
      stroke(0);
      fill(0);
    }
  
    this.calcangle = function(){
      if(!this.calcedangle){
          this.templinex = reallinepos.x;
          this.templiney = reallinepos.y;
  
          this.differencex = this.templinex - this.x;
          this.differencey = this.templiney - this.y;
  
          this.angle = Math.atan2(this.differencey, this.differencex) * 180 / Math.PI;
  
          this.diameter = 10;
  
          this.xv = Math.cos(this.angle * Math.PI / 180) * this.spd;
          this.yv = Math.sin(this.angle * Math.PI / 180) * this.spd;
          this.calcedangle = true;
      }
      
    }
    this.update = function(){
  
      if(this.shot){
  
          this.x+=this.xv;
          this.y+=this.yv;
        
      } else {
          this.spd = ballspd;
        
      }
  
      if(this.x + this.diameter >= cvs.width){
  
        this.xv = -this.xv;
        
      }
  
      if(this.x <= 0){
  
        this.xv = -this.xv;
        
      }
  
      if(this.y <= 0){
  
        this.yv = -this.yv;
        
      }
  
      if(this.y+this.diameter >= cvs.height){
  
        this.yv = -this.yv;
        
      }
    }
    
  }