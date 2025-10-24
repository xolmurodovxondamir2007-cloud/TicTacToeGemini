import type { VercelRequest, VercelResponse } from '@vercel/node';

function getRandomMove(board: string[]): number {
  const availableMoves = board.map((cell, index) => cell === '' ? index : null)
                              .filter(index => index !== null) as number[];
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getMediumMove(board: string[]): number {
  const winMove = findWinningMove(board, 'X');
  if (winMove !== -1) return winMove;
  
  const blockMove = findWinningMove(board, 'O');
  if (blockMove !== -1) return blockMove;
  
  if (board[4] === '') return 4;
  
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === '');
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  return getRandomMove(board);
}

function findWinningMove(board: string[], player: string): number {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
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
    return 0;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { board, difficulty = 'hard' } = req.body as { board: string[], difficulty?: string };
    
    if (!board || !Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({ error: 'Invalid board format' });
    }

    let move: number;

    if (difficulty === 'easy') {
      move = getRandomMove(board);
    } else if (difficulty === 'medium') {
      move = getMediumMove(board);
    } else {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
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
    const { board } = req.body as { board: string[] };
    res.json({ move: getRandomMove(board) });
  }
}
