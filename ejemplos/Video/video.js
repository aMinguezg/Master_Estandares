function version1() {
	var video=$("<video/>");
    
	video.html('<source src="http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv">');
	
	$("#video").children().last().remove();
	$("#video").append(video);
	$("#controles").remove();
}

function version2() {
	var video=$("<video/>");
	
	video.attr("controls","");
	video.attr("autobuffer","");
    
	video.html('<source src="http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv">');
	
	$("#video").children().last().remove();
	$("#video").append(video);
	$("#controles").remove();
}

function version3() {
	var video=$("<video/>");
	
	video.attr("autoplay","");
    
	video.html('<source src="http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv">');
	
	$("#video").children().last().remove();
	$("#video").append(video);
	$("#controles").remove();
}

function reproducir() {
	// Truco...
	$("#identificadorVideo")[0].play();
//	document.getElementById("identificadorVideo").play();
}

function pausar() {
	$("#identificadorVideo")[0].pause();
//	document.getElementById("identificadorVideo").pause();
}

function version4() {
	var video=$("<video/>");
	video.attr("id","identificadorVideo");
	video.attr("autobuffer","");

	video.html('<source src="http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv">');
	
	$("#video").children().last().remove();
	$("#video").append(video);

	var controles=$("<div/>");
	controles.attr("id","controles");
	var htmlControles='<button id="play">&gt;</button><button id="pause">||</button>';
	controles.html(htmlControles);
	$("body").append(controles);

	$("#play").click(reproducir);
	$("#pause").click(pausar);
}