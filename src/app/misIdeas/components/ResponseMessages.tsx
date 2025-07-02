import { formatDate } from "@/app/hooks/formatDate";
import { Separator } from "@radix-ui/react-separator";
import { Reply } from "lucide-react";
import type { MensajeWithUser } from "@/app/types/mensaje";
import DeleteResponse from "./DeleteResponse";

export default function ResponseMessages({ selectedMessage }: { selectedMessage: MensajeWithUser | null }) {

    if (!selectedMessage?.response || selectedMessage?.response.length <= 0) {
        return <p className="text-muted-foreground">No hay respuestas aún.</p>
    }

    return (
        <div className="mt-4">
            <h4 className="font-bold mb-2">Respuestas</h4>
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
                                <DeleteResponse responseId={res.response_id} />
                            </div>
                        </div>

                    </div>

                    {idx < arr.length - 1 && (
                        <Separator className="h-0.5 bg-gray-400" />
                    )}
                </div>
            ))}
        </div>
    )
}