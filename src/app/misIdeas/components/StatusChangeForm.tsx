"use client";
import type { Session } from "next-auth";
import { useActionState, useEffect } from "react";
import useMessageStore from "@/lib/messageStore";
import { patchStatus } from "@/app/actions/contact/message-actions";
import { toast } from "sonner";
import {
  CheckCheckIcon,
  EyeIcon,
  SparkleIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { FORM_FIELDS } from "@/app/helpers/form-fields";
import { useSocket } from "@/app/providers/SocketProvider";
import { MensajeWithUser } from "@/types/mensaje";

interface FormState {
  error?: string;
  success?: string;
}

export default function StatusChangeForm({
  messageId,
  status,
  session,
}: {
  messageId: number;
  status: string;
  session: Session | null;
}) {
  const patchMessageStatus = useMessageStore(
    (state) => state.patchMessageStatus
  );
  const initialState: FormState = {};
  const [state, formAction] = useActionState<FormState, FormData>(
    patchStatus,
    initialState
  );
  const { socket, isConnected } = useSocket();

  // Escuchar nuevos mensajes en tiempo real
  //viene de socket.io
  // Este efecto se ejecuta cada vez que el socket está listo y conectado
  useEffect(() => {
    console.log("🟡 Esperando socket...");

    if (!socket || !isConnected || !session) {
      console.log("🚫 No hay socket aún o no está conectado");
      return;
    }

    console.log("✅ Socket listo para escuchar eventos");

    //Identificarse en el cliente
    socket.emit("identify", {
      id: session.user.id,
      role: session.user.role,
    });

    // Escuchar nuevos mensajes
    const handlePatchStatus = (patchStatus: MensajeWithUser) => {
      console.log("📥 Evento recibido en cliente:", patchStatus);
      // Actualizamos el estado de los mensajes en el store con el nuevo mensaje
      console.log("🔄 Actualizando mensajes en el store");
      patchMessageStatus(patchStatus.mensaje_id, patchStatus.mensaje_status);
    };

    socket.on("patchStatus", handlePatchStatus);

    return () => {
      socket.off("patchStatus", handlePatchStatus);
    };
  }, [socket, isConnected, patchMessageStatus, session]);

  console.log("Mensaje: ", messageId, "Status: ", status);
  const checks = (status: string) => {
    switch (status) {
      case "Enviado":
        return (
          <CheckCheckIcon className="w-4 h-4 text-amber-600 dark:text-amber-300" />
        );
      case "En revisión":
        return <EyeIcon className="w-4 h-4 text-blue-600 dark:text-blue-500" />;
      case "Visto bueno":
        return (
          <SparkleIcon className="w-4 h-4 text-green-600 dark:text-green-500" />
        );
      default:
        return "bg-gray-100 text-gray-800"; // Valor por defecto si no coincide con ningún caso
    }
  };
  // useEffect para mostrar los mensajes de error y éxito
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast(state.success, {
        icon: <ThumbsUpIcon className="w-5 h-5" />,
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "full",
        },
      });
    }
  }, [state]); // Solo se ejecutará cuando state cambie o router cambie
  return (
    <form action={formAction} className="mt-auto">
      <input
        type="hidden"
        name={FORM_FIELDS.MESSAGE_STATUS.MENSAJE_ID}
        value={messageId}
      />
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            // Evita que ecuando se haga click al botón, se abra el card de response
            e.stopPropagation();
          }}
          type={session?.user.role === 1 ? "submit" : "button"}
          className={`transition-all duration-300 ease-in-out bg-primary/10  p-2 rounded-full
                                    ${session?.user.role === 1 ? "cursor-pointer hover:bg-primary/20" : "cursor-default"}
  `}
        >
          {checks(status)}
        </button>
      </div>
    </form>
  );
}
