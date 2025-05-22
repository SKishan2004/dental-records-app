-- CreateTable
CREATE TABLE "EndodonticRecord" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    "fracture" TEXT,
    "discoloured" TEXT,
    "decayedClasses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "amalgam" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "gic" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "composite" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rctCrown" TEXT,
    "rctWithout" TEXT,
    "others" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "radiographs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EndodonticRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OralExamination" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    "dentition" TEXT NOT NULL,
    "teethPresent" INTEGER NOT NULL,
    "missingCongenital" INTEGER NOT NULL,
    "missingExtracted" INTEGER NOT NULL,
    "teethColor" TEXT NOT NULL,
    "abnormalities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "periodontal" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "wasting" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "oralImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "radiographs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OralExamination_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EndodonticRecord" ADD CONSTRAINT "EndodonticRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OralExamination" ADD CONSTRAINT "OralExamination_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
