var functions = require("./functions");
var weapon = require('./weapon.js');
var Loot = function(map, pos) {
    this.x = pos[0];
    this.y = pos[1];
    this.weapons = [new weapon.weaponConstructors[functions.random(weapon.weaponConstructors.length - 1)]()];
    this.bullets = functions.random(100);
    this.stuffs = [];
    this.hitBox = function() {
        return [this.x, this.y, 40, 40];
    }
    this.quickPack = function() {
        packedWeapons = [];
        for (var i = 0; i < this.weapons.length; i++) {
            packedWeapons.push(this.weapons[i].quickPack())
        }
        var data = {
            x: this.x,
            y: this.y,
            bullets: this.bullets,
            weapons: packedWeapons
        };
        return data;
    }
}
var Inventory = function() {
    this.weapons = [];
    this.foods = [];
    this.bullets = 0;
    this.quickPack = function() {
        weaponsPacked = [];
        for (var i = 0; i < this.weapons.length; i++) {
            weaponsPacked.push(this.weapons[i].quickPack());
        }
        var data = {
            weapons: weaponsPacked,
            foods: this.foods,
            bullets: this.bullets
        };
        return data;
    }
}
var User = function(skin, pseudo, id, map) {
    console.log("User created");
    this.resizeCanvas = function(canvasSize){
        this.canvasSizeX = canvasSize[0];
        this.canvasSizeY = canvasSize[1];
        this.middleCanvasX = Math.round(this.canvasSizeX/2);
        this.middleCanvasY = Math.round(this.canvasSizeY/2);
    }
    this.pseudo = pseudo;
    this.id = id;
    this.deathCounter = 0;
    this.kills = 0;
    this.skin = skin;

    this.hitBox = function() {
        return [this.x, this.y, this.sizeX, this.sizeY];
    }
    this.start = function(map) {
        var inWall = 1;
        while (inWall){
            this.x = functions.random(map.maxX);
            this.y = functions.random(map.maxY);
            inWall = 0;
            for (var i = 0; i < map.walls.length; i++){
                if (functions.isTouching(this.hitBox(),map.walls[i])){
                    inWall = 1;
                    break;

                }
            }
        }
        this.sizeX = 30;
        this.sizeY = 50;
        this.speed = {
            x: 0,
            y: 0
        };
        this.life = 100;
        this.standstill = true;
        this.isShooting = false;
        this.heading = 0;
        this.visibleBullets = [];
        this.visiblePlayers = [];
        this.visibleLoots = [];
        this.visibleWalls = [];
        this.visibleSoils = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.direction = 0;
        this.inventory = new Inventory();
        this.principalWeapon = new weapon.Glock();
        this.ranking = Object.keys(map.users).length + 1;
        this.armor = 0;
        this.ttlSpeed = 8;
        this.chunkPos = map.getChunkPos([this.x,this.y]);
        map.chunks[this.chunkPos[0]][this.chunkPos[1]].users.push(this);
    }
    this.start(map);
    this.resizeCanvas([1920,1080]);
    this.color = (functions.random(255), functions.random(255), functions.random(255));
    this.die = function(shooterId, map) {
        this.deathCounter += 1;
        map.users[shooterId].kills += 1;
        newLoot = new Loot(map,[this.x, this.y]);
        newLoot.weapons = this.inventory.weapons;
        newLoot.bullets  = this.inventory.bullets;
        newLoot.weapons.push(this.principalWeapon);
        map.loots.push(newLoot);
        this.start(map);
    }
    this.isTouched = function(damages, shooterId, map) {
        if (shooterId != this.id) {
            if (this.armor > 0){
                if (this.armor > damages){
                    this.armor -= damages;
                }
                else {
                    this.life -= (damages - this.armor);
                    this.armor = 0;
                }
            }
            else {
                this.life -= damages;
                if (this.life <= 0) {
                    this.die(shooterId, map);
                }
            }
        }
    }
    this.setDirection = function(direction) {
        this.direction = direction;
    }
    this.move = function(direction, map) {
        if (direction == "UP") {
            this.speed.y =- this.ttlSpeed;
        } else if (direction == "DOWN") {
            this.speed.y = this.ttlSpeed;
        } else if (direction == "LEFT") {
            this.speed.x = -this.ttlSpeed;
        } else if (direction == "RIGHT") {
            this.speed.x = this.ttlSpeed;
        }
        if (direction == "NOUP") {
            this.speed.y = 0;
        } else if (direction == "NODOWN") {
            this.speed.y = 0;
        } else if (direction == "NOLEFT") {
            this.speed.x = 0;
        } else if (direction == "NORIGHT") {
            this.speed.x = 0;
        }
        newPosX = this.x + this.speed.x;
        newPosY = this.y + this.speed.y;
        chunkPos = map.getChunkPos([this.x,this.y]);
        var yes = true;
        for (var i = 0; i<this.visibleWalls.length;i++){
            if (functions.isTouching(this.visibleWalls[i].pos,[newPosX,newPosY,this.sizeX,this.sizeY])){
                yes = false;
                break;
            }
        }

        if (yes){
            this.x += this.speed.x;
            this.y += this.speed.y;
        }
        if (chunkPos != this.chunkPos){
            map.chunks[chunkPos[0]][chunkPos[1]].users.push(this);
            map.chunks[this.chunkPos[0]][this.chunkPos[1]].users.splice(map.chunks[this.chunkPos[0]][this.chunkPos[1]].users.indexOf(this), 1);
            this.chunkPos = chunkPos;
        }
        for (var i = 0; i < map.chunks[chunkPos[0]][chunkPos[1]].loots.length; i++){
            loot = map.chunks[chunkPos[0]][chunkPos[1]].loots[i];
            if (functions.isTouching(this.hitBox(), loot.hitBox())){
                this.loot(loot, map);
            }
        }
        if (this.speed.x == this.speed.y == 0){
          this.standstill = true;
        } else {
          this.standstill = false;
        }
    }
    this.quit = function(map) {
        delete map.users[this.id];
        for (var b = 0; b < map.bullets.length; b++) {
            ball = map.bullets[b];
            if (ball.shooterId == this.id) {
                map.bullets.splice(map.bullets.indexOf(ball));
            }
        } // Called when player disconnected
    }
    this.shoot = function(map) {
        this.principalWeapon.shoot(map, this);
    }
    this.updateData = function(map) {
        if (this.direction != 0) {
            this.move(this.direction, map);
        }
        var data = map.defineVisible(this);
        this.visibleBullets = data.visibleBullets;
        this.visiblePlayers = data.visiblePlayers;
        this.visibleLoots = data.visibleLoots;
        this.visibleWalls = data.visibleWalls;
        this.visibleSoils = data.visibleSoils;
    }

    this.refresh = function(map){
        if (this.isShooting) {
            this.shoot(map);
        }

    }
    this.quickPack = function() {
        principalWeaponPacked = this.principalWeapon.quickPack();
        var data = {
            pseudo: this.pseudo,
            standstill: this.standstill,
            id: this.id,
            x: this.x,
            y: this.y,
            sizeX: this.sizeX,
            sizeY: this.sizeY,
            life: this.life,
            isShooting: this.isShooting,
            direction: this.direction,
            principalWeapon: principalWeaponPacked,
            armor: this.armor
        };
        return data; //Packed for being contained in antoher player .visiblePlayers
    }
    this.pack = function() {
        principalWeaponPacked = this.principalWeapon.quickPack();
        inventoryPacked = this.inventory.quickPack();
        var data = {
            pseudo: this.pseudo,
            standstill: this.standstill,
            id: this.id,
            life: this.life,
            x: this.x,
            y: this.y,
            visiblePlayers: this.visiblePlayers,
            visibleBullets: this.visibleBullets,
            visibleLoots: this.visibleLoots,
            visibleWalls: this.visibleWalls,
            visibleSoils: this.visibleSoils,
            sizeX: this.sizeX,
            sizeY: this.sizeY,
            isShooting: this.isShooting,
            direction: this.direction,
            principalWeapon: principalWeaponPacked,
            inventory: inventoryPacked,
            kills: this.kills,
            ranking: this.ranking,
            armor: this.armor

        };
        return data; //Packed for being send tp client
    }
    this.loot = function(loot, map) {
        for (var i = 0; i < loot.weapons.length; i++) {
            var weaponNames = [];
            var isIn = false;
            for (var a = 0; a < this.inventory.weapons.length; a++) {
                if (this.inventory.weapons[a].name == loot.weapons[i].name || loot.weapons[i].name == this.principalWeapon.name) {
                    isIn = true;
                }
            }
            if (isIn == false) {
                this.inventory.weapons.push(loot.weapons[i]);
            }
        }
        this.inventory.bullets += loot.bullets;
        map.chunks[this.chunkPos[0]][this.chunkPos[1]].loots.splice(map.chunks[this.chunkPos[0]][this.chunkPos[1]].loots.indexOf(loot), 1);
    }
    this.scrollInventory = function(dir) {
        if (this.inventory.weapons.length > 0) {
            if (dir == "UP") {
                this.inventory.weapons.push(this.principalWeapon);
                this.principalWeapon = this.inventory.weapons[0];
                this.inventory.weapons.splice(0, 1);
            } else if (dir == "DOWN") {
                //var newWeaponList = [this.principalWeapon];
                //this.principalWeapon = this.inventory.weapons[-1];
                //this.inventory.weapons.splice(-1,1);
                //for (var i = 0; i<this.inventory.weapons.length;i++){
                //newWeaponList.push(this.inventory.weapons[i]);
                //}
                //this.inventory.weapons = newWeaponList;

            }
        }
    }
    map.users[this.id] = this;
}
exports.User = User;
exports.Loot = Loot;
exports.Inventory = Inventory;
