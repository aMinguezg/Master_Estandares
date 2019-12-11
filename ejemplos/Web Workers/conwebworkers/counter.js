var counter=0;

startcounter();

function startcounter() {
	counter+=1;
	console.info("counter.js: "+counter);
	postMessage(counter);
	setTimeout("startcounter()",100);
}
