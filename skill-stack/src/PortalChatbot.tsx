import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, X, Send, Sparkles, MessageCircle, ChevronRight, type LucideIcon,
  BookOpen, Scroll, Swords, Briefcase, Rocket, Award, Store, LineChart,
  FileText, GraduationCap, Star, Atom, Lightbulb, Trophy, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT, useLang } from "@/lib/i18n";

type PageId =
  | "dashboard" | "courses" | "quests" | "duel" | "jobs" | "placements"
  | "suggestions" | "achievements" | "certificates" | "marketplace" | "analytics"
  | "ats" | "teach" | "testimonials" | "innovate";

type Msg = {
  from: "bot" | "me";
  text: string;
  cta?: { label: string; page: PageId; icon: LucideIcon };
};

type Intent = {
  keys: Record<string, string[]>;
  reply: string;
  cta?: { labelKey: string; page: PageId; icon: LucideIcon };
};

const INTENTS: Intent[] = [
  {
    keys: {
      en: ["course", "lesson", "study", "learn"],
      es: ["curso", "lección", "leccion", "estudiar", "aprender"],
      fr: ["cours", "leçon", "lecon", "étudier", "etudier", "apprendre"],
      de: ["kurs", "lektion", "lernen", "studieren"],
      hi: ["कोर्स", "पाठ", "सीख"],
    },
    reply: "botCoursesReply",
    cta: { labelKey: "botGoCourses", page: "courses", icon: BookOpen },
  },
  {
    keys: {
      en: ["quest", "mission", "challenge", "task"],
      es: ["misión", "mision", "desafío", "desafio", "reto", "tarea"],
      fr: ["quête", "quete", "mission", "défi", "defi"],
      de: ["quest", "mission", "aufgabe", "herausforderung"],
      hi: ["क्वेस्ट", "मिशन", "चुनौती"],
    },
    reply: "botQuestsReply",
    cta: { labelKey: "botGoQuests", page: "quests", icon: Scroll },
  },
  {
    keys: {
      en: ["duel", "battle", "fight", "arena", "pvp"],
      es: ["duelo", "batalla", "pelea", "arena"],
      fr: ["duel", "bataille", "combat", "arène", "arene"],
      de: ["duell", "kampf", "schlacht", "arena"],
      hi: ["ड्यूल", "लड़ाई", "अरेना"],
    },
    reply: "botDuelReply",
    cta: { labelKey: "botGoDuel", page: "duel", icon: Swords },
  },
  {
    keys: {
      en: ["job", "career", "hire", "work", "employ"],
      es: ["empleo", "trabajo", "carrera", "contratar"],
      fr: ["emploi", "travail", "carrière", "carriere", "embauche"],
      de: ["job", "arbeit", "karriere", "stelle"],
      hi: ["नौकरी", "जॉब", "करियर", "रोज़गार"],
    },
    reply: "botJobsReply",
    cta: { labelKey: "botGoJobs", page: "jobs", icon: Briefcase },
  },
  {
    keys: {
      en: ["placement", "internship", "offer", "live"],
      es: ["pasantía", "pasantia", "práctica", "practica", "oferta"],
      fr: ["stage", "placement", "offre"],
      de: ["praktikum", "platzierung", "angebot"],
      hi: ["प्लेसमेंट", "इंटर्नशिप"],
    },
    reply: "botPlacementsReply",
    cta: { labelKey: "botGoPlacements", page: "placements", icon: Rocket },
  },
  {
    keys: {
      en: ["certificate", "cert", "diploma"],
      es: ["certificado", "diploma"],
      fr: ["certificat", "diplôme", "diplome"],
      de: ["zertifikat", "diplom"],
      hi: ["प्रमाणपत्र", "सर्टिफिकेट"],
    },
    reply: "botCertReply",
    cta: { labelKey: "botGoCert", page: "certificates", icon: Award },
  },
  {
    keys: {
      en: ["marketplace", "shop", "buy", "store", "coin", "spend"],
      es: ["mercado", "tienda", "comprar", "moneda", "gastar"],
      fr: ["marché", "marche", "boutique", "acheter", "pièce", "piece"],
      de: ["markt", "shop", "kaufen", "münze", "muenze"],
      hi: ["बाज़ार", "खरीद", "सिक्का"],
    },
    reply: "botMarketReply",
    cta: { labelKey: "botGoMarket", page: "marketplace", icon: Store },
  },
  {
    keys: {
      en: ["analytic", "stat", "progress", "chart", "report"],
      es: ["analítica", "analitica", "estadística", "estadistica", "progreso"],
      fr: ["analyse", "statistique", "progression"],
      de: ["analyse", "statistik", "fortschritt"],
      hi: ["विश्लेषण", "आँकड़े", "प्रगति"],
    },
    reply: "botAnalyticsReply",
    cta: { labelKey: "botGoAnalytics", page: "analytics", icon: LineChart },
  },
  {
    keys: {
      en: ["resume", "cv", "ats"],
      es: ["currículum", "curriculum", "cv", "ats"],
      fr: ["cv", "curriculum", "ats"],
      de: ["lebenslauf", "cv", "ats"],
      hi: ["रिज्यूमे", "सीवी"],
    },
    reply: "botAtsReply",
    cta: { labelKey: "botGoAts", page: "ats", icon: FileText },
  },
  {
    keys: {
      en: ["teach", "instructor", "publish", "create course"],
      es: ["enseñar", "ensenar", "instructor", "publicar"],
      fr: ["enseigner", "instructeur", "publier"],
      de: ["unterrichten", "dozent", "veröffentlichen", "veroeffentlichen"],
      hi: ["सिखा", "शिक्षक", "प्रकाशित"],
    },
    reply: "botTeachReply",
    cta: { labelKey: "botGoTeach", page: "teach", icon: GraduationCap },
  },
  {
    keys: {
      en: ["achievement", "badge", "trophy"],
      es: ["logro", "insignia", "trofeo"],
      fr: ["succès", "succes", "badge", "trophée", "trophee"],
      de: ["erfolg", "abzeichen", "trophäe", "trophaee"],
      hi: ["उपलब्धि", "बैज", "ट्रॉफी"],
    },
    reply: "botAchReply",
    cta: { labelKey: "botGoAch", page: "achievements", icon: Trophy },
  },
  {
    keys: {
      en: ["suggest", "recommend", "what should"],
      es: ["sugerencia", "recomendar", "qué debería", "que deberia"],
      fr: ["suggérer", "suggerer", "recommander"],
      de: ["vorschlag", "empfehlen"],
      hi: ["सुझाव", "सिफारिश"],
    },
    reply: "botSuggestReply",
    cta: { labelKey: "botGoSuggest", page: "suggestions", icon: Lightbulb },
  },
  {
    keys: {
      en: ["innovat", "lab", "next-gen", "experimental", "ai feature"],
      es: ["innovación", "innovacion", "laboratorio", "experimental"],
      fr: ["innovation", "laboratoire", "expérimental", "experimental"],
      de: ["innovation", "labor", "experimentell"],
      hi: ["नवाचार", "लैब", "प्रयोगात्मक"],
    },
    reply: "botInnovReply",
    cta: { labelKey: "botGoInnov", page: "innovate", icon: Atom },
  },
  {
    keys: {
      en: ["xp", "level", "streak", "coin", "point"],
      es: ["xp", "nivel", "racha", "moneda", "punto"],
      fr: ["xp", "niveau", "série", "serie", "pièce", "piece", "point"],
      de: ["xp", "stufe", "serie", "münze", "muenze", "punkt"],
      hi: ["xp", "स्तर", "स्ट्रीक", "सिक्का", "अंक"],
    },
    reply: "botXpReply",
    cta: { labelKey: "botGoDash", page: "dashboard", icon: Home },
  },
  {
    keys: {
      en: ["testimonial", "review", "rating"],
      es: ["testimonio", "reseña", "resena", "valoración", "valoracion"],
      fr: ["témoignage", "temoignage", "avis", "note"],
      de: ["bewertung", "rezension"],
      hi: ["प्रशंसापत्र", "समीक्षा"],
    },
    reply: "botTestiReply",
    cta: { labelKey: "botGoTesti", page: "testimonials", icon: Star },
  },
  {
    keys: {
      en: ["help", "what can", "how", "guide"],
      es: ["ayuda", "qué puedes", "que puedes", "cómo", "como", "guía", "guia"],
      fr: ["aide", "que peux", "comment", "guide"],
      de: ["hilfe", "was kannst", "wie", "anleitung"],
      hi: ["मदद", "कैसे", "गाइड"],
    },
    reply: "botHelpReply",
  },
];

function findIntent(query: string, lang: string): Intent | null {
  const q = query.toLowerCase();
  for (const intent of INTENTS) {
    const allKeys = [...(intent.keys[lang] ?? []), ...intent.keys.en];
    if (allKeys.some((k) => q.includes(k.toLowerCase()))) return intent;
  }
  return null;
}

const QUICK = [
  { key: "qaCourses", icon: BookOpen, prompt: "course" },
  { key: "qaDuel", icon: Swords, prompt: "duel" },
  { key: "qaJobs", icon: Briefcase, prompt: "job" },
  { key: "qaInnov", icon: Atom, prompt: "innovation lab" },
];

export function PortalChatbot({ setPage }: { setPage: (p: PageId) => void }) {
  const tt = useT();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset/seed greeting whenever language changes or first open
  useEffect(() => {
    setMsgs([{ from: "bot", text: tt("botGreeting") }]);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) setUnread(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, msgs, typing]);

  const respond = (rawQuery: string) => {
    const q = rawQuery.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const intent = findIntent(q, lang);
      let reply: Msg;
      if (intent) {
        reply = {
          from: "bot",
          text: tt(intent.reply as never),
          cta: intent.cta ? { label: tt(intent.cta.labelKey as never), page: intent.cta.page, icon: intent.cta.icon } : undefined,
        };
      } else {
        reply = { from: "bot", text: tt("botFallback") };
      }
      setMsgs((m) => [...m, reply]);
      setTyping(false);
      if (!open) setUnread(true);
    }, 650);
  };

  return (
    <>
      {/* FLOATING LAUNCHER */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-chart-4 grid place-items-center shadow-stack-lg border-2 border-white/40"
            aria-label={tt("openChat")}
          >
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Bot className="w-7 h-7 text-white" strokeWidth={2.4} />
            </motion.div>
            <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-pulse-ring pointer-events-none" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning grid place-items-center shadow border-2 border-white">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </span>
            {unread && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-destructive border-2 border-white"
              />
            )}
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-full bg-card border border-border text-xs font-extrabold shadow-stack-sm hidden md:flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-primary" />
              {tt("askAssistant")}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="fixed bottom-6 right-6 z-50 w-[min(92vw,380px)] h-[min(80vh,560px)] rounded-3xl bg-card border border-border shadow-stack-lg flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="relative bg-gradient-to-br from-primary via-accent to-chart-4 px-4 py-3.5 text-white">
              <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:14px_14px]" />
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur grid place-items-center border border-white/30"
                  >
                    <Bot className="w-5 h-5" />
                  </motion.div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold leading-tight flex items-center gap-1.5">
                    {tt("botName")}
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] opacity-90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    {tt("botStatus")}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/15 transition"
                  aria-label={tt("closeChat")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-3 bg-gradient-to-b from-muted/20 to-transparent">
              {msgs.map((m, i) => (
                <MsgBubble key={i} m={m} onCta={(p) => { setPage(p); setOpen(false); }} />
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm bg-card border border-border px-3 py-2 flex gap-1">
                    {[0,1,2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* QUICK ACTIONS */}
            {msgs.length <= 2 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {QUICK.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.key}
                      onClick={() => respond(tt(q.key as never))}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground border border-border text-[11px] font-bold transition"
                    >
                      <Icon className="w-3 h-3" />
                      {tt(q.key as never)}
                    </button>
                  );
                })}
              </div>
            )}

            {/* INPUT */}
            <div className="border-t border-border px-3 py-3 bg-card flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && respond(input)}
                placeholder={tt("chatPlaceholder")}
                className="rounded-full text-sm"
              />
              <Button
                size="sm"
                onClick={() => respond(input)}
                disabled={!input.trim()}
                className="rounded-full shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MsgBubble({ m, onCta }: { m: Msg; onCta: (p: PageId) => void }) {
  if (m.from === "me") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] text-sm px-3 py-2 rounded-2xl rounded-br-sm bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-stack-sm">
          {m.text}
        </div>
      </motion.div>
    );
  }
  const Icon = m.cta?.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center shrink-0 shadow-stack-sm">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="max-w-[85%] space-y-2">
        <div className="text-sm px-3 py-2 rounded-2xl rounded-bl-sm bg-card border border-border shadow-stack-sm">
          {m.text}
        </div>
        {m.cta && Icon && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            whileHover={{ x: 3 }}
            onClick={() => onCta(m.cta!.page)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 hover:border-primary text-xs font-extrabold transition"
          >
            <span className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-primary" />
              {m.cta.label}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-primary" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
