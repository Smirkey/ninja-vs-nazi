var sprite = function(options, boolean, player) {
    //console.log(player)
    this.image = new Image();
    this.image.src = options.src;
    this.isOtherPlayer = boolean;
    this.raw = 0;
    this.width = options.width;
    this.height = options.height;
    this.direction = "";
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.numberOfFrames = options.numberOfFrames || 1;
    //console.log(this.image);
    if (!this.isOtherPlayer) {
        this.pos = {
            x: -50,
            y: -50
        };
    } else {
        this.pos = {
            x: player.x,
            y: player.y
        };
    }
    this.render = function(posX, posY, direction) {
        this.direction = direction;
        if (this.isOtherPlayer) {
            this.pos = {
                x: posX,
                y: posY
            };
        }
        if (this.direction == "DOWN") {
            this.raw = 0;
        } else if (this.direction == "UP") {
            this.raw = 118;
        } else if (this.direction == "LEFT") {
            this.raw = 236;
        } else if (this.direction == "RIGHT") {
            this.raw = 354;
        }
        canvas.getContext("2d").drawImage(
            this.image,
            this.frameIndex * this.width / this.numberOfFrames,
            this.raw, //a changer en fonction de la direction du player
            this.width / this.numberOfFrames,
            this.height,
            this.pos.x,
            this.pos.y,
            this.width / this.numberOfFrames,
            this.height);


    }


    this.update = function(posX, posY, direction) {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;

            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex++
            } else {
                this.frameIndex = 0;
            }
        }
        //console.log(this);
    }
}
