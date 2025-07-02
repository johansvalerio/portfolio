import { formatDate } from "@/app/hooks/formatDate";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import ResponseForm from "./ResponseForm";
import ResponseMessages from "./ResponseMessages";
import type { Session } from "next-auth";
import { MensajeWithUser } from "@/app/types/mensaje";
import StatusChangeForm from "./StatusChangeForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageDetailsProps {
    selectedMessage: MensajeWithUser | null,
    setSelectedMessage: (message: MensajeWithUser | null) => void,
    session: Session | null
    responseMessage: MensajeWithUser | null
    messages: MensajeWithUser[]
}

export default function MessageDetails({ selectedMessage, setSelectedMessage, session, responseMessage, messages }: MessageDetailsProps) {

    if (!selectedMessage) return null

    const message = messages.find((msg) => msg.mensaje_id === selectedMessage.mensaje_id)

    if (!message) return null

    return (
        <Card className="h-full flex flex-col shadow-md">
            <CardHeader className="border-b flex flex-row justify-between gap-4">
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full ">
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
                </div>

                <div>
                    <StatusChangeForm
                        message={message}
                        session={session}
                    />
                </div>


            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-6">
                <div className="flex-1 mb-6">
                    <div className="bg-muted/30 rounded-lg p-4 mb-4">
                        <p className="mb-2">{selectedMessage.mensaje_description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(selectedMessage.mensaje_created_on.toString())}
                        </div>
                    </div>
                    {/* Respuestas */}
                    <ResponseMessages
                        selectedMessage={responseMessage} />
                </div>
                {session && session.user.role === 1 &&
                    <ResponseForm
                        selectedMessage={selectedMessage} />
                }
            </CardContent>
        </Card>
    )
}