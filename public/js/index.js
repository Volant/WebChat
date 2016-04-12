/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
/* global angular, WC */

angular.module('webChatApp', ['ui.router'])
  .config(['$urlRouterProvider', '$stateProvider',
  function config($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'pages/index.html',
        controller: 'indexController',
      })
      .state('chat', {
        abstract: true,
        url: '/chat',
        template: '<div ui-view></div>',
      })
      .state('chat.roomlist', {
        url: '/:roomName',
        templateUrl: 'pages/chat.html',
        controller: 'roomListCtrl',
      }
    );
  }])

  .service('remote', () => {
    let remote = void 0;

    return {
      setRemote: function setRemote(nick) {
        remote = nick;
      },
      getRemote: function getRemote() {
        return remote;
      },
    };
  })

  .service('apiServer', [function apiServer() {
    const that = this;

    const handleMessageCallback = function handleMessageCallback(message) {
      let messageData = void 0;

      try {
        messageData = JSON.parse(message.data);
      } catch (e) {
        console.log(e);
      }

      switch (messageData.cmd) {
        case 'getRoomsList':
          setTimeout(() => {
            that.scope.roomsList = messageData.roomsList;
            that.scope.$apply();
          }, 0);
          break;
        case 'getMessagesList':
          setTimeout(() => {
            that.scope.messagesList = messageData.messagesList;
            that.scope.$apply();
          }, 0);
          break;
        default:
          break;
      }
    };

    return {
      sendMessage: function sendMessage(message, options) {
        that.wc.sendWSMessage(message, options);
      },
      init: function init(opts) {
        that.wc = new WC({ remote: opts.remote, onMessageCallback: handleMessageCallback });
        that.scope = opts.scope;
      },
    };
  }])

  .controller('roomListCtrl', ['$scope', 'remote', '$stateParams', '$state', 'apiServer',
  function roomListCtrl($scope, remote, $stateParams, $state, apiServer) {
    remote.setRemote('Volant');

    apiServer.init({ remote: remote.getRemote(), scope: $scope });

    apiServer.sendMessage('login', { userName: remote.getRemote() });

    this.changeRoom = function changeRoom(roomName) {
      $state.go('chat.roomlist', { name: roomName });
      apiServer.sendMessage('changeRoom', { name: roomName });
    };

    this.getRoomsList = function getRoomsList() {
      apiServer.sendMessage('getRoomsList');
    };

    this.getMessagesList = function getMessagesList() {
      apiServer.sendMessage('getMessagesList'); // , { roomName: $scope.wc } )
    };

    if ($stateParams.roomName) {
      apiServer.sendMessage('changeRoom', { name: $stateParams.roomName });
    }

    this.getRoomsList();
    this.getMessagesList();
  }])

  .controller('indexController', ['$scope', '$location', 'remote', '$state',
  function indexController($scope, $location, remote, $state) {
    if (remote.getRemote() === undefined) {
      $location.path('/');
    }

    this.login = function login() {
      remote.setRemote(this.nick);
      $state.go('chat.roomlist');
    };
  }])

/*
  .controller('chatController', ['$scope', '$location', 'remote', '$routeParams',
  function chatController($scope, $location, remote, $routeParams) {
    $scope.wc = new WC(remote.getRemote());

    $scope.sendMessage = function sendMessage() {
      this.wc.sendMessage(this.message);
      this.message = '';
      this.messagesList = this.wc.getMessagesList();
    };

    $scope.newRoom = function newRoom() {
      this.wc.newRoom(this.roomName);
      this.roomName = '';
      this.roomsList = this.wc.getRoomList();
      this.messagesList = this.wc.getMessagesList();
    };

    $scope.changeRoom = function changeRoom(roomName) {
      this.wc.changeRoom(roomName);
      this.messagesList = this.wc.getMessagesList();
    };

    $scope.roomsList = $scope.wc.getRoomList();
  }])
*/
;
