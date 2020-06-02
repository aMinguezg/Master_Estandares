$(document).ready(function () {
  
    var storageList = [];
	$("#startButton").click(function(){

		var taskValue = $("#Tarea").val();
		var duracion = $("#duracion").val();
		var currentDate = getFormattedDate();
		var found = false;
		console.log("Info tarea: "+taskValue+"Fecha: "+currentDate + "duracion: "+duracion);
		
		for (var i in localStorage) {
			if (i.indexOf("Tarea:")!=-1) 
			{
				var tokens=i.split(":");
				var token = ""+ tokens[1];
				if(token.trim() == taskValue.trim()){
                    found = true;
                    window.alert("La tarea introducida ya existe");
					break;
				}
			}
		}

		if(!found){

			var itemTask = taskValue + " :  " + currentDate +"  "+ duracion + " Minutos"
			localStorage.setItem("Tarea: "+ itemTask,true);

			for (var i in localStorage) {
				if (i.indexOf("Tarea:")!=-1) 
				{
					storageList.push(i);
				}
			}

			storageList.sort();
			for(var i in storageList){
				insertUl(storageList[i]);
			}

			startinterval($("#duracion").val(),'inicio')
			
			$("#form")[0].style.display = "none"
			$("#workingTime")[0].style.display = "block"
			$("#currentTask")[0].innerHTML = taskValue
			$("#currentDuration")[0].innerHTML = $("#duracion").val() + " minutos";
			storageList = [];
		} 

	});


	$("#breakRemaining").click(function(){
		console.log("Tiempo restante");
		$("#formBreak")[0].style.display = "none";
		$("#breakTime")[0].style.display = "block";
				
		startinterval($("#duracionBreak").val(),'descanso')
	});
	
	/*$("#clearLocal").click(function (){
		console.log("Limpiar LocalStorage")
		localStorage.clear();
	});*/


	function displayCounter(e,tipo) {
		var result = e.data;
		if (result != "-1:59"){
			if(tipo == 'inicio'){
				$("#currentDuration")[0].innerHTML = result + " Minutos";
			}
			else if(tipo == 'descanso'){
				$("#remainingBreakTime")[0].innerHTML = result + " Minutos";
			}
					
		}
		else{
			if (counterWorker!=null) counterWorker.terminate();
			if(tipo == 'inicio'){
				$("#goBreak")[0].disabled = false;
			}
			else if(tipo == 'descanso'){
				$("#goWork")[0].disabled = false;
			}
			
		}
	}

	function displayBreakCounter(e) {
		var result = e.data;
		if (result != "-1:59"){
			
		}
		else{
			if (counterWorker!=null) counterWorker.terminate();
			
		}
	}
	

	
});

