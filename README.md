# PixelPrompt - AI UI Component Generator SaaS

PixelPrompt is an industry-ready, full-stack SaaS platform that allows users to instantly generate production-ready React UI components using natural language prompts. Built with a robust modern tech stack, this platform is designed for speed, security, and exceptional user experience.

## 🚀 Features

* **AI-Powered Component Generation**: Type what you want, and PixelPrompt streams back fully functional React components (using Tailwind CSS and shadcn/ui).
* **Live Interactive Playground**: Preview, test, and interact with the generated components immediately in a sandboxed execution environment.
* **Secure Authentication**: Robust credential-based authentication system built with NextAuth.js.
* **Credit & Billing System**: Integrated SQLite database using Prisma ORM to track user generations and manage virtual credits.
* **Streaming Responses**: Ultra-low latency UI generation using edge-compatible streaming protocols.
* **Modern Glassmorphism UI**: A stunning, fully responsive dashboard built with Tailwind CSS and Radix UI primitives.

## 💻 Tech Stack

* **Frontend**: React 18, Next.js 14 (App Router), Tailwind CSS
* **UI Components**: shadcn/ui, Radix UI, Lucide Icons, react-resizable-panels
* **Backend**: Next.js Server Actions & Route Handlers
* **Database & ORM**: Prisma v5, SQLite
* **Authentication**: NextAuth.js (v4)
* **Code Execution**: react-live, babel-standalone

## 🛠️ Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Meghna-ydv12/pixelprompt.git
cd pixelprompt
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following:
```env
# Database connection (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth configuration
NEXTAUTH_SECRET="supersecret123"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize the Database
Sync the Prisma schema to create the SQLite tables:
```bash
npx prisma db push
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 
To test the platform, click **Sign In (Demo)**. The system will automatically provision a new user in the database and grant 10 credits.

## 🏗️ Architecture Note
*Note for Reviewers: This specific repository uses a mocked AI streaming engine in the `api/chat/route.ts` file to demonstrate fullstack data-flow and UI capabilities without incurring live LLM API costs. The architecture is fully prepared to swap the mock for the official `@ai-sdk/openai` or `@ai-sdk/anthropic` adapters.*