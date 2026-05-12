alter table public.listings
add column if not exists amenities text[] not null default '{}';
