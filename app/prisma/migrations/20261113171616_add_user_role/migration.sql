-- CreateEnum
CREATE TYPE "PapelSistema" AS ENUM ('USUARIO', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "papel" "PapelSistema" NOT NULL DEFAULT 'USUARIO';
