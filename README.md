# ADI Studio

AI-powered Linear task management assistant with conversational interface.

## 🎯 Overview

ADI Studio helps engineering teams create standardized, well-specified Linear tasks through conversational interaction with AI. The system guides users through task creation, applying team conventions and best practices automatically.

## 🏗️ Architecture

- **Frontend**: React 18+ with TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js 20+, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL 15
- **Cache/Sessions**: Redis 7
- **AI**: OpenAI GPT-4o (with mock mode for development)
- **Integrations**: Linear API (with mock mode for development)

## 📦 Project Structure

```
adi-studio/
├── frontend/          # React application
├── backend/           # Express API server
├── shared/            # Shared TypeScript types
├── docker-compose.yml # Development services
└── package.json       # Workspace root
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm 10+
- Docker and Docker Compose
- (Optional) OpenAI API key
- (Optional) Linear OAuth credentials

### Installation

```bash
# Install dependencies
npm install

# Start Docker services (PostgreSQL + Redis)
docker-compose up -d

# Set up database
cd backend
npx prisma migrate dev
npx prisma db seed
cd ..

# Start development servers
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

## 📄 License

Proprietary - Internal use only
