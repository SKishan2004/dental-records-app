-- CreateTable
CREATE TABLE "ProstheticRecord" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "removableKennedy" TEXT NOT NULL,
    "removableMaterials" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "removableTeeth" TEXT NOT NULL,
    "fixedMaterial" TEXT NOT NULL,
    "fixedTeeth" TEXT NOT NULL,
    "implantType" TEXT NOT NULL,
    "implantMaterial" TEXT NOT NULL,
    "completeJaw" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "completeSupport" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "completeMaterial" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "others" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "studyCast" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "radiographs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recordDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProstheticRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrthodonticRecord" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    "angleClass" TEXT NOT NULL,
    "overjet" INTEGER NOT NULL,
    "overbite" INTEGER NOT NULL,
    "crossbite" TEXT NOT NULL,
    "spacing" TEXT NOT NULL,
    "crowding" TEXT NOT NULL,
    "others" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "models" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "radiographs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrthodonticRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftTissueFinding" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    "lesionType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "symptoms" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoftTissueFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadiographicRecord" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    "radiographType" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RadiographicRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiopsyCytologyRecord" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "procedure" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "reportFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiopsyCytologyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowingVisit" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "nextAppointment" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowingVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProstheticRecord" ADD CONSTRAINT "ProstheticRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrthodonticRecord" ADD CONSTRAINT "OrthodonticRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftTissueFinding" ADD CONSTRAINT "SoftTissueFinding_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadiographicRecord" ADD CONSTRAINT "RadiographicRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiopsyCytologyRecord" ADD CONSTRAINT "BiopsyCytologyRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowingVisit" ADD CONSTRAINT "FollowingVisit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
