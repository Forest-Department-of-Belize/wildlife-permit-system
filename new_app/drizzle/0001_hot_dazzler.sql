
ALTER TABLE "parrots" DROP COLUMN "has_parrot";
ALTER TABLE "parrots" ADD COLUMN "has_parrot" boolean DEFAULT false;
ALTER TABLE "users" ALTER COLUMN "last_name" DROP NOT NULL;