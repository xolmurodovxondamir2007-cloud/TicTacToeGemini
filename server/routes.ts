import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// AI Strategy Functions
function getRandomMove(board: string[]): number {
  const availableMoves = board.map((cell, index) => cell === '' ? index : null)
                              .filter(index => index !== null) as number[];
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getMediumMove(board: string[]): number {
  // Check for winning move
  const winMove = findWinningMove(board, 'X');
  if (winMove !== -1) return winMove;
  
  // Block opponent's winning move
  const blockMove = findWinningMove(board, 'O');
  if (blockMove !== -1) return blockMove;
  
  // Take center if available
  if (board[4] === '') return 4;
  
  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === '');
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Random move
  return getRandomMove(board);
}

function findWinningMove(board: string[], player: string): number {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] === player && board[b] === player && board[c] === '') return c;
    if (board[a] === player && board[c] === player && board[b] === '') return b;
    if (board[b] === player && board[c] === player && board[a] === '') return a;
  }
  
  return -1;
}

function getHardMove(board: string[]): number {
  // Minimax algorithm
  let bestScore = -Infinity;
  let bestMove = -1;
  
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'X';
      const score = minimax(board, 0, false);
      board[i] = '';
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  
  return bestMove !== -1 ? bestMove : getRandomMove(board);
}

function minimax(board: string[], depth: number, isMaximizing: boolean): number {
  const result = checkWinner(board);
  if (result !== null) {
    if (result === 'X') return 10 - depth;
    if (result === 'O') return depth - 10;
    return 0; // draw
  }
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        const score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        const score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(board: string[]): string | null {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  
  if (board.every(cell => cell !== '')) return 'draw';
  return null;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve tictactoe.html at root path
  app.get("/", (_req, res) => {
    res.sendFile("tictactoe.html", { root: "./client" });
  });

  // API endpoint for AI moves with difficulty levels
  app.post("/api/ai-move", async (req, res) => {
    try {
      const { board, difficulty = 'hard' } = req.body;
      
      if (!board || !Array.isArray(board) || board.length !== 9) {
        return res.status(400).json({ error: "Invalid board format" });
      }

      let move: number;

      if (difficulty === 'easy') {
        move = getRandomMove(board);
      } else if (difficulty === 'medium') {
        move = getMediumMove(board);
      } else {
        // Hard mode - use Gemini AI
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          // Fallback to minimax if no API key
          move = getHardMove(board);
        } else {
          try {
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

            if (response.ok) {
              const data = await response.json();
              const aiResponse = data.candidates[0].content.parts[0].text.trim();
              const aiMove = parseInt(aiResponse);

              if (!isNaN(aiMove) && aiMove >= 0 && aiMove <= 8 && board[aiMove] === '') {
                move = aiMove;
              } else {
                move = getHardMove(board);
              }
            } else {
              move = getHardMove(board);
            }
          } catch {
            move = getHardMove(board);
          }
        }
      }

      res.json({ move });
    } catch (error) {
      console.error('AI move error:', error);
      const { board } = req.body;
      res.json({ move: getRandomMove(board) });
    }
  });

  // Leaderboard endpoint
  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard(10);
      res.json(leaderboard);
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Save game endpoint
  app.post("/api/save-game", async (req, res) => {
    try {
      const gameData = req.body;
      const savedGame = await storage.saveGameHistory(gameData);
      res.json(savedGame);
    } catch (error) {
      console.error('Save game error:', error);
      res.status(500).json({ error: "Failed to save game" });
    }
  });

  // Get game history endpoint
  app.get("/api/game-history", async (_req, res) => {
    try {
      const history = await storage.getGameHistory(20);
      res.json(history);
    } catch (error) {
      console.error('Game history error:', error);
      res.status(500).json({ error: "Failed to fetch game history" });
    }
  });

  // Get specific game endpoint
  app.get("/api/game/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGameById(id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      console.error('Get game error:', error);
      res.status(500).json({ error: "Failed to fetch game" });
    }
  });

  // Player endpoints
  app.post("/api/player", async (req, res) => {
    try {
      const player = await storage.createPlayer(req.body);
      res.json(player);
    } catch (error) {
      console.error('Create player error:', error);
      res.status(500).json({ error: "Failed to create player" });
    }
  });

  app.get("/api/player/:name", async (req, res) => {
    try {
      const player = await storage.getPlayerByName(req.params.name);
      res.json(player || null);
    } catch (error) {
      console.error('Get player error:', error);
      res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  app.put("/api/player/:id/stats", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updatePlayerStats(id, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error('Update stats error:', error);
      res.status(500).json({ error: "Failed to update stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
