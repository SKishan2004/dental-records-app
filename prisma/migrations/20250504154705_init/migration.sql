/*
  Warnings:

  - You are about to drop the column `findings` on the `RadiographicRecord` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `RadiographicRecord` table. All the data in the column will be lost.
  - You are about to drop the column `radiographType` on the `RadiographicRecord` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `SoftTissueFinding` table. All the data in the column will be lost.
  - You are about to drop the column `lesionType` on the `SoftTissueFinding` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `SoftTissueFinding` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `SoftTissueFinding` table. All the data in the column will be lost.
  - You are about to drop the column `symptoms` on the `SoftTissueFinding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RadiographicRecord" DROP COLUMN "findings",
DROP COLUMN "images",
DROP COLUMN "radiographType",
ADD COLUMN     "biopsyRecord" TEXT,
ADD COLUMN     "biteWingImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cbctImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cytologyRecord" TEXT,
ADD COLUMN     "lateralCephImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "occlusalImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "opgImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "radiographTypes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "SoftTissueFinding" DROP COLUMN "duration",
DROP COLUMN "lesionType",
DROP COLUMN "location",
DROP COLUMN "size",
DROP COLUMN "symptoms",
ADD COLUMN     "buccalColor" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "buccalLesionDesc" TEXT,
ADD COLUMN     "buccalLesions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "buccalTexture" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "floorLesionDesc" TEXT,
ADD COLUMN     "floorLesions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gingivaColor" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gingivaLesionDesc" TEXT,
ADD COLUMN     "gingivaLesions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gingivaOthers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gingivaTexture" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "labialColor" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "labialLesionDesc" TEXT,
ADD COLUMN     "labialLesions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "labialTexture" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "otherFindings" TEXT,
ADD COLUMN     "palateColor" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "palateLesionDesc" TEXT,
ADD COLUMN     "palateLesions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "palateTexture" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tongueColor" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tongueLesionDesc" TEXT,
ADD COLUMN     "tongueLesions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tongueMobility" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tongueSize" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tongueTexture" TEXT[] DEFAULT ARRAY[]::TEXT[];
