var user = require('./user');
var functions = require('./functions');
var wall = require('./wall.js');
var mapDesign = require('./mapDesign.js');
var chunkSizeX = 960;
var chunkSizeY = 540;
function getChunk(pos, chunks){
	var y = Math.round(pos[1] / chunkSizeY);
	var x = Math.round(pos[0] / chunkSizeX);
	return chunks[y][x];
}
function getVisibleChunks(pos,chunks, maxXVisible, maxYVisible){
	var y = Math.round(pos[1] / chunkSizeY);
	var x = Math.round(pos[0] / chunkSizeX);
	visibleChunks = [];
	for (var y1 = 0; y1 < maxYVisible/2; y1+= chunkSizeY){
	 	for (var x1 = 0; x1 < maxXVisible / 2; x1 += chunkSizeX){
	 		visibleChunks.push(chunks[y + Math.round(y1 / chunkSizeY)][ x + Math.round(x1 / chunkSizeX)]);
	 		visibleChunks.push(chunks[y - Math.round(y1 / chunkSizeY)][ x - Math.round(x1 / chunkSizeX)]);
	 	};
	 };
	return visibleChunks;

}
var Chunk = function(map, startX, startY, sizeX, sizeY){
	this.walls = [];
	this.loots = [];
	this.users = [];
	this.bullets = [];
	this.soils = [];
	this.startX = startX;
	this.startY = startY;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.hitbox = function(){
		return [this.startX, this.startY, this.sizeX, this.sizeY];
	}
	this.fillWalls = function(map){
		for (var i = 0; i<map.walls.length; i++){
			if (functions.isTouching(map.walls[i].pos, this.hitbox())){
				this.walls.push(map.walls[i]);
			};
		};
	}
	this.fillLoots = function(map){
		for (var i = 0; i<map.loots.length; i++){
			if (functions.isTouching(map.loots[i].hitBox(), this.hitbox())){
				this.loots.push(map.loots[i]);
			};
		};
	}
	this.fillSoils = function(map){
		for (var i = 0; i < map.soils.length; i++){
			if (functions.isTouching(map.soils[i].pos, this.hitbox())){
				this.soils.push(map.soils[i]);
			}
		}
	}
	this.fill = function(map){
		this.fillWalls(map);
		this.fillLoots(map);
		this.fillSoils(map);
	}
}
var Map = function Map(){
	this.maxX = 9800;
	this.maxY = 7100;
	this.maxXVisible = 1920;
	this.maxYVisible = 1080;
	this.mapDesign = new mapDesign.ForestPlainCity([0,0, 9800, 7100],"NORTH");
	this.visibleDistanceX = Math.round(this.maxXVisible/2);
	this.visibleDistanceY = Math.round(this.maxYVisible/2);
	this.vDX = this.visibleDistanceX;
	this.vDY = this.visibleDistanceY;
	this.bullets = [];
	this.loots = [];
	this.walls = [];
	for (var i = 0;i<this.mapDesign.walls.length;i++){
		color = this.mapDesign.walls[i][4];
		try {
			this.mapDesign.walls[i].splice(4,1);
		}
		catch(e){
			console.log("ERROOR WALLING");
		}
		new wall.Wall(this,this.mapDesign.walls[i], color);
	}
	this.soils = [];
	for (var i = 0;i<this.mapDesign.soils.length;i++){
		new wall.Soil(this,this.mapDesign.soils[i]);
	}
	for (var i = 0; i <this.mapDesign.lootSpots.length;i++){
		this.loots.push(new user.Loot(this, this.mapDesign.lootSpots[i]));
	}
	this.chunks = [];
	for (var y = 0; y < this.maxY; y+=chunkSizeY){
		var newLine = [];
		for (var x = 0; x < this.maxX; x += chunkSizeX){
			newChunk = new Chunk(this, x, y, chunkSizeX, chunkSizeY);
			newChunk.fill(this);
			newLine.push(newChunk);
		};
		this.chunks.push(newLine);
	}
	this.users = {};
	this.minimap = [];
	for (var i = 0; i<this.maxY; i+=(this.maxY/200)){
		var newLine = [];
		for (var x = 0; x<this.maxX; x+= (this.maxX/200)){
			var newColor = [127,127,127];
			for (var y = 0; y < this.soils.length; y++){
				if (functions.isTouching(this.soils[y].pos,[x,i,10,10])){
					newColor = this.soils[y].color;
				}
			};
			newLine.push(newColor);
		};
		this.minimap.push(newLine);
	};
	this.addLoot = function(){
		newLoot = new user.Loot(this, this.mapDesign.lootSpots[functions.random(this.mapDesign.lootSpots).length]);
		getChunk([newLoot.x, newLoot.y], this.chunks).loots.push(newLoot);
	}
	this.defineVisible = function(user){
		var visibleChunks = this.getVisibleChunks([user.x, user.y]);
		var visiblePlayers = [];
		var visibleBullets = [];
		var visibleLoots = [];
		var visibleWalls = [];
		var visibleSoils = [];
		visibleBox = [user.x-user.middleCanvasX,user.y-user.middleCanvasY, user.canvasSizeX,user.canvasSizeY];
		for (var w = 0; w < visibleChunks.length;w++){
			chunk = visibleChunks[w];
			for (var p in chunk.users){
				var player = chunk.users[p];
				if (player.id != user.id && functions.isTouching(visibleBox,player.hitBox())){
					visiblePlayers.push(player.quickPack());
				}
			}
			for (var b = 0; b < chunk.bullets.length;b++){
				ball = chunk.bullets[b];
				if (functions.rectIsTouchingCircle(visibleBox,ball.hitBox())){
					visibleBullets.push(ball.quickPack());
				}
			}
			for (var i = 0; i < chunk.loots.length;i++){
				loot = chunk.loots[i];
				if (functions.isTouching(visibleBox,loot.hitBox())){
					visibleLoots.push(loot.quickPack());
				}
			}
			for (var i = 0; i < chunk.walls.length;i++){
				wall = chunk.walls[i];
				if (functions.isTouching(visibleBox,wall.pos)){
					visibleWalls.push(wall);
				}
			}
			for (var i = 0; i < chunk.soils.length;i++){
				soil = chunk.soils[i];
				if (functions.isTouching(visibleBox,soil.pos)){
					visibleSoils.push(soil);
				}
			}
		}
		var retour = {
			visibleBullets:visibleBullets,
			visiblePlayers:visiblePlayers,
			visibleLoots:visibleLoots,
			visibleWalls:visibleWalls,
			visibleSoils:visibleSoils
		};
		return retour ;
	}
	this.refreshBullets = function(){
		for (id in this.users){
			this.users[id].refresh(this);
		};
		for (var i =0; i<this.bullets.length;i++){
			this.bullets[i].refresh(this);
			};	
	}
	this.getChunkPos = function(pos){
		var y = Math.trunc(pos[1] / chunkSizeY);
		var x = Math.trunc(pos[0] / chunkSizeX);
		return [y,x];
	}
	this.getChunk = function(pos){
		var y = Math.trunc(pos[1] / chunkSizeY);
		var x = Math.trunc(pos[0] / chunkSizeX);
		return this.chunks[y][x];
	}
	this.getVisibleChunks = function(pos){
		var y = Math.trunc(pos[1] / chunkSizeY);
		var x = Math.trunc(pos[0] / chunkSizeX);
		visibleChunks = [];
		pushedYChunks = [y, y, y, y+1, y+1,y+1,y-1,y-1,y-1];
		pushedXChunks = [x, x+1, x-1, x,x+1,x-1,x,x+1,x-1];
		for (var i = 0; i < pushedXChunks.length; i++){
			try{
				newChunk = this.chunks[pushedYChunks[i]][pushedXChunks[i]];
				if (newChunk != undefined){
					visibleChunks.push(newChunk);
				}
			}
			catch(e){
				
			}
		}
		/*for (var y1 = 0; y1 < this.maxYVisible/2;y1+= chunkSizeY){
			y1+= chunkSizeY;
		 	for (var x1 = 0; x1 < this.maxXVisible/2;){
		 		x1 += chunkSizeX;
		 		console.log([this.chunks[y + Math.trunc(y1 / chunkSizeY)][ x + Math.trunc(x1 / chunkSizeX)].startX,this.chunks[y + Math.trunc(y1 / chunkSizeY)][ x + Math.trunc(x1 / chunkSizeX)].startY]);
		 		console.log([this.chunks[y - Math.trunc(y1 / chunkSizeY)][ x - Math.trunc(x1 / chunkSizeX)].startX,this.chunks[y - Math.trunc(y1 / chunkSizeY)][ x - Math.trunc(x1 / chunkSizeX)].startY]);
		 		console.log([this.chunks[y + Math.trunc(y1 / chunkSizeY)][ x - Math.trunc(x1 / chunkSizeX)].startX,this.chunks[y + Math.trunc(y1 / chunkSizeY)][ x - Math.trunc(x1 / chunkSizeX)].startY]);
		 		console.log([this.chunks[y - Math.trunc(y1 / chunkSizeY)][ x + Math.trunc(x1 / chunkSizeX)].startX,this.chunks[y - Math.trunc(y1 / chunkSizeY)][ x + Math.trunc(x1 / chunkSizeX)].startY]);
		 		visibleChunks.push(this.chunks[y + Math.trunc(y1 / chunkSizeY)][ x + Math.trunc(x1 / chunkSizeX)]);
		 		visibleChunks.push(this.chunks[y - Math.trunc(y1 / chunkSizeY)][ x - Math.trunc(x1 / chunkSizeX)]);
		 		visibleChunks.push(this.chunks[y + Math.trunc(y1 / chunkSizeY)][ x - Math.trunc(x1 / chunkSizeX)]);
		 		visibleChunks.push(this.chunks[y - Math.trunc(y1 / chunkSizeY)][ x + Math.trunc(x1 / chunkSizeX)]);
		 	};
		};*/
		return visibleChunks;

	}

}
exports.Map = Map;
exports.User = user.User;