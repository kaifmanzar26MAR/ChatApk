import { createContext, useContext, useEffect, useState } from "react";
import useGetUser from "../hooks/getUserhook";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useGetUser();

  useEffect(() => {
    if (user) {
      const initializeSocket = () => {
        const newSocket = io("http://localhost:8000", {
          query: {
            userId: user._id,
          },
        });

        newSocket.on("getOnlineUsers", (users) => {
          if (users) {
            setOnlineUsers(users);
          }
        });

        setSocket(newSocket);
      };

      initializeSocket();

      return () => {
        if (socket) {
          socket.close();
        }
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
