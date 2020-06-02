$(document).ready(function () {

    window.addEventListener('message', function(e){ 
        $('#anuncio').attr("src", e.data) ; 
    }, false);

   $("#banner").on('load', function(){
    let data = new Date();
    this.contentWindow.postMessage(data, 'http://156.35.95.88:8080/postmessage/server.html');
   })

});

