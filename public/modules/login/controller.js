angular.module('app').controller("loginCtrl", function($http, $timeout, $interval){
	var login = this;

	login.mode = localStorage.loginMode ||"register";

	login.data = {};	

	//GET USER POSITION
	navigator.geolocation.getCurrentPosition(function(position){
		login.data.location = position.coords;
	});

	$timeout(function(){
		login.loaded = true;
	},100);

	//GET CURRENT TIME
	var updateTime = function(){
		var date = new Date;
		login.time = date.getHours()+":"+date.getMinutes();
	}
	updateTime();
	$interval(updateTime, 10000);

	login.changeMode = function(mode){
		localStorage.loginMode = mode;
		login.mode = mode;
	}

	login.send = function(){
		console.log(login.data);

		if(login.mode == "register"){
			$http.post("/users/new", {
				user: login.data
			}).success(function(res){
				console.log(res);
				login.error = "SUCCESS: <br>A confirmation email has been seent to you, follow the steps specified there!"
				login.mode = "login";
				localStorage.loginMode = login.mode;
			}).error(function(error){
				console.log(error);
				login.error = "SysError: <br>"+error.message;
			});
		}
		else{
			$http.post("/users/login", {
				user: login.data
			}).success(function(res){
				console.log(res);
			}).error(function(error){
				console.log(error);
				login.error = "SysError: <br>"+error.message;
			});
		}
	}

	//TOGGLE OLD STYLE
	var oldStyle = 0;
	login.oldStyle = localStorage.oldStyle || false;
	login.toggleOldStyle = function(){
		oldStyle++;
		if(oldStyle >= 10){
			oldStyle = 0;
			login.oldStyle = !login.oldStyle
			if(login.oldStyle) localStorage.oldStyle = true;
			else localStorage.removeItem('oldStyle');
		}
		$timeout(function() {
			oldStyle = 0;	
		}, 5000);
	};


})