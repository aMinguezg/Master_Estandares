var duracion,minutos,segundos=0;
var result,minutosStr, segundosStr = "";

self.addEventListener("message", function setTime(e) {
	var currentTime = e.data != undefined ? e.data : e;
	//console.info("Datos: "+ e.data != undefined ? e.data : e);
	var timeArray = currentTime.split(/[:]+/);
  	var m = timeArray[0];
	var s = checkSecond((timeArray[1] - 1));
	if(s==59){m=m-1}
	result = m+":"+s;
	postMessage(result);
	
	setTimeout(function() { setTime(result); },100);
}, false);

function checkSecond(sec) {
	if (sec < 10 && sec >= 0) {sec = "0" + sec};
	if (sec < 0) {sec = "59"};
	return sec;
  }