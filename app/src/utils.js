var noop = exports.noop = function(){};

if(typeof console === "undefined"){
	exports.log = noop;
} else {
	if(console.log && console.log.bind){
		exports.log = console.log.bind(console);
	} else {
		exports.log = function(m){console.log(m);};
	}
}

exports.extend = function(base, other){
	var name;

	// Merge to existing transitions
	for(name in other){
		if(other.hasOwnProperty(name)){
			base[name] = other[name];
		}
	}
}

exports.requestAnimationFrame = window.requestAnimationFrame || 
								window.mozRequestAnimationFrame ||
                              	window.webkitRequestAnimationFrame || 
                              	window.msRequestAnimationFrame || 
                              	function(cb){return setTimeout(cb, 15);};

exports.cancelAnimationFrame = 	window.cancelAnimationFrame || 
								window.mozCancelAnimationFrame ||
                              	window.webkitCancelAnimationFrame || 
                              	window.msCancelAnimationFrame || 
                              	function(timeout){return clearTimeout(timeout);};

exports.requestFullscreen = document.documentElement.requestFullscreen ||
							document.documentElement.mozRequestFullScreen ||
							document.documentElement.webkitRequestFullscreen ||
							noop;

var bodyStyle = document.body.style;	
exports.transitionAttribute =	(bodyStyle.msTransition !== void 0) && "msTransition" ||
								(bodyStyle.webkitTransition !== void 0) && "webkitTransition" ||
								(bodyStyle.MozTransition !== void 0) && "MozTransition" || 
								(bodyStyle.transition !== void 0) && "transition";

window.utils = exports;