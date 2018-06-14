var metaServerUrl = "https://localhost";
var currentUrl = "http://localhost:8081";
var express = require('express');
var app = express();
var mapFile = require('./map.js');
var server = app.listen(8081);
var User = mapFile.User;
var map = new mapFile.Map();
var ioc = require('socket.io-client');
var Clients = {};
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/Client/index.html');
});

app.get('/sketch.js', function(req, res) {
    res.sendFile(__dirname + '/Client/sketch.js');
});

app.get('/sprite.js', function(req, res) {
    res.sendFile(__dirname + '/Client/sprite.js');
});

app.get('/ninja.png', function(req, res) {
    res.sendFile(__dirname + '/images/ninja.png');

});
app.get('/nazi.png', function(req, res) {
    res.sendFile(__dirname + '/images/nazi.png');

});
app.get('/images/bullet.png', function(req, res) {
    res.sendFile(__dirname + '/images/bullet.png');

});
app.get('/images/AR.png', function(req, res) {
    res.sendFile(__dirname + '/images/AR.png');

});
app.get('/images/AK-47.png', function(req, res) {
    res.sendFile(__dirname + '/images/AK-47.png');

});
app.get('/images/GLOCK.png', function(req, res) {
    res.sendFile(__dirname + '/images/GLOCK.png');

});
app.get('/images/Sniper.png', function(req, res) {
    res.sendFile(__dirname + '/images/Sniper.png');

});
app.get('/images/SMG.png', function(req, res) {
    res.sendFile(__dirname + '/images/SMG.png');

});
app.get('/images/MINIGUN.png', function(req, res) {
    res.sendFile(__dirname + '/images/MINIGUN.png');

});
app.get('/images/Shotgun.png', function(req, res) {
    res.sendFile(__dirname + '/images/Shotgun.png');

});

app.get('/images/FlameThrower.png', function(req, res) {
    res.sendFile(__dirname + '/images/FlameThrower.png');

});
app.get('/images/Grenade.png', function(req, res) {
    res.sendFile(__dirname + '/images/Grenade.png');

});
app.get('/images/Magazine.png', function(req, res) {
    res.sendFile(__dirname + '/images/Magazine.png');

});
app.get('/images/Vest.png', function(req, res) {
    res.sendFile(__dirname + '/images/Vest.png');

});
app.get('/images/drug.png', function(req, res) {
    res.sendFile(__dirname + '/images/drug.png');

});
app.get('/images/aidKit.png', function(req, res) {
    res.sendFile(__dirname + '/images/aidKit.png');

});
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/Client/style.css');

});
app.get('/leaderboard.js', function(req, res) {
    res.sendFile(__dirname + '/Client/leaderboard.js');

});
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/style.css');

});
console.log("Server up!");
var socket = require('socket.io');
var io = socket(server).listen(server);
var client = ioc.connect(metaServerUrl);
data = {
    gameMode: "FFA",
    url: currentUrl,
    status: "Ready"
}
client.emit('Server', data);
client.on('newClient', function(data) {
    Clients[data.id] = {
        pseudo: data.pseudo,
        skin: {
        ticksPerFrame: 4,
        numberOfFrames: 7,
        width: 1050,
        height: 140,
        src: data.skinSrc
      }
    };
});
function informMetaServer(){
    if (map.users.length > 60){
        var status = "Full";
    }
    else {
        var status = "Ready";
    }
    data = {
        nbrUsers: map.users.length,
        status: status
    }
    client.emit("Refresh", data);
}
io.sockets.on('connection', function newConnection(socket) {
    console.log("Connexion establised");
    socket.on('id', function(data) {
        const newUser = new User(Clients[data].skin, Clients[data].pseudo, socket.id, map);
        socket.emit('init', newUser, map.users);
        socket.emit('minimap', map.minimap);
        socket.broadcast.emit('loadPlayer', newUser);
        updateMinimap();
        updatePlayer();
        setInterval(updatePlayer, 100);
        setInterval(updateMinimap, 1500);
    });
    socket.on('mousePressed', function(booleain) {
        try {
            map.users[socket.id].isShooting = booleain;
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('direction', function(direction) {
        try {
            map.users[socket.id].setDirection(direction);
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('mousePos', function(data) {
        map.users[socket.id].mouseX = data.x;
        map.users[socket.id].mouseY = data.y;
        //console.log("Data received");
    });
    socket.on('mouseWheel', function(dir) {
        try {
            map.users[socket.id].scrollInventory(dir);
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('disconnect', function() {
        // console.log(map.users);
        try {
            map.users[socket.id].quit(map);
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('canvasSize', function(canvas) {
        map.users[socket.id].resizeCanvas(canvas);
    });
    socket.on('needData',function(x){
        data = {
            gameMode: "FFA",
            url: currentUrl,
            status: "Ready"
        };
        socket.emit('Server',data)
    });

    function updatePlayer() {
        try {
            map.users[socket.id].updateData(map);
            var data = map.users[socket.id].pack();
            socket.emit("refresh", data);
        } catch (e) {
            console.log(e);
            clearInterval(this);
        }
    }

    function updateMinimap() {
        var data = [];
        for (var id in map.users) {
            if (map.users[id].id != socket.id) {
                data.push([map.users[id].x, map.users[id].y]);
            }
        }
        socket.emit("updateMinimap", data);
    }
});

function updateBullets() {
    map.refreshBullets();
}

var sortPlayers = function() {
    var players = [];
    var tenBest = [];
    for (var id in map.users) {
        players.push(map.users[id]);
    }
    players.sort(function compare(a, b) {
        return b.kills - a.kills;
    });
    for (var i = 0; i < players.length; i++) {
        map.users[players[i].id].ranking = i;
    }
    if (players.length < 10) {
        for (var i = 0; i < players.length; i++) {
            tenBest.push([players[i].kills, players[i].pseudo, players[i].id]);
        }
    } else {
        for (var i = 0; i < players.length; i++) {
            tenBest.push([players[i].kills, players[i].pseudo, players[i].id]);
        }
    }
    io.sockets.emit('Leaderboard', tenBest);
}
var updateMinimap = function() {}
var updateLoots = function(){
    var ttlLoots = 0;
    for (chunk in map.chunks){
        ttlLoots += map.chunks.length;
    }
    if (ttlLoots < 50){
        map.addLoot();
    }
}
setInterval(updateLoots, 2000);
setInterval(sortPlayers, 1000);
setInterval(updateBullets, 20);
setInterval(informMetaServer,2000);
