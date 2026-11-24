-- CreateEnum
CREATE TYPE "papel_sistema" AS ENUM ('USUARIO', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "papel" "papel_sistema" NOT NULL DEFAULT 'USUARIO';
