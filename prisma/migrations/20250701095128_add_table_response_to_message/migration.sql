-- CreateTable
CREATE TABLE "Response" (
    "response_id" SERIAL NOT NULL,
    "response_description" TEXT NOT NULL,
    "response_created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mensajeId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("response_id")
);

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_mensajeId_fkey" FOREIGN KEY ("mensajeId") REFERENCES "Mensaje"("mensaje_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
