# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack web application demonstrating Server-Side Rendering (SSR) with a Todo application, combining React/Vike frontend with Go backend.

## Architecture

**Monorepo Structure:**
- `client/` - React 19 + Vike SSR frontend (port 3000)
- `server/` - Go + Gin API backend (port 8080)

**Frontend Stack:**
- Vike (SSR framework) + React + TypeScript
- Vite build tool, Tailwind CSS
- File-based routing with `+Page.tsx` convention
- SSR configuration via `+config.ts` files
- Data loading via `+data.ts` files

**Backend Stack:**
- Go 1.23 + Gin web framework
- RESTful API with in-memory storage
- CORS enabled for localhost:3000

## Common Commands

### Development
```bash
# Start backend (in server/)
go run main.go

# Start frontend (in client/)
npm run dev

# Install frontend dependencies
cd client && npm install
```

### Build & Deploy
```bash
# Build frontend for production
cd client && npm run build

# Build backend binary
cd server && go build

# Preview production build
cd client && npm run preview
```

### Go Dependencies
```bash
cd server && go mod tidy
cd server && go mod download
```

## API Endpoints

Backend runs on port 8080 with endpoints:
- `GET /health` - Health check
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle completion

## Key Patterns

**Vike File Conventions:**
- `+Page.tsx` - Page components
- `+config.ts` - Page configuration
- `+data.ts` - Server-side data fetching
- `LayoutDefault.tsx` - Shared layout component

**Go Backend:**
- Thread-safe operations with RWMutex
- CORS middleware configured for frontend
- UUID-based todo IDs
- Map-based in-memory storage