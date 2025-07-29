import { create } from "zustand"
import { type ResponseWithUser } from "@/types/response";
import { getResponses } from "@/app/actions/contact/response-actions";
import useMessageStore from './messageStore';

// Crea un selector para acceder a las acciones del messageStore
const useMessageActions = () => useMessageStore(
  (state) => ({
    addResponseToMessage: state.addResponseToMessage,
    deleteResponseFromMessage: state.deleteResponseFromMessage
  })
);

interface ResponseState {
  responses: ResponseWithUser[];
  loading: boolean;
  addResponse: (response: ResponseWithUser) => void;
  fetchResponses: (messageId: number) => Promise<void>;
  deleteResponse: (responseId: number) => void;
}

const useResponseStore = create<ResponseState>((set) => ({
  responses: [],
  loading: false,
  addResponse: (response) => {
    // Actualiza el store de respuestas
    set((state) => ({
      responses: state.responses.some(r => r.response_id === response.response_id)
        ? state.responses.map(r => r.response_id === response.response_id
          ? response
          : r)
        : [response, ...state.responses]
    }));

    // Actualiza el store de mensajes
    const messageStore = useMessageStore.getState();
    messageStore.addResponseToMessage?.(response);
  },
  fetchResponses: async (messageId) => {
    set({ loading: true });
    const responses = await getResponses(messageId);
    set({
      responses,
      loading: false,
    });
  },
  deleteResponse: (responseId) => {
    // Actualiza el store de respuestas
    set((state) => ({
      responses: state.responses.filter((r) => r.response_id !== responseId)
    }));

    // Siempre actualiza el store de mensajes, aunque la respuesta no esté en el array
    const messageStore = useMessageStore.getState();
    messageStore.deleteResponseFromMessage?.(responseId);
  }

}));
export default useResponseStore


