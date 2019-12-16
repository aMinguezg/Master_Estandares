$(document).ready(function () {
  
    $("#botonTarea").click(function () {
        $("#tareasRealizadas").append('<li>' + $("#textoTarea").val() + '</li>');
    })
});

