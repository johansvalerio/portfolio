"use client";
import { formatDate } from "@/app/helpers/formatDate";
import { Separator } from "@radix-ui/react-separator";
import { Reply } from "lucide-react";
import DeleteResponse from "./DeleteResponse";
import { Session } from "next-auth";
import useResponseStore from "@/lib/responseStore";
//import { useEffect } from "react";
import Loading from "./Loading";
import { useSocket } from "@/app/providers/SocketProvider";
import { ResponseWithUser } from "@/types/response";
import { useEffect } from "react";
import useMessageStore from "@/lib/messageStore";

export default function ResponseList({ session }: { session: Session | null }) {
  const responses = useResponseStore((state) => state.responses);
  const loading = useResponseStore((state) => state.loading);
  const addResponse = useResponseStore((state) => state.addResponse);
  const fetchResponses = useResponseStore((state) => state.fetchResponses);
  const deleteResponse = useResponseStore((state) => state.deleteResponse);
  const messageId = useMessageStore((state) => state.messageId);
  const { socket, isConnected } = useSocket();
  const isA = session?.user.role === 1;

  // Efecto para cargar mensajes al montar el componente
  //viene de zustand
  useEffect(() => {
    if (!messageId) return;
    fetchResponses(messageId);
  }, [fetchResponses, messageId]);

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

    // Escuchar nuevas respuestas
    const handleNewResponse = (newResponse: ResponseWithUser) => {
      console.log("📥 Evento recibido en cliente:", newResponse);
      // Actualizamos el estado de los mensajes en el store con el nuevo mensaje
      console.log("🔄 Actualizando mensajes en el store");
      addResponse(newResponse);
    };

    const handleDeleteResponse = (deletedResponse: ResponseWithUser) => {
      console.log("📥 Evento recibido en cliente:", deletedResponse);
      // Actualizamos el estado de los mensajes en el store con el nuevo mensaje
      console.log("🔄 Actualizando mensajes en el store");
      deleteResponse(deletedResponse.response_id);
    };

    socket.on("newResponse", handleNewResponse);
    socket.on("deleteResponse", handleDeleteResponse);

    return () => {
      socket.off("newResponse", handleNewResponse);
      socket.off("deleteResponse", handleDeleteResponse);
    };
  }, [socket, isConnected, addResponse, session, deleteResponse]);

  if (!responses || responses.length <= 0) {
    return (
      <p className="text-muted-foreground flex justify-center items-center">
        No hay respuestas aún.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <h4 className="font-bold mb-2">Respuestas</h4>
      <div
        className={`mt-4 
                 ${
                   responses.length <= 1 || !isA
                     ? "h-auto overflow-y-auto"
                     : "md:h-[30vh] h-[26vh]  overflow-y-auto"
                 }  `}
      >
        {responses.map((res, idx, arr) => (
          <div key={res.response_id}>
            <div className="p-3 bg-primary/10 rounded mb-2 w-full">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1">{res.response_description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Reply className="h-3 w-3" />
                    {formatDate(res.response_created_on.toString())}
                  </div>
                </div>
                <div>
                  <DeleteResponse
                    responseId={res.response_id}
                    session={session}
                  />
                </div>
              </div>
            </div>

            {idx < arr.length - 1 && (
              <Separator className="h-0.5 bg-gray-400" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
