"use client";
import { formatDate } from "@/app/helpers/formatDate";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import ResponseForm from "./ResponseForm";
import ResponseList from "./ResponseList";
import type { Session } from "next-auth";
import StatusChangeForm from "./StatusChangeForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useMessageStore from "@/lib/messageStore";

interface MessageDetailsProps {
  messageId: number | null;
  setMessageId: (messageId: number | null) => void;
  session: Session | null;
}

export default function MessageDetails({
  messageId,
  setMessageId,
  session,
}: MessageDetailsProps) {
  const messages = useMessageStore((state) => state.messages);

  const selectedMessage = messages?.find((msg) => msg.mensaje_id === messageId);

  if (!selectedMessage) return null;

  return (
    <Card
      className={`flex flex-col shadow-md h-[110vh]
        `}
    >
      <CardHeader className="border-b flex flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setMessageId(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full ">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={selectedMessage.user?.user_image || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {selectedMessage?.user?.user_name
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-medium text-sm">
                {selectedMessage.user?.user_name || "Usuario"}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedMessage.user?.user_email}
              </p>
            </div>
          </div>
        </div>

        <div>
          <StatusChangeForm message={selectedMessage} session={session} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex-1 mb-6">
          <h2 className="text-lg font-medium px-4">
            {selectedMessage.mensaje_title}
          </h2>
          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <p className="mb-2">{selectedMessage.mensaje_description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(selectedMessage.mensaje_created_on.toString())}
            </div>
          </div>
          {/* Respuestas */}
          <ResponseList
            session={session}
            messageId={selectedMessage.mensaje_id}
          />
        </div>
        {session && session.user.role === 1 && (
          <ResponseForm selectedMessage={selectedMessage} />
        )}
      </CardContent>
    </Card>
  );
}
