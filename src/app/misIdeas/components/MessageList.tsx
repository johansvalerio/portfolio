"use client";
import { LightbulbIcon } from "lucide-react";
import { MensajeWithUser } from "@/app/types/mensaje";
import { Session } from "next-auth";
import { formatDate } from "@/app/helpers/formatDate";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Loading from "./Loading";
import StatusChangeForm from "./StatusChangeForm";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FormState } from "@/app/types/formState";
import { readMessage } from "@/app/actions/contact/contact-actions";
import { useRouter } from "next/navigation";

interface MessageListProps {
  filteredMessages: MensajeWithUser[];
  messageId: number | null;
  setMessageId: (messageId: number | null) => void;
  session: Session | null;
}

export default function MessageList({
  filteredMessages,
  messageId,
  setMessageId,
  session,
}: MessageListProps) {
  const formRefs = useRef<{ [key: number]: HTMLFormElement | null }>({});
  const [cantNotiShown, setCantNotiShown] = useState(2);
  const router = useRouter();
  const initialState = {};
  const [state, formAction] = useActionState<FormState, FormData>(
    readMessage,
    initialState
  );
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const handleIsOpen = (id: number) => {
    if (messageId === id) {
      setMessageId(null); // Cierra si ya está abierto
      router.refresh();
    } else {
      setMessageId(id); // Abre el nuevo mensaje
      formRefs.current[id]?.requestSubmit(); // Marca como leído
      router.refresh();
    }
  };

  //Datos actualizados del selectedMessage 1 mensaje
  const msgData = filteredMessages?.find((msg) => msg.mensaje_id === messageId);

  //Obtenemos cuántas respuestas tiene cada mensaje por separado
  const getResponseCountByMessageId = useMemo(() => {
    // Creamos un mapa mensaje_id => cantidad de respuestas
    const map: Record<number, number> = {};
    filteredMessages?.forEach((message) => {
      map[message.mensaje_id] = Array.isArray(message.response)
        ? message.response.length
        : 0;
    });
    return (mensaje_id: number) => map[mensaje_id] || 0;
  }, [filteredMessages]);
  //useEffect para incrementar la cantidad de ideas a mostrar
  useEffect(() => {
    if (inView) {
      setCantNotiShown((prev) => prev + 1);
    }
  }, [inView]);

  // useEffect para mostrar las respuestas actualizadas y el state error y éxito
  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]); // Solo se ejecutará cuando state cambie o router cambie

  return (
    <div className="space-y-1">
      {filteredMessages?.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          <LightbulbIcon className="h-12 w-12 mx-auto mb-4 opacity-50 " />
          <p>No hay ideas</p>
        </div>
      ) : (
        filteredMessages?.slice(0, cantNotiShown).map((message) => {
          const isMessageNotSeen = !message.mensaje_isRead;
          // //para solo un objeto
          // const isResponseNotSeen = message.response?.filter((res) => !res.response_isRead)
          const isResponseNotSeen =
            Array.isArray(message.response) &&
            message.response.some((res) => !res.response_isRead);
          const isSelected = msgData?.mensaje_id === message.mensaje_id;
          return (
            <div
              key={message.mensaje_id}
              className={`p-4 cursor-pointer border-b transition-all duration-100 
                                     ${
                                       isSelected
                                         ? "dark:bg-muted dark:hover:bg-muted/90 bg-primary/20 hover:bg-primary/10 border-l-4 border-l-muted-foreground"
                                         : isResponseNotSeen
                                           ? "bg-green-200/70 hover:bg-green-200 dark:bg-green-600/40 dark:hover:bg-green-500/20"
                                           : isMessageNotSeen
                                             ? "bg-blue-200/70 hover:bg-blue-200 dark:bg-indigo-600/40 dark:hover:bg-indigo-500/20  border-l-blue-400 dark:border-l-indigo-500"
                                             : "hover:bg-primary/10 border-transparent dark:hover:bg-muted/50 dark:bg-muted"
                                     }
            `}
              onClick={() => handleIsOpen(message.mensaje_id)}
            >
              <form
                ref={(el) => {
                  formRefs.current[message.mensaje_id] = el;
                }}
                action={formAction}
                style={{ display: "none" }}
              >
                <input
                  type="hidden"
                  name="mensaje_id"
                  value={message.mensaje_id}
                />
                {Array.isArray(message.response) &&
                  message.response
                    .filter((res) => res.response_isRead === false)
                    .map((res) => (
                      <input
                        key={res.response_id}
                        type="hidden"
                        name="response_id"
                        value={res.response_id}
                      />
                    ))}
              </form>
              <div className="flex justify-between flex-row gap-2">
                <div className="flex gap-2 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Avatar className="h-8 w-8 border rounded-full border-border">
                      <AvatarImage
                        src={message.user?.user_image || ""}
                        className="rounded-full"
                      />
                      <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-xs">
                        {message.user?.user_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {message.user?.user_name || "Usuario"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {message.user?.user_email}
                    </p>
                  </div>
                </div>

                {/* cambiar el estado del mensaje */}
                <div>
                  <StatusChangeForm message={message} session={session} />
                </div>
              </div>
              <p className="font-medium text-sm mb-1 line-clamp-1">
                {message.mensaje_title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {message.mensaje_description}
              </p>
              <div className="flex justify-between items-baseline-last">
                <p className="text-xs text-muted-foreground">
                  {formatDate(message.mensaje_created_on.toString())}
                </p>
                <div>
                  <p className="font-medium text-sm  mb-1 line-clamp-1 flex items-center justify-end gap-2">
                    {isMessageNotSeen && (
                      <span className="bg-blue-500 text-white text-[10px] font-semibold px-2 py-[3px] rounded-full animate-pulse">
                        Idea nueva
                      </span>
                    )}
                    {isResponseNotSeen && (
                      <span className="bg-green-500 text-white text-[10px] font-semibold px-2 py-[3px] rounded-full animate-pulse">
                        Respuesta nueva
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-right text-muted-foreground">
                    {getResponseCountByMessageId(message.mensaje_id) === 1
                      ? getResponseCountByMessageId(message.mensaje_id) +
                        " respuesta"
                      : getResponseCountByMessageId(message.mensaje_id) > 1
                        ? getResponseCountByMessageId(message.mensaje_id) +
                          " respuestas"
                        : "Sin respuestas"}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
      {filteredMessages && cantNotiShown < filteredMessages.length && (
        <div ref={ref}>
          <Loading />
        </div>
      )}
      {!filteredMessages && (
        <p className="text-center text-sm mt-4 text-primary/50">
          Ya no hay más ideas.
        </p>
      )}
    </div>
  );
}
