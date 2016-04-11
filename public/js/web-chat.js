/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

(function webChatFunc() {
  const RoomDefaultName = 'Web Chat';

  function webChat(remote) {
    const self = this;

    self.version = '0.1';

    self.currentRoomName = RoomDefaultName;
    self.roomList = [];

    self.remote = remote;

    self.newRoom(self.getDefaultRoomName());
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

  };

  window.WC = window.webChat = webChat;
}());

