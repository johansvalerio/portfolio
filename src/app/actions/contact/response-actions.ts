"use server"
import { db } from '@/lib/db'
import authSession from '@/app/providers/auth-session';
import { deleteResponseSchema } from '@/app/helpers/validations/deleteResponseSchema';
import { FORM_FIELDS } from '@/app/helpers/form-fields';
import { FormState } from '@/types/formState';
import { createResponseSchema } from '@/app/helpers/validations/createResponseSchema';



export async function getResponses(messageId: number) {

    const session = await authSession()

    if (!session) {
        return [];
    }

    try {
        const responses = await db.response.findMany({
            where: {
                mensajeId: messageId,
            },
            orderBy: {
                response_created_on: 'desc',
            },
        })
        return responses;
    } catch (error) {
        console.error('Error al obtener las respuestas:', error);
        return [];
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
  
     // Llamar al API Route que crea el mensaje y emite el evento
     const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/responses/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response, userId: Number(userId), messageId: Number(mensajeId) }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        return { error: errorData.error || "Error al crear respuesta" };
      } 
  
      // Si quieres, puedes obtener el mensaje creado
      const newResponse = await res.json();
      console.log('Nueva respuesta creada:', newResponse);

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
  
      return { success: 'Respuesta eliminada correctamente' }
    } catch (error) {
      console.error('Error al eliminar la respuesta:', error)
      return { error: 'Error al eliminar la respuesta' }
    }
  }
