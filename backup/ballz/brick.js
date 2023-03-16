function brickConstructor(x,y,cw,ch,h){

    this.x = x;
    this.y = y;
    this.width = cw/8;
    this.height = ch/10.5;
  
    this.level = 0;
  
    this.colors = ['lightgreen','green','yellow','lightorange','orange','red']
  
    this.health = h;
  
    this.draw = function(){
      fill(this.colors[this.level]);
      stroke(this.colors[this.level]);
      rect(this.x,this.y,this.width,this.height);
      fill(0);
      stroke(this.colors[this.level]);
      text(this.health,this.x+this.width/2.3,this.y+this.height/1.9);
    }
  
    this.update = function(){
      
    }
    
  }