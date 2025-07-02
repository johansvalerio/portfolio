"use client"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner";
import { createResponse } from "@/app/actions/contact/contact-actions";
import { SendIcon, ThumbsUpIcon } from "lucide-react";
import type { MensajeWithUser } from "@/app/types/mensaje"
import { Button } from "@/components/ui/button";

interface FormState {
    error?: string;
    success?: string;
}

export default function ResponseForm({ selectedMessage }: { selectedMessage: MensajeWithUser | null }) {
    const [replyText, setReplyText] = useState("")
    const router = useRouter()
    const initialState = {};
    const [state, formAction] = useActionState<FormState, FormData>(
        createResponse,
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
            setReplyText("")
        }

    }, [state, router]); // Solo se ejecutará cuando state cambie o router cambie

    return (
        <form action={formAction} className="border-t pt-6 mt-6">
            <input type="hidden" name="mensaje_id" value={selectedMessage?.mensaje_id} />
            <label htmlFor="reply" className="text-base font-medium">
                Responder a {selectedMessage?.user?.user_name || "usuario"}
            </label>
            <div className="mt-3 space-y-4">
                <Textarea
                    id="reply"
                    name="response_description"
                    placeholder="Escribe tu respuesta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="resize-none"
                />
                <div className="flex gap-3">
                    <Button
                        type="submit"
                        className="flex-1"
                    >
                        <SendIcon />
                        Enviar respuesta
                    </Button>
                </div>
            </div>
        </form>
    )
}