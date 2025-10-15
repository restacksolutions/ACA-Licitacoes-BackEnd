/*
  Warnings:

  - You are about to drop the column `file_data` on the `CompanyDocument` table. All the data in the column will be lost.
  - You are about to drop the column `file_mime` on the `CompanyDocument` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `CompanyDocument` table. All the data in the column will be lost.
  - You are about to drop the column `file_sha256` on the `CompanyDocument` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `CompanyDocument` table. All the data in the column will be lost.
  - Added the required column `file_key` to the `CompanyDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyDocument" DROP COLUMN "file_data",
DROP COLUMN "file_mime",
DROP COLUMN "file_name",
DROP COLUMN "file_sha256",
DROP COLUMN "file_size",
ADD COLUMN     "file_key" TEXT NOT NULL;
