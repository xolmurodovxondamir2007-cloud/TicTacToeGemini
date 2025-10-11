import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Player profiles for storing customization
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("#ff6b6b"),
  gamesPlayed: integer("games_played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  draws: integer("draws").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  name: true,
  color: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// Game history for replay feature
export const gameHistory = pgTable("game_history", {
  id: serial("id").primaryKey(),
  gameMode: text("game_mode").notNull(), // 'friend' or 'ai'
  difficulty: text("difficulty"), // null for friend mode, 'easy'/'medium'/'hard' for AI
  player1Name: text("player1_name").notNull(),
  player2Name: text("player2_name").notNull(),
  winner: text("winner"), // player name or 'draw'
  moves: json("moves").notNull(), // array of move objects
  finalBoard: json("final_board").notNull(), // final board state
  playedAt: timestamp("played_at").notNull().defaultNow(),
});

export const insertGameHistorySchema = createInsertSchema(gameHistory).omit({
  id: true,
  playedAt: true,
});

export type InsertGameHistory = z.infer<typeof insertGameHistorySchema>;
export type GameHistory = typeof gameHistory.$inferSelect;
