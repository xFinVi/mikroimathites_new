-- Enum types
create type submission_type as enum ('video_idea','feedback','question','review');
create type submission_status as enum ('new','read','archived','approved','rejected','published');
create type age_group_slug as enum ('0_2','2_4','4_6','greek_abroad','other');
create type submission_topic as enum ('sleep','speech','food','emotions','screens','routines','greek_abroad','other');

-- Submissions table (user-generated content)
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  type submission_type not null,
  name text null,
  email text null,
  message text not null,
  rating int null check (rating between 1 and 5),
  child_age_group age_group_slug null,
  topic submission_topic null,
  source_page text null,
  content_slug text null,
  is_approved boolean not null default false,
  status submission_status not null default 'new',
  admin_notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists submissions_status_idx on submissions(status);
create index if not exists submissions_type_idx on submissions(type);
create index if not exists submissions_created_idx on submissions(created_at desc);
create index if not exists submissions_topic_idx on submissions(topic);
create index if not exists submissions_age_idx on submissions(child_age_group);

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

-- Trigger to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_submissions_updated_at
  before update on submissions
  for each row
  execute function update_updated_at_column();

create trigger update_submission_answers_updated_at
  before update on submission_answers
  for each row
  execute function update_updated_at_column();

-- RLS Policies
-- Enable RLS
alter table submissions enable row level security;
alter table submission_answers enable row level security;

-- Allow anonymous users to insert submissions
create policy "Allow anonymous insert on submissions"
  on submissions
  for insert
  to anon, authenticated
  with check (true);

-- Allow service role (admin) to do everything
create policy "Service role full access on submissions"
  on submissions
  for all
  to service_role
  using (true)
  with check (true);

create policy "Service role full access on submission_answers"
  on submission_answers
  for all
  to service_role
  using (true)
  with check (true);

-- Note: For authenticated admin users, you'll need to create additional policies
-- based on your auth setup. For now, service_role handles admin operations.

