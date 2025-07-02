"use client"
import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteResponse } from "@/app/actions/contact/contact-actions"

interface FormState {
    error?: string;
    success?: string;
}

export default function DeleteResponse({ responseId }: { responseId: number }) {
    const router = useRouter()
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

    return (
        <form action={formAction}>
            <input type="hidden" name="response_id" value={responseId} />
            <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="cursor-pointer"
            >
                <TrashIcon className="h-4 w-4" />
            </Button>
        </form>

    )
}