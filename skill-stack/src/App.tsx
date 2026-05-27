import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Home, BookOpen, Scroll, Swords, Briefcase, Rocket, Lightbulb, Trophy, Award,
  Store, LineChart as LineChartIcon, FileText, GraduationCap, Star, Search, Bell, Flame, Coins,
  Zap, Globe2, Palette as PaletteIcon, X, Check, Play, ChevronRight, ChevronLeft, Sparkles,
  Atom, Code2, BarChart3, Database, Brain, Wand2, Footprints, Crown, Languages,
  Sword, Users, Gift, Snowflake, Bird, Target, Calendar, Clock, MapPin, IndianRupee,
  Building2, Send, Plus, Filter, Download, Upload, ScanLine, ChevronDown,
  Heart, MessageSquare, ThumbsUp, TrendingUp, Layers, type LucideIcon,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { COURSES, JOBS, QUESTS, BADGES, NOTIFICATIONS, MARKETPLACE, TESTIMONIALS, SUGGESTIONS, type Course } from "@/lib/data";
import { LANGS, t, LangContext, useT, type Lang, type DictKey } from "@/lib/i18n";
import { InnovationLabPage } from "./InnovationLab";
import { PortalChatbot } from "./PortalChatbot";

type ThemeName = "light" | "dark" | "dim";
type PageId =
  | "dashboard" | "courses" | "quests" | "duel" | "jobs" | "placements"
  | "suggestions" | "achievements" | "certificates" | "marketplace" | "analytics"
  | "ats" | "teach" | "testimonials" | "innovate";

const ICONS: Record<string, LucideIcon> = {
  Code2, Atom, BarChart3, Palette: PaletteIcon, Database, Brain,
  Footprints, Flame, Wand2, Search, Languages, Sword, Crown, Users,
  Zap, Snowflake, Gift, Sparkles, Bird, Target, Trophy, Briefcase,
};

/* -------------------- ROOT APP -------------------- */
export default function App() {
  const [theme, setTheme] = useState<ThemeName>(() => (localStorage.getItem("ss-theme") as ThemeName) || "light");
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("ss-lang") as Lang) || "en");
  const [page, setPage] = useState<PageId>("dashboard");
  const [user, setUser] = useState({ name: "Riya", level: 12, xp: 2450, xpMax: 3000, coins: 1250, streak: 15 });
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.remove("dark", "dim");
    if (theme === "dark") document.documentElement.classList.add("dark");
    if (theme === "dim") document.documentElement.classList.add("dim");
    localStorage.setItem("ss-theme", theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem("ss-lang", lang); }, [lang]);

  const addXp = (amount: number, message?: string) => {
    setUser((u) => {
      let xp = u.xp + amount;
      let level = u.level;
      let xpMax = u.xpMax;
      let leveled = false;
      while (xp >= xpMax) {
        xp -= xpMax;
        level += 1;
        xpMax = Math.round(xpMax * 1.15);
        leveled = true;
      }
      if (leveled) {
        setTimeout(() => triggerConfetti(), 100);
        toast({ title: `LEVEL UP! → Lvl ${level}`, description: "New cosmetics unlocked in the Marketplace." });
      } else if (message) {
        toast({ title: `+${amount} XP`, description: message });
      }
      return { ...u, xp, level, xpMax };
    });
  };
  const addCoins = (amount: number) => setUser((u) => ({ ...u, coins: u.coins + amount }));

  return (
    <LangContext.Provider value={lang}>
    <div className="min-h-screen w-full text-foreground relative overflow-hidden">
      <BackgroundBlobs />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          page={page} setPage={setPage}
          theme={theme} setTheme={setTheme}
          lang={lang} setLang={setLang}
        />
        <main className="flex-1 min-w-0 flex flex-col">
          <TopBar
            lang={lang} user={user}
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <div className="px-6 md:px-10 pb-16 pt-2 max-w-[1500px] w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {page === "dashboard" && <DashboardPage user={user} lang={lang} addXp={addXp} addCoins={addCoins} setPage={setPage} />}
                {page === "courses" && <CoursesPage addXp={addXp} />}
                {page === "quests" && <QuestsPage addXp={addXp} />}
                {page === "duel" && <DuelPage addXp={addXp} addCoins={addCoins} />}
                {page === "jobs" && <JobsPage />}
                {page === "placements" && <PlacementsPage />}
                {page === "suggestions" && <SuggestionsPage />}
                {page === "achievements" && <AchievementsPage />}
                {page === "certificates" && <CertificatesPage />}
                {page === "marketplace" && <MarketplacePage user={user} addCoins={addCoins} />}
                {page === "analytics" && <AnalyticsPage />}
                {page === "ats" && <ATSPage />}
                {page === "teach" && <TeachPage />}
                {page === "testimonials" && <TestimonialsPage />}
                {page === "innovate" && <InnovationLabPage />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <ConfettiHost />
      <Toaster />
      <PortalChatbot setPage={setPage} />
    </div>
    </LangContext.Provider>
  );
}

/* -------------------- BACKGROUND -------------------- */
function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-primary/30 blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-accent/30 blur-3xl animate-float-slow" style={{ animationDelay: "-6s" }} />
      <div className="absolute bottom-0 left-1/3 w-[480px] h-[480px] rounded-full bg-chart-4/30 blur-3xl animate-float-slow" style={{ animationDelay: "-12s" }} />
    </div>
  );
}

/* -------------------- SIDEBAR -------------------- */
function Sidebar({
  page, setPage, theme, setTheme, lang, setLang,
}: {
  page: PageId; setPage: (p: PageId) => void;
  theme: ThemeName; setTheme: (t: ThemeName) => void;
  lang: Lang; setLang: (l: Lang) => void;
}) {
  const items: { id: PageId; icon: LucideIcon; key: DictKey }[] = [
    { id: "dashboard", icon: Home, key: "dashboard" },
    { id: "courses", icon: BookOpen, key: "courses" },
    { id: "quests", icon: Scroll, key: "quests" },
    { id: "duel", icon: Swords, key: "duel" },
    { id: "jobs", icon: Briefcase, key: "jobs" },
    { id: "placements", icon: Rocket, key: "placements" },
    { id: "suggestions", icon: Lightbulb, key: "suggestions" },
    { id: "achievements", icon: Trophy, key: "achievements" },
    { id: "certificates", icon: Award, key: "certificates" },
    { id: "marketplace", icon: Store, key: "marketplace" },
    { id: "analytics", icon: LineChartIcon, key: "analytics" },
    { id: "ats", icon: FileText, key: "ats" },
    { id: "teach", icon: GraduationCap, key: "teach" },
    { id: "testimonials", icon: Star, key: "testimonials" },
    { id: "innovate", icon: Atom, key: "innovate" },
  ];

  return (
    <aside className="w-72 shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-thin border-r border-sidebar-border glass">
      <div className="px-5 py-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-8 px-2"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-stack-sm">
              <Layers className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/40 animate-pulse-ring" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-gradient-brand leading-none">{t(lang, "appName")}</div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">Learn · Battle · Earn</div>
          </div>
        </motion.div>

        <nav className="space-y-1">
          {items.map((it, i) => {
            const active = page === it.id;
            const Icon = it.icon;
            return (
              <motion.button
                key={it.id}
                onClick={() => setPage(it.id)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.02 * i, duration: 0.25 }}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${active ? "text-primary-foreground" : "text-sidebar-foreground hover:text-foreground"}`}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-accent shadow-stack-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 grid place-items-center w-7 h-7 rounded-lg">
                  <Icon className={`w-[18px] h-[18px] ${active ? "" : "text-primary"}`} strokeWidth={2.4} />
                </span>
                <span className="relative z-10">{t(lang, it.key)}</span>
                {active && <ChevronRight className="relative z-10 w-4 h-4 ml-auto" />}
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-7 pt-5 border-t border-sidebar-border">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Globe2 className="w-3.5 h-3.5" /> {t(lang, "language")}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`text-[11px] font-bold py-2 rounded-lg border transition ${lang === l.code ? "bg-primary text-primary-foreground border-transparent shadow-stack-sm" : "border-border bg-card hover:bg-muted"}`}>
                {l.flag}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-sidebar-border">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <PaletteIcon className="w-3.5 h-3.5" /> {t(lang, "theme")}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(["light", "dim", "dark"] as ThemeName[]).map((th) => (
              <button key={th} onClick={() => setTheme(th)}
                className={`text-[11px] font-bold py-2 rounded-lg border capitalize transition ${theme === th ? "bg-primary text-primary-foreground border-transparent shadow-stack-sm" : "border-border bg-card hover:bg-muted"}`}>
                {t(lang, th === "light" ? "themeLight" : th === "dark" ? "themeDark" : "themeDim")}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary/15 via-accent/10 to-transparent border border-border">
          <div className="flex items-center gap-2 text-sm font-bold mb-1"><Sparkles className="w-4 h-4 text-accent" /> Pro Tip</div>
          <p className="text-xs text-muted-foreground leading-relaxed">Daily quests double your XP gain. Don't break the streak.</p>
        </div>
      </div>
    </aside>
  );
}

/* -------------------- TOP BAR -------------------- */
function TopBar({
  lang, user, notifications, setNotifications,
}: {
  lang: Lang; user: { level: number; xp: number; xpMax: number; coins: number; streak: number };
  notifications: typeof NOTIFICATIONS;
  setNotifications: (n: typeof NOTIFICATIONS) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { toast } = useToast();
  const unread = notifications.filter((n) => n.unread).length;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="sticky top-0 z-30 px-6 md:px-10 pt-5 pb-3 bg-background/40 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-4 flex-wrap max-w-[1500px] mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) toast({ title: "Searching", description: `Results for "${query}"` });
          }}
          className="flex-1 min-w-[260px] flex items-center gap-2 bg-card border border-border rounded-full pl-5 pr-1 py-1 shadow-stack-sm"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, "search")}
            className="flex-1 bg-transparent outline-none text-sm py-2"
          />
          <Button type="submit" size="sm" className="rounded-full font-bold">{t(lang, "searchBtn")}</Button>
        </form>

        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setOpen((o) => !o)}
            whileHover={{ y: -2 }} whileTap={{ y: 1 }}
            className="relative w-12 h-12 rounded-full bg-card border border-border shadow-stack-sm grid place-items-center"
          >
            <motion.div animate={unread > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
              transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.7 }}>
              <Bell className="w-5 h-5" />
            </motion.div>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold grid place-items-center">
                {unread}
              </span>
            )}
          </motion.button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="absolute right-0 top-14 w-[380px] max-h-[480px] overflow-y-auto scrollbar-thin rounded-2xl bg-card border border-border shadow-stack-lg z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="font-bold flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</div>
                  <button
                    onClick={() => setNotifications(notifications.map((n) => ({ ...n, unread: false })))}
                    className="text-xs font-semibold text-primary hover:underline"
                  >Mark all read</button>
                </div>
                {notifications.map((n) => {
                  const palette: Record<string, string> = {
                    placement: "bg-success", internship: "bg-info",
                    tech: "bg-primary", event: "bg-chart-4",
                  };
                  return (
                    <div key={n.id} className={`flex gap-3 p-4 border-b border-border last:border-b-0 hover:bg-muted/60 cursor-pointer ${n.unread ? "bg-muted/40" : ""}`}>
                      <div className={`w-10 h-10 rounded-xl ${palette[n.type]} grid place-items-center text-white shrink-0`}>
                        {n.type === "placement" && <Rocket className="w-5 h-5" />}
                        {n.type === "internship" && <Briefcase className="w-5 h-5" />}
                        {n.type === "tech" && <Sparkles className="w-5 h-5" />}
                        {n.type === "event" && <Calendar className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{n.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
                        <div className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {n.time}</div>
                      </div>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-primary self-center" />}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1 bg-card border border-border rounded-full px-2 py-1 shadow-stack-sm">
          <Stat icon={Star} value={user.level} label={t(lang, "level")} color="text-primary" />
          <div className="w-px h-6 bg-border" />
          <Stat icon={Zap} value={<Counter value={user.xp} />} label="XP" color="text-info" />
          <div className="w-px h-6 bg-border" />
          <Stat icon={Coins} value={<Counter value={user.coins} />} label="" color="text-warning" />
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <Flame className="w-4 h-4 text-accent animate-flicker" />
            <span className="font-extrabold text-sm">{user.streak}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label, color }: { icon: LucideIcon; value: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="font-extrabold text-sm tabular-nums">{value}</span>
      {label && <span className="text-[11px] text-muted-foreground font-semibold">{label}</span>}
    </div>
  );
}

function Counter({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
  useEffect(() => { mv.set(value); }, [value, mv]);
  return <motion.span>{display}</motion.span>;
}

/* -------------------- DASHBOARD -------------------- */
function DashboardPage({ user, lang, addXp, addCoins, setPage }: {
  user: { name: string; level: number; xp: number; xpMax: number; streak: number };
  lang: Lang;
  addXp: (n: number, msg?: string) => void;
  addCoins: (n: number) => void;
  setPage: (p: PageId) => void;
}) {
  const [claimed, setClaimed] = useState(false);
  const { toast } = useToast();
  const xpPct = Math.min(100, (user.xp / user.xpMax) * 100);

  return (
    <div className="space-y-8 pt-4">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-chart-4 p-8 md:p-10 text-primary-foreground shadow-stack-lg"
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <svg className="w-full h-full"><defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dots)" /></svg>
        </div>
        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest opacity-80">{t(lang, "welcomeBack")}, {user.name}</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-2 leading-tight">{t(lang, "letsLearn")} <Flame className="inline w-9 h-9 -mt-1 animate-flicker" /></h1>
            <div className="mt-5 max-w-md">
              <div className="flex items-center justify-between text-sm font-bold mb-1.5">
                <span>Lvl {user.level}</span>
                <span>{user.xp} / {user.xpMax} XP</span>
              </div>
              <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="h-full bg-white/90 rounded-full shadow-inner" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
              <Button onClick={() => setPage("courses")} variant="secondary" className="rounded-full font-bold shadow-stack-sm">
                <Play className="w-4 h-4 mr-1.5 fill-current" /> {t(lang, "continueLearning")}
              </Button>
              <Button
                disabled={claimed}
                onClick={() => { setClaimed(true); addXp(50); addCoins(100); triggerConfetti(); toast({ title: "Daily reward claimed!", description: "+50 XP, +100 coins" }); }}
                className="rounded-full font-bold bg-white text-primary hover:bg-white/90 shadow-stack-sm"
              >
                <Gift className="w-4 h-4 mr-1.5" /> {claimed ? "Claimed today" : t(lang, "dailyReward")}
              </Button>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center gap-3 bg-white/15 backdrop-blur rounded-3xl p-6 border border-white/30">
            <div className="text-xs uppercase tracking-widest opacity-90 font-bold">{t(lang, "learningStreak")}</div>
            <div className="relative">
              <Flame className="w-24 h-24 text-amber-200 animate-flicker drop-shadow-2xl" />
              <div className="absolute inset-0 grid place-items-center text-3xl font-black">{user.streak}</div>
            </div>
            <div className="text-xs font-semibold opacity-90">days in a row</div>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Courses", value: 6, icon: BookOpen, color: "text-primary" },
          { label: "Quests Done", value: 47, icon: Scroll, color: "text-success" },
          { label: "Badges", value: BADGES.filter(b => b.earned).length, icon: Trophy, color: "text-warning" },
          { label: "Duels Won", value: 28, icon: Sword, color: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            whileHover={{ y: -4 }}
            className="relative rounded-2xl bg-card border border-border p-5 shadow-stack-sm overflow-hidden">
            <s.icon className={`w-7 h-7 ${s.color}`} />
            <div className="text-3xl font-black mt-2 tabular-nums">{s.value}</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* CONTINUE LEARNING */}
      <Section title={t(lang, "continueLearning")} icon={BookOpen}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COURSES.slice(0, 3).map((c, i) => (
            <CourseCard key={c.id} course={c} delay={i * 0.05} />
          ))}
        </div>
      </Section>

      {/* ELIGIBLE JOBS */}
      <Section title={t(lang, "eligibleJobs")} icon={Briefcase}>
        <div className="rounded-3xl bg-card border border-border p-6 shadow-stack-sm">
          <div className="text-sm text-muted-foreground mb-4">Based on your average progress (53%), you qualify for:</div>
          <div className="flex flex-wrap gap-3">
            {["Junior Frontend Dev", "QA Automation", "Data Analyst Intern", "Junior UX Designer", "Support Engineer"].map((r, i) => (
              <motion.div key={r}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}
                whileHover={{ y: -3 }}
                className="px-4 py-2.5 rounded-full bg-gradient-to-br from-secondary to-muted border border-border font-bold text-sm flex items-center gap-2 shadow-stack-sm">
                <Check className="w-4 h-4 text-success" /> {r}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* HEATMAP */}
      <Section title={t(lang, "activityHeatmap")} icon={TrendingUp}>
        <Heatmap />
      </Section>
    </div>
  );
}

function PageHeader({ titleKey, subtitleKey, icon: Icon, children, titleOverride, subtitleOverride }: { titleKey?: DictKey; subtitleKey?: DictKey; icon: LucideIcon; children?: React.ReactNode; titleOverride?: string; subtitleOverride?: string }) {
  const tt = useT();
  const title = titleOverride ?? (titleKey ? tt(titleKey) : "");
  const subtitle = subtitleOverride ?? (subtitleKey ? tt(subtitleKey) : "");
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-stack-sm">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-stack-sm">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Heatmap() {
  const days = useMemo(() => Array.from({ length: 84 }, () => Math.floor(Math.random() * 5)), []);
  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-stack-sm">
      <div className="grid grid-flow-col grid-rows-7 gap-1.5">
        {days.map((d, i) => (
          <motion.div key={i}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.005 }}
            className="aspect-square rounded-md"
            style={{ background: d === 0 ? "hsl(var(--muted))" : `hsl(var(--success) / ${0.25 + d * 0.18})` }}
            title={`Day ${i + 1}: ${d} sessions`} />
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground font-semibold">
        <span>12 weeks ago</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {[0.25, 0.45, 0.65, 0.85, 1].map((o) => (
            <span key={o} className="w-3 h-3 rounded" style={{ background: `hsl(var(--success) / ${o})` }} />
          ))}
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </div>
  );
}

/* -------------------- COURSE CARD -------------------- */
function CourseCard({ course, delay = 0 }: { course: Course; delay?: number }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[course.icon] ?? Code2;
  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        whileHover={{ y: -6 }}
        className="text-left rounded-3xl bg-card border border-border p-4 shadow-stack-sm hover:shadow-stack transition-shadow"
      >
        <div className={`relative h-32 rounded-2xl bg-gradient-to-br ${course.color} grid place-items-center overflow-hidden`}>
          <Icon className="w-14 h-14 text-white drop-shadow-lg" strokeWidth={1.8} />
          <div className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/30 backdrop-blur px-2 py-0.5 rounded-full">{course.category}</div>
          <div className="absolute top-2 right-2 text-[11px] font-bold text-white bg-black/30 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />{course.rating}
          </div>
        </div>
        <div className="px-1 pt-3">
          <h3 className="font-extrabold text-base leading-snug line-clamp-1">{course.title}</h3>
          <div className="text-xs text-muted-foreground mt-1">{course.instructor} · {course.hours}h · {(course.students / 1000).toFixed(0)}k learners</div>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} transition={{ duration: 1, delay: delay + 0.2 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[11px] font-bold">
            <span className="text-muted-foreground">{course.progress}% complete</span>
            <span className="text-primary flex items-center gap-0.5">Resume <ChevronRight className="w-3 h-3" /></span>
          </div>
        </div>
      </motion.button>
      <CourseDetailDialog course={course} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function CourseDetailDialog({ course, open, onClose }: { course: Course; open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"overview" | "quiz">("overview");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl rounded-3xl border-2 shadow-stack-lg p-0 overflow-hidden">
        <div className={`relative h-32 bg-gradient-to-br ${course.color} flex items-end p-5`}>
          <div className="text-white">
            <div className="text-xs font-bold uppercase tracking-wider opacity-90">{course.category}</div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold text-white">{course.title}</DialogTitle>
            </DialogHeader>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="font-semibold">{course.instructor}</span> ·
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-warning text-warning" /> {course.rating}</span> ·
            <span>{course.hours}h</span>
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "overview" | "quiz")}>
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Chapters</TabsTrigger>
              <TabsTrigger value="quiz" className="flex-1">Practice Quiz</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
              {course.chapters.map((ch, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${ch.done ? "bg-success/10 border-success/40" : "bg-muted/50 border-border"}`}>
                  <div className={`w-8 h-8 rounded-full grid place-items-center font-bold text-sm ${ch.done ? "bg-success text-white" : "bg-card border border-border"}`}>
                    {ch.done ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{ch.title}</div>
                    <div className="text-xs text-muted-foreground">{ch.minutes} min</div>
                  </div>
                  <Play className="w-4 h-4 text-primary" />
                </motion.div>
              ))}
            </TabsContent>
            <TabsContent value="quiz" className="mt-4">
              <QuizMini course={course} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function QuizMini({ course }: { course: Course }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const q = course.quiz[idx];

  if (done) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-16 h-16 mx-auto text-warning" />
        <div className="text-2xl font-extrabold mt-3">{score} / {course.quiz.length}</div>
        <div className="text-sm text-muted-foreground mt-1">Quiz complete!</div>
        <Button onClick={() => { setIdx(0); setPicked(null); setScore(0); setDone(false); }} className="mt-4 rounded-full">Try again</Button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-muted-foreground mb-3">
        <span>Question {idx + 1} / {course.quiz.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="text-base font-bold mb-4">{q.q}</div>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = picked !== null && i === q.answer;
          const isWrong = isPicked && i !== q.answer;
          return (
            <button key={i} disabled={picked !== null}
              onClick={() => { setPicked(i); if (i === q.answer) setScore((s) => s + 1); }}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold text-sm transition ${isCorrect ? "bg-success/15 border-success" : isWrong ? "bg-destructive/15 border-destructive" : "border-border hover:bg-muted"}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <Button className="mt-4 w-full rounded-full" onClick={() => {
          if (idx + 1 >= course.quiz.length) { setDone(true); toast({ title: `Quiz complete: ${score + (picked === q.answer ? 0 : 0)}/${course.quiz.length}` }); }
          else { setIdx((i) => i + 1); setPicked(null); }
        }}>
          {idx + 1 >= course.quiz.length ? "Finish" : "Next question"}
        </Button>
      )}
    </div>
  );
}

/* -------------------- COURSES PAGE -------------------- */
function CoursesPage({ addXp }: { addXp: (n: number) => void }) {
  const [filter, setFilter] = useState<string>("All");
  const cats = ["All", ...Array.from(new Set(COURSES.map((c) => c.category)))];
  const filtered = filter === "All" ? COURSES : COURSES.filter((c) => c.category === filter);
  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="courses" subtitleKey="coursesSubtitle" icon={BookOpen} />
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full font-bold text-sm border transition ${filter === c ? "bg-primary text-primary-foreground border-transparent shadow-stack-sm" : "bg-card border-border hover:bg-muted"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c, i) => <CourseCard key={c.id} course={c} delay={i * 0.04} />)}
      </div>
    </div>
  );
}

/* -------------------- QUESTS -------------------- */
function QuestsPage({ addXp }: { addXp: (n: number, m?: string) => void }) {
  const [quests, setQuests] = useState(QUESTS);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const tt = useT();

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const ideas = [
        { title: "AI: Master Closures", desc: "Solve 5 closure puzzles", xp: 200, goal: 5 },
        { title: "AI: Tame Async/Await", desc: "Refactor 3 callback chains", xp: 350, goal: 3 },
        { title: "AI: SQL Window Drills", desc: "Write 4 window-function queries", xp: 400, goal: 4 },
        { title: "AI: CSS Grid Combat", desc: "Recreate 3 layouts from screenshot", xp: 300, goal: 3 },
      ];
      const pick = ideas[Math.floor(Math.random() * ideas.length)];
      setQuests((q) => [{ id: `aq${Date.now()}`, title: pick.title, desc: pick.desc, xp: pick.xp, progress: 0, goal: pick.goal, type: "daily" }, ...q]);
      setGenerating(false);
      toast({ title: "New AI quest created", description: pick.title });
      triggerConfetti();
    }, 1500);
  };

  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="questsTitle" subtitleKey="questsSubtitle" icon={Scroll}>
        <Button onClick={generate} disabled={generating} className="rounded-full font-bold">
          {generating ? <><Sparkles className="w-4 h-4 mr-1.5 animate-spin" /> {tt("generating")}</> : <><Wand2 className="w-4 h-4 mr-1.5" /> {tt("generateQuest")}</>}
        </Button>
      </PageHeader>

      <div className="grid md:grid-cols-2 gap-4">
        {quests.map((q, i) => {
          const pct = (q.progress / q.goal) * 100;
          const styles: Record<string, string> = {
            daily: "border-l-primary",
            weekly: "border-l-info",
            boss: "border-l-destructive bg-gradient-to-r from-destructive/10 to-transparent",
          };
          return (
            <motion.div key={q.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ x: 4 }}
              className={`rounded-2xl bg-card border border-border border-l-[6px] ${styles[q.type]} p-5 shadow-stack-sm`}>
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl grid place-items-center text-white shrink-0 ${q.type === "boss" ? "bg-destructive" : q.type === "weekly" ? "bg-info" : "bg-primary"}`}>
                  {q.type === "boss" ? <Sword className="w-5 h-5" /> : q.type === "weekly" ? <Calendar className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-extrabold">{q.title}</div>
                    <div className="text-xs font-bold text-warning flex items-center gap-1"><Zap className="w-3 h-3 fill-warning" /> +{q.xp} XP</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{q.desc}</div>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9 }}
                      className="h-full bg-gradient-to-r from-primary to-accent" />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-xs font-bold">
                    <span className="text-muted-foreground">{q.progress} / {q.goal}</span>
                    <button onClick={() => {
                      setQuests((qs) => qs.map((qq) => qq.id === q.id ? { ...qq, progress: Math.min(qq.goal, qq.progress + 1) } : qq));
                      addXp(Math.round(q.xp / q.goal), "Quest progress");
                    }} className="text-primary hover:underline">+1 progress</button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- DUEL -------------------- */
function DuelPage({ addXp, addCoins }: { addXp: (n: number, m?: string) => void; addCoins: (n: number) => void }) {
  const tt = useT();
  const [phase, setPhase] = useState<"idle" | "matching" | "battle" | "result">("idle");
  const [opp, setOpp] = useState({ name: "AlexQ", level: 11, avatar: "AQ" });
  const [time, setTime] = useState(15);
  const [qIdx, setQIdx] = useState(0);
  const [you, setYou] = useState(0);
  const [them, setThem] = useState(0);
  const battleQ = COURSES[0].quiz;

  useEffect(() => {
    if (phase !== "battle") return;
    if (time === 0) { setQIdx((i) => i + 1); setTime(15); return; }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time]);

  useEffect(() => {
    if (phase === "battle" && qIdx >= battleQ.length) {
      setPhase("result");
      const win = you > them;
      if (win) { addXp(400, "Duel victory"); addCoins(150); triggerConfetti(); }
    }
  }, [qIdx, phase]);

  const startMatch = () => {
    setPhase("matching");
    setTimeout(() => {
      setOpp({ name: ["AlexQ", "MiraK", "ZaneT", "NoraB"][Math.floor(Math.random() * 4)], level: 10 + Math.floor(Math.random() * 5), avatar: "OP" });
      setQIdx(0); setYou(0); setThem(0); setTime(15);
      setPhase("battle");
    }, 2200);
  };
  const answer = (i: number) => {
    if (i === battleQ[qIdx].answer) setYou((s) => s + 100);
    if (Math.random() > 0.4) setThem((s) => s + 100);
    setQIdx((q) => q + 1); setTime(15);
  };

  const leaderboard = [
    { name: "Riya (You)", xp: 12450, you: true },
    { name: "AlexQ", xp: 11820 },
    { name: "MiraK", xp: 10980 },
    { name: "ZaneT", xp: 9740 },
    { name: "NoraB", xp: 9210 },
  ];

  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="duelTitle" subtitleKey="duelSubtitle" icon={Swords} />

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-3xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-8 shadow-stack-sm min-h-[420px] grid place-items-center">
          {phase === "idle" && (
            <div className="text-center space-y-5">
              <motion.div animate={{ rotate: [0, -8, 8, -8, 0] }} transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 0.8 }}>
                <Swords className="w-24 h-24 text-accent mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-extrabold">{tt("readyBattle")}</h3>
              <p className="text-sm text-muted-foreground max-w-sm">{tt("duelDesc")}</p>
              <Button size="lg" onClick={startMatch} className="rounded-full font-extrabold shadow-stack-sm">
                <Play className="w-5 h-5 mr-2 fill-current" /> {tt("findMatch")}
              </Button>
            </div>
          )}
          {phase === "matching" && (
            <div className="text-center space-y-5">
              <div className="relative w-28 h-28 mx-auto">
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
                <div className="absolute inset-2 rounded-full bg-primary/40 animate-pulse-ring" style={{ animationDelay: "0.4s" }} />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold">{tt("searching")}</h3>
            </div>
          )}
          {phase === "battle" && qIdx < battleQ.length && (
            <div className="w-full max-w-2xl space-y-5">
              <div className="flex items-center justify-between">
                <Fighter name="You" avatar="YU" score={you} side="left" color="bg-primary" />
                <CountdownRing seconds={time} />
                <Fighter name={opp.name} avatar={opp.avatar} score={them} side="right" color="bg-destructive" />
              </div>
              <div className="rounded-2xl bg-card border border-border p-5">
                <div className="text-xs font-bold text-muted-foreground mb-2">Question {qIdx + 1} / {battleQ.length}</div>
                <div className="font-extrabold text-lg mb-4">{battleQ[qIdx].q}</div>
                <div className="grid grid-cols-2 gap-2">
                  {battleQ[qIdx].options.map((o, i) => (
                    <button key={i} onClick={() => answer(i)}
                      className="px-4 py-3 rounded-xl border-2 border-border bg-muted/40 hover:bg-primary hover:text-primary-foreground hover:border-primary font-bold text-sm transition">
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {phase === "result" && (
            <div className="text-center space-y-4">
              {you > them ? (
                <>
                  <Crown className="w-24 h-24 text-warning mx-auto drop-shadow-2xl" />
                  <h3 className="text-3xl font-black">{tt("victory")}</h3>
                  <p className="text-muted-foreground">{you} vs {them} · +400 XP, +150 coins</p>
                </>
              ) : (
                <>
                  <Sword className="w-24 h-24 text-muted-foreground mx-auto" />
                  <h3 className="text-3xl font-black">{tt("defeated")}</h3>
                  <p className="text-muted-foreground">{you} vs {them}</p>
                </>
              )}
              <Button onClick={() => setPhase("idle")} className="rounded-full font-bold">{tt("playAgain")}</Button>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-card border border-border p-5 shadow-stack-sm">
          <h4 className="font-extrabold flex items-center gap-2 mb-4"><Trophy className="w-5 h-5 text-warning" /> {tt("leaderboard")}</h4>
          <div className="space-y-2">
            {leaderboard.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${p.you ? "bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/40" : "bg-muted/40"}`}>
                <div className={`w-7 h-7 rounded-full grid place-items-center font-bold text-xs ${i === 0 ? "bg-warning text-white" : i === 1 ? "bg-muted-foreground text-white" : i === 2 ? "bg-accent text-white" : "bg-card border border-border"}`}>{i + 1}</div>
                <div className="flex-1 font-semibold text-sm">{p.name}</div>
                <div className="font-bold text-xs tabular-nums">{p.xp.toLocaleString()}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Fighter({ name, avatar, score, side, color }: { name: string; avatar: string; score: number; side: "left" | "right"; color: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${side === "right" ? "" : ""}`}>
      <div className={`w-14 h-14 rounded-2xl ${color} grid place-items-center font-black text-white shadow-stack-sm`}>{avatar}</div>
      <div className="font-bold text-sm">{name}</div>
      <div className="text-xs font-bold text-warning tabular-nums">{score}</div>
    </div>
  );
}

function CountdownRing({ seconds }: { seconds: number }) {
  const max = 15;
  const pct = (seconds / max) * 100;
  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" className="stroke-muted" />
        <motion.circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" strokeLinecap="round"
          className="stroke-accent"
          strokeDasharray={`${(pct / 100) * 2 * Math.PI * 44} ${2 * Math.PI * 44}`}
          animate={{ strokeDasharray: `${(pct / 100) * 2 * Math.PI * 44} ${2 * Math.PI * 44}` }}
          transition={{ duration: 0.5 }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-black text-2xl tabular-nums">{seconds}</div>
    </div>
  );
}

/* -------------------- JOBS -------------------- */
function JobsPage() {
  const tt = useT();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"All" | "Full-time" | "Internship">("All");
  const filtered = JOBS.filter((j) =>
    (type === "All" || j.type === type) &&
    (q === "" || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="jobsTitle" subtitleKey="jobsSubtitle" icon={Briefcase} />
      <div className="flex gap-3 flex-wrap">
        <Input placeholder={tt("searchTitleCompany")} value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs rounded-full" />
        <div className="flex gap-1 bg-card border border-border rounded-full p-1 shadow-stack-sm">
          {(["All", "Full-time", "Internship"] as const).map((tp) => (
            <button key={tp} onClick={() => setType(tp)}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition ${type === tp ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              {tp === "All" ? tt("typeAll") : tp === "Full-time" ? tt("typeFull") : tt("typeIntern")}
            </button>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((j, i) => <JobCard key={j.id} job={j} delay={i * 0.04} />)}
      </div>
    </div>
  );
}

function JobCard({ job, delay }: { job: typeof JOBS[number]; delay: number }) {
  const { toast } = useToast();
  const tt = useT();
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -4 }}
      className="rounded-3xl bg-card border border-border p-5 shadow-stack-sm">
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl ${job.logoColor} grid place-items-center text-white font-black text-lg shrink-0`}>
          {job.company[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-base leading-tight">{job.title}</h3>
              <div className="text-sm text-muted-foreground font-semibold">{job.company} · <span className="text-[11px] uppercase">{job.source}</span></div>
            </div>
            <MatchRing pct={job.match} />
          </div>
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground font-semibold">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
            <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {job.salary}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.posted}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.tags.map((t) => (
              <span key={t} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted border border-border">{t}</span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs font-bold text-success flex items-center gap-1"><Building2 className="w-3 h-3" /> {job.type}</span>
            <Button size="sm" onClick={() => toast({ title: "Application sent!", description: `${job.company} · ${job.title}` })}
              className="rounded-full font-bold">
              {tt("apply")} <Send className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MatchRing({ pct }: { pct: number }) {
  const r = 22, c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  const color = pct >= 85 ? "stroke-success" : pct >= 70 ? "stroke-warning" : "stroke-muted-foreground";
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg viewBox="0 0 50 50" className="w-full h-full -rotate-90">
        <circle cx="25" cy="25" r={r} className="fill-none stroke-muted" strokeWidth="5" />
        <motion.circle cx="25" cy="25" r={r} className={`fill-none ${color}`} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: off }} transition={{ duration: 1.2, ease: "easeOut" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-xs font-extrabold">{pct}%</div>
    </div>
  );
}

/* -------------------- PLACEMENTS -------------------- */
function PlacementsPage() {
  const tt = useT();
  const placements = JOBS.slice(0, 4).map((j, i) => ({ ...j, deadline: ["Tomorrow", "In 3 days", "This Friday", "Next Monday"][i] }));
  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="placementsTitle" subtitleKey="placementsSubtitle" icon={Rocket} />
      <div className="rounded-2xl bg-warning/15 border-2 border-warning/40 p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm font-semibold">{tt("placementBanner")}</div>
      </div>
      <div className="space-y-4">
        {placements.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-3xl bg-gradient-to-r from-card via-card to-primary/5 border border-border p-5 shadow-stack-sm flex flex-wrap items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl ${p.logoColor} grid place-items-center text-white font-black text-2xl shrink-0`}>{p.company[0]}</div>
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-extrabold text-lg">{p.title}</h3>
              <div className="text-sm text-muted-foreground">{p.company} · {p.location} · {p.salary}</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold uppercase text-destructive flex items-center gap-1"><Clock className="w-3 h-3" /> {tt("closes")}</div>
              <div className="font-extrabold">{p.deadline}</div>
            </div>
            <MatchRing pct={p.match} />
            <Button className="rounded-full font-bold shadow-stack-sm">{tt("applyNow")} <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- SUGGESTIONS -------------------- */
function SuggestionsPage() {
  const { toast } = useToast();
  const tt = useT();
  const palette: Record<string, string> = {
    course: "from-primary to-accent",
    streak: "from-orange-400 to-red-500",
    shop: "from-amber-400 to-warning",
    quest: "from-rose-500 to-destructive",
    ai: "from-violet-500 to-fuchsia-500",
    project: "from-sky-500 to-info",
  };
  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="suggestionsTitle" subtitleKey="suggestionsSubtitle" icon={Lightbulb} />
      <div className="grid md:grid-cols-2 gap-4">
        {SUGGESTIONS.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          return (
            <motion.button key={s.id}
              onClick={() => toast({ title: tt("aiRecommendation"), description: s.text })}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="text-left rounded-3xl bg-card border border-border p-6 shadow-stack-sm hover:shadow-stack transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${palette[s.type] ?? "from-primary to-accent"} grid place-items-center text-white shrink-0 shadow-stack-sm`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary">{tt("aiRecommendation")}</div>
                  <p className="text-sm mt-1.5 leading-relaxed">{s.text}</p>
                  <div className="mt-3 text-sm font-bold text-primary flex items-center gap-1">
                    {tt("takeAction")} <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- ACHIEVEMENTS -------------------- */
function AchievementsPage() {
  const tt = useT();
  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="achievementsTitle" subtitleKey="achievementsSubtitle" icon={Trophy} />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {BADGES.map((b, i) => {
          const Icon = ICONS[b.icon] ?? Trophy;
          return (
            <motion.div key={b.id}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className={`relative aspect-square rounded-3xl border-2 grid place-items-center p-4 text-center overflow-hidden ${b.earned ? "border-warning/60 bg-gradient-to-br from-warning/30 via-primary/20 to-accent/30 shadow-stack-sm" : "border-border bg-muted/40 opacity-60 grayscale"}`}>
              {b.earned && <div className="absolute inset-0 animate-shimmer opacity-20" />}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Icon className={`w-10 h-10 ${b.earned ? "text-warning drop-shadow" : "text-muted-foreground"}`} strokeWidth={2} />
                <div className="font-extrabold text-xs leading-tight">{b.name}</div>
                {!b.earned && <div className="text-[10px] uppercase font-bold text-muted-foreground">{tt("locked")}</div>}
              </div>
            </motion.div>
          );
        })}
      </div>
      <Section title="Activity Heatmap" icon={TrendingUp}><Heatmap /></Section>
    </div>
  );
}

/* -------------------- CERTIFICATES -------------------- */
function CertificatesPage() {
  const tt = useT();
  const [list, setList] = useState([
    { id: "c1", name: "Riya Sharma", course: "JavaScript Essentials", date: "Mar 12, 2026" },
    { id: "c2", name: "Riya Sharma", course: "UI/UX Foundations", date: "Feb 28, 2026" },
  ]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Riya Sharma");
  const [course, setCourse] = useState(COURSES[0].title);
  const { toast } = useToast();

  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="certificatesTitle" subtitleKey="certificatesSubtitle" icon={Award}>
        <Button onClick={() => setOpen(true)} className="rounded-full font-bold"><Plus className="w-4 h-4 mr-1.5" /> {tt("requestNew")}</Button>
      </PageHeader>
      <div className="grid md:grid-cols-2 gap-5">
        {list.map((c, i) => (
          <motion.div key={c.id}
            initial={{ opacity: 0, rotate: -2, y: 10 }} animate={{ opacity: 1, rotate: 0, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, rotate: 0.5 }}
            className="relative rounded-3xl p-1 bg-gradient-to-br from-warning via-primary to-accent shadow-stack-lg">
            <div className="rounded-[22px] bg-card p-7 text-center">
              <Award className="w-12 h-12 mx-auto text-warning" />
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mt-3">{tt("certCompletion")}</div>
              <div className="text-2xl font-black mt-3 text-gradient-brand">{c.name}</div>
              <div className="text-sm text-muted-foreground mt-2">{tt("hasCompleted")}</div>
              <div className="font-extrabold text-lg mt-1">{c.course}</div>
              <div className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-3">
                <span>{c.date}</span> · <span>{tt("verified")}</span>
              </div>
              <Button variant="outline" size="sm" className="mt-4 rounded-full" onClick={() => toast({ title: tt("certDownloaded") })}>
                <Download className="w-3.5 h-3.5 mr-1.5" /> {tt("download")}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-warning" /> {tt("requestCert")}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="rounded-2xl p-1 bg-gradient-to-br from-warning via-primary to-accent">
              <div className="rounded-[14px] bg-card p-5 text-center">
                <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{tt("preview")}</div>
                <div className="text-xl font-black mt-1 text-gradient-brand">{name || tt("yourName")}</div>
                <div className="text-xs">{course}</div>
              </div>
            </div>
            <Input placeholder={tt("fullName")} value={name} onChange={(e) => setName(e.target.value)} className="rounded-full" />
            <select className="w-full rounded-full border border-border bg-background py-2.5 px-4 font-semibold text-sm" value={course} onChange={(e) => setCourse(e.target.value)}>
              {COURSES.map((c) => <option key={c.id}>{c.title}</option>)}
            </select>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => setOpen(false)}>{tt("cancel")}</Button>
              <Button className="flex-1 rounded-full" onClick={() => {
                setList((l) => [{ id: `c${Date.now()}`, name, course, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...l]);
                setOpen(false); triggerConfetti(); toast({ title: tt("certGenerated") });
              }}>{tt("generate")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------- MARKETPLACE -------------------- */
function MarketplacePage({ user, addCoins }: { user: { coins: number }; addCoins: (n: number) => void }) {
  const { toast } = useToast();
  const tt = useT();
  const [owned, setOwned] = useState<string[]>([]);
  const buy = (id: string, price: number, name: string) => {
    if (user.coins < price) { toast({ title: tt("notEnough"), description: tt("notEnoughDesc") }); return; }
    addCoins(-price); setOwned((o) => [...o, id]);
    triggerConfetti(); toast({ title: `${tt("purchased")}: ${name}` });
  };
  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="marketplaceTitle" subtitleKey="marketplaceSubtitle" icon={Store}>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/20 border border-warning/40 font-extrabold">
          <Coins className="w-4 h-4 text-warning" /> {user.coins.toLocaleString()}
        </div>
      </PageHeader>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MARKETPLACE.map((m, i) => {
          const Icon = ICONS[m.icon] ?? Gift;
          const isOwned = owned.includes(m.id);
          return (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-card border border-border p-6 text-center shadow-stack-sm">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-stack-sm">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-extrabold mt-4">{m.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{m.desc}</p>
              <div className="flex items-center justify-center gap-1 mt-3 font-extrabold text-warning">
                <Coins className="w-4 h-4" /> {m.price}
              </div>
              <Button disabled={isOwned} onClick={() => buy(m.id, m.price, m.name)} className="rounded-full font-bold mt-3 w-full">
                {isOwned ? <><Check className="w-4 h-4 mr-1" /> {tt("owned")}</> : tt("buy")}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- ANALYTICS -------------------- */
function AnalyticsPage() {
  const tt = useT();
  const study = [
    { day: "Mon", min: 35 }, { day: "Tue", min: 60 }, { day: "Wed", min: 25 },
    { day: "Thu", min: 80 }, { day: "Fri", min: 50 }, { day: "Sat", min: 95 }, { day: "Sun", min: 70 },
  ];
  const skills = [
    { skill: "JavaScript", level: 88 }, { skill: "React", level: 74 }, { skill: "SQL", level: 52 },
    { skill: "Python", level: 60 }, { skill: "Design", level: 80 }, { skill: "ML", level: 35 },
  ];
  const weak = [
    { topic: "SQL Joins", score: 58 }, { topic: "Async/Await", score: 64 },
    { topic: "CSS Grid", score: 70 }, { topic: "Hooks", score: 75 },
  ];
  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="analyticsTitle" subtitleKey="analyticsSubtitle" icon={LineChartIcon} />
      <div className="grid md:grid-cols-2 gap-5">
        <ChartCard title={tt("weeklyStudy")} icon={Clock}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={study} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <RTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Area type="monotone" dataKey="min" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={tt("skillMastery")} icon={Brain}>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={skills}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis tick={false} stroke="hsl(var(--border))" />
              <Radar dataKey="level" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="hsl(var(--accent))" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <ChartCard title={tt("weakAreas")} icon={Target}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weak} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="topic" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <RTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            <Bar dataKey="score" fill="hsl(var(--destructive))" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card border border-border p-5 shadow-stack-sm">
      <div className="flex items-center gap-2 mb-3 font-extrabold">
        <Icon className="w-4 h-4 text-primary" /> {title}
      </div>
      {children}
    </div>
  );
}

/* -------------------- ATS RESUME -------------------- */
function ATSPage() {
  const tt = useT();
  const [text, setText] = useState("");
  const [scan, setScan] = useState<{ score: number; matched: string[]; missing: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const target = ["React", "TypeScript", "Node.js", "REST", "GraphQL", "Postgres", "Docker", "Testing", "CI/CD", "Agile"];

  const run = () => {
    setLoading(true); setScan(null);
    setTimeout(() => {
      const lower = text.toLowerCase();
      const matched = target.filter((k) => lower.includes(k.toLowerCase()));
      const missing = target.filter((k) => !matched.includes(k));
      const score = Math.min(98, 30 + matched.length * 7 + Math.min(20, Math.floor(text.length / 80)));
      setScan({ score, matched, missing });
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="atsTitle" subtitleKey="atsSubtitle" icon={FileText} />
      <div className="grid md:grid-cols-[1fr_360px] gap-5">
        <div className="rounded-3xl bg-card border border-border p-5 shadow-stack-sm">
          <Textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder={tt("pastePlaceholder")}
            className="min-h-[280px] rounded-2xl border-2 border-dashed border-primary/40 bg-background/60 font-mono text-sm" />
          <div className="flex justify-between items-center mt-3">
            <div className="text-xs text-muted-foreground">{text.split(/\s+/).filter(Boolean).length} {tt("words")}</div>
            <Button onClick={run} disabled={loading || text.length < 30} className="rounded-full font-bold">
              {loading ? <><ScanLine className="w-4 h-4 mr-1.5 animate-pulse" /> {tt("scanning")}</> : <><ScanLine className="w-4 h-4 mr-1.5" /> {tt("scan")}</>}
            </Button>
          </div>
          {loading && (
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div initial={{ x: "-100%" }} animate={{ x: "200%" }} transition={{ repeat: Infinity, duration: 1.4 }}
                className="h-full w-1/3 bg-gradient-to-r from-primary to-accent" />
            </div>
          )}
        </div>
        <div className="rounded-3xl bg-card border border-border p-5 shadow-stack-sm">
          <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">{tt("atsScore")}</div>
          <AnimatePresence mode="wait">
            {scan ? (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="text-6xl font-black text-gradient-brand tabular-nums">
                  <Counter value={scan.score} />
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${scan.score}%` }} transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-success to-primary" />
                </div>
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase text-success">{tt("matched")}</div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {scan.matched.map((k) => <span key={k} className="text-[11px] font-bold px-2 py-1 rounded-full bg-success/15 text-success border border-success/30">{k}</span>)}
                    {!scan.matched.length && <span className="text-xs text-muted-foreground">{tt("noMatches")}</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-destructive">{tt("missingKw")}</div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {scan.missing.map((k) => <span key={k} className="text-[11px] font-bold px-2 py-1 rounded-full bg-destructive/15 text-destructive border border-destructive/30">{k}</span>)}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-sm text-muted-foreground py-8 text-center">{tt("pasteHint")}</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* -------------------- TEACH -------------------- */
function TeachPage() {
  const tt = useT();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", category: "Programming", difficulty: "Beginner", desc: "", chapters: "" });
  const { toast } = useToast();
  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="teachTitle" subtitleKey="teachSubtitle" icon={GraduationCap} />
      <div className="rounded-3xl bg-card border border-border p-6 shadow-stack-sm max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full grid place-items-center font-bold text-sm shrink-0 ${step >= s ? "bg-gradient-to-br from-primary to-accent text-white shadow-stack-sm" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 rounded-full ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }} className="space-y-3">
            {step === 1 && (
              <>
                <Label>{tt("courseTitle")}</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={tt("courseTitlePh")} className="rounded-xl" />
                <Label>{tt("category")}</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-border bg-background py-2.5 px-3 font-semibold">
                  {["Programming", "Frontend", "Data", "Design", "AI", "DevOps", "Mobile"].map((c) => <option key={c}>{c}</option>)}
                </select>
                <Label>{tt("difficulty")}</Label>
                <div className="flex gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map((d) => (
                    <button key={d} onClick={() => setForm({ ...form, difficulty: d })}
                      className={`flex-1 py-2 rounded-xl font-bold text-sm border ${form.difficulty === d ? "bg-primary text-primary-foreground border-transparent" : "border-border bg-background"}`}>{d}</button>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <Label>{tt("shortDesc")}</Label>
                <Textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder={tt("shortDescPh")} className="min-h-[120px] rounded-xl" />
                <Label>{tt("chaptersField")}</Label>
                <Textarea value={form.chapters} onChange={(e) => setForm({ ...form, chapters: e.target.value })}
                  placeholder={`Intro to Rust\nOwnership & Borrowing\nBuilding a Web API`} className="min-h-[140px] rounded-xl font-mono text-sm" />
              </>
            )}
            {step === 3 && (
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent grid place-items-center mx-auto shadow-stack-sm">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-extrabold mt-4">{tt("readyPublish")}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tt("reviewNote")}</p>
                <div className="mt-4 rounded-2xl bg-muted/40 border border-border p-4 text-left text-sm">
                  <div className="font-bold">{form.title || tt("untitled")}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{form.category} · {form.difficulty}</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-6">
          <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)} className="rounded-full"><ChevronLeft className="w-4 h-4 mr-1" /> {tt("back")}</Button>
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)} className="rounded-full font-bold">{tt("next")} <ChevronRight className="w-4 h-4 ml-1" /></Button>
          ) : (
            <Button onClick={() => { toast({ title: tt("submitted") }); triggerConfetti(); setStep(1); setForm({ title: "", category: "Programming", difficulty: "Beginner", desc: "", chapters: "" }); }} className="rounded-full font-bold bg-success hover:bg-success/90">
              {tt("submit")} <Check className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2">{children}</div>;
}

/* -------------------- TESTIMONIALS -------------------- */
function TestimonialsPage() {
  const tt = useT();
  return (
    <div className="space-y-6 pt-4">
      <PageHeader titleKey="testimonialsTitle" subtitleKey="testimonialsSubtitle" icon={Star} />
      <div className="grid md:grid-cols-2 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-card border border-border p-6 shadow-stack-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center text-white font-black text-lg shrink-0 shadow-stack-sm">
                {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-extrabold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="text-2xl">{t.country}</div>
                </div>
                <div className="flex gap-0.5 mt-2">
                  {Array.from({ length: t.stars }).map((_, k) => <Star key={k} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm mt-3 leading-relaxed">"{t.text}"</p>
                <div className="text-xs font-bold text-primary mt-3">{tt("via")} {t.course}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- CONFETTI -------------------- */
function triggerConfetti() {
  const ev = new CustomEvent("ss-confetti");
  window.dispatchEvent(ev);
}

function ConfettiHost() {
  const [bursts, setBursts] = useState<number[]>([]);
  useEffect(() => {
    const handler = () => setBursts((b) => [...b, Date.now()]);
    window.addEventListener("ss-confetti", handler);
    return () => window.removeEventListener("ss-confetti", handler);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {bursts.map((id) => <Burst key={id} id={id} done={() => setBursts((b) => b.filter((x) => x !== id))} />)}
      </AnimatePresence>
    </div>
  );
}

function Burst({ id, done }: { id: number; done: () => void }) {
  useEffect(() => {
    const t = setTimeout(done, 2000);
    return () => clearTimeout(t);
  }, [done]);
  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--success))", "hsl(var(--info))", "hsl(var(--chart-4))"];
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    x: (Math.random() - 0.5) * 700,
    y: -Math.random() * 500 - 100,
    rot: Math.random() * 720,
    color: colors[i % colors.length],
    delay: Math.random() * 0.1,
  }));
  return (
    <div className="absolute left-1/2 top-1/2">
      {pieces.map((p, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y + 600, opacity: 0, rotate: p.rot }}
          transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
          style={{ position: "absolute", width: 10, height: 14, background: p.color, borderRadius: 2 }} />
      ))}
    </div>
  );
}
