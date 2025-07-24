import { create } from 'zustand';
import type { MensajeWithUser } from '@/types/mensaje';
import { getMessages } from '@/app/actions/contact/message-actions';

interface MessageState {
    messages: MensajeWithUser[];
    messageId: number | null;
    loading: boolean;
    addMessage: (message: MensajeWithUser) => void;
    readMessage: (id: string, readMessage: MensajeWithUser) => void;
    fetchMessages: () => Promise<void>;
    setMessageId: (messageId: number | null) => void;
    patchMessageStatus: (messageId: number, status: string) => void;
}

const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    loading: false,
    messageId: null,
    addMessage: (message) => set((state) => ({
        messages: [message, ...state.messages],
    })),
    readMessage: (id, readMessage) => set((state) => ({
        messages: state.messages.map((message) =>
            message.mensaje_id === Number(id) 
        ? readMessage 
        : message
        ),
    })),
    fetchMessages: async () => {
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
}));
export default useMessageStore;
