/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `blog_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "blog_user" ADD COLUMN     "google_id" INTEGER,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "contact" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "blog_user_google_id_key" ON "blog_user"("google_id");
