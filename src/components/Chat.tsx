import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client';
import '../App.css'
type propsType = {
    User: string;
    RoomID: string;
    socket: Socket;
}

const Chat = ({ User, RoomID, socket }: propsType) => {
    type MessageType =
        {
            message?: string;
            userName?: string;
            roomId?: string;
            position?: string;
            hour?: number;
            min?: number;
        };

    const [sendMessage, setSendMessage] = useState("");
    const [allMessages, setAllMessage] = useState<MessageType[]>([]);

    const sendMessageHandler = () => {
        if (sendMessage !== "") {
            const sendMessageData: MessageType = {
                message: sendMessage,
                userName: User,
                roomId: RoomID,
                position: "right",
                hour: new Date().getHours(),
                min: new Date().getMinutes(),
            };
            socket.emit("send_message", sendMessageData);

            setAllMessage((list) => [...list, sendMessageData]);
            setSendMessage("")

        }
    };


    useEffect(() => {

        socket.on("user-joined", (data) => {
            setAllMessage(list => [...list, data]);
        });
        socket.on("recieve_message", payload => {

            setAllMessage(list => [...list, { ...payload, position: 'left' }]);
        });

        return () => {
            socket.off("recieve_message");
            socket.off("user-joined")
        };
    }, [socket]);

    return (
        <>
            <div className={"main-container"}>
                <div className='header'>
                    <h1>Flex Chat</h1>
                </div>
                <div className='body'>
                    {
                        allMessages.map((e, i) => {
                            return (
                                <>
                                    <p className={`${((e.position === "right") ? "right" : "left")}`} key={i}>
                                        <p className='heading'>{e.userName} (<span>{e.hour + ":" + e.min}</span>)</p>
                                       
                                        <span className='message'>{e.message} </span>
                                    </p>
                                </>
                            )
                        })
                    }
                </div>
                <div className='footer'>
                    <input type='text' className='input-field' placeholder='Enter Your Message' name="message" id="message" value={sendMessage}
                        onChange={(event) => {
                            setSendMessage(event.target.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                sendMessageHandler()
                                setSendMessage("")
                            }
                        }}
                    />
                    <button className='btn' onClick={sendMessageHandler} >
                        Send
                    </button>
                </div>
            </div>
        </>
    )
}

export default Chat;
