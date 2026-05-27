import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, Brain, Gamepad2, Users, Accessibility, Camera, Wifi, WifiOff,
  ScrollText, FlaskConical, Map as MapIcon, Trophy, UserCheck, MessageSquare,
  Pencil, Eye, Hand, Globe, Sparkles, Send, Check, Play, Pause, Volume2,
  Beaker, Zap, Crown, Smile, Frown, Meh, Type as TypeIcon, Contrast, Languages,
  ChevronRight, Star, Bot, Mic, Award, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/lib/i18n";

/* -------------------- PAGE -------------------- */
export function InnovationLabPage() {
  const tt = useT();
  return (
    <div className="space-y-10 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ rotate: -20, scale: 0.7 }} animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-chart-4 grid place-items-center shadow-stack-lg relative"
          >
            <Atom className="w-7 h-7 text-white" />
            <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/40 animate-pulse-ring" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gradient-brand">{tt("innovateTitle")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{tt("innovateSubtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/30 text-xs font-extrabold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-primary" /> {tt("experimental")}
        </div>
      </div>

      <Section title={tt("aiSection")} icon={Brain} hue="from-violet-500 to-fuchsia-500">
        <EmotionResponsive />
        <OfflineAI />
        <Microlearning />
      </Section>

      <Section title={tt("immersiveSection")} icon={Gamepad2} hue="from-orange-500 to-rose-500">
        <VRLab />
        <SkillQuestMap />
        <LiveTrivia />
      </Section>

      <Section title={tt("socialSection")} icon={Users} hue="from-sky-500 to-cyan-500">
        <StudyGroupMatch />
        <SocialAnnotation />
        <BottomUpAuthoring />
      </Section>

      <Section title={tt("inclusivitySection")} icon={Accessibility} hue="from-emerald-500 to-teal-500">
        <AdaptiveUI />
        <SignLanguage />
        <DialectTranscription />
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children, hue }: { title: string; icon: LucideIcon; children: React.ReactNode; hue: string }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${hue} grid place-items-center shadow-stack-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">{children}</div>
    </section>
  );
}

function FeatureCard({
  icon: Icon, title, desc, accent, children,
}: { icon: LucideIcon; title: string; desc: string; accent: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl bg-card border border-border p-5 shadow-stack-sm flex flex-col gap-4"
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${accent} grid place-items-center shrink-0 shadow-stack-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-extrabold leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">{desc}</p>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

/* ============================================================
   1. EMOTION-RESPONSIVE LEARNING
============================================================ */
function EmotionResponsive() {
  const tt = useT();
  const [on, setOn] = useState(false);
  const [emotion, setEmotion] = useState<"focused" | "confused" | "bored">("focused");
  useEffect(() => {
    if (!on) return;
    const cycle: typeof emotion[] = ["focused", "focused", "confused", "focused", "bored", "focused"];
    let i = 0;
    const id = setInterval(() => { setEmotion(cycle[i % cycle.length]); i++; }, 2200);
    return () => clearInterval(id);
  }, [on]);
  const Face = emotion === "focused" ? Smile : emotion === "confused" ? Meh : Frown;
  const colorMap = { focused: "text-success", confused: "text-warning", bored: "text-destructive" };
  return (
    <FeatureCard icon={Camera} title={tt("emotionTitle")} desc={tt("emotionDesc")} accent="from-violet-500 to-fuchsia-500">
      <div className="rounded-2xl bg-muted/40 border border-border aspect-video relative overflow-hidden">
        {on ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10" />
            <motion.div
              animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 grid place-items-center"
            >
              <Face className={`w-20 h-20 ${colorMap[emotion]}`} strokeWidth={1.5} />
            </motion.div>
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/90 text-white text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> REC
            </div>
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-card/90 border border-border text-[11px] font-extrabold uppercase tracking-wider">
              {emotion}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <Camera className="w-10 h-10 opacity-40" />
          </div>
        )}
      </div>
      <AnimatePresence>
        {on && emotion !== "focused" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-xl bg-warning/15 border border-warning/40 p-2.5 text-xs font-bold flex items-center gap-2 mt-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-warning" />
            {emotion === "confused" ? tt("emotionConfused") : tt("emotionBored")}
          </motion.div>
        )}
      </AnimatePresence>
      <Button onClick={() => setOn((v) => !v)} className="rounded-full font-bold mt-3 w-full">
        {on ? tt("stopCamera") : tt("startCamera")}
      </Button>
    </FeatureCard>
  );
}

/* ============================================================
   2. ON-DEVICE OFFLINE AI
============================================================ */
function OfflineAI() {
  const tt = useT();
  const [offline, setOffline] = useState(true);
  const [msgs, setMsgs] = useState<{ from: "me" | "ai"; text: string }[]>([
    { from: "ai", text: tt("aiGreeting") },
  ]);
  const [input, setInput] = useState("");
  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setInput("");
    setTimeout(() => {
      const replies: Record<string, string> = {
        default: tt("aiDefault"),
        hi: tt("aiHi"),
        help: tt("aiHelp"),
      };
      const lower = q.toLowerCase();
      const reply =
        lower.includes("hi") || lower.includes("hello") ? replies.hi :
        lower.includes("help") || lower.includes("?") ? replies.help :
        replies.default;
      setMsgs((m) => [...m, { from: "ai", text: reply }]);
    }, offline ? 80 : 700);
  };
  return (
    <FeatureCard icon={offline ? WifiOff : Wifi} title={tt("offlineAITitle")} desc={tt("offlineAIDesc")} accent="from-indigo-500 to-violet-600">
      <div className="flex items-center justify-between rounded-xl bg-muted/40 border border-border px-3 py-2 mb-3 text-xs font-bold">
        <span className="flex items-center gap-2">
          <Bot className="w-3.5 h-3.5 text-primary" /> {offline ? tt("offlineMode") : tt("onlineMode")}
        </span>
        <button onClick={() => setOffline((v) => !v)} className={`relative w-10 h-5 rounded-full transition ${offline ? "bg-success" : "bg-muted-foreground/30"}`}>
          <motion.span layout className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow" style={{ left: offline ? 22 : 2 }} />
        </button>
        <span className="text-[10px] text-muted-foreground">{offline ? "~80ms" : "~700ms"}</span>
      </div>
      <div className="rounded-2xl bg-muted/30 border border-border p-3 h-44 overflow-y-auto space-y-2 scrollbar-thin">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] text-xs px-3 py-2 rounded-2xl ${m.from === "me" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={tt("askAnything")} className="rounded-full text-sm" />
        <Button size="sm" onClick={send} className="rounded-full"><Send className="w-3.5 h-3.5" /></Button>
      </div>
    </FeatureCard>
  );
}

/* ============================================================
   3. AI-GENERATED MICROLEARNING
============================================================ */
function Microlearning() {
  const tt = useT();
  const [text, setText] = useState("");
  const [chunks, setChunks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const example = tt("microExample");
  const distill = () => {
    const src = text.trim() || example;
    setLoading(true); setChunks([]);
    setTimeout(() => {
      const sents = src.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 8);
      const grouped: string[] = [];
      const per = Math.max(1, Math.ceil(sents.length / 4));
      for (let i = 0; i < sents.length; i += per) {
        grouped.push(sents.slice(i, i + per).join(". ") + ".");
      }
      setChunks(grouped.slice(0, 5));
      setLoading(false);
    }, 1100);
  };
  return (
    <FeatureCard icon={ScrollText} title={tt("microTitle")} desc={tt("microDesc")} accent="from-fuchsia-500 to-pink-500">
      <Textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder={tt("microPh")} className="rounded-2xl text-xs min-h-[80px]" />
      <Button onClick={distill} disabled={loading} className="rounded-full font-bold w-full mt-2">
        {loading ? <><Sparkles className="w-3.5 h-3.5 mr-1.5 animate-spin" /> {tt("distilling")}</> : <><Sparkles className="w-3.5 h-3.5 mr-1.5" /> {tt("distill")}</>}
      </Button>
      <div className="mt-3 space-y-2">
        <AnimatePresence>
          {chunks.map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: i * 0.12 }}
              className="rounded-xl border border-border bg-muted/30 p-2.5 text-xs flex gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 grid place-items-center text-white font-extrabold text-[10px] shrink-0">{i + 1}</div>
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase text-fuchsia-500 mb-0.5">{tt("module")} {i + 1} · 5 min</div>
                {c}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FeatureCard>
  );
}

/* ============================================================
   4. VR HANDS-ON LAB
============================================================ */
function VRLab() {
  const tt = useT();
  const [mix, setMix] = useState<"none" | "stable" | "explode">("none");
  const colors = mix === "explode" ? "from-rose-500 via-amber-400 to-yellow-300" : mix === "stable" ? "from-sky-400 to-emerald-400" : "from-slate-400 to-slate-500";
  return (
    <FeatureCard icon={FlaskConical} title={tt("vrTitle")} desc={tt("vrDesc")} accent="from-rose-500 to-orange-500">
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-700 aspect-square overflow-hidden grid place-items-center">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
        <motion.div
          animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-32 h-40"
        >
          <div className="absolute inset-x-4 top-0 h-6 rounded-t-lg bg-slate-200/30 border border-white/30" />
          <div className="absolute inset-x-2 top-5 bottom-0 rounded-b-2xl border-2 border-white/40 overflow-hidden">
            <motion.div
              animate={{ height: mix === "none" ? "40%" : "70%" }}
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colors}`}
            >
              {mix === "explode" && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div key={i}
                      initial={{ y: 0, opacity: 1 }} animate={{ y: -100 - Math.random() * 60, x: (Math.random() - 0.5) * 80, opacity: 0 }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                      className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-yellow-300" />
                  ))}
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/50 text-[10px] font-bold text-emerald-100 uppercase tracking-widest">3D Lab</div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <Button size="sm" variant="outline" onClick={() => setMix("none")} className="rounded-full text-xs"><Beaker className="w-3 h-3 mr-1" />{tt("reset")}</Button>
        <Button size="sm" onClick={() => setMix("stable")} className="rounded-full text-xs bg-emerald-500 hover:bg-emerald-600"><Check className="w-3 h-3 mr-1" />{tt("safe")}</Button>
        <Button size="sm" onClick={() => setMix("explode")} className="rounded-full text-xs bg-rose-500 hover:bg-rose-600"><Zap className="w-3 h-3 mr-1" />{tt("react")}</Button>
      </div>
    </FeatureCard>
  );
}

/* ============================================================
   5. SKILL QUEST PATH (RPG MAP)
============================================================ */
function SkillQuestMap() {
  const tt = useT();
  const nodes = [
    { id: 1, x: 12, y: 75, label: "JS" },
    { id: 2, x: 32, y: 45, label: "React" },
    { id: 3, x: 52, y: 70, label: "Node" },
    { id: 4, x: 72, y: 35, label: "AI" },
    { id: 5, x: 90, y: 60, label: "Boss" },
  ];
  const [unlocked, setUnlocked] = useState<number[]>([1]);
  const [avatarLvl, setAvatarLvl] = useState(1);
  const tap = (id: number) => {
    if (unlocked.includes(id)) return;
    if (!unlocked.includes(id - 1)) return;
    setUnlocked((u) => [...u, id]);
    setAvatarLvl((l) => l + 1);
  };
  const last = unlocked[unlocked.length - 1];
  const lastNode = nodes.find((n) => n.id === last)!;
  return (
    <FeatureCard icon={MapIcon} title={tt("questPathTitle")} desc={tt("questPathDesc")} accent="from-amber-500 to-orange-600">
      <div className="relative rounded-2xl bg-gradient-to-br from-emerald-50 via-amber-50 to-rose-50 dark:from-emerald-950/40 dark:via-amber-950/40 dark:to-rose-950/40 aspect-[16/9] border border-border overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {nodes.slice(0, -1).map((n, i) => {
            const next = nodes[i + 1];
            return (
              <line key={i} x1={`${n.x}%`} y1={`${n.y}%`} x2={`${next.x}%`} y2={`${next.y}%`}
                stroke={unlocked.includes(next.id) ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth="3" strokeDasharray={unlocked.includes(next.id) ? "0" : "4 4"} />
            );
          })}
        </svg>
        {nodes.map((n) => {
          const isUnlocked = unlocked.includes(n.id);
          const isNext = !isUnlocked && unlocked.includes(n.id - 1);
          const isBoss = n.id === 5;
          return (
            <button key={n.id} onClick={() => tap(n.id)}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group">
              <motion.div
                animate={isNext ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 1.4 }}
                className={`w-10 h-10 rounded-full grid place-items-center text-[10px] font-extrabold shadow-stack-sm border-2 ${
                  isUnlocked ? "bg-gradient-to-br from-primary to-accent text-white border-white" :
                  isNext ? "bg-card border-primary text-primary" : "bg-muted border-border text-muted-foreground"
                }`}>
                {isBoss ? <Crown className="w-4 h-4" /> : n.label}
              </motion.div>
            </button>
          );
        })}
        {/* Avatar */}
        <motion.div
          animate={{ left: `${lastNode.x}%`, top: `${lastNode.y - 12}%` }}
          transition={{ type: "spring", stiffness: 120 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-warning to-rose-500 grid place-items-center shadow-stack-sm border-2 border-white">
              <Star className="w-3 h-3 text-white" fill="white" />
            </div>
            <div className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-success text-white text-[9px] font-extrabold grid place-items-center border border-white">{avatarLvl}</div>
          </div>
        </motion.div>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs font-bold">
        <span className="text-muted-foreground">{tt("avatarLvl")} <span className="text-foreground">{avatarLvl}</span></span>
        <span className="text-primary">{unlocked.length}/{nodes.length} {tt("unlocked")}</span>
      </div>
    </FeatureCard>
  );
}

/* ============================================================
   6. COMPETITIVE LIVE TRIVIA
============================================================ */
function LiveTrivia() {
  const tt = useT();
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(15);
  const [scores, setScores] = useState([20, 35, 28, 42]);
  const players = ["You", "Aarav", "Mei", "Lukas"];
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setScores((s) => s.map((x) => x + Math.floor(Math.random() * 6)));
      setT((tt) => (tt > 0 ? tt - 1 : 15));
    }, 900);
    return () => clearInterval(id);
  }, [running]);
  const max = Math.max(...scores);
  return (
    <FeatureCard icon={Trophy} title={tt("triviaTitle")} desc={tt("triviaDesc")} accent="from-yellow-500 to-orange-500">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" /> LIVE
          </div>
          <div className="text-2xl font-black tabular-nums">{String(t).padStart(2, "0")}</div>
        </div>
        <div className="space-y-2">
          {players.map((p, i) => (
            <div key={p}>
              <div className="flex justify-between text-[11px] font-bold mb-0.5">
                <span>{p === "You" ? tt("you") : p}</span><span>{scores[i]}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${(scores[i] / Math.max(max, 50)) * 100}%` }}
                  className={`h-full ${i === 0 ? "bg-gradient-to-r from-emerald-400 to-cyan-400" : "bg-white/40"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={() => setRunning((r) => !r)} className="rounded-full font-bold w-full mt-3">
        {running ? <><Pause className="w-3.5 h-3.5 mr-1.5" /> {tt("pause")}</> : <><Play className="w-3.5 h-3.5 mr-1.5" /> {tt("joinArena")}</>}
      </Button>
    </FeatureCard>
  );
}

/* ============================================================
   7. AI-MATCHED STUDY GROUPS
============================================================ */
function StudyGroupMatch() {
  const tt = useT();
  const peers = [
    { name: "Diego R.", skill: tt("logicExpert"), match: 96, color: "from-sky-500 to-cyan-500" },
    { name: "Saanvi M.", skill: tt("designExpert"), match: 91, color: "from-rose-500 to-pink-500" },
    { name: "Kenji T.", skill: tt("backendExpert"), match: 88, color: "from-emerald-500 to-teal-500" },
  ];
  const [matching, setMatching] = useState(false);
  const [match, setMatch] = useState<typeof peers[number] | null>(null);
  const find = () => {
    setMatching(true); setMatch(null);
    setTimeout(() => {
      setMatch(peers[Math.floor(Math.random() * peers.length)]);
      setMatching(false);
    }, 1500);
  };
  return (
    <FeatureCard icon={UserCheck} title={tt("studyGroupTitle")} desc={tt("studyGroupDesc")} accent="from-sky-500 to-blue-600">
      <div className="rounded-2xl bg-muted/30 border border-border p-4 min-h-[180px] flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center text-white font-black shadow-stack-sm">R</div>
          <AnimatePresence mode="wait">
            {matching && (
              <motion.div key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex gap-1">
                {[0,1,2].map((i) => (
                  <motion.span key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full bg-primary" />
                ))}
              </motion.div>
            )}
            {match && !matching && (
              <motion.div key="match" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">⇋</motion.div>
            )}
          </AnimatePresence>
          {match && !matching && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${match.color} grid place-items-center text-white font-black shadow-stack-sm`}>
              {match.name[0]}
            </motion.div>
          )}
        </div>
        {match && !matching && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="font-extrabold">{match.name}</div>
            <div className="text-xs text-muted-foreground">{match.skill}</div>
            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success text-[11px] font-bold">
              <Sparkles className="w-3 h-3" /> {match.match}% {tt("compat")}
            </div>
          </motion.div>
        )}
        {!match && !matching && (
          <div className="text-xs text-muted-foreground">{tt("findPair")}</div>
        )}
      </div>
      <Button onClick={find} disabled={matching} className="rounded-full font-bold w-full mt-3">
        {matching ? tt("searchingPeer") : tt("findStudyBuddy")}
      </Button>
    </FeatureCard>
  );
}

/* ============================================================
   8. SOCIAL ANNOTATION
============================================================ */
function SocialAnnotation() {
  const tt = useT();
  const [notes, setNotes] = useState([
    { ts: 22, by: "Riya", text: tt("noteSample1") },
    { ts: 58, by: "Diego", text: tt("noteSample2") },
    { ts: 102, by: "Mei", text: tt("noteSample3") },
  ]);
  const [active, setActive] = useState<number | null>(0);
  const [draft, setDraft] = useState("");
  const [scrub, setScrub] = useState(22);
  const total = 180;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const add = () => {
    if (!draft.trim()) return;
    setNotes((n) => [...n, { ts: scrub, by: "You", text: draft.trim() }]);
    setDraft("");
  };
  return (
    <FeatureCard icon={MessageSquare} title={tt("annotationTitle")} desc={tt("annotationDesc")} accent="from-cyan-500 to-blue-500">
      <div className="rounded-2xl bg-slate-900 aspect-video relative overflow-hidden">
        <div className="absolute inset-0 grid place-items-center text-white/40">
          <Play className="w-12 h-12" />
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <div className="relative h-1.5 bg-white/20 rounded-full">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(scrub / total) * 100}%` }} />
            {notes.map((n, i) => (
              <button key={i} onClick={() => { setActive(i); setScrub(n.ts); }}
                style={{ left: `${(n.ts / total) * 100}%` }}
                className="absolute -top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-warning border-2 border-white shadow" />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-white/70 mt-1.5 font-mono">
            <span>{fmt(scrub)}</span><span>{fmt(total)}</span>
          </div>
        </div>
      </div>
      {active !== null && notes[active] && (
        <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl bg-warning/15 border border-warning/40 p-2.5">
          <div className="text-[10px] font-bold uppercase text-warning">@{notes[active].by} · {fmt(notes[active].ts)}</div>
          <div className="text-xs mt-0.5">{notes[active].text}</div>
        </motion.div>
      )}
      <div className="flex gap-2 mt-2">
        <Input value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={`${tt("addNote")} @ ${fmt(scrub)}`} className="rounded-full text-xs" />
        <Button size="sm" onClick={add} className="rounded-full"><Pencil className="w-3.5 h-3.5" /></Button>
      </div>
    </FeatureCard>
  );
}

/* ============================================================
   9. BOTTOM-UP CONTENT CREATION
============================================================ */
function BottomUpAuthoring() {
  const tt = useT();
  const [topic, setTopic] = useState("");
  const [out, setOut] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const generate = () => {
    const t = topic.trim() || tt("topicExample");
    setLoading(true); setOut([]);
    const tpl = [
      `1. ${tt("introTo")} ${t}`,
      `2. ${tt("coreConcepts")}: ${t}`,
      `3. ${tt("handsOnLab")}: ${t}`,
      `4. ${tt("realWorld")}: ${t}`,
      `5. ${tt("quizCert")}`,
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i >= tpl.length) { clearInterval(id); setLoading(false); return; }
      setOut((o) => [...o, tpl[i]]); i++;
    }, 280);
  };
  return (
    <FeatureCard icon={Pencil} title={tt("authorTitle")} desc={tt("authorDesc")} accent="from-blue-500 to-indigo-600">
      <Input value={topic} onChange={(e) => setTopic(e.target.value)}
        placeholder={tt("topicPh")} className="rounded-full text-sm" />
      <Button onClick={generate} disabled={loading} className="rounded-full font-bold w-full mt-2">
        <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
        {loading ? tt("authoring") : tt("autoOutline")}
      </Button>
      <div className="rounded-2xl bg-muted/30 border border-border p-3 mt-3 min-h-[140px] space-y-1.5">
        {out.length === 0 && !loading && <div className="text-xs text-muted-foreground text-center py-6">{tt("outlineHint")}</div>}
        {out.map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="text-xs font-semibold flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-success shrink-0" />{line}
          </motion.div>
        ))}
      </div>
    </FeatureCard>
  );
}

/* ============================================================
   10. ADAPTIVE UI
============================================================ */
function AdaptiveUI() {
  const tt = useT();
  const [opts, setOpts] = useState({ contrast: false, large: false, simple: false, dyslexia: false });
  const toggle = (k: keyof typeof opts) => setOpts((o) => ({ ...o, [k]: !o[k] }));
  const containerCls = [
    "rounded-2xl border p-4 transition-all",
    opts.contrast ? "bg-black text-yellow-300 border-yellow-300" : "bg-muted/30 border-border",
    opts.large ? "text-lg" : "text-sm",
    opts.dyslexia ? "[font-family:'Comic_Sans_MS',cursive] tracking-wide" : "",
  ].join(" ");
  return (
    <FeatureCard icon={Eye} title={tt("adaptiveTitle")} desc={tt("adaptiveDesc")} accent="from-emerald-500 to-green-600">
      <div className="grid grid-cols-2 gap-2">
        {[
          { k: "contrast" as const, label: tt("highContrast"), icon: Contrast },
          { k: "large" as const, label: tt("largeText"), icon: TypeIcon },
          { k: "simple" as const, label: tt("simpleText"), icon: Sparkles },
          { k: "dyslexia" as const, label: tt("dyslexiaFont"), icon: TypeIcon },
        ].map(({ k, label, icon: Icon }) => (
          <button key={k} onClick={() => toggle(k)}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-full border text-[11px] font-bold transition ${
              opts[k] ? "bg-emerald-500 text-white border-transparent" : "bg-card border-border hover:bg-muted"
            }`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>
      <div className={containerCls + " mt-3"}>
        <div className="font-extrabold">{tt("lessonTitle")}</div>
        <p className="mt-1.5 leading-relaxed">
          {opts.simple
            ? tt("lessonSimple")
            : tt("lessonFull")}
        </p>
      </div>
    </FeatureCard>
  );
}

/* ============================================================
   11. SIGN LANGUAGE TRANSLATION
============================================================ */
function SignLanguage() {
  const tt = useT();
  const [on, setOn] = useState(false);
  const phrases = [tt("signHello"), tt("signLearning"), tt("signGreat"), tt("signQuestion")];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % phrases.length), 2200);
    return () => clearInterval(id);
  }, [on, phrases.length]);
  return (
    <FeatureCard icon={Hand} title={tt("signTitle")} desc={tt("signDesc")} accent="from-teal-500 to-cyan-600">
      <div className="rounded-2xl bg-slate-900 aspect-video relative overflow-hidden">
        <div className="absolute inset-0 grid place-items-center text-white/30">
          <Volume2 className="w-10 h-10" />
        </div>
        {on && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-3 right-3 w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 grid place-items-center shadow-stack-lg border-2 border-white/40"
          >
            <motion.div animate={{ rotate: [0, -15, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
              <Hand className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
        )}
        {on && (
          <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-bold">
            {phrases[idx]}
          </motion.div>
        )}
      </div>
      <Button onClick={() => setOn((v) => !v)} className="rounded-full font-bold w-full mt-3">
        {on ? tt("hideSign") : tt("showSign")}
      </Button>
    </FeatureCard>
  );
}

/* ============================================================
   12. CULTURAL DIALECT TRANSCRIPTION
============================================================ */
function DialectTranscription() {
  const tt = useT();
  const dialects = [
    { code: "Bhojpuri", flag: "IN", line: "हम सीखत बानी।" },
    { code: "Tamil", flag: "IN", line: "நான் கற்கிறேன்." },
    { code: "Marathi", flag: "IN", line: "मी शिकत आहे." },
    { code: "Quechua", flag: "PE", line: "Yachakuni." },
    { code: "Yoruba", flag: "NG", line: "Mo ń kọ́." },
    { code: "Maori", flag: "NZ", line: "Kei te ako au." },
  ];
  const [pick, setPick] = useState(0);
  const [live, setLive] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    if (!live) return;
    setLines([]);
    const d = dialects[pick];
    const seq = [tt("transcribing"), d.line, tt("translatedAs"), tt("iAmLearning")];
    let i = 0;
    const id = setInterval(() => {
      if (i >= seq.length) { clearInterval(id); return; }
      setLines((l) => [...l, seq[i]]); i++;
    }, 700);
    return () => clearInterval(id);
  }, [live, pick]);
  return (
    <FeatureCard icon={Globe} title={tt("dialectTitle")} desc={tt("dialectDesc")} accent="from-cyan-500 to-emerald-500">
      <div className="flex flex-wrap gap-1.5">
        {dialects.map((d, i) => (
          <button key={d.code} onClick={() => { setPick(i); setLive(false); setLines([]); }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
              pick === i ? "bg-emerald-500 text-white border-transparent" : "bg-card border-border hover:bg-muted"
            }`}>
            {d.flag} · {d.code}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-muted/30 border border-border p-3 mt-3 min-h-[120px] space-y-1.5 font-mono text-xs">
        {lines.length === 0 && (
          <div className="text-muted-foreground text-center py-6 font-sans">{tt("startMic")}</div>
        )}
        {lines.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            className="flex gap-2">
            <span className="text-emerald-500">›</span>{l}
          </motion.div>
        ))}
      </div>
      <Button onClick={() => setLive((v) => !v)} className="rounded-full font-bold w-full mt-3">
        <Mic className={`w-3.5 h-3.5 mr-1.5 ${live ? "animate-pulse text-rose-400" : ""}`} />
        {live ? tt("stopMic") : tt("startMicBtn")}
      </Button>
    </FeatureCard>
  );
}
