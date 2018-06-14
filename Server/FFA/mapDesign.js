functions = require('./functions.js');
function merge(base, object, test){
	var touch = false;
	if (test == undefined){
		test = true;
	};
	walls = [];
	if (test){
		for (var i = object.walls.length - 1; i >= 0; i--) {
			for (var x = 0; x < base.walls.length; x++){
				if (functions.isTouching(object.walls[i],base.walls[x])){
					touch = true;
					break;
				};
			};
			if (touch == false){
				walls.push(object.walls[i]);
			}
		};
	}
	else{
		touch = false;
	}
	if (touch == false){
		for (var i = 0; i< object.walls.length; i++) {
			base.walls.push(object.walls[i]);
		};
		for (var i = 0; i < object.soils.length; i++) {
			base.soils.push(object.soils[i]);
		};
		try {
			for (var i = 0; i < object.lootSpots.length; i++) {
			base.lootSpots.push(object.lootSpots[i]);
			};
		}
		catch(e){
		}
	}
}
var orientations = ["NORTH", "SOUTH", "EAST", "WEST"];
function randomOrientation(){
	retour = orientations[functions.random(orientations.length)];
	return retour;
}
function openWall(building, wall, openingSize, wallColor){
	if (wall[2]>wall[3]){
		building.walls.push([wall[0],wall[1], Math.round(wall[2]/2 -openingSize/2),wall[3], wallColor]);
		building.walls.push([wall[0] + Math.round(wall[2]/2 + openingSize/2), wall[1], Math.round(wall[2]/2 -openingSize/2), wall[3], wallColor]);
	}
	else {
		building.walls.push([wall[0],wall[1], wall[2],Math.round(wall[3]/2 -openingSize/2), wallColor]);
		building.walls.push([wall[0], wall[1]+Math.round(wall[3]/2 +openingSize/2), wall[2], Math.round(wall[3]/2 -openingSize/2), wallColor]);
	}
}
var area = function(pos, color,z_index){
	this.walls = [];
	if (z_index){
		this.soils = [[pos[0],pos[1],pos[2], pos[3], color, z_index]];
	}
	else{
		this.soils = [[pos[0],pos[1],pos[2], pos[3], color]];
	}
	this.lootSpots = [];
}
var building  = function(pos, color,openingSides, wallSize, openingSize, loots, wallColor){
	area.call(this, pos, color,1);
	this.pos = pos;
	this.color = color;
	this.openingSize = openingSize;
	this.openingSides = openingSides;
	this.wallSize = wallSize;
	this.lootSpots = [];
	if (loots == true || loots == undefined){
		for (var i = 1; i <= pos[2] * pos[1];){
			i += 10000;
			i *= 3;
			this.lootSpots.push([this.pos[0] + functions.random(this.pos[2]), this.pos[1] +functions.random(this.pos[3])]);
		};
	}
	if (this.openingSides.indexOf("TOP")>=0){
		this.walls.push([pos[0], pos[1], Math.round(pos[2]/2 - this.openingSize/2), this.wallSize, wallColor]);
		this.walls.push([pos[0] + Math.round(pos[2]/2 + this.openingSize/2), pos[1],Math.round(pos[2]/2 -this.openingSize/2), this.wallSize, wallColor]);
	}
	else {
		this.walls.push([pos[0],pos[1],pos[2],this.wallSize, wallColor]);
	}
	if (this.openingSides.indexOf("BOTTOM">=0)){
		this.walls.push([pos[0], pos[1] + pos[3], Math.round(pos[2]/2 - this.openingSize/2), this.wallSize, wallColor]);
		this.walls.push([pos[0] + Math.round(pos[2]/2 + this.openingSize/2), pos[1] + pos[3],Math.round(pos[2]/2 -this.openingSize/2), this.wallSize, wallColor]);
	}
	else {
		this.walls.push([pos[0],pos[1] + pos[3],pos[2],this.wallSize, wallColor]);
	}
	if (this.openingSides.indexOf("RIGHT">=0)){
		this.walls.push([pos[0]+pos[2],pos[1],this.wallSize,Math.round(this.pos[3]/2 - this.openingSize/2), wallColor]);
		this.walls.push([pos[0]+pos[2], pos[1] + Math.round(pos[3]/2 + this.openingSize/2), this.wallSize, Math.round(this.pos[3]/2 - this.openingSize/2), wallColor]);
	}
	else{
		this.walls.push([pos[0] + pos[2], pos[1], this.wallSize, pos[3], wallColor]);
	}
	if (this.openingSides.indexOf("LEFT">=0)){
		openWall(this,[pos[0],pos[1],this.wallSize,pos[3]], openingSize, wallColor);
	}
	else{
		this.walls.push([pos[0],pos[1],this.wallSize,pos[3], wallColor]);
	}
	this.addRoom = function(pos){
		openWall(this,[this.pos[0] + pos[0], this.pos[1] + pos[1],this.pos[0] + pos[2], this.pos[1] + pos[1], wallColor]);
		this.walls.push([this.pos[0]+pos[2], this.pos[1] + pos[3], this.pos[0] + pos[2], this.pos[1] + pos[1], wallColor]);
	}
}
var genericHouse = function(pos, color, orientation){
	openings = [];
	if (color == undefined){
		color = functions.randomColor();
	}
	if (orientation == "NORTH"){
		openings.push("TOP");
		if (functions.random(2) == 0){
			openings.push("BOTTOM");
		}
	}
	else if (orientation == "SOUTH"){
		openings.push("BOTTOM");
		if (functions.random(2) == 0){
			openings.push("TOP");
		}
	}
	else if (orientation == "EAST"){
		openings.push("RIGHT");
		if (functions.random(2) == 0){
			openings.push("LEFT");
		}
	}
	else if (orientation == "WEST"){
		openings.push("LEFT");
		if (functions.random(2) == 0){
			openings.push("RIGHT");
		}
	}
	building.call(this, pos, color, openings, 7, 70,true, [200,100,0]);
	//this.addRoom([0,Math.round(pos[2]/2)-10,Math.round(pos[3]/2)-10,0]);
	//this.addRoom([functions.random(pos[2]), pos[3], pos[2],functions.random(pos[3])]);
}
var largeHouse = function(pos,orientation,color){
	if (orientation == "NORTH" || orientation == "SOUTH"){
		pos.push(functions.random(300) + 800);
		pos.push(functions.random(200) + 400);
	}
	else {
		pos.push(functions.random(200) + 400);
		pos.push(functions.random(300) + 800);
	}
	genericHouse.call(this,pos,color,orientation);
}
var mediumHouse = function(pos,orientation,color){
 	if (orientation == "NORTH" || orientation == "SOUTH"){
		pos.push(functions.random(200) + 400);
		pos.push(functions.random(200) + 200);
	}
	else {
		pos.push(functions.random(200) + 200);
		pos.push(functions.random(200) + 400);
	}
	genericHouse.call(this,pos,color,orientation);
}

var smallHouse = function(pos,orientation,color){
 	if (orientation == "NORTH" || orientation == "SOUTH"){
		pos.push(functions.random(100) + 200);
		pos.push(functions.random(200) + 200);
	}
	else {
		pos.push(functions.random(200) + 200);
		pos.push(functions.random(100) + 200);
	}
	genericHouse.call(this,pos,color,orientation);
}
var hut = function(pos, orientation){
	smallHouse.call(this, pos, orientation, [185,122,87]);
}

var church = function(pos,orientation){
	if (orientation == "NORTH" || orientation == "SOUTH"){
		pos.push(functions.random(200) + 400);
		pos.push(functions.random(400) + 1800);
	}
	else {
		pos.push(functions.random(400) + 1800);
		pos.push(functions.random(200) + 400);
	}
	if (orientation == "NORTH"){
		opening = "TOP";
	}
	else if (orientation == "SOUTH"){
		opening = "BOTTOM";
	}
	else if (orientation == "EAST"){
		opening = "RIGHT";
	}
	else if (orientation == "WEST") {
		opening = "LEFT";
	};
	building.call(this, pos, [255,255,0],[opening], 15, 100, true, [150,150,150]);
}
var factory = function(pos,orientation){
	if (orientation in ["NORTH", "SOUTH"]){
		pos.push(functions.random(300) + 1300);
		pos.push(functions.random(200) + 900);
	}
	else {
		pos.push(functions.random(200) + 900);
		pos.push(functions.random(300) + 1300);
	}
	if (orientation == "NORTH"){
		openings = ["TOP","LEFT"];
	}
	else if (orientation == "SOUTH"){
		opening = ["BOTTOM","RIGHT"];
	}
	else if (orientation == "EAST"){
		opening = ["RIGHT", "BOTTOM"];
	}
	else if (orientation == "WEST") {
		openings = ["LEFT"];
	};
	building.call(this, pos, [130,0,0],opening, 8, 100, true, [0,0,90]);
}
var superMarket = function(pos){
	pos.push(2000);
	pos.push(900);
	building.call(this, pos, [0,255,0],["NORTH","SOUTH"], 8, 100, true, [80,40,0]);
}
var Road = function(pos){
	area.call(this, pos, [127,127,127],1);
}
var tree = function(pos){
	pos.push(functions.random(80)+20);
	pos.push(functions.random(80)+20);
	pos.push([0,128,0]);
	area.call(this,pos, [0,128,0]);
	this.walls.push(pos);
}
var rock = function(pos){
	pos.push(functions.random(150));
	pos.push(functions.random(150));
	pos.push([100,100,100]);
	area.call(this,pos, [100,100,100]);
	this.walls.push(pos);
}
var Forest = function(pos, orientation){
	area.call(this,pos, [180,240,157]);
	var nbrHuts = Math.round((pos[3] * pos[2])/3000000);
	var nbrTrees = Math.round((pos[3] * pos[2]) /100000);
	for(var i =0; i < nbrHuts;i++){
		merge(this, new hut([pos[0]+functions.random(pos[2]),pos[1]+functions.random(pos[3])], randomOrientation()));
	};
	for (var i = 0; i < nbrTrees;i++){
		merge(this, new tree([pos[0]+functions.random(pos[2]),pos[1]+functions.random(pos[3])]));
	};
}
var District = function(pos,orientation){
	pos.push(3400);
	pos.push(2700);
	this.pos = pos;
	area.call(this,pos,[170,230,140]);
	mainRoad = new Road([this.pos[0] + 1500,this.pos[1],200, 2100]);
	road1 = new Road([this.pos[0],this.pos[1] + 500, 3400,100]);
	road2 = new Road([this.pos[0],this.pos[1] + 1500, 3400,100]);
	smallHouse1 = new smallHouse([this.pos[0] + 650, this.pos[1] + 100],"SOUTH");
	smallHouse2 = new smallHouse([this.pos[0] + 2350, this.pos[1] + 600], "NORTH");
	smallHouse3 = new smallHouse([this.pos[0] + 650, this.pos[1] + 1100], "SOUTH");
	smallHouse4 = new smallHouse([this.pos[0] + 650, this.pos[1] + 1100], "NORTH");
	mediumHouse1 = new mediumHouse([this.pos[0] + 1700, this.pos[1] + 100], "SOUTH");
	mediumHouse2 = new mediumHouse([this.pos[0] + 2500, this.pos[1] + 100], "SOUTH");
	mediumHouse3 = new mediumHouse([this.pos[0] + 100, this.pos[1] + 600], "NORTH");
	mediumHouse4 = new mediumHouse([this.pos[0] + 900, this.pos[1] + 600], "NORTH");
	mediumHouse5 = new mediumHouse([this.pos[0] + 1700, this.pos[1] + 1100], "SOUTH");
	mediumHouse6 = new mediumHouse([this.pos[0] + 2500, this.pos[1] + 1100], "SOUTH");
	mediumHouse7 = new mediumHouse([this.pos[0] + 100, this.pos[1] + 1600], "NORTH");
	mediumHouse8 = new mediumHouse([this.pos[0] + 900, this.pos[1] + 1600], "NORTH");
	mainHouse = new largeHouse([this.pos[0] + 1600 - 475, pos[1] + 2100],"NORTH");
	this.data = [mainRoad, road1, road2, smallHouse1, smallHouse2, smallHouse3, smallHouse4, mediumHouse1, mediumHouse2, mediumHouse3,mediumHouse4,mediumHouse5, mediumHouse6, mediumHouse7, mediumHouse8, mainHouse];
	for(var i = 0; i<this.data.length;i++){
		merge(this, this.data[i]);
	};
}
var Plain = function(pos, orientation){
	area.call(this,pos,[180,240,157]);
	var nbrRocks = Math.round((pos[3] * pos[2]) / 1000000);
	var nbrTrees = Math.round((pos[3] * pos[2])/3000000);
	merge(this, new factory([pos[0] + pos[2]/2, pos[1] + pos[3]/2], orientation));
	for (var i = 0; i < nbrTrees;i++){
		merge(this, new tree([pos[0]+functions.random(pos[2]),pos[1]+functions.random(pos[3])]));
	};
	for (var i = 0; i < nbrRocks;i++){
		merge(this, new rock([pos[0]+functions.random(pos[2]),pos[1]+functions.random(pos[3])]));
	};
}
var City = function(pos,orientation){
	area.call(this,[pos[0],pos[1],9600, 2700],[180,240,157]);
	this.road1 = new Road([pos[0] + 3199, pos[1] + 500, 3202, 100]);
	this.road2 = new Road([pos[0] + 3199, pos[1] + 1500, 3202, 100]);
	this.district1 = new District([pos[0], pos[1]],"NORTH");
	this.district2 = new District([pos[0] + 6399, pos[1]],"NORTH");
	this.church = new church([pos[0] + 3700, pos[1] + 1850],'WEST');
	this.superMarket = new superMarket([pos[0] + 3800, pos[1] + 600]);
	this.data = [this.road1, this.road2, this.district1, this.district2, this.church, this.superMarket];
	for(var i = 0; i<this.data.length;i++){
		merge(this, this.data[i], false);
	};
}
var StandardDesign = {
	walls:[
		//map borders start
		[0,0,5000,5],
		[0,0,5,3000],
		[5000,0,5,3000],
		[0,3000,5000,5],
		//map boders end
		//church starts
		[700,200,400,20],
		[1100,200,20,100],//church door starts
		[1100,400,20,100],//church door ends
		[700,500,400,20],
		[700,200,20,300],
		//church ends
		//red building starts
		[1500,2500,450,7], // top opening starts
		[2050,2500,450,7], // top opening ends
		[2500,2500,7,175], // right opening starts
		[2500,2725,7,175], // right opening ends
		[1500,2900,1000,7], // back
		[1500,2500,7,400], //left
		//red building ends
		//blue house starts
		[3800,2100,200,7], // top
		[4000,2100,7,50], //right opening starts
		[4000,2200,7,100], // rigth opening ends
		[3800,2300,200,7], // back
		[3800,2100,7,200], // left
		//blue house ends
		//purple house starts
		[4050,2320,100,7], // top opening starts
		[4200,2320,50,7], // top opening ends
		[4250,2320,7,400], // right
		[4050,2720,50,7], // back opening starts
		[4150,2720,100,7],// back opening ends
		[4050,2320,7,400] // left
		//purple house ends
	],
	soils:[
		[0,1500,5000,200,[127,127,127]], // Principal road
		[700,200,400,300,[255,255,0]], // church
		[1500,2500,1000,400,[230,50,50]], // red building
		[4000,1700,200,600,[127,127,127]], // houses allee
		[3800,2100,200,200,[0,160,230]],//blue house
		[4050,2320,200,400,[160,70,160]] // purple house

	]
};
var Forest1Districts2 = function(pos){
	building.call(this,pos,[0,0,0],[],7,10);
	this.soils = [];
	this.forest = new Forest([pos[0], pos[1], pos[2], 2000],"NORTH");
	this.district1 = new District([pos[0], pos[1] + 2100],"NORTH");
	this.district2 = new District([pos[0] + 3500, pos[1] + 2100],"NORTH");
	this.data = [ this.forest, this.district1, this.district2];

	for(var i = 0; i<this.data.length;i++){
		merge(this, this.data[i], false);
	};
}
var ForestPlainCity = function(pos){
	building.call(this,pos,[0,0,0],[],7,10, false, [0,0,0]);
	this.soils = [];
	this.mainRoad = new Road([pos[0], pos[1] + 3999,9800,400]);
	this.forest = new Forest([pos[0], pos[1], 4800, 4000],"NORTH");
	this.plain = new Plain([pos[0] + 4800, pos[1], 4800, 4000],"SOUTH");
	this.city = new City([pos[0], pos[1] + 4399],"NORTH");
	this.data = [ this.mainRoad, this.forest, this.plain, this.city];

	for(var i = 0; i<this.data.length;i++){
		merge(this, this.data[i], false);
	};
}
exports.StandardDesign = StandardDesign;
exports.Forest = Forest;
exports.District = District;
exports.Forest1Districts2 = Forest1Districts2;
exports.ForestPlainCity = ForestPlainCity;