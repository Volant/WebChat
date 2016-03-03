(function webChat (global, $) {
    
    'use strict';
    
    var WebSocketsServer = "localhost";
    var RoomDefaultName  = "Self";
    
    function webChat(remote) {

        var self = this;

        self.version = '0.1';
        
        self.currentRoomName = RoomDefaultName;
        self.roomList = [];
        
        self.remote = remote;

        self.newRoom(self.getDefaultRoomName());
    };
    
    webChat.prototype = {
        
        log: function() {
            console.log(this);
        },
        
        getRemote: function() {
            return this.remote;
        },
        
        getUsersList: function(roomName) {
            this.currentRoomName = roomName || RoomDefaultName;
            var room = this.roomList[roomName];
            if (room) {
                return room.userList;
            } else {
                return [];
            }
        },
        
        addUser: function(roomName, name) {
            var room = this.roomList.find(function (room) {
                return room.name === roomName;
            });
            
            if (room) {
                room.userList.push(name);
            }
        },
        
        setUserList: function(roomName, list) {
            this.roomList[room_name].userList = list;
        },
        
        getDefaultRoomName: function() {
            return RoomDefaultName;
        },
        
        getRoomList: function() {
            return this.roomList;
        },
        
        newRoom: function(roomName) {
            var newRoom = {
                name     : roomName,
                userList : [this.remote],
                owner    : this.remote
            };
            this.roomList.push(newRoom);
        },
        
        setRoomList: function(list) {
            this.roomList = list;
        },
        
        getRoom: function(roomName) {
            var room = this.roomList.find(function (room) {
                return room.name === roomName;
            });
            return room;
        },
        
        getMessagesList: function() {
            var room = this.getRoom(this.currentRoomName);
            return room.messagesList;
        },
        
        setMessagesList: function(messagesList) {
            var room = this.getRoom(this.currentRoomName);
            room.messagesList = messagesList;
        },
        
        sendMessage: function(message) {
            var messagesList = this.getMessagesList();
            if (messagesList === undefined) {
                messagesList = [];
            }
            messagesList.push(
                {
                    text: message,
                    poster: this.getRemote()
                }
            );
            this.setMessagesList(messagesList);
        }
        
    };
    
    global.WC = global.webChat = webChat;
    
}(window, jQuery));

/*
var socket = new WebSocket("ws://localhost/chat");

socket.onopen = function (event) {
    console.log("opened");
}
*/
