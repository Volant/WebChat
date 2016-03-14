/*jshint node:true */
/*global require */
/*global console */

var wsServer = require("ws");

(function () {
  "use strict";

  var connections = {},
    webSocketServer = new wsServer.Server({
      port: 8080
    });
  
  webSocketServer.on('connection', function (ws) {
    console.log("connected");
  
    var id = Math.random();
    connections[id] = ws;
    
    ws.on('message', function (message) {
      console.log("got message " + message);
      connections[id].send('[ { "name": "1" }, { "name": "2" }, { "name": "default" } ]');
    });

    ws.on('close', function () {
      console.log("disconnected");
    });
  });
  
}());

/*
var wsServer = require("ws");

// подключенные клиенты
var clients = {};

// WebSocket-сервер на порту 8081
var webSocketServer = new wsServer.Server({
  port: 8081
});
webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);

    for (var key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });

});
*/

//var express = require('express');
//var webChatServer = express();
//var bodyParser = require('body-parser');
//
//webChatServer.use(bodyParser.urlencoded( { extended: true } ));
//webChatServer.use(bodyParser.json());
//
//var port = process.env.PORT || 8080;
//
//var roomsList = [];
//
//var router = express.Router();
//router.route('/rooms')
//  .get(function(req, res) {
//    res.json(
//      {
//        rooms: [ { name: '1' }, { name: '2' }, { name: 'default' } ]
//      }
//    )
//  })
//  .post(function(req, res) {
//    res.json(
//      {
//        message: 'add room'
//      }
//    );
//  })
//;
//
//webChatServer.use('/api', router);
//
//webChatServer.listen(port);
//
//console.log("Server started at " + port);
