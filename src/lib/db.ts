import { Pool, PoolConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

// Configuración de WebSocket para Neon DB
neonConfig.webSocketConstructor = ws;

const isProduction = process.env.NODE_ENV === 'production';

const createPrismaClient = () => {
  if (isProduction) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('❌ DATABASE_URL is required in production environment');
    }
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as unknown as PoolConfig);
    
    console.log('🔌 Using Neon DB in production mode');
    return new PrismaClient({
      adapter,
      log: ['error', 'warn'],
    });
  } else {
    console.log('💻 Using local database in development mode');
    return new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });
  }
};

export const db = createPrismaClient();