/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `blog_post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `blog_post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `blog_post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `blog_post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('PUBLISHED', 'PENDING');

-- AlterTable
ALTER TABLE "blog_post" ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "cover_image" TEXT DEFAULT 'assets/defaults/default_image.png',
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "BlogPostStatus" NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_like_dislike" (
    "id" SERIAL NOT NULL,
    "like" BOOLEAN NOT NULL,
    "dislike" BOOLEAN NOT NULL,
    "blog_post_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_like_dislike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_comment" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "blog_id" INTEGER NOT NULL,
    "creaedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_bookmarks" (
    "id" SERIAL NOT NULL,
    "blog_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_total_viewed_post" (
    "id" SERIAL NOT NULL,
    "blog_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "isViewed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_total_viewed_post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_slug_key" ON "blog_post"("slug");

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_like_dislike" ADD CONSTRAINT "blog_like_dislike_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "blog_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "blog_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comment" ADD CONSTRAINT "blog_comment_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blog_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_bookmarks" ADD CONSTRAINT "blog_bookmarks_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blog_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_bookmarks" ADD CONSTRAINT "blog_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "blog_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_total_viewed_post" ADD CONSTRAINT "blog_total_viewed_post_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blog_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_total_viewed_post" ADD CONSTRAINT "blog_total_viewed_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "blog_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
