# 🎮 Tic Tac Toe with Gemini AI

A modern Tic Tac Toe game with AI opponent powered by Google's Gemini AI. Built with vanilla JavaScript and serverless functions.

## ✨ Features

### Game Modes
- **👥 Two-Player Mode**: Play locally with a friend on the same device
- **🤖 AI Opponent**: Challenge Gemini AI with three difficulty levels

### AI Difficulty Levels
- **Easy**: Random move selection
- **Medium**: Strategic gameplay with win/block detection
- **Hard**: Advanced minimax algorithm + Gemini AI integration

### Features
- 🎨 **Customizable Themes**: Personalize player names and colors
- 🔊 **Sound Effects**: Audio feedback for moves, wins, and draws
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 💾 **Local Storage**: Saves your settings locally

## 🚀 Live Demo

Visit the live deployment: [https://tic-tac-toe-gemini.vercel.app/](https://tic-tac-toe-gemini.vercel.app/)

## 🛠️ Tech Stack

### Frontend
- **HTML5/CSS3**: Modern, responsive UI with CSS animations
- **Vanilla JavaScript**: No framework dependencies
- **CSS Grid**: Responsive game board layout

### Backend
- **Vercel Functions**: Serverless API endpoints
- **TypeScript**: Type-safe code

### AI Integration
- **Google Gemini API**: Advanced AI opponent (hard mode)
- **Minimax Algorithm**: Built-in AI for offline play

### Deployment
- **Vercel**: Serverless hosting platform

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Gemini API key (optional - falls back to minimax AI)

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

3. **Configure environment variables** (optional)
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```
   
   Note: The game works without the API key using built-in AI

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

## 🌐 Deployment to Vercel

### From Vercel Dashboard

1. **Import your GitHub repository** to Vercel
2. **Add environment variable** (optional) in Vercel project settings:
   - `GEMINI_API_KEY` - Your Gemini API key
3. **Deploy** - Vercel will automatically build and deploy

### From CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable (optional)
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

## 🔧 API Endpoint

### POST `/api/ai-move`
Get AI's next move
```json
{
  "board": ["X", "", "O", ...],
  "difficulty": "easy" | "medium" | "hard"
}
```

Response:
```json
{
  "move": 4
}
```

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
