-- Data (opcional) de cada viagem.
ALTER TABLE "VisitedCountry" ADD COLUMN "visitedAt" DATE;

-- Os países das Américas eram salvos como "Americas", que não entra nas
-- estatísticas (que usam "South America" e "North America"). América Central
-- e Caribe contam como América do Norte.
UPDATE "VisitedCountry" SET "continent" = CASE
  WHEN "cca2" IN ('AR','BO','BR','CL','CO','EC','FK','GF','GY','PE','PY','SR','UY','VE') THEN 'South America'
  ELSE 'North America' END
WHERE "continent" = 'Americas';

UPDATE "Wishlist" SET "continent" = CASE
  WHEN "cca2" IN ('AR','BO','BR','CL','CO','EC','FK','GF','GY','PE','PY','SR','UY','VE') THEN 'South America'
  ELSE 'North America' END
WHERE "continent" = 'Americas';

UPDATE "VisitedCountry" SET "continent" = 'Antarctica' WHERE "continent" = 'Antarctic';
UPDATE "Wishlist" SET "continent" = 'Antarctica' WHERE "continent" = 'Antarctic';
