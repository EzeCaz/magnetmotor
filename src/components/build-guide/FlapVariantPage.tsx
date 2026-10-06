"use client";

import { useState, useEffect, useMemo } from "react";
import {
  stringsByLang,
  flapDataByLang,
  variantStringsByLang,
  type Lang,
  type UIStrings,
  type VariantStrings,
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
} from "lucide-react";

// Hydration-safe rounding helper
const round = (n: number, decimals = 4): number => {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
};

// ============================================================
// FLAP VARIANT INTERACTIVE DIAGRAM
// Top-down view of the ferromagnetic disc with side magnets
// ============================================================
interface FlapVariantPageProps {
  lang: Lang;
  onPrint: () => void;
  onBackToOriginal: () => void;
  onLanguageToggle: () => void;
}

export default function FlapVariantPage({
  lang,
  onPrint,
  onBackToOriginal,
  onLanguageToggle,
}: FlapVariantPageProps) {
  const t = stringsByLang[lang];
  const vt = variantStringsByLang[lang];
  const flap = flapDataByLang[lang];
  const isHe = lang === "he";

  // Local state
  const [configId, setConfigId] = useState<"2-magnet" | "3-magnet">("3-magnet");
  const [activeFilter, setActiveFilter] = useState<"all" | "magnet" | "metal" | "structural" | "hardware" | "tooling">("all");
  const [bomSearch, setBomSearch] = useState("");
  const [completedBom, setCompletedBom] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [claimSearch, setClaimSearch] = useState("");

  const activeConfig = useMemo(
    () => flap.flapConfigs.find((c) => c.id === configId) ?? flap.flapConfigs[0],
    [flap, configId]
  );

  const filteredBom = useMemo(() => {
    return flap.flapBomItems.filter((b) => {
      if (activeFilter !== "all" && b.category !== activeFilter) return false;
      if (bomSearch && !`${b.part} ${b.spec} ${b.purpose} ${b.source}`.toLowerCase().includes(bomSearch.toLowerCase())) return false;
      return true;
    });
  }, [activeFilter, bomSearch, flap.flapBomItems]);

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSet(next);
  };

  const bomProgress = (completedBom.size / flap.flapBomItems.length) * 100;
  const stepsProgress = (completedSteps.size / (flap.flapBuildSteps.length * 4)) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-500 to-slate-900 flex items-center justify-center text-white">
              <Disc3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">{flap.flapVariantInfo.title}</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">{flap.flapVariantInfo.parentPatent}</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            <a href="#overview" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <FileText className="h-3.5 w-3.5" /> {isHe ? "סקירה" : "Overview"}
            </a>
            <a href="#theory" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <BookOpen className="h-3.5 w-3.5" /> {isHe ? "תיאוריה" : "Theory"}
            </a>
            <a href="#bom" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <Boxes className="h-3.5 w-3.5" /> {isHe ? "חומרים" : "Materials"}
            </a>
            <a href="#diagram" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:bg-slate-100">
              <Eye className="h-3.5 w-3.5" /> {isHe ? "תרשים" : "Diagram"}
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
              <span className="hidden sm:inline">{isHe ? "לפטנט המקורי" : "Original"}</span>
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
              <Badge className="mb-3" variant="secondary">{flap.flapVariantInfo.number}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {isHe ? "בנו " : "Build a "}
                <span className="bg-gradient-to-r from-orange-600 to-slate-900 bg-clip-text text-transparent">
                  {flap.flapVariantInfo.title}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mt-3">{flap.flapVariantInfo.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> {isHe ? "מידע הוריאנט" : "Variant Information"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "מספר" : "Number"}</span><span className="font-medium">{flap.flapVariantInfo.number}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "סוג" : "Type"}</span><span className="font-medium">{flap.flapVariantInfo.type}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "פטנט מקור" : "Parent Patent"}</span><span className="font-medium">{flap.flapVariantInfo.parentPatent}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "פריטי BOM" : "BOM Items"}</span><span className="font-medium">{flap.flapBomItems.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{isHe ? "שלבי בנייה" : "Build Steps"}</span><span className="font-medium">{flap.flapBuildSteps.length}</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Orbit className="h-4 w-4" /> {isHe ? "תצורות" : "Configurations"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {flap.flapConfigs.map((c) => (
                    <div key={c.id} className="border-b pb-1.5 last:border-0">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={configId === c.id ? "default" : "outline"}
                          onClick={() => setConfigId(c.id)}
                          className="text-xs h-7"
                        >
                          {c.label}
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{c.angles.join("°, ")}°</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5" /> {isHe ? "כיצד וריאנט זה שונה מהפטנט המקורי" : "How This Variant Differs from the Original Patent"}</CardTitle>
                <CardDescription>{isHe ? "השוואת הגישה" : "Side-by-side comparison"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg border border-slate-200 p-3">
                    <p className="font-semibold mb-2 flex items-center gap-2"><Magnet className="h-4 w-4 text-red-500" /> {isHe ? "פטנט מקורי" : "Original Patent"}</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• {isHe ? "ארמטורת מגנט קבוע" : "Permanent-magnet armature"}</li>
                      <li>• {isHe ? "מסיל סטטור עם מגנטים מרובים" : "Stator track with multiple magnets"}</li>
                      <li>• {isHe ? "כוח משיכה + דחייה" : "Attraction + repulsion forces"}</li>
                      <li>• {isHe ? "מימוש לינארי ורוטרי" : "Linear and rotary embodiments"}</li>
                      <li>• {isHe ? "רכיבי NdFeB יקרים" : "Expensive NdFeB components"}</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-orange-200 bg-orange-50/40 p-3">
                    <p className="font-semibold mb-2 flex items-center gap-2"><Disc3 className="h-4 w-4 text-orange-500" /> {isHe ? "וריאנט דיסקה" : "Flap Variant"}</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• {isHe ? "דיסקת רכיכה פרומגנטית" : "Soft ferromagnetic disc rotor"}</li>
                      <li>• {isHe ? "2-3 מגנטי צד סטטיים" : "2-3 static side magnets"}</li>
                      <li>• {isHe ? "משיכה בלבד + מגן יציאה" : "Attraction only + exit-side shield"}</li>
                      <li>• {isHe ? "מימוש רוטרי בלבד" : "Rotary embodiment only"}</li>
                      <li>• {isHe ? "דיסקת פלדה זולה + מגנטים מעטים" : "Cheap steel disc + few magnets"}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Ruler className="h-4 w-4" /> {isHe ? "מידות אב-טיפוס" : "Prototype Dimensions"}</CardTitle>
                <CardDescription>{isHe ? "דיסקת 6 אינץ' עם 3 מגנטים" : "6 in disc with 3 magnets"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {flap.flapPrototypeDimensions.map((d) => (
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

            <Card className="bg-gradient-to-br from-orange-600 to-slate-900 text-white border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-white"><Sparkles className="h-4 w-4" /> {isHe ? "תובנה מרכזית" : "Key Insight"}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-orange-50">
                <p>
                  {isHe
                    ? "הדיסקה חייבת להיות א-סימטרית — חצי עבה, חצי דק — כדי שהמשיכה המגנטית תהיה חזקה יותר בצד ההתקרבות מאשר בצד היציאה."
                    : "The disc must be asymmetric — half thick, half thin — so magnetic attraction is stronger on the approach side than on the exit side."}
                </p>
                <p>
                  {isHe
                    ? "מגן ה-μ-metal בצד היציאה של כל מגנט קריטי: בלעדיו, הדיסקה ננעלת במקום להמשיך להסתובב."
                    : "The μ-metal shield at the exit side of each magnet is critical: without it, the disc locks instead of continuing to rotate."}
                </p>
                <p className="text-orange-200 italic text-[10px]">
                  {isHe ? "התצורה המומלצת למתחילים: 3 מגנטים" : "Recommended for beginners: 3-magnet configuration"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" /> {isHe ? "במבט מהיר" : "At a Glance"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-orange-500" /><span>{isHe ? "דיסקת פלדה 6 אינץ' OD" : "6 in OD steel disc"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500" /><span>{isHe ? "2 או 3 מגנטי NdFeB" : "2 or 3 NdFeB magnets"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500" /><span>{isHe ? "7 שלבי בנייה" : "7 build steps"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /><span>{isHe ? "18 פריטי BOM" : "18 BOM items"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500" /><span>{isHe ? "10 כלי סדנה" : "10 workshop tools"}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-purple-500" /><span>{isHe ? "2 תצורות (2/3 מגנטים)" : "2 configurations (2/3 magnets)"}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== THEORY ===== */}
      <section id="theory" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<BookOpen className="h-5 w-5" />}
          title={isHe ? "תורת הפעולה" : "Theory of Operation"}
          subtitle={isHe ? "כיצד דיסקת רכיכה פרומגנטית ומגנטי צד סטטיים מייצרים סיבוב רציף" : "How a soft ferromagnetic disc and static side magnets produce continuous rotation"}
        />
        <div className="grid lg:grid-cols-2 gap-6">
          {flap.flapTheoryPoints.map((tp, i) => (
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
          subtitle={isHe ? "תצורה עליונה של הדיסקה המסתובבת ומגנטי הצד — החליפו בין 2 ל-3 מגנטים" : "Top-down view of the rotating disc and side magnets — toggle between 2 and 3 magnets"}
        />
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">{activeConfig.label}</CardTitle>
                <CardDescription className="mt-1">{activeConfig.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                {flap.flapConfigs.map((c) => (
                  <Button
                    key={c.id}
                    size="sm"
                    variant={configId === c.id ? "default" : "outline"}
                    onClick={() => setConfigId(c.id)}
                  >
                    {c.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FlapMotorDiagram config={activeConfig} isHe={isHe} />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {isHe ? "יתרונות" : "Pros"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1.5">
                {activeConfig.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><TriangleAlert className="h-4 w-4 text-amber-500" /> {isHe ? "חסרונות" : "Cons"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1.5">
                {activeConfig.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">−</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== BOM ===== */}
      <section id="bom" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<Boxes className="h-5 w-5" />}
          title={isHe ? "חשבונית חומרים" : "Bill of Materials"}
          subtitle={isHe ? "כל חלק שנדרש לוריאנט הדיסקה" : "Every part you need for the flap variant"}
        />

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t.bom.acquisition}</span>
            <span className="font-medium">{completedBom.size} / {flap.flapBomItems.length}</span>
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
          {t.bom.showing} {filteredBom.length} {t.bom.of} {flap.flapBomItems.length}.
        </p>
      </section>

      {/* ===== TOOLS ===== */}
      <section id="tools" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-white/60 rounded-xl">
        <SectionHeader
          icon={<Wrench className="h-5 w-5" />}
          title={t.tools.title}
          subtitle={isHe ? "כלים לעיבוד הדיסקה והרכבת המנוע" : "Tools for machining the disc and assembling the motor"}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flap.flapWorkshopTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    tool.required ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"
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
          subtitle={isHe ? "7 שלבים מדיסקת פלדה גולמית למנוע מסתובב" : "7 phases from raw steel disc to a rotating motor"}
        />

        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t.build.checklistProgress}</span>
            <span className="font-medium">{completedSteps.size} / {flap.flapBuildSteps.length * 4} {t.build.checks}</span>
          </div>
          <Progress value={stepsProgress} />
        </div>

        <div className="space-y-4">
          {flap.flapBuildSteps.map((step, i) => (
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
          subtitle={isHe ? "מידע קריטי לפני עיבוד והרכבת מנוע ה-flap" : "Critical information before machining and assembling the flap motor"}
        />
        <div className="grid md:grid-cols-2 gap-4">
          {flap.flapSafetyItems.map((s) => {
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
          subtitle={isHe ? "מצבי כשל נפוצים במנוע ה-flap וכיצד לתקן" : "Common failure modes for the flap motor and how to fix them"}
        />
        <div className="grid md:grid-cols-2 gap-4">
          {flap.flapTroubleshooting.map((tr, i) => (
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
                <Disc3 className="h-4 w-4" /> {flap.flapVariantInfo.title}
              </h3>
              <p className="text-xs text-slate-400">
                {isHe
                  ? "וריאנט של US 4,151,431 (ג'ונסון, 1979). משתמש בדיסקת רכיכה פרומגנטית במקום ארמטורה מגנטית."
                  : "Variant of US 4,151,431 (Johnson, 1979). Uses a soft ferromagnetic disc in place of the magnetic armature."}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Factory className="h-4 w-4" /> {isHe ? "מידע בנייה" : "Build Information"}</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>{isHe ? "תצורה: 2 או 3 מגנטים" : "Configuration: 2 or 3 magnets"}</li>
                <li>{isHe ? "18 פריטי BOM, 10 כלי סדנה" : "18 BOM items, 10 workshop tools"}</li>
                <li>{isHe ? "7 שלבי הרכבה" : "7 assembly steps"}</li>
                <li>{isHe ? "תרשים אינטראקטיבי + מאפייני תצורה" : "Interactive diagram + configuration pros/cons"}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Info className="h-4 w-4" /> {t.footer.disclaimerTitle}</h3>
              <p className="text-xs text-slate-400">
                {isHe
                  ? "מדריך בנייה זה הוא פרשנות הנדסית של הפטנט המקורי. טענת הפטנט בדבר כוח מניע רציף ממגנטים קבועים בלבד אינה עקבית עם החוק השני של התרמודינמיקה. הוריאנט מומלץ להתייחס אליו כמקרה מחקר הנדסי."
                  : "This build guide is an engineering reinterpretation of the original patent. The patent's claim of continuous motive power from permanent magnets alone is not consistent with the second law of thermodynamics. The variant is best treated as an engineering case study."}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between flex-wrap gap-2">
            <span>{isHe ? "וריאנט של US 4,151,431 — מנוע מגנטים קבועים" : "Variant of US 4,151,431 — Permanent Magnet Motor"}</span>
            <span>{isHe ? "כל הזכויות על פטנט המקור שמורות להווארד ר. ג'ונסון, 1979" : "Original patent rights: Howard R. Johnson, 1979"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// FLAP MOTOR INTERACTIVE SVG DIAGRAM
// Top-down view: ferromagnetic disc + side magnets + shields
// ============================================================
function FlapMotorDiagram({
  config,
  isHe,
}: {
  config: { id: "2-magnet" | "3-magnet"; label: string; angles: number[] };
  isHe: boolean;
}) {
  const [angle, setAngle] = useState(0); // disc rotation in degrees
  const [autoPlay, setAutoPlay] = useState(true);
  const [airGap, setAirGap] = useState(60); // in mils (0.001 in), 60 mils = 0.060 in
  const [showShields, setShowShields] = useState(true);
  const [showForces, setShowForces] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setAngle((a) => (a + 1.5) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const cx = 270;
  const cy = 200;
  const discR = 100;
  const magnetR = discR + 15 + (airGap / 300) * 50; // air gap visualization

  // Pre-compute magnet positions and force vectors with deterministic rounding
  const magnetPositions = useMemo(() => {
    return config.angles.map((deg, i) => {
      const a = (deg * Math.PI) / 180 - Math.PI / 2;
      const x = round(cx + magnetR * Math.cos(a), 2);
      const y = round(cy + magnetR * Math.sin(a), 2);
      // Shield position is 15° past the magnet on the exit side (clockwise rotation)
      const shieldDeg = deg + 15;
      const shieldA = (shieldDeg * Math.PI) / 180 - Math.PI / 2;
      const sx = round(cx + (magnetR - 5) * Math.cos(shieldA), 2);
      const sy = round(cy + (magnetR - 5) * Math.sin(shieldA), 2);
      // Force vector from magnet toward disc center
      const fx = round(x - 15 * Math.cos(a), 2);
      const fy = round(y - 15 * Math.sin(a), 2);
      const fx2 = round(x - 35 * Math.cos(a), 2);
      const fy2 = round(y - 35 * Math.sin(a), 2);
      return { x, y, sx, sy, fx, fy, fx2, fy2, a, deg };
    });
  }, [config.angles, magnetR]);

  // Disc with asymmetric profile — thicker on one half (0° to 180°)
  // Render as two arcs with different shading
  const thickPath = useMemo(() => {
    const a0 = (0 * Math.PI) / 180 - Math.PI / 2;
    const a1 = (180 * Math.PI) / 180 - Math.PI / 2;
    const rOut = discR;
    const rIn = 0;
    const x0 = round(cx + rOut * Math.cos(a0), 2);
    const y0 = round(cy + rOut * Math.sin(a0), 2);
    const x1 = round(cx + rOut * Math.cos(a1), 2);
    const y1 = round(cy + rOut * Math.sin(a1), 2);
    return `M ${cx} ${cy} L ${x0} ${y0} A ${rOut} ${rOut} 0 0 1 ${x1} ${y1} Z`;
  }, [cx, cy, discR]);

  const thinPath = useMemo(() => {
    const a0 = (180 * Math.PI) / 180 - Math.PI / 2;
    const a1 = (360 * Math.PI) / 180 - Math.PI / 2;
    const rOut = discR * 0.85; // 33% thinner visualized as 15% smaller radius
    const x0 = round(cx + rOut * Math.cos(a0), 2);
    const y0 = round(cy + rOut * Math.sin(a0), 2);
    const x1 = round(cx + rOut * Math.cos(a1), 2);
    const y1 = round(cy + rOut * Math.sin(a1), 2);
    return `M ${cx} ${cy} L ${x0} ${y0} A ${rOut} ${rOut} 0 0 1 ${x1} ${y1} Z`;
  }, [cx, cy, discR]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {isHe
              ? "תצורה עליונה של הדיסקה ומגנטי הצד — הדיסקה מסתובבת עם כיוון השעון"
              : "Top-down view of the disc and side magnets — disc rotates clockwise"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isHe
              ? "החצי העבה של הדיסקה (כהה יותר) נמשך אל כל מגנט בזווית התקרבותו. המגנים בצד היציאה (כחול) מחלישים את המשיכה כדי לאפשר לדיסקה להמשיך להסתובב."
              : "The thick half of the disc (darker) is attracted to each magnet at its approach angle. The exit-side shields (blue) weaken the attraction to let the disc continue rotating."}
          </p>
        </div>
        <Button size="sm" variant={autoPlay ? "secondary" : "default"} onClick={() => setAutoPlay(!autoPlay)}>
          {autoPlay ? (isHe ? "עצור" : "Pause") : (isHe ? "סובב" : "Spin")}
        </Button>
      </div>

      <svg viewBox="0 0 540 400" className="w-full h-auto rounded-xl border bg-gradient-to-b from-slate-50 to-white">
        <defs>
          <linearGradient id="discThickGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#475569" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="discThinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#94a3b8" />
            <stop offset="1" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="magnetGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dc2626" />
            <stop offset="1" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
          <radialGradient id="hubGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#475569" />
          </radialGradient>
          <marker id="forceArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3 L0,6 Z" fill="#dc2626" />
          </marker>
          <marker id="rotationArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3 L0,6 Z" fill="#10b981" />
          </marker>
        </defs>

        {/* Concentric reference circles */}
        <circle cx={cx} cy={cy} r={discR + 35} fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,3" />
        <circle cx={cx} cy={cy} r={discR + 5} fill="none" stroke="#cbd5e1" strokeWidth="0.5" />

        {/* Disc with stepped profile — rotates as a group */}
        <g transform={`rotate(${round(angle, 2)} ${cx} ${cy})`}>
          {/* Thick half (0° to 180°) */}
          <path d={thickPath} fill="url(#discThickGrad)" stroke="#0f172a" strokeWidth="0.8" />
          {/* Thin half (180° to 360°) */}
          <path d={thinPath} fill="url(#discThinGrad)" stroke="#475569" strokeWidth="0.6" />
          {/* Step boundary lines */}
          <line
            x1={cx}
            y1={cy - discR}
            x2={cx}
            y2={cy + discR}
            stroke="#0f172a"
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />
          {/* Center hub */}
          <circle cx={cx} cy={cy} r="8" fill="url(#hubGrad)" stroke="#334155" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="3" fill="#0f172a" />
          {/* Label markers on disc — show orientation */}
          <text x={cx} y={cy - discR + 15} textAnchor="middle" className="text-[9px] fill-white font-bold">
            {isHe ? "עבה" : "THICK"}
          </text>
          <text x={cx} y={cy + discR - 8} textAnchor="middle" className="text-[9px] fill-slate-700 font-bold">
            {isHe ? "דק" : "THIN"}
          </text>
        </g>

        {/* Side magnets (stationary) */}
        {magnetPositions.map((p, i) => (
          <g key={i}>
            {/* Magnet body — represented as a 1x0.5 in block (scaled to 25x12 px) */}
            <g transform={`translate(${p.x} ${p.y}) rotate(${p.deg + 90})`}>
              <rect x="-12" y="-7" width="24" height="14" fill="url(#magnetGrad)" stroke="#7f1d1d" strokeWidth="0.8" rx="2" />
              <text x="0" y="-10" textAnchor="middle" className="text-[9px] fill-red-700 font-bold">N</text>
            </g>
            {/* Force vector from magnet toward disc center */}
            {showForces && (
              <line
                x1={p.fx}
                y1={p.fy}
                x2={p.fx2}
                y2={p.fy2}
                stroke="#dc2626"
                strokeWidth="1.5"
                strokeDasharray="3,2"
                markerEnd="url(#forceArrow)"
              />
            )}
            {/* Exit-side μ-metal shield */}
            {showShields && (
              <g transform={`translate(${p.sx} ${p.sy}) rotate(${p.deg + 90})`}>
                <rect x="-8" y="-4" width="16" height="8" fill="url(#shieldGrad)" stroke="#1e3a8a" strokeWidth="0.6" rx="1" />
              </g>
            )}
            {/* Magnet angle label */}
            <text
              x={round(cx + (magnetR + 25) * Math.cos(p.a), 2)}
              y={round(cy + (magnetR + 25) * Math.sin(p.a), 2)}
              textAnchor="middle"
              className="text-[9px] fill-slate-700 font-medium"
            >
              {p.deg}°
            </text>
          </g>
        ))}

        {/* Rotation direction indicator */}
        <path
          d={`M ${cx + 35} ${cy - 35} A 50 50 0 0 1 ${cx + 50} ${cy}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          markerEnd="url(#rotationArrow)"
        />
        <text x={cx + 60} y={cy - 30} className="text-[10px] fill-emerald-600 font-bold">
          {isHe ? "סיבוב" : "Rotation"}
        </text>

        {/* Legend */}
        <g transform="translate(20, 350)">
          <rect x="0" y="0" width="14" height="8" fill="url(#discThickGrad)" stroke="#0f172a" strokeWidth="0.5" />
          <text x="18" y="6" className="text-[9px] fill-slate-700">{isHe ? "חצי עבה" : "Thick half"}</text>
          <rect x="80" y="0" width="14" height="8" fill="url(#discThinGrad)" stroke="#475569" strokeWidth="0.5" />
          <text x="98" y="6" className="text-[9px] fill-slate-700">{isHe ? "חצי דק" : "Thin half"}</text>
          <rect x="170" y="0" width="14" height="8" fill="url(#magnetGrad)" stroke="#7f1d1d" strokeWidth="0.5" />
          <text x="188" y="6" className="text-[9px] fill-slate-700">{isHe ? "מגנט" : "Magnet"}</text>
          {showShields && (
            <>
              <rect x="240" y="0" width="14" height="8" fill="url(#shieldGrad)" stroke="#1e3a8a" strokeWidth="0.5" />
              <text x="258" y="6" className="text-[9px] fill-slate-700">{isHe ? "מגן" : "Shield"}</text>
            </>
          )}
          {showForces && (
            <>
              <line x1="310" y1="4" x2="324" y2="4" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="328" y="6" className="text-[9px] fill-slate-700">{isHe ? "כוח" : "Force"}</text>
            </>
          )}
        </g>
      </svg>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-muted-foreground font-medium block mb-1">
            {isHe ? "רווח אוויר" : "Air gap"}: {(airGap / 1000).toFixed(3)} in
          </label>
          <Slider value={[airGap]} onValueChange={(v) => setAirGap(v[0])} min={20} max={150} step={5} />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>0.020 in</span>
            <span>0.150 in</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium block mb-1">
            {isHe ? "הצג מגנים" : "Show shields"}
          </label>
          <Button size="sm" variant={showShields ? "default" : "outline"} onClick={() => setShowShields(!showShields)} className="w-full">
            {showShields ? (isHe ? "מוצגים" : "Visible") : (isHe ? "מוסתרים" : "Hidden")}
          </Button>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium block mb-1">
            {isHe ? "הצד וקטורי כוח" : "Show force vectors"}
          </label>
          <Button size="sm" variant={showForces ? "default" : "outline"} onClick={() => setShowForces(!showForces)} className="w-full">
            {showForces ? (isHe ? "מוצגים" : "Visible") : (isHe ? "מוסתרים" : "Hidden")}
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
