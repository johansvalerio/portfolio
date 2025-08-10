// hooks/useSocketHandler.ts
import { useEffect } from 'react';
import { useSocket } from '@/app/providers/SocketProvider';
import useMessageStore from '@/lib/messageStore';
import useResponseStore from '@/lib/responseStore';
import { MensajeWithUser } from '@/types/mensaje';
import { ResponseWithUser } from '@/types/response';
import { Session } from 'next-auth';

export function useSocketHandler(session: Session|null) {
  const { socket, isConnected } = useSocket();
  const { addMessage, readMessageResponse, patchMessageStatus, addResponseToMessage, deleteResponseFromMessage } = useMessageStore();
  const { addResponse, deleteResponse } = useResponseStore();

  const messageId = useMessageStore((state) => state.messageId);

  useEffect(() => {
    if (!socket || !isConnected || !session?.user?.id) return;

    // Identificación
    socket.emit('identify', {
      id: session.user.id,
      role: session.user.role
    });

    // Manejadores de eventos Mensaje
    const handleNewMessage = (newMessage: MensajeWithUser) => {
      addMessage(newMessage);
    };

    // Manejadores de eventos Respuesta
    const handleNewResponse = (newResponse: ResponseWithUser) => {
      if (newResponse.mensajeId === messageId) {
        // Mensaje abierto: actualiza panel de respuestas + mensaje
        addResponse(newResponse); // esta ya llama addResponseToMessage internamente
      } else {
        // Mensaje no abierto: actualiza SOLO el mensaje (badges/contador)
        // Importa y usa del messageStore su acción directa:
        // useMessageStore.getState().addResponseToMessage(newResponse)
        addResponseToMessage(newResponse); // <-- usa la acción del messageStore
      }
    };

    // Manejadores de eventos Mensaje y Respuesta
    const handleReadMessageResponse = (msg: MensajeWithUser | ResponseWithUser[]) => {
      if (Array.isArray(msg)) {
        const responseIds = msg.map((res) => res.response_id);
        readMessageResponse(undefined, responseIds);
      } else {
        readMessageResponse(msg.mensaje_id);
      }
    };

    // Manejadores de eventos Respuesta
    const handleDeleteResponse = (deletedResponse: ResponseWithUser) => {
      if (deletedResponse.mensajeId === messageId) {
        deleteResponse(deletedResponse.response_id); // ya sincroniza messageStore
      } else {
        // Quita del mensaje en la lista sin tocar responseStore
        deleteResponseFromMessage(deletedResponse.response_id); // acción del messageStore
      }
    };

    // Manejadores de eventos Mensaje
    const handlePatchStatus = (patchStatus: MensajeWithUser) => {
      patchMessageStatus(patchStatus.mensaje_id, patchStatus.mensaje_status);
    };

    // Suscripciones
    socket.on('newMessage', handleNewMessage);
    socket.on('newResponse', handleNewResponse);
    socket.on('readMessageResponse', handleReadMessageResponse);
    socket.on('deleteResponse', handleDeleteResponse);
    socket.on('patchStatus', handlePatchStatus);

    // Limpieza
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newResponse', handleNewResponse);
      socket.off('readMessageResponse', handleReadMessageResponse);
      socket.off('deleteResponse', handleDeleteResponse);
      socket.off('patchStatus', handlePatchStatus);
    };
  }, [socket, isConnected, session, addMessage, addResponse, readMessageResponse, deleteResponse, patchMessageStatus, addResponseToMessage, deleteResponseFromMessage, messageId]);
}