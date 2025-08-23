-- CreateTable
CREATE TABLE "public"."Character" (
    "id" SERIAL NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "hp" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
