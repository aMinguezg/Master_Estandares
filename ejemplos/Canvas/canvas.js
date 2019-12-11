var pintando=false;
var colorElegido="black";
var tamanoElegido=5;

function startPintar(evento) {
	pintando=true;
	pintar(evento);
}

function endPintar() {
	pintando=false;
}

function pintar(evento) {
	if (pintando) {
		setPixel(evento.offsetX,evento.offsetY);
	}
}

function setPixel(x,y) {
	var canvas=$("#canvas")[0];
	if (canvas.getContext) {  
		var context = canvas.getContext("2d");  

		var rojo=colorElegido.substring(1,3);
		var verde=colorElegido.substring(3,5);
		var azul=colorElegido.substring(5,7);

		var imageData=context.createImageData(tamanoElegido,tamanoElegido);
		var pixels=imageData.data;
		for (var i=0;i<pixels.length;i+=4) {
			pixels[i]=parseInt("0x"+rojo);
			pixels[i+1]=parseInt("0x"+verde);
			pixels[i+2]=parseInt("0x"+azul);
			pixels[i+3]=255; // alpha
		}

		context.putImageData(imageData,x-tamanoElegido/2,y-tamanoElegido/2);

		// Así parece más rápido *pero* no debería hacerse ;)
		//
		//context.fillStyle=colorElegido;
        //context.fillRect (x,y,tamanoElegido,tamanoElegido);  
	}  
}

function elegirColor(color) {
	colorElegido=color;
}

function colocarPaleta() {
	var colores=Array("#000000","#0000FF","#A52A2A","#FF00FF","#808080","#008000","#00FF00","#FF00FF","#FFA500","#FFC8CB","#800080","#FF0000","#EE82EE","#FFFF00");

	var y=10;
	var x=515;

	for (var i in colores) {
		y=(i%2==0)?10:45;

		var color=colores[i];
		var elementoPaleta=$("<div/>");

		elementoPaleta.css("width","50px");
		elementoPaleta.css("height","30px");
		elementoPaleta.css("background-color",color);
		elementoPaleta.css("border-color","black");
		elementoPaleta.css("border-style","solid");
		elementoPaleta.css("border-width","1px");
		elementoPaleta.css("position","absolute");
		elementoPaleta.css("top",y);
		elementoPaleta.css("left",x);

//		Por alguna razón esto NO funciona bien...
//
//		elementoPaleta.click(function(){elegirColor(i);});

		elementoPaleta.attr("onclick","elegirColor('"+color+"');");
		
		$("body").append(elementoPaleta);

		if (i%2!=0) x+=55;
	}
}

function elegirTamano(tamano) {
	tamanoElegido=tamano;
}

function colocarPinceles() {
	var y=90;
	var x=515;

	var tamanos=Array(5,10,25,50,100,200);

	for (var i in tamanos) {
		var tamano=tamanos[i];
		var elementoPincel=$("<div/>");

		elementoPincel.css("width",tamano+"px");
		elementoPincel.css("height",tamano+"px");
		elementoPincel.css("background-color","black");
		elementoPincel.css("position","absolute");
		elementoPincel.css("top",y);
		elementoPincel.css("left",x);

		elementoPincel.attr("onclick","elegirTamano('"+tamano+"');");

		$("body").append(elementoPincel);

		x+=tamano+5;

	}
}