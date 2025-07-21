// src/pages/api/socket/io.ts
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/lib/socket';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const httpServer: NetServer = res.socket.server;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket/io',
    });


    // Guardar en res para evitar inicializar más veces
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log('✅ Cliente conectado:', socket.id);

      socket.on("newMessage", (msg) => {
        console.log("📥 Servidor recibió 'newMessage':", msg);
        socket.broadcast.emit("newMessage", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ Cliente desconectado:", socket.id);
      });
    });

  } else {
    console.log("🔁 socket.io ya estaba iniciado");
  }

  res.end();
};

export default ioHandler;
