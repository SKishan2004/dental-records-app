/*
  Warnings:

  - You are about to drop the column `angleClass` on the `OrthodonticRecord` table. All the data in the column will be lost.
  - You are about to drop the column `crowding` on the `OrthodonticRecord` table. All the data in the column will be lost.
  - You are about to drop the column `models` on the `OrthodonticRecord` table. All the data in the column will be lost.
  - You are about to drop the column `others` on the `OrthodonticRecord` table. All the data in the column will be lost.
  - You are about to drop the column `overbite` on the `OrthodonticRecord` table. All the data in the column will be lost.
  - You are about to drop the column `overjet` on the `OrthodonticRecord` table. All the data in the column will be lost.
  - You are about to drop the column `spacing` on the `OrthodonticRecord` table. All the data in the column will be lost.
  - The `crossbite` column on the `OrthodonticRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OrthodonticRecord" DROP COLUMN "angleClass",
DROP COLUMN "crowding",
DROP COLUMN "models",
DROP COLUMN "others",
DROP COLUMN "overbite",
DROP COLUMN "overjet",
DROP COLUMN "spacing",
ADD COLUMN     "archShape" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "archWireTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "bracketMaterials" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "crossbiteDesc" TEXT,
ADD COLUMN     "deepBite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fixedAppliances" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "midlineDeviation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openBite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "othersDesc" TEXT,
ADD COLUMN     "removableAppliance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "removableApplianceDesc" TEXT,
ADD COLUMN     "screwsDesc" TEXT,
ADD COLUMN     "studyCasts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "typeOfOcclusion" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "crossbite",
ADD COLUMN     "crossbite" BOOLEAN NOT NULL DEFAULT false;
