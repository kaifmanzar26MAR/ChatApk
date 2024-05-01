import React, { useEffect, useState, useRef } from "react";
import useGetUser from "../hooks/getUserhook";
import axios from "axios";
import { useSocketContext } from "../context/SocketContext";
import useListionMessage from "../hooks/useListionMessage";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [chat, setChat] = useState(null);
  const [chattingWith, setChattingWith] = useState(null);
  const [message, setMessage] = useState(null);
  const { loading, user } = useGetUser();
  const { onlineUsers, socket } = useSocketContext();
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const {messages, setMessages} = useListionMessage();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/getalluserexceptthelogedinone",
        {
          withCredentials: true,
        }
      );
      setAllUsers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChat = async (member) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/chat/getallconversationmessage",
        {
          member,
        },
        {
          withCredentials: true,
        }
      );
      setChat(response.data.data);
      setMessages(response.data.data);
      scrollToBottom();
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/chat/sendmessage",
        {
          text: message,
          receiver: chattingWith._id,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setMessage('');
        fetchChat(chattingWith._id);
        
      } else {
        throw new Error("Message not sent!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleLogout = async()=>{
    try {

        const response= await axios.get('http://localhost:8000/api/user/logout',{
          withCredentials:true
        });
        if(response.status===200){
          
          alert("user logout");
          navigate('/login');
          window.location.reload();
        }else{
          throw new Error("Erron in logout")
        }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    
    
    fetchUsers();

  }, []);

  useEffect(()=>{
    if(socket){
      console.log("socket connnected")
    }
  },[socket])

  useEffect(() => {
    scrollToBottom();
  }, [chat, chattingWith, messages, setMessages]);
  
  

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
    
      <div className="w-[80%] min-h-[80vh] overflow-hidden bg-white bg-opacity-25 backdrop-blur-2xl shadow-sm shadow-white flex border-2 rounded-lg ">
        <div className="min-h-full w-1/3 bg-white gap-y-2 gap-x-2 flex flex-col ">
          <h1 className="font-semibold text-3xl w-full p-2 felx items-center justify-between">Chat APK <button className="btn btn-warning " onClick={handleLogout}>LogOut</button></h1>
          {allUsers?.map((e, i) => (
            <div
              className="w-full p-2 hover:bg-blue-700 hover:text-white cursor-pointer"
              key={e._id}
              onClick={() => {
                setChattingWith(e);
                fetchChat(e._id);
              }}
            >
              <p className="p-2 uppercase font-semibold">{e.username}</p>
              <p>{onlineUsers && onlineUsers?.includes(e._id) ? "Online" : ""}</p>
              {i !== allUsers.length - 1 && <hr className="" />}
            </div>
          ))}
        </div>

        {chat === null ? (
          <div className="w-full min-h-full flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg">welcome ! {user ? user?.username : <Link to={'/login'}>Login</Link>}</div>
          </div>
        ) : (
          <div className="w-full gap-y-2 flex flex-col p-2 h-[80vh] overflow-auto">
            <h1 className="w-full p-2 font-semibold uppercase sticky top-0 bg-white">
              {chattingWith?.username}
            </h1>
            {messages && messages.length > 0 ? (
              messages.map((e) => (
                <div key={e._id}>
                  {e.sender === user?._id ? (
                    <div className="flex items-center justify-end">
                      <p className="bg-blue-700 p-2 text-white rounded-sm self-end w-fit">
                        {e.text}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-start">
                      <p className="bg-white rounded-sm w-fit p-2">{e.text}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full flex items-center justify-center p-2">
                <p className="p-1 bg-gray-300 rounded-sm">Start a Conversation</p>
              </div>
            )}
            <div className="m-auto"></div>
            <form className="w-full sticky bottom-0">
              <input
                type="text"
                className="grow p-2 rounded-sm w-[90%] "
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <button
                type="submit"
                className="btn btn-primary w-[10%]"
                onClick={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                send
              </button>
            </form>
            <div ref={chatContainerRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
