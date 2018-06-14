var functions = require('./functions');
var Bullet = function(posX,posY,speedX,speedY,damages,shooterId,range,size,map){
	this.x = posX;  
	this.y = posY;
	this.speedX = speedX;
	this.speedY = speedY;
	this.damages = damages;
	this.shooterId = shooterId;
	this.range = range;
	this.sizeX = size;
	this.sizeY = size;
	this.size = size;
	this.chunkPos = map.getChunkPos([this.x,this.y]);
	map.chunks[this.chunkPos[0]][this.chunkPos[1]].bullets.push(this);
	this.isTouched = function(damages, shooterID,map){
		bullets.splice(bullets.indexOf(this));
	}
	this.refresh = function(map){
		chunk = map.getChunk([this.x,this.y]);
		this.range -= 1;
		if (this.range <= 0){
			chunk.bullets.splice(chunk.bullets.indexOf(this), 1);
			map.bullets.splice(map.bullets.indexOf(this), 1);
			return 0;
		}
		this.x += this.speedX;
		this.y += this.speedY;
		console.log("juji");
		if (map.getChunkPos([this.x,this.y]) != this.chunkPos){
			console.log('Before')
			map.chunks[this.chunkPos[0]][this.chunkPos[1]].bullets.splice(map.chunks[this.chunkPos[0]][this.chunkPos[1]].bullets.indexOf(this),1);
			console.log('Yeh');
			console.log(map.chunks[this.chunkPos[0]][this.chunkPos[1]].bullets)
			console.log(ap.chunks[this.chunkPos[0]][this.chunkPos[1]].bullets.indexOf(this));
			this.chunkPos = map.getChunkPos([this.x,this.y]);
			chunk.bullets.push(this);
		}
		for (id in chunk.users){
			var player = chunk.users[id];
			if (functions.rectIsTouchingCircle(player.hitBox(),this.hitBox()) && player.id != this.shooterId){
				player.isTouched(this.damages, this.shooterId,map);
				chunk.bullets.splice(chunk.bullets.indexOf(this), 1);
				map.bullets.splice(map.bullets.indexOf(this), 1);
			}
		}
		for (var x =0; x < chunk.walls.length;x++){
			if (functions.rectIsTouchingCircle(chunk.walls[x].pos,this.hitBox())){
				chunk.bullets.splice(chunk.bullets.indexOf(this), 1);
				map.bullets.splice(map.bullets.indexOf(this), 1);
			}
		}
	}
	this.quickPack = function(){ // Packed for sending to client
		var data = {
			x:this.x,
			y:this.y,
			speedX:this.speedX,
			speedY:this.speedY,
			size:this.size
		};
		return data;
	}
	this.hitBox = function(){
		return [this.x,this.y,this.size];
	}
	map.bullets.push(this);
}
var grenade = function(posX,posY,speedX,speedY,damages,shooterId,range,size,timing,map){
	Bullet.call(this, posX,posY,speedX,speedY,damages,shooterId,range,size,map);
	this.timing = timing;
	this.refresh = function(map){
		this.range -= 1;
		this.timing -= 1;
		if (this.range >= 0){
			this.x += this.speedX;
			this.y += this.speedY;
		};
		if (this.timing <= 30){
			this.sizeX += 20;
			this.sizeY += 20;
			if (this.timing <= 0){
				map.bullets.splice(map.bullets.indexOf(this), 1);
			}
		};
		for (id in map.users){
			var player = map.users[id];
			if (functions.rectIsTouchingCircle(player.hitBox(),this.hitBox()) && player.id != this.shooterId){
				player.isTouched(this.damages, this.shooterId,map);
			}
		};
		for (var x =0;x<map.walls.length;x++){
			if (functions.rectIsTouchingCircle(map.walls[x].pos,this.hitBox())){
				this.range = 0;
			}
		};
	}
}
exports.Bullet = Bullet;
exports.grenade = grenade;