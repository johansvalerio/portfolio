"use client";
import MessageList from "./MessageList";
import {
  LightbulbIcon,
  ReplyIcon,
  ListTodoIcon,
  CheckCircleIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "next-auth";
import { Badge } from "@/components/ui/badge";
import useMessageStore from "@/lib/messageStore";
import Loading from "./Loading";
import { MensajeWithUser } from "@/types/mensaje";
import { useSocket } from "@/app/providers/SocketProvider";
import useResponseStore from "@/lib/responseStore";
import { ResponseWithUser } from "@/types/response";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface FilterMessagesProps {
  session: Session | null;
}

export default function FilterMessages({ session }: FilterMessagesProps) {
  const messages = useMessageStore((state) => state.messages);
  const loading = useMessageStore((state) => state.loading);
  const fetchMessages = useMessageStore((state) => state.fetchMessages);
  const { addMessage, readMessageResponse } = useMessageStore();
  const { addResponse, deleteResponse } = useResponseStore();
  const cantResponseMessages = useMessageStore((state) =>
    state.cantResponseMessages()
  );
  const cantResponseNotSeen = useMessageStore((state) =>
    state.cantResponseNotSeen()
  );
  const cantMessageNotSeen = useMessageStore((state) =>
    state.cantMessageNotSeen()
  );

  // Estados locales
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "unread" | "unanswered" | "responded" | null
  >(null);

  // Fetch inicial
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const { socket, isConnected } = useSocket();
  //Memoizar la función de identificación
  const identifyData = useMemo(
    () => ({
      id: session?.user.id,
      role: session?.user.role,
    }),
    [session?.user.id, session?.user.role]
  );

  // Efecto para manejar la conexión del socket
  useEffect(() => {
    if (!socket || !isConnected || !identifyData.id) return;

    console.log("🟡 Conectando socket...");

    // Identificarse en el servidor
    socket.emit("identify", identifyData);

    // Manejador de nuevos mensajes
    const handleNewMessage = (newMessage: MensajeWithUser) => {
      console.log("📥 Nuevo mensaje recibido:", newMessage);
      addMessage(newMessage);
    };

    // Manejador de nuevos mensajes respondidos
    const handleNewResponse = (newResponse: ResponseWithUser) => {
      console.log("📥 Nueva respuesta recibida:", newResponse);
      addResponse(newResponse);
    };

    // Manejador de lectura de mensajes
    const handleReadMessageResponse = (
      msg: MensajeWithUser | ResponseWithUser[]
    ) => {
      console.log("📥 Servidor recibió 'readMessageResponse':", msg);
      if (Array.isArray(msg)) {
        const responseIds = msg.map((res) => res.response_id);
        readMessageResponse(undefined, responseIds);
      } else {
        readMessageResponse(msg.mensaje_id);
      }
    };

    // Manejador de eliminación de respuestas
    const handleDeleteResponse = (deletedResponse: ResponseWithUser) => {
      console.log("🗑️ Respuesta eliminada:", deletedResponse);
      // Actualiza el store local usando el ID de la respuesta
      deleteResponse(deletedResponse.response_id);
    };

    // Suscribirse al evento
    socket.on("newMessage", handleNewMessage);
    socket.on("newResponse", handleNewResponse);
    socket.on("readMessageResponse", handleReadMessageResponse);
    socket.on("deleteResponse", handleDeleteResponse);

    // Limpieza al desmontar
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newResponse", handleNewResponse);
      socket.off("readMessageResponse", handleReadMessageResponse);
      socket.off("deleteResponse", handleDeleteResponse);
    };
  }, [
    socket,
    isConnected,
    identifyData,
    addMessage,
    addResponse,
    deleteResponse,
    readMessageResponse,
  ]);

  // Lógica de filtrado
  const filteredMessages = useMemo(() => {
    let result = [...messages];

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
        ) ||
        (msg.user?.user_email?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        )
    );
  }, [messages, activeFilter, searchTerm]);
  // //El total de todas las respuestas de todos los mensajes
  // const allResponseMessages = useMemo(() =>
  //     allMessages.reduce(
  //         (acc, message) =>
  //             acc + (Array.isArray(message.response) ? message.response.length : 0),
  //         0
  //     ),
  //     [userMessages]
  // );
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <Card
      className={`flex flex-col shadow-md
            ${filteredMessages.length === 0 ? "h-[70vh] " : "h-[110vh]"}
        `}
    >
      {/* El buscador de ideas */}
      <CardHeader className="pb-4">
        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Nuevas ideas */}
          <div
            className={`cursor-pointer flex items-center justify-between bg-blue-100 dark:bg-indigo-900/30 p-3 rounded-xl
                    ${activeFilter === "unread" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() =>
              setActiveFilter((prev) => (prev === "unread" ? null : "unread"))
            }
            title="Ideas nuevas sin leer"
          >
            <div className="flex items-center gap-3">
              <LightbulbIcon className="h-6 w-6 text-blue-500 dark:text-blue-300" />
              <div className="text-sm font-medium">
                {cantMessageNotSeen === 0
                  ? "No hay nuevas ideas"
                  : "Ideas nuevas"}
              </div>
            </div>
            {cantMessageNotSeen > 0 && (
              <Badge
                className="bg-blue-500 text-white px-2 py-1 text-xs rounded-full animate-pulse"
                title={`${cantMessageNotSeen} ideas nuevas`}
              >
                {cantMessageNotSeen}
              </Badge>
            )}
          </div>
          {/* Respuestas nuevas */}
          <div
            className={`cursor-pointer flex items-center justify-between bg-green-100 dark:bg-green-900/30 p-3 rounded-xl
                    ${activeFilter === "unanswered" ? "ring-2 ring-green-500" : ""}`}
            onClick={() =>
              setActiveFilter((prev) =>
                prev === "unanswered" ? null : "unanswered"
              )
            }
            title="Respuestas nuevas sin leer"
          >
            <div className="flex items-center gap-3">
              <ReplyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div className="text-sm font-medium">
                {cantResponseNotSeen === 0
                  ? "No hay nuevas respuestas"
                  : "Respuestas nuevas"}
              </div>
            </div>
            {cantResponseNotSeen > 0 && (
              <Badge
                className="bg-green-600 text-white px-2 py-1 text-xs rounded-full animate-pulse"
                title={`${cantResponseNotSeen} respuestas nuevas`}
              >
                {cantResponseNotSeen}
              </Badge>
            )}
          </div>
          {/* Total respondidas */}
          <div
            className={`flex items-center justify-between bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl cursor-pointer hover:scale-[1.01] transition
                ${activeFilter === "responded" ? "ring-2 ring-purple-500" : ""}
  `}
            onClick={() =>
              setActiveFilter((prev) =>
                prev === "responded" ? null : "responded"
              )
            }
            title="Ideas que ya fueron respondidas"
          >
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <div className="text-sm font-medium">Ideas respondidas</div>
            </div>
            <Badge
              className="bg-purple-600 text-white px-2 py-1 text-xs rounded-full"
              title={`${cantResponseMessages} ideas respondidas`}
            >
              {cantResponseMessages}
            </Badge>
          </div>
          {/* Total ideas */}
          <div
            className="cursor-pointer flex items-center justify-between bg-slate-100 dark:bg-slate-800/40 p-3 rounded-xl"
            onClick={() => setActiveFilter(null)}
            title="Cantidad total de ideas registradas"
          >
            <div className="flex items-center gap-3">
              <ListTodoIcon className="h-6 w-6 text-slate-500 dark:text-slate-300" />
              <div className="text-sm font-medium">Total de ideas</div>
            </div>
            <Badge
              className="bg-slate-500 text-white px-2 py-1 text-xs rounded-full"
              title={`${messages.length} ideas totales`}
            >
              {messages.length}
            </Badge>
          </div>
        </div>
        {/* Filtrar ideas */}
        <div className="flex justify-between items-center">
          {activeFilter && (
            <p className="text-sm mt-2 text-muted-foreground">
              Filtrando por:{" "}
              {activeFilter === "unread"
                ? "Ideas nuevas"
                : activeFilter === "unanswered"
                  ? "Respuestas nuevas"
                  : "Ideas respondidas"}
            </p>
          )}
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="text-xs cursor-pointer mr-2 text-blue-500 underline mt-2 hover:text-blue-700"
            >
              Quitar filtro
            </button>
          )}
        </div>

        <div className="p-[2px] rounded-lg bg-gradient-to-r from-foreground/60 via-foreground/70 to-blue-400/60 mt-4">
          <div className="relative bg-white dark:bg-black rounded-lg">
            <Input
              className="border-2 px-8 h-10"
              placeholder="Buscar en mis ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute top-2 left-2">
              <SearchIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </CardHeader>
      {/* Mostramos los mensajes */}
      <CardContent
        className={`flex-1 p-0 overflow-y-auto
                `}
      >
        <MessageList filteredMessages={filteredMessages} session={session} />
      </CardContent>
      {/* Mostramos los mensajes */}
    </Card>
  );
}
