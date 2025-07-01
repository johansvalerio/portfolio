'use server'

import db from '@/lib/db'
//import { revalidatePath } from 'next/cache'
import authSession from '@/app/providers/auth-session';


interface FormState {
  error?: string;
  success?: string;
}

export async function createContact(prevState: FormState | undefined, formData: FormData) {

  try {
    const title = formData.get('title') as string
    const message = formData.get('message') as string

    // Validación básica
    if (!title || !message) {
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

export async function getContactMessages() {
  return await db.mensaje.findMany({
    include: {
      user: true,
      response: true
    },
    orderBy: {
      mensaje_created_on: 'desc',
    },
  })
}

export async function patchToSeen(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
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

    if (messageSent?.mensaje_status === 'Enviado') {
      // Actualizar el mensaje a "En revisión"
      const newStatus = await db.mensaje.update({
        where: { mensaje_id },
        data: { mensaje_status: 'En revisión' },
      })
      return { success: 'Estado de la idea actualizado {' + newStatus.mensaje_status + '}' }
    } else {
      // Actualizar el mensaje a "Enviado"
      const newStatus = await db.mensaje.update({
        where: { mensaje_id },
        data: { mensaje_status: 'Enviado' },
      })
      return { success: 'Estado de la idea actualizado {' + newStatus.mensaje_status + '}' }
    }

  } catch (error) {
    console.error('Error al actualizar el estado de la idea:', error)
    return { error: 'Error al actualizar la idea' }
  }

}