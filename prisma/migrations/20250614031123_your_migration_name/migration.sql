-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "data" JSONB,
ALTER COLUMN "status" SET DEFAULT 'recommended';
