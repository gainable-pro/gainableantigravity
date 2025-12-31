-- Ajout des champs pour l'adresse d'intervention séparée
ALTER TABLE "Expert" ADD COLUMN "adresse_indep" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Expert" ADD COLUMN "adresse_inter" TEXT;
ALTER TABLE "Expert" ADD COLUMN "ville_inter" TEXT;
ALTER TABLE "Expert" ADD COLUMN "cp_inter" TEXT;
