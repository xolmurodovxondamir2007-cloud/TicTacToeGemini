import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";
import { 
  users, 
  players,
  gameHistory,
  type User, 
  type InsertUser,
  type Player,
  type InsertPlayer,
  type GameHistory,
  type InsertGameHistory
} from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // User methods (legacy)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player methods
  createPlayer(player: InsertPlayer): Promise<Player>;
  getPlayerByName(name: string): Promise<Player | undefined>;
  updatePlayerStats(id: number, stats: Partial<Player>): Promise<void>;
  getLeaderboard(limit?: number): Promise<Player[]>;
  
  // Game history methods
  saveGameHistory(game: InsertGameHistory): Promise<GameHistory>;
  getGameHistory(limit?: number): Promise<GameHistory[]>;
  getGameById(id: number): Promise<GameHistory | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Player methods
  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const [player] = await db.insert(players).values(insertPlayer).returning();
    return player;
  }

  async getPlayerByName(name: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.name, name));
    return player;
  }

  async updatePlayerStats(id: number, stats: Partial<Player>): Promise<void> {
    await db.update(players).set(stats).where(eq(players.id, id));
  }

  async getLeaderboard(limit: number = 10): Promise<Player[]> {
    return await db.select()
      .from(players)
      .orderBy(desc(players.wins))
      .limit(limit);
  }

  // Game history methods
  async saveGameHistory(game: InsertGameHistory): Promise<GameHistory> {
    const [savedGame] = await db.insert(gameHistory).values(game).returning();
    return savedGame;
  }

  async getGameHistory(limit: number = 20): Promise<GameHistory[]> {
    return await db.select()
      .from(gameHistory)
      .orderBy(desc(gameHistory.playedAt))
      .limit(limit);
  }

  async getGameById(id: number): Promise<GameHistory | undefined> {
    const [game] = await db.select().from(gameHistory).where(eq(gameHistory.id, id));
    return game;
  }
}

export const storage = new DatabaseStorage();
