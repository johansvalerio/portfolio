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
    console.log('*Iniciando servidor de socket.io');

    const httpServer: NetServer = res.socket.server;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    // Guardar en res para evitar inicializar más veces
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log('✅ Cliente conectado:', socket.id);

      // Identificar usuarios
      socket.on("identify", (userData: { id: string, role: number }) => {
        try {
          // Unir al admin a la room
          if (userData.role === 1) {
            socket.join('admin-room');
            console.log(`👨‍💼 Admin ${userData.id} se unió a admin-room`);
          }
          
          // Unir al usuario a su room
          const userRoom = `user-${userData.id}`;
          socket.join(userRoom);
          console.log(`👤 Usuario ${userData.id} se unió a ${userRoom}`);
          
          // Confirmar identificación
          socket.emit('identification_success', { room: userRoom });
        } catch (error) {
          console.error('Error en identificación de socket:', error);
        }
      });

      // Manejo de mensajes
      socket.on("newMessage", (msg: MensajeWithUser) => {
        try {
          console.log("📥 Servidor recibió 'newMessage':", msg);
          // Notificar a la sala de admin
          io.to('admin-room').emit('newMessage', msg);
          
          // Notificar al usuario específico si tiene ID
          if (msg.userId) {
            io.to(`user-${msg.userId}`).emit('newMessage', msg);
          }
        } catch (error) {
          console.error('Error en newMessage:', error);
        }
      });

      //manejo patch status
      socket.on("patchStatus", (msg: MensajeWithUser) => {
        console.log("📥 Servidor recibió 'patchStatus':", msg);
        io.to("admin-room").emit("patchStatus", msg);
        if (msg.userId) {
          io.to(`user-${msg.userId}`).emit("patchStatus", msg);
        }
      })

      //manejo de lectura de mensajes
      socket.on("readMessageResponse", (msg: MensajeWithUser) => {
        console.log("📥 Servidor recibió 'readMessageResponse':", msg);
        io.to("admin-room").emit("readMessageResponse", msg);
        if (msg.userId) {
          io.to(`user-${msg.userId}`).emit("readMessageResponse", msg);
        }
      })
      //manejo de respuestas
      socket.on("newResponse", (res: ResponseWithUser) => {
        console.log("📥 Servidor recibió 'newResponse':", res);
        io.to("admin-room").emit("newResponse", res);
        if (res.userId) {
          io.to(`user-${res.mensaje?.userId}`).emit("newResponse", res);
        }
      })

      //manejo de delete response
      socket.on("deleteResponse", (res: ResponseWithUser) => {
        console.log("📥 Servidor recibió 'deleteResponse':", res);
        io.to("admin-room").emit("deleteResponse", res);
        if (res.userId) {
          io.to(`user-${res.mensaje?.userId}`)
            .emit("deleteResponse", res);
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
