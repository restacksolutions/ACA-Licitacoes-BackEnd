/*
  Warnings:

  - You are about to drop the column `file_key` on the `CompanyDocument` table. All the data in the column will be lost.
  - Added the required column `file_data` to the `CompanyDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_mime` to the `CompanyDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_name` to the `CompanyDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_sha256` to the `CompanyDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_size` to the `CompanyDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyDocument" DROP COLUMN "file_key",
ADD COLUMN     "file_data" BYTEA NOT NULL,
ADD COLUMN     "file_mime" TEXT NOT NULL,
ADD COLUMN     "file_name" TEXT NOT NULL,
ADD COLUMN     "file_sha256" TEXT NOT NULL,
ADD COLUMN     "file_size" INTEGER NOT NULL;
