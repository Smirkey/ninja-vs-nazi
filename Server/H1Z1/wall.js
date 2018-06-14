functions = require('./functions.js');
var Wall = function(map,pos,color){ //Pos defined as [posXa,posYa,l,w]
	if (color == undefined){
		color = [200,100,0];
	}
	this.pos = pos;
	this.color = color;
	map.walls.push(this);
};
var Soil = function(map,data){
	this.pos = [data[0],data[1],data[2],data[3]];
	this.color = data[4];
	if (data[5]){
		this.z_index = data[5];
	}
	else {
		this.z_index = 0;
	}
	map.soils.push(this);
}
exports.Wall = Wall;
exports.Soil = Soil;