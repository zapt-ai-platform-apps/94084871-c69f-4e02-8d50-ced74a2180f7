-- First migration to create the initial database schema for MedStore

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT,
  "name" TEXT NOT NULL,
  "address" TEXT,
  "city" TEXT,
  "state" TEXT,
  "postal_code" TEXT,
  "is_admin" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "image_url" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Medicines table
CREATE TABLE IF NOT EXISTS "medicines" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "dosage_info" TEXT,
  "side_effects" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "image_url" TEXT,
  "requires_prescription" BOOLEAN DEFAULT FALSE,
  "category_id" INTEGER REFERENCES "categories"("id") ON DELETE SET NULL,
  "brand" TEXT,
  "expiry_date" DATE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create index on category_id
CREATE INDEX IF NOT EXISTS "medicines_category_id_idx" ON "medicines"("category_id");

-- Orders table
CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
  "status" TEXT NOT NULL DEFAULT 'processing',
  "total_amount" DECIMAL(10, 2) NOT NULL,
  "shipping_address" TEXT NOT NULL,
  "payment_method" TEXT NOT NULL,
  "payment_status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS "orders_user_id_idx" ON "orders"("user_id");

-- Order items table
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER REFERENCES "orders"("id") ON DELETE CASCADE,
  "medicine_id" INTEGER REFERENCES "medicines"("id") ON DELETE SET NULL,
  "quantity" INTEGER NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Create indexes on order_id and medicine_id
CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items"("order_id");
CREATE INDEX IF NOT EXISTS "order_items_medicine_id_idx" ON "order_items"("medicine_id");

-- Prescriptions table
CREATE TABLE IF NOT EXISTS "prescriptions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
  "file_url" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "notes" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS "prescriptions_user_id_idx" ON "prescriptions"("user_id");

-- Order prescriptions table (to link prescriptions with orders)
CREATE TABLE IF NOT EXISTS "order_prescriptions" (
  "order_id" INTEGER REFERENCES "orders"("id") ON DELETE CASCADE,
  "prescription_id" INTEGER REFERENCES "prescriptions"("id") ON DELETE CASCADE,
  PRIMARY KEY ("order_id", "prescription_id")
);

-- Notifications table
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "is_read" BOOLEAN DEFAULT FALSE,
  "related_id" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS "notifications_user_id_idx" ON "notifications"("user_id");

-- Insert some default categories
INSERT INTO "categories" ("name", "description", "image_url")
VALUES 
('Painkillers', 'Medications to relieve pain', 'https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512'),
('Antibiotics', 'Medications that kill or inhibit the growth of bacteria', 'https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512'),
('Diabetes Care', 'Products for diabetes management', 'https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512'),
('Vitamins & Supplements', 'Dietary supplements and vitamins', 'https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512'),
('Cold & Flu', 'Remedies for cold and flu symptoms', 'https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512'),
('First Aid', 'First aid supplies and equipment', 'https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512')
ON CONFLICT DO NOTHING;