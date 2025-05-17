import { WebSocket, WebSocketServer } from "ws";

interface User {
    socket: WebSocket,
    room: string
}

const wss = new WebSocketServer({port: 8080}, ()=>{
    console.log('Server Started');
});

let userCount = 0;
let sockets: User[] = []

wss.on('connection', (socket: WebSocket) => {
    // sockets.push(socket)
    userCount+=1;
    
    socket.on('message', (msg: string) => {
        const parsedMsg = JSON.parse(msg)
        if(parsedMsg.type === 'join') {
            sockets.push({
                socket,
                room : parsedMsg.payload.roomId
            })
            console.log(`User #${userCount} Connected`);
        }
        
        if(parsedMsg.type === 'chat') {
            let currentUserRoom = null;

            for (let i = 0; i < sockets.length; i++) {
                if (sockets[i].socket == socket) {
                    currentUserRoom = sockets[i].room
                }
            }

            sockets.forEach((user) => {
                if (user.room === currentUserRoom) {
                    user.socket.send(
                        JSON.stringify({
                            type: "chat",
                            payload: {
                                message: parsedMsg.payload.message,
                            },
                        })
                    );
                }
            });
        }
    })

    socket.on('disconnect', ()=>{
        sockets = sockets.filter(item => item )
    })
})