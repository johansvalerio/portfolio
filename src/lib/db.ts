// src/lib/db.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;


const isProduction = process.env.NODE_ENV === 'production';

// Extiende el tipo global para permitir la reutilización de PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
  var neonSql: ReturnType<typeof neon> | undefined;
}

// Crear PrismaClient solo si no existe
const prismaClient = global.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
  ...(isProduction && {
    datasourceUrl: process.env.DATABASE_URL,
  }),
});

// Solo en desarrollo, guardamos la instancia en global para evitar recargas múltiples
if (!isProduction) global.prisma = prismaClient;

// Neon SQL directo (puede que no lo uses, pero lo incluimos)
const sqlInstance = global.neonSql ?? neon(process.env.DATABASE_URL!);
if (!isProduction) global.neonSql = sqlInstance;

// Exportar
export const db = prismaClient;
export const sql = sqlInstance;
