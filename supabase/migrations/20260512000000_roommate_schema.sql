-- Roommate-finding app schema

create extension if not exists pgcrypto;

-- Enums
create type public.room_type as enum ('single', 'shared', 'entire_flat');
create type public.sleep_time as enum ('early', 'late');
create type public.guests_policy as enum ('never', 'sometimes', 'often');
create type public.food_pref as enum ('veg', 'nonveg', 'both');
create type public.yes_no as enum ('yes', 'no');

-- 1) profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  is_verified boolean not null default false,
  verification_status text not null default 'unverified',
  bio text,
  age integer check (age is null or age >= 18),
  gender text,
  profession text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  locality text not null,
  city text not null,
  rent numeric(10,2) not null check (rent >= 0),
  deposit numeric(10,2) not null default 0 check (deposit >= 0),
  room_type public.room_type not null,
  available_from date,
  is_active boolean not null default true,
  expires_at timestamptz,
  photos text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) roommate_preferences
create table if not exists public.roommate_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  sleep_time public.sleep_time,
  cleanliness integer check (cleanliness between 1 and 5),
  guests_policy public.guests_policy,
  food_pref public.food_pref,
  smoking public.yes_no,
  profession_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4) messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

-- 5) saved_listings
create table if not exists public.saved_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

-- Helpful indexes
create index if not exists listings_user_id_idx on public.listings(user_id);
create index if not exists listings_city_locality_idx on public.listings(city, locality);
create index if not exists messages_sender_id_idx on public.messages(sender_id);
create index if not exists messages_receiver_id_idx on public.messages(receiver_id);
create index if not exists saved_listings_user_id_idx on public.saved_listings(user_id);

-- Update timestamp helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

create trigger roommate_preferences_set_updated_at
before update on public.roommate_preferences
for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.roommate_preferences enable row level security;
alter table public.messages enable row level security;
alter table public.saved_listings enable row level security;

-- profiles: only owner can read/write
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_delete_own"
on public.profiles
for delete
using (auth.uid() = id);

-- listings: only owner can read/write
create policy "listings_select_own"
on public.listings
for select
using (auth.uid() = user_id);

create policy "listings_insert_own"
on public.listings
for insert
with check (auth.uid() = user_id);

create policy "listings_update_own"
on public.listings
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "listings_delete_own"
on public.listings
for delete
using (auth.uid() = user_id);

-- roommate_preferences: only owner can read/write
create policy "roommate_preferences_select_own"
on public.roommate_preferences
for select
using (auth.uid() = user_id);

create policy "roommate_preferences_insert_own"
on public.roommate_preferences
for insert
with check (auth.uid() = user_id);

create policy "roommate_preferences_update_own"
on public.roommate_preferences
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "roommate_preferences_delete_own"
on public.roommate_preferences
for delete
using (auth.uid() = user_id);

-- messages: user can only read/write messages they send/receive
create policy "messages_select_own"
on public.messages
for select
using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "messages_insert_own_sender"
on public.messages
for insert
with check (auth.uid() = sender_id);

create policy "messages_update_own_participants"
on public.messages
for update
using (auth.uid() = sender_id or auth.uid() = receiver_id)
with check (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "messages_delete_own_sender"
on public.messages
for delete
using (auth.uid() = sender_id);

-- saved_listings: only owner can read/write
create policy "saved_listings_select_own"
on public.saved_listings
for select
using (auth.uid() = user_id);

create policy "saved_listings_insert_own"
on public.saved_listings
for insert
with check (auth.uid() = user_id);

create policy "saved_listings_delete_own"
on public.saved_listings
for delete
using (auth.uid() = user_id);

-- Compatibility score function (0-100)
create or replace function public.compatibility_score(pref_a_id uuid, pref_b_id uuid)
returns integer
language plpgsql
stable
as $$
declare
  a public.roommate_preferences%rowtype;
  b public.roommate_preferences%rowtype;
  score numeric := 0;
  total_weight numeric := 0;
begin
  select * into a from public.roommate_preferences where id = pref_a_id;
  select * into b from public.roommate_preferences where id = pref_b_id;

  if a.id is null or b.id is null then
    raise exception 'One or both roommate preference rows not found';
  end if;

  -- sleep_time: weight 20
  if a.sleep_time is not null and b.sleep_time is not null then
    total_weight := total_weight + 20;
    if a.sleep_time = b.sleep_time then
      score := score + 20;
    end if;
  end if;

  -- cleanliness: weight 25 (linear penalty)
  if a.cleanliness is not null and b.cleanliness is not null then
    total_weight := total_weight + 25;
    score := score + greatest(0, 25 - (abs(a.cleanliness - b.cleanliness) * 6.25));
  end if;

  -- guests_policy: weight 20
  if a.guests_policy is not null and b.guests_policy is not null then
    total_weight := total_weight + 20;
    if a.guests_policy = b.guests_policy then
      score := score + 20;
    elsif (a.guests_policy = 'sometimes' and b.guests_policy in ('never', 'often'))
       or (b.guests_policy = 'sometimes' and a.guests_policy in ('never', 'often')) then
      score := score + 10;
    end if;
  end if;

  -- food_pref: weight 15
  if a.food_pref is not null and b.food_pref is not null then
    total_weight := total_weight + 15;
    if a.food_pref = b.food_pref or a.food_pref = 'both' or b.food_pref = 'both' then
      score := score + 15;
    end if;
  end if;

  -- smoking: weight 15
  if a.smoking is not null and b.smoking is not null then
    total_weight := total_weight + 15;
    if a.smoking = b.smoking then
      score := score + 15;
    end if;
  end if;

  -- profession_type: weight 5
  if a.profession_type is not null and b.profession_type is not null then
    total_weight := total_weight + 5;
    if lower(a.profession_type) = lower(b.profession_type) then
      score := score + 5;
    end if;
  end if;

  if total_weight = 0 then
    return 0;
  end if;

  return round((score / total_weight) * 100)::integer;
end;
$$;
