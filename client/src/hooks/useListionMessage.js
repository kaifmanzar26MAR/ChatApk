import React, { useEffect, useState } from 'react'
import { useSocketContext } from '../context/SocketContext'

const useListionMessage = () => {
  const {socket} = useSocketContext();

  const [messages,setMessages] =useState()

  useEffect(()=>{
    socket?.on("newMessage",(newMessage)=>{
        setMessages([...messages,newMessage]);
    })
    return ()=> socket?.off("newMessage");
  },[socket, setMessages, messages]);

  return {messages, setMessages}
}

export default useListionMessage
