
# LeftPlot - Political Discussion Platform

LeftPlot is a platform for political discussions where users can share their opinions, engage in respectful debate, and vote on content.

## Project Structure

This project uses a modern full-stack architecture:

- Frontend: React with TypeScript, Tailwind CSS, and shadcn/ui
- Backend: Node.js with Express
- Database: PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (if running database locally)

### Running with Docker (Recommended)

1. Clone the repository
2. Create a `.env` file in the `backend` directory based on `.env.example`
3. Start the containers:

```bash
docker-compose up -d
```

This will start three containers:
- PostgreSQL database
- Node.js backend
- React frontend with Nginx

The application will be available at http://localhost:3000

### Running Without Docker

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and configure your PostgreSQL connection

4. Set up the database:
```bash
psql -U youruser -d yourdatabase -f db/schema.sql
```

5. Start the backend:
```bash
npm run dev
```

The backend will be available at http://localhost:5000

#### Frontend Setup

1. From the project root:

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Features

- User authentication (register, login, profile management)
- Create, read, update, and delete posts
- Comment on posts
- Upvote and downvote posts and comments
- Sorting options for content (recent, most upvoted, etc.)
- Responsive design that works on mobile and desktop

## API Documentation

The backend provides RESTful API endpoints:

- Authentication: `/api/auth/*`
- Posts: `/api/posts/*`
- Comments: `/api/comments/*`
- Users: `/api/users/*`

For detailed API documentation, see the route files in the `backend/routes` directory.

## License

[MIT License](LICENSE)
