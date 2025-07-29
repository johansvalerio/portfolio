"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  io,
  type Socket,
  type ManagerOptions,
  type SocketOptions,
} from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 👇 Aquí forzamos inicializar el socket server
    fetch(`${SOCKET_URL}/api/socket/io`);

    const socketInstance = io(SOCKET_URL, {
      path: "/api/socket/io",
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    } as Partial<ManagerOptions & SocketOptions>);

    socketInstance.on("connect", () => {
      console.log("✅ Conectado al servidor de sockets", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Desconectado del servidor de sockets");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("🚨 Error de conexión:", err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
