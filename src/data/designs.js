// Screen content for the three cancellation flow prototypes.
// Each screen is a plain data structure rendered by PhoneFrame, so wording
// and layout can be edited here without touching component code.
//
// Element kinds understood by the renderer:
//   { kind: 'title', text }                          – screen heading
//   { kind: 'text', text }                           – body paragraph
//   { kind: 'note', text }                           – small secondary text
//   { kind: 'rows', items: [string] }                – settings-style list rows
//   { kind: 'rowButton', label }                     – a row styled as a tappable action
//   { kind: 'button', label, variant }               – variants: 'equal' | 'brand'
//   { kind: 'link', label, variant }                 – variants: 'plain' | 'faint'
//   { kind: 'choices', items: [string] }             – radio-style option list (decorative)
//   { kind: 'bullets', items: [string] }             – benefit/feature list

export const LIKERT_ITEMS = [
  { key: 'control', text: 'I felt in control while completing this cancellation.' },
  { key: 'clarity', text: 'It was clear what would happen to my billing and my account.' },
  { key: 'trust', text: 'This design makes me trust the company.' },
  { key: 'resubscribe', text: 'I would consider subscribing to this service again in the future.' },
];

export const DESIGN_IDS = ['A_direct_exit', 'B_reason_first', 'C_status_quo'];

export const DESIGNS = {
  A_direct_exit: {
    id: 'A_direct_exit',
    screens: [
      {
        name: 'Account settings',
        elements: [
          { kind: 'title', text: 'Account' },
          {
            kind: 'rows',
            items: ['Membership & billing', 'Playback settings', 'Manage profiles', 'Devices'],
          },
          { kind: 'rowButton', label: 'Cancel subscription' },
        ],
      },
      {
        name: 'Confirm cancellation',
        elements: [
          { kind: 'title', text: 'Cancel your subscription?' },
          {
            kind: 'text',
            text: 'Your access continues until August 14. Billing stops after that date.',
          },
          {
            kind: 'text',
            text: 'Your watchlists and profiles will be kept in case you come back.',
          },
          { kind: 'button', label: 'Confirm cancellation', variant: 'equal' },
          { kind: 'button', label: 'Keep my plan', variant: 'equal' },
        ],
      },
      {
        name: 'Canceled',
        elements: [
          { kind: 'title', text: 'Your subscription is canceled' },
          {
            kind: 'text',
            text: 'A confirmation email is on its way. You can keep watching until August 14.',
          },
        ],
      },
    ],
  },

  B_reason_first: {
    id: 'B_reason_first',
    screens: [
      {
        name: 'Account settings',
        elements: [
          { kind: 'title', text: 'Account' },
          {
            kind: 'rows',
            items: ['Membership & billing', 'Playback settings', 'Manage profiles', 'Devices'],
          },
          { kind: 'rowButton', label: 'Cancel subscription' },
        ],
      },
      {
        name: 'Exit survey (optional)',
        elements: [
          { kind: 'title', text: "What's your main reason for canceling?" },
          { kind: 'note', text: 'Optional — this helps us improve.' },
          {
            kind: 'choices',
            items: [
              "It's too expensive",
              "I'm not watching enough",
              "The content isn't for me",
              "I'm switching to another service",
            ],
          },
          { kind: 'button', label: 'Skip', variant: 'equal' },
        ],
      },
      {
        name: 'Save offer',
        elements: [
          { kind: 'title', text: 'An option that might fit better' },
          {
            kind: 'text',
            text: 'Keep watching with our ad-supported plan for $4.99/month — half the price of your current plan.',
          },
          { kind: 'button', label: 'Switch to ad-supported plan', variant: 'equal' },
          { kind: 'button', label: 'No thanks, cancel subscription', variant: 'equal' },
        ],
      },
      {
        name: 'Confirm cancellation',
        elements: [
          { kind: 'title', text: 'Cancel your subscription?' },
          {
            kind: 'text',
            text: 'Your access continues until August 14. Billing stops after that date.',
          },
          {
            kind: 'text',
            text: 'Your watchlists and profiles will be kept in case you come back.',
          },
          { kind: 'button', label: 'Confirm cancellation', variant: 'equal' },
          { kind: 'button', label: 'Keep my plan', variant: 'equal' },
        ],
      },
      {
        name: 'Canceled',
        elements: [
          { kind: 'title', text: 'Your subscription is canceled' },
          {
            kind: 'text',
            text: 'A confirmation email is on its way. You can keep watching until August 14.',
          },
        ],
      },
    ],
  },

  C_status_quo: {
    id: 'C_status_quo',
    screens: [
      {
        name: 'Account settings',
        elements: [
          { kind: 'title', text: 'Account' },
          {
            kind: 'rows',
            items: [
              'Membership & billing',
              'Manage plan',
              'Playback settings',
              'Manage profiles',
              'Devices',
              'Help center',
            ],
          },
        ],
      },
      {
        name: 'Manage plan',
        elements: [
          { kind: 'title', text: 'Manage plan' },
          {
            kind: 'rows',
            items: ['Change plan', 'Update payment method', 'Add a profile', 'Redeem gift card'],
          },
          { kind: 'link', label: 'cancel membership', variant: 'faint' },
        ],
      },
      {
        name: 'Benefits warning',
        elements: [
          { kind: 'title', text: "Look what you'd be giving up" },
          {
            kind: 'bullets',
            items: [
              '4K Ultra HD streaming',
              'Downloads on 3 devices',
              'Your 214-day watch streak',
            ],
          },
          { kind: 'button', label: 'Keep my benefits', variant: 'brand' },
          { kind: 'link', label: 'I understand, continue', variant: 'faint' },
        ],
      },
      {
        name: 'Discount offer',
        elements: [
          { kind: 'title', text: 'Wait — how about 50% off?' },
          { kind: 'text', text: 'Get 50% off for the next 3 months. Today only.' },
          { kind: 'button', label: 'Claim 50% off', variant: 'brand' },
          { kind: 'link', label: 'decline offer', variant: 'faint' },
        ],
      },
      {
        name: 'Pause offer',
        elements: [
          { kind: 'title', text: 'Take a break instead?' },
          {
            kind: 'text',
            text: 'Pause your membership for 3 months, free. Pick up right where you left off.',
          },
          { kind: 'button', label: 'Pause my membership', variant: 'brand' },
          { kind: 'link', label: 'continue to cancel', variant: 'faint' },
        ],
      },
      {
        name: 'Exit survey (required)',
        elements: [
          { kind: 'title', text: 'Tell us why (required)' },
          { kind: 'note', text: 'You must select a reason to continue.' },
          {
            kind: 'choices',
            items: [
              "It's too expensive",
              "I'm not watching enough",
              "The content isn't for me",
              "I'm switching to another service",
              'Other',
            ],
          },
          { kind: 'button', label: 'Submit', variant: 'brand' },
        ],
      },
      {
        name: 'Final warning',
        elements: [
          { kind: 'title', text: "Are you sure? This can't be undone." },
          {
            kind: 'text',
            text: "You'll permanently lose your viewing history and the recommendations we've personalized just for you.",
          },
          { kind: 'button', label: "Don't cancel", variant: 'brand' },
          { kind: 'link', label: 'complete cancellation', variant: 'faint' },
        ],
      },
      {
        name: 'Cancellation scheduled',
        elements: [
          { kind: 'title', text: 'Cancellation scheduled' },
          { kind: 'text', text: "We'll email you offers to come back." },
        ],
      },
    ],
  },
};
