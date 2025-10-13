'use server'
import { db } from '@/lib/db'
import authSession from '@/app/providers/auth-session';
import { FormState } from '@/types/formState';
import { createMessageSchema } from '@/app/helpers/validations/createMessageSchema';
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

    // Llamar al API Route que crea el mensaje y emite el evento
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/messages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, message, userId: Number(userId) }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Error al crear mensaje" };
    }

    // Si quieres, puedes obtener el mensaje creado
    const newMessage = await response.json();
    console.log('Nuevo mensaje creado:', newMessage);

    return { success: 'Idea enviada correctamente' }
  } catch (error) {
    console.error('Error al enviar la idea:', error)
    return { error: 'Error al enviar la idea' }
  }
}

export async function getMessages() {
  const session = await authSession()

  if (!session) {
    return [];
  }

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

    if (session.user.role !== 1) {
      return messages.filter(
        (msg) => msg.user?.user_id === Number(session?.user.id)
      );
    }

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
      mensajeId: Number(formData
        .get(FORM_FIELDS.MESSAGE_STATUS.MENSAJE_ID)),
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

    // Llamar al API Route que crea el mensaje y emite el evento
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/messages/patch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageId: mensajeId, status: nextStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Error al crear mensaje" };
    }

    // get status updated
    const newStatus = await response.json();
    console.log('Nuevo status actualizado:', newStatus);

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
      console.log("Admin, actualizando mensaje");
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
      console.log("Actualizando mensaje con ID:", mensajeId);

      // Llamar al API Route que actualiza el estado del mensaje
      const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/messages/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensajeId: mensajeId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.error || "Error al actualizar mensaje" };
      }

      // Si quieres, puedes obtener el statys actualizado
      const updatedMessages = await response.json();
      console.log('Nuevo mensaje actualizado:', updatedMessages);

      return { success: 'Estado de la idea actualizado {' + updatedMessages.isRead + '}' };
    } else {
      console.log("Usuario, actualizando respuestas");
      // Obtener todos los response_id enviados (pueden ser varios)
      const rawData = {
        responseIds: formData.getAll(FORM_FIELDS.IS_READ.RESPONSE_ID).map(Number)
      }
      const result = patchMessageStatusSchema.safeParse(rawData)

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return {
          error: errors.responseIds?.[0] || "Datos inválidos",
        };
      }

      const { responseIds } = result.data;
      console.log("Actualizando respuestas con IDs:", responseIds);
      // Llamar al API Route que actualiza el estado del mensaje
      const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/messages/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responseIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.error || "Error al actualizar mensaje" };
      }

      // Si quieres, puedes obtener el statys actualizado
      const updatedResponses = await response.json();
      console.log('Nuevo mensaje actualizado:', updatedResponses);

      return { success: 'Estado de la idea actualizado {' + updatedResponses.isRead + '}' };
    }

  } catch (error) {
    console.error('Error al ver la idea:', error)
    return { error: 'Eror al ver la idea' }
  }

}
