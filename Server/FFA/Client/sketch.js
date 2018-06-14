var socket;
var player;
var players = [];
var bullets = [];
var visibleBullets = [];
var visiblePlayers = [];
var visibleLoots = [];
var visibleWalls = [];
var visibleSoils = [];
var skins = {};
var connected = false;
var animationStarted = false;
var minimap = 0;
var playersConnected = 0;
var angle;
var speedVector;
var minimapData = [];
var metaServerUrl = "http://localhost:80";
var serverUrl = "http://localhost:8081";
function undisplayOverlay(){
    $("div").hide(1000);
    console.log("hidden");
}
setTimeout(undisplayOverlay,5000);
function Inventory() {
    this.weapons = [];
    this.bullets = 0;
    this.foods = [];
}

function Weapon() {
    this.name = "Fist";
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    var dimensions = [windowWidth / 1920, windowHeight / 1080];
    window.addEventListener('resize', function(event) {
        dimensions = [windowWidth / 1920, windowHeight / 1080];
        resizeCanvas(windowWidth, windowHeight);
        canvas.getContext("2d");
    });
    lootImages = {
        "M-16": loadImage("images/AR.png"),
        "AK-47": loadImage("images/AK-47.png"),
        "GLOCK": loadImage("images/GLOCK.png"),
        "SNIPER": loadImage("images/Sniper.png"),
        "SMG": loadImage("images/SMG.png"),
        "MINIGUN": loadImage("images/MINIGUN.png"),
        "SHOTGUN": loadImage("images/Shotgun.png"),
        "FLAMETHROWER": loadImage("images/FlameThrower.png"),
        "GRENADE": loadImage("images/Grenade.png"),
        "Munitions": loadImage("images/Magazine.png"),
        "Vest": loadImage("images/Vest.png"),
        "Drug": loadImage("images/drug.png"),
        "AidKit": loadImage("images/aidKit.png")
    };
    Bullet = loadImage("images/bullet.png")
}

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    background(55);
    try {
        player.pos.x += 0;
        translate(width / 2, height / 2);
        scale(canvas.width / 1920, canvas.height / 1080);
        //    console.log("reussi");
    } catch (e) {
        player = new Player(700, 350, new Weapon(), new Inventory(), connected);
    }
    update();
    try {
        player.show();
    } catch (e) {
        console.log(e);
    }
    animationLoop();
    Leaderboard();
    blitPlayers();
    computePlayerSpeed(player.direction);
}

function Player(pseudo, x, y, principalWeapon, inventory, connected) {
    console.log(connected);
    this.pseudo = pseudo;
    this.ranking = 0;
    this.connected = connected;
    this.speed = {
        x: 0,
        y: 0
    };
    this.life = 100;
    this.armor = 0;
    this.pos = createVector(x, y);
    this.size = createVector(30, 50);
    this.mousePos = createVector(mouseX, mouseY);
    this.principalWeapon = principalWeapon;
    this.direction = "";
    this.inventory = inventory;
    this.kills = 0;
    this.show = function() {
        push();
        fill(0, 0, 0, 150);
        var l = 125;
        if (player.inventory.weapons.length > 2) {
            l += ((player.inventory.weapons.length - 2) * 60);
        }
        rect(-940, 340, l, 190);
        pop();
        push();
        noFill();
        stroke(255);
        rect(0, 0, player.size.x, player.size.y);
        fill(255, 0, 0);
        textAlign(LEFT);
        if (player.principalWeapon.name != "Fist") {
            image(lootImages[player.principalWeapon.name], -930, 350, 60, 60);
        }
        l = -930;
        for (var i = 0; i < player.inventory.weapons.length; i++) {
            image(lootImages[player.inventory.weapons[i].name], l, 420, 45, 45);
            l += 60;
        }
        textSize(20);
        noStroke();
        text(player.principalWeapon.bullets + "/" + player.inventory.bullets, -930, 500);
        image(lootImages["Munitions"], -870, 470, 45, 45);
        text("Pos: " + player.pos.x + ", " + player.pos.y, -930, -510);
        pop();
        push();
        fill(255, 0, 0);
        rect(-30, -50, 100, 10);
        fill(0, 255, 0);
        rect(-30, -50, player.life, 10);
        fill(230, 180, 20);
        rect(-30, -50, player.armor, 10);
        pop();
        push();
        textSize(20);
        strokeWeight(3);
        fill(0);
        textAlign(CENTER);
        text(player.pseudo, -20, -70);
        pop();
        console.log(minimap);
        if (minimap != 0) {
            push();
            strokeWeight(5);
            stroke(0);
            noFill();
            rect(695, 325, 255, 185);
            image(minimap, 700, 330, 250, 180);
            pop();
            push();
            stroke(0);
            strokeWeight(1.8);
            fill(255, 255, 255);
            ellipse(700 + (player.pos.x / 9800) * 250, 330 + (player.pos.y / 7100) * 180, 10);
            pop();
            push();
            fill(255);
            stroke(0);
            strokeWeight(1.2);
            for (var i = 0; i < minimapData.length; i++) {
                ellipse(700 + (minimapData[i][0] / 9800) * 250, 330 + (minimapData[i][1] / 7100) * 180, 5);
            }
            pop();
        }
    }
}

function mousePressed() {
    var data = {
        x: (mouseX / windowWidth) * 1920,
        y: (mouseY / windowHeight) * 1080
    };
    socket.emit('mousePos', data);
    socket.emit('mousePressed', data);
}

function mouseReleased() {
    socket.emit('mousePressed', false);

}

function showPlayers(user) {
    push();
    noFill();
    stroke(255);
    rect(user.x - player.pos.x, user.y - player.pos.y, user.sizeX, user.sizeY);
    pop();
    push();
    fill(255, 0, 0);
    rect(user.x - player.pos.x - 30, user.y - player.pos.y - 50, 100, 10);
    fill(0, 255, 0);
    rect(user.x - player.pos.x - 30, user.y - player.pos.y - 50, user.life, 10);
    fill(230, 180, 20);
    rect(user.x - player.pos.x - 30, user.y - player.pos.y - 50, user.armor, 10);
    pop();
    push();
    textSize(20);
    strokeWeight(3);
    fill(0);
    textAlign(CENTER);
    try{
        text(user.pseudo, user.x - player.pos.x - 20, user.y - player.pos.y - 70);
    }
    catch(e){

    }
    pop();
}

function showLoots(loot) {
    push();
    noFill();
    stroke(255);
    if (loot.weapons.length > 0) {
        img = lootImages[loot.weapons[0].name];
    } else {
        img = lootImages["Munitions"];
    }
    try {
        image(img, loot.x - player.pos.x, loot.y - player.pos.y, 40, 40);
    } catch (e) {
        //console.log(loot);
        //console.log(e);
    }
    pop();
}

function showBullets(bullet) {
    push();
    angleMode(DEGREES);
    speedVector = createVector(bullet.speedX, bullet.speedY);
    angle = speedVector.heading();
    posVector = createVector(bullet.x - player.pos.x, bullet.y - player.pos.y);
    posVector.rotate(-angle);
    rotate(angle);
    image(Bullet, posVector.x - 15, posVector.y - 9, 30, 30);
    pop();

}

function showWalls(wall) {
    push();
    fill(wall.color);
    stroke(255);
    rect(wall.pos[0] - player.pos.x, wall.pos[1] - player.pos.y, wall.pos[2], wall.pos[3]);
    pop();
}

function showSoils(soil) {
    push();
    noStroke();
    fill(soil.color[0], soil.color[1], soil.color[2]);
    rect(soil.pos[0] - player.pos.x, soil.pos[1] - player.pos.y, soil.pos[2], soil.pos[3]);
    pop();

}
var socket = io.connect(serverUrl);

var getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var checkId = function(cname) {
    if (getCookie(cname) == "") {
        window.location = metaServerUrl;
    } else {
        var id = getCookie(cname);
        socket.emit('id', id);
        document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    }
}

checkId("id");

socket.on('init', function(p, users, serverMinimap) {
    console.log('Connexion etablished');
    connected = true;
    player = new Player(p.pseudo, p.x, p.y, p.inventory, p.principalWeapon, connected);
    for (var id in users) {
        skins[id] = new sprite(users[id].skin, true, users[id]);
    }
    playerSkin = new sprite(p.skin, false, p);
});
socket.on('minimap', function(serverMinimap) {
    minimap = createImage(200, 200);
    minimap.loadPixels();
    for (var x = 0; x < minimap.width; x++) {
        for (var y = 0; y < minimap.height; y++) {
            minimap.set(x, y, [serverMinimap[y][x][0], serverMinimap[y][x][1], serverMinimap[y][x][2], 255]);
        }
    }
    minimap.updatePixels();
});
socket.on('refresh', function(user) {
    player.life = user.life;
    player.pos.x = user.x;
    player.pos.y = user.y;
    player.principalWeapon = user.principalWeapon;
    player.inventory = user.inventory;
    visibleBullets = user.visibleBullets;
    visiblePlayers = user.visiblePlayers;
    visibleWalls = user.visibleWalls;
    visibleLoots = user.visibleLoots;
    visibleSoils = user.visibleSoils;
    player.kills = user.kills;
    player.ranking = user.ranking;
    player.armor = user.armor;
});

socket.on('loadPlayer', function(user) {
    skins[user.id] = new sprite(user.skin, true, user);
});
socket.on('Leaderboard', function(data) {
    players = data;

});
socket.on('updateMinimap', function(data) {
    minimapData = data;
});

function update() {
    for (var i = 0; i < visibleSoils.length; i++) {
        if (visibleSoils[i].z_index == 0){
            showSoils(visibleSoils[i]);
        }
    }
    for (var i = 0; i < visibleSoils.length; i++) {
        if (visibleSoils[i].z_index == 1){
            showSoils(visibleSoils[i]);
        }
    }
    for (var i = 0; i < visibleBullets.length; i++) {
        showBullets(visibleBullets[i]);
    }
    for (var i = 0; i < visiblePlayers.length; i++) {
        showPlayers(visiblePlayers[i]);
    }
    for (var i = 0; i < visibleWalls.length; i++) {
        showWalls(visibleWalls[i]);
    }
    for (var i = 0; i < visibleLoots.length; i++) {
        showLoots(visibleLoots[i]);
    }
}

function keyPressed() {
    if (keyCode == 90) { //Z
        player.direction = "UP";
    } else if (keyCode == 83) { // S
        player.direction = "DOWN";
    } else if (keyCode == 68) { //D
        player.direction = "RIGHT";
    } else if (keyCode == 81) { //Q
        player.direction = "LEFT";
    }

    socket.emit('direction', player.direction);
}

function keyReleased() {

    if (keyCode == 90) { //Z
        player.direction = "NOUP";
    } else if (keyCode == 83) { // S
        player.direction = "NODOWN";
    } else if (keyCode == 68) { //D
        player.direction = "NORIGHT";
    } else if (keyCode == 81) { //Q
        player.direction = "NOLEFT";
    }
    socket.emit('direction', player.direction);
}

function mouseWheel(event) {
    if (event.delta > 0) {
        socket.emit('mouseWheel', "UP");
    } else if (event.delta < 0) {
        socket.emit('mouseWheel', "DOWN");
    }
}
var computePlayerSpeed = function(direction) {
    if (direction == "UP") {
        player.speed.y = -5;
    } else if (direction == "DOWN") {
        player.speed.y = 5;
    } else if (direction == "LEFT") {
        player.speed.x = -5;
    } else if (direction == "RIGHT") {
        player.speed.x = 5;
    }
    if (direction == "NOUP") {
        player.speed.y = 0;
    } else if (direction == "NODOWN") {
        player.speed.y = 0;
    } else if (direction == "NOLEFT") {
        player.speed.x = 0;
    } else if (direction == "NORIGHT") {
        player.speed.x = 0;
    }
}
var animationLoop = function() {
    animationStarted = true;
    if (connected) {
        playerSkin.render(-50, -80, player.direction);
        if (player.speed.x == player.speed.y == 0) {
            playerSkin.update();
        }
    }
    //window.requestAnimationFrame(animationLoop);
    for (var i = 0; i < visiblePlayers.length; i++) {
        if (visiblePlayers[i].standstill) {
            skins[visiblePlayers[i].id].render(
                visiblePlayers[i].x - player.pos.x - 50,
                visiblePlayers[i].y - player.pos.y - 80,
                visiblePlayers[i].direction
            );
        } else if (!visiblePlayers[i].standstill) {
            skins[visiblePlayers[i].id].update();
            skins[visiblePlayers[i].id].render(
                visiblePlayers[i].x - player.pos.x - 50,
                visiblePlayers[i].y - player.pos.y - 80,
                visiblePlayers[i].direction
            );
        }
    }
}
var Leaderboard = function() {
    push();
    noStroke();
    fill(200, 200, 250, 150);
    rect(740, -520, 200, 250);
    fill(255);
    textAlign(CENTER);
    textSize(18);
    text("Leaderboard", 840, -500);
    pop();
}
var blitPlayers = function() {
    playersConnected = 0
    for (var id in skins) {
        playersConnected++
    }
    //player.ranking = players[3];
    push();
    for (i = 0; i < players.length; i++) {
        //console.log(i);
        fill(255);
        var b = i + 1;
        text(b + players[i][1] + " : " + players[i][0] + " kills", 760, -460 + 20 * i);
    }
    pop();
    push();
    fill(255, 0, 0);
    text("you are ranked : " + player.ranking + "/" + playersConnected, 760, -250);
    pop();
}
