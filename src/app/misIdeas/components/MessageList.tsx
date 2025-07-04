"use client"
import { formatDate } from "@/app/hooks/formatDate";
import { MensajeWithUser } from "@/app/types/mensaje";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    LightbulbIcon,
    ReplyIcon,
    ListTodoIcon,
    CheckCircleIcon,
    SearchIcon
} from "lucide-react";
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
    const [activeFilter, setActiveFilter] = useState<"unread" | "unanswered" | "responded" | null>(null);
    const [cantNotiShown, setCantNotiShown] = useState(2)
    const initialState = {};
    const [state, formAction] = useActionState<FormState, FormData>(
        readMessage,
        initialState
    );
    const router = useRouter()
    //mensajes por usuario
    const userMessages = useMemo(() => (
        messages?.filter(
            (message) => message.userId === Number(session?.user.id) ||
                session?.user.role === 1
        ) || []
    ), [messages, session?.user.id, session?.user.role]);
    //mensajes filtrados con search params
    const filteredMessages = useMemo(() => {
        let result = userMessages;

        if (activeFilter === "unread") {
            result = result.filter((msg) => !msg.mensaje_isRead);
        }

        if (activeFilter === "unanswered") {
            result = result.filter((msg) =>
                Array.isArray(msg.response) &&
                msg.response.some((res) => !res.response_isRead)
            );
        }

        if (activeFilter === "responded") {
            result = result.filter((msg) =>
                Array.isArray(msg.response) && msg.response.length > 0
            );
        }

        return result.filter((msg) =>
            msg.mensaje_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.mensaje_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (msg.user?.user_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
    }, [userMessages, searchTerm, activeFilter]);
    //Total de mensajes sin ver
    const cantMessageNotSeen = useMemo(() =>
        userMessages.filter((message) => !message.mensaje_isRead).length
        , [userMessages]);

    //Datos actualizados del selectedMessage
    const msgData = messages?.find((msg) => msg.mensaje_id === selectedMessage?.mensaje_id)


    //las respuesta pueden ser varias a un mismo mensaje, por eso verificamos si la
    //respuesta es un Array y también si la cantidad de respuesta es mayor a 0
    //Esta es la cantidad de mensajes que han sido respondidos 
    const cantResponseMessages = useMemo(() =>
        userMessages.filter((message) => Array.isArray(message.response) && message.response.length > 0).length
        , [userMessages]);

    //Total de respuestas sin ver
    const cantResponseNotSeen = useMemo(() =>
        userMessages.filter(
            (message) =>
                Array.isArray(message.response) &&
                message.response.some((res) => res.response_isRead === false)
        ).length
        , [userMessages]);

    // //El total de todas las respuestas de todos los mensajes
    // const allResponseMessages = useMemo(() =>
    //     userMessages.reduce(
    //         (acc, message) =>
    //             acc + (Array.isArray(message.response) ? message.response.length : 0),
    //         0
    //     ),
    //     [userMessages]
    // );

    //Obtenemos cuántas respuestas tiene cada mensaje por separado
    const getResponseCountByMessageId = useMemo(() => {
        // Creamos un mapa mensaje_id => cantidad de respuestas
        const map: Record<number, number> = {};
        userMessages.forEach((message) => {
            map[message.mensaje_id] = Array.isArray(message.response) ? message.response.length : 0;
        });
        return (mensaje_id: number) => map[mensaje_id] || 0;
    }, [userMessages]);

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

    //useEffect para incrementar la cantidad de ideas a mostrar
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
        <Card className={`flex flex-col shadow-md
            ${filteredMessages.length === 0 ? "h-[70vh] " : "h-[110vh]"
            }
        `}>
            {/* El buscador de ideas */}
            <CardHeader className="pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {/* Nuevas ideas */}
                    <div className={`cursor-pointer flex items-center justify-between bg-blue-100 dark:bg-indigo-900/30 p-3 rounded-xl
                    ${activeFilter === "unread" ? "ring-2 ring-blue-500" : ""}`}
                        onClick={() => setActiveFilter((prev) => (prev === "unread" ? null : "unread"))}
                        title="Ideas nuevas sin leer">
                        <div className="flex items-center gap-3">
                            <LightbulbIcon className="h-6 w-6 text-blue-500 dark:text-blue-300" />
                            <div className="text-sm font-medium">
                                {cantMessageNotSeen === 0 ? "No hay nuevas ideas" : "Ideas nuevas"}
                            </div>
                        </div>
                        {cantMessageNotSeen > 0 && (
                            <Badge className="bg-blue-500 text-white px-2 py-1 text-xs rounded-full animate-pulse"
                                title={`${cantMessageNotSeen} ideas nuevas`}>
                                {cantMessageNotSeen}
                            </Badge>
                        )}
                    </div>

                    {/* Respuestas nuevas */}
                    <div className={`cursor-pointer flex items-center justify-between bg-green-100 dark:bg-green-900/30 p-3 rounded-xl
                    ${activeFilter === "unanswered" ? "ring-2 ring-green-500" : ""}`}
                        onClick={() => setActiveFilter((prev) => (prev === "unanswered" ? null : "unanswered"))}
                        title="Respuestas nuevas sin leer">
                        <div className="flex items-center gap-3">
                            <ReplyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                            <div className="text-sm font-medium">
                                {cantResponseNotSeen === 0 ? "No hay nuevas respuestas" : "Respuestas nuevas"}
                            </div>
                        </div>
                        {cantResponseNotSeen > 0 && (
                            <Badge className="bg-green-600 text-white px-2 py-1 text-xs rounded-full animate-pulse"
                                title={`${cantResponseNotSeen} respuestas nuevas`}>
                                {cantResponseNotSeen}
                            </Badge>
                        )}
                    </div>

                    {/* Total ideas */}
                    <div className="cursor-pointer flex items-center justify-between bg-slate-100 dark:bg-slate-800/40 p-3 rounded-xl"
                        onClick={() => setActiveFilter(null)}
                        title="Cantidad total de ideas registradas">
                        <div className="flex items-center gap-3">
                            <ListTodoIcon className="h-6 w-6 text-slate-500 dark:text-slate-300" />
                            <div className="text-sm font-medium">Total de ideas</div>
                        </div>
                        <Badge className="bg-slate-500 text-white px-2 py-1 text-xs rounded-full"
                            title={`${filteredMessages.length} ideas totales`}>
                            {filteredMessages.length}
                        </Badge>
                    </div>

                    {/* Total respondidas */}
                    <div className={`flex items-center justify-between bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl cursor-pointer hover:scale-[1.01] transition
                ${activeFilter === "responded" ? "ring-2 ring-purple-500" : ""}
  `}
                        onClick={() => setActiveFilter((prev) => (prev === "responded" ? null : "responded"))}
                        title="Ideas que ya fueron respondidas">
                        <div className="flex items-center gap-3">
                            <CheckCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            <div className="text-sm font-medium">Ideas respondidas</div>
                        </div>
                        <Badge className="bg-purple-600 text-white px-2 py-1 text-xs rounded-full"
                            title={`${cantResponseMessages} ideas respondidas`}>
                            {cantResponseMessages}
                        </Badge>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    {activeFilter && (
                        <p className="text-sm mt-2 text-muted-foreground">
                            Filtrando por: {
                                activeFilter === "unread" ? "Ideas nuevas" :
                                    activeFilter === "unanswered" ? "Respuestas nuevas" :
                                        "Ideas respondidas"
                            }
                        </p>
                    )}
                    {activeFilter && (
                        <button
                            onClick={() => setActiveFilter(null)}
                            className="text-xs cursor-pointer mr-2 text-blue-500 underline mt-2 hover:text-blue-700"
                        >
                            Quitar filtro
                        </button>
                    )}
                </div>

                <div className="p-[2px] rounded-lg bg-gradient-to-r from-foreground/60 via-foreground/70 to-blue-400/60 mt-4">
                    <div className="relative bg-white dark:bg-black rounded-lg">
                        <Input
                            className="border-2 px-8 h-10"
                            placeholder="Buscar en mis ideas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute top-2 left-2">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* Mostramos los mensajes */}
            <CardContent className={`flex-1 p-0 overflow-y-auto
                `}>
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
                            const isResponseNotSeen = Array.isArray(message.response) && message.response.some((res) => !res.response_isRead);
                            const isSelected = msgData?.mensaje_id === message.mensaje_id;

                            return (
                                <div
                                    key={message.mensaje_id}
                                    className={`p-4 cursor-pointer border-b transition-all duration-100 
                                     ${isSelected
                                            ? "dark:bg-muted dark:hover:bg-muted/90 bg-primary/20 hover:bg-primary/10 border-l-4 border-l-muted-foreground"
                                            : isResponseNotSeen
                                                ? "bg-green-200/70 hover:bg-green-200 dark:bg-green-600/40 dark:hover:bg-green-500/20"
                                                : isMessageNotSeen
                                                    ? "bg-blue-200/70 hover:bg-blue-200 dark:bg-indigo-600/40 dark:hover:bg-indigo-500/20  border-l-blue-400 dark:border-l-indigo-500"
                                                    : "hover:bg-primary/10 border-transparent dark:hover:bg-muted/50 dark:bg-muted"
                                        }
            `}
                                    onClick={() => handleIsOpen(message)}
                                >
                                    <form
                                        ref={el => { formRefs.current[message.mensaje_id] = el }}
                                        action={formAction}
                                        style={{ display: "none" }}
                                    >
                                        <input type="hidden" name="mensaje_id" value={message.mensaje_id} />
                                        {Array.isArray(message.response) &&
                                            message.response
                                                .filter(res => res.response_isRead === false)
                                                .map(res => (
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
                                                <Avatar className="h-8 w-8 border border-border">
                                                    <AvatarImage src={message.user?.user_image || ""} />
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                        {msgData?.user?.user_name.substring(0, 2).toUpperCase()}
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
                                    <div className="flex justify-between items-baseline-last">
                                        <p className="text-xs text-muted-foreground">{formatDate(message.mensaje_created_on.toString())}</p>
                                        <div>
                                            <p className="font-medium text-sm  mb-1 line-clamp-1 flex items-center justify-end gap-2">
                                                {isMessageNotSeen && (
                                                    <Badge className="bg-blue-500 text-white text-[10px] font-semibold px-2 py-[2px] rounded-full animate-pulse">
                                                        Idea nueva
                                                    </Badge>
                                                )}
                                                {isResponseNotSeen && (
                                                    <Badge className="bg-green-600 text-white text-[10px] font-semibold px-2 py-[2px] rounded-full animate-pulse">
                                                        Respuesta nueva
                                                    </Badge>
                                                )}
                                            </p>
                                            <p className="text-xs text-right text-muted-foreground">
                                                {
                                                    getResponseCountByMessageId(message.mensaje_id) === 1
                                                        ? getResponseCountByMessageId(message.mensaje_id) + " respuesta"
                                                        : getResponseCountByMessageId(message.mensaje_id) > 1
                                                            ? getResponseCountByMessageId(message.mensaje_id) + " respuestas"
                                                            : "Sin respuestas"
                                                }
                                            </p>
                                        </div>
                                    </div>


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