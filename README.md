# 🎮 Tic Tac Toe with Gemini AI

A modern, full-featured Tic Tac Toe game with AI opponent powered by Google's Gemini AI. Built with vanilla JavaScript, Express.js, and PostgreSQL.

## ✨ Features

### Game Modes
- **👥 Two-Player Mode**: Play locally with a friend on the same device
- **🤖 AI Opponent**: Challenge Gemini AI with three difficulty levels

### AI Difficulty Levels
- **Easy**: Random move selection
- **Medium**: Strategic gameplay with win/block detection
- **Hard**: Advanced minimax algorithm + Gemini AI integration

### Advanced Features
- 🏆 **Persistent Leaderboard**: Track wins, losses, and draws across sessions
- 📜 **Game History**: Review and replay past games
- 🎨 **Customizable Themes**: Personalize player names and colors
- 🔊 **Sound Effects**: Audio feedback for moves, wins, and draws
- 💾 **Database Integration**: PostgreSQL for data persistence
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Live Demo

Visit the live deployment: [https://tic-tac-toe-gemini.vercel.app/](https://tic-tac-toe-gemini.vercel.app/)

## 🛠️ Tech Stack

### Frontend
- **HTML5/CSS3**: Modern, responsive UI with CSS animations
- **Vanilla JavaScript**: No framework dependencies
- **CSS Grid**: Responsive game board layout

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web server framework
- **TypeScript**: Type-safe server code

### Database
- **PostgreSQL**: Relational database
- **Drizzle ORM**: Type-safe database operations
- **Neon**: Serverless PostgreSQL hosting

### AI Integration
- **Google Gemini API**: Advanced AI opponent

### Deployment
- **Vercel**: Serverless hosting platform
- **Vercel Functions**: API endpoints

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Neon account)
- Gemini API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tic-tac-toe-gemini.git
   cd tic-tac-toe-gemini
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```
   DATABASE_URL=your_postgresql_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Setup database**
   ```bash
   npm run db:push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5000
   ```

## 🌐 Deployment to Vercel

### From Vercel Dashboard

1. **Import your GitHub repository** to Vercel
2. **Add environment variables** in Vercel project settings:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
3. **Deploy** - Vercel will automatically build and deploy

### From CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add GEMINI_API_KEY

# Deploy to production
vercel --prod
```

## 🎯 How to Play

1. **Choose Game Mode**
   - Select "Play with Friend" for local multiplayer
   - Select "Play with AI (Gemini)" for single-player

2. **AI Mode: Select Difficulty**
   - Easy: Beginner-friendly random moves
   - Medium: Competitive strategic AI
   - Hard: Master-level Gemini AI

3. **Make Your Move**
   - Click any empty cell to place your mark
   - Player 1 is always Red (X)
   - Player 2 is always Blue (O)

4. **Win Conditions**
   - Get three in a row (horizontal, vertical, or diagonal)
   - Game announces the winner with animations
   - Automatically returns to menu after victory

## 🎨 Customization

Access the Settings panel to customize:
- Player names
- Player colors (4 color options per player)
- All settings are saved to local storage

## 📊 Database Schema

### Players Table
```sql
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#ff6b6b',
  games_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Game History Table
```sql
CREATE TABLE game_history (
  id SERIAL PRIMARY KEY,
  game_mode TEXT NOT NULL,
  difficulty TEXT,
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  winner TEXT,
  moves JSONB NOT NULL,
  final_board JSONB NOT NULL,
  played_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 API Endpoints

### POST `/api/ai-move`
Get AI's next move
```json
{
  "board": ["X", "", "O", ...],
  "difficulty": "hard"
}
```

### GET `/api/leaderboard`
Retrieve top 10 players

### POST `/api/save-game`
Save game result to database

### GET `/api/game-history`
Get last 20 games

### GET `/api/game/:id`
Get specific game for replay

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Gemini AI for the advanced AI opponent
- Neon for serverless PostgreSQL hosting
- Vercel for seamless deployment

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using modern web technologies**
