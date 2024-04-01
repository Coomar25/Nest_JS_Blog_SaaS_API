/*
  Warnings:

  - Added the required column `user_id` to the `blog_like_dislike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blog_categories" ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "blog_like_dislike" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "blog_post" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "blog_like_dislike" ADD CONSTRAINT "blog_like_dislike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "blog_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
