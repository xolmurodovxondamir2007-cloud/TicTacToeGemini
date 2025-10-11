# Tic-Tac-Toe Game Project

## Overview

This is a full-stack Tic-Tac-Toe game application built with a modern web stack. The project features both player-vs-player and player-vs-AI game modes with varying difficulty levels. The application includes player profiles, game history tracking, leaderboards, and a replay system. The frontend uses React with Three.js for 3D rendering capabilities, while the backend is built with Express.js and uses PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR (Hot Module Replacement)
- Client-side routing handled through the React application

**UI Layer:**
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom theme configuration
- shadcn/ui component library built on top of Radix UI
- CSS variables-based theming system for consistent design tokens

**3D Graphics:**
- React Three Fiber (@react-three/fiber) for declarative 3D rendering with Three.js
- Drei (@react-three/drei) for useful helpers and abstractions
- Post-processing effects via @react-three/postprocessing
- GLSL shader support through vite-plugin-glsl

**State Management:**
- Zustand for lightweight, hook-based state management
- Separate stores for game state (`useGame`) and audio state (`useAudio`)
- Zustand middleware (`subscribeWithSelector`) for reactive state subscriptions
- TanStack Query (@tanstack/react-query) for server state management and data fetching

**Project Structure:**
- `/client` - All frontend code
  - `/src/components/ui` - Reusable UI components
  - `/src/lib/stores` - Zustand state stores
  - `/src/lib` - Utility functions and helpers
  - `/src/pages` - Page components
  - `/src/hooks` - Custom React hooks

### Backend Architecture

**Server Framework:**
- Express.js as the HTTP server framework
- TypeScript for type safety across the entire backend
- ESM (ES Modules) for modern JavaScript module system

**API Design:**
- RESTful API architecture
- Routes defined in `/server/routes.ts`
- Middleware for request logging with performance metrics
- JSON-based request/response format
- Centralized error handling middleware

**Game Logic:**
- AI opponent with multiple difficulty levels (easy, medium, hard)
- Minimax-inspired algorithm for medium difficulty
- Strategic move prioritization (center, corners, edges)
- Win condition detection and game state validation

**Development Workflow:**
- Development mode integrates Vite middleware for SPA serving
- Production mode serves static files from `/dist/public`
- Build process bundles both client (Vite) and server (esbuild) separately
- Custom logging system for request tracking

### Data Storage

**Database:**
- PostgreSQL as the primary relational database
- Neon serverless PostgreSQL (@neondatabase/serverless) for cloud deployment
- Connection pooling and serverless-optimized queries

**ORM & Schema Management:**
- Drizzle ORM for type-safe database operations
- Schema-first approach with TypeScript definitions in `/shared/schema.ts`
- Drizzle Kit for schema migrations and database synchronization
- Push-based migration strategy (`db:push` command)

**Data Models:**
- `users` table - User authentication (legacy, minimal usage)
- `players` table - Player profiles with customization (name, color, stats)
- `gameHistory` table - Complete game records with moves and outcomes
- JSON columns for storing complex data (moves array, board state)

**Storage Layer:**
- Abstract `IStorage` interface in `/server/storage.ts`
- `DatabaseStorage` implementation with Drizzle ORM
- Methods for CRUD operations on all entities
- Support for leaderboards, game history retrieval, and player statistics

### External Dependencies

**Third-Party Services:**
- Neon Database - Serverless PostgreSQL hosting with `DATABASE_URL` environment variable
- No authentication service currently integrated (authentication schema exists but unused)

**Key Libraries:**
- `drizzle-orm` & `drizzle-kit` - Database ORM and migration tools
- `@neondatabase/serverless` - Serverless PostgreSQL client
- `express` - Web server framework
- `react`, `react-dom` - UI framework
- `three`, `@react-three/fiber` - 3D graphics rendering
- `@tanstack/react-query` - Server state management
- `zustand` - Client state management
- `tailwindcss` - Utility-first CSS framework
- `@radix-ui/*` - Accessible UI primitives
- `typescript`, `tsx` - Type safety and TypeScript execution
- `vite` - Build tool and dev server
- `esbuild` - Server bundler for production

**Asset Management:**
- Support for 3D models (GLTF/GLB format)
- Audio file support (MP3, OGG, WAV)
- Inter font family via @fontsource/inter

**Development Tools:**
- TypeScript compiler for type checking
- Replit-specific vite plugin for runtime error modal
- Path aliases (`@/*` for client, `@shared/*` for shared code)
- PostCSS with Tailwind and Autoprefixer