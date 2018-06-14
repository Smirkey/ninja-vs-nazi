var players = [];
div = document.getElementById("Leaderboard");
socket.on('Leaderboard', function(data) {
    players = data;
    blitPlayers();

});
var blitPlayers = function() {
    playersConnected = 0
    for (var id in players){
      playersConnected++
    }
    //player.ranking = players[3];
    push();
    for (i = 0; i < players.length; i++) {
        //console.log(i);
        fill(255);
        var b = i + 1;
        text(b + players[i][1] + " : " + players[i][0] + " kills", 0, 30 + 20 * i);
    }
    pop();
    push();
    fill(255, 0, 0);
    text("you are ranked : " + player.ranking + "/" + playersConnected,0, 200);
    pop();
}