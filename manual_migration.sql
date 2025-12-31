-- ALERTE : À exécuter dans le SQL Editor de Supabase pour contourner l'erreur P1001

ALTER TABLE "Expert" ADD COLUMN "is_labeled" BOOLEAN NOT NULL DEFAULT false;
