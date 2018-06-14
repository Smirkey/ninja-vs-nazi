function random(nbr){
	var result = Math.round(Math.random()*nbr);
	return result;	
}
function randomColor(){
	return [random(255),random(255),random(255)];
}
function isTouching(boxA,boxB){//Box defined as [posX,posY,lengthX,lengthY]
	if (( (boxA[0] - boxB[2]) <= boxB[0]) && (boxB[0] <= (boxA[0] + boxA[2]))){
		if (((boxA[1] - boxB[3])<= boxB[1])&&( boxB[1]<= (boxA[1] + boxA[3]))){
			return true;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}
function rectIsTouchingCircle(box,circle){ //Circle defined as [posX, posY,diameter]
	var radius = circle[2]/2;
	if (circle[0] + radius < box[0]
		|| circle[1] + radius < box[1]
		|| circle[0] - radius > box[0] + box[2]
		|| circle[1] - radius > box[1] + box [3]
		){
		return false;
	}
	else {
		return true;
	};
}
exports.random = random;
exports.isTouching = isTouching;
exports.randomColor = randomColor;
exports.rectIsTouchingCircle = rectIsTouchingCircle;