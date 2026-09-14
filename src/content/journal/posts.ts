export type JournalPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  body: string[];
};

export const journalPosts: JournalPost[] = [
  {
    slug: "how-hours-work",
    title: "How community service hours work in Accra SC",
    summary:
      "Claim minutes in SCOS, get chair review, export the logbook, then wait on IOU approval outside the platform.",
    date: "2026-03-01",
    body: [
      "Accra SC members log activities with date, category, location, duration, and evidence. That claim becomes part of your semester logbook.",
      "Chair or secretary review decides whether the entry is ready for export. Pending or rejected items do not belong on a submission PDF.",
      "When you download the community service report, you are packaging a local record for IOU review. Final approval is completed by IOU outside SCOS.",
      "Aim for the active-member bar: at least 10 claimed hours and 60 percent meeting attendance in the semester window.",
    ],
  },
  {
    slug: "what-is-an-sc-in-ghana",
    title: "What an SC is in Ghana",
    summary:
      "A voluntary Accra team that supports IOU locally through outreach, events, student help, and clean records.",
    date: "2026-02-18",
    body: [
      "A Student Committee is a voluntary regional team of IOU students, alumni, and volunteers. In Ghana, the Accra SC is the local face of that work.",
      "The committee promotes IOU, answers local questions, runs awareness moments, and feeds ground reality back to IOU channels.",
      "SCOS does not replace IOU. It is the operating system Accra SC uses to plan, meet, log, and hand work to the next generation.",
    ],
  },
  {
    slug: "show-up-for-outreach",
    title: "How to show up for outreach",
    summary:
      "Pick a published shift, bring reliable contact details, and expect follow-up before any hours are logged.",
    date: "2026-02-05",
    body: [
      "Browse Accra SC outreach openings on this site and sign up with a reachable phone number and short note about availability.",
      "A chair or secretary will contact you. Signing the form does not place you on the roster and does not create hours by itself.",
      "Once you are an active member, log the outreach shift as an activity with evidence so it can enter your community service logbook.",
    ],
  },
];

export function getJournalPost(slug: string) {
  return journalPosts.find((post) => post.slug === slug);
}
