/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
/* global require */
/* global console */

;(function WC () {
  const wsServer = require('ws')

  const connections = {}
  const webSocketServer = new wsServer.Server({
    port: 8090,
    webChat: this,
  })

  function WebChat (webSocket) {
    this.defaultRoom = 'Self'
    this.roomsList = []
    this.ws = webSocket

    this.joinToRoom = function joinToRoom (roomName) {
      const that = this

      that.roomsList.push({ name: roomName })
    }

    this.joinToRoom(this.defaultRoom)
  }

  WebChat.prototype = {
    sendMessage: function sendMessage (message) {
      this.ws.send(JSON.stringify(message))
    },

    handleMessage: function handleMessage (message) {
      console.log(message)
      switch (message.cmd) {
        case 'getRoomsList':
          this.sendMessage(
            {
              cmd: 'getRoomsList',
              roomsList: this.roomsList,
            }
          )
          break
        case 'getMessagesList':
          this.sendMessage(
            {
              cmd: 'getMessagesList',
              messagesList: [{ text: 'AAA' }, { text: 'BBB' }],
            }
          )
          break
        case 'newMessage':
          this.sendMessage(
            {
              cmd: 'newMessage',
              result: 'OK',
            }
          )
          break
        default:
          console.log('Unexpected command!')
          break
      }
    },
  }

  webSocketServer.on('connection', (ws) => {
    const id = Math.random()

    connections[id] = new WebChat(ws)

    ws.on('message', (message) => {
      try {
        connections[id].handleMessage(JSON.parse(message))
      } catch (e) {
        console.log(e)
      }
    })

    ws.on('close', () => {
      console.log('disconnected')
    })
  })
}())
