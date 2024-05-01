import React, { useEffect, useState, useRef } from "react";
import useGetUser from "../hooks/getUserhook";
import axios from "axios";
import { useSocketContext } from "../context/SocketContext";
import useListionMessage from "../hooks/useListionMessage";
import { Link, useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { RiRadioButtonLine } from "react-icons/ri";

const Home = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [chat, setChat] = useState(null);
  const [chattingWith, setChattingWith] = useState(null);
  const [message, setMessage] = useState("");
  const { loading, user } = useGetUser();
  const { onlineUsers, socket } = useSocketContext();
  const [toggleChat, setToggleChat] = useState("full");
  const [toggleUserList, setToggleUserList] = useState("0");
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const { messages, setMessages } = useListionMessage();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://chatapk.onrender.com/api/user/getalluserexceptthelogedinone",
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
        "https://chatapk.onrender.com/api/chat/getallconversationmessage",
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
        "https://chatapk.onrender.com/api/chat/sendmessage",
        {
          text: message,
          receiver: chattingWith._id,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setMessage("");
        fetchChat(chattingWith._id);
      } else {
        throw new Error("Message not sent!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToBottom = () => {
    console.log("scrolling")
    chatContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  // const scrollToBottom = () => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  //   }
  // };
  

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "https://chatapk.onrender.com/api/user/logout",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        alert("user logout");
        navigate("/login");
        window.location.reload();
      } else {
        throw new Error("Erron in logout");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("socket connnected");
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [chat, chattingWith, messages, setMessages]);

  return (
    <div className="w-full min-h-screen  flex items-center justify-center ">
      {/* tab and laptop view*/}
      <div className="w-full h-screen md:w-[90%] md:h-[90vh] lg:w-[80%] lg:h-[90vh] overflow-hidden  bg-opacity-25 backdrop-blur-sm shadow-sm shadow-white lg:flex md:flex border-2 rounded-lg  hidden">
        {/* large layout */}
        {/*User list section  */}
        <div className="min-h-full lg:w-1/3 md:w-1/3 w-full text-gray-300  gap-x-2 flex flex-col items-center justify-start bg-gray-800 bg-opacity-[20%]  lg:border-r-2 md:border-r-2 ">
          <h1 className="font-semibold text-3xl w-full border-b-2 border-gray-300 p-4 felx flex-row items-center justify-cnter relative bg-white bg-opacity-10 text-white ">
            <p className=" w-fit ">Chat APK</p>
            <button
              className="btn bg-red-600 absolute top-1 right-1 h-14 text-white "
              onClick={handleLogout}
            >
              <AiOutlineLogout size={25} />
            </button>
            {/* <hr /> */}
          </h1>

          {allUsers?.map((e, i) => (
            <div
              className={`w-full p-2 relative overflow-hidden hover:bg-white backdrop-blur-2xl hover:bg-opacity-15 hover:text-white cursor-pointer ${
                i === allUsers?.length - 1 ? "" : "border-b-2"
              } border-gray-300`}
              key={e._id}
              onClick={() => {
                setChattingWith(e);
                fetchChat(e._id);
              }}
            >
              <p className={`p-2 uppercase font-semibold `}>{e.username}</p>
              <p className="absolute top-1 right-1 text-green-400">
                {onlineUsers && onlineUsers?.includes(e._id) ? (
                  <RiRadioButtonLine />
                ) : (
                  ""
                )}
              </p>
              {/* {i !== allUsers.length - 1 && <hr className="" />} */}
            </div>
          ))}
        </div>

        {/* chat section */}
        <div className="w-full min-h-full lg:flex md:flex items-center flex-col justify-center hidden">
          {chattingWith == null ? (
            ""
          ) : (
            <h1 className="w-full p-4 text-xl font-semibold  uppercase sticky top-0 bg-white bg-opacity-20">
              {chattingWith?.username}
            </h1>
          )}

          {chat === null ? (
            <div className="w-full min-h-full flex items-center justify-center">
              <div className="bg-white p-5 rounded-lg">
                welcome !{" "}
                {user ? user?.username : <Link to={"/login"}>Login</Link>}
              </div>
            </div>
          ) : (
            <div className="w-full gap-y-2 flex flex-col p-2 h-[80vh]  overflow-auto">
              {messages && messages.length > 0 ? (
                messages.map((e) => (
                  <div key={e._id}>
                    {e.sender === user?._id ? (
                      <div className="flex items-center justify-end ">
                        <p className="bg-gray-700 bg-opacity-70   p-2 text-white rounded-lg self-end w-fit">
                          {e.text}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-start">
                        <p className="bg-white bg-opacity-70 rounded-lg w-fit p-2">
                          {e.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full flex items-center justify-center p-2">
                  <p className="p-1 bg-gray-300 rounded-sm">
                    Start a Conversation
                  </p>
                </div>
              )}
              <div className="m-auto"></div>

              <div ref={chatContainerRef} />
              {/* <div ref={chatContainerRef} className="messages-container" /> */}

            </div>
          )}

          {chat === null ? (
            ""
          ) : (
            <form className="w-full sticky bottom-0 h-12 text-gray-800 rounded-full overflow-hidden bg-white bg-opacity-25 backdrop-blur-lg flex items-center justify-between">
              <input
                name="messageinput"
                className="bg-transparent p-2 pl-4 border-none outline-none  w-[90%] h-10 bg-opacity-0 font-semibold text-gray-900"
                placeholder="Type Your Message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <button
                type="submit"
                className="btn bg-gray-900 w-[9%] bg-opacity-60 outline-none rounded-full hover:bg-opacity-20 hover:text-black text-white"
                onClick={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <IoIosSend size={20} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* mobile view */}
      <div className="w-full h-screen md:w-[90%] md:h-[90%] lg:w-[80%] lg:h-[90vh] overflow-hidden  bg-opacity-25 backdrop-blur-sm shadow-sm shadow-white flex lg:hidden md:hidden border-2 rounded-lg relative  ">
        {/*User list section  */}
        {/* User list  */}
        <div
          className={`min-h-full lg:w-1/3 md:w-1/3 w-full text-gray-300  gap-x-2 flex flex-col items-center justify-start bg-gray-800 bg-opacity-[20%]  lg:border-r-2 md:border-r-2 absolute left-0 transition-all `}
        >
          <h1 className="font-semibold text-3xl w-full border-b-2 border-gray-300 p-4 felx flex-row items-center justify-cnter relative bg-white bg-opacity-10 text-white ">
            <p className=" w-fit ">Chat APK</p>
            {user ? <button
              className="btn z-20 bg-red-600 absolute top-1 right-1 h-14 text-white "
              onClick={handleLogout}
            >
              <AiOutlineLogout size={25} />
            </button> : <Link to={"/login"}><p className="btn bg-red-600 absolute top-1 right-1 h-14 text-white z-20">Login</p></Link>}
            {/* <hr /> */}
          </h1>

          {allUsers?.map((e, i) => (
            <div
              className={`w-full z-40 p-2 relative overflow-hidden hover:bg-white backdrop-blur-2xl hover:bg-opacity-15 hover:text-white cursor-pointer ${
                i === allUsers?.length - 1 ? "" : "border-b-2"
              } border-gray-300`}
              key={e._id}
              onClick={() => {
                setChattingWith(e);
                fetchChat(e._id);
                if (toggleChat === "0") {
                  setToggleChat("full");
                  setToggleUserList("0");
                } else {
                  setToggleChat(0);
                  setToggleUserList("full");
                }
              }}
            >
              <p className={`p-2 uppercase font-semibold `}>{e.username}</p>
              <p className="absolute top-1 right-1 text-green-400">
                {onlineUsers && onlineUsers?.includes(e._id) ? (
                  <RiRadioButtonLine />
                ) : (
                  ""
                )}
              </p>
              {/* {i !== allUsers.length - 1 && <hr className="" />} */}
            </div>
          ))}
        </div>

        {/* chat box */}
        <div
          className={`w-full min-h-full md:hidden lg:hidden items-center flex-col justify-center flex absolute right-${toggleChat} transition-all `}
        >
          {chattingWith == null ? (
            ""
          ) : (
            <h1 className="w-full flex items-center justify-start gap-2 p-4 text-xl font-semibold  uppercase sticky top-0 bg-white bg-opacity-20">
              <p
                className="cursor-pointer text-green-500"
                onClick={() => {
                  if (toggleChat === "0") {
                    setToggleChat("full");
                    setToggleUserList("0");
                  } else {
                    setToggleChat("0");
                    setToggleUserList("full");
                  }
                }}
              >
                <IoArrowBackCircleOutline size={30} />
              </p>{" "}
              {chattingWith?.username}
            </h1>
          )}

          {chat === null ? (
            ""
          ) : (
            <div className="w-full gap-y-2 flex flex-col p-2 h-[80vh]  overflow-auto">
              {messages && messages.length > 0 ? (
                messages.map((e) => (
                  <div key={e._id}>
                    {e.sender === user?._id ? (
                      <div className="flex items-center justify-end ">
                        <p className="bg-gray-700 bg-opacity-70   p-2 text-white rounded-lg self-end w-fit">
                          {e.text}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-start">
                        <p className="bg-white bg-opacity-70 rounded-lg w-fit p-2">
                          {e.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full flex items-center justify-center p-2">
                  <p className="p-1 bg-gray-300 rounded-sm">
                    Start a Conversation
                  </p>
                </div>
              )}
              <div className="m-auto"></div>

              <div ref={chatContainerRef} />
            </div>
          )}

          {chat === null ? (
            ""
          ) : (
            <form className="w-full sticky bottom-0 h-12 text-gray-800 rounded-full overflow-hidden bg-white bg-opacity-25 backdrop-blur-lg flex items-center justify-between">
              <input
                name="messageinput"
                className="bg-transparent p-2 pl-4 border-none outline-none  w-[90%] h-10 bg-opacity-0 font-semibold text-gray-900"
                placeholder="Type Your Message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <button
                type="submit"
                className="btn bg-gray-900 w-[50px] bg-opacity-60 outline-none rounded-full hover:bg-opacity-20 hover:text-black text-white"
                onClick={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <IoIosSend size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
