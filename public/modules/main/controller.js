angular.module('app').controller("mainCtrl", function($filter){
	var main = this;	
	console.log("hello angular");

	main.user = {
		name: "Babbleberns"
	}

	main.date = $filter('date')(new Date(), 'EEEE dd/MM/85');
})