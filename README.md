# Mental Journal Website

A calm, reflective journaling application designed for mental clarity.

## 🏗 Architecture & Tech Stack

This project is the frontend component of the Mental Journal application.

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Static Export (`output: "export"`), designed to be served by a Flask backend.
- **API Communication:** All data operations are performed via REST API calls to `/api/*`.
- **Database:** PostgreSQL (managed by backend, but included in Docker setup for completeness).

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional, for containerized run)

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 🐳 Running with Docker (Recommended)

To spin up the full environment (Frontend + Local DB):

```bash
docker-compose up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000).
The database will be available on port 5432.

**Note:** The frontend expects a backend API running at `http://localhost:5000`. Ensure the backend service is running for full functionality.

### 💻 Local Development

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Run the development server:

    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and API clients.
- `public/`: Static assets.
- `scripts/`: Utility scripts.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.
