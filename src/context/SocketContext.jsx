import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

 useEffect(() => {
  const socketInstance = io(
    import.meta.env.VITE_SOCKET_URL || "http://68.178.171.95:3000",
    {
      transports: ["websocket", "polling"], // ✅ FIX: fallback add
      autoConnect: true,
      reconnection: true, // ✅ FIX: auto reconnect
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 20000, // ✅ FIX: timeout
    }
  );

  socketInstance.on("connect", () => {
    setConnected(true);
    console.log("✅ Socket connected:", socketInstance.id);
  });

  socketInstance.on("connect_error", (err) => {
    console.log("❌ Socket error:", err.message); // ✅ FIX: error debug
  });

  socketInstance.on("disconnect", (reason) => {
    setConnected(false);
    console.log("⚠️ Socket disconnected:", reason);
  });

  setSocket(socketInstance);

  return () => {
    socketInstance.disconnect();
    console.log("🔌 Socket disconnected cleanup");
  };
}, []);

  const joinLiveMatchRooms = (matchIds) => {
    if (socket && matchIds) {
      matchIds.forEach(matchId => {
        socket.emit('joinMatchRoom', `match:${matchId}`);
      });
    }
  };

  const leaveLiveMatchRooms = (matchIds) => {
    if (socket && matchIds) {
      matchIds.forEach(matchId => {
        socket.emit('leaveMatchRoom', `match:${matchId}`);
      });
    }
  };

  const value = {
    socket,
    connected,
    joinLiveMatchRooms,
    leaveLiveMatchRooms,
  }


  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
