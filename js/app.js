var myApp = angular.module('myApp', []);

myApp.factory('twitch', ['$http', '$q', function($http, $q) {
  return {
    getChannelInfo: function(user){
      var deferred = $q.defer();
      $http.get('https://api.twitch.tv/kraken/channels/' + user)
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function(err) {
            deferred.resolve(err);
          });
      return deferred.promise;
    },
    getStreamInfo: function(user){
      var deferred = $q.defer();
      $http.get('https://api.twitch.tv/kraken/streams/' + user)
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(err) {
        deferred.resolve(err);
      });
      return deferred.promise;
    }
  };
}]);

myApp.controller('mainController',['$scope','twitch', function($scope, twitch){

  $scope.users = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff"];
  $scope.channelInfo = [];

  function storeChannelInfo(data){
    $scope.channelInfo.push(data);
    console.log($scope.channelInfo);
  }

  for(var i = 0; i < $scope.users.length; i++){
    twitch.getChannelInfo($scope.users[i]).then(storeChannelInfo);
  }
}]);
