-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('patient', 'professional', 'admin');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('female', 'male', 'non_binary', 'other', 'prefer_not_to_say');

-- CreateEnum
CREATE TYPE "RegisterType" AS ENUM ('CRP', 'CRM', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "avatar_url" TEXT,
    "profile_completed" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "gender" "Gender",
    "cpf" TEXT,
    "phone" TEXT,
    "address_zipcode" TEXT,
    "address_street" TEXT,
    "address_number" TEXT,
    "address_complement" TEXT,
    "address_neighborhood" TEXT,
    "address_city" TEXT,
    "address_state" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "emergency_contact_relationship" TEXT,
    "main_complaint" TEXT,
    "therapy_goals" TEXT,
    "current_medications" TEXT,
    "has_previous_therapy" BOOLEAN,
    "previous_therapy_notes" TEXT,
    "has_psychiatric_follow_up" BOOLEAN,
    "has_health_insurance" BOOLEAN,
    "health_insurance_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professionals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT,
    "cpf" TEXT,
    "phone" TEXT,
    "birth_date" TIMESTAMP(3),
    "gender" "Gender",
    "professional_register" TEXT,
    "register_type" "RegisterType",
    "register_state" TEXT,
    "specialty" TEXT,
    "bio" TEXT,
    "experience_years" INTEGER,
    "approach" TEXT,
    "document_url" TEXT,
    "profile_photo_url" TEXT,
    "clinic_name" TEXT,
    "consultation_price" DECIMAL(65,30),
    "offers_online_care" BOOLEAN NOT NULL DEFAULT false,
    "offers_in_person_care" BOOLEAN NOT NULL DEFAULT false,
    "address_zipcode" TEXT,
    "address_street" TEXT,
    "address_number" TEXT,
    "address_complement" TEXT,
    "address_neighborhood" TEXT,
    "address_city" TEXT,
    "address_state" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "patients_user_id_key" ON "patients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_user_id_key" ON "professionals"("user_id");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
