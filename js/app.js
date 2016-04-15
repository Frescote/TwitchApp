var myApp = angular.module('myApp', []);

myApp.factory('twitch', ['$http', '$q', function($http, $q) {
  return {
    getChannelInfo: function(username){
      var deferred = $q.defer();
      var promises = [];
      $http.get('https://api.twitch.tv/kraken/channels/' + username)
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function(err) {
            deferred.resolve(err);
          });
      return deferred.promise;
    },
    getStreamInfo: function(username){
      var deferred = $q.defer();
      $http.get('https://api.twitch.tv/kraken/streams/' + username)
          .success(function(data2) {
            deferred.resolve(data2);
          })
          .error(function(err2) {
            deferred.resolve(err2);
          });
      return deferred.promise;
    }
  };
}]);

myApp.controller('mainController',['$scope', '$q','twitch', function($scope, $q, twitch){
  $scope.user = [
    {name: "freecodecamp"},
    {name: "storbeck"},
    {name: "terakilobyte"},
    {name: "habathcx"},
    {name: "robotcaleb"},
    {name: "thomasballinger"},
    {name: "noobs2ninjas"},
    {name: "beohoff"}
  ];
  function storeUserData(data){
    var index = $scope.user.findIndex(function(element){
      //console.log(data[0].name, element.name);
      return data[0].name === element.name;
    });
    $scope.user[index].channel = data[0];
    $scope.user[index].stream = data[1];
    //console.log($scope.user);
  }
  for(var i = 0; i < $scope.user.length; i++){
    $q.all([
      twitch.getChannelInfo($scope.user[i].name),
      twitch.getStreamInfo($scope.user[i].name)
    ]).then(storeUserData);
  }

}]);

myApp.directive('listTwitch', function(){
  return {
    restrict: 'E',
    templateUrl: "js/directives/listTemplate.html"
  };
});
