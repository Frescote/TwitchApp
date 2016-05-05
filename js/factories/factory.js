// HTTP Calls w/ promises
myApp.factory('twitch', ['$http', '$q', function($http, $q) {
	return {
		getChannelInfo: function(username){
			var deferred = $q.defer();
			$http.get('https://api.twitch.tv/kraken/channels/' + username)
				.then(function(data) {
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
