#  Roommate — Browse & Listing Experience

A mobile-first roommate discovery experience built with **Next.js 14**, **TypeScript**, **TailwindCSS**, **shadcn/ui**, and **Supabase**.

##  What’s included

### Browse page (`/app/browse`)
- Responsive grid of listing cards.
- Each card includes:
  - photo
  - listing title
  - locality + city
  - rent/month
  - room type
  - available from date
  - verified badge for verified posters
- Filter sidebar with:
  - city
  - locality text search
  - rent range (min/max)
  - room type
  - available-from date
- Card actions:
  - **View Details** CTA
  - **Bookmark** action (saves to `saved_listings`)
- Card tap/click opens listing details (`/listings/[id]`).

### Listing detail page (`/listings/[id]`)
- Photo gallery with thumbnails + simple carousel controls.
- Full listing detail block (rent, deposit, room type, availability, posted date).
- Poster profile card with:
  - name
  - avatar
  - verified badge
  - profession
  - compatibility score (from Supabase `compatibility_score` RPC)
- **Send Message** button:
  - opens chat if logged in
  - routes to login if logged out
- Phone privacy logic:
  - phone remains hidden until both users exchange at least one message each direction.

##  Mobile-first design
- Layout stacks naturally on smaller screens.
- Filter and content flow progressively to larger breakpoints.
- Gallery and profile card adapt smoothly for touch and desktop interaction.

##  Tech stack
- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn/ui primitives (`Button`, `Input`)
- Supabase Auth + DB + RPC

##  Data model touch points
- `listings`
- `profiles`
- `saved_listings`
- `messages`
- `roommate_preferences`
- RPC: `compatibility_score(pref_a_id, pref_b_id)`

##  Local run
```bash
npm install
npm run dev
```

Then visit:
- `http://localhost:3000/browse`
- `http://localhost:3000/listings/<listing-id>`

##  Notes
- Ensure Supabase URL/Anon key env vars are configured.
- Storage bucket `listing-photos` is expected for listing images.
- RLS policies should allow read scenarios needed for public browsing/detail flows.
