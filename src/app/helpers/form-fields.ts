// Nombres de campos de formulario
export const FORM_FIELDS = {
    // Formulario de contacto
    CONTACT: {
      TITLE: 'title',
      DESCRIPTION: 'message',
    },
    
    // Formulario de respuesta
    RESPONSE: {
      MENSAJE_ID: 'mensajeId',
      DESCRIPTION: 'response',
    },
    
    // Eliminar respuesta
    DELETE_RESPONSE: {
      RESPONSE_ID: 'responseId',
    },
    
    // Cambiar estado de respuesta
    IS_READ: {
      MENSAJE_ID: 'mensajeId',
      RESPONSE_ID: 'responseId',
    },

    // Cambiar estado de mensaje
    MESSAGE_STATUS: {
      MENSAJE_ID: 'mensajeId',
    },
  } as const;
  
  // Tipos derivados de las constantes
  export type FormField = typeof FORM_FIELDS;
  
  // Helper para obtener los valores de los campos
  type ValueOf<T> = T[keyof T];
  export type FormFieldValue = ValueOf<{
    [K in keyof FormField]: ValueOf<FormField[K]>;
  }>;