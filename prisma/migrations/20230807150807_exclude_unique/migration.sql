-- DropIndex
DROP INDEX "User_cnpj_key";

-- DropIndex
DROP INDEX "User_cpf_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "cpf" DROP DEFAULT,
ALTER COLUMN "cnpj" DROP DEFAULT;
