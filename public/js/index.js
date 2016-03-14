var webChatApp = angular.module('webChatApp', ['ui.router']);

webChatApp.config(['$urlRouterProvider', '$stateProvider',
  function($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: "pages/index.html",
        controller: 'indexController'
      })
      .state('chat', {
        abstract: true,
        url: '/chat',
        template: '<div ui-view></div>'
//        controller: 'roomListCtrl'
      })
      .state('chat.roomlist', {
        url: '/:roomName',
        templateUrl: 'pages/chat.html',
        controller: 'roomListCtrl'
      })
    }
]);

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

webChatApp.service('apiServer', ['$q',
  function($q) {
  var socket = new WebSocket("ws://localhost/api");
  socket.onopen = function () {
    console.log('connected');
  };

  var sendMessage = function(message, callback) {
    var deferred = $q.defer();
    waitForSocketConnected(socket, function() {
      socket.send(message);
    });
    
    socket.onmessage = function(message) {
      if (message.data) {
        deferred.resolve(message);
      } else {
        deferred.reject();
      }
    };
    
    return deferred.promise;
  };
  
  return {
    sendMessage: sendMessage
  };
  
  function waitForSocketConnected(socket, callback) {
    setTimeout(function() {
      if (socket.readyState === 1) {
        if (callback !== null) {
          callback();
        }
        return;
      } else {
        console.log('connection lost');
        waitForSocketConnected(socket, callback);
      }
    }, 0);
  }
}]);

webChatApp.controller('roomListCtrl', ['$scope', 'remote', '$stateParams', '$state', 'apiServer',
  function ($scope, remote, $stateParams, $state, apiServer) {
    
    $scope.wc = new WC(remote.getRemote());

    apiServer.sendMessage("Hi").then(function(message) {
      $scope.$parent.roomsList = JSON.parse(message.data);
    });
    
    $scope.changeRoom = function(roomName) {
//        this.wc.changeRoom(roomName);
//        this.messagesList = this.wc.getMessagesList();
      
        $state.go("chat.roomlist", { roomName: roomName });
    }

    switch ($stateParams.roomName) {
      case '1':
        $scope.messagesList = [ { text: "AAAA" } ];
        break;
      case '2':
        $scope.messagesList = [ {text: "CCCC" }, { text: "BBBBB" } ];
        break;
      default:
        $scope.messagesList = [
          { poster: "ME", text: 'no messages' },
          { poster: "HE", text: "some message" }
        ];
        break;
    }
    
//    $http({
//      method: 'GET',
//      url: 'http://localhost/api/rooms'
//    }).then(function successCallback(response) {
//      $scope.roomsList = response.data.rooms;
//    }, function errorCallback(response) {
//      $scope.roomsList = [];
//    });
  }
]);

webChatApp.controller('indexController', ['$scope', '$location', 'remote', '$state',
    function ($scope, $location, remote, $state) {
        remote.setRemote('Volant');
        if (remote.getRemote() === undefined) {
            $location.path("/");
        }
        
        $scope.login = function() {
            remote.setRemote(this.nick);
            $state.go("chat.roomlist");
        }
    }
]);

webChatApp.controller('chatController', [ '$scope', '$location', 'remote', '$routeParams',
    function ($scope, $location, remote, $routeParams) {
        
        $scope.wc = new WC(remote.getRemote());
        
        $scope.sendMessage = function() {
            this.wc.sendMessage(this.message);
            this.message = '';
            this.messagesList = this.wc.getMessagesList();
        }
        
        $scope.newRoom = function() {
            this.wc.newRoom(this.roomName);
            this.roomName = '';
            this.roomsList = this.wc.getRoomList();
            this.messagesList = this.wc.getMessagesList();
        }
        
        $scope.changeRoom = function(roomName) {
            this.wc.changeRoom(roomName);
            this.messagesList = this.wc.getMessagesList();
        }
        
        $scope.roomsList = $scope.wc.getRoomList();
    }
]);


