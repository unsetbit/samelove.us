require('eventEmitter/EventEmitter.js');
require('modernizr/feature-detects/css-filters.js');
require('modernizr/modernizr.js');

var Q = require('q/q.js');
var Collage = require('../../../collage/dist/collage-module.js');
var utils = require("./utils.js");
var log = utils.log;


// These iOS can't autoplay video, so they won't get video content
var isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );

module.exports = function(){
	return new Experience();
};

window.credits = window.credits || {};
window.credits.websites = {
	'Reddit':	'http://www.reddit.com/r/lgbt/',
	'Wikipedia': 'http://en.wikipedia.org/Civil_rights_movement'
};
		
function Experience(){
	var self = this;

	this.mainCollageElement = document.getElementById("MainCollage");
	this.introOverlayElement = document.getElementById("IntroOverlay");
	this.finaleOverlayElement = document.getElementById("FinaleOverlay");
	
	//this.introOverlayElement.style.display = "none";
	//this.finaleOverlayElement.style.display = "block";
	
	this.collage = Collage.create(this.mainCollageElement);
	this.emitter = new EventEmitter();
	this.windowClickHandler = this.windowClickHandler.bind(this);


	// If not compatible, don't load
	var compatible = Array.prototype.every && [	
		"opacity",
		"textshadow",
		"backgroundsize",
		"csstransitions",
		"csstransforms",
		"csstransforms3d",
		"generatedcontent"].every(function(prop){ 
			return Modernizr[prop];
	});

	if(!compatible){
		this.introOverlayElement.querySelector(".incompatible").style.display = "block";
		return;
	}

	if(!Modernizr["cssfilters"]){
		Array.prototype.forEach.call(this.introOverlayElement.querySelectorAll(".not-chrome"), function(element){
			element.style.display = "block";
		});
	}

	this.introOverlayElement.querySelector(".load").style.display = "block";

	document.body.className += " loading";
	this.introOverlayElement.style[utils.transitionAttribute] = "opacity 1s";
	this.introOverlayElement.style.opacity = 1;

	var progressReportTimer = setTimeout(function(){
		self.introOverlayElement.querySelector(".progress-report").style.display = "block";
	}, 8 * 1000);

	var slowConnectionTimer = setTimeout(function(){
		self.introOverlayElement.querySelector(".slow-connection").style.display = "block";
	}, 20 * 1000);

	window.addEventListener("resize", function(){
		self.collage.refit();
	});

	this.load().done(function(){
		console.log("preload complete");
		clearTimeout(progressReportTimer);
		clearTimeout(slowConnectionTimer);

		self.ready = true;
		document.body.className = document.body.className.replace("loading", "");
		self.introOverlayElement.querySelector(".load").style.display = "none";
		self.introOverlayElement.querySelector(".ready").style.display = "block";
		window.addEventListener("click", self.windowClickHandler);
	});
}

Experience.prototype.fillCredits = function(){
	var key, links = [];
	Object.keys(window.credits.flickr).sort().forEach(function(key){
		links.push("<a target=\"_blank\" href=\"" + window.credits.flickr[key] + "\">" + key + "</a>");
	});
	this.finaleOverlayElement.querySelector("#flickrCredits").innerHTML = links.join(", ");

	links = [];
	Object.keys(window.credits.reddit).sort().forEach(function(key){
		links.push("<a target=\"_blank\" href=\"" + window.credits.reddit[key] + "\">" + key + "</a>");
	});
	this.finaleOverlayElement.querySelector("#redditCredits").innerHTML = links.join(", ");

	links = [];
	Object.keys(window.credits.youtube).sort().forEach(function(key){
		links.push("<a target=\"_blank\" href=\"" + window.credits.youtube[key] + "\">" + key + "</a>");
	});
	
	this.finaleOverlayElement.querySelector("#youtubeCredits").innerHTML = links.join(", ");
	
	links = [];
	Object.keys(window.credits.websites).sort().forEach(function(key){
		links.push("<a target=\"_blank\" href=\"" + window.credits.websites[key] + "\">" + key + "</a>");
	});
	this.finaleOverlayElement.querySelector("#websiteCredits").innerHTML = links.join(", ");
	
	links = [];
	Object.keys(window.credits.facebook).sort().forEach(function(key){
		links.push("<a target=\"_blank\" href=\"" + window.credits.facebook[key] + "\">" + key + "</a>");
	});
	this.finaleOverlayElement.querySelector("#facebookPageCredits").innerHTML = links.join(", ");
	
	links = [];
	Object.keys(window.credits.twitter).sort().forEach(function(key){
		links.push("<a target=\"_blank\" href=\"" + window.credits.twitter[key] + "\">" + key + "</a>");
	});
	this.finaleOverlayElement.querySelector("#twitterPostCredits").innerHTML = links.join(", ");
	
	links = [];
	Object.keys(window.credits.nyTimes).sort().forEach(function(key){
		links.push("<a target=\"_blank\" href=\"" + window.credits.nyTimes[key] + "\">" + key + "</a>");
	});
	this.finaleOverlayElement.querySelector("#nyTimesArticleCredits").innerHTML = links.join(", ");
	
	links = [];
	Object.keys(window.credits.googleNews).sort().forEach(function(key){
		links.push("<a target=\"_blank\" href=\"" + window.credits.googleNews[key] + "\">" + key + "</a>");
	});
	this.finaleOverlayElement.querySelector("#googleNewsArticleCredits").innerHTML = links.join(", ");
};

Experience.prototype.load = function(){
	var self = this,
		collage = this.collage;

	this.emitter.emit('loading');

	return Collage.loader.youtube(collage, {
		videoId: 'hlVBg7_08n0',
		loop:false, 
		//mute: true,
		height: 444,
		width: 1065,
		continuousPlay: true
	}).then(function(element){
		self.musicVideo = element;
		element.element.style.zIndex = 100;
		collage.add("music video", element);
	}).then(function(){
		var promises = [];

		//anti-gay religious protests
		var protests = {
			flickr: [
				{	tags: "antigay,protest",
					sort: "interestingness-desc"
				},
				{	tags: "westboro,hate",
					sort: "interestingness-desc"
				},
			],
			youtube: [{
				query: "marriage protest",
				mute: true,
				loop: true
			}]
		};

		var fudMedia = {
			iframe: [{
					url: "http://en.wikipedia.org/wiki/Homophobia",
					width: 800,
					height: 600
				},
				{
					url: "http://en.wikipedia.org/wiki/DOMA",
					width: 800,
					height: 600
				},
				{
					url: "http://en.wikipedia.org/wiki/Conversion_therapy",
					width: 800,
					height: 600
				},
				{
					url: "http://en.wikipedia.org/wiki/Societal_attitudes_toward_homosexuality#Anti-homosexual_attitudes",
					width: 800,
					height: 600
				}
			],
			facebook: [{
                    type: 'pages',
                    minLikes: 200,
                    query: 'one man one woman'
               },
               {
                    type: 'pages',
                    ids: ["NationForMarriage"]
               }
	        ]
		};
		

		if(!isiOS){
			fudMedia.youtube = [{
					videoId: '8cQCi4ehXkg',
					mute: true,
					autoplay: true,
					loop: true,
					startTime: 108
				},
				{
					videoId: '-9atnCSSFP8',
					mute: true,
					autoplay: true,
					loop: true,
					startTime: 66
		        }
		    ];
		}

		var carelessness = {
			twitter: [
				{ query: "fags"	},
				{ query: "faggot" }
			]
		};

		var civilRights = {
			flickr: [{	
				tags: "protest",
				isCommons: true,
				sort: "interestingness-desc"
			}],
			iframe: [
			{
				url: "http://en.wikipedia.org/wiki/Civil_rights_movement",
				width: 800,
				height: 600
			}]
		};

		var generalProtest = {
			flickr: [
				{	
					tags: "samesexmarriage",
					sort: "interestingness-desc"
				},
				{	
					tags: "prop8",
					sort: "interestingness-desc"
				}
			],
			reddit: [
				{
					query: 'same-sex marriage subreddit:pics',
					limit: '30'
				}
			],
			youtube: [
				{
					videoId: 'u62OtM_vt5k',
					mute: true,
					autoplay: true,
					loop: true
				},
				{
					videoId: 'zPcHmlqZnXQ',
					mute: true,
					autoplay: true,
					loop: true
				}
			]
		};

		var generalLGBTNews = {
			googleNews: ["lgbt"],
			nyTimes: [{
				query: "anti-gay+nytd_des_facet%3A%5BHate+Crimes%5D"
//				data: require('./resource/nytimes-hatecrime-antigay.js')
			}]
		};

		var sameSexMarriage = {
			googleNews: ["same-sex marriage"],
			nyTimes: [{
				query: "nytd_des_facet%3A%5BSame-Sex+Marriage%2C+Civil+Unions+and+Domestic+Partnerships%5D"
//				data: require('./resource/nytimes-same-sex-marriage-love.js')
			}]
		};

		var sameSexMarriagePhoto = {
			flickr: [
				{
					tags: "gaymarried",
					sort: "interestingness-desc",
					count: "20"
				}
			]
		};

		var samelove = {
			flickr: [
				{
					tags: "gaycouple",
					sort: "interestingness-desc",
					count: "20"
				},
				{
					tags: "lesbiancouple",
					sort: "interestingness-desc",
					count: "20"
				},
				{
					tags: "gaymarried",
					sort: "interestingness-desc",
					count: "20"
				}
			],
			facebook: [
				{
                    type: 'pages',
                    minLikes: 200,
                    ids: ['gayrights.change.org', '106313199390099', "humanrightscampaign"]
               	}
	        ],
	        twitter: [
	        	{ query: "LegalizeGayMarriage"}
	        ],
	        reddit: [
	        	{
	        		query: "married site:imgur.com subreddit:lgbt",
	        		limit: "10"
	        	},
	        	{
					type: "embed",
					query: "same-sex marriage"
				}
	        ]
		};

		return collage.load("kids", {
			flickr: ["kids,playing"]
		}).then(function(){
			console.log("load anti-gay religious protests");
			return collage.load("anti-gay religious protests", protests);
		}).then(function(){
			console.log("load fud");
			return collage.load("fud", fudMedia);
		}).then(function(){
			console.log("load carelessness");
			return collage.load("carelessness", carelessness);
		}).then(function(){
			console.log("load civil rights");
			return collage.load("civil rights", civilRights);
		}).then(function(){
			console.log("load protests");
			return collage.load("protests", generalProtest);
		}).then(function(){
			console.log("load general LGBT news");
			return collage.load("general lgbt news", generalLGBTNews);
		}).then(function(){
			console.log("load same sex marriage");
			return collage.load("same-sex marriage news", sameSexMarriage);
		}).then(function(){
			console.log("load same sex marriage photos");
			return collage.load("same-sex marriage photos", sameSexMarriagePhoto);
		}).then(function(){
			console.log("load same love");
			return collage.load("same love", samelove);
		});
	});
};

Experience.prototype.start = function(){
	var self = this;

	if(this.started) return;
	this.started = true;

	this.mainCollageElement.style.backgroundColor = "white";
	this.mainCollageElement.style[utils.transitionAttribute] = "background-color 30s";

	var titleElement = this.titleElement = createTitleElement();
	titleElement.element.style.opacity = 1;
	titleElement.element.style[utils.transitionAttribute] = "opacity 30s";
	
	var collageHorizontalCenter = this.collage.width / 2,
		collageVerticalCenter = this.collage.height /2,
		musicVideoLeft = collageHorizontalCenter - (this.musicVideo.width / 2),
		musicVideoTop = collageVerticalCenter - (this.musicVideo.height / 2);

	this.collage.showElement(
		titleElement, 
		collageHorizontalCenter - (titleElement.width / 2), 
		musicVideoTop - titleElement.height, 
		true);


	this.collage.showElement(
		this.musicVideo, 
		musicVideoLeft,
		musicVideoTop, 
		true);
	this.collage.configureTag("music video", {
		chanceMultiplier: 3
	});


	this.collage.on("move start", function(){console.log("MOVE START");});
	this.collage.on("move stop", function(){console.log("MOVE STOP");});
	this.collage.on("pointer tracking start", function(){console.log("POINTER TRACKING START");});
	this.collage.on("pointer tracking stop", function(){console.log("POINTER TRACKING STOP");});

	this.setupTiming();
/*
	this.collage.setActiveTags("music video", "test");
	this.collage.start();
	this.collage.speed(7,2);*/
};

Experience.prototype.setupTiming = function(){
	var self = this,
		collage = self.collage;

	var introPics; // We fade these in, so need to keep track of them cross-closure

	// TIMING
	this.musicVideo.on("time:1", function(){
		log("experience start: fade to black");
		
		collage.container.style.backgroundColor = "black";
		self.titleElement.element.style.opacity = 0;
		collage.setActiveTags("music video", "kids");
		
		introPics = collage.fill();
		introPics.forEach(function(boundingBox){
			boundingBox.element.element.style.opacity = 0;
			boundingBox.element.element.style[utils.transitionAttribute] = "opacity 2s";
		});

		collage.start();
		
	});

	// 0:11 Fade in to video
	this.musicVideo.on("time:11", function(){
		log("visual start");
	});

	// 0:43 Piano starts playing
	this.musicVideo.on("time:43", function(){
		log("allow movement, show kids");
		collage.setActiveTags("music video", "kids");
		introPics.forEach(function(boundingBox){
			boundingBox.element.element.style.opacity = 1;
		});
		collage.speed(6,2);
	});

	// 1:17 "For those that like the same sex..."
	this.musicVideo.on("time:77", function(){
		log("show gay fear/uncertainty/doubt");
		collage.setActiveTags("music video", "fud");
	});

	// 1:40 "I can't change even if I tried to..."
	this.musicVideo.on("time:100", function(){
		log("show anti-gay religious protests");
		// sad gay people?
		collage.setActiveTags("music video", "anti-gay religious protests");
	});

	// 2:17 "If I was gay I would think hip-hop hates me..."
	this.musicVideo.on("time:137", function(){
		log("show carelessness");
		collage.setActiveTags("music video", "carelessness");
	});

	// 2:39 "It's the same hate that's caused war from religion//"
	this.musicVideo.on("time:156", function(){ //159
		log("show misc civil rights");
		collage.setActiveTags("music video", "civil rights");
	});

	// 2:51 "If you preach hate at the service, those words aren't annoited..."
	this.musicVideo.on("time:171", function(){
		log("show struggle for gay rights");
		collage.setActiveTags("music video", "protests");
	});

	// 3:48 "We press play, don't press pause..."
	this.musicVideo.on("time:228", function(){
		log("show general recent news regarding lgbt people");
		collage.setActiveTags("music video", "protests", "general lgbt news");
	});

	// 4:04 "And a certificate on paper isn't gonna solve it all..."
	this.musicVideo.on("time:244", function(){
		log("show general recent news regarding same-sex marriage");
		collage.setActiveTags("music video", "same-sex marriage news", "same-sex marriage photos");
	});

	// 4:20 "About time we raised up!"
	this.musicVideo.on("time:260", function(){
		log("show love");
		collage.setActiveTags("music video", "same love", "same-sex marriage photos");
	});

	// 4:54 "Love is patient, love is kind..."
	this.musicVideo.on("time:320", function(){
		log("recenter video");
		collage.setActiveTags("music video");
	});

	// 5:30 "Credits begin"
	this.musicVideo.on("time:330", function(){
		log("roll credits");
		self.transitionToCredits();
	});

};


Experience.prototype.startCredits = function(){
	var self = this;
	log("credits");
	
	this.finaleOverlayElement.style.display = "block";
};

Experience.prototype.transitionToCredits = function(){
	var self = this;

	log("transition: bluring, coming to a stop, and starting credits");
	
	this.collage.speed(0, 10 * 1000, null, function(){
		self.collage.pause();
	});
	
	this.collage.css("opacity", 0, 5);
	this.fillCredits();
	setTimeout(this.startCredits.bind(this), 4 * 1000);
};

function createTitleElement(){
	var title = document.createElement("div");
	title.className = "title";
	title.innerHTML = "Same Love";
	document.body.appendChild(title);
	return new Collage.element.Simple(title);
}

Experience.prototype.windowClickHandler = function(){
	var self = this;
	utils.requestFullscreen.call(document.documentElement);
	
	setTimeout(function(){
		self.introOverlayElement.style.opacity = 0;

		setTimeout(function(){
			self.introOverlayElement.style.display = "none";
			self.start();
		}, 1000);
	}, 500);
};
