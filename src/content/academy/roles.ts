export type AcademyRole = {
  slug: string;
  title: string;
  shortTitle: string;
  purpose: string;
  weeklyWork: string[];
  touchesScos: string[];
  commonMistakes: string[];
};

export const roles: AcademyRole[] = [
  {
    slug: "chairperson",
    title: "Chairperson or Head",
    shortTitle: "Chair",
    purpose:
      "Sets direction for the Accra Student Committee, chairs meetings, and stays accountable to IOU for local execution.",
    weeklyWork: [
      "Confirm priorities with secretary and leads",
      "Open and close meetings on schedule",
      "Review claimed hours before export",
    ],
    touchesScos: [
      "Admin workspace, planning board, SC logs approval",
      "Member roster and risk review",
      "PDF and Excel exports for IOU handoff",
    ],
    commonMistakes: [
      "Approving hours without evidence",
      "Leaving minutes unpublished after meetings",
      "Skipping handoff notes when a term ends",
    ],
  },
  {
    slug: "vice-chairperson",
    title: "Vice-Chairperson or Vice-Head",
    shortTitle: "Vice-Chair",
    purpose:
      "Backs the chair, covers absences, and keeps campaigns moving when leadership bandwidth is thin.",
    weeklyWork: [
      "Shadow chair priorities and escalate blockers",
      "Coordinate outreach and events leads",
      "Stand in for meeting facilitation when needed",
    ],
    touchesScos: [
      "Planning board ownership with chair",
      "Meeting attendance review",
      "Activity follow-up on late evidence",
    ],
    commonMistakes: [
      "Waiting for the chair before every small decision",
      "Duplicating secretary documentation work",
      "Losing track of deferred action items",
    ],
  },
  {
    slug: "secretary",
    title: "Secretary",
    shortTitle: "Secretary",
    purpose:
      "Owns the written record: agendas, structured minutes, notices, and clean committee documentation.",
    weeklyWork: [
      "Publish agendas before meetings",
      "Capture structured minutes after sessions",
      "Keep reminders and action lists current",
    ],
    touchesScos: [
      "Meetings and minutes workflows",
      "Notifications and email reminders",
      "Archive uploads for templates and reports",
    ],
    commonMistakes: [
      "Informal notes that never become minutes",
      "Forgetting attendance corrections",
      "Storing files only on personal devices",
    ],
  },
  {
    slug: "assistant-secretary",
    title: "Assistant Secretary",
    shortTitle: "Asst. Secretary",
    purpose:
      "Supports documentation load, drafts notices, and keeps the secretary pipeline from stalling.",
    weeklyWork: [
      "Prep attendance sheets and agenda drafts",
      "Collect evidence links for activities",
      "Help publish minutes within the deadline",
    ],
    touchesScos: [
      "Meeting support and minutes drafts",
      "Activity evidence reminders",
      "Asset archive filing with clear titles",
    ],
    commonMistakes: [
      "Editing live minutes without secretary review",
      "Vague file names in the archive",
      "Dropping unfinished drafts with no owner",
    ],
  },
  {
    slug: "finance",
    title: "Finance or Treasurer",
    shortTitle: "Finance",
    purpose:
      "Tracks committee spending, receipts, and budget asks so Accra SC stays transparent with members.",
    weeklyWork: [
      "Log expenses and receipts",
      "Confirm event budgets before spend",
      "Report balances in meetings",
    ],
    touchesScos: [
      "Planning items with cost notes",
      "Archive for receipts and budget sheets",
      "Reports when finance summary is needed",
    ],
    commonMistakes: [
      "Cash spends with no receipt trail",
      "Mixing personal and committee funds",
      "Reporting balances only at term end",
    ],
  },
  {
    slug: "student-outreach",
    title: "Student Outreach",
    shortTitle: "Outreach",
    purpose:
      "Connects IOU and local students to Accra SC programs, calls, booths, and follow-up conversations.",
    weeklyWork: [
      "Run call nights and booth shifts",
      "Track interested students and next steps",
      "Feed outreach openings into SCOS public listings",
    ],
    touchesScos: [
      "Activity logging for outreach hours",
      "Public outreach opportunity pages",
      "Planning board for campaigns",
    ],
    commonMistakes: [
      "Collecting interest with no follow-up owner",
      "Logging hours without location or evidence",
      "Promising IOU admission outcomes Accra SC cannot control",
    ],
  },
  {
    slug: "events",
    title: "Events",
    shortTitle: "Events",
    purpose:
      "Designs and runs Accra SC gatherings: webinars, Awareness Month moments, and local programs.",
    weeklyWork: [
      "Lock venues, times, and roles",
      "Coordinate volunteers and materials",
      "Close events with attendance and evidence",
    ],
    touchesScos: [
      "Planning board for event milestones",
      "Activity submissions after events",
      "Archive for posters, run-of-show, and photos",
    ],
    commonMistakes: [
      "No evidence pack after a successful event",
      "Skipping safety and venue confirmations",
      "Leaving volunteer roles unclear until the day",
    ],
  },
  {
    slug: "it-support",
    title: "IT Support",
    shortTitle: "IT Support",
    purpose:
      "Keeps Accra SC digital tools working: SCOS access help, forms, and light tech for meetings.",
    weeklyWork: [
      "Help members with sign-in and roster issues",
      "Support webinar and form tooling",
      "Flag platform bugs to the maintainer",
    ],
    touchesScos: [
      "Membership and onboarding support",
      "Archive for how-to notes and templates",
      "Admin coordination on access problems",
    ],
    commonMistakes: [
      "Sharing personal accounts instead of fixing access",
      "Changing settings without documenting why",
      "Ignoring reduced-motion and accessibility needs",
    ],
  },
];

export function getRoleBySlug(slug: string) {
  return roles.find((role) => role.slug === slug);
}
