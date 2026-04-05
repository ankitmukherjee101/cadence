-- Cadence initial schema (apply via Supabase SQL editor or `supabase db push` after linking)

-- Semantic search on journal text (dimension must match your embedding model, e.g. 1536)
create extension if not exists "vector";

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  timezone text default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Journal / log entries
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  raw_text text not null,
  source text not null default 'text' check (source in ('text', 'voice')),
  created_at timestamptz not null default now(),
  local_timestamp timestamptz,
  tz_offset_minutes integer,
  processing_status text not null default 'pending'
    check (processing_status in ('pending', 'processing', 'completed', 'failed')),
  neo4j_sync_status text not null default 'pending'
    check (neo4j_sync_status in ('pending', 'synced', 'failed', 'skipped')),
  structured_payload jsonb
);

create index if not exists entries_user_created_idx
  on public.entries (user_id, created_at desc);

alter table public.entries enable row level security;

create policy "Users read own entries"
  on public.entries for select
  using (auth.uid() = user_id);

create policy "Users insert own entries"
  on public.entries for insert
  with check (auth.uid() = user_id);

create policy "Users update own entries"
  on public.entries for update
  using (auth.uid() = user_id);

create policy "Users delete own entries"
  on public.entries for delete
  using (auth.uid() = user_id);

-- Embeddings (optional until Phase 11; column size must match model)
create table if not exists public.entry_embeddings (
  entry_id uuid primary key references public.entries (id) on delete cascade,
  embedding vector(1536),
  model text not null,
  created_at timestamptz not null default now()
);

alter table public.entry_embeddings enable row level security;

create policy "Users read own entry embeddings"
  on public.entry_embeddings for select
  using (
    exists (
      select 1 from public.entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );

create policy "Users manage own entry embeddings"
  on public.entry_embeddings for all
  using (
    exists (
      select 1 from public.entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );

-- New user → profile row (adjust if you use a different signup flow)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
