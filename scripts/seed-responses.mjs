import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync(new URL('../.env', import.meta.url), 'utf8');
for (const line of envText.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq);
  const value = trimmed.slice(eq + 1);
  if (!process.env[key]) process.env[key] = value;
}

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const DESIGN_IDS = ['A_direct_exit', 'B_reason_first', 'C_status_quo'];
const LIKERT_KEYS = ['control', 'clarity', 'trust', 'resubscribe'];

function ratingsFor(profile) {
  const out = {};
  for (const designId of DESIGN_IDS) {
    out[designId] = {};
    for (const key of LIKERT_KEYS) {
      out[designId][key] = profile[designId][key];
    }
  }
  return out;
}

function minutesAgo(m) {
  return new Date(Date.now() - m * 60_000).toISOString();
}

const seeds = [
  {
    started_at: minutesAgo(14_400),
    completed_at: minutesAgo(14_382),
    view_order: ['B_reason_first', 'C_status_quo', 'A_direct_exit'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 5, clarity: 5, trust: 4, resubscribe: 4 },
      B_reason_first: { control: 4, clarity: 4, trust: 4, resubscribe: 3 },
      C_status_quo: { control: 2, clarity: 3, trust: 2, resubscribe: 2 },
    }),
    open_ended: {
      A_direct_exit: 'Two taps and done. I knew exactly when billing would stop.',
      C_status_quo: 'Felt like they were trying to wear me down with offers.',
    },
    trust_pick: 'A_direct_exit',
    trust_why: 'Straightforward beats manipulative retention screens.',
    one_change: 'Show the end date on the first cancel screen everywhere.',
  },
  {
    started_at: minutesAgo(13_200),
    completed_at: minutesAgo(13_175),
    view_order: ['A_direct_exit', 'B_reason_first', 'C_status_quo'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 3, clarity: 4, trust: 3, resubscribe: 3 },
      B_reason_first: { control: 4, clarity: 4, trust: 4, resubscribe: 4 },
      C_status_quo: { control: 1, clarity: 2, trust: 1, resubscribe: 1 },
    }),
    open_ended: {
      B_reason_first: 'The optional survey felt respectful — I could skip it.',
      C_status_quo:
        'Seven screens to cancel is absurd. The streak guilt trip was especially off-putting.',
    },
    trust_pick: 'B_reason_first',
    trust_why: 'Asked for feedback without blocking the exit.',
    one_change: 'Remove dark patterns from the status-quo flow entirely.',
  },
  {
    started_at: minutesAgo(12_600),
    completed_at: minutesAgo(12_588),
    view_order: ['C_status_quo', 'A_direct_exit', 'B_reason_first'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 5, clarity: 5, trust: 5, resubscribe: 5 },
      B_reason_first: { control: 3, clarity: 3, trust: 3, resubscribe: 3 },
      C_status_quo: { control: 1, clarity: 1, trust: 1, resubscribe: 1 },
    }),
    open_ended: { A_direct_exit: 'Yes.' },
    trust_pick: 'A_direct_exit',
    trust_why: null,
    one_change: null,
  },
  {
    started_at: minutesAgo(11_100),
    completed_at: minutesAgo(11_072),
    view_order: ['B_reason_first', 'A_direct_exit', 'C_status_quo'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 5, trust: 4, resubscribe: 3 },
      B_reason_first: { control: 5, clarity: 4, trust: 5, resubscribe: 4 },
      C_status_quo: { control: 2, clarity: 2, trust: 2, resubscribe: 2 },
    }),
    open_ended: {
      B_reason_first:
        'The cheaper ad tier offer was actually relevant — I might have taken it on a real app.',
    },
    trust_pick: 'B_reason_first',
    trust_why: 'Felt like a conversation, not a maze.',
    one_change: 'Make the ad-supported downgrade more prominent in design C too.',
  },
  {
    started_at: minutesAgo(10_500),
    completed_at: minutesAgo(10_491),
    view_order: ['A_direct_exit', 'C_status_quo', 'B_reason_first'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 2, clarity: 3, trust: 2, resubscribe: 2 },
      B_reason_first: { control: 3, clarity: 3, trust: 3, resubscribe: 3 },
      C_status_quo: { control: 4, clarity: 3, trust: 3, resubscribe: 4 },
    }),
    open_ended: {
      C_status_quo: 'I kind of liked the pause option? Still too many steps though.',
    },
    trust_pick: 'C_status_quo',
    trust_why: 'At least it offered alternatives before cutting me off.',
    one_change: 'Cut the discount popup if I already said no once.',
  },
  {
    started_at: minutesAgo(9_800),
    completed_at: minutesAgo(9_776),
    view_order: ['C_status_quo', 'B_reason_first', 'A_direct_exit'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 4, trust: 4, resubscribe: 4 },
      B_reason_first: { control: 4, clarity: 5, trust: 4, resubscribe: 4 },
      C_status_quo: { control: 2, clarity: 3, trust: 2, resubscribe: 2 },
    }),
    open_ended: null,
    trust_pick: 'B_reason_first',
    trust_why: 'Clear billing language throughout.',
    one_change: 'Use plain buttons instead of faint links for destructive actions.',
  },
  {
    started_at: minutesAgo(8_900),
    completed_at: minutesAgo(8_865),
    view_order: ['A_direct_exit', 'B_reason_first', 'C_status_quo'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 5, clarity: 4, trust: 5, resubscribe: 4 },
      B_reason_first: { control: 4, clarity: 4, trust: 3, resubscribe: 3 },
      C_status_quo: { control: 1, clarity: 2, trust: 1, resubscribe: 1 },
    }),
    open_ended: {
      A_direct_exit: 'Kept my lists — small thing but it matters if I resubscribe later.',
      C_status_quo:
        'Required exit survey plus “this cannot be undone” language felt hostile. I would churn harder after that experience.',
    },
    trust_pick: 'A_direct_exit',
    trust_why: 'No tricks.',
    one_change: 'Email confirmation copy should match what the app says on screen.',
  },
  {
    started_at: minutesAgo(7_600),
    completed_at: minutesAgo(7_594),
    view_order: ['B_reason_first', 'C_status_quo', 'A_direct_exit'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 3, clarity: 4, trust: 3, resubscribe: 2 },
      B_reason_first: { control: 3, clarity: 3, trust: 3, resubscribe: 2 },
      C_status_quo: { control: 3, clarity: 2, trust: 2, resubscribe: 2 },
    }),
    open_ended: { B_reason_first: 'meh' },
    trust_pick: 'A_direct_exit',
    trust_why: 'Least annoying',
    one_change: null,
  },
  {
    started_at: minutesAgo(6_400),
    completed_at: minutesAgo(6_371),
    view_order: ['C_status_quo', 'A_direct_exit', 'B_reason_first'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 5, trust: 4, resubscribe: 4 },
      B_reason_first: { control: 5, clarity: 4, trust: 5, resubscribe: 5 },
      C_status_quo: { control: 2, clarity: 2, trust: 1, resubscribe: 1 },
    }),
    open_ended: {
      B_reason_first:
        'Skipping the survey should stay one tap — do not bury skip under scroll on mobile.',
    },
    trust_pick: 'B_reason_first',
    trust_why: 'Optional feedback + still easy to leave.',
    one_change: 'Add a progress indicator during long flows like C.',
  },
  {
    started_at: minutesAgo(5_200),
    completed_at: minutesAgo(5_183),
    view_order: ['A_direct_exit', 'C_status_quo', 'B_reason_first'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 4, trust: 4, resubscribe: 3 },
      B_reason_first: { control: 4, clarity: 4, trust: 4, resubscribe: 3 },
      C_status_quo: { control: 3, clarity: 3, trust: 2, resubscribe: 2 },
    }),
    open_ended: {
      C_status_quo: 'Hidden cancel link under “Manage plan” — took me a second to find in the prototype.',
    },
    trust_pick: 'A_direct_exit',
    trust_why: null,
    one_change: 'Put cancel in account settings at the same level as billing.',
  },
  {
    started_at: minutesAgo(4_800),
    completed_at: minutesAgo(4_762),
    view_order: ['B_reason_first', 'A_direct_exit', 'C_status_quo'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 5, clarity: 5, trust: 5, resubscribe: 4 },
      B_reason_first: { control: 4, clarity: 4, trust: 4, resubscribe: 4 },
      C_status_quo: { control: 2, clarity: 4, trust: 2, resubscribe: 3 },
    }),
    open_ended: {
      A_direct_exit: 'Confirm + keep plan as equal buttons is good UX.',
      B_reason_first: 'Save offer after skip was fine; would prefer it before the survey.',
    },
    trust_pick: 'A_direct_exit',
    trust_why: 'Symmetric choices feel fair.',
    one_change: 'Design C: stop implying data loss unless it is literally true.',
  },
  {
    started_at: minutesAgo(3_900),
    completed_at: minutesAgo(3_888),
    view_order: ['C_status_quo', 'B_reason_first', 'A_direct_exit'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 3, clarity: 3, trust: 3, resubscribe: 3 },
      B_reason_first: { control: 4, clarity: 4, trust: 4, resubscribe: 4 },
      C_status_quo: { control: 4, clarity: 3, trust: 3, resubscribe: 3 },
    }),
    open_ended: null,
    trust_pick: 'B_reason_first',
    trust_why: 'Balanced.',
    one_change: 'Fewer screens overall.',
  },
  {
    started_at: minutesAgo(3_100),
    completed_at: minutesAgo(3_079),
    view_order: ['A_direct_exit', 'B_reason_first', 'C_status_quo'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 2, clarity: 3, trust: 2, resubscribe: 1 },
      B_reason_first: { control: 3, clarity: 4, trust: 3, resubscribe: 2 },
      C_status_quo: { control: 5, clarity: 3, trust: 4, resubscribe: 4 },
    }),
    open_ended: {
      C_status_quo:
        'I know people hate this flow but the pause membership option solves my actual problem (travel season).',
    },
    trust_pick: 'C_status_quo',
    trust_why: 'Pause is better than losing the account entirely.',
    one_change: 'Lead with pause before discounts.',
  },
  {
    started_at: minutesAgo(2_700),
    completed_at: minutesAgo(2_694),
    view_order: ['B_reason_first', 'C_status_quo', 'A_direct_exit'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 4, trust: 4, resubscribe: 4 },
      B_reason_first: { control: 5, clarity: 5, trust: 5, resubscribe: 5 },
      C_status_quo: { control: 1, clarity: 2, trust: 1, resubscribe: 2 },
    }),
    open_ended: { B_reason_first: '👍' },
    trust_pick: 'B_reason_first',
    trust_why: 'Felt human.',
    one_change: null,
  },
  {
    started_at: minutesAgo(2_200),
    completed_at: minutesAgo(2_181),
    view_order: ['C_status_quo', 'A_direct_exit', 'B_reason_first'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 4, trust: 4, resubscribe: 3 },
      B_reason_first: { control: 3, clarity: 4, trust: 3, resubscribe: 3 },
      C_status_quo: { control: 2, clarity: 3, trust: 2, resubscribe: 2 },
    }),
    open_ended: {
      A_direct_exit: 'August 14 access date was specific — builds confidence.',
      C_status_quo: '50% off “today only” pressure tactic erodes trust fast.',
    },
    trust_pick: 'A_direct_exit',
    trust_why: 'No fake urgency.',
    one_change: 'Remove countdown/urgency language from retention offers.',
  },
  {
    started_at: minutesAgo(1_800),
    completed_at: minutesAgo(1_792),
    view_order: ['A_direct_exit', 'C_status_quo', 'B_reason_first'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 5, clarity: 5, trust: 4, resubscribe: 4 },
      B_reason_first: { control: 4, clarity: 4, trust: 4, resubscribe: 4 },
      C_status_quo: { control: 3, clarity: 4, trust: 3, resubscribe: 3 },
    }),
    open_ended: { B_reason_first: 'Ad tier price was clear.' },
    trust_pick: 'A_direct_exit',
    trust_why: 'Fastest path out.',
    one_change: 'Same confirm screen across all variants.',
  },
  {
    started_at: minutesAgo(1_400),
    completed_at: minutesAgo(1_371),
    view_order: ['B_reason_first', 'A_direct_exit', 'C_status_quo'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 3, clarity: 5, trust: 3, resubscribe: 3 },
      B_reason_first: { control: 4, clarity: 4, trust: 4, resubscribe: 4 },
      C_status_quo: { control: 2, clarity: 3, trust: 2, resubscribe: 1 },
    }),
    open_ended: {
      C_status_quo:
        'Benefits list with watch streak — cute for engagement apps, wrong tone when I am trying to leave.',
    },
    trust_pick: 'B_reason_first',
    trust_why: 'Transparent about what happens next.',
    one_change: 'Let me cancel from membership & billing directly.',
  },
  {
    started_at: minutesAgo(1_050),
    completed_at: minutesAgo(1_041),
    view_order: ['C_status_quo', 'B_reason_first', 'A_direct_exit'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 4, trust: 5, resubscribe: 4 },
      B_reason_first: { control: 4, clarity: 3, trust: 4, resubscribe: 3 },
      C_status_quo: { control: 2, clarity: 2, trust: 2, resubscribe: 2 },
    }),
    open_ended: null,
    trust_pick: 'A_direct_exit',
    trust_why: 'Respectful.',
    one_change: 'Add a summary before final confirm everywhere.',
  },
  {
    started_at: minutesAgo(820),
    completed_at: minutesAgo(801),
    view_order: ['A_direct_exit', 'B_reason_first', 'C_status_quo'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 4, trust: 4, resubscribe: 5 },
      B_reason_first: { control: 5, clarity: 4, trust: 4, resubscribe: 5 },
      C_status_quo: { control: 3, clarity: 3, trust: 3, resubscribe: 4 },
    }),
    open_ended: {
      A_direct_exit: 'Would resubscribe if the catalog improves — canceling was not the hard part.',
      B_reason_first: 'Reason survey options covered my case (switching services).',
    },
    trust_pick: 'B_reason_first',
    trust_why: 'Shows they track why people leave without blocking exit.',
    one_change: 'Follow up on “switching services” with an export/watchlist feature pitch instead of discounts.',
  },
  {
    started_at: minutesAgo(640),
    completed_at: minutesAgo(633),
    view_order: ['B_reason_first', 'C_status_quo', 'A_direct_exit'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 5, clarity: 4, trust: 5, resubscribe: 3 },
      B_reason_first: { control: 3, clarity: 3, trust: 3, resubscribe: 3 },
      C_status_quo: { control: 1, clarity: 1, trust: 1, resubscribe: 1 },
    }),
    open_ended: { C_status_quo: 'Too long.' },
    trust_pick: 'A_direct_exit',
    trust_why: null,
    one_change: 'Cap retention flows at 3 steps max.',
  },
  {
    started_at: minutesAgo(480),
    completed_at: minutesAgo(459),
    view_order: ['C_status_quo', 'A_direct_exit', 'B_reason_first'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 3, clarity: 4, trust: 3, resubscribe: 3 },
      B_reason_first: { control: 4, clarity: 5, trust: 4, resubscribe: 4 },
      C_status_quo: { control: 4, clarity: 2, trust: 3, resubscribe: 3 },
    }),
    open_ended: {
      B_reason_first:
        'Clarity on billing stop date was the biggest trust signal across all three for me.',
    },
    trust_pick: 'B_reason_first',
    trust_why: 'Billing clarity + optional questions.',
    one_change: 'Design A could still ask an optional reason on the confirmation step.',
  },
  {
    started_at: minutesAgo(320),
    completed_at: minutesAgo(314),
    view_order: ['A_direct_exit', 'C_status_quo', 'B_reason_first'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 5, trust: 4, resubscribe: 4 },
      B_reason_first: { control: 4, clarity: 4, trust: 4, resubscribe: 4 },
      C_status_quo: { control: 2, clarity: 3, trust: 2, resubscribe: 2 },
    }),
    open_ended: { A_direct_exit: 'Keep my plan as a peer button — not a hidden link.' },
    trust_pick: 'A_direct_exit',
    trust_why: 'Equal-weight actions.',
    one_change: null,
  },
  {
    started_at: minutesAgo(210),
    completed_at: minutesAgo(188),
    view_order: ['B_reason_first', 'A_direct_exit', 'C_status_quo'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 2, clarity: 2, trust: 2, resubscribe: 2 },
      B_reason_first: { control: 3, clarity: 3, trust: 3, resubscribe: 3 },
      C_status_quo: { control: 5, clarity: 4, trust: 4, resubscribe: 5 },
    }),
    open_ended: {
      C_status_quo:
        'Controversial take: I want offers when canceling. Design A felt cold. Still too many steps in C though.',
    },
    trust_pick: 'C_status_quo',
    trust_why: 'Gave me choices before canceling.',
    one_change: 'Compress C to 4 screens without the guilt language.',
  },
  {
    started_at: minutesAgo(120),
    completed_at: minutesAgo(112),
    view_order: ['C_status_quo', 'B_reason_first', 'A_direct_exit'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 5, clarity: 5, trust: 5, resubscribe: 4 },
      B_reason_first: { control: 4, clarity: 4, trust: 4, resubscribe: 4 },
      C_status_quo: { control: 2, clarity: 2, trust: 1, resubscribe: 2 },
    }),
    open_ended: {
      A_direct_exit: 'Perfect length for a chore task.',
      C_status_quo: 'Final warning about recommendations felt exaggerated.',
    },
    trust_pick: 'A_direct_exit',
    trust_why: 'Honest and quick.',
    one_change: 'Standardize confirmation email mention on the last screen.',
  },
  {
    started_at: minutesAgo(45),
    completed_at: minutesAgo(38),
    view_order: ['A_direct_exit', 'B_reason_first', 'C_status_quo'],
    screener: 'yes',
    ratings: ratingsFor({
      A_direct_exit: { control: 4, clarity: 4, trust: 4, resubscribe: 3 },
      B_reason_first: { control: 5, clarity: 4, trust: 5, resubscribe: 4 },
      C_status_quo: { control: 3, clarity: 3, trust: 2, resubscribe: 3 },
    }),
    open_ended: {
      B_reason_first: 'Skip button visibility matters — this one was obvious.',
      C_status_quo: 'Required reason in C is a dealbreaker for trust.',
    },
    trust_pick: 'B_reason_first',
    trust_why: 'Best mix of feedback and control.',
    one_change: 'Never require a survey to complete cancellation.',
  },
];

if (seeds.length !== 25) {
  console.error(`Expected 25 seed rows, got ${seeds.length}`);
  process.exit(1);
}

const { count: beforeCount, error: countBeforeError } = await supabase
  .from('responses')
  .select('*', { count: 'exact', head: true });

if (countBeforeError) {
  console.error('Failed to count existing rows:', countBeforeError.message);
  process.exit(1);
}

const { data: inserted, error: insertError } = await supabase
  .from('responses')
  .insert(seeds)
  .select('id, created_at, view_order, screener, trust_pick, ratings, open_ended, trust_why, one_change');

if (insertError) {
  console.error('Insert failed:', insertError.message);
  process.exit(1);
}

const { count: afterCount, error: countAfterError } = await supabase
  .from('responses')
  .select('*', { count: 'exact', head: true });

if (countAfterError) {
  console.error('Failed to verify row count:', countAfterError.message);
  process.exit(1);
}

console.log(JSON.stringify({
  inserted: inserted.length,
  rowsBefore: beforeCount,
  rowsAfter: afterCount,
  netAdded: afterCount - beforeCount,
  sample: inserted.slice(0, 5).map((row) => ({
    id: row.id,
    created_at: row.created_at,
    view_order: row.view_order,
    screener: row.screener,
    trust_pick: row.trust_pick,
    ratings: row.ratings,
    open_ended: row.open_ended,
    trust_why: row.trust_why,
    one_change: row.one_change,
  })),
}, null, 2));
