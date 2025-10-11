import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve tictactoe.html at root path
  app.get("/", (_req, res) => {
    res.sendFile("tictactoe.html", { root: "./client" });
  });

  // API endpoint for Gemini AI moves
  app.post("/api/ai-move", async (req, res) => {
    try {
      const { board } = req.body;
      
      if (!board || !Array.isArray(board) || board.length !== 9) {
        return res.status(400).json({ error: "Invalid board format" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      // Convert board to display format for AI
      const boardForAI = board.map((cell: string) => cell === '' ? '_' : cell);
      
      const prompt = `You are playing Tic Tac Toe as X. The current board is [${boardForAI.join(', ')}]. Return the best next move index (0-8) as a single number. Only respond with the number, no other text.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 10
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text.trim();
      const move = parseInt(aiResponse);

      // Validate move
      if (isNaN(move) || move < 0 || move > 8 || board[move] !== '') {
        // Return random valid move as fallback
        const availableMoves = board.map((cell: string, index: number) => cell === '' ? index : null)
                                    .filter((index: number | null) => index !== null);
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        return res.json({ move: randomMove });
      }

      res.json({ move });
    } catch (error) {
      console.error('AI move error:', error);
      
      // Fallback to random move
      const { board } = req.body;
      const availableMoves = board.map((cell: string, index: number) => cell === '' ? index : null)
                                  .filter((index: number | null) => index !== null);
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      
      res.json({ move: randomMove });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
