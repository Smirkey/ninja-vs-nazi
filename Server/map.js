var user = require('./user');
var functions = require('./functions');
var wall = require('./wall.js');
var mapDesign = require('./mapDesign.js');
var Map = function Map(){
	this.maxX = 9800;
	this.maxY = 7100;
	this.maxXVisible = 1400;
	this.maxYVisible = 700;
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
	this.defineVisible = function(user){
		var visiblePlayers = [];
		visibleBox = [user.x-user.middleCanvasX,user.y-user.middleCanvasY, user.canvasSizeX,user.canvasSizeY];
		for (var p in this.users){
			var player = this.users[p];
			if (player.id != user.id && functions.isTouching(visibleBox,player.hitBox())){
				visiblePlayers.push(player.quickPack());
			}
		}
		var visibleBullets = [];
		for (var b = 0; b < this.bullets.length;b++){
			ball = this.bullets[b];
			//console.log([user.x-this.vDX,user.y-this.vDY, this.visibleDistanceX,this.visibleDistanceY]);
			//console.log([ball.x,ball.y,3,3]);
			if (functions.rectIsTouchingCircle(visibleBox,ball.hitBox())){
				visibleBullets.push(ball.quickPack());
			}
		}
		var visibleLoots = [];
		for (var i = 0; i < this.loots.length;i++){
			loot = this.loots[i];
			if (functions.isTouching(visibleBox,loot.hitBox())){
				visibleLoots.push(loot.quickPack());
			}
		}
		var visibleWalls = [];
		for (var i = 0; i < this.walls.length;i++){
			wall = this.walls[i];
			if (functions.isTouching(visibleBox,wall.pos)){
				visibleWalls.push(wall);
			}
		}
		var visibleSoils = [];
		for (var i = 0; i < this.soils.length;i++){
			soil = this.soils[i];
			if (functions.isTouching(visibleBox,soil.pos)){
				visibleSoils.push(soil);
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
	this.refreshLoots = function(){
		for (var i =0; i<this.loots.length;i++){
			this.loots[i].refresh(this);
			}
	}

}
exports.Map = Map;
exports.User = user.User;
