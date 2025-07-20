"use client";
import type { Session } from "next-auth";
import { type MensajeWithUser } from "@/types/mensaje";
import { useActionState, useEffect } from "react";

import { patchStatus } from "@/app/actions/contact/contact-actions";
import { toast } from "sonner";
import {
  CheckCheckIcon,
  EyeIcon,
  SparkleIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FormState {
  error?: string;
  success?: string;
}

export default function StatusChangeForm({
  message,
  session,
}: {
  message: MensajeWithUser;
  session: Session | null;
}) {
  const router = useRouter();
  const initialState: FormState = {};
  const [state, formAction] = useActionState<FormState, FormData>(
    patchStatus,
    initialState
  );
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
      router.refresh(); // Refresca la página para ver los cambios
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
  }, [state, router]); // Solo se ejecutará cuando state cambie o router cambie
  return (
    <form action={formAction} className="mt-auto">
      <input type="hidden" name="mensaje_id" value={message.mensaje_id} />
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
          {checks(message.mensaje_status)}
        </button>
      </div>
    </form>
  );
}
