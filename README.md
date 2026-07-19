# Subscription Cancellation Design Study

A research survey web app for a graduate HCI study comparing three subscription
cancellation flow designs. Respondents step through three interactive mock
cancellation flows (shown in randomized order), rate each one, and answer a few
closing questions. Completed responses are stored as a single row in Supabase.

Built with React 18 + Vite (plain JavaScript, plain CSS), `@supabase/supabase-js`
for storage, and deployable to Vercel with zero configuration.

## 1. Supabase project setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the dashboard, go to **Project Settings → API** and note:
   - the **Project URL** (looks like `https://xxxx.supabase.co`)
   - the **anon public** API key

## 2. Run the migration

The schema lives in [`supabase/migrations/001_responses.sql`](supabase/migrations/001_responses.sql).

**Option A — SQL editor (simplest):** open the Supabase dashboard → **SQL Editor**,
paste the contents of `001_responses.sql`, and run it.

**Option B — Supabase CLI:**

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

The migration creates a `responses` table with row level security enabled and a
single policy allowing the anonymous role to **insert only**. Respondents cannot
read, update, or delete any data.

## 3. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Both are read via `import.meta.env` at build time. The anon key is safe to
expose in the client; it is limited by the row level security policy above.

## 4. Local development

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`). If the env vars are
missing, the survey still runs, but submission will fail and offer the JSON
download fallback instead.

To verify a production build:

```bash
npm run build
npm run preview
```

## 5. Deploy to Vercel

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In [Vercel](https://vercel.com), click **Add New → Project** and import the repo.
   Vercel auto-detects Vite; no build settings need to change.
3. Before deploying, open **Project Settings → Environment Variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Subsequent pushes to the default branch redeploy automatically.

Or from the command line:

```bash
npm i -g vercel
vercel
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

## Results dashboard (password protected)

Aggregated results are available at `/#/results` (e.g.
`http://localhost:5173/#/results` or `https://your-app.vercel.app/#/results`).
The dashboard shows the response count, mean Likert ratings per design, the
trust-pick distribution, and all open-ended comments.

Access is gated by a simple password set in an environment variable. Setup:

1. Run the second migration, [`supabase/migrations/002_dashboard_read.sql`](supabase/migrations/002_dashboard_read.sql)
   (SQL Editor or `supabase db push`), so the dashboard can read responses.
2. Set `VITE_ANALYTICS_PASSWORD` in `.env` (local) and in Vercel project
   settings (deployed), then rebuild/redeploy.
3. Visit `/#/results` and enter the password.

**Security note:** the password is checked in the browser and `VITE_` env vars
are embedded in the public JS bundle, so this keeps casual visitors out but is
not hard security — a determined person could extract the password or query the
table with the anon key. That's usually acceptable for anonymous course-project
data. Don't reuse a password you use elsewhere. If you later need real access
control, gate reads behind Supabase Auth instead.

## Data model

Each completed survey is one row in `responses`:

- `view_order` — internal design ids in the order shown to that respondent
  (e.g. `{C_status_quo,A_direct_exit,B_reason_first}`)
- `ratings` — jsonb keyed by internal design id:
  `{"A_direct_exit": {"control": 4, "clarity": 5, "trust": 4, "resubscribe": 3}, ...}`
- `open_ended` — jsonb of optional per-design comments, keyed the same way
- `trust_pick` — internal id of the design chosen in the closing question
- `trust_why`, `one_change` — optional closing free-text answers

Internal design ids: `A_direct_exit` (3 screens, direct flow),
`B_reason_first` (5 screens, optional exit survey + one save offer),
`C_status_quo` (8 screens, deliberately reproduces common dark patterns).
Respondents only ever see the neutral labels Design 1/2/3 in their viewing order.

Respondents who answer "No" to the screener are shown a polite end screen and
nothing is written to the database.
