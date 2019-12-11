self.onmessage = function (msg) {
	var n=msg.data;
	var result=fibonacci(n);
	postMessage(result);
}

function fibonacci(n) {
   console.info("fibonacci.js: "+n);
   if (n < 2){
	 return 1;
   }else{
	 return fibonacci(n-2) + fibonacci(n-1);
   }
}
