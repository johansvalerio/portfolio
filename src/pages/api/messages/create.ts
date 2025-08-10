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

    const { title, message, userId } = req.body;

    if (!res.socket.server.io) {
        console.log("❌ Socket.IO aún no inicializado");
        return res.status(500).json({ error: "Socket.IO no inicializado" });
    }

    try {
        const newMessage = await db.mensaje.create({
            data: {
                userId,
                mensaje_title: title,
                mensaje_description: message,
            },
            include: {
                user: true,
                response: true
            },
        });

        console.log("⚡ Emitiendo mensaje vía socket.io:", newMessage);
        res.socket.server.io.to(`user-${newMessage.userId}`).emit("newMessage", newMessage);
        res.socket.server.io.to("admin-room").emit("newMessage", newMessage);

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear mensaje" });
    }
}
