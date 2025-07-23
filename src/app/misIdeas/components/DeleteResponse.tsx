"use client";
import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteResponse } from "@/app/actions/contact/response-actions";
import { Session } from "next-auth";
import { FormState } from "@/types/formState";
import { FORM_FIELDS } from "@/app/helpers/form-fields";

export default function DeleteResponse({
  responseId,
  session,
}: {
  responseId: number;
  session: Session | null;
}) {
  const roleSession = session?.user.role === 1;
  const router = useRouter();
  const initialState = {};
  const [state, formAction] = useActionState<FormState, FormData>(
    deleteResponse,
    initialState
  );
  // useEffect para mostrar las respuestas actualizadas y el state error y éxito
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast(state.success, {
        icon: <ThumbsUpIcon className="w-5 h-5" />,
        position: "bottom-right",
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "full",
        },
      });
      router.refresh(); // Refresca la página para ver los cambios
    }
  }, [state, router]); // Solo se ejecutará cuando state cambie o router cambie

  if (roleSession) {
    return (
      <form action={formAction}>
        <input
          type="hidden"
          name={FORM_FIELDS.DELETE_RESPONSE.RESPONSE_ID}
          value={responseId}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </form>
    );
  }
}
