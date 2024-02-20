/*
  Warnings:

  - Changed the type of `price` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `quantity` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
DROP COLUMN "quantity",
ADD COLUMN     "quantity" INTEGER NOT NULL;
