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
        const deleteResponse = await db.response.delete({
            where: {
                response_id: responseId,
            },
        });

        console.log("⚡ Emitiendo respuesta eliminada vía socket.io:", deleteResponse);
        res.socket.server.io.emit("deleteResponse", deleteResponse);

        return res.status(201).json(deleteResponse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar respuesta" });
    }
}
