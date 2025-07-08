import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig, type PoolConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configuración de WebSocket para Neon DB
neonConfig.webSocketConstructor = ws;

declare global {
  var prisma: PrismaClient | undefined;
}

// Validar variables de entorno
const requiredEnvVars = ['NODE_ENV', 'DATABASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production';

// Crear el cliente de Prisma con la configuración adecuada según el entorno
const createPrismaClient = (): PrismaClient => {
  try {
    console.log('🔌 Creating Prisma client...');
    console.log(`🌐 Environment: ${isProduction ? 'Production' : 'Development'}`);
    
    if (isProduction) {
      const connectionString = process.env.DATABASE_URL;
      console.log('🔗 Database URL:', connectionString ? '✅ Set' : '❌ Not set');
      
      if (!connectionString) {
        throw new Error('DATABASE_URL is not defined in environment variables');
      }

      console.log('🌐 Creating connection pool...');
      const poolConfig: PoolConfig = {
        connectionString,
        ssl: {
          rejectUnauthorized: false
        }
      };
      const pool = new Pool(poolConfig);
      
      console.log('🔌 Creating PrismaNeon adapter...');
      const adapter = new PrismaNeon(pool as unknown as PoolConfig);
      
      console.log('🚀 Initializing Prisma client...');
      const prisma = new PrismaClient({
        adapter,
        log: [
          { level: 'warn', emit: 'event' },
          { level: 'error', emit: 'event' },
          { level: 'query', emit: 'event' }
        ],
      });
      
      // Add event listeners for better debugging
      prisma.$on('warn', (e) => {
        console.warn('Prisma Warning:', e);
      });
      
      prisma.$on('error', (e) => {
        console.error('Prisma Error:', e);
      });
      
      prisma.$on('query', (e) => {
        console.log('Query:', e.query);
        console.log('Params:', e.params);
        console.log('Duration:', e.duration, 'ms');
      });
      
      return prisma;
    } else {
      // Configuración para desarrollo (local)
      console.log('💻 Using local database in development mode');
      const prisma = new PrismaClient({
        log: [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'stdout' },
          { level: 'warn', emit: 'stdout' },
        ],
      });
      
      // Add event listeners for better debugging
      prisma.$on('query', (e) => {
        console.log('Query:', e.query);
        console.log('Params:', e.params);
        console.log('Duration:', e.duration, 'ms');
      });
      
      return prisma;
    }
  } catch (error) {
    console.error('❌ Error creating Prisma client:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n') + '...'
      });
    }
    throw error;
  }
};

// Implementación del patrón singleton
let prisma: PrismaClient;

if (isProduction) {
  prisma = createPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;

  // Manejo de cierre en desarrollo
  process.on('beforeExit', async () => {
    try {
      if (global.prisma) {
        await global.prisma.$disconnect();
        console.log('✅ Prisma client disconnected');
      }
    } catch (error) {
      console.error('❌ Error disconnecting Prisma client:', error);
    }
  });

  // Health check al iniciar
  prisma.$connect()
    .then(() => console.log('✅ Database connection established'))
    .catch((error: Error) => console.error('❌ Database connection error:', error));
}

// Exportar la instancia de Prisma
export default prisma;