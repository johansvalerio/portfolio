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

    const { responseId } = req.body;

    if (!res.socket.server.io) {
        console.log("❌ Socket.IO aún no inicializado");
        return res.status(500).json({ error: "Socket.IO no inicializado" });
    }

    try {
        // Primero obtenemos la respuesta con su mensaje asociado
        const response = await db.response.findUnique({
            where: {
                response_id: responseId,
            },
            include: {
                mensaje: true
            }
        });

        if (!response) {
            return res.status(404).json({ error: "Respuesta no encontrada" });
        }

        // Luego la eliminamos
        const deleteResponse = await db.response.delete({
            where: {
                response_id: responseId,
            },
        });

        // Emitimos con la información completa
        const responseWithMessage = {
            ...deleteResponse,
            mensaje: response.mensaje
        };

        console.log("⚡ Emitiendo respuesta eliminada vía socket.io:", responseWithMessage);
        res.socket.server.io.to(`user-${responseWithMessage.mensaje.userId}`).emit("deleteResponse", responseWithMessage);
        res.socket.server.io.to("admin-room").emit("deleteResponse", responseWithMessage);

        return res.status(201).json(deleteResponse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar respuesta" });
    }
}
