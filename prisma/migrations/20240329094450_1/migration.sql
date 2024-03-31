-- CreateTable
CREATE TABLE "blog_user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "user_profile" TEXT DEFAULT 'assets/defaults/default_image.png',
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "postal" TEXT DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "blog_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_user_email_key" ON "blog_user"("email");

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "blog_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
