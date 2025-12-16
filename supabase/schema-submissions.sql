-- Enum types
create type submission_type as enum ('video_idea','feedback','question','review');
create type submission_status as enum ('new','read','archived','approved','rejected','published');

-- Submissions table (user-generated content)
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  type submission_type not null,
  name text null,
  email text null,
  message text not null,
  rating int null check (rating between 1 and 5),
  source_page text null,
  content_slug text null,
  is_approved boolean not null default false,
  status submission_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists submissions_status_idx on submissions(status);
create index if not exists submissions_type_idx on submissions(type);
create index if not exists submissions_created_idx on submissions(created_at desc);

-- Answers for Q&A (optional)
create table if not exists submission_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  answer text not null,
  is_final boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists submission_answers_submission_idx
  on submission_answers (submission_id, created_at desc);

