import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';


export const users = pgTable('users', {
	id: uuid('id').primaryKey().notNull(),
	username: text('username').notNull(),
	email: text('email').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date())
})


export const memory = pgTable('memory', {
	id: uuid('id').primaryKey().notNull(),
	title: text('title').notNull(),
	description: text('description').default("No description"),
	images: text("images").array().notNull().default([]),
	videos: text("videos").array().default([]),
	userId: uuid('user_id').notNull().references(() => users.id),
	created_at: timestamp('created_at').defaultNow().notNull(),

})


export const voiceDaiary = pgTable('voiceDiary', {
	id: uuid('id').primaryKey().notNull(),
	audio: text('audio').notNull(),
	userId: uuid('user_id').notNull().references(() => users.id),
	created_at: timestamp('created_at').defaultNow().notNull(),
})