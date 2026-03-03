-- Rename legacy "name" into "firstName" and add a dedicated "lastName" column.
ALTER TABLE "users" RENAME COLUMN "name" TO "firstName";
ALTER TABLE "users" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';
