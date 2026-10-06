"use client";

import { useState, useEffect, useMemo } from "react";
import {
  stringsByLang,
  pushDataByLang,
  variantStringsByLang,
  type Lang,
  type UIStrings,
} from "@/lib/patent/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Magnet,
  Wrench,
  BookOpen,
  ListChecks,
  Cog,
  Gauge,
  ShieldAlert,
  TriangleAlert,
  Info,
  Cpu,
  Layers,
  Hammer,
  Ruler,
  Microscope,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Circle,
  Settings,
  Lightbulb,
  Eye,
  Search,
  FileText,
  Factory,
  Boxes,
  Beaker,
  RotateCw,
  ArrowLeftRight,
  Zap,
  CircleDot,
  Languages,
  Printer,
  Download,
  Disc3,
  Orbit,
  Wind,
  Target,
  Sparkles,
  ImageIcon,
  ArrowLeft,
} from "lucide-react";

// Hydration-safe rounding helper
const round = (n: number, decimals = 4): number => {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
};

interface PushVariantPageProps {
  lang: Lang;
  onPrint: () => void;
  onBackToOriginal: () => void;
  onLanguageToggle: () => void;
  onGoToFlap: () => void;
}

export default function PushVariantPage({
  lang,
  onPrint,
  onBackToOriginal,
  onLanguageToggle,
  onGoToFlap,
}: PushVariantPageProps) {
  const t = stringsByLang[lang];
  const vt = variantStringsByLang[lang];
  const push = pushDataByLang[lang];
  const isHe = lang === "he";

  const [activeFilter, setActiveFilter] = useState<"all" | "magnet" | "metal" | "structural" | "hardware" | "tooling">("all");
  const [bomSearch, setBomSearch] = useState("");
  const [completedBom, setCompletedBom] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const filteredBom = useMemo(() => {
    return push.pushBomItems.filter((b) => {
      if (activeFilter !== "all" && b.category !== activeFilter) return false;
      if (bomSearch && !`${b.part} ${b.spec} ${b.purpose} ${b.source}`.toLowerCase().includes(bomSearch.toLowerCase())) return false;
      return true;
    });
  }, [activeFilter, bomSearch, push.pushBomItems]);

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSet(next);
  };

  const bomProgress = (completedBom.size / push.pushBomItems.length) * 100;
  const stepsProgress = (completedSteps.size / (push.pushBuildSteps.length * 4)) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-600 to-slate-900 flex items-center justify-center text-white">
              <Disc3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">{push.pushVariantInfo.title}</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">{push.pushVariantInfo.parentPatent}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            <a href="#overview" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <FileText className="h-3.5 w-3.5" /> {isHe ? "סקירה" : "Overview"}
            </a>
            <a href="#source" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <ImageIcon className="h-3.5 w-3.5" /> {isHe ? "תמונת מקור" : "Source Image"}
            </a>
            <a href="#theory" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <BookOpen className="h-3.5 w-3.5" /> {isHe ? "תיאוריה" : "Theory"}
            </a>
            <a href="#diagram" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <Eye className="h-3.5 w-3.5" /> {isHe ? "תרשים" : "Diagram"}
            </a>
            <a href="#bom" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <Boxes className="h-3.5 w-3.5" /> {isHe ? "חומרים" : "Materials"}
            </a>
            <a href="#build" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <Hammer className="h-3.5 w-3.5" /> {isHe ? "בנייה" : "Build"}
            </a>
            <a href="#safety" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <ShieldAlert className="h-3.5 w-3.5" /> {isHe ? "בטיחות" : "Safety"}
            </a>
            <a href="#troubleshoot" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <TriangleAlert className="h-3.5 w-3.5" /> {isHe ? "תקלות" : "Troubleshoot"}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onBackToOriginal}
              className="text-xs gap-1.5"
              title={isHe ? "חזרה לפטנט המקורי" : "Back to original patent"}
            >
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              <span className="hidden sm:inline">{isHe ? "לפטנט" : "Original"}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onPrint}
              className="text-xs gap-1.5 print-hide"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isHe ? "הדפס / PDF" : "Print / PDF"}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onLanguageToggle}
              className="text-xs gap-1.5"
            >
              <Languages className="h-3.5 w-3.5" />
              {t.langToggle}
            </Button>
          </div>
        </div>
      </header>

      {/* ===== OVERVIEW ===== */}
      <section id="overview" className="container mx-auto max-w-7xl px-4 pt-12 pb-8 scroll-mt-20">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Badge className="mb-3" variant="secondary">{push.pushVariantInfo.number}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {isHe ? "בנו " : "Build a "}
                <span className="bg-gradient-to-r from-purple-600 to-slate-900 bg-clip-text text-transparent">
                  {push.pushVariantInfo.title}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mt-3">{push.pushVariantInfo.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> {isHe ? "מידע אב-הטיפוס" : "Prototype Information"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "מספר" : "Number"}</span><span className="font-medium">{push.pushVariantInfo.number}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "סוג" : "Type"}</span><span className="font-medium">{push.pushVariantInfo.type}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "פטנט מקור" : "Parent Patent"}</span><span className="font-medium">{push.pushVariantInfo.parentPatent}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "פריטי BOM" : "BOM Items"}</span><span className="font-medium">{push.pushBomItems.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "שלבי בנייה" : "Build Steps"}</span><span className="font-medium">{push.pushBuildSteps.length}</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Orbit className="h-4 w-4" /> {isHe ? "תכנון תלת-שלבי" : "Three-Design Family"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Button size="sm" variant="outline" onClick={onBackToOriginal} className="w-full justify-start text-xs h-7">
                    <Magnet className="h-3.5 w-3.5" /> {vt.original}
                  </Button>
                  <Button size="sm" variant="outline" onClick={onGoToFlap} className="w-full justify-start text-xs h-7">
                    <Disc3 className="h-3.5 w-3.5" /> {vt.flap}
                  </Button>
                  <Button size="sm" variant="default" className="w-full justify-start text-xs h-7 bg-gradient-to-r from-purple-600 to-slate-900">
                    <Target className="h-3.5 w-3.5" /> {vt.push}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5" /> {isHe ? "כיצד אב-טיפוס זה שונה" : "How This Prototype Differs"}</CardTitle>
                <CardDescription>{isHe ? "השוואת שלוש הגישות" : "Side-by-side comparison of all three approaches"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-xs uppercase">
                      <tr>
                        <th className="p-2 text-left">{isHe ? "פריט" : "Aspect"}</th>
                        <th className="p-2 text-left">{isHe ? "פטנט מקורי" : "Original Patent"}</th>
                        <th className="p-2 text-left">{isHe ? "וריאנט דיסקה" : "Flap Variant"}</th>
                        <th className="p-2 text-left bg-purple-50">{isHe ? "מנוע דחיפה (חדש)" : "Push Motor (NEW)"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2 font-medium">{isHe ? "רוטור" : "Rotor"}</td>
                        <td className="p-2 text-xs">{isHe ? "מגנט קבוע" : "Permanent magnet"}</td>
                        <td className="p-2 text-xs">{isHe ? "דיסקת רכיכה פסיבית (ברזל)" : "Passive ferromagnetic disc (iron)"}</td>
                        <td className="p-2 text-xs bg-purple-50/40 font-medium">{isHe ? "מגנט דיאמטרי אקטיבי" : "Active diametric magnet"}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-medium">{isHe ? "סטטור" : "Stator"}</td>
                        <td className="p-2 text-xs">{isHe ? "מסיל מרובה מגנטים" : "Multi-magnet track"}</td>
                        <td className="p-2 text-xs">{isHe ? "2-3 מגנטי צד" : "2-3 side magnets"}</td>
                        <td className="p-2 text-xs bg-purple-50/40 font-medium">{isHe ? "2 מגנטי דחיפה סטטיים" : "2 static push magnets"}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-medium">{isHe ? "סוג כוח" : "Force type"}</td>
                        <td className="p-2 text-xs">{isHe ? "משיכה + דחייה" : "Attraction + repulsion"}</td>
                        <td className="p-2 text-xs">{isHe ? "משיכה בלבד + מגן" : "Attraction only + shield"}</td>
                        <td className="p-2 text-xs bg-purple-50/40 font-medium">{isHe ? "דחייה (דחיפה) בלבד" : "Repulsion (push) only"}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-medium">{isHe ? "מגן μ-metal" : "μ-metal shield"}</td>
                        <td className="p-2 text-xs">{isHe ? "לא נדרש" : "Not required"}</td>
                        <td className="p-2 text-xs">{isHe ? "חובה (צד יציאה)" : "Required (exit side)"}</td>
                        <td className="p-2 text-xs bg-purple-50/40 font-medium">{isHe ? "לא נדרש — פישוט משמעותי" : "Not required — major simplification"}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-medium">{isHe ? "מקור" : "Source"}</td>
                        <td className="p-2 text-xs">{isHe ? "ג'ונסון 1979" : "Johnson 1979"}</td>
                        <td className="p-2 text-xs">{isHe ? "עיבוד מתוך הפטנט" : "Derived from patent"}</td>
                        <td className="p-2 text-xs bg-purple-50/40 font-medium">{isHe ? "תמונה שהועלתה על ידי המשתמש" : "User-uploaded image"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Ruler className="h-4 w-4" /> {isHe ? "מידות אב-טיפוס" : "Prototype Dimensions"}</CardTitle>
                <CardDescription>{isHe ? "דיסקה דיאמטרית 1 אינץ' + 2 מגנטים" : "1 in diametric disc + 2 magnets"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {push.pushPrototypeDimensions.map((d) => (
                  <div key={d.parameter} className="border-b pb-1.5 last:border-0">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{d.parameter}</span>
                      <span className="font-bold text-slate-900">{d.value}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{d.notes}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-slate-900 text-white border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-white"><Sparkles className="h-4 w-4" /> {isHe ? "תובנה מרכזית" : "Key Insight"}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-purple-50">
                <p>
                  {isHe
                    ? "הדיסקה חייבת להיות מגנטיז דיאמטרית (N בצד אחד, S בצד השני) — לא אקסיאלית (קטבים בפנים) ולא רכיכה פסיבית."
                    : "The disc must be DIAMETRICALLY magnetized (N on one side, S on the other) — not axially (poles on faces) and not passive iron."}
                </p>
                <p>
                  {isHe
                    ? "המגנטים הסטטיים פונים עם קוטב דומה לדיסקה: N-ל-N ו-S-ל-S. זה יוצר דחייה (דחיפה), לא משיכה."
                    : "The static magnets face the disc with LIKE poles: N-to-N and S-to-S. This creates repulsion (push), not attraction."}
                </p>
                <p className="text-purple-200 italic text-[10px]">
                  {isHe ? "ללא מגני μ-metal — הבנייה פשוטה יותר מוריאנט ה-flap" : "No μ-metal shields needed — simpler than the flap variant"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" /> {isHe ? "במבט מהיר" : "At a Glance"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-purple-500" /><span>{isHe ? "דיסקה דיאמטרית NdFeB 1 אינץ'" : "1 in diametric NdFeB disc"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500" /><span>{isHe ? "2 מגנטי דחיפה סטטיים" : "2 static push magnets"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500" /><span>{isHe ? "7 שלבי בנייה" : "7 build steps"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /><span>{isHe ? "17 פריטי BOM" : "17 BOM items"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500" /><span>{isHe ? "מגן בטיחות פוליקרבונט חובה" : "Polycarbonate shield required"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-pink-500" /><span>{isHe ? "מבוסס על תמונה שהועלתה" : "Based on uploaded image"}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== SOURCE IMAGE ===== */}
      <section id="source" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-white/60 rounded-xl">
        <SectionHeader
          icon={<ImageIcon className="h-5 w-5" />}
          title={isHe ? "תמונת המקור" : "Source Image"}
          subtitle={isHe ? "התרשים שעליו מבוסס אב-הטיפוס הזה" : "The diagram this prototype is based on"}
        />
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5" /> {isHe ? "התרשים המקורי 'Flap metallic magnet motor'" : "Original 'Flap metallic magnet motor' Diagram"}</CardTitle>
            <CardDescription>{isHe ? "תצוגה עליונה של רוטור מרכזי מגנטיז דיאמטרית ו-16 מגנטים חיצוניים עם קווי שדה מעוקלים" : "Top-down view of a diametrically magnetized central rotor with 16 outer magnets and curved field lines"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl overflow-hidden border bg-slate-100">
              <img
                src={push.pushVariantInfo.sourceImage}
                alt={push.pushVariantInfo.sourceImageAlt}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              {push.pushVariantInfo.sourceImageAlt}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Microscope className="h-4 w-4" /> {isHe ? "ניתוח התמונה" : "Image Analysis"}</CardTitle>
            <CardDescription>{isHe ? "מה התמונה מראה וכיצד אב-הטיפוס מפשט אותה" : "What the image shows and how this prototype simplifies it"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{push.pushVariantInfo.sourceImageAnalysis}</p>
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <p className="text-xs font-bold uppercase text-slate-600 mb-1">{isHe ? "בתמונה" : "In Image"}</p>
                <p className="text-sm">{isHe ? "16 מגנטים חיצוניים" : "16 outer magnets"}</p>
                <p className="text-xs text-muted-foreground mt-1">{isHe ? "סימטריה 8-fold" : "8-fold symmetry"}</p>
              </div>
              <div className="rounded-lg border border-purple-300 p-3 bg-purple-50">
                <p className="text-xs font-bold uppercase text-purple-700 mb-1">{isHe ? "באב-הטיפוס" : "In Prototype"}</p>
                <p className="text-sm font-medium">{isHe ? "2 מגנטי דחיפה" : "2 push magnets"}</p>
                <p className="text-xs text-purple-700 mt-1">{isHe ? "ב-90° ו-270°" : "At 90° and 270°"}</p>
              </div>
              <div className="rounded-lg border border-emerald-300 p-3 bg-emerald-50">
                <p className="text-xs font-bold uppercase text-emerald-700 mb-1">{isHe ? "הפחתה" : "Reduction"}</p>
                <p className="text-sm font-medium">{isHe ? "16 → 2 (87% פחות)" : "16 → 2 (87% fewer)"}</p>
                <p className="text-xs text-emerald-700 mt-1">{isHe ? "בנייה פשוטה יותר" : "Simpler build"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ===== THEORY ===== */}
      <section id="theory" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<BookOpen className="h-5 w-5" />}
          title={isHe ? "תורת הפעולה" : "Theory of Operation"}
          subtitle={isHe ? "כיצד דיסקה דיאמטרית ו-2 מגנטי דחייה מייצרים סיבוב רציף" : "How a diametric disc and 2 repulsion magnets produce continuous rotation"}
        />
        <div className="grid lg:grid-cols-2 gap-6">
          {push.pushTheoryPoints.map((tp, i) => (
            <Card key={tp.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <CardTitle className="text-base">{tp.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3 text-muted-foreground">
                {tp.body.map((para, j) => (
                  <p key={j} className="leading-relaxed">{para}</p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== INTERACTIVE DIAGRAM ===== */}
      <section id="diagram" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-white/60 rounded-xl">
        <SectionHeader
          icon={<Eye className="h-5 w-5" />}
          title={isHe ? "תרשים אינטראקטיבי" : "Interactive Diagram"}
          subtitle={isHe ? "דיסקה דיאמטרית מסתובבת עם 2 מגנטי דחיפה סטטיים" : "Rotating diametric disc with 2 static push magnets"}
        />
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{isHe ? "דגם סיבוב חי" : "Live Rotation Model"}</CardTitle>
            <CardDescription>{isHe ? "הדיסקה הדיאמטרית (חצי אדום = N, חצי כחול = S) מסתובבת עם כיוון השעון כשהמגנטים הסטטיים דוחפים" : "The diametric disc (red half = N, blue half = S) rotates clockwise as the static magnets push"}</CardDescription>
          </CardHeader>
          <CardContent>
            <PushMotorDiagram isHe={isHe} />
          </CardContent>
        </Card>
      </section>

      {/* ===== BOM ===== */}
      <section id="bom" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<Boxes className="h-5 w-5" />}
          title={isHe ? "חשבונית חומרים" : "Bill of Materials"}
          subtitle={isHe ? "כל חלק שנדרש למנוע הדחיפה הדיאמטרי" : "Every part you need for the diametric push motor"}
        />

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t.bom.acquisition}</span>
            <span className="font-medium">{completedBom.size} / {push.pushBomItems.length}</span>
          </div>
          <Progress value={bomProgress} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {(["all", "magnet", "metal", "structural", "hardware", "tooling"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={activeFilter === f ? "default" : "outline"}
              onClick={() => setActiveFilter(f)}
              className="text-xs"
            >
              {f === "all" ? t.bom.filters.all : t.bom.filters[f]}
            </Button>
          ))}
          <div className="flex-1 min-w-[200px] max-w-xs ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.bom.searchPlaceholder}
                value={bomSearch}
                onChange={(e) => setBomSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">✓</th>
                <th className="p-3 text-left">{t.bom.cols.id}</th>
                <th className="p-3 text-left">{t.bom.cols.part}</th>
                <th className="p-3 text-left">{t.bom.cols.spec}</th>
                <th className="p-3 text-left">{t.bom.cols.qty}</th>
                <th className="p-3 text-left">{t.bom.cols.purpose}</th>
                <th className="p-3 text-left">{t.bom.cols.source}</th>
                <th className="p-3 text-left">{t.bom.cols.type}</th>
              </tr>
            </thead>
            <tbody>
              {filteredBom.map((b) => (
                <tr key={b.id} className={`border-t hover:bg-slate-50 ${b.critical ? "bg-red-50/30" : ""}`}>
                  <td className="p-3">
                    <Checkbox
                      checked={completedBom.has(b.id)}
                      onCheckedChange={() => toggle(completedBom, setCompletedBom, b.id)}
                    />
                  </td>
                  <td className="p-3 font-mono text-xs">{b.id}</td>
                  <td className="p-3 font-medium">{b.part}</td>
                  <td className="p-3 text-xs text-muted-foreground">{b.spec}</td>
                  <td className="p-3 text-xs">{b.qty}</td>
                  <td className="p-3 text-xs">{b.purpose}</td>
                  <td className="p-3 text-xs">{b.source}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={`text-[10px] ${
                      b.category === "magnet" ? "border-red-300 text-red-700" :
                      b.category === "metal" ? "border-amber-300 text-amber-700" :
                      b.category === "structural" ? "border-blue-300 text-blue-700" :
                      b.category === "hardware" ? "border-emerald-300 text-emerald-700" :
                      "border-purple-300 text-purple-700"
                    }`}>
                      {t.bom.filters[b.category]}
                    </Badge>
                    {b.critical && (
                      <Badge variant="destructive" className="text-[10px] ms-1">{t.bom.critical}</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t.bom.showing} {filteredBom.length} {t.bom.of} {push.pushBomItems.length}.
        </p>
      </section>

      {/* ===== TOOLS ===== */}
      <section id="tools" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-white/60 rounded-xl">
        <SectionHeader
          icon={<Wrench className="h-5 w-5" />}
          title={t.tools.title}
          subtitle={isHe ? "כלים להרכבת מנוע הדחיפה" : "Tools for assembling the push motor"}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {push.pushWorkshopTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    tool.required ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    <Hammer className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tool.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tool.purpose}</p>
                    {tool.required ? (
                      <Badge variant="destructive" className="text-[10px] mt-2">{t.tools.required}</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] mt-2">{t.tools.optional}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== BUILD STEPS ===== */}
      <section id="build" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<Hammer className="h-5 w-5" />}
          title={isHe ? "מדריך בנייה" : "Build Guide"}
          subtitle={isHe ? "7 שלבים מדיסקת NdFeB גולמית למנוע מסתובב" : "7 phases from raw NdFeB disc to a rotating motor"}
        />

        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t.build.checklistProgress}</span>
            <span className="font-medium">{completedSteps.size} / {push.pushBuildSteps.length * 4} {t.build.checks}</span>
          </div>
          <Progress value={stepsProgress} />
        </div>

        <div className="space-y-4">
          {push.pushBuildSteps.map((step, i) => (
            <BuildStepCard
              key={step.id}
              step={step}
              index={i}
              t={t}
              completed={completedSteps}
              onToggle={(checkId) => toggle(completedSteps, setCompletedSteps, checkId)}
            />
          ))}
        </div>
      </section>

      {/* ===== SAFETY ===== */}
      <section id="safety" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-white/60 rounded-xl">
        <SectionHeader
          icon={<ShieldAlert className="h-5 w-5" />}
          title={t.safety.title}
          subtitle={isHe ? "מידע קריטי לפני הרכבת מנוע הדחיפה הדיאמטרי" : "Critical information before assembling the diametric push motor"}
        />
        <div className="grid md:grid-cols-2 gap-4">
          {push.pushSafetyItems.map((s) => {
            const styles = {
              critical: { border: "border-red-300 bg-red-50", icon: ShieldAlert, iconColor: "text-red-600" },
              caution: { border: "border-amber-300 bg-amber-50", icon: TriangleAlert, iconColor: "text-amber-600" },
              note: { border: "border-slate-300 bg-slate-50", icon: Info, iconColor: "text-slate-600" },
            }[s.severity];
            const Icon = styles.icon;
            return (
              <Alert key={s.id} className={styles.border}>
                <Icon className={`h-4 w-4 ${styles.iconColor}`} />
                <AlertTitle className="flex items-center gap-2">
                  {s.title}
                  <Badge variant="outline" className={`text-[10px] ${
                    s.severity === "critical" ? "border-red-400 text-red-700" :
                    s.severity === "caution" ? "border-amber-400 text-amber-700" :
                    "border-slate-400 text-slate-700"
                  }`}>
                    {t.safety.severity[s.severity]}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="text-sm mt-2">{s.detail}</AlertDescription>
              </Alert>
            );
          })}
        </div>
      </section>

      {/* ===== TROUBLESHOOT ===== */}
      <section id="troubleshoot" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<TriangleAlert className="h-5 w-5" />}
          title={t.troubleshoot.title}
          subtitle={isHe ? "מצבי כשל נפוצים במנוע הדחיפה וכיצד לתקן" : "Common failure modes for the push motor and how to fix them"}
        />
        <div className="grid md:grid-cols-2 gap-4">
          {push.pushTroubleshooting.map((tr, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-start gap-2">
                  <TriangleAlert className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  {tr.symptom}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase">{t.troubleshoot.causeLabel}</p>
                  <p className="text-sm">{tr.cause}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-emerald-700 font-medium uppercase">{t.troubleshoot.fixLabel}</p>
                  <p className="text-sm">{tr.fix}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto border-t bg-slate-900 text-slate-300 print-hide">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Disc3 className="h-4 w-4" /> {push.pushVariantInfo.title}
              </h3>
              <p className="text-xs text-slate-400">
                {isHe
                  ? "אב-טיפוס מבוסס תמונה בהשראת US 4,151,431. משתמש בדיסקה דיאמטרית אקטיבית ו-2 מגנטי דחיפה."
                  : "Image-based prototype inspired by US 4,151,431. Uses an active diametric disc and 2 push magnets."}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Factory className="h-4 w-4" /> {isHe ? "מידע בנייה" : "Build Information"}</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>{isHe ? "דיסקה: NdFeB דיאמטרי 1 אינץ'" : "Disc: 1 in diametric NdFeB"}</li>
                <li>{isHe ? "2 מגנטים ב-90° ו-270°" : "2 magnets at 90° and 270°"}</li>
                <li>{isHe ? "17 פריטי BOM, 10 כלי סדנה" : "17 BOM items, 10 workshop tools"}</li>
                <li>{isHe ? "7 שלבי הרכבה" : "7 assembly steps"}</li>
                <li>{isHe ? "מגן בטיחות פוליקרבונט חובה" : "Polycarbonate shield required"}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Info className="h-4 w-4" /> {t.footer.disclaimerTitle}</h3>
              <p className="text-xs text-slate-400">
                {isHe
                  ? "מדריך בנייה זה הוא פרשנות הנדסית של תמונה שהועלתה. כמו הפטנט המקורי, אב-טיפוס זה מומלץ להתייחס אליו כמקרה מחקר הנדסי, לא מכונת אנרגיה חופשית עובדת."
                  : "This build guide is an engineering interpretation of an uploaded image. Like the original patent, this prototype is best treated as an engineering case study, not a working free-energy machine."}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between flex-wrap gap-2">
            <span>{isHe ? "מנוע דחיפה דיאמטרי — אב-טיפוס מבוסס תמונה" : "Diametric Push Motor — image-based prototype"}</span>
            <span>{isHe ? "מקור: תמונת 'Flap metallic magnet motor' שהועלתה" : "Source: uploaded 'Flap metallic magnet motor' image"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// PUSH MOTOR INTERACTIVE SVG DIAGRAM
// Top-down view: diametric disc (red/blue halves) + 2 static push magnets
// ============================================================
function PushMotorDiagram({ isHe }: { isHe: boolean }) {
  const [angle, setAngle] = useState(0); // disc rotation in degrees
  const [autoPlay, setAutoPlay] = useState(true);
  const [airGap, setAirGap] = useState(80); // in mils (0.001 in), 80 mils = 0.080 in
  const [showForces, setShowForces] = useState(true);
  const [showFieldLines, setShowFieldLines] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setAngle((a) => (a + 1.8) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const cx = 270;
  const cy = 200;
  const discR = 80;
  const magnetR = discR + 15 + (airGap / 300) * 50;

  // Pre-compute 2 static magnet positions: 90° (top) and 270° (bottom)
  // Both with N facing the disc (top: N down; bottom: S up — like-pole repulsion)
  // Wait — for repulsion: top magnet N faces DOWN toward disc's N side (when disc's N is at top)
  // bottom magnet S faces UP toward disc's S side (when disc's S is at bottom)
  const magnetPositions = useMemo(() => {
    const anglesDeg = [90, 270]; // top and bottom
    return anglesDeg.map((deg) => {
      const a = (deg * Math.PI) / 180 - Math.PI / 2;
      const x = round(cx + magnetR * Math.cos(a), 2);
      const y = round(cy + magnetR * Math.sin(a), 2);
      // Force vector from magnet toward disc (pushing away)
      const fx = round(x - 30 * Math.cos(a), 2);
      const fy = round(y - 30 * Math.sin(a), 2);
      const fx2 = round(x - 55 * Math.cos(a), 2);
      const fy2 = round(y - 55 * Math.sin(a), 2);
      return { x, y, fx, fy, fx2, fy2, a, deg };
    });
  }, [magnetR]);

  // Disc halves — N half (red) on left of disc, S half (blue) on right.
  // As disc rotates, the N half sweeps around. Draw as two semicircles that rotate together.
  const discPaths = useMemo(() => {
    // Half 1 (N, red): from -90° to 90° (right side initially as N) — wait, let's put N on left (180° to 360°/0°)
    // Actually: we want N on the left half (180°-360°) and S on the right half (0°-180°) at angle=0.
    // As angle increases (clockwise from above), the disc rotates clockwise.
    // For SVG, rotation transform with positive angle = clockwise (in screen coords where y is down)
    const halfNAngles = [Math.PI, 2 * Math.PI]; // left half = N (red)
    const halfSAngles = [0, Math.PI]; // right half = S (blue)
    const buildHalf = (a0: number, a1: number) => {
      const rOut = discR;
      const x0 = round(cx + rOut * Math.cos(a0), 2);
      const y0 = round(cy + rOut * Math.sin(a0), 2);
      const x1 = round(cx + rOut * Math.cos(a1), 2);
      const y1 = round(cy + rOut * Math.sin(a1), 2);
      return `M ${cx} ${cy} L ${x0} ${y0} A ${rOut} ${rOut} 0 0 1 ${x1} ${y1} Z`;
    };
    return {
      nPath: buildHalf(halfNAngles[0], halfNAngles[1]),
      sPath: buildHalf(halfSAngles[0], halfSAngles[1]),
    };
  }, [cx, cy, discR]);

  // Field lines — curved arcs from disc's N pole to each static magnet's far side (illustrative)
  const fieldLines = useMemo(() => {
    if (!showFieldLines) return [];
    // 4 field lines per magnet, curving from the disc's nearest pole to the magnet
    return magnetPositions.flatMap((m, mi) => {
      const lines: { path: string; color: string }[] = [];
      const poleColor = mi === 0 ? "#dc2626" : "#3b82f6"; // top magnet = N red, bottom magnet = S blue
      for (let i = -1; i <= 1; i++) {
        const startAngle = m.deg + i * 12 - 90; // disc side near magnet
        const startA = (startAngle * Math.PI) / 180;
        const startX = round(cx + discR * Math.cos(startA), 2);
        const startY = round(cy + discR * Math.sin(startA), 2);
        const endX = m.x;
        const endY = m.y;
        // Control point — offset perpendicular to the start-end line
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const perpA = m.a + Math.PI / 2;
        const offset = 15 + i * 8;
        const ctrlX = round(midX + offset * Math.cos(perpA), 2);
        const ctrlY = round(midY + offset * Math.sin(perpA), 2);
        lines.push({
          path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
          color: poleColor,
        });
      }
      return lines;
    });
  }, [showFieldLines, magnetPositions, discR, cx, cy]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {isHe
              ? "תצוגה עליונה — הדיסקה הדיאמטרית מסתובבת עם כיוון השעון, שני המגנטים הסטטיים דוחפים"
              : "Top-down view — the diametric disc rotates clockwise, the two static magnets push"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isHe
              ? "החצי האדום של הדיסקה הוא N (נדחק על ידי מגנט N העליון). החצי הכחול הוא S (נדחק על ידי מגנט S התחתון)."
              : "The red half of the disc is N (pushed by the top N magnet). The blue half is S (pushed by the bottom S magnet)."}
          </p>
        </div>
        <Button size="sm" variant={autoPlay ? "secondary" : "default"} onClick={() => setAutoPlay(!autoPlay)}>
          {autoPlay ? (isHe ? "עצור" : "Pause") : (isHe ? "סובב" : "Spin")}
        </Button>
      </div>

      <svg viewBox="0 0 540 400" className="w-full h-auto rounded-xl border bg-gradient-to-b from-slate-50 to-white">
        <defs>
          <linearGradient id="discNPush" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dc2626" />
            <stop offset="1" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="discSPush" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="pushMagnetTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ef4444" />
            <stop offset="1" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="pushMagnetBot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#60a5fa" />
            <stop offset="1" stopColor="#1e40af" />
          </linearGradient>
          <radialGradient id="hubGradPush" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#475569" />
          </radialGradient>
          <marker id="pushArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3 L0,6 Z" fill="#7c3aed" />
          </marker>
          <marker id="rotArrowPush" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3 L0,6 Z" fill="#10b981" />
          </marker>
        </defs>

        {/* Reference circle */}
        <circle cx={cx} cy={cy} r={discR + 40} fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,3" />

        {/* Field lines (optional, behind disc) */}
        {showFieldLines && fieldLines.map((fl, i) => (
          <path key={i} d={fl.path} fill="none" stroke={fl.color} strokeWidth="0.6" strokeDasharray="3,2" opacity="0.5" />
        ))}

        {/* Diametric disc — rotates as a group */}
        <g transform={`rotate(${round(angle, 2)} ${cx} ${cy})`}>
          {/* N half (red, left) */}
          <path d={discPaths.nPath} fill="url(#discNPush)" stroke="#7f1d1d" strokeWidth="0.8" />
          {/* S half (blue, right) */}
          <path d={discPaths.sPath} fill="url(#discSPush)" stroke="#1e3a8a" strokeWidth="0.8" />
          {/* Center hub */}
          <circle cx={cx} cy={cy} r="8" fill="url(#hubGradPush)" stroke="#334155" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="3" fill="#0f172a" />
          {/* N / S labels — placed on the disc so they rotate with it */}
          <text x={cx - discR / 2} y={cy + 4} textAnchor="middle" className="text-[12px] fill-white font-bold">N</text>
          <text x={cx + discR / 2} y={cy + 4} textAnchor="middle" className="text-[12px] fill-white font-bold">S</text>
        </g>

        {/* 2 static push magnets */}
        {magnetPositions.map((m, i) => {
          const isTop = i === 0;
          return (
            <g key={i}>
              {/* Magnet body — represented as a block. Top magnet: N (red) facing DOWN. Bottom: S (blue) facing UP. */}
              <g transform={`translate(${m.x} ${m.y}) rotate(${m.deg + 90})`}>
                <rect x="-14" y="-9" width="28" height="18" fill={isTop ? "url(#pushMagnetTop)" : "url(#pushMagnetBot)"} stroke={isTop ? "#7f1d1d" : "#1e3a8a"} strokeWidth="0.8" rx="2" />
                <text x="0" y="-12" textAnchor="middle" className={`text-[10px] font-bold ${isTop ? "fill-red-700" : "fill-blue-700"}`}>
                  {isTop ? "N" : "S"}
                </text>
              </g>
              {/* Repulsion force vector — pointing AWAY from the magnet (push) */}
              {showForces && (
                <line
                  x1={m.fx}
                  y1={m.fy}
                  x2={m.fx2}
                  y2={m.fy2}
                  stroke="#7c3aed"
                  strokeWidth="1.8"
                  strokeDasharray="4,2"
                  markerEnd="url(#pushArrow)"
                />
              )}
              {/* Angle label */}
              <text
                x={round(cx + (magnetR + 28) * Math.cos(m.a), 2)}
                y={round(cy + (magnetR + 28) * Math.sin(m.a), 2)}
                textAnchor="middle"
                className="text-[9px] fill-slate-700 font-medium"
              >
                {m.deg}°
              </text>
            </g>
          );
        })}

        {/* Rotation direction indicator */}
        <path
          d={`M ${cx + 28} ${cy - 28} A 40 40 0 0 1 ${cx + 40} ${cy}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          markerEnd="url(#rotArrowPush)"
        />
        <text x={cx + 50} y={cy - 25} className="text-[10px] fill-emerald-600 font-bold">
          {isHe ? "סיבוב" : "Rotation"}
        </text>

        {/* Legend */}
        <g transform="translate(20, 360)">
          <rect x="0" y="0" width="14" height="8" fill="url(#discNPush)" stroke="#7f1d1d" strokeWidth="0.5" />
          <text x="18" y="6" className="text-[9px] fill-slate-700">{isHe ? "חצי N" : "N half"}</text>
          <rect x="65" y="0" width="14" height="8" fill="url(#discSPush)" stroke="#1e3a8a" strokeWidth="0.5" />
          <text x="83" y="6" className="text-[9px] fill-slate-700">{isHe ? "חצי S" : "S half"}</text>
          <rect x="135" y="0" width="14" height="8" fill="url(#pushMagnetTop)" stroke="#7f1d1d" strokeWidth="0.5" />
          <text x="153" y="6" className="text-[9px] fill-slate-700">{isHe ? "מגנט N" : "N magnet"}</text>
          <rect x="210" y="0" width="14" height="8" fill="url(#pushMagnetBot)" stroke="#1e3a8a" strokeWidth="0.5" />
          <text x="228" y="6" className="text-[9px] fill-slate-700">{isHe ? "מגנט S" : "S magnet"}</text>
          {showForces && (
            <>
              <line x1="290" y1="4" x2="304" y2="4" stroke="#7c3aed" strokeWidth="1.8" strokeDasharray="4,2" />
              <text x="308" y="6" className="text-[9px] fill-slate-700">{isHe ? "דחייה" : "Push"}</text>
            </>
          )}
        </g>
      </svg>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-muted-foreground font-medium block mb-1">
            {isHe ? "רווח אוויר" : "Air gap"}: {(airGap / 1000).toFixed(3)} in
          </label>
          <Slider value={[airGap]} onValueChange={(v) => setAirGap(v[0])} min={30} max={150} step={5} />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>0.030 in</span>
            <span>0.150 in</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium block mb-1">
            {isHe ? "וקטורי דחייה" : "Repulsion vectors"}
          </label>
          <Button size="sm" variant={showForces ? "default" : "outline"} onClick={() => setShowForces(!showForces)} className="w-full">
            {showForces ? (isHe ? "מוצגים" : "Visible") : (isHe ? "מוסתרים" : "Hidden")}
          </Button>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium block mb-1">
            {isHe ? "קווי שדה" : "Field lines"}
          </label>
          <Button size="sm" variant={showFieldLines ? "default" : "outline"} onClick={() => setShowFieldLines(!showFieldLines)} className="w-full">
            {showFieldLines ? (isHe ? "מוצגים" : "Visible") : (isHe ? "מוסתרים" : "Hidden")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHARED SUB-COMPONENTS
// ============================================================
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function BuildStepCard({
  step,
  index,
  t,
  completed,
  onToggle,
}: {
  step: { id: string; phase: string; title: string; duration: string; description: string; checks: string[]; warning?: string };
  index: number;
  t: UIStrings;
  completed: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const stepChecksCompleted = step.checks.filter((_, i) => completed.has(`${step.id}-${i}`)).length;
  const stepComplete = stepChecksCompleted === step.checks.length;
  const phaseLabel = t.phases[step.phase as keyof typeof t.phases] ?? step.phase;
  const isHe = t === stringsByLang.he;

  return (
    <Card className={`overflow-hidden transition-all ${stepComplete ? "border-emerald-400 bg-emerald-50/40" : ""}`}>
      <CardHeader className="cursor-pointer pb-3" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            stepComplete ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
          }`}>
            {stepComplete ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px]">{phaseLabel}</Badge>
              <CardTitle className="text-base">{step.title}</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t.build.duration}: {step.duration}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {stepChecksCompleted}/{step.checks.length} {t.build.checks}
            </span>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>

          {step.warning && (
            <Alert className="border-amber-300 bg-amber-50">
              <TriangleAlert className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-900 text-sm">{t.build.warningTitle}</AlertTitle>
              <AlertDescription className="text-amber-800 text-xs">{step.warning}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-muted-foreground">{t.build.verificationTitle}</p>
            {step.checks.map((check, i) => {
              const checkId = `${step.id}-${i}`;
              const isDone = completed.has(checkId);
              return (
                <label
                  key={i}
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={isDone}
                    onCheckedChange={() => onToggle(checkId)}
                    className="mt-0.5"
                  />
                  <span className={`text-sm ${isDone ? "line-through text-muted-foreground" : ""}`}>{check}</span>
                </label>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
