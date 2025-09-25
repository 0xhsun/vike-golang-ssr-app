# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack SSR (Server-Side Rendered) application built with:
- **Vike** (React SSR framework)
- **React 19** with TypeScript
- **Express** server with universal middleware
- **Tailwind CSS** + DaisyUI for styling
- **Prisma** (ORM - setup required)
- **In-memory database** (for todos, resets on server restart)

The application demonstrates modern SSR patterns with file-based routing, API endpoints, and client-side hydration.

## Common Commands

### Development
```bash
npm run dev                 # Start development server (http://localhost:3000)
npm run build              # Build for production
npm run preview            # Preview production build
```

### Database (Prisma)
```bash
npm run prisma:studio      # Open Prisma Studio
npm run prisma:generate    # Generate Prisma client
```

## Architecture

### Server Architecture
- **Entry Point**: `express-entry.ts` - Main Express server setup
- **Universal Middleware**: Uses `@universal-middleware/express` for handling requests
- **Handlers**:
  - `server/vike-handler.ts` - Handles all Vike SSR routes
  - `server/create-todo-handler.ts` - API endpoint for creating todos

### Frontend Architecture
- **File-based Routing**: Pages in `/pages/` directory
- **Global Config**: `pages/+config.ts` defines default layout, title, head tags
- **Layout System**: `layouts/LayoutDefault.tsx` wraps all pages
- **Components**: Reusable components in `/components/`

### Key Directories
```
pages/                     # Vike pages (file-based routing)
├── +config.ts            # Global page configuration
├── +Head.tsx             # Default head tags
├── index/                # Home page
├── todo/                 # Todo page with data loading
├── star-wars/            # Example pages with API data
└── _error/               # Error page

server/                   # Server-side handlers
├── vike-handler.ts       # SSR page renderer
└── create-todo-handler.ts # Todo API endpoint

layouts/                  # Layout components
├── LayoutDefault.tsx     # Main layout wrapper
├── style.css            # Global styles
└── tailwind.css         # Tailwind imports

components/               # Reusable React components
database/                 # In-memory data models
└── todoItems.ts         # Todo data structure
```

### Data Loading Pattern
Pages can use `+data.ts` files for server-side data fetching:
- Data is loaded on the server before rendering
- Results are passed to page components as props
- Example: `pages/todo/+data.ts` loads todo items

### Styling
- **Tailwind CSS v4** with Vite plugin
- **DaisyUI** component library
- Global styles in `layouts/style.css` and `layouts/tailwind.css`

### API Endpoints
- `POST /api/todo/create` - Create new todo item
- All other routes handled by Vike SSR

## Development Notes

### Database Setup
Currently uses in-memory storage. To set up Prisma:
1. Run `pnpx prisma init`
2. Follow Prisma quickstart guide
3. Update database models in `prisma/schema.prisma`
4. Generate client with `npm run prisma:generate`

### Adding New Pages
1. Create directory in `/pages/`
2. Add `+Page.tsx` for the component
3. Optionally add `+data.ts` for server-side data loading
4. Override page config with `+config.ts` if needed

### Server Middleware Migration
Current TODO: Replace universal-middleware with direct Express integration or vike-server for better performance and simpler architecture.