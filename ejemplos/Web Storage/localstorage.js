var pintando=false;

function startPintar() {
	pintando=true;
}

function endPintar() {
	pintando=false;
}

function pintar(evento) {
	if (pintando) {
		setPixel(evento.pageX,evento.pageY);
		localStorage.setItem("cutrejemplo:"+evento.pageX+","+evento.pageY,true);
	}
}

function setPixel(x,y) {
		var elemento=$("<div/>");
		elemento.css("background-color","black");
		elemento.css("width","2px");
		elemento.css("height","2px");
		elemento.css("position","absolute");
		elemento.css("left",x);
		elemento.css("top",y);
		$("body").append(elemento);
}

function cargarImagenAnterior() {
	var habiaAlgo=false;
	for (var i in localStorage) {
		if (i.indexOf("cutrejemplo:")!=-1) {
			var tokens=i.split(":");
			tokens=tokens[1];
			var coords=tokens.split(",");
			setPixel(coords[0],coords[1]);
			habiaAlgo=true;
		}
	}
	if (habiaAlgo) preguntarConservar();
}

function preguntarConservar() {
	var respuesta=window.confirm("¿Borramos esta obra de arte?");
	if (respuesta) {
		$("div").remove();
		localStorage.clear();
	}
}