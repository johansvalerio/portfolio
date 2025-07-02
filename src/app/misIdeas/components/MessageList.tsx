"use client"
import { formatDate } from "@/app/hooks/formatDate";
import { MensajeWithUser } from "@/app/types/mensaje";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LightbulbIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import StatusChangeForm from "./StatusChangeForm";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageListProps {
    messages: MensajeWithUser[] | null,
    selectedMessage: MensajeWithUser | null,
    setSelectedMessage: (message: MensajeWithUser | null) => void
    session: Session | null
}

export default function MessageList({ messages, selectedMessage, setSelectedMessage, session }: MessageListProps) {

    const [searchTerm, setSearchTerm] = useState("")
    const userMessages = messages?.filter(
        (message) => message.userId === Number(session?.user.id) ||
            session?.user.role === 1
    );

    const filteredMessages = userMessages?.filter((message) =>
        message.mensaje_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.mensaje_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.user?.user_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const handleIsOpen = (message: MensajeWithUser) => {
        setSelectedMessage(message)
        if (selectedMessage) {
            setSelectedMessage(null)
        }
        if (selectedMessage?.mensaje_id !== message.mensaje_id) {
            setSelectedMessage(message)
        }
    }

    return (
        <Card className="h-full flex flex-col shadow-md">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">Todas mis ideas</CardTitle>

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
            <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="space-y-1">
                    {filteredMessages?.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            <LightbulbIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay ideas</p>
                        </div>
                    ) : (
                        filteredMessages?.map((message) => (
                            <div
                                key={message.mensaje_id}
                                className={`p-4 cursor-pointer 
                                   hover:bg-blue-100/40 border-b
                                    dark:hover:bg-muted/50 transition-colors ${selectedMessage?.mensaje_id === message.mensaje_id ? "dark:bg-muted bg-blue-100/50 border-l-4 dark:border-l-amber-50 border-l-blue-400" : "border-l-4 border-transparent"
                                    }`}
                                onClick={() => handleIsOpen(message)}
                            >
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
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}