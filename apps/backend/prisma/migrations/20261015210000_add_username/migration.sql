-- Adiciona nome de usuário único. Contas existentes recebem um nome gerado a
-- partir do email (parte antes do @, só [a-z0-9_.], 3–20 caracteres); nomes
-- repetidos ganham um sufixo numérico.
ALTER TABLE "User" ADD COLUMN "username" TEXT;

WITH base AS (
  SELECT
    "id",
    "createdAt",
    LEFT(RPAD("clean", GREATEST(LENGTH("clean"), 3), '_'), 16) AS "name"
  FROM (
    SELECT
      "id",
      "createdAt",
      REGEXP_REPLACE(LOWER(SPLIT_PART("email", '@', 1)), '[^a-z0-9_.]', '', 'g') AS "clean"
    FROM "User"
  ) AS cleaned
),
ranked AS (
  SELECT
    "id",
    "name",
    ROW_NUMBER() OVER (PARTITION BY "name" ORDER BY "createdAt", "id") AS "n"
  FROM base
)
UPDATE "User" AS u
SET "username" = CASE WHEN r."n" = 1 THEN r."name" ELSE r."name" || '_' || r."n" END
FROM ranked AS r
WHERE u."id" = r."id";

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
