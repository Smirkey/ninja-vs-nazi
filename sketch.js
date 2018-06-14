var skin = "nazi";
var metaServerUrl = "https://localhost";
$('#Login').on('click', function() {
    // $( ".cover-container" ).append( "<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>");
    console.log("click!");
});
console.log("connected");
var selected = "King of the Hill";
$(function() {
    $('div.product-chooser').not('.disabled').find('div.product-chooser-item').on('click', function() {
        $(this).parent().parent().find('div.product-chooser-item').removeClass('selected');
        $(this).addClass('selected');
        $(this).find('input[type="radio"]').prop("checked", true);
        selected = $(this).attr('id');
        console.log(selected);
    });
    $('#nazi').on('click', function(){
      skin = "nazi";
    });
    $('#ninja').on('click', function(){
      skin = "ninja";
    });
});
var redirect = function(location) {
    window.location = location;
}
$(function() {
    $('#Login').on('click', function() {
        var pseudo = $('#Pseudo').val();
        socket = io.connect(metaServerUrl);
        if (pseudo != "") {
            socket.emit('User', selected);
            socket.on('id', function(data) {
                var id = data.id;
                var url = data.url;
                var data = {
                    pseudo: pseudo,
                    id: id,
                    url: url,
                    skin: skin
                };
                document.cookie = "id=" + data.id.toString();
                socket.emit('dataPlayer', data);
                setTimeout(function() {
                    redirect(url);
                }, 3000);
            });
        } else {
            alert("please enter a pseudo");

        }
    });
});
$(function() {
    // Nav Tab stuff
    $('.nav-tabs > li > a').click(function() {
        if ($(this).hasClass('disabled')) {
            return false;
        } else {
            var linkIndex = $(this).parent().index() - 1;
            $('.nav-tabs > li').each(function(index, item) {
                $(item).attr('rel-index', index - linkIndex);
            });
        }
    });
    $('#step-1-next').click(function() {
        // Check values here
        var isValid = true;

        if (isValid) {
            $('.nav-tabs > li:nth-of-type(2) > a').removeClass('disabled').click();
        }
    });
    $('#step-2-next').click(function() {
        // Check values here
        var isValid = true;

        if (isValid) {
            $('.nav-tabs > li:nth-of-type(3) > a').removeClass('disabled').click();
        }
    });
    $('#step-3-next').click(function() {
        // Check values here
        var isValid = true;

        if (isValid) {
            $('.nav-tabs > li:nth-of-type(4) > a').removeClass('disabled').click();
        }
    });
});