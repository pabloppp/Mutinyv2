angular.module('app').controller("mainCtrl", function($filter, $http, $timeout, $interval){
	var main = this;	
	console.log("hello angular");

	main.user = {
		name: "Babbleberns"
	}

	main.date = $filter('date')(new Date(), 'EEEE dd/MM/85');

	main.unavailable = function(){

		var errors = [
		"Corrupted data, insert floppy nº2. <br><br>This service is temporarely unavailable...",
		"Cannot read disk partition, may be damaged <br><br>Impossible to access service...",
		]

		var nrnd = Math.floor((Math.random() * errors.length));

		main.error = errors[nrnd];
	}

	$timeout(function(){
		main.loaded = true;
	},100);

	//GET WEATHER
	navigator.geolocation.getCurrentPosition(function(position){

		$http.jsonp("https://api.forecast.io/forecast/a38089c41c445920364cdfa8ff93eaf7/"+position.coords.latitude+","+position.coords.longitude+"?callback=JSON_CALLBACK")
		.success(function(data){
			main.forecast = {
				text: data.currently.summary,
				rains: (data.currently.precipProbability*100)+"%"
			}
		});
	});

	//GET STOCK DATA

	$http.get("http://finance.google.com/finance/info?client=ig&q=MSFT,AAPL,GOOG,AMCX")
	.success(function(data){
		data = JSON.parse(data.substring(3,data.length));
		main.stocks = data;
	});

	main.stockName = function(code){
		if(code == "MSFT") return "Microsoft";
		if(code == "AAPL") return "Apple";
		if(code == "GOOG") return "Google";
		if(code == "AMCX") return "AMC Networks";
	}

	//GET LATEST NEWs
	$http.get("/db/news")
	.success(function(data){
		main.latestNew = data.content;
	});

	//GET CURRENT TIME
	var updateTime = function(){
		var date = new Date;
		main.time = date.getHours()+":"+date.getMinutes();
	}
	updateTime();
	$interval(updateTime, 10000);

	//TOGGLE OLD STYLE
	var oldStyle = 0;
	main.oldStyle = localStorage.oldStyle || false;
	main.toggleOldStyle = function(){
		oldStyle++;
		if(oldStyle >= 10){
			oldStyle = 0;
			main.oldStyle = !main.oldStyle;
			if(main.oldStyle) localStorage.oldStyle = true;
			else localStorage.removeItem('oldStyle');
		}
		$timeout(function() {
			oldStyle = 0;	
		}, 5000);
	};



})