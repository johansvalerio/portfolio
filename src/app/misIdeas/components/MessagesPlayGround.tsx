"use client";
import { type Session } from "next-auth";
import FilterMessages from "./FilterMessages";
import StatusWay from "./StatusWay";
import ResponseCard from "./ResponseCard";
import Link from "next/link";
import { LightbulbIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Loading from "./Loading";
import useMessageStore from "@/lib/messageStore";
import { useSocket } from "@/app/providers/SocketProvider";
import type { MensajeWithUser } from "@/types/mensaje";

export default function MessagesPlayGround({
  session,
}: {
  session: Session | null;
}) {
  const [messageId, setMessageId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "unread" | "unanswered" | "responded" | null
  >(null);
  const messages = useMessageStore((state) => state.messages);
  const loading = useMessageStore((state) => state.loading);
  const fetchMessages = useMessageStore((state) => state.fetchMessages);
  const addMessage = useMessageStore((state) => state.addMessage);
  const { socket, isConnected } = useSocket();

  // Efecto para cargar mensajes al montar el componente
  //viene de zustand
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Escuchar nuevos mensajes en tiempo real
  //viene de socket.io
  // Este efecto se ejecuta cada vez que el socket está listo y conectado
  useEffect(() => {
    console.log("🟡 Esperando socket...");

    if (!socket || !isConnected || !session) {
      console.log("🚫 No hay socket aún o no está conectado");
      return;
    }

    console.log("✅ Socket listo para escuchar eventos");

    //Identificarse en el cliente
    socket.emit("identify", {
      id: session.user.id,
      role: session.user.role,
    });

    // Escuchar nuevos mensajes
    const handleNewMessage = (newMessage: MensajeWithUser) => {
      console.log("📥 Evento recibido en cliente:", newMessage);
      // Actualizamos el estado de los mensajes en el store con el nuevo mensaje
      console.log("🔄 Actualizando mensajes en el store");
      addMessage(newMessage);
      // Opcional pero recomendado: Resetea el filtro para que el nuevo mensaje sea visible.
      setActiveFilter(null);
      setSearchTerm("");
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, isConnected, addMessage, session]);

  //mensajes por usuario
  const userMessages = useMemo(() => {
    if (!session) return [];
    if (session.user.role === 1) return messages;
    return messages.filter(
      (msg) => msg.user?.user_id === Number(session?.user.id)
    );
  }, [messages, session]);

  // Lógica de filtrado que antes estaba en FilterMessages
  const filteredMessages = useMemo(() => {
    let result = userMessages;

    if (activeFilter === "unread") {
      result = result.filter((msg) => !msg.mensaje_isRead);
    }

    if (activeFilter === "unanswered") {
      result = result.filter(
        (msg) =>
          Array.isArray(msg.response) &&
          msg.response.some((res) => !res.response_isRead)
      );
    }

    if (activeFilter === "responded") {
      result = result.filter(
        (msg) => Array.isArray(msg.response) && msg.response.length > 0
      );
    }

    return result.filter(
      (msg) =>
        msg.mensaje_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.mensaje_description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (msg.user?.user_name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        )
    );
  }, [userMessages, searchTerm, activeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="col-span-1 mb-8">
            <h1 className="text-3xl font-bold mb-6 gap-2 flex items-center">
              <LightbulbIcon className="w-6 h-6" />
              Mis ideas
            </h1>
            <p className="text-muted-foreground">
              Envía tus ideas haciendo{" "}
              <Link
                className="font-semibold text-foreground/70 hover:text-foreground transition-all underline underline-offset-4
                            transform hover:scale-105
                            hover:translate-y-1.5 hover:text-"
                href="/#contact"
              >
                click aquí
              </Link>
            </p>
          </div>
          {/* Cómo funciona el estado de la idea */}
          <div className="lg:col-span-1 mb-8">
            <StatusWay />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de mensajes */}
          <div className="lg:col-span-1">
            <FilterMessages
              allMessages={userMessages} // Pasamos la lista completa para los contadores
              filteredMessages={filteredMessages} // Pasamos la lista ya filtrada para renderizar
              messageId={messageId}
              setMessageId={setMessageId}
              session={session}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
          {/* Vista del mensaje seleccionado y respuestas */}
          <div className="lg:col-span-2">
            {messageId ? (
              <ResponseCard
                messageId={messageId} //1 solo objeto con id del mensaje
                setMessageId={setMessageId} //para abrir o cerrar la vista de respuestas
                session={session} //sesión del usuario
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Selecciona un mensaje para ver el detalle.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
