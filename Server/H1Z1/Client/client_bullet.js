function ball(){
    this.pos = createVector(width/2,height/2);
    this.otherpos = createVector(mouseX, this.pos.y);
    this.vector1 = createVector(this.otherpos.x-this.pos.x,this.otherpos.y-this.pos.y);
    this.vector2 = createVector(mouseX - this.pos.x, mouseY - this.pos.y);
    this.v = Math.atan2(this.vector2.y,this.vector2.x) - Math.atan2(this.vector1.y,this.vector1.x);

    if (mouseX > this.pos.x){
        this.vel = createVector(Math.cos(this.v),Math.sin(this.v));
    } else {
        this.vel = createVector(- Math.cos(this.v), - Math.sin(this.v));
    }
    //this.vel.mult(0.001);
    this.update = function(){
        this.pos.add(this.vel);
    }
    this.show = function(){
        push();
        stroke(255);
        strokeWeight(4);
        point(this.pos.x,this.pos.y);
        pop();
    }

}