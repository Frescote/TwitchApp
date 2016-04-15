var myApp = angular.module('myApp', []);

myApp.factory('twitch', ['$http', '$q', function($http, $q) {
  return {
    getChannelInfo: function(username){
      var deferred = $q.defer();
      $http.get('https://api.twitch.tv/kraken/channels/' + username)
          .then(function(data) {
            //console.log(data.data);
            deferred.resolve(data.data);
          }, function(err) {
            deferred.resolve([-1, username]);
          });
      return deferred.promise;
    },
    getStreamInfo: function(username){
      var deferred = $q.defer();
      $http.get('https://api.twitch.tv/kraken/streams/' + username)
          .then(function(data) {
            deferred.resolve(data.data);
          }, function() {
            deferred.resolve([-1, username]);
          });
      return deferred.promise;
    }
  };
}]);

myApp.controller('mainController',['$scope', '$q','twitch', function($scope, $q, twitch){

  var index = -1;
  function user(username){
    this.name = username;
    this.status = "Offline";
    this.channelUrl = '#';
    this.logo = "assets/twitchDefaultAvatar.png";
  }

  $scope.users = [];
  $scope.userList = ["freecodecamp", "twitchplayspokemon", "storbeck", "terakilobyte", "habathcx","robotcaleb","thomasballinger","noobs2ninjas","beohoff", "brunofin"];

  $scope.userList.forEach(function(username){
      var newUser = new user(username);
      $scope.users.push(newUser);
  });

  function storeUserData(data){
    if(data[0][0] === -1 || data[1][0] === -1){
      index = $scope.users.findIndex(function(element){
        //console.log(data[0][1], element.name);
        return data[0][1] === element.name;
      });
      $scope.users[index].status = "Channel not found.";
    }else{
      index = $scope.users.findIndex(function(element){
        //console.log(data[0].name, element.name);
        return data[0].name === element.name;
      });
      //console.log(data[0], data[1]);
      //console.log($scope.users[index].name, data[0].display_name);
      $scope.users[index].name = data[0].display_name;
      $scope.users[index].logo = data[0].logo;
      $scope.users[index].channelUrl = data[0].url;
      if(data[1].stream !== null){
        //console.log($scope.users[index].channelUrl);
        $scope.users[index].status = data[0].status;
      }
      //$scope.users[index].channel = data[0];
      //$scope.users[index].stream = data[1];
    }
  }

  for(var i = 0; i < $scope.users.length; i++){
    $q.all([
      twitch.getChannelInfo($scope.users[i].name),
      twitch.getStreamInfo($scope.users[i].name)
    ]).then(storeUserData);
  }

}]);

myApp.directive('listTwitch', function(){
  return {
    restrict: 'E',
    templateUrl: "js/directives/listElements.html"
  };
});
