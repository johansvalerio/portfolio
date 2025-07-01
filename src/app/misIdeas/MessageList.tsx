"use client";
import { type MensajeWithUser } from "@/app/types/mensaje";
import { Session } from "next-auth";
import { formatDate } from "@/app/hooks/formatDate";
import { patchToSeen } from "@/app/actions/contact/contact-actions";
import { CheckCheckIcon, EyeIcon, LightbulbIcon, SparkleIcon, ThumbsUpIcon, Mail, User2Icon, Calendar1Icon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import GoogleButton from "../components/GoogleButton";
import ResponseList from "./ResponseList";

interface Status {
    status: string;
    icon: React.ReactNode;
}

interface FormState {
    error?: string;
    success?: string;
}

const statusIcons: Status[] = [
    { status: "Enviado", icon: <CheckCheckIcon className="w-5 h-5" /> },
    { status: "En revisión", icon: <EyeIcon className="w-5 h-5" /> },
    { status: "Visto bueno", icon: <SparkleIcon className="w-5 h-5" /> },
];

export default function MisMensajesPage({ messages, session }: { messages: MensajeWithUser[], session: Session | null }) {
    const initialState: FormState = {};
    const [state, formAction] = useActionState<FormState, FormData>(
        patchToSeen,
        initialState
    );

    const router = useRouter();

    const [openMessageId, setOpenMessageId] = useState<number | null>(null);

    const handleCardClicked = (mensaje_id: number) => {
        setOpenMessageId(openMessageId === mensaje_id ? null : mensaje_id);
    };

    const myMessages = messages.filter((message) => message.user?.user_id === session?.user?.id || session?.user.role === 1);

    const checks = (status: string) => {
        switch (status) {
            case "Enviado":
                return <CheckCheckIcon className="w-5 h-5" />;
            case "En revisión":
                return <EyeIcon className="w-5 h-5" />;
            case "Visto bueno":
                return <SparkleIcon className="w-5 h-5" />;
            default:
                return "bg-gray-100 text-gray-800"; // Valor por defecto si no coincide con ningún caso     
        }
    }

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

    if (!session) {
        return (
            <div className="container py-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center py-20">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center">
                        <LightbulbIcon className="w-8 h-8 mr-2" />
                        Mis {" "}
                        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent ml-2">
                            Ideas
                        </span>
                    </h2>
                    <p className="mb-6">Para ver tus ideas, por favor inicia sesión.</p>
                    <GoogleButton />
                </div>
            </div>
        )
    }

    if (!myMessages || myMessages.length === 0) {
        return (

            <div className="container py-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center py-20">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center">
                        <LightbulbIcon className="w-8 h-8 mr-2" />
                        Mis {" "}
                        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent ml-2">
                            Ideas
                        </span>
                    </h2>
                    <p className="mb-6">No has enviado tus ideas aún</p>
                </div>
            </div>

        );
    }

    return (
        <div className="container pt-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-bold md:mb-7 mb-6 flex items-center ">
                            <LightbulbIcon className="w-8 h-8 mr-2" />
                            Mis {" "}
                            <span className="ml-2">
                                Ideas
                            </span>
                        </h2>
                        <p>Aquí puedes ver todos los mensajes que has enviado.</p>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="md:text-2xl text-xl font-bold mb-6">Así funciona la selección de ideas</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            {statusIcons.map((status, index) => (
                                <p key={index} className=" flex items-center gap-4 ">
                                    <span
                                        className={`transition-all duration-300 ease-in-out p-2 rounded-full bg-primary/10
    ${status.status === "Enviado" ? "text-green-500 scale-110"
                                                : status.status === "En revisión" ? "text-blue-500 scale-110"
                                                    : status.status === "Visto bueno" ? "text-yellow-500 scale-110"
                                                        : "text-gray-400"
                                            }
  `}
                                    >
                                        {status.icon}
                                    </span> {status.status}
                                </p>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Master-detail layout */}
                <div className="py-10">
                    <div className="grid md:grid-cols-2 gap-8">
                        {myMessages.map((message) => (
                            <div key={message.mensaje_id}>
                                <div
                                    onClick={() => handleCardClicked(message.mensaje_id)}
                                    className={`min-h-[260px] flex flex-col
                                        bg-background/80 text-foreground p-6 rounded-lg shadow-md hover:bg-primary/5  transition-all duration-500 border-2
                                        cursor-pointer group`}
                                >
                                    <h2 className="text-2xl font-bold mb-6">{message.mensaje_title}</h2>
                                    <h3 className="text-lg mb-6 line-clamp-2 transition-all duration-500">{message.mensaje_description}</h3>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <User2Icon className="w-4 h-4" />
                                        {message.user?.user_name || "Usuario desconocido"}</p>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {message.user?.user_email} </p>
                                    <p className="text-gray-600 flex gap-2 items-center">
                                        <Calendar1Icon className="w-4 h-4" />
                                        {formatDate(message.mensaje_created_on.toString())}</p>
                                    <form action={formAction} className="mt-auto">
                                        <input type="hidden" name="mensaje_id" value={message.mensaje_id} />
                                        <div className="flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    // Evita que ecuando se haga click al botón, se abra el card de response
                                                    e.stopPropagation();
                                                }}
                                                type={session.user.role === 1 ? "submit" : "button"}
                                                className={`transition-all duration-300 ease-in-out bg-primary/10 hover:bg-primary/20 p-2 rounded-full
                                    ${session.user.role === 1 ? "cursor-pointer" : "cursor-default"}
                                                ${message.mensaje_status === "Enviado" ? "text-green-500 scale-110"
                                                        : message.mensaje_status === "En revisión" ? "text-blue-500 scale-110"
                                                            : message.mensaje_status === "Visto bueno" ? "text-yellow-500 scale-110"
                                                                : "text-gray-400"
                                                    }
  `}
                                            >
                                                {checks(message.mensaje_status)}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                {/* Detalle expandido dentro del grid */}
                                {openMessageId && openMessageId === message.mensaje_id && (
                                    <ResponseList
                                        myMessages={myMessages}
                                        openMessageId={openMessageId}
                                        setOpenMessageId={() => setOpenMessageId(null)} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}