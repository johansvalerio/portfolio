import { create } from 'zustand';
import type { MensajeWithUser } from '@/types/mensaje';
import { getMessages } from '@/app/actions/contact/message-actions';
import type { ResponseWithUser } from '@/types/response';
interface MessageState {
  messages: MensajeWithUser[];
  messageId: number | null;
  loading: boolean;
  addMessage: (message: MensajeWithUser) => void;
  fetchMessages: () => Promise<void>;
  setMessageId: (messageId: number | null) => void;
  patchMessageStatus: (messageId: number, status: string) => void;
  cantResponseMessages: () => number;
  cantResponseNotSeen: () => number;
  cantMessageNotSeen: () => number;
  addResponseToMessage: (response: ResponseWithUser) => void;
  deleteResponseFromMessage: (responseId: number) => void;
  readMessageResponse: (mensajeId?: number, responseIds?: number[]) => void;
}

const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  loading: false,
  messageId: null,
  addMessage: (message) => set((state) => {
    const exists = state.messages.some(msg => msg.mensaje_id === message.mensaje_id);
    if (exists) {
      // Actualiza el mensaje existente
      return {
        messages: state.messages.map(msg =>
          msg.mensaje_id === message.mensaje_id
            ? message
            : msg
        ),
      };
    }
    // Agrega el nuevo mensaje
    return { messages: [message, ...state.messages] };
  }),
  fetchMessages: async () => {
    const currentState = get(); // Accede al estado actual
    if (currentState.loading) return; // Evita múltiples llamadas

    set({ loading: true });
    const messages = await getMessages();
    set({ messages, loading: false });
  },
  setMessageId: (messageId) => set({
    messageId,
  }),
  patchMessageStatus: (messageId, status) => set((state) => ({
    messages: state.messages.map((message) =>
      message.mensaje_id === messageId
        ? { ...message, mensaje_status: status }
        : message
    ),
  })),
  readMessageResponse: (mensajeId?: number, responseIds?: number[]) => {
    set((state) => {
      // Actualizar mensaje si es admin
      if (mensajeId) {
        return {
          messages: state.messages.map(msg =>
            msg.mensaje_id === mensajeId
              ? { ...msg, mensaje_isRead: true }
              : msg
          ),
        };
      }

      // Actualizar respuestas si es usuario regular
      if (responseIds) {
        return {
          messages: state.messages.map(msg =>
            msg.response
              ? {
                ...msg,
                response: msg.response.map(res =>
                  responseIds.includes(res.response_id)
                    ? { ...res, response_isRead: true }
                    : res
                ),
              }
              : msg
          ),
        };
      }

      return { messages: state.messages };
    });
  },
  addResponseToMessage: (response: ResponseWithUser) => {
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.mensaje_id !== response.mensajeId) return msg;
        // Evita duplicados de respuesta
        const exists = (msg.response || []).some(r => r.response_id === response.response_id);
        if (exists) {
          // Actualiza la respuesta existente
          return {
            ...msg,
            response: (msg.response || []).map(r =>
              r.response_id === response.response_id ? response : r
            ),
          };
        }
        // Agrega la nueva respuesta
        return {
          ...msg,
          response: [...(msg.response || []), response],
        };
      }),
    }));
  },

  deleteResponseFromMessage: (responseId: number) => {
    console.log("🔍 Buscando respuesta para eliminar:", responseId);
    set((state) => {
      const updatedMessages = state.messages.map((msg) => {
        if (!msg.response) return msg;

        const hasResponse = msg.response.some(r => r.response_id === responseId);
        if (!hasResponse) return msg;

        console.log(`✅ Eliminando respuesta ${responseId} del mensaje ${msg.mensaje_id}`);
        return {
          ...msg,
          response: msg.response.filter(r => r.response_id !== responseId)
        };
      });

      return { messages: updatedMessages };
    });
  },
  // Selectores computados
  cantResponseMessages: () => {
    const { messages } = get();
    return messages.filter(
      message => Array.isArray(message.response) && message.response.length > 0
    ).length;
  },

  cantResponseNotSeen: () => {
    const { messages } = get();
    return messages.reduce((total, message) => {
      if (!Array.isArray(message.response)) return total;
      // Sumamos la cantidad de respuestas no leídas de este mensaje
      const unreadInMessage = message.response.filter(
        res => res.response_isRead === false
      ).length;
      return total + unreadInMessage;
    }, 0);
  },

  cantMessageNotSeen: () => {
    const { messages } = get();
    return messages.filter(message => !message.mensaje_isRead).length;
  },
}));
export default useMessageStore;
