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

    const { response, userId, messageId } = req.body;

    if (!res.socket.server.io) {
        console.log("❌ Socket.IO aún no inicializado");
        return res.status(500).json({ error: "Socket.IO no inicializado" });
    }

    try {
        const newResponse = await db.response.create({
            data: {
                userId: Number(userId),
                mensajeId: Number(messageId),
                response_description: response,
            },
            include: {
                mensaje: true
            }
        });

        console.log("⚡ Emitiendo mensaje vía socket.io:", newResponse);
        res.socket.server.io.emit("newResponse", newResponse);

        return res.status(201).json(newResponse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear respuesta" });
    }
}
