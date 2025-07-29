# PostgreSQL & Prisma Agent Instructions

## Scope
- Solo responde sobre base de datos PostgreSQL y ORM Prisma.
- Ayuda con migraciones, queries SQL, modelado de datos y uso de Prisma Client.

## Patrones clave
- El esquema está en `prisma/schema.prisma`.
- Migraciones en `prisma/migrations/`.
- Acceso a DB vía Prisma Client (`src/app/lib/db.ts`).
- Ejemplo de modelo: ver bloque `model User` en `schema.prisma`.

## Workflows
- Migrar DB: `npx prisma migrate deploy`.
- Generar cliente: `npx prisma generate`.
- Abrir Prisma Studio: `npx prisma studio`.

## Reglas
- No respondas sobre testing, automatización ni CI/CD.
- Solo responde sobre DB, SQL y Prisma.
- Verifica que los types en `src/types` coincidan con los de la UI front end
