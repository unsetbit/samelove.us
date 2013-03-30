var utils = require("./utils.js");

function init(){
	if(hasInit) return;
	hasInit = true;
/*
	document.addEventListener("touchmove", function(e){
		e.preventDefault();
	});

	document.addEventListener("click", function(e){
		var element = document.elementFromPoint(e.clientX, e.clientY);

		console.log(element.className);
	});
*/
	var experience = createExperience();
	window.experience = experience;
}

window.onYouTubeIframeAPIReady = init;
var hasInit = false;
var createExperience = require('./samelove.js');

setTimeout(function(){
	init();
}, 5000);