/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

(function webChatFunc() {
  const RoomDefaultName = 'Web Chat';

  function webChat(opts) {
    const self = this;

    self.version = '0.1';

    self.currentRoomName = RoomDefaultName;
    self.roomList = [];

    self.remote = opts.remote;

    self.newRoom(self.getDefaultRoomName());

    self.socket = new WebSocket('ws://localhost/api');

    self.socket.onopen = function onopen() {
      console.log('connected');
    };

    self.socket.onmessage = opts.onMessageCallback;

    self.sendWSMessage('register', { remote: self.getRemote() });
  }

  function waitForSocketConnected(sock, callback) {
    setTimeout(() => {
      if (sock.readyState === 1) {
        if (callback !== null) {
          callback();
        }
        return;
      }

      if (sock.readyState !== 1) {
        waitForSocketConnected(sock, callback);
      }
    }, 0);
  }

  webChat.prototype = {
    log() {
      console.log(this);
    },

    getRemote() {
      return this.remote;
    },

    getUsersList(roomName) {
      this.currentRoomName = roomName || RoomDefaultName;
      const room = this.roomList[roomName];
      if (room) {
        return room.userList;
      }

      return [];
    },

    addUser(roomName, name) {
      const room = this.roomList.find(r => r.name === roomName);

      if (room) {
        room.userList.push(name);
      }
    },

    setUserList(roomName, list) {
      this.roomList[roomName].userList = list;
    },

    getDefaultRoomName() {
      return RoomDefaultName;
    },

    getRoomList() {
      return this.roomList;
    },

    newRoom(roomName) {
      let newRoomName = roomName;

      if (!newRoomName) {
        newRoomName = this.getDefaultRoomName();
      }
      const newRoom = {
        name: roomName,
        userList: [this.remote],
        owner: this.remote,
      };
      this.roomList.push(newRoom);
      this.currentRoomName = roomName;
    },

    changeRoom(roomName) {
      this.currentRoomName = roomName;
    },

    setRoomList(list) {
      this.roomList = list;
    },

    getRoom(roomName) {
      const room = this.roomList.find(r => r.name === roomName);
      return room;
    },

    getMessagesList() {
      const room = this.getRoom(this.currentRoomName);
      return room.messagesList;
    },

    setMessagesList(messagesList) {
      const room = this.getRoom(this.currentRoomName);
      room.messagesList = messagesList;
    },

    sendMessage(message) {
      let messagesList = this.getMessagesList();
      if (messagesList === undefined) {
        messagesList = [];
      }
      messagesList.push(
        {
          text: message,
          poster: this.getRemote(),
        }
      );
      this.setMessagesList(messagesList);
    },

    sendWSMessage(message, options) {
      waitForSocketConnected(this.socket, () => {
        const messageToSend = {
          cmd: message,
          opts: options,
        };
        this.socket.send(JSON.stringify(messageToSend));
      });
    },
  };

  window.WC = window.webChat = webChat;
}());

