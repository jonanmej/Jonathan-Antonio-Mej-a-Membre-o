import { boolean, pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'),
  displayName: text('display_name'),
  role: text('role').default('technician').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reports = pgTable('reports', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  date: timestamp('date').notNull(),
  categoryName: text('category_name').notNull(),
  serviceName: text('service_name').notNull(),
  clientName: text('client_name'),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
