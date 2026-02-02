# Student Center

A simple, reliable SaaS system for managing students, courses, and attendance tracking with Google authentication and email communication capabilities.

## Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google via Supabase Auth
- 👥 **Student Management** - Full CRUD operations for student records
- 📚 **Course Management** - Create and manage courses with custom colors and dates
- 📅 **Lesson Scheduling** - Schedule lessons with date, time, duration, and location
- ✅ **Attendance Tracking** - Mark attendance (present/absent/late/excused) with bulk actions
- 🔍 **Advanced Filtering & Sorting** - Filter attendance by course, student, status, and date
- 📧 **Email Communication** - Send emails to students via Resend with history tracking
- 🔒 **Row Level Security** - Each user's data is isolated and protected
- 🎨 **Modern Dark UI** - Clean design with Outfit font and responsive sidebar navigation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (Google OAuth)
- **Email**: Resend
- **Hosting**: Vercel

## Prerequisites

Before you begin, you'll need:

1. A [Supabase](https://supabase.com) account and project
2. A [Resend](https://resend.com) account with a verified domain
3. A [Google Cloud](https://console.cloud.google.com) project with OAuth credentials
4. A [Vercel](https://vercel.com) account for deployment

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Student-Center
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`

3. Configure Google OAuth:
   - Go to **Authentication** → **Providers** → **Google**
   - Enable Google provider
   - Add your Google OAuth Client ID and Secret

4. Get your project credentials:
   - Go to **Project Settings** → **API**
   - Copy the `Project URL` and `anon/public` key

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Create an OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
6. Copy the Client ID and Client Secret to Supabase

### 4. Configure Resend

1. Create a [Resend](https://resend.com) account
2. Verify your domain or use the onboarding domain for testing
3. Get your API key from the dashboard

### 5. Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend Configuration
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy from GitHub

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables in the Vercel dashboard
4. Deploy!

### Option 2: Deploy from CLI

```bash
npm i -g vercel
vercel
```

### Post-Deployment Configuration

1. Update your Supabase redirect URLs:
   - Go to **Authentication** → **URL Configuration**
   - Add your Vercel URL to **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

2. Update Google OAuth redirect URI:
   - Add `https://your-project.supabase.co/auth/v1/callback` to authorized redirect URIs

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── auth/callback/            # OAuth callback handler
│   ├── attendance/               # Global attendance view with filters
│   ├── courses/                  # Course pages
│   │   ├── [id]/                 # Course detail, edit
│   │   │   ├── lessons/          # Lesson pages
│   │   │   │   └── [lessonId]/   # Lesson detail, edit, attendance
│   │   │   └── students/         # Course enrollments
│   │   └── new/                  # New course
│   ├── dashboard/                # Main dashboard
│   ├── login/                    # Login page
│   └── students/                 # Student pages
│       ├── [id]/                 # Student detail & edit
│       └── new/                  # Add new student
├── actions/                      # Server Actions
│   ├── auth.ts                   # Authentication actions
│   ├── attendance.ts             # Attendance tracking
│   ├── courses.ts                # Course CRUD
│   ├── email.ts                  # Email sending
│   ├── enrollments.ts            # Student-course enrollment
│   ├── lessons.ts                # Lesson CRUD
│   └── students.ts               # Student CRUD
├── components/                   # React components
├── lib/                          # Utility libraries
│   ├── resend.ts                 # Resend email client
│   └── supabase/                 # Supabase clients
└── types/                        # TypeScript types
    └── database.ts               # Database schema types
```

## Database Schema

### Students Table

| Column     | Type        | Description              |
|------------|-------------|--------------------------|
| id         | uuid        | Primary key              |
| user_id    | uuid        | Owner's auth ID          |
| full_name  | text        | Student's full name      |
| email      | text        | Student's email          |
| phone      | text        | Phone number (optional)  |
| notes      | text        | Notes (optional)         |
| created_at | timestamptz | Creation timestamp       |
| updated_at | timestamptz | Last update timestamp    |

### Courses Table

| Column      | Type        | Description              |
|-------------|-------------|--------------------------|
| id          | uuid        | Primary key              |
| user_id     | uuid        | Owner's auth ID          |
| name        | text        | Course name              |
| description | text        | Course description       |
| color       | text        | Theme color (hex)        |
| start_date  | date        | Course start date        |
| end_date    | date        | Course end date          |
| is_active   | boolean     | Active status            |
| created_at  | timestamptz | Creation timestamp       |
| updated_at  | timestamptz | Last update timestamp    |

### Lessons Table

| Column           | Type        | Description              |
|------------------|-------------|--------------------------|
| id               | uuid        | Primary key              |
| user_id          | uuid        | Owner's auth ID          |
| course_id        | uuid        | Related course           |
| title            | text        | Lesson title             |
| description      | text        | Lesson description       |
| lesson_date      | timestamptz | Date and time            |
| duration_minutes | integer     | Duration in minutes      |
| location         | text        | Location (optional)      |
| created_at       | timestamptz | Creation timestamp       |
| updated_at       | timestamptz | Last update timestamp    |

### Enrollments Table

| Column      | Type        | Description                          |
|-------------|-------------|--------------------------------------|
| id          | uuid        | Primary key                          |
| user_id     | uuid        | Owner's auth ID                      |
| student_id  | uuid        | Related student                      |
| course_id   | uuid        | Related course                       |
| enrolled_at | timestamptz | Enrollment date                      |
| status      | text        | active / completed / dropped         |
| notes       | text        | Notes (optional)                     |

### Attendance Table

| Column        | Type        | Description                          |
|---------------|-------------|--------------------------------------|
| id            | uuid        | Primary key                          |
| user_id       | uuid        | Owner's auth ID                      |
| enrollment_id | uuid        | Related enrollment                   |
| lesson_id     | uuid        | Related lesson                       |
| status        | text        | present / absent / late / excused    |
| notes         | text        | Notes (optional)                     |
| marked_at     | timestamptz | When attendance was marked           |

### Email Logs Table

| Column     | Type        | Description              |
|------------|-------------|--------------------------|
| id         | uuid        | Primary key              |
| user_id    | uuid        | Owner's auth ID          |
| student_id | uuid        | Related student          |
| subject    | text        | Email subject            |
| body       | text        | Email content            |
| sent_at    | timestamptz | Send timestamp           |
| status     | text        | 'sent' or 'failed'       |

## Security

- All database tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Authentication is required for all routes except login
- Environment variables protect sensitive credentials

## License

MIT
