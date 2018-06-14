var points = [];
var currentColor = [Math.trunc(Math.random()*3), Math.trunc(Math.random()*100+155),Math.trunc(Math.random() * 255)];
function getRandomAngle(){
    return (random((2*PI) * Math.pow(10,5)) / Math.pow(10, 5)); //return random gradiant angle
}
function getRandomColor(){
    var color = [random(currentColor[2]),random(currentColor[2]),random(currentColor[2])];
    color[currentColor[0]] = currentColor[1];
    return color;
}
var gPoint = function(){
    this.speed = random(3) + 1.5;
    border = Math.trunc(random(4));
    if (border == 0){
        this.x = 0;
        this.y = random(windowHeight);
    }
    else if (border == 1){
        this.x = random(windowWidth);
        this.y = windowHeight;
    }
    else if (border == 2){
        this.x  = windowWidth;
        this.y = random(windowHeight);
    }
    else if (border == 3){
        this.x = random(windowWidth);
        this.y = 0;
    }
    heading = p5.Vector.fromAngle(getRandomAngle());
    this.velX = heading.x * this.speed;
    this.velY = heading.y * this.speed;
    this.color = getRandomColor();
    points.push(this);
    this.refresh = function(){
        this.x += this.velX;
        this.y += this.velY;
        if (this.x > window.width || this.y > window.height || this.x < 0 || this.y < 0){
            points.splice(points.indexOf(this),1);
            var newPoint = new gPoint();
        }
    }
    this.show = function(){
        push();
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, 25, 25);
        pop();

    }
}
function createPoints(nbrPoints){
    for (var i = 0; i < nbrPoints; i++){
        var newPoint = new gPoint();
    }
} 
function setup(){
    var nbrPoints = Math.trunc(windowWidth/48);
    createCanvas(windowWidth, windowHeight);
    createPoints(nbrPoints);
}
function draw(){
    background(0);
    for (var i = 0; i < points.length; i++){
        points[i].refresh();
        points[i].show();
    }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    nbrPoints = Math.trunc(windowWidth/48);
    while(nbrPoints < points.length){
        points.splice(random(points.length),1);
    }
    while(nbrPoints > points.length){
        newPoint = new gPoint();
    }
}
function setCurrentColor(){
    currentColor[1] += 1;
    if (currentColor[1] >= 255){
        currentColor[0] += 1;
        currentColor[1] = 155;
    }
    if (currentColor[0] > 2){
        currentColor[0] = 0;
    }
    currentColor[2] += 1;
    if (currentColor[2] > 255){
        currentColor[2] = 0;
    }
}
setInterval(setCurrentColor,250);