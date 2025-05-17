import { useState } from 'react'
import './App.css'
import ChatRoom from './ChatRoom'

function App() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <ChatRoom isConnected={isConnected} setIsConnected={setIsConnected}/>  // Pass the WebSocket directly to ChatRoom
  )
}

export default App