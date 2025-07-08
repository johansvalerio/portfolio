'use server'
import {db} from '@/lib/db'
import authSession from '@/app/providers/auth-session';
import { revalidatePath } from 'next/cache';
import { MensajeWithUser } from '@/app/types/mensaje';
interface FormState {
  error?: string;
  success?: string;
}

//iterar entre estados, buscar el valor siguiente
const statusMap: Record<string, string> = {
  'Enviado': 'En revisión',
  'En revisión': 'Visto bueno',
  'Visto bueno': 'Enviado', // o el estado que corresponda como "default"
};

export async function createContact(prevState: FormState | undefined, formData: FormData) {

  try {
    const title = formData.get('title') as string
    const message = formData.get('message') as string

    // Validación básica
    if (!title || !message) {
      return { error: 'Todos los campos son requeridos' }
    }
    console.log(title)
    console.log(message)

    const session = await authSession()
    if (!session) {
      return { error: 'No se encontró una sesión' }
    }

    // Obtener el id del usuario mediante la sesión
    const userId = session.user.id

    // Guardar en la base de datos
    const newMessage = await db.mensaje.create({
      data: {
        userId: Number(userId),
        mensaje_title: title,
        mensaje_description: message,
      },
    })

    console.log('Nueva idea creada:', newMessage)

    // Revalidar la ruta si es necesario
    // revalidatePath('/')

    return { success: 'Idea enviada correctamente' }
  } catch (error) {
    console.error('Error al enviar la idea:', error)
    return { error: 'Error al enviar la idea' }
  }
}

export async function getContactMessages(): Promise<MensajeWithUser[]> {
  try {
    const messages = await db.mensaje.findMany({
      include: {
        user: true,
        response: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        mensaje_created_on: 'desc',
      },
    });
    
    return messages;
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    return [];
  }
}

export async function patchStatus(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  try {
    const session = await authSession()
    if (!session) {
      return { error: 'No se encontró una sesión' }
    }

    if (session.user.role !== 1) {
      return { error: 'No tienes permiso para realizar esta acción' }
    }

    // Obtener el mensaje_id del formulario
    const mensaje_id = Number(formData.get('mensaje_id'))

    const messageSent = await db.mensaje.findFirst({
      where: {
        mensaje_id: mensaje_id,
      }
    })

    const nextStatus = statusMap[messageSent?.mensaje_status ?? ''] || 'Enviado';

    const newStatus = await db.mensaje.update({
      where: { mensaje_id },
      data: { mensaje_status: nextStatus },
    });

    return { success: 'Estado de la idea actualizado {' + newStatus.mensaje_status + '}' }

  } catch (error) {
    console.error('Error al actualizar el estado de la idea:', error)
    return { error: 'Error al actualizar la idea' }
  }

}

export async function readMessage(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  try {
    const session = await authSession()
    if (!session) {
      return { error: 'No se encontró una sesión' }
    }

    if (session.user.role === 1) {
      // Obtener el mensaje_id del formulario
      const mensaje_id = Number(formData.get('mensaje_id'))
      if (!mensaje_id) return { error: 'No se encontró el mensaje' }

      const messageSent = await db.mensaje.findFirst({
        where: {
          mensaje_id: mensaje_id,
        }
      })

      if (messageSent?.mensaje_isRead === false) {
        // Ver el mensaje y marcar como visto
        const isRead = await db.mensaje.update({
          where: { mensaje_id },
          data: { mensaje_isRead: true },
        })
        return { success: 'Idea vista {' + isRead.mensaje_isRead + '}' }
      }
      return {}
    } else {
      // Obtener todos los response_id enviados (pueden ser varios)
      const responseIds = formData.getAll('response_id').map(Number);

      if (responseIds.length < 0) return { error: 'No se encontraron las respuestas' }

      const responses = await db.response.findMany({
        where: { response_id: { in: responseIds } }
      })

      const responseIsRead = responses.filter((res) => res.response_isRead)

      if (!responseIsRead) {
        return {}
      } else {
        const update_isRead = await db.response.updateMany({
          where: { response_id: { in: responseIds } },
          data: { response_isRead: true }
        })
        console.log(update_isRead)
      }
      return { success: 'Respuestas leídas correctamente' }
    }

  } catch (error) {
    console.error('Error al ver la idea:', error)
    return { error: 'Eror al ver la idea' }
  }

}

//Lógica para las respuestas, mover a otro archivo recordatorio
export async function createResponse(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  try {
    const message = formData.get('mensaje_id') as string
    const response = formData.get('response_description') as string

    console.log(message)
    console.log(response)

    // Validación básica
    if (!response) {
      return { error: 'Todos los campos son requeridos' }
    }
    if (!message) {
      return { error: 'Todos los campos son requeridos' }
    }
    console.log(message)

    const session = await authSession()
    if (!session) {
      return { error: 'No se encontró una sesión' }
    }

    if (session.user.role !== 1) {
      return { error: 'No tienes permiso para realizar esta acción' }
    }

    // Obtener el id del usuario mediante la sesión
    const userId = session.user.id

    // Guardar en la base de datos
    const newResponse = await db.response.create({
      data: {
        userId: Number(userId),
        mensajeId: Number(message),
        response_description: response,
      },
    })

    console.log('Nueva respuesta creada:', newResponse)

    revalidatePath('/misIdeas')


    return { success: 'Idea respondida correctamente' }
  } catch (error) {
    console.error('Error al responder la idea:', error)
    return { error: 'Error al responder la idea' }
  }
}

export async function deleteResponse(prevState: FormState | undefined, formData: FormData) {

  try {
    const responseId = Number(formData.get("response_id"))

    // Validación básica
    if (!responseId) {
      return { error: 'Todos los campos son requeridos' }
    }
    console.log(responseId)

    const session = await authSession()
    if (!session) {
      return { error: 'No se encontró una sesión' }
    }

    if (session.user.role !== 1) {
      return { error: 'No tienes permiso para realizar esta acción' }
    }

    // Remover respuesta de la base de datos
    const deleteRes = await db.response.delete({
      where: {
        response_id: Number(responseId)
      }
    })

    console.log('Respuesta eliminada', deleteRes)

    return { success: 'Respuesta eliminada correctamente' }
  } catch (error) {
    console.error('Error al eliminar la respuesta:', error)
    return { error: 'Error al eliminar la respuesta' }
  }
}