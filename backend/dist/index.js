"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 }, () => {
    console.log('Server Started');
});
let userCount = 0;
let sockets = [];
wss.on('connection', (socket) => {
    // sockets.push(socket)
    userCount += 1;
    socket.on('message', (msg) => {
        const parsedMsg = JSON.parse(msg);
        if (parsedMsg.type === 'join') {
            sockets.push({
                socket,
                room: parsedMsg.payload.roomId
            });
            console.log(`User #${userCount} Connected`);
        }
        if (parsedMsg.type === 'chat') {
            let currentUserRoom = null;
            for (let i = 0; i < sockets.length; i++) {
                if (sockets[i].socket == socket) {
                    currentUserRoom = sockets[i].room;
                }
            }
            sockets.forEach((user) => {
                if (user.room === currentUserRoom) {
                    user.socket.send(JSON.stringify({
                        type: "chat",
                        payload: {
                            message: parsedMsg.payload.message,
                        },
                    }));
                }
            });
            console.log(parsedMsg.payload.message.toString() + ' from ' + currentUserRoom);
        }
    });
    socket.on('disconnect', () => {
        sockets = sockets.filter(item => item);
    });
});
