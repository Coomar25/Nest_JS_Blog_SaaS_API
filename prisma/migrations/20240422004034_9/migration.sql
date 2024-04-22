-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('SUPERADMIN', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BlogPostStatus" ADD VALUE 'DELETED';
ALTER TYPE "BlogPostStatus" ADD VALUE 'ARCHIVED';

-- AlterTable
ALTER TABLE "blog_user" ADD COLUMN     "deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "role" "RoleEnum" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
