var metaServerUrl = "https://localhost";
console.log("yrah");
var redirect = function(location) {
    window.location = location;
}
$(function() {
	$('#Register').on('click', function(){
		console.log('click');
		var infos = [];
		var isEmpty = 0;
		for (var i = 1; i <= 5;i++){
			var selector = "[tabindex=";
			selector += i.toString() + ']';
			var info = $(selector).val();
			if (info == ""){
				isEmpty = 1;
			}
			infos.push(info);
		};
		if (!isEmpty){
			socket = io.connect(metaServerUrl);
			var data = {
				firstName: infos[0],
				lastName: infos[1],
				pseudo: infos[2],
				email: infos[3],
				password: infos[4]
			}
			console.log(data);
			socket.emit('Register', data);
			socket.on('registered', function(validation){
				console.log(validation);
				if (validation == 1){
					$('#formuaire').hide();
					$('#thx').show();
					setTimeout(3000,function(){
						redirect(metaServerUrl);
					});
				}
				else if (validation == 'wrongPseudo'){
					$('#pseudoOverlay').show();
				}
				else if (validation == 'wrongEmail'){
					$('#emailOverlay').show();
				}
				else if (validation == "wrongPasswords"){
					$('#passwordsOverlay').show();
				}
				else if (!validation){
					$('#formulaire').hide();
					$('#errorOverlay').show();
				}
			});
			}

		});
	});