$(document).ready(function() {
	if ("WebSocket" in window) {
		establecerWebSocket();
		preguntarNombre();
		$("#mensaje").focus();
		$("#mensaje").keypress(manejadorTeclado);
	} else {
		window.alert("Este navegador no soporta WebSockets así que no puedes usar este chat :(");
	}
});

var username;
var socket;
var isConnected=false;
var userIsOnline=false;

function establecerWebSocket() {
	var host = "ws://danigayo.info:8080/cualquiercosa"; // A esta implementación le da igual el path al recurso :S

	try {
		socket = new WebSocket(host);
		console.info(socket.readyState);

		socket.onopen = function(msg) {console.info("onopen "+this.readyState);};

		socket.onmessage = listener;

		socket.onclose = function(msg) {console.info("Disconnected - status "+this.readyState);};

		isConnected=true;
	}
	catch(ex){ 
		console.info(ex);
	}
}

function enviarWebSocket(tipo,datos) {
	var msg={type:tipo,data:datos};
	msg=JSON.stringify(msg);

	try { 
		socket.send(msg); 
		console.info('Sent: '+msg); 
	} catch(ex) { 
		console.info("Excepción :( :"+ex); 
	}
}

function listener(msg) {
	console.info("Received: "+JSON.stringify(msg.data));
	console.info(msg);

	msg=JSON.parse(msg.data);

	if (msg.type=="OK_HELLO") {
		userIsOnline=true;
	} else if (msg.type=="ERROR_HELLO") {
		window.alert("Ese nombre ya está en uso. Elige otro.");
		preguntarNombre();
	} else if (msg.type=="BROADCAST") {
		if (userIsOnline)
			volcarEnChatLog(msg.data);
	} else if (msg.type=="OK_WHOSTHERE") {
		volcarEnChatLog("\nLos siguientes usuarios están en el chat:\n\t"+msg.data+"\n");
	} else if (msg.type=="OK_BYE") {
		userIsOnline=false;
		socket.close();
		isConnected=false;
	}
}

function preguntarNombre() {
	if (!isConnected) establecerWebSocket();

	username=window.prompt("¿Qué nombre quieres usar en el chat?");

	if (username!=null && username.trim()!="") {
		username=username.trim();
		enviarWebSocket("HELLO",username);
	} else {
		window.alert("El nombre no puede ser vacío");
		preguntarNombre();
	}
}

function manejadorTeclado(e) {
	if (e.keyCode==13) {
		if (userIsOnline) { 
			var mensaje=$("#mensaje").val();
			console.info(mensaje+"\n");
			if (mensaje[0]=="$") {
				if (mensaje=="$HELP") {
					volcarEnChatLog("\n$HELP proporciona ayuda sobre los comandos del chat.\n\n$WHO retorna los nombres de todos los usuarios del chat.\n\n$BYE nos desconecta del chat.\n\n");
				} else if (mensaje=="$WHO") {
					enviarWebSocket("WHOSTHERE","");
				} else if (mensaje="$BYE") {
					enviarWebSocket("BYE","");
				}
			} else 
				enviarWebSocket("CHAT",mensaje);
			$("#mensaje").val("");
		} else {
			$("#mensaje").val("");
			window.alert("Si quieres chatear tienes que volver a entrar.");
			preguntarNombre();
		}
	}
}

function volcarEnChatLog(texto) {
	$("#chatlog").append(texto+"\n");
	$("#chatlog").scrollTop($("#chatlog").height());
}