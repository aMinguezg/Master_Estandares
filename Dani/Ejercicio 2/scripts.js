$(document).ready(function () {
  
    let arrayTareas = [];

	$("#buttonComenzar").click(function(){

		let tarea = $("#tarea").val();
        let duracion = $("#duracion").val();
        let encontrado = false;

        let date = new Date();
		let fecha = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		
		for (let i in localStorage) {
			if (i.indexOf("Tarea:")!=-1) 
			{
				let tokens=i.split(":");
				let token = ""+ tokens[1];
				if(token.trim() == tarea.trim()){
                    encontrado = true;
                    window.alert("La tarea introducida ya existe");
					break;
				}
			}
		}

		if(!encontrado){

			let itemTask = tarea + " :  " + fecha +"  "+ duracion + " Minutos"
			localStorage.setItem("Tarea: "+ itemTask,true);

			for (let i in localStorage) {
				if (i.indexOf("Tarea:")!=-1) 
				{
                    arrayTareas.push(i);                   
				}
            }          
            arrayTareas.sort();
            
			for(let i in arrayTareas){
		        $("#lista").append('<li>'+arrayTareas[i]+'</li>');
            }
            
            $("#buttonDescansar")[0].style.display = "block";
			inicioContador($("#duracion").val(),'inicio')
			
			$("#infoTarea")[0].style.display = "none"
			$("#gridTarea")[0].style.display = "block"
			$("#spanTarea")[0].innerHTML = tarea
			$("#spanDuracion")[0].innerHTML = $("#duracion").val() + " minutos";
			arrayTareas = [];
		} 

	});

	$("#buttonDescansar").click(function (){
		$("#gridTarea")[0].style.display = "none";
		$("#infoDescanso")[0].style.display = "block";
        $("#lista").empty();
		$("#buttonDescansar")[0].disabled = true;
    });
    
    
	$("#buttonEmpezarDescanso").click(function(){
		$("#infoDescanso")[0].style.display = "none";
		$("#gridDescanso")[0].style.display = "block";
				
		inicioContador($("#duracionDescanso").val(),'descanso')
    });
    	

	$("#buttonNuevaTarea").click(function(){
		$("#gridDescanso")[0].style.display = "none";
		$("#infoTarea")[0].style.display = "block";
		$("#buttonNuevaTarea")[0].disabled = true;
    });
    
    $("#duracion").change(function(){
        $("#rangoTarea").text("Minutos: " + this.value);
    })

    $("#duracionDescanso").change(function(){
        $("#rangoDescanso").text("Minutos: " + this.value);
    })

	function inicioContador(tiempo,tipo) {
		if (typeof(Worker)!==undefined) {
			worker=new Worker("worker.js");
			setTimeout(worker.postMessage(tiempo+":00"),60000);
			if(tipo == 'inicio'){
				worker.onmessage=mostrarContador;
			}
			else if(tipo == 'descanso'){
				worker.onmessage=mostrarContadorDescanso;
			}
			
		} else
			window.alert("Este navegador no soporta workers");
	}

	function mostrarContador(e) {
		let result = e.data;
		if (result != "-1:59"){
			$("#spanDuracion")[0].innerHTML = result + " Minutos";		
		}
		else{
			if (worker!=null) worker.terminate();
			$("#buttonDescansar")[0].disabled = false;
		}
	}

	function mostrarContadorDescanso(e) {
		let result = e.data;
		if (result != "-1:59"){
			$("#spanDuracionDescanso")[0].innerHTML = result + " Minutos";
		}
		else{
			if (worker!=null) worker.terminate();
			$("#buttonNuevaTarea")[0].disabled = false;
		}
	}
});

