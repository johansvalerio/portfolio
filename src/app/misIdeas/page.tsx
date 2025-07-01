import { getContactMessages } from "@/app/actions/contact/contact-actions";
import MessageList from "./MessageList";
import { type MensajeWithUser } from "@/app/types/mensaje";
import authSession from "@/app/providers/auth-session";
import { Session } from "next-auth";

export default async function MisIdeasPage() {
    const messages: MensajeWithUser[] = await getContactMessages();
    const session: Session | null = await authSession();

    return (
        <main className="min-h-screen py-20 bg-gradient-to-br from-primary/5 to-blue-600/5">
            <MessageList messages={messages} session={session} />
        </main >
    );
}       