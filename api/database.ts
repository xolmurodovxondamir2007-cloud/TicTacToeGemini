import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';
import { pgTable, text, serial, integer, timestamp, json } from 'drizzle-orm/pg-core';

const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull().default('#ff6b6b'),
  gamesPlayed: integer('games_played').notNull().default(0),
  wins: integer('wins').notNull().default(0),
  losses: integer('losses').notNull().default(0),
  draws: integer('draws').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const gameHistory = pgTable('game_history', {
  id: serial('id').primaryKey(),
  gameMode: text('game_mode').notNull(),
  difficulty: text('difficulty'),
  player1Name: text('player1_name').notNull(),
  player2Name: text('player2_name').notNull(),
  winner: text('winner'),
  moves: json('moves').notNull(),
  finalBoard: json('final_board').notNull(),
  playedAt: timestamp('played_at').notNull().defaultNow(),
});

function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;

  try {
    const db = getDb();

    switch (action) {
      case 'leaderboard':
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        const leaderboard = await db.select()
          .from(players)
          .orderBy(desc(players.wins))
          .limit(10);
        return res.json(leaderboard);

      case 'save-game':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        const gameData = req.body;
        const [savedGame] = await db.insert(gameHistory).values(gameData).returning();
        return res.json(savedGame);

      case 'game-history':
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        const history = await db.select()
          .from(gameHistory)
          .orderBy(desc(gameHistory.playedAt))
          .limit(20);
        return res.json(history);

      case 'game':
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        const id = parseInt(req.query.id as string);
        const [game] = await db.select().from(gameHistory).where(eq(gameHistory.id, id));
        if (!game) {
          return res.status(404).json({ error: 'Game not found' });
        }
        return res.json(game);

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database operation failed' });
  }
}
