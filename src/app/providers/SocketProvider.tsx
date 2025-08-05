"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  io,
  type Socket,
  type ManagerOptions,
  type SocketOptions,
} from "socket.io-client";

// Usar la URL del navegador en el cliente, o la variable de entorno en build time
const SOCKET_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [shouldConnect, setShouldConnect] = useState(true);

  const connect = () => {
    setShouldConnect(true);
  };

  const disconnect = () => {
    setShouldConnect(false);
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (!shouldConnect) return;

    // Inicializar la conexión del socket
    const socketInstance = io(SOCKET_URL, {
      path: "/api/socket/io",
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket"],
    } as Partial<ManagerOptions & SocketOptions>);

    // Eventos del socket
    const onConnect = () => {
      console.log("✅ Conectado al servidor de sockets", socketInstance.id);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("❌ Desconectado del servidor de sockets");
      setIsConnected(false);
    };

    const onError = (error: Error) => {
      console.error("❌ Error en la conexión del socket:", error);
    };

    // Configurar event listeners
    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);
    socketInstance.on("connect_error", onError);

    // Guardar la instancia del socket
    setSocket(socketInstance);

    // Limpieza al desmontar
    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
      socketInstance.off("connect_error", onError);
      socketInstance.disconnect();
    };
  }, [shouldConnect]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, connect, disconnect }}
    >
      {children}
    </SocketContext.Provider>
  );
}
