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
    console.log(`User #${userCount} Connected`);

    socket.on('message', (msg: string) => {
        const parsedMsg = JSON.parse(msg)
        if(parsedMsg.type === 'join') {
            sockets.push({
                socket,
                room : parsedMsg.payload.roomId
            })
        }
        if(parsedMsg.type === 'chat') {
            const currentUserRoom = sockets.find((sock) => {
                sock.socket ==  socket
            })?.room

            for(let i = 0; i<sockets.length; i++) {
                if(sockets[i].room === currentUserRoom) {
                    sockets[i].socket.send(parsedMsg.payload.message)
                }
            }
        }
        console.log(`Message: ${msg.toString()}`);
        sockets.forEach( ({socket, room})=>{
            socket.send(`${msg.toString()}, says the server`)
        } )
    })

    socket.on('disconnect', ()=>{
        sockets = sockets.filter(item => item )
    })
})