import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';


export const user = pgTable('user', {
	id: uuid('id').primaryKey().notNull(),
	username: text('username').notNull(),
	created_on: timestamp('created_on').defaultNow().notNull()
})