// src/lib/db.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Configuración de WebSocket para Neon DB
neonConfig.webSocketConstructor = ws;

const isProduction = process.env.NODE_ENV === 'production';

const createPrismaClient = () => {
  if (isProduction) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('❌ DATABASE_URL is required in production environment');
    }
    
    // Para consultas SQL directas
    const sql = neon(connectionString);
    console.log(sql)
    
    // Para Prisma
    return new PrismaClient({
      datasourceUrl: connectionString,
      log: ['error', 'warn'],
    });
  } else {
    console.log('💻 Using local database in development mode');
    return new PrismaClient({
      log: ['error', 'warn'],
    });
  }
};

export const db = createPrismaClient();
export const sql = neon(process.env.DATABASE_URL!);