(function webChat (global, $) {
    
    'use strict';
    
    var webChat = function(remote) {
        var wc = new webChat.init(remote);
        wc.newRoom(wc.getDefaultRoomName());
        return wc;
    };
    
    webChat.prototype = {
        
        log: function() {
            console.log(this);
        },
        
        getDefaultRoomName: function() {
            return RoomDefaultName;
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
        
        getRoomList: function() {
            return this.roomList;
        },
        
        newRoom: function(roomName) {
            var newRoom = {
                name       : roomName,
                userList : [this.remote],
                owner    : this.remote
            };
            this.roomList.push(newRoom);
        },
        
        setRoomList: function(list) {
            this.roomList = list;
        },
        
        getRemote: function() {
            return this.remote;
        }
        
    };
    
    var WebSocketsServer = "localhost";
    var RoomDefaultName  = "Self";
    
    webChat.init = function(remote) {

        var self = this;

        self.version = '0.1';
        
        self.currentRoomName = RoomDefaultName;
        self.roomList = [];
        self.remote   = remote;
        
    };
    
    webChat.init.prototype = webChat.prototype;
    
    global.WC = global.webChat = webChat;
    
}(window, jQuery));

/*
var socket = new WebSocket("ws://localhost/chat");

socket.onopen = function (event) {
    console.log("opened");
}
*/
