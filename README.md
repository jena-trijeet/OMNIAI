# OmniAI - Futuristic AI Super App

OmniAI is a premium, high-fidelity AI management platform built with **Next.js 15**, **Tailwind CSS**, and **Supabase**.

## 🚀 Features
- **Dark Futuristic UI**: Deep purples, cyber cyan accents, and glassmorphism.
- **Supabase Auth**: Ready-to-use authentication with custom UI.
- **Neural Dashboard**: Real-time stats visualization and agent management.
- **Mobile Responsive**: Seamless experience across all devices.
- **Clean Architecture**: Organized into `services`, `hooks`, `components`, and `lib`.

## 🛠️ Setup Instructions

### 1. Environment Variables
Copy `.env.local` and fill in your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Database Schema
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor**.
3. Copy the contents of `supabase_schema.sql` and run it.
4. This will create:
   - `profiles` table (automatically synced with auth)
   - `agents` table
   - `inference_logs` table
   - RLS Policies for data security

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

## 📂 Project Structure
- `app/`: Next.js 15 App Router pages and layouts.
- `components/`: Reusable UI components (Sidebar, Cards, etc.).
- `lib/`: Configuration for Supabase and utility functions.
- `services/`: API layer for database and external services.
- `supabase_schema.sql`: Database initialization script.
