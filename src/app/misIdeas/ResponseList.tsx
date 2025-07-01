"use client";
import type { MensajeWithUser } from "@/app/types/mensaje";
import { formatDate } from "../hooks/formatDate";
import { Calendar1Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";


export default function ResponseList({ myMessages, openMessageId, setOpenMessageId }: { myMessages: MensajeWithUser[], openMessageId: number | null, setOpenMessageId: () => void }) {
    console.log(myMessages.map(m => m.mensaje_id));

    //obtenemos el mensaje por su id
    const getMyMessageById = myMessages.find((message) => message.mensaje_id === openMessageId);

    if (!getMyMessageById || !getMyMessageById.response || getMyMessageById.response.length === 0) {
        return <div className="w-full mt-4 text-center">No hay respuestas para esta idea.</div>;
    }

    console.log(getMyMessageById.response.map(r => r.response_id));


    return (
        <div className="w-full mt-4 transition-all duration-300 cursor-pointer"
            onClick={() => setOpenMessageId()}
        >
            <div
                className="p-6 bg-primary/5 rounded-lg"
            >
                <h4 className="text-xl font-bold mb-6">{getMyMessageById.response.length >= 2 ? "Respuestas " : "Respuesta "}para {getMyMessageById.mensaje_title} </h4>
                {getMyMessageById.response.map((response, index, arr) => (
                    <div key={response.response_id}
                        className="mb-6">
                        <h3 className="text-lg mb-2 text-gray-400 ">
                            {response.response_description}
                        </h3>

                        {/* Aquí puedes agregar más contenido del card */}
                        <div className="text-gray-600 flex gap-2 items-center" >
                            <Calendar1Icon className="w-4 h-4" />
                            {formatDate(response.response_created_on.toString())}</div>

                        {
                            index < arr.length - 1 &&
                            <Separator className="h-0.5 bg-gray-400" />
                        }
                    </div>
                ))}
            </div>
        </div >

    );



}