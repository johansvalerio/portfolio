"use client"
import { formatDate } from "@/app/hooks/formatDate";
import { MensajeWithUser } from "@/app/types/mensaje";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LightbulbIcon, SearchIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import StatusChangeForm from "./StatusChangeForm";
import Loading from "./Loading"
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInView } from 'react-intersection-observer';
import { Badge } from "@/components/ui/badge";
import { useActionState, useRef } from "react";
import type { FormState } from "@/app/types/formState";
import { useRouter } from "next/navigation";
import { readMessage } from "@/app/actions/contact/contact-actions";

interface MessageListProps {
    messages: MensajeWithUser[] | null,
    selectedMessage: MensajeWithUser | null,
    setSelectedMessage: (message: MensajeWithUser | null) => void
    session: Session | null
}

export default function MessageList({ messages, selectedMessage, setSelectedMessage, session }: MessageListProps) {

    const formRefs = useRef<{ [key: number]: HTMLFormElement | null }>({});
    const [searchTerm, setSearchTerm] = useState("")
    const [cantNotiShown, setCantNotiShown] = useState(2)
    const initialState = {};
    const [state, formAction] = useActionState<FormState, FormData>(
        readMessage,
        initialState
    );
    const router = useRouter()
    const userMessages = useMemo(() => (
        messages?.filter(
            (message) => message.userId === Number(session?.user.id) ||
                session?.user.role === 1
        ) || []
    ), [messages, session?.user.id, session?.user.role]);

    const filteredMessages = useMemo(() => (
        userMessages.filter((message) =>
            message.mensaje_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.mensaje_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (message.user?.user_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        )
    ), [userMessages, searchTerm]);

    const cantMessageNotSeen = useMemo(() =>
        userMessages.filter((message) => !message.mensaje_isRead).length
        , [userMessages]);


    // useEffect para mostrar las respuestas actualizadas y el state error y éxito
    useEffect(() => {
        if (state?.success) {
            router.refresh();
        }
    }, [state, router]); // Solo se ejecutará cuando state cambie o router cambie

    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: false,
    });

    useEffect(() => {
        if (inView) {
            setCantNotiShown((prev) => prev + 1);
        }
    }, [inView]);


    const handleIsOpen = (message: MensajeWithUser) => {
        if (selectedMessage?.mensaje_id === message.mensaje_id) {
            setSelectedMessage(null); // Cierra si ya está abierto
        } else {
            setSelectedMessage(message); // Abre el nuevo mensaje
            formRefs.current[message.mensaje_id]?.requestSubmit(); // Marca como leído
        }
    };

    return (
        <Card className={`h-full flex flex-col shadow-md
        `}>

            {/* El buscador de ideas */}
            <CardHeader className="pb-4">
                <div className="flex items-center flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{cantMessageNotSeen === 0 ?
                            "No hay ideas nuevas" : "Ideas nuevas"}</CardTitle>
                        {cantMessageNotSeen ?
                            <Badge className="bg-red-400 rounded-full h-6 w-6 flex items-center">
                                <span className="text-white text-lg font-semibold">
                                    {cantMessageNotSeen}
                                </span>
                            </Badge>
                            : null
                        }
                    </div>
                    <div className="flex items-center gap-1 text-foreground/50 ">
                        Todas mis ideas
                        <Badge className="bg-primary/50 rounded-full h-6 w-6 flex items-center">
                            <span className="text-white text-lg font-semibold">
                                {filteredMessages.length}
                            </span>
                        </Badge>
                    </div>
                </div>
                <div className="p-[2px] rounded-lg bg-gradient-to-r from-foreground/60 via-foreground/70 to-blue-400/60 mt-4">
                    <div className="relative bg-white dark:bg-black rounded-lg">
                        <Input
                            className="border-2 h-10"
                            placeholder="Buscar en mis ideas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute top-2 right-4">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* Mostramos los mensajes */}
            <CardContent className={`flex-1 overflow-y-auto p-0
                `}>
                <div className="space-y-1">
                    {filteredMessages?.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            <LightbulbIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay ideas</p>
                        </div>
                    ) : (
                        filteredMessages?.slice(0, cantNotiShown).map((message) => {
                            const isNotSeen = !message.mensaje_isRead;
                            const isSelected = selectedMessage?.mensaje_id === message.mensaje_id;

                            return (
                                <div
                                    key={message.mensaje_id}
                                    className={`p-4 cursor-pointer border-b transition-all duration-300 hover:bg-primary/10
                                            ${isSelected
                                            ? "dark:bg-muted dark:hover:bg-muted/90 bg-primary/20 hover:bg-primary/10 border-l-4 border-l-blue-400"
                                            : isNotSeen
                                                ? "bg-blue-200 hover:bg-blue-200/90 dark:bg-indigo-500/50 dark:hover:bg-indigo-500/40 border-l-4"
                                                : "border-l-4 border-transparent dark:hover:bg-muted/50 dark:bg-muted"
                                        }
      `}
                                    onClick={() => handleIsOpen(message)}
                                >
                                    {session?.user.role === 1 &&
                                        <form
                                            ref={el => { formRefs.current[message.mensaje_id] = el }}
                                            action={formAction}
                                            style={{ display: "none" }}
                                        >
                                            <input type="hidden" name="mensaje_id" value={message.mensaje_id} />
                                        </form>}
                                    <div className="flex justify-between flex-row gap-2">
                                        <div className="flex gap-2 mb-6">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Avatar className="h-8 w-8 border border-border">
                                                    <AvatarImage src={message.user?.user_image || ""} />
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                        {selectedMessage?.user?.user_name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{message.user?.user_name || "Usuario"}</p>
                                                <p className="text-xs text-muted-foreground">{message.user?.user_email}</p>
                                            </div>
                                        </div>

                                        {/* cambiar el estado del mensaje */}
                                        <div>
                                            <StatusChangeForm message={message} session={session} />
                                        </div>

                                    </div>
                                    <p className="font-medium text-sm mb-1 line-clamp-1">{message.mensaje_title}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{message.mensaje_description}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(message.mensaje_created_on.toString())}</p>
                                </div>
                            )
                        })

                    )}
                    {filteredMessages && cantNotiShown < filteredMessages.length &&

                        <div ref={ref}>
                            <Loading />
                        </div>

                    }
                    {
                        !filteredMessages &&
                        <p className="text-center text-sm mt-4 text-primary/50">Ya no hay más ideas.</p>
                    }
                </div>

            </CardContent>
        </Card >
    )
}