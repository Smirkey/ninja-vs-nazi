function login(data){
    $('#profilePic').attr('src', data.profilePic);
    $('#profilePicContainer').show();
    $('#email').hide();
    $('#password').hide();
    $('#Register').hide();
    $('#signIn').hide();
    $('#account').show();
}



$(function() {
    $('#signIn').on('click', function(){
        var email = $('#email').val();
        var password = $('#password').val();
        if (email != "" && password != ""){
            data = {
                email:email,
                password:password
            }
            socket = io.connect(metaServerUrl);
            socket.emit('signIn',data);
            socket.on('login',function(data){
                data.name = 'NinjavsNaziCookie';
                document.cookie = data;
                login(data);
            });
        }
    });
});