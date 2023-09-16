import { useState } from 'react';
import Chat from './components/Chat';
import React from 'react'
import './App.css';
import io from 'socket.io-client'
const socket = io('http://localhost:3001')

const App = () => {

  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  type ClickEvent = React.MouseEvent<HTMLButtonElement>;

  const [User, setUser] = useState<string>("");
  const [roomID, setRoomID] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);

  const onChangeUser = (event: InputEvent) => setUser(event.target.value);
  const onChangeRoomID = (event: InputEvent) => setRoomID(event.target.value);
  const joinHandler = (event: ClickEvent) => {
    event.preventDefault()
    if (User !== "" && roomID !== "") {
      socket.emit("new-user-joined", {
        userName: User,
        roomID
      });
      setJoined(true);
    }
  }

  return (
    <>
      {
        (!joined) ?
          (
            <div className='main-container-form'>
              <form className='join-form'>
                <h1>Join Flex Chat</h1>
                <input className='input-field' placeholder='Join With Name' onChange={onChangeUser} type="text" name="name" id="name" />
                <input className='input-field' placeholder='Room ID' onChange={onChangeRoomID} type="text" name="roomId" id="roomId" />
                <button className='btn' onClick={joinHandler}>Join Room</button>
              </form>
            </div>
          )
          :
          (
            <Chat User={User} RoomID={roomID} socket={socket} />
          )
      }
    </>
  )
}

export default App;
