export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explain: string;
};

export const academyQuiz: QuizQuestion[] = [
  {
    id: "q-chair",
    prompt: "Who is primarily accountable for reviewing claimed hours before export?",
    options: ["Events lead", "Chairperson or Head", "Any member", "IT Support"],
    correctIndex: 1,
    explain: "The chair (with secretary support) reviews claims and owns export handoff.",
  },
  {
    id: "q-vice",
    prompt: "What is the Vice-Chair mainly there to do?",
    options: [
      "Replace the finance role",
      "Back the chair and keep campaigns moving",
      "Approve IOU degrees",
      "Host every webinar alone",
    ],
    correctIndex: 1,
    explain: "Vice-Chair covers absences and keeps work moving with leads.",
  },
  {
    id: "q-secretary",
    prompt: "Which artifact is the Secretary most responsible for publishing?",
    options: ["Internship offers", "Structured meeting minutes", "IOU transcripts", "Bank loans"],
    correctIndex: 1,
    explain: "Secretary owns agendas, structured minutes, and the written record.",
  },
  {
    id: "q-asst",
    prompt: "How should the Assistant Secretary handle unfinished drafts?",
    options: [
      "Leave them unnamed on a phone",
      "Delete them immediately",
      "Keep a clear owner and title in the archive trail",
      "Post them publicly without review",
    ],
    correctIndex: 2,
    explain: "Drafts need clear ownership and naming so continuity survives handoffs.",
  },
  {
    id: "q-finance",
    prompt: "What must Finance keep for committee spends?",
    options: ["Verbal promises only", "Receipts and a balance trail", "Member passwords", "Quiz scores"],
    correctIndex: 1,
    explain: "Finance tracks expenses, receipts, and transparent balances.",
  },
  {
    id: "q-outreach",
    prompt: "When do outreach volunteers start earning community service hours in SCOS?",
    options: [
      "As soon as they fill a public form",
      "After they become members and log activities",
      "When they like a social post",
      "Automatically on signup",
    ],
    correctIndex: 1,
    explain: "Public outreach signup is interest only. Hours start after membership and logged activity.",
  },
  {
    id: "q-events",
    prompt: "After an Accra SC event, what should Events prioritize in SCOS?",
    options: [
      "Deleting photos",
      "Activity evidence and archive materials",
      "Changing the IOU curriculum",
      "Closing the committee forever",
    ],
    correctIndex: 1,
    explain: "Events close with evidence, attendance, and archive materials for the next SC.",
  },
  {
    id: "q-platform",
    prompt: "Does SCOS give final IOU approval of community service hours?",
    options: [
      "Yes, automatically",
      "Yes, after the quiz",
      "No. IOU reviews outside SCOS",
      "Only for finance",
    ],
    correctIndex: 2,
    explain: "SCOS records and exports. Final approval stays with IOU outside the platform.",
  },
];

export const QUIZ_PASS_PERCENT = 70;
