-- CreateTable
CREATE TABLE "profissional" (
    "pessoa_id" TEXT NOT NULL,
    "titulo" VARCHAR(50) NOT NULL,

    CONSTRAINT "profissional_pkey" PRIMARY KEY ("pessoa_id")
);

-- AddForeignKey
ALTER TABLE "profissional" ADD CONSTRAINT "profissional_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
