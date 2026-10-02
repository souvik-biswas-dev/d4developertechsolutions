export interface Screenshot {
  src: string
  width: number
  height: number
  alt: string
  caption: string
}

export interface Project {
  id: string
  title: string
  /** Optional: only filled where the real problem/solution is known. Hidden when absent. */
  problem?: string
  solution?: string
  /** Factual description of what was built, based on the shipped product. */
  built: string
  /** May be empty. Hidden when empty. */
  stack: string[]
  category: string
  /** Real screenshots from /public/projects. Empty = a styled placeholder is shown. */
  screenshots: Screenshot[]
  /** Only set when a real, verified URL exists. Never invent these. */
  liveUrl?: string
  sourceUrl?: string
}

export const projects: Project[] = [
  {
    id: 'school-portal-360',
    title: 'SchoolPortal 360',
    solution:
      'One platform where school administration, teachers and students each have their own login.',
    built:
      'A school management portal with separate logins for School Administration, Teacher / Staff and Student, a Register School flow for new schools, and a built-in HelpDesk with contact details for technical support, administrative queries and payment and billing.',
    stack: [],
    category: 'School Management',
    screenshots: [
      {
        src: '/projects/school-portal-1.webp',
        width: 1920,
        height: 920,
        alt: 'SchoolPortal 360 landing page headed Your School, One Platform, with login cards for school administration, teacher and staff, and students, and a help desk section',
        caption: 'Landing page: separate logins for administration, teachers and students, and a HelpDesk.',
      },
    ],
    liveUrl: 'https://schoolportal360.com/',
  },
  {
    id: 'driftwatch',
    title: 'DriftWatch',
    problem:
      'Engineering teams had no way to detect when running Docker containers drifted from their declared Git configs — silent failures that caused outages.',
    solution:
      'Built a real-time monitoring tool that continuously compares live container state against the GitHub-declared configuration and flags every discrepancy with clear explanations.',
    built:
      "A dashboard that tracks each project's live infrastructure against its declared state. Every monitored repository and branch shows a status badge and the time of its last agent push, and new projects are added from the same screen. Live on Cloudflare Pages.",
    stack: ['Go', 'Docker', 'Kubernetes', 'GitHub API', 'PostgreSQL', 'React'],
    category: 'DevOps Tool',
    screenshots: [
      {
        src: '/projects/driftwatch-1.webp',
        width: 1920,
        height: 959,
        alt: 'DriftWatch Projects dashboard with one monitored repository, showing a monitoring status badge and the time of its last agent push',
        caption: 'Projects dashboard: each repository shows its monitoring status and when the agent last pushed.',
      },
    ],
    liveUrl: 'https://driftwatch.pages.dev/',
  },
  {
    id: 'prepsense-ai',
    title: 'PrepSense AI',
    problem:
      'Job seekers spent hours preparing for interviews with generic advice that didn\'t match their actual skills or the specific role.',
    solution:
      'Created an AI-powered platform that analyzes job descriptions against user profiles and generates personalized interview strategies, mock questions and scoring feedback.',
    built:
      "An AI interview-prep app that analyzes a job description against a candidate profile and generates a personalized strategy, mock questions and scoring feedback. The results page lists technical questions drawn from the candidate's own projects, a match score and the skill gaps. Built with Next.js and TypeScript, using Google Gemini for the analysis.",
    stack: ['Next.js', 'TypeScript', 'Google Gemini', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    category: 'AI Platform',
    screenshots: [
      {
        src: '/projects/prepsense-ai-1.webp',
        width: 1920,
        height: 920,
        alt: 'PrepSense AI results page with a list of technical interview questions, a match score of 92 percent and a list of skill gaps',
        caption: 'Interview prep results: technical questions drawn from the candidate profile, a match score and the skill gaps.',
      },
    ],
    liveUrl: 'https://prepsense-ai.pages.dev/',
  },
  {
    id: 'reviewflow',
    title: 'ReviewFlow',
    problem:
      'Code review sessions were disorganized — reviewers pasted snippets into Slack, context got lost, and follow-ups were impossible to track.',
    solution:
      'Built a self-hostable code review platform where teams share snippets in live sessions. Google Gemini analyzes code in real time, suggesting improvements and catching bugs during the review itself.',
    built:
      "A code review workspace with a syntax-highlighted code view, line-number comments and a live \u201Cpeople watching\u201D indicator. An AI Review tab, powered by Gemini, returns a quality score, complexity notes, suggestions and refactor hints. Live on Cloudflare Pages.",
    stack: ['React', 'Node.js', 'Express', 'Google Gemini', 'MongoDB', 'WebSocket'],
    category: 'Developer Tool',
    screenshots: [
      {
        src: '/projects/reviewflow-1.webp',
        width: 1920,
        height: 959,
        alt: 'ReviewFlow snippet page with a Go code view on the left and an AI Review panel on the right listing a quality score, complexity, suggestions and refactor hints',
        caption: 'A shared snippet with line-number comments and the Gemini-powered AI Review: score, complexity, suggestions and refactor hints.',
      },
    ],
    liveUrl: 'https://reviewflow.pages.dev/',
  },
  {
    id: 'finvault',
    title: 'FinVault',
    problem:
      'Small business owners tracked finances across spreadsheets, bank apps and notebooks — making audit season a nightmare.',
    solution:
      'Designed a full-stack personal finance ledger with multi-account tracking, categorized transactions, and complete audit trails. Every change is versioned and traceable.',
    built:
      "A finance dashboard called Ledger, with a total balance card, active and total account counts, and shortcuts for accounts, new transfers and history. A recent-transactions table shows each transaction's ID, amount, status and date.",
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'JWT Auth', 'Tailwind CSS'],
    category: 'FinTech App',
    screenshots: [
      {
        src: '/projects/finvault-1.webp',
        width: 1920,
        height: 920,
        alt: 'FinVault Ledger dashboard with total balance, active and total account counts, quick actions and a recent transactions table',
        caption: 'Ledger dashboard: balance, account counts, quick actions and recent transactions.',
      },
    ],
  },
  {
    id: 'streamsense',
    title: 'StreamSense',
    problem:
      'Existing streaming platforms buried good content under generic recommendations that ignored individual taste and watch history.',
    solution:
      'Built a full-stack streaming and discovery platform with personalised recommendations, community reviews, watchlists, and JWT-secured user accounts.',
    built:
      "A streaming and discovery app with a poster grid of titles, a play overlay on each poster, a rating label and Review button per title, a Recommended view and a logged-in user area.",
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'TMDB API', 'Tailwind CSS'],
    category: 'Streaming Platform',
    screenshots: [
      {
        src: '/projects/streamsense-1.webp',
        width: 1920,
        height: 920,
        alt: 'StreamSense home page with a grid of movie posters, each with a rating label and a Review button',
        caption: 'Home feed: a poster grid with a rating label and a Review button on every title.',
      },
    ],
    liveUrl: 'https://streamsense.pages.dev/',
  },
]
