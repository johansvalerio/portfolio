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

    const { messageId, status } = req.body;

    if (!res.socket.server.io) {
        console.log("❌ Socket.IO aún no inicializado");
        return res.status(500).json({ error: "Socket.IO no inicializado" });
    }

    try {
        const patchStatus = await db.mensaje.update({
            where: { mensaje_id: messageId },
            data: { mensaje_status: status },
          });
      

        console.log("⚡ Emitiendo mensaje vía socket.io:", patchStatus);
        res.socket.server.io.emit("patchStatus", patchStatus);

        return res.status(201).json(patchStatus);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al actualizar el estado de la idea" });
    }
}