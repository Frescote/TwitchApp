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
            deferred.resolve(err);
          });
      return deferred.promise;
    },
    getStreamInfo: function(username){
      var deferred = $q.defer();
      $http.get('https://api.twitch.tv/kraken/streams/' + username)
          .then(function(data) {
            deferred.resolve(data.data);
          }, function(err) {
            deferred.resolve(err);
          });
      return deferred.promise;
    }
  };
}]);

myApp.controller('mainController',['$scope', '$q','twitch', function($scope, $q, twitch){
  $scope.users = [
    {name: "freecodecamp"},
    {name: "storbeck"},
    {name: "terakilobyte"},
    {name: "habathcx"},
    {name: "robotcaleb"},
    {name: "thomasballinger"},
    {name: "noobs2ninjas"},
    {name: "beohoff"}
    ,{name: "brunofin"}
  ];
  function storeUserData(data){
    var index = $scope.users.findIndex(function(element){
      //console.log(data[0].name, element.name);
      return data[0].name === element.name;
    });
    console.log(data[0], data[1]);
    $scope.users[index].channel = data[0];
    $scope.users[index].stream = data[1];
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
