-- CreateTable
CREATE TABLE "blog_subscribe_letter" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "blog_subscribe_letter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blog_subscribe_letter" ADD CONSTRAINT "blog_subscribe_letter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "blog_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
