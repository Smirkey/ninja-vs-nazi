Balls = [];

function setup() {
    createCanvas(600, 600);
    background(0);
    pos = createVector(random(width),random(height));
}

function draw() {
    background(0);
    stroke(255);
    strokeWeight(15);
    point(pos.x,pos.y);
    //translate(width/2,height/2);
    //ellipse(0,0,300,300);
    //noFill();
    //stroke(255);
    for (var i = 0; i < Balls.length; i++){
        Balls[i].update();
        Balls[i].show();
    }
}

function mousePressed(){
    Balls.push(new ball());
}

function ball(mouseHeading){
    this.pos = pos;
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
    this.vel.mult(7);
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
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};
