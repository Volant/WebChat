var webChat = angular.module('webChat', ['ngRoute']);

webChat.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl : 'pages/index.html',
        controller  : 'indexController'
    })
    .when('/chat', {
        templateUrl : 'pages/chat.html',
        controller  : 'chatController'
    });
});

webChat.service('remote', function() {
    var remote = undefined;
    
    var setRemote = function(nick) {
        this.remote = nick;
    };
    
    var getRemote = function() {
        return this.remote;
    };
    
    return {
        setRemote: setRemote,
        getRemote: getRemote
    };
});

webChat.controller('indexController', ['$scope', '$location', 'remote',
    function ($scope, $location, remote) {
        $scope.message = "This is an index page";

        if (remote.getRemote() === undefined) {
            $location.path("/");
        }
        
        $scope.login = function() {
            remote.setRemote(this.nick);
            $location.path("/chat");
        }
    }
]);

webChat.controller('chatController', [ '$scope', 'remote',
    function ($scope, remote) {
        
        console.log(remote.getRemote());
        
        $scope.wc = WC(remote.getRemote());
    
        console.log($scope.wc);
        
        $scope.message = "Draft chat page for " + $scope.wc.getRemote();
    }
]);


