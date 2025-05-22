/*
  Warnings:

  - You are about to drop the column `diagnosis` on the `BiopsyCytologyRecord` table. All the data in the column will be lost.
  - You are about to drop the column `procedure` on the `BiopsyCytologyRecord` table. All the data in the column will be lost.
  - You are about to drop the column `reportFile` on the `BiopsyCytologyRecord` table. All the data in the column will be lost.
  - You are about to drop the column `site` on the `BiopsyCytologyRecord` table. All the data in the column will be lost.
  - You are about to drop the column `nextAppointment` on the `FollowingVisit` table. All the data in the column will be lost.
  - Added the required column `biopsyRecord` to the `BiopsyCytologyRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cytologyRecord` to the `BiopsyCytologyRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BiopsyCytologyRecord" DROP COLUMN "diagnosis",
DROP COLUMN "procedure",
DROP COLUMN "reportFile",
DROP COLUMN "site",
ADD COLUMN     "biopsyRecord" TEXT NOT NULL,
ADD COLUMN     "cytologyRecord" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FollowingVisit" DROP COLUMN "nextAppointment",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "radiographs" TEXT[] DEFAULT ARRAY[]::TEXT[];
