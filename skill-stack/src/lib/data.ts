export type CourseId = string;

export interface Course {
  id: CourseId;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  hours: number;
  progress: number;
  color: string;
  icon: string;
  chapters: { title: string; minutes: number; done: boolean }[];
  quiz: { q: string; options: string[]; answer: number }[];
}

export const COURSES: Course[] = [
  {
    id: "js",
    title: "JavaScript Essentials",
    category: "Programming",
    instructor: "Wes Bos",
    rating: 4.9,
    students: 184230,
    hours: 24,
    progress: 72,
    color: "from-amber-400 to-orange-600",
    icon: "Code2",
    chapters: [
      { title: "Variables, Types & Operators", minutes: 38, done: true },
      { title: "Control Flow & Functions", minutes: 52, done: true },
      { title: "Arrays & Object Methods", minutes: 64, done: true },
      { title: "Async / Await & Promises", minutes: 71, done: false },
      { title: "Modules & The Event Loop", minutes: 48, done: false },
    ],
    quiz: [
      { q: "Which keyword creates a block-scoped variable?", options: ["var", "let", "function", "global"], answer: 1 },
      { q: "What does `typeof null` return?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], answer: 2 },
      { q: "Which method returns a Promise?", options: ["fetch()", "JSON.parse()", "Array.map()", "Math.random()"], answer: 0 },
    ],
  },
  {
    id: "react",
    title: "React Mastery 2026",
    category: "Frontend",
    instructor: "Kent C. Dodds",
    rating: 4.95,
    students: 96420,
    hours: 31,
    progress: 48,
    color: "from-sky-400 to-indigo-600",
    icon: "Atom",
    chapters: [
      { title: "JSX & The Component Model", minutes: 42, done: true },
      { title: "State, Effects & Refs", minutes: 58, done: true },
      { title: "Routing with React Router", minutes: 36, done: false },
      { title: "Server Components & Suspense", minutes: 64, done: false },
      { title: "Performance Patterns", minutes: 50, done: false },
    ],
    quiz: [
      { q: "Which hook lets you sync with external systems?", options: ["useMemo", "useEffect", "useCallback", "useId"], answer: 1 },
      { q: "Keys help React identify…", options: ["styles", "list items", "props", "context"], answer: 1 },
      { q: "Server components render…", options: ["in the browser", "on the server", "in a worker", "in WASM"], answer: 1 },
    ],
  },
  {
    id: "python",
    title: "Python for Data Science",
    category: "Data",
    instructor: "Jose Portilla",
    rating: 4.8,
    students: 251004,
    hours: 42,
    progress: 21,
    color: "from-emerald-400 to-teal-600",
    icon: "BarChart3",
    chapters: [
      { title: "NumPy Arrays & Vectorization", minutes: 60, done: true },
      { title: "Pandas DataFrames", minutes: 72, done: false },
      { title: "Visualization with Matplotlib", minutes: 48, done: false },
      { title: "Intro to Scikit-Learn", minutes: 80, done: false },
    ],
    quiz: [
      { q: "Which library is best for tabular data?", options: ["NumPy", "Pandas", "PyTorch", "Requests"], answer: 1 },
      { q: "`df.head()` returns…", options: ["last 5 rows", "first 5 rows", "column names", "shape"], answer: 1 },
    ],
  },
  {
    id: "ux",
    title: "UI / UX Design Foundations",
    category: "Design",
    instructor: "Aarron Walter",
    rating: 4.85,
    students: 73018,
    hours: 18,
    progress: 88,
    color: "from-pink-400 to-rose-600",
    icon: "Palette",
    chapters: [
      { title: "Color Theory & Type", minutes: 30, done: true },
      { title: "Layout & Hierarchy", minutes: 40, done: true },
      { title: "Prototyping in Figma", minutes: 55, done: true },
      { title: "Usability Testing", minutes: 35, done: false },
    ],
    quiz: [
      { q: "Which contrast ratio meets WCAG AA for body text?", options: ["2:1", "3:1", "4.5:1", "7:1"], answer: 2 },
      { q: "Hick's Law is about…", options: ["color", "decision time", "distance", "memory"], answer: 1 },
    ],
  },
  {
    id: "sql",
    title: "SQL & Database Design",
    category: "Data",
    instructor: "Jennifer Widom",
    rating: 4.92,
    students: 64921,
    hours: 22,
    progress: 35,
    color: "from-violet-400 to-fuchsia-600",
    icon: "Database",
    chapters: [
      { title: "Relational Modelling", minutes: 45, done: true },
      { title: "Joins & Subqueries", minutes: 68, done: false },
      { title: "Window Functions", minutes: 52, done: false },
      { title: "Indexes & Performance", minutes: 60, done: false },
    ],
    quiz: [
      { q: "INNER JOIN returns…", options: ["all rows", "matching rows", "unique rows", "no rows"], answer: 1 },
      { q: "PRIMARY KEY enforces…", options: ["uniqueness", "ordering", "encryption", "indexing only"], answer: 0 },
    ],
  },
  {
    id: "ml",
    title: "Machine Learning Bootcamp",
    category: "AI",
    instructor: "Andrew Ng",
    rating: 4.97,
    students: 412009,
    hours: 56,
    progress: 12,
    color: "from-indigo-400 to-purple-700",
    icon: "Brain",
    chapters: [
      { title: "Linear Regression", minutes: 70, done: true },
      { title: "Logistic & Classification", minutes: 68, done: false },
      { title: "Neural Networks", minutes: 92, done: false },
      { title: "Transformers Overview", minutes: 80, done: false },
    ],
    quiz: [
      { q: "Cross-entropy is used for…", options: ["regression", "classification", "clustering", "PCA"], answer: 1 },
      { q: "Gradient descent updates…", options: ["loss", "weights", "epochs", "labels"], answer: 1 },
    ],
  },
];

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  posted: string;
  tags: string[];
  type: string;
  source: string;
  logoColor: string;
}

export const JOBS: Job[] = [
  { id: "j1", title: "Frontend Engineer", company: "Stripe", location: "Remote · US", salary: "$140k–180k", match: 92, posted: "2h ago", tags: ["React", "TypeScript", "CSS"], type: "Full-time", source: "LinkedIn", logoColor: "bg-violet-500" },
  { id: "j2", title: "Junior Data Analyst", company: "Spotify", location: "Stockholm, SE", salary: "€55k–70k", match: 78, posted: "1d ago", tags: ["SQL", "Python", "Tableau"], type: "Full-time", source: "Naukri", logoColor: "bg-emerald-500" },
  { id: "j3", title: "Product Designer", company: "Linear", location: "Remote · EU", salary: "€80k–110k", match: 84, posted: "5h ago", tags: ["Figma", "UX", "Design Systems"], type: "Full-time", source: "Indeed", logoColor: "bg-pink-500" },
  { id: "j4", title: "ML Engineer Intern", company: "Anthropic", location: "San Francisco", salary: "$9k/mo", match: 68, posted: "3d ago", tags: ["PyTorch", "NLP", "Python"], type: "Internship", source: "LinkedIn", logoColor: "bg-amber-500" },
  { id: "j5", title: "Full-Stack Developer", company: "Atlassian", location: "Bengaluru, IN", salary: "₹22–34 LPA", match: 88, posted: "12h ago", tags: ["Node.js", "React", "Postgres"], type: "Full-time", source: "Naukri", logoColor: "bg-sky-500" },
  { id: "j6", title: "Mobile Engineer (iOS)", company: "Notion", location: "Remote · Worldwide", salary: "$130k–170k", match: 71, posted: "2d ago", tags: ["Swift", "iOS", "GraphQL"], type: "Full-time", source: "Indeed", logoColor: "bg-rose-500" },
];

export interface Quest {
  id: string;
  title: string;
  desc: string;
  xp: number;
  progress: number;
  goal: number;
  type: "daily" | "weekly" | "boss";
}

export const QUESTS: Quest[] = [
  { id: "q1", title: "Daily Practice", desc: "Complete 3 lessons today", xp: 120, progress: 2, goal: 3, type: "daily" },
  { id: "q2", title: "Streak Defender", desc: "Maintain a 7-day streak", xp: 250, progress: 5, goal: 7, type: "daily" },
  { id: "q3", title: "Quiz Champion", desc: "Score 90%+ on 5 quizzes this week", xp: 500, progress: 3, goal: 5, type: "weekly" },
  { id: "q4", title: "Course Marathon", desc: "Finish 1 entire course", xp: 1000, progress: 0, goal: 1, type: "weekly" },
  { id: "q5", title: "Boss: The Algorithm Dragon", desc: "Defeat the boss in Duel Arena (10 wins)", xp: 2500, progress: 4, goal: 10, type: "boss" },
];

export const BADGES = [
  { id: "b1", name: "First Steps", icon: "Footprints", earned: true },
  { id: "b2", name: "Week Warrior", icon: "Flame", earned: true },
  { id: "b3", name: "Quiz Master", icon: "Brain", earned: true },
  { id: "b4", name: "Code Wizard", icon: "Wand2", earned: true },
  { id: "b5", name: "Data Detective", icon: "Search", earned: false },
  { id: "b6", name: "Design Guru", icon: "Palette", earned: false },
  { id: "b7", name: "Polyglot", icon: "Languages", earned: true },
  { id: "b8", name: "Boss Slayer", icon: "Sword", earned: false },
  { id: "b9", name: "Top 1%", icon: "Crown", earned: false },
  { id: "b10", name: "Mentor", icon: "Users", earned: false },
];

export const NOTIFICATIONS = [
  { id: "n1", type: "placement", title: "New placement: Stripe", desc: "Frontend Engineer · 92% match · Apply by Friday", time: "2m ago", unread: true },
  { id: "n2", type: "internship", title: "Anthropic internship opened", desc: "Bay Area · ML · Stipend $9k/mo", time: "1h ago", unread: true },
  { id: "n3", type: "tech", title: "New course: Rust for Web", desc: "Just dropped — early-access discount", time: "3h ago", unread: true },
  { id: "n4", type: "event", title: "Live AMA with Andrew Ng", desc: "Saturday 6 PM · RSVP now", time: "Yesterday", unread: false },
  { id: "n5", type: "placement", title: "You leveled up to Lvl 12", desc: "Unlock the violet aura cosmetic", time: "Yesterday", unread: false },
];

export const MARKETPLACE = [
  { id: "m1", name: "XP Booster (24h)", price: 500, icon: "Zap", desc: "Earn 2× XP for one day" },
  { id: "m2", name: "Streak Freeze", price: 250, icon: "Snowflake", desc: "Protect your streak for 1 day" },
  { id: "m3", name: "Mystery Loot Box", price: 800, icon: "Gift", desc: "Random rare cosmetic or booster" },
  { id: "m4", name: "Violet Aura", price: 1500, icon: "Sparkles", desc: "Profile glow cosmetic" },
  { id: "m5", name: "Owl Companion", price: 1200, icon: "Bird", desc: "Animated companion on dashboard" },
  { id: "m6", name: "Premium Theme: Dim", price: 600, icon: "Palette", desc: "Unlock a stylish slate theme" },
];

export const TESTIMONIALS = [
  { id: "t1", name: "Priya Sharma", role: "Frontend Dev @ Razorpay", text: "Skill Stack made daily learning addictive. The duels turned grind into play and the placements page literally landed me my job.", country: "🇮🇳", stars: 5, course: "React Mastery" },
  { id: "t2", name: "Lucas Müller", role: "Data Analyst @ Zalando", text: "I went from zero SQL to landing interviews in 3 months. The personalized suggestions felt like a real mentor.", country: "🇩🇪", stars: 5, course: "SQL & Database" },
  { id: "t3", name: "Ana Rodríguez", role: "UX Designer @ Cabify", text: "The design course made the whole field click. The certificate is gorgeous and HR teams actually noticed it.", country: "🇪🇸", stars: 5, course: "UI/UX Foundations" },
  { id: "t4", name: "Kenji Tanaka", role: "ML Intern @ Sony AI", text: "Andrew Ng's bootcamp + Skill Stack's quests made theory finally stick. Boss battles for real-world problems are genius.", country: "🇯🇵", stars: 5, course: "ML Bootcamp" },
];

export const SUGGESTIONS = [
  { id: "s1", type: "course", text: "Focus on completing Machine Learning Bootcamp (12% complete). Daily practice will boost your skills!", icon: "BookOpen" },
  { id: "s2", type: "streak", text: "You're on a roll! Maintain your learning streak to unlock the 'Week Warrior' badge.", icon: "Flame" },
  { id: "s3", type: "shop", text: "Visit the Marketplace and buy a 'Double XP Token' to accelerate your learning!", icon: "Store" },
  { id: "s4", type: "quest", text: "Complete more quests to earn bonus XP and coins. Try the Boss challenge!", icon: "Sword" },
  { id: "s5", type: "ai", text: "Based on your profile, learning TypeScript next would complement your JavaScript skills perfectly.", icon: "Brain" },
  { id: "s6", type: "project", text: "Build a portfolio project using React and deploy it on Vercel — great for interviews!", icon: "Briefcase" },
];
