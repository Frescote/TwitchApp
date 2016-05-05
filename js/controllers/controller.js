myApp.controller('mainController',['$scope', '$q','twitch', function($scope, $q, twitch){

	function user(username){
		this.name = username;
		this.status = "Offline";
		this.channelUrl = '#';
		this.logo = "assets/twitchDefaultAvatar.png";
		this.statusBit = 1; //Offline
		this.show = true;
	}

	function storeUserData(data){
		if(data[0][0] === -1 || data[1][0] === -1){
			// Account not found
			index = $scope.users.findIndex(function(element){
				return data[0][1] === element.name;
			});
			$scope.users[index].status = "Channel not found.";
			$scope.users[index].statusBit = 0; //Not found
		}else{
			index = $scope.users.findIndex(function(element){
				return data[0].name === element.name;
			});
			$scope.users[index].name = data[0].display_name;
			$scope.users[index].logo = data[0].logo;
			$scope.users[index].channelUrl = data[0].url;
			$scope.users[index].statusBit = 2; //Online
			if(data[1].stream !== null){
				$scope.users[index].status = data[0].status;
			}
		}
		sortUserDataByStatus();
		$scope.usersLoaded++;
		if($scope.usersLoaded === $scope.userList.length) {
			$scope.isLoadingComplete = true;
		}
	}

	function sortUserDataByStatus() {
		$scope.users.sort( function (a, b) {
			return a.status < b.status;
		});
	}

	$scope.getLoadingPercentage = function()  {
		return (($scope.usersLoaded/$scope.users.length)*100).toString();
	}

	//Variables
	$scope.isLoadingComplete = false;
	$scope.usersLoaded = 0;
	var index = -1;
	$scope.users = [];
	$scope.userList = ["freecodecamp", "twitchplayspokemon", "storbeck", "terakilobyte", "habathcx","robotcaleb","thomasballinger","noobs2ninjas","beohoff", "brunofin"].sort( function (a, b) {
		return a.toLowerCase() > b.toLowerCase();
	});

	// Initialize users
	$scope.userList.forEach(function(username){
		var newUser = new user(username);
		$scope.users.push(newUser);
	});

	for(var i = 0; i < $scope.users.length; i++){
		$q.all([
			twitch.getChannelInfo($scope.users[i].name),
			twitch.getStreamInfo($scope.users[i].name)
		]).then(storeUserData);
	}
}]);
