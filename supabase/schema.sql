-- Student Center Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- STUDENTS TABLE
-- ============================================
create table if not exists public.students (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  email text not null,
  phone text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- COURSES TABLE
-- ============================================
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  color text default '#6366f1',
  start_date date,
  end_date date,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- LESSONS TABLE
-- ============================================
create table if not exists public.lessons (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  lesson_date timestamp with time zone not null,
  duration_minutes integer default 60,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ENROLLMENTS TABLE (Student-Course relationship)
-- ============================================
create table if not exists public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  student_id uuid references public.students(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active' check (status in ('active', 'completed', 'dropped')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Ensure a student can only be enrolled once per course
  unique(student_id, course_id)
);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
create table if not exists public.attendance (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  enrollment_id uuid references public.enrollments(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  notes text,
  marked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Ensure one attendance record per enrollment per lesson
  unique(enrollment_id, lesson_id)
);

-- ============================================
-- EMAIL LOGS TABLE
-- ============================================
create table if not exists public.email_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  student_id uuid references public.students(id) on delete cascade not null,
  subject text not null,
  body text not null,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null check (status in ('sent', 'failed'))
);

-- ============================================
-- INDEXES
-- ============================================
-- Students
create index if not exists students_user_id_idx on public.students(user_id);
create index if not exists students_created_at_idx on public.students(created_at desc);

-- Courses
create index if not exists courses_user_id_idx on public.courses(user_id);
create index if not exists courses_is_active_idx on public.courses(is_active);
create index if not exists courses_created_at_idx on public.courses(created_at desc);

-- Lessons
create index if not exists lessons_user_id_idx on public.lessons(user_id);
create index if not exists lessons_course_id_idx on public.lessons(course_id);
create index if not exists lessons_lesson_date_idx on public.lessons(lesson_date);

-- Enrollments
create index if not exists enrollments_user_id_idx on public.enrollments(user_id);
create index if not exists enrollments_student_id_idx on public.enrollments(student_id);
create index if not exists enrollments_course_id_idx on public.enrollments(course_id);

-- Attendance
create index if not exists attendance_user_id_idx on public.attendance(user_id);
create index if not exists attendance_enrollment_id_idx on public.attendance(enrollment_id);
create index if not exists attendance_lesson_id_idx on public.attendance(lesson_id);
create index if not exists attendance_status_idx on public.attendance(status);

-- Email logs
create index if not exists email_logs_student_id_idx on public.email_logs(student_id);
create index if not exists email_logs_user_id_idx on public.email_logs(user_id);
create index if not exists email_logs_sent_at_idx on public.email_logs(sent_at desc);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.students enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.attendance enable row level security;
alter table public.email_logs enable row level security;

-- Students policies
create policy "Users can view their own students"
  on public.students for select using (auth.uid() = user_id);
create policy "Users can insert their own students"
  on public.students for insert with check (auth.uid() = user_id);
create policy "Users can update their own students"
  on public.students for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own students"
  on public.students for delete using (auth.uid() = user_id);

-- Courses policies
create policy "Users can view their own courses"
  on public.courses for select using (auth.uid() = user_id);
create policy "Users can insert their own courses"
  on public.courses for insert with check (auth.uid() = user_id);
create policy "Users can update their own courses"
  on public.courses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own courses"
  on public.courses for delete using (auth.uid() = user_id);

-- Lessons policies
create policy "Users can view their own lessons"
  on public.lessons for select using (auth.uid() = user_id);
create policy "Users can insert their own lessons"
  on public.lessons for insert with check (auth.uid() = user_id);
create policy "Users can update their own lessons"
  on public.lessons for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own lessons"
  on public.lessons for delete using (auth.uid() = user_id);

-- Enrollments policies
create policy "Users can view their own enrollments"
  on public.enrollments for select using (auth.uid() = user_id);
create policy "Users can insert their own enrollments"
  on public.enrollments for insert with check (auth.uid() = user_id);
create policy "Users can update their own enrollments"
  on public.enrollments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own enrollments"
  on public.enrollments for delete using (auth.uid() = user_id);

-- Attendance policies
create policy "Users can view their own attendance"
  on public.attendance for select using (auth.uid() = user_id);
create policy "Users can insert their own attendance"
  on public.attendance for insert with check (auth.uid() = user_id);
create policy "Users can update their own attendance"
  on public.attendance for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own attendance"
  on public.attendance for delete using (auth.uid() = user_id);

-- Email logs policies
create policy "Users can view their own email logs"
  on public.email_logs for select using (auth.uid() = user_id);
create policy "Users can insert their own email logs"
  on public.email_logs for insert with check (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists students_updated_at on public.students;
create trigger students_updated_at
  before update on public.students
  for each row execute function public.handle_updated_at();

drop trigger if exists courses_updated_at on public.courses;
create trigger courses_updated_at
  before update on public.courses
  for each row execute function public.handle_updated_at();

drop trigger if exists lessons_updated_at on public.lessons;
create trigger lessons_updated_at
  before update on public.lessons
  for each row execute function public.handle_updated_at();

drop trigger if exists attendance_updated_at on public.attendance;
create trigger attendance_updated_at
  before update on public.attendance
  for each row execute function public.handle_updated_at();

-- ============================================
-- PERMISSIONS
-- ============================================
grant usage on schema public to authenticated;
grant all on public.students to authenticated;
grant all on public.courses to authenticated;
grant all on public.lessons to authenticated;
grant all on public.enrollments to authenticated;
grant all on public.attendance to authenticated;
grant all on public.email_logs to authenticated;
