angular.module('app').controller("mainCtrl", function($filter, $http, $timeout){
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

	$timeout(updateTime, 10000);



})