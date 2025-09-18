import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Org Chart Schema
export interface OrgNode {
  id: string;
  name: string;
  title: string;
  parentId?: string;
}

export const orgNodeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  parentId: z.string().optional(),
});

export const insertOrgNodeSchema = orgNodeSchema.omit({ id: true });

export type InsertOrgNode = z.infer<typeof insertOrgNodeSchema>;