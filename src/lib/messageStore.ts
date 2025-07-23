import { create } from 'zustand';
import type { MensajeWithUser } from '@/types/mensaje';
import { getMessages } from '@/app/actions/contact/message-actions';

interface MessageState {
    messages: MensajeWithUser[];
    loading: boolean;
    addMessage: (message: MensajeWithUser) => void;
    readMessage: (id: string, readMessage: MensajeWithUser) => void;
    fetchMessages: () => Promise<void>;
}

const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    loading: false,
    addMessage: (message) => set((state) => ({
        messages: [message, ...state.messages],
    })),
    readMessage: (id, readMessage) => set((state) => ({
        messages: state.messages.map((message) =>
            message.mensaje_id === Number(id) ? readMessage : message
        ),
    })),
    fetchMessages: async () => {
        set({ loading: true });
        const messages = await getMessages();
        set({ messages, loading: false });
    },
}));
export default useMessageStore;
