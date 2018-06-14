var sprite = function(options, boolean) {
    this.image = new Image();
    this.image.src = options.src;
    this.raw = 0;
    this.width = options.width;
    this.height = options.height;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.numberOfFrames = options.numberOfFrames || 1;
    this.render = function() {
        if (this.raw > 354) {
            this.raw = 0;
        }
        this.raw += 118;
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
