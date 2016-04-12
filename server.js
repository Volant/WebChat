/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
/* global require */
/* global console */

(function WC() {
  const wsServer = require('ws');

  const self = this;
  const webSocketServer = new wsServer.Server({
    port: 8090,
  });

  function WebChat() {
    this.defaultRoom = 'Self';
    this.roomsList = new Map();
    this.connections = {};
  }

  WebChat.prototype = {
    getRoomsList: function getRoomsList(clientId) {
      const roomsListRes = [];
      this.roomsList.forEach((v, k) => {
        if (!!~v.participants.indexOf(this.getRemote(clientId))) {
          roomsListRes.push({ name: k });
        }
      });
      return roomsListRes;
    },

    joinToRoom: function joinToRoom(roomName, remoteUsername) {
      if (!this.roomsList.has(roomName)) {
        this.roomsList.set(roomName, {
          participants: [remoteUsername],
        });
      } else {
        this.roomsList.get(roomName).participants.push(remoteUsername);
      }
    },

    setRemote: function setRemote(clientId, remoteUsername) {
      Object.keys(this.connections).forEach((id) => {
        if (parseFloat(id) !== clientId) {
          if (this.connections[id].remoteUser === remoteUsername) {
            this.connections[id].socket.close();
            delete this.connections[id];
          }
        }
      });

      this.connections[clientId].remoteUser = remoteUsername;

      // this should be done in 'register' function when DB is available
      this.joinToRoom(this.defaultRoom, remoteUsername);
    },

    getRemote: function getRemote(clientId) {
      return this.connections[clientId].remoteUser;
    },

    sendMessage: function sendMessage(clientId, message) {
      this.connections[clientId].socket.send(JSON.stringify(message));
    },

    handleMessage: function handleMessage(clientId, message) {
//      console.log(message);
      switch (message.cmd) {
        case 'getRoomsList':
          this.sendMessage(clientId,
            {
              cmd: 'getRoomsList',
              roomsList: this.getRoomsList(clientId),
            }
          );
          break;
        case 'getMessagesList':
          this.sendMessage(clientId,
            {
              cmd: 'getMessagesList',
              messagesList: [{ text: 'AAA' }, { text: 'BBB' }],
            }
          );
          break;
        case 'newMessage':
          this.sendMessage(clientId,
            {
              cmd: 'newMessage',
              result: 'OK',
            }
          );
          break;
        case 'register':
          this.setRemote(clientId, message.opts.remote);
          this.sendMessage(clientId,
            {
              cmd: 'register',
              result: 'OK',
            }
          );
          break;
        default:
          console.log(`Unexpected command! ${message.cmd}`);
          break;
      }
    },
  };

  webSocketServer.on('connection', (ws) => {
    const clientId = Math.random();

    self.WC.connections[clientId] = {};
    self.WC.connections[clientId].socket = ws;

    ws.on('message', (message) => {
      try {
        self.WC.handleMessage(clientId, JSON.parse(message));
      } catch (e) {
        console.log(e);
      }
    });

    ws.on('close', () => {
      delete self.WC.connections[clientId];
      console.log('disconnected');
    });
  });

  global.WC = new WebChat();
}());
