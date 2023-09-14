import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import './App.css'
const socket = io('http://localhost:3001')

function App() {
  const [sendMessage, setSendMessage] = useState("")
  const [allMessages, setAllMessage] = useState<string[]>([])
  

  const sendMessageHandler =  async () => {
    socket.emit("send_message", sendMessage)
    if(sendMessage !== "")
      setAllMessage((list)=>[...list, sendMessage])
    
  }

  useEffect(() => {
    socket.on("recieve_message", data => {
      setAllMessage(list => [...list, data ])
     console.log(data)
    })
    return ()=>{
      socket.off("recieve_message")
    }
  }, [socket])



  return (
    <>
      <input type="text" name="message" id="message" onChange={(event) => {
        setSendMessage(event.target.value)
      }} />
      <div>{
        allMessages.map((e, i)=>{
          return (<p key={i}>{e}</p>)
        })
      }</div>
      <button onClick={sendMessageHandler}>Send Message</button>
    </>
  )
}

export default App
