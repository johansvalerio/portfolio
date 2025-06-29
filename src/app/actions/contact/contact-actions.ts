'use server'

import  db  from '@/lib/db'
// import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/authOptions"

interface FormState {
    error?: string;
    success?: string;
  }

export async function createContact(prevState: FormState | undefined, formData: FormData) {

  try {
    const message = formData.get('message') as string

    // Validación básica
    if (!message) {
      return { error: 'Todos los campos son requeridos' }
    }
    console.log(message)

    const session = await getServerSession(authOptions)
    if (!session) {
      return { error: 'No se encontró una sesión' }
    }

    // Obtener el id del usuario mediante la sesión
    const userId = session.user.id

    // Guardar en la base de datos
    await db.mensaje.create({
      data: {
        userId: Number(userId),
        mensaje_description: message,
      },
    })

    // Revalidar la ruta si es necesario
    // revalidatePath('/')
    
    return { success: 'Idea enviada correctamente' }
  } catch (error) {
    console.error('Error al enviar la idea:', error)
    return { error: 'Error al enviar la idea' }
  }
}