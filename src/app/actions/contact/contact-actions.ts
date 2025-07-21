'use server'
import {db} from '@/lib/db'
import authSession from '@/app/providers/auth-session';
import { revalidatePath } from 'next/cache';
import { FormState } from '@/types/formState';
import { createMessageSchema } from '@/app/helpers/validations/createMessageSchema';
import { createResponseSchema } from '@/app/helpers/validations/createResponseSchema';
import { deleteResponseSchema } from '@/app/helpers/validations/deleteResponseSchema';
import { patchMessageStatusSchema } from '@/app/helpers/validations/patchMessageStatusSchema';
import { FORM_FIELDS } from '@/app/helpers/form-fields';

export async function createContact(prevState: FormState | undefined, formData: FormData) {

  try {
    const rawData = {
      title: formData.get(FORM_FIELDS.CONTACT.TITLE),
      message: formData.get(FORM_FIELDS.CONTACT.DESCRIPTION),
    }

    const result = createMessageSchema.safeParse(rawData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return {
        error: errors.title?.[0] || errors.message?.[0] || "Datos inválidos",
      };
    }

    const { title, message } = result.data;

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
     revalidatePath('/')

    return { success: 'Idea enviada correctamente' }
  } catch (error) {
    console.error('Error al enviar la idea:', error)
    return { error: 'Error al enviar la idea' }
  }
}

export async function getMessages() {
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
  //iterar entre estados, buscar el valor siguiente
const statusMap: Record<string, string> = {
  'Enviado': 'En revisión',
  'En revisión': 'Visto bueno',
  'Visto bueno': 'Enviado', // o el estado que corresponda como "default"
};

  try {
    const session = await authSession()
    if (!session) {
      return { error: 'No se encontró una sesión' }
    }

    if (session.user.role !== 1) {
      return { error: 'No tienes permiso para realizar esta acción' }
    }

    // Obtener el mensaje_id del formulario
    const rawData = {
      mensajeId: formData.get(FORM_FIELDS.MESSAGE_STATUS.MENSAJE_ID),
    }

    // Validar el mensaje_id
    const result = patchMessageStatusSchema.safeParse(rawData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return {
        error: errors.mensajeId?.[0] || "Datos inválidos",
      };
    }

    const { mensajeId } = result.data;

    const messageSent = await db.mensaje.findFirst({
      where: {
        mensaje_id: mensajeId,
      }
    })

    const nextStatus = statusMap[messageSent?.mensaje_status ?? ''] || 'Enviado';

    const newStatus = await db.mensaje.update({
      where: { mensaje_id: mensajeId },
      data: { mensaje_status: nextStatus },
    });

    revalidatePath('/misIdeas')
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
      const rawData = {
        mensajeId: formData.get(FORM_FIELDS.IS_READ.MENSAJE_ID),
      }

      const result = patchMessageStatusSchema.safeParse(rawData)

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return {
          error: errors.mensajeId?.[0] || "Datos inválidos",
        };
      }

      const { mensajeId } = result.data;

      const messageSent = await db.mensaje.findFirst({
        where: {
          mensaje_id: mensajeId,
        }
      })

      if (messageSent?.mensaje_isRead === false) {
        // Ver el mensaje y marcar como visto
        const isRead = await db.mensaje.update({
          where: { mensaje_id: mensajeId },
          data: { mensaje_isRead: true },
        })
        revalidatePath('/misIdeas')
        return { success: 'Idea vista {' + isRead.mensaje_isRead + '}' }
      }
      revalidatePath('/misIdeas')
      return {}
    } else {
      // Obtener todos los response_id enviados (pueden ser varios)
      const rawData = {
        responseIds: formData.getAll(FORM_FIELDS.IS_READ.RESPONSE_ID).map(Number),
      }
      const result = patchMessageStatusSchema.safeParse(rawData)

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return {
          error: errors.responseIds?.[0] || "Datos inválidos",
        };
      }

      const { responseIds } = result.data;

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
      revalidatePath('/misIdeas')
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
    const rawData = {
      mensajeId: formData.get(FORM_FIELDS.RESPONSE.MENSAJE_ID),
      response: formData.get(FORM_FIELDS.RESPONSE.DESCRIPTION),
    }

    const result = createResponseSchema.safeParse(rawData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return {
        error: errors.mensajeId?.[0] || errors.response?.[0] || "Datos inválidos",
      };
    }

    const { mensajeId, response } = result.data;

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
        mensajeId: mensajeId,
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
    const rawData = {
      responseId: formData.get(FORM_FIELDS.DELETE_RESPONSE.RESPONSE_ID),
    }

    const result = deleteResponseSchema.safeParse(rawData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return {
        error: errors.responseId?.[0] || "Datos inválidos",
      };
    }

    const { responseId } = result.data;

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
        response_id: responseId
      }
    })

    console.log('Respuesta eliminada', deleteRes)

    revalidatePath('/misIdeas')
    return { success: 'Respuesta eliminada correctamente' }
  } catch (error) {
    console.error('Error al eliminar la respuesta:', error)
    return { error: 'Error al eliminar la respuesta' }
  }
}