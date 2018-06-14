var H1Z1Servers = [];
var FFAServers = [];
var groundWarServers = [];
var servers = {};
var urls = {};
function getUrl(gameMode){
	console.log(gameMode);
	var url = false;
	if (gameMode == "King of the Hill"){
		console.log("got this");
		selectedServer = H1Z1Servers[0];
		console.log(H1Z1Servers);
		for (var i = 1; i < H1Z1Servers.length; i++){
			if (H1Z1Servers[i].nbrUsers > selectedServer.nbrUsers && H1Z1Servers.status == "Ready"){
				selectedServer = H1Z1Servers[i];
			};
		};
	}
	else if (gameMode == "FFA"){
		selectedServer = FFAServers[0];
		for (var i = 1; i < FFAServers.length; i++){
			if (FFAServers[i].nbrUsers > selectedServer.nbrUsers && FFAServers.status == "Ready"){
				selectedServer = FFAServers[i];
			};
		};
	}
	else if (gameMode == "Groud War"){
		selectedServer = groundWarServers[0];
		for (var i = 1; i < groundWarServers.length; i++){
			if (groundWarServers[i].nbrUsers > selectedServer.nbrUsers && groundWarServers.status == "Ready"){
				selectedServer = groundWarServers[i];
			};
		};
	}
	return selectedServer.url; 
}
var GameServer = function(data){
	this.id = data.id;
 	this.nbrUsers = 0;
 	this.gameMode = data.gameMode;
 	this.status = data.status;
 	this.url = data.url;
  	if (this.gameMode == "H1Z1"){
  		H1Z1Servers.push(this);
  	} else if (this.gameMode == "FFA"){
  		FFAServers.push(this);
  	} else if (this.gameMode == "Ground War"){
  		groundWarServers.push(this);
  	}
  	servers[this.id] = this;
  	urls[this.url] = this;
  	console.log("New" + this.gameMode + "Server");
  	this.refresh = function(data){
  		this.nbrUsers = data.nbrUsers;
  		this.status = data.status;
  	}
}
exports.servers = servers;
exports.GameServer = GameServer;
exports.getUrl = getUrl;
exports.urls = urls; 