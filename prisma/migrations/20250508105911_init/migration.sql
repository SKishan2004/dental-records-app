/*
  Warnings:

  - The `dentition` column on the `OralExamination` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `teethColor` column on the `OralExamination` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OralExamination" DROP COLUMN "dentition",
ADD COLUMN     "dentition" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "teethColor",
ADD COLUMN     "teethColor" TEXT[] DEFAULT ARRAY[]::TEXT[];
