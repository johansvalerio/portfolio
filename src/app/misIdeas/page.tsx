import MessagesPlayGround from "./components/MessagesPlayGround";
import authSession from "@/app/providers/auth-session";
import { Session } from "next-auth";
import GoogleButton from "../components/GoogleButtonSignIn";
import { LightbulbIcon } from "lucide-react";
import { getMessages } from "@/app/actions/contact/contact-actions";
import { MensajeWithUser } from "@/types/mensaje";

export default async function MisIdeasPage() {
  const session: Session | null = await authSession();
  const messages: MensajeWithUser[] = await getMessages();

  if (!session) {
    return (
      <main className="min-h-screen py-20 bg-gradient-to-br from-primary/5 to-blue-600/5">
        <div className="container py-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center py-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center">
              <LightbulbIcon className="w-8 h-8 mr-2" />
              Mis{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent ml-2">
                Ideas
              </span>
            </h2>
            <p className="mb-6">Para ver tus ideas, por favor inicia sesión.</p>
            <GoogleButton />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full py-20 bg-gradient-to-br from-primary/5 to-blue-600/5">
      <MessagesPlayGround messages={messages} session={session} />
    </main>
  );
}
