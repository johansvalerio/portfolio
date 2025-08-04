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
  const { addMessage, readMessageResponse, patchMessageStatus } = useMessageStore();
  const { addResponse, deleteResponse } = useResponseStore();

  useEffect(() => {
    if (!socket || !isConnected || !session?.user?.id) return;

    // Identificación
    socket.emit('identify', {
      id: session.user.id,
      role: session.user.role
    });

    // Manejadores de eventos
    const handleNewMessage = (newMessage: MensajeWithUser) => {
      addMessage(newMessage);
    };

    const handleNewResponse = (newResponse: ResponseWithUser) => {
      addResponse(newResponse);
    };

    const handleReadMessageResponse = (msg: MensajeWithUser | ResponseWithUser[]) => {
      if (Array.isArray(msg)) {
        const responseIds = msg.map((res) => res.response_id);
        readMessageResponse(undefined, responseIds);
      } else {
        readMessageResponse(msg.mensaje_id);
      }
    };

    const handleDeleteResponse = (deletedResponse: ResponseWithUser) => {
      deleteResponse(deletedResponse.response_id);
    };

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
  }, [socket, isConnected, session, addMessage, addResponse, readMessageResponse, deleteResponse, patchMessageStatus]);
}