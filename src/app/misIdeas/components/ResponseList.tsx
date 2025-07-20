import { formatDate } from "@/app/helpers/formatDate";
import { Separator } from "@radix-ui/react-separator";
import { Reply } from "lucide-react";
import type { MensajeWithUser } from "@/types/mensaje";
import DeleteResponse from "./DeleteResponse";
import { Session } from "next-auth";

export default function ResponseMessages({
  selectedMessage,
  session,
}: {
  selectedMessage: MensajeWithUser | null;
  session: Session | null;
}) {
  if (!selectedMessage?.response || selectedMessage?.response.length <= 0) {
    return <p className="text-muted-foreground">No hay respuestas aún.</p>;
  }

  return (
    <>
      <h4 className="font-bold mb-2">Respuestas</h4>
      <div
        className={`mt-4
                 ${selectedMessage.response.length <= 1 ? "h-auto overflow-y-auto" : "h-[30vh] overflow-y-auto"}  `}
      >
        {selectedMessage.response.map((res, idx, arr) => (
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
