/*
  Warnings:

  - Added the required column `mensaje_title` to the `Mensaje` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mensaje" ADD COLUMN     "mensaje_title" TEXT NOT NULL;
