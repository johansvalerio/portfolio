"use client";
import { formatDate } from "@/app/helpers/formatDate";
import { Separator } from "@radix-ui/react-separator";
import { Reply } from "lucide-react";
import DeleteResponse from "./DeleteResponse";
import { Session } from "next-auth";
import useResponseStore from "@/lib/responseStore";
import Loading from "./Loading";
import { useEffect } from "react";
import useMessageStore from "@/lib/messageStore";
import { useSocketHandler } from "@/app/hooks/useSocketMessage";

export default function ResponseList({ session }: { session: Session | null }) {
  const messageId = useMessageStore((state) => state.messageId);
  const loading = useResponseStore((state) => state.loading);
  const fetchResponses = useResponseStore((state) => state.fetchResponses);
  const isA = session?.user.role === 1;
  const responses = useResponseStore((state) => state.responses);

  // Solo ejecuta fetchResponses cuando messageId cambie y session esté lista
  useEffect(() => {
    if (!messageId || !session?.user?.id) return;
    fetchResponses(messageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageId]);

  useSocketHandler(session);

  if (!responses || responses.length <= 0) {
    return (
      <p className="text-muted-foreground flex justify-center items-center">
        No hay respuestas aún.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <h4 className="font-bold mb-2">Respuestas</h4>
      <div
        className={`mt-4 
                 ${
                   responses.length <= 1 || !isA
                     ? "h-auto overflow-y-auto"
                     : "md:h-[30vh] h-[26vh]  overflow-y-auto"
                 }  `}
      >
        {responses.map((res, idx, arr) => (
          <div key={res.response_id}>
            <div className="p-3 bg-primary/10 rounded mb-2 w-full">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1">{res.response_description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Reply className="h-3 w-3" />
                    {formatDate(res.response_created_on.toString())}
                  </div>
                </div>
                <div>
                  <DeleteResponse
                    responseId={res.response_id}
                    session={session}
                  />
                </div>
              </div>
            </div>

            {idx < arr.length - 1 && (
              <Separator className="h-0.5 bg-gray-400" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
