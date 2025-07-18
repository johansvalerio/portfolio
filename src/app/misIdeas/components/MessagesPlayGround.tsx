"use client";
import { type Session } from "next-auth";
import FilterMessages from "./FilterMessages";
import StatusWay from "./StatusWay";
import ResponseCard from "./ResponseCard";
import Link from "next/link";
import { LightbulbIcon } from "lucide-react";
import { useState } from "react";
import { MensajeWithUser } from "@/app/types/mensaje";

export default function MessagesPlayGround({
  messages,
  session,
}: {
  messages: MensajeWithUser[] | null;
  session: Session | null;
}) {
  const [messageId, setMessageId] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="col-span-1 mb-8">
            <h1 className="text-3xl font-bold mb-6 gap-2 flex items-center">
              <LightbulbIcon className="w-6 h-6" />
              Mis ideas
            </h1>
            <p className="text-muted-foreground">
              Envía tus ideas haciendo{" "}
              <Link
                className="font-semibold text-foreground/70 hover:text-foreground transition-all underline underline-offset-4
                            transform hover:scale-105
                            hover:translate-y-1.5 hover:text-"
                href="/#contact"
              >
                click aquí
              </Link>
            </p>
          </div>
          {/* Cómo funciona el estado de la idea */}
          <div className="lg:col-span-1 mb-8">
            <StatusWay />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de mensajes */}
          <div className="lg:col-span-1">
            <FilterMessages
              messages={messages || []}
              messageId={messageId}
              setMessageId={setMessageId}
              session={session}
            />
          </div>
          {/* Vista del mensaje seleccionado y respuestas */}
          <div className="lg:col-span-2">
            {messageId ? (
              <ResponseCard
                messageId={messageId} //1 solo objeto con id del mensaje
                setMessageId={setMessageId} //para abrir o cerrar la vista de respuestas
                messages={messages || []} //todos los mensajes, filtramos con el selectMessage que tiene id
                session={session} //sesión del usuario
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Selecciona un mensaje para ver el detalle.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
