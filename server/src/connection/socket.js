import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app= express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        methods:["GET","POST"]
    }
});

const userSocketMap= {}; // {userId : socketId}

export const getReceiverSocketId= (receiverId)=>{
    return userSocketMap[receiverId]
}
io.on("connection",(socket)=>{
    const userId= socket.handshake.query.userId;
    console.log(`A ${userId} connected with socket id ${socket.id}`)

    if(userId!="undefine") userSocketMap[userId]=socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    // console.log(userSocketMap)

    socket.on("disconnect",()=>{
        console.log(`A ${userId} disconnecte with socket id ${socket.id}`)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

    socket.on("login", (id) => {
        console.log("User connected with socket", id);
        // Handle associating the socket with the user here if needed
      });
})



export {app, io, server}