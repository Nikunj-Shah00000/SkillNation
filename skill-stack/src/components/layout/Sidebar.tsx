import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAppStore } from "@/store/useAppStore";
import { 
  Home, BookOpen, Target, Swords, Briefcase, 
  TrendingUp, Lightbulb, Trophy, Award, ShoppingCart, 
  BarChart, FileText, GraduationCap, MessageSquare,
  Sun, Moon, Monitor, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: { en: "Dashboard", es: "Panel", fr: "Tableau", de: "Dashboard", hi: "डैशबोर्ड" } },
  { path: "/courses", icon: BookOpen, label: { en: "My Courses", es: "Mis Cursos", fr: "Mes Cours", de: "Meine Kurse", hi: "मेरे कोर्स" } },
  { path: "/quests", icon: Target, label: { en: "Quests", es: "Misiones", fr: "Quêtes", de: "Quests", hi: "खोज" } },
  { path: "/duel", icon: Swords, label: { en: "Duel Arena", es: "Arena", fr: "Arène", de: "Duell-Arena", hi: "द्वंद्व अखाड़ा" } },
  { path: "/jobs", icon: Briefcase, label: { en: "Job Portal", es: "Empleos", fr: "Emplois", de: "Jobs", hi: "नौकरी" } },
  { path: "/placements", icon: TrendingUp, label: { en: "Placements", es: "Colocaciones", fr: "Placements", de: "Vermittlungen", hi: "नियुक्तियां" } },
  { path: "/suggestions", icon: Lightbulb, label: { en: "Suggestions", es: "Sugerencias", fr: "Suggestions", de: "Vorschläge", hi: "सुझाव" } },
  { path: "/achievements", icon: Trophy, label: { en: "Achievements", es: "Logros", fr: "Succès", de: "Erfolge", hi: "उपलब्धियां" } },
  { path: "/certificates", icon: Award, label: { en: "Certificates", es: "Certificados", fr: "Certificats", de: "Zertifikate", hi: "प्रमाण पत्र" } },
  { path: "/marketplace", icon: ShoppingCart, label: { en: "Marketplace", es: "Mercado", fr: "Marché", de: "Marktplatz", hi: "बाज़ार" } },
  { path: "/analytics", icon: BarChart, label: { en: "Analytics", es: "Análisis", fr: "Analytique", de: "Analytik", hi: "एनालिटिक्स" } },
  { path: "/ats", icon: FileText, label: { en: "ATS Resume", es: "Currículum", fr: "CV ATS", de: "Lebenslauf", hi: "रिज्यूमे" } },
  { path: "/teach", icon: GraduationCap, label: { en: "Teach", es: "Enseñar", fr: "Enseigner", de: "Unterrichten", hi: "पढ़ाएं" } },
  { path: "/testimonials", icon: MessageSquare, label: { en: "Testimonials", es: "Testimonios", fr: "Témoignages", de: "Erfahrungen", hi: "प्रशंसापत्र" } },
];

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme, language, setLanguage } = useAppStore();

  return (
    <div className="w-64 h-screen sticky top-0 bg-card border-r-2 border-border flex flex-col pt-6 pb-4 px-4 overflow-y-auto shadow-[4px_0_12px_rgba(0,0,0,0.05)] z-20">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-stacked-sm">
          S
        </div>
        <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Skill Stack
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all cursor-pointer group",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary rounded-xl shadow-stacked-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{item.label[language]}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 space-y-4">
        {/* Theme Switcher */}
        <div className="bg-muted p-2 rounded-2xl flex gap-1">
          {(['light', 'dark', 'dim'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "flex-1 flex justify-center py-2 rounded-xl transition-all",
                theme === t ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === 'light' ? <Sun className="w-4 h-4" /> : t === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Language Switcher */}
        <div className="bg-muted p-2 rounded-2xl flex flex-wrap gap-1">
          {(['en', 'es', 'fr', 'de', 'hi'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={cn(
                "flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all uppercase",
                language === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
