import { create } from "zustand"
import { type  Response } from "@prisma/client";
import { getResponses } from "@/app/actions/contact/response-actions";

interface ResponseState {
    responses: Response[];
    loading: boolean;
    addResponse: (response: Response) => void;
    fetchResponses: (messageId: number) => Promise<void>;
    deleteResponse: (responseId: number) => void;
}

const useResponseStore = create<ResponseState>((set) => ({
    responses: [],
    loading: false,
    addResponse: (response) =>
      set((state) => ({
        responses: [response,...state.responses]
      })),
    fetchResponses: async (messageId) => {
      set({ loading: true });
      const responses = await getResponses(messageId);
      set({
        responses,
        loading: false,
      });
    },
    deleteResponse: (responseId) =>
      set((state)=> ({
        responses: state.responses.filter((response) => response.response_id !== responseId)
      }))
  }));
export default useResponseStore


