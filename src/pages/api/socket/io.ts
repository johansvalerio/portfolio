// src/pages/api/socket/io.ts
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/lib/socket';
import { ResponseWithUser } from '@/types/response';
import { MensajeWithUser } from '@/types/mensaje';

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

      //Escuchar nuevos mensajes y emitirlos a todos los clientes conectados
      // socket.on("newMessage", (msg) => {
      //   console.log("📥 Servidor recibió 'newMessage':", msg);
      //   socket.broadcast.emit("newMessage", msg);
      // });


      //identificar usuarios
      socket.on("identify", (userData : {id: string, role: number}) => {
        //Unir al admin a la room
        if (userData.role === 1) {
          socket.join(`admin-room}`)
        }
        //Unir al usuario a su room
        socket.join(`user-${userData.id}}`)
        console.log("✅ Usuario identificado:", userData.id);
      })

      //manejo de mensajes
      socket.on("newMessage", (msg: MensajeWithUser) => {
        console.log("📥 Servidor recibió 'newMessage':", msg);
        io.to("admin-room").emit("newMessage", msg);
        if(msg.userId){
          io.to(`user-${msg.userId}`).emit("newMessage", msg);
        }
      })

      //manejo de respuestas
      socket.on("newResponse", (res: ResponseWithUser) => {
        console.log("📥 Servidor recibió 'newResponse':", res);
        io.to("admin-room").emit("newResponse", res);
        if(res.userId){
          io.to(`user-${res.mensaje?.userId}`).emit("newResponse", res);
        }
      })

      //Escuchar desconexión de clientes
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
