import { pgTable, serial, text, timestamp, uuid, boolean, integer, decimal, date, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  name: text('name').notNull(),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  postalCode: text('postal_code'),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const medicines = pgTable('medicines', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  dosageInfo: text('dosage_info'),
  sideEffects: text('side_effects'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  imageUrl: text('image_url'),
  requiresPrescription: boolean('requires_prescription').default(false),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  brand: text('brand'),
  expiryDate: date('expiry_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('processing'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text('shipping_address').notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentStatus: text('payment_status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  medicineId: integer('medicine_id').references(() => medicines.id, { onDelete: 'set null' }),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const prescriptions = pgTable('prescriptions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  fileUrl: text('file_url').notNull(),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const orderPrescriptions = pgTable('order_prescriptions', {
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  prescriptionId: integer('prescription_id').references(() => prescriptions.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.orderId, table.prescriptionId] })
  }
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  isRead: boolean('is_read').default(false),
  relatedId: text('related_id'),
  createdAt: timestamp('created_at').defaultNow()
});