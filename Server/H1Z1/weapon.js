var functions = require("./functions.js");
var bullet = require('./bullet.js')
function ejectBullet(weapon){
	weapon.readyToShoot = true;
}

var Weapon = function(damages,range,firingRate,magazineSize,reloadTime,bulletSpeed,bulletSize,name){
	this.damages = damages;
	this.range = Math.round(range/bulletSpeed);
	this.firingRate = firingRate;
	this.magazineSize = magazineSize;
	this.reloadTime = reloadTime;
	this.bullets = magazineSize;
	this.readyToShoot = true;
	this.reloaded = true;
	this.bulletSpeed = bulletSpeed;
	this.name = name;
	this.bulletSize = bulletSize;

	this.ejectBullet = function(){
		this.readyToShoot = true;
	}
	this.reload = function(user){
		if (user.inventory.bullets > 0){
			if (user.inventory.bullets >= this.magazineSize){
				user.inventory.bullets -= this.magazineSize;
				this.bullets += this.magazineSize;
			}
			else{
				this.bullets = user.inventory.bullets;
				user.inventory.bullets = 0;
			}
			this.reloaded = true;

		}
	}
	this.shoot = function(map,user){
		if(this.reloaded){
			if (this.readyToShoot){
				if (this.bullets > 0){
					this.bullets -= 1;
					// fonction qui calcule orientation en fonction de vitesse
					this.otherpos = {
						x:user.mouseX,
						y: (user.middleCanvasY + user.sizeY/2)
					};

		   	 		this.vector1 = {
		   	 			x:this.otherpos.x- (user.middleCanvasX + user.sizeX/2),
		   	 			y:this.otherpos.y- (user.middleCanvasY + user.sizeY /2)
		   	 		};
		    		this.vector2 = {
		    			x:user.mouseX - (user.middleCanvasX + user.sizeX/2),
		    			y:user.mouseY - (user.middleCanvasY + user.sizeY /2)
		    		};
		    		this.v = Math.atan2(this.vector2.y,this.vector2.x) - Math.atan2(this.vector1.y,this.vector1.x);

		    		if (user.mouseX > (user.middleCanvasX + user.sizeX/2)){
		        		this.vel = {
		        			x:Math.cos(this.v),
		        			y:Math.sin(this.v)
		        		};
		    		} else {
		        		this.vel = {
		        		x:- Math.cos(this.v),
		        		y:- Math.sin(this.v)
		        		};
		   			}
					this.vel.x *= this.bulletSpeed;
					this.vel.y *= this.bulletSpeed;
					var newBullet = new bullet.Bullet(user.x + user.sizeX/2, user.y+user.sizeY/2, this.vel.x, this.vel.y, this.damages, user.id, this.range,this.bulletSize,map);
					this.readyToShoot = false;
					var _this = this;
					function eject(){
						ejectBullet(_this);
					}
					setTimeout(eject,this.firingRate);
				}
				else{
					this.reloaded = false;
					_this = this;
					function reload(){
						_this.reload(user);
					}
					setTimeout(reload,this.reloadTime);
				}
			}
		}
	}
	this.quickPack = function(){
		var data = {
			bullets:this.bullets,
			readyToShoot:this.readyToShoot,
			damages:this.damages,
			reloaded:this.reloaded,
			name:this.name,
			magazineSize:this.magazineSize,
			bulletSpeed:this.bulletSpeed
		};
		return data;
	}
}
var AK = function(){
	Weapon.call(this,20,1000,35,40,2000,12,5,"AK-47");
}
var Glock = function(){
	Weapon.call(this,15,400,500,12,1500,6,3,"GLOCK");
}
var Fist = function(){
	Weapon.call(this,15,50,300,10000,1,5,10,"Fist");
}
var Sniper = function(){
	Weapon.call(this,99,1000,1000,20,2000,20,8,"SNIPER");
}
var SMG = function(){
	Weapon.call(this,30,400,20,40,1000,16,6,"SMG");
}
var MiniGun = function(){
	Weapon.call(this,10,500,10,500,10000,11,3,"MINIGUN");
}
var AR = function(){
	Weapon.call(this,18,1200,30,50,2000,13,4,"M-16");
}
var ShotGun = function(){
	Weapon.call(this,70,300,1200,15,3000,13,30, "SHOTGUN");
}
var Grenade = function(){
	Weapon.call(this,70,400,0,1,0,5,5,"GRENADE");
	this.shoot = function(map, user){
		if (this.bullets > 0){
			user.principalWeapon = user.inventory.weapons[0];
            user.inventory.weapons.splice(0, 1);
            user.isShooting = false;
			// fonction qui calcule orientation en fonction de vitesse
			this.otherpos = {
				x:user.mouseX,
				y:user.middleCanvasY
			};

		   	 this.vector1 = {
		   	 	x:this.otherpos.x-user.middleCanvasX,
		   	 	y:this.otherpos.y-user.middleCanvasY
		   	 };
		    this.vector2 = {
		    	x:user.mouseX - user.middleCanvasX,
		    	y:user.mouseY - user.middleCanvasY
		    };
		    this.v = Math.atan2(this.vector2.y,this.vector2.x) - Math.atan2(this.vector1.y,this.vector1.x);

		    if (user.mouseX > user.middleCanvasX){
		        this.vel = {
		        	x:Math.cos(this.v),
		        	y:Math.sin(this.v)
		        };
		    } else {
		        this.vel = {
		        x:- Math.cos(this.v),
		        y:- Math.sin(this.v)
		        };
		   	}
			this.vel.x *= this.bulletSpeed;
			this.vel.y *= this.bulletSpeed;
			var newBullet = new bullet.grenade(user.x, user.y, this.vel.x, this.vel.y, this.damages, user.id, this.range,this.bulletSize,100,map);
			this.readyToShoot = false;
			var _this = this;
			function eject(){
				ejectBullet(_this);
			}
			setTimeout(eject,this.firingRate);
		}
		else{
			this.reloaded = false;
			_this = this;
			function reload(){
				_this.reload(user);
			}
			setTimeout(reload,this.reloadTime);
		}
	}
}
var FlameThrower = function(){
	Weapon.call(this,20,100,20,150,10000,4,50,"FLAMETHROWER");
}
var bulletProofVest = function(){
	Weapon.call(this,0,0,0,0,0,0,0,"Vest");
	this.shoot = function(map, user){
		if (user.armor < 25){
			user.armor += 75;
		}
		else {
			user.armor = 100;
		}
		user.principalWeapon = user.inventory.weapons[0];
        user.inventory.weapons.splice(0, 1);
	}
}
var aidKit = function(){
	Weapon.call(this,0,0,0,0,0,0,0,"AidKit");
	this.shoot = function(map, user){
		if (user.life < 50){
			user.life += 50;
		}
		else {
			user.life = 100;
		}
		user.principalWeapon = user.inventory.weapons[0];
        user.inventory.weapons.splice(0, 1);
	}
}
var drug = function(){
	Weapon.call(this,0,0,0,0,0,0,0,"Drug");
	this.shoot = function(map, user){
		user.ttlSpeed += 3;
		function resetSpeed(){
			user.ttlSpeed -= 3;
		}
		setTimeout(resetSpeed, 30000);
		user.principalWeapon = user.inventory.weapons[0];
        user.inventory.weapons.splice(0, 1);
	}
}
//damages,range,firingRate,magazineSize,reloadTime,bulletSpeed,bulletSize,name

weaponConstructors = [AK,Glock,Sniper,SMG,MiniGun,AR, ShotGun, Grenade, FlameThrower, bulletProofVest, aidKit, drug];
exports.Weapon = Weapon;
exports.AK = AK;
exports.Glock = Glock;
exports.Fist = Fist;
exports.Sniper = Sniper;
exports.SMG = SMG;
exports.MiniGun = MiniGun;
exports.AR = AR;
exports.weaponConstructors = weaponConstructors;
exports.Grenade = Grenade;
exports.FlameThrower = FlameThrower;