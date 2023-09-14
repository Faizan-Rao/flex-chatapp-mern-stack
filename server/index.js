import express from 'express'
import {createServer} from "node:http"
import { Server } from 'socket.io'
import cors from 'cors'
import { error } from 'node:console'
const app = express()
const server = createServer(app)
const port = 3000
app.use(cors())



const io = new Server(server,{
cors:{
    origin: "http://localhost:5173",
    methods :['GET','POST']
}})



io.on('connection', (socket)=>{
    

    console.log("User connected", socket.id)
    socket.on("send_message",  (data)=>{
         socket.broadcast.emit("recieve_message", data)
    })

    socket.on('disconnect',()=>{
        console.log("User Disconnected", socket.id)
    } )
})

server.listen(port, ()=>{
    console.log(`listening to port ${port}`)
})

io.listen(3001)

