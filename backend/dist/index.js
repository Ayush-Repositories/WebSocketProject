"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 }, () => {
    console.log('Server Started');
});
let userCount = 0;
let sockets = [];
wss.on('connection', (socket) => {
    sockets.push(socket);
    userCount += 1;
    console.log(`User #${userCount} Connected`);
    socket.on('message', (msg) => {
        console.log(`Message: ${msg.toString()}`);
        sockets.forEach((socket) => {
            socket.send(`${msg.toString()}, says the server`);
        });
    });
});
