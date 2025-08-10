import type { NextApiRequest } from "next";
import { NextApiResponseServerIO } from '@/lib/socket';
import { db } from "@/lib/db";

export const config = {
    api: { bodyParser: true },
};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { mensajeId, responseIds } = req.body;

    console.log("Datos recibidos en read.ts:", { mensajeId, responseIds });

    if (!res.socket.server.io) {
        console.log("❌ Socket.IO aún no inicializado");
        return res.status(500).json({ error: "Socket.IO no inicializado" });
    }

    try {
        if (mensajeId) {
            console.log("Buscando mensaje con ID:", mensajeId);
            // Primero obtenemos el mensaje con su estado
            const message = await db.mensaje.findUnique({
                where: {
                    mensaje_id: mensajeId,
                },
            });

            if (!message) {
                return res.status(404).json({ error: "Mensaje no encontrado" });
            }

            if (!message.mensaje_isRead) {
                console.log("Actualizando mensaje con ID:", mensajeId);
                // Actualizamos el estado del mensaje
                const readMessageResponse = await db.mensaje.update({
                    where: { mensaje_id: mensajeId },
                    data: { mensaje_isRead: true },
                });

                // Emitimos el evento de actualización del mensaje
                console.log("⚡ Emitiendo mensaje leído vía socket.io:", readMessageResponse);
                res.socket.server.io.to(`user-${message.userId}`).emit("readMessageResponse", readMessageResponse);
                res.socket.server.io.to("admin-room").emit("readMessageResponse", readMessageResponse);

                return res.status(200).json(readMessageResponse);
            }
            return res.status(200).json({ success: "Mensaje ya está marcado como leído" });
        }
        console.log("Buscando respuestas con IDs:", responseIds);
        const responses = await db.response.findMany({
            where: { 
                response_id: { in: responseIds } 
            },
            include: {
                mensaje: true
            }
        })

        if (!responses.map(res => res.response_isRead).every(isRead => isRead)) {
            const readMessageResponse = await db.response.updateMany({
                where: { response_id: { in: responseIds } },
                data: { response_isRead: true }
            })
            console.log("Respuestas actualizadas:", readMessageResponse);
            // Emitimos el evento de actualización del mensaje
            console.log("⚡ Emitiendo respuestas leídas vía socket.io:", responses);
            res.socket.server.io.to(`user-${responses[0].mensaje.userId}`).emit("readMessageResponse", responses);
            res.socket.server.io.to("admin-room").emit("readMessageResponse", responses);

            return res.status(200).json(responses);
        }
        return res.status(200).json({ success: "Respuestas ya están marcadas como leídas" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al marcar respuestas como leídas" });
    }
}
