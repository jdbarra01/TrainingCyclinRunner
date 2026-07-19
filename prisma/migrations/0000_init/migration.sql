-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Athlete" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sport" TEXT NOT NULL DEFAULT 'cycling',
    "ftp" INTEGER NOT NULL DEFAULT 200,
    "vo2max" INTEGER NOT NULL DEFAULT 45,
    "thresholdPace" INTEGER NOT NULL DEFAULT 300,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "hrMax" INTEGER NOT NULL,
    "hrRest" INTEGER NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'male',
    "experience" TEXT NOT NULL DEFAULT 'intermediate',
    "trainingDays" JSONB NOT NULL DEFAULT '[1,2,3,4,5,6,0]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingObjective" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "targetEvent" TEXT,
    "notes" TEXT,
    "weeklyFrequency" INTEGER NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "objectiveIds" JSONB NOT NULL DEFAULT '[]',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "phase" TEXT NOT NULL DEFAULT 'base',
    "weeks" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "tss" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "normalizedPower" INTEGER NOT NULL DEFAULT 0,
    "intensityFactor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "intervals" JSONB NOT NULL DEFAULT '[]',
    "warmup" INTEGER NOT NULL DEFAULT 10,
    "cooldown" INTEGER NOT NULL DEFAULT 10,
    "scheduledDate" TIMESTAMP(3),
    "objectiveId" TEXT,
    "planId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrainingObjective" ADD CONSTRAINT "TrainingObjective_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

