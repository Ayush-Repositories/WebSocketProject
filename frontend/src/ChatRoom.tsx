import { useEffect, useRef, useState, type SetStateAction } from "react";
import LandingPage from "./LandingPage";

interface chatRoomProps {
    isConnected: boolean,
    setIsConnected: React.Dispatch<SetStateAction<boolean>>
}

function ChatRoom({isConnected, setIsConnected}: chatRoomProps) {
    const [msgs, setMsgs] = useState<string[]>([])
    const [room, setRoom] = useState<string>('')
    const wsRef = useRef<WebSocket | null>(null)
    const msgRef = useRef<HTMLInputElement>(null)
    const socket_link = import.meta.env.VITE_SOCKET_LINK;
    const isConnectedRef = useRef(false);
    const roomRef = useRef(null)
    let aalu;


    useEffect(() => {
        let intervalId;

        const connect = () => {
            if (isConnectedRef.current) return; // ✅ check the ref

            const socket = new WebSocket(socket_link);
            wsRef.current = socket;

            socket.onopen = () => {
                setIsConnected(true);
                isConnectedRef.current = true; // ✅ update the ref
            };

            socket.onclose = () => {
                setIsConnected(false);
                isConnectedRef.current = false; // ✅ update the ref
                setMsgs([])
                setRoom('')
            };

            socket.onmessage = (e) => {
                try {
                    const data = JSON.parse(e.data);
                    if (data.type === "chat") {
                        const message = data.payload.message;
                        setMsgs(prevMsgs => [...prevMsgs, message]);
                    }
                } catch (err) {
                    console.error("Invalid JSON received", e.data);
                }
            };
        };

        connect(); // Initial attempt

        intervalId = setInterval(() => {
            if (!isConnectedRef.current) {
                connect();
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);


    return (
        isConnected ? 
        (<div className='max-h-screen h-screen bg-black flex flex-col justify-between'>
            <div className="text-white">
                {room.length!=0 ? <div>Room: {room}</div> : <div>
                    Enter Room ID: 
                    <input type="text" placeholder="Room ID" className="bg-white p-2 text-black" ref={roomRef}/>
                    <button className="bg-purple-600 text-white p-2 cursor-pointer" onClick={
                        () => {
                            //@ts-ignore
                            const roomId = roomRef.current?.value;
                            if (roomId) {
                                setRoom(roomId);
                                wsRef.current?.send(JSON.stringify({
                                    type: 'join',
                                    payload: {
                                        roomId: roomId // ✅ use local variable
                                    }
                                }));
                            }
                        }
                    }>Go To Room</button>
                </div>}
            </div>
            <div className='h-[85vh] overflow-y-auto'>
                {msgs.map((msg, index) => (
                    <div key={index} className='bg-white text-black rounded px-4 py-2 mx-6 my-4 w-fit'>
                        <span>{msg}</span>
                    </div>
                ))}
            </div>
            <div className='w-full bg-black flex'>

                <input type="text" className='flex-1 p-4 bg-white' ref={msgRef}/>
                <button className='bg-purple-600 text-white p-4 cursor-pointer' onClick={()=>{
                    const msg = msgRef.current?.value
                    if (msg) {
                        wsRef.current?.send(JSON.stringify({
                            type: "chat",
                            payload: {
                                message: msg
                            }
                        }))
                        if (msgRef.current) {
                            msgRef.current.value = ''
                        }
                    }
                }}>Send</button>
            </div>
        </div>) : <LandingPage/>
    )
}

export default ChatRoom