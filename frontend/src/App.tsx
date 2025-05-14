import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {

  const [msgs, setMsgs] = useState([''])
  const wsRef = useRef()
  const msgRef = useRef();

  useEffect(()=>{
    const ws = new WebSocket('http://localhost:8080')
    ws.onmessage = (e) => {
      setMsgs(m => [...m, e.data])
    }
    wsRef.current = ws;
    ws.onopen = ()=>{
      ws.send(JSON.stringify({
        type:'join',
        payload: {
          roomId: 'red'
        }
      }))
    }
     
    return () => {
      ws.close()
    }
  }, [])


  return (
    <div className='max-h-screen h-screen bg-black flex flex-col justify-between'>
      <div className='h-[85vh]'>
        {
        msgs.map(msg => 
          <div className='bg-white text-black rounded px-4 py-2 mx-6 my-4 w-fit'>
            <span>{msg}</span>
          </div>)
        }
      </div>
      <div className='w-full bg-black'>
        <input type="text" className='flex-1 p-4 bg-white' ref={msgRef}/>
        <button className='bg-purple-600 text-white p-4' onClick={()=>{
          const msg = msgRef.current?.value
          // @ts-ignore
          wsRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
              message: msg
            }
          }))
        }}>Send</button>
      </div>
    </div>
  )
}

export default App
