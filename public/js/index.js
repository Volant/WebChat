var webChatApp = angular.module('webChatApp', ['ngRoute']);

webChatApp.config(function($routeProvider) {
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

webChatApp.service('remote', function() {
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

webChatApp.controller('indexController', ['$scope', '$location', 'remote',
    function ($scope, $location, remote) {
        remote.setRemote('V');
        if (remote.getRemote() === undefined) {
            $location.path("/");
        }
        
        $scope.login = function() {
            remote.setRemote(this.nick);
            $location.path("/chat");
        }
    }
]);

webChatApp.controller('chatController', [ '$scope', 'remote',
    function ($scope, remote) {
        
        $scope.messagesList = [];
        
        $scope.wc = new WC(remote.getRemote());
        
        $scope.sendMessage = function() {
            this.wc.sendMessage(this.message);
            this.message = '';
            this.messagesList = this.wc.getMessagesList();
        }
    }
]);


