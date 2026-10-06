"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  stringsByLang,
  dataByLang,
  variantStringsByLang,
  detectLanguageFromNavigator,
  type Lang,
  type UIStrings,
} from "@/lib/patent/i18n";
import FlapVariantPage from "@/components/build-guide/FlapVariantPage";
import PushVariantPage from "@/components/build-guide/PushVariantPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Target,
} from "lucide-react";

// ============================================================
// HYDRATION FIX: deterministic rounding for SVG path values
// Floating-point precision differences between Node.js and Chrome
// V8 can produce different last-decimal results for Math.cos/sin.
// Rounding to 4 decimals ensures server-rendered HTML exactly
// matches client-rendered HTML, preventing React hydration warnings.
// ============================================================
const round = (n: number, decimals = 4): number => {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
};
const r2 = (n: number): number => round(n, 2);

// ============================================================
// LANGUAGE HOOK with auto-detection
// Priority:
//   1. localStorage `pmm-lang` if set (user explicitly chose)
//   2. navigator.languages (auto-detect from browser/HTTP Accept-Language)
//   3. Default "en"
// The lazy initialiser runs once on the client; SSR returns "en" (typeof window
// is undefined). After hydration, the inline <script> in layout.tsx has already
// set document.dir to match the localStorage value (if any), so there's no
// visual flash for users with a saved preference. Users with no saved
// preference but an `he` browser will see a single-frame flash from LTR→RTL
// after hydration — this is acceptable for an auto-detect feature.
// ============================================================
function useLanguage(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    try {
      // 1) User's explicit saved preference
      const stored = localStorage.getItem("pmm-lang") as Lang | null;
      if (stored === "en" || stored === "he") return stored;
      // 2) Auto-detect from navigator.languages (mirrors Accept-Language header)
      return detectLanguageFromNavigator();
    } catch {
      return "en";
    }
  });

  // Sync document direction to match the language on mount and changes.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("pmm-lang", l);
    } catch {
      // ignore
    }
    document.documentElement.lang = l;
    document.documentElement.dir = l === "he" ? "rtl" : "ltr";
  };

  return [lang, changeLang];
}

// ============================================================
// SECTION NAVIGATION
// ============================================================
const sectionIds = [
  "overview",
  "theory",
  "bom",
  "tools",
  "linear",
  "rotary",
  "simulator",
  "safety",
  "claims",
  "troubleshoot",
] as const;

// ============================================================
// HELPERS
// ============================================================
function useScrollSpy() {
  const [active, setActive] = useState<string>("overview");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

// ============================================================
// LINEAR MOTOR INTERACTIVE SVG
// ============================================================
function LinearMotorDiagram({ t }: { t: UIStrings }) {
  const [position, setPosition] = useState(50); // 0..100 (% along track)
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    let dir = 1;
    const interval = setInterval(() => {
      setPosition((p) => {
        const next = p + dir * 0.7;
        if (next > 92) dir = -1;
        if (next < 8) dir = 1;
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [autoPlay]);

  // Geometry constants
  const STATOR_W = 60; // each stator magnet width (px) → ~1 in
  const STATOR_GAP = 15; // ~0.25 in
  const STATOR_COUNT = 5;
  const TRACK_LEFT = 60;
  const TRACK_RIGHT = TRACK_LEFT + STATOR_COUNT * STATOR_W + (STATOR_COUNT - 1) * STATOR_GAP;
  const ARMATURE_LEN = 2 * STATOR_W + STATOR_GAP + 5; // slightly greater than 2 stators + gap

  // Deterministic, rounded armature position
  const armatureX = round(TRACK_LEFT + (position / 100) * (TRACK_RIGHT - TRACK_LEFT - ARMATURE_LEN), 2);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t.build.linearInteractDesc}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t === stringsByLang.en
              ? "Each stator magnet (red = N up, blue = S down) is 1 in wide; gap is 0.25 in. Armature is 3 in long (≈ 2 stators + 1 gap)."
              : "כל מגנט סטטור (אדום = N למעלה, כחול = S למטה) ברוחב 1 אינץ'; רווח 0.25 אינץ'. ארמטורה באורך 3 אינץ' (≈ 2 סטטורים + רווח)."}
          </p>
        </div>
        <Button
          size="sm"
          variant={autoPlay ? "secondary" : "default"}
          onClick={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? t.build.pause : t.build.autoRun}
        </Button>
      </div>

      <svg viewBox="0 0 540 220" className="w-full h-auto rounded-xl border bg-gradient-to-b from-slate-50 to-white">
        <defs>
          <linearGradient id="armatureGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dc2626" />
            <stop offset="1" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="statorGradN" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ef4444" />
            <stop offset="1" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="statorGradS" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="backingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#94a3b8" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
          <marker id="arrowR" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L9,3 L0,6 Z" fill="#dc2626" />
          </marker>
        </defs>

        {/* Backing plate (high-μ) */}
        <rect x={TRACK_LEFT - 10} y={140} width={TRACK_RIGHT - TRACK_LEFT + 20} height={20} fill="url(#backingGrad)" rx="2" />
        <text x={TRACK_LEFT - 5} y={172} className="text-[10px] fill-slate-600 font-medium">
          {t === stringsByLang.en ? "High-μ backing plate (Netic Co-Netic)" : "לוח אחורי בעל חדירות גבוהה (Netic Co-Netic)"}
        </text>

        {/* Stator magnets */}
        {Array.from({ length: STATOR_COUNT }).map((_, i) => {
          const x = TRACK_LEFT + i * (STATOR_W + STATOR_GAP);
          const offsetX = i % 2 === 0 ? 0 : 3;
          return (
            <g key={i}>
              <rect x={x + offsetX} y={100} width={STATOR_W} height={20} fill="url(#statorGradN)" stroke="#7f1d1d" strokeWidth="0.5" />
              <text x={x + offsetX + STATOR_W / 2} y={114} textAnchor="middle" className="text-[10px] fill-white font-bold">N</text>
              <rect x={x + offsetX} y={120} width={STATOR_W} height={20} fill="url(#statorGradS)" stroke="#1e3a8a" strokeWidth="0.5" />
              <text x={x + offsetX + STATOR_W / 2} y={134} textAnchor="middle" className="text-[10px] fill-white font-bold">S</text>
            </g>
          );
        })}

        {/* Air gap indicator */}
        <line x1={TRACK_LEFT} y1={92} x2={TRACK_RIGHT} y2={92} stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="0.5" />
        <text x={TRACK_RIGHT + 4} y={96} className="text-[9px] fill-slate-500">
          {t === stringsByLang.en ? "air gap ≈ 0.125 in" : "רווח אוויר ≈ 0.125 אינץ'"}
        </text>

        {/* Armature magnet */}
        <g transform={`translate(${armatureX}, 0)`}>
          <path
            d={`M 0,80 Q ${ARMATURE_LEN / 2},72 ${ARMATURE_LEN},80 L ${ARMATURE_LEN - 6},95 Q ${ARMATURE_LEN / 2},88 6,95 Z`}
            fill="url(#armatureGrad)"
            stroke="#7f1d1d"
            strokeWidth="0.8"
          />
          <polygon points={`0,80 -5,82 -5,93 0,95`} fill="#7f1d1d" />
          <polygon points={`${ARMATURE_LEN},80 ${ARMATURE_LEN + 5},82 ${ARMATURE_LEN + 5},93 ${ARMATURE_LEN},95`} fill="#7f1d1d" />
          <text x={6} y={90} className="text-[10px] fill-white font-bold">N</text>
          <text x={ARMATURE_LEN - 12} y={90} className="text-[10px] fill-white font-bold">S</text>

          <line
            x1={ARMATURE_LEN / 2}
            y1={65}
            x2={ARMATURE_LEN / 2 + 25}
            y2={65}
            stroke="#dc2626"
            strokeWidth="2"
            markerEnd="url(#arrowR)"
          />
          <text x={ARMATURE_LEN / 2 + 28} y={69} className="text-[10px] fill-red-600 font-bold">F→</text>
        </g>

        <text x={TRACK_LEFT} y={195} className="text-[10px] fill-slate-600 font-medium">{t.build.motionDir}</text>

        <line x1={TRACK_LEFT} y1={185} x2={TRACK_RIGHT} y2={185} stroke="#cbd5e1" strokeWidth="1" markerEnd="url(#arrowR)" />
      </svg>

      <div className="space-y-2">
        <Slider
          value={[position]}
          onValueChange={(v) => {
            setPosition(v[0]);
            setAutoPlay(false);
          }}
          min={0}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t.build.trackStart}</span>
          <span>{t.build.position}: {position.toFixed(0)}%</span>
          <span>{t.build.trackEnd}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
          <p className="font-semibold text-emerald-900 flex items-center gap-2">
            <Zap className="h-4 w-4" /> {t.build.alwaysOn}
          </p>
          <p className="text-xs text-emerald-800 mt-1">{t.build.alwaysOnDesc}</p>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="font-semibold text-amber-900 flex items-center gap-2">
            <Layers className="h-4 w-4" /> {t.build.lengthRatio}
          </p>
          <p className="text-xs text-amber-800 mt-1">{t.build.lengthRatioDesc}</p>
        </div>
        <div className="rounded-lg bg-sky-50 border border-sky-200 p-3">
          <p className="font-semibold text-sky-900 flex items-center gap-2">
            <Settings className="h-4 w-4" /> {t.build.varSpacing}
          </p>
          <p className="text-xs text-sky-800 mt-1">{t.build.varSpacingDesc}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ROTARY MOTOR INTERACTIVE SVG
// ============================================================
function RotaryMotorDiagram({ t }: { t: UIStrings }) {
  const [angle, setAngle] = useState(0); // degrees
  const [autoPlay, setAutoPlay] = useState(true);
  const [axialEngagement, setAxialEngagement] = useState(80); // %

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setAngle((a) => (a + 2 + (axialEngagement / 100) * 1.5) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [autoPlay, axialEngagement]);

  const cx = 270;
  const cy = 200;
  const statorR = 130;
  const armatureR = 165;
  const statorCount = 12;

  // 3 armature magnets at staggered angles (NOT 120°)
  const armatureAngles = [0, 122, 244];

  // Pre-compute all stator wedge paths with deterministic rounding
  const statorPaths = useMemo(() => {
    return Array.from({ length: statorCount }).map((_, i) => {
      const a = (i / statorCount) * 2 * Math.PI - Math.PI / 2;
      const wAngle = (2 * Math.PI) / statorCount * 0.85;
      const offset = i % 2 === 0 ? 0 : 0.04;
      const aStart = a - wAngle / 2 + offset;
      const aEnd = a + wAngle / 2 + offset;
      const rIn = statorR - 22;
      const rOut = statorR - 3;
      const x1 = round(cx + rOut * Math.cos(aStart), 2);
      const y1 = round(cy + rOut * Math.sin(aStart), 2);
      const x2 = round(cx + rOut * Math.cos(aEnd), 2);
      const y2 = round(cy + rOut * Math.sin(aEnd), 2);
      const x3 = round(cx + rIn * Math.cos(aEnd), 2);
      const y3 = round(cy + rIn * Math.sin(aEnd), 2);
      const x4 = round(cx + rIn * Math.cos(aStart), 2);
      const y4 = round(cy + rIn * Math.sin(aStart), 2);
      const labelX = round(cx + (rOut - 12) * Math.cos(a), 2);
      const labelY = round(cy + (rOut - 12) * Math.sin(a) + 3, 2);
      return { x1, y1, x2, y2, x3, y3, x4, y4, rOut, rIn, labelX, labelY };
    });
  }, []);

  // Pre-compute armature wedge paths with deterministic rounding
  // The engagement factor only depends on axialEngagement, not on angle (rotation is applied as a transform)
  const armaturePaths = useMemo(() => {
    const engagement = axialEngagement / 100;
    return armatureAngles.map((baseAngle) => {
      const a = (baseAngle * Math.PI) / 180 - Math.PI / 2;
      const wedgeHalfAngle = (2 * Math.PI / statorCount) * 0.45 * engagement;
      const aStart = a - wedgeHalfAngle;
      const aEnd = a + wedgeHalfAngle;
      const rIn = armatureR - 18;
      const rOut = armatureR - 2;
      const x1 = round(cx + rOut * Math.cos(aStart), 2);
      const y1 = round(cy + rOut * Math.sin(aStart), 2);
      const x2 = round(cx + rOut * Math.cos(aEnd), 2);
      const y2 = round(cy + rOut * Math.sin(aEnd), 2);
      const x3 = round(cx + rIn * Math.cos(aEnd), 2);
      const y3 = round(cy + rIn * Math.sin(aEnd), 2);
      const x4 = round(cx + rIn * Math.cos(aStart), 2);
      const y4 = round(cy + rIn * Math.sin(aStart), 2);
      const labelX = round(cx + (rIn + 5) * Math.cos(a), 2);
      const labelY = round(cy + (rIn + 5) * Math.sin(a) + 3, 2);
      return { x1, y1, x2, y2, x3, y3, x4, y4, rOut, rIn, labelX, labelY, baseAngle };
    });
  }, [axialEngagement]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t === stringsByLang.en
              ? "Interactive rotary motor — 3 staggered armature magnets rotate around 12 stator magnets"
              : "מנוע רוטרי אינטראקטיבי — 3 מגנטי ארמטורה מדורגים מסתובבים סביב 12 מגנטי סטטור"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t.build.rotaryInteractDesc}
          </p>
        </div>
        <Button size="sm" variant={autoPlay ? "secondary" : "default"} onClick={() => setAutoPlay(!autoPlay)}>
          {autoPlay ? t.build.pause : t.build.spin}
        </Button>
      </div>

      <svg viewBox="0 0 540 400" className="w-full h-auto rounded-xl border bg-gradient-to-b from-slate-50 to-white">
        <defs>
          <radialGradient id="statorRingGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#1e293b" stopOpacity="0.05" />
            <stop offset="1" stopColor="#1e293b" stopOpacity="0.15" />
          </radialGradient>
          <linearGradient id="wedgeGradN" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ef4444" />
            <stop offset="1" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="wedgeGradS" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
          <radialGradient id="hubGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#475569" />
          </radialGradient>
          <marker id="arrowRot" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3 L0,6 Z" fill="#dc2626" />
          </marker>
        </defs>

        {/* Stator outer ring */}
        <circle cx={cx} cy={cy} r={statorR - 10} fill="url(#statorRingGrad)" stroke="#475569" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={statorR} fill="none" stroke="#64748b" strokeWidth="3" />
        <text x={cx} y={cy - statorR - 8} textAnchor="middle" className="text-[10px] fill-slate-600 font-medium">
          {t === stringsByLang.en ? "High-μ sleeve (Netic Co-Netic annular ring)" : "שרוול עם חדירות גבוהה (טבעת Netic Co-Netic)"}
        </text>

        {/* 12 stator magnets */}
        {statorPaths.map((p, i) => (
          <g key={i}>
            <path
              d={`M ${p.x1} ${p.y1} A ${p.rOut} ${p.rOut} 0 0 0 ${p.x2} ${p.y2} L ${p.x3} ${p.y3} A ${p.rIn} ${p.rIn} 0 0 1 ${p.x4} ${p.y4} Z`}
              fill="url(#wedgeGradN)"
              stroke="#7f1d1d"
              strokeWidth="0.6"
            />
            <text x={p.labelX} y={p.labelY} textAnchor="middle" className="text-[9px] fill-white font-bold">N</text>
          </g>
        ))}

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={45} fill="url(#hubGrad)" stroke="#334155" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={8} fill="#1e293b" />
        <line x1={cx} y1={cy - 8} x2={cx} y2={cy - 60} stroke="#94a3b8" strokeWidth="2" strokeDasharray="2,2" />
        <text x={cx + 8} y={cy - 60} className="text-[9px] fill-slate-600">
          {t === stringsByLang.en ? "threaded shaft" : "ציר מחורז"}
        </text>

        {/* 3 armature magnets, rotating as a group */}
        <g transform={`rotate(${round(angle, 2)} ${cx} ${cy})`}>
          {armaturePaths.map((p, i) => (
            <g key={i}>
              <path
                d={`M ${p.x1} ${p.y1} A ${p.rOut} ${p.rOut} 0 0 1 ${p.x2} ${p.y2} L ${p.x3} ${p.y3} A ${p.rIn} ${p.rIn} 0 0 0 ${p.x4} ${p.y4} Z`}
                fill="url(#wedgeGradS)"
                stroke="#1e3a8a"
                strokeWidth="0.8"
              />
              <text
                x={p.labelX}
                y={p.labelY}
                textAnchor="middle"
                transform={`rotate(${p.baseAngle + 90} ${p.labelX} ${p.labelY})`}
                className="text-[9px] fill-white font-bold"
              >
                S
              </text>
            </g>
          ))}
          {/* Rotation arrow */}
          <path
            d={`M ${cx + 55} ${cy} A 55 55 0 0 1 ${cx + 38} ${cy + 40}`}
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            markerEnd="url(#arrowRot)"
          />
        </g>

        <text x={cx} y={cy + armatureR + 25} textAnchor="middle" className="text-[10px] fill-slate-600 font-medium">
          ↻ {t === stringsByLang.en ? "rotation (staggered armature magnets 0°, 122°, 244°)" : "סיבוב (מגנטי ארמטורה מדורגים 0°, 122°, 244°)"}
        </text>

        <text x="20" y="20" className="text-[10px] fill-slate-600 font-medium">
          {t === stringsByLang.en ? `Axial engagement: ${axialEngagement}%` : `הצמדה צירית: ${axialEngagement}%`}
        </text>
        <rect x="20" y="25" width="120" height="6" rx="2" fill="#e2e8f0" />
        <rect x="20" y="25" width={(axialEngagement / 100) * 120} height="6" rx="2" fill="#dc2626" />
      </svg>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-medium">{t.build.axialEngagement}</label>
        <Slider
          value={[axialEngagement]}
          onValueChange={(v) => setAxialEngagement(v[0])}
          min={20}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t.build.low}</span>
          <span>{axialEngagement}%</span>
          <span>{t.build.full}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORCE vs AIR-GAP SIMULATOR
// ============================================================
function AirGapSimulator({ t }: { t: UIStrings }) {
  const [gap, setGap] = useState(125); // mils
  const [magnetGrade, setMagnetGrade] = useState(50);
  // Simplified force model: F = k * Br^2 * exp(-gap/gap0)
  const Br = 1.28 + ((magnetGrade - 42) / 8) * 0.05;
  const k = 0.05;
  const gapMm = gap * 0.0254;
  const forceNet = k * Br * Br * Math.exp(-(gapMm / 5)) * 100;
  const forcePulse = 0.4 * forceNet * Math.exp(-Math.abs(gapMm - 3) / 6);
  const smoothness = Math.max(0, 100 - (forcePulse / Math.max(forceNet, 0.01)) * 100);

  let optMessage = t.simulator.optHigh;
  if (smoothness > 75) optMessage = t.simulator.optExcellent;
  else if (smoothness > 50) optMessage = t.simulator.optAcceptable;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">
            {t.simulator.airGapLabel}: {(gap / 1000).toFixed(3)} in ({gapMm.toFixed(2)} mm)
          </label>
          <Slider value={[gap]} onValueChange={(v) => setGap(v[0])} min={50} max={300} step={5} className="mt-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.050 in</span>
            <span>0.300 in</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">{t.simulator.magnetGradeLabel}: N{magnetGrade}</label>
          <Slider value={[magnetGrade]} onValueChange={(v) => setMagnetGrade(v[0])} min={35} max={55} step={1} className="mt-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>N35</span>
            <span>N55</span>
          </div>
        </div>

        <Card className="bg-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Gauge className="h-4 w-4 text-red-500" /> {t.simulator.forceOutputTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.simulator.netThrust}</span>
              <span className="font-bold text-emerald-600">{forceNet.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.simulator.peakPulsation}</span>
              <span className="font-bold text-amber-600">{forcePulse.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.simulator.smoothness}</span>
              <span className="font-bold" style={{ color: smoothness > 75 ? "#16a34a" : smoothness > 50 ? "#d97706" : "#dc2626" }}>
                {smoothness.toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.simulator.magnetRemanence}</span>
              <span className="font-bold">{Br.toFixed(2)} T</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Microscope className="h-4 w-4 text-blue-500" /> {t.simulator.chartTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ForceChart gap={gap} magnetGrade={magnetGrade} t={t} />
            <p className="text-xs text-muted-foreground mt-3">{t.simulator.chartDesc}</p>
          </CardContent>
        </Card>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>{t.simulator.optimizationTitle}</AlertTitle>
          <AlertDescription>{optMessage}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

function ForceChart({ gap, magnetGrade, t }: { gap: number; magnetGrade: number; t: UIStrings }) {
  const w = 320;
  const h = 160;
  // Compute deterministic, rounded points
  const points = useMemo(() => {
    const arr: { x: number; netF: number; pulse: number }[] = [];
    for (let g = 50; g <= 300; g += 5) {
      const Br = 1.28 + ((magnetGrade - 42) / 8) * 0.05;
      const k = 0.05;
      const gapMm = g * 0.0254;
      const netF = k * Br * Br * Math.exp(-gapMm / 5) * 100;
      const pulse = 0.4 * netF * Math.exp(-Math.abs(gapMm - 3) / 6);
      arr.push({
        x: round(((g - 50) / 250) * w, 2),
        netF: round(netF, 4),
        pulse: round(pulse, 4),
      });
    }
    return arr;
  }, [magnetGrade]);

  const maxF = Math.max(...points.map((p) => p.netF));
  const netPath = points.map((p) => `${p.x},${round(h - (p.netF / maxF) * h * 0.9, 2)}`).join(" ");
  const pulsePath = points.map((p) => `${p.x},${round(h - (p.pulse / maxF) * h * 0.9, 2)}`).join(" ");
  const cursorX = round(((gap - 50) / 250) * w, 2);
  // Find nearest point's netF y for the cursor circle
  const nearestPoint = points.reduce((best, p) =>
    Math.abs(p.x - cursorX) < Math.abs(best.x - cursorX) ? p : best
  );
  const cursorY = round(h - (nearestPoint.netF / maxF) * h * 0.9, 2);

  return (
    <svg viewBox={`0 0 ${w + 30} ${h + 30}`} className="w-full h-auto">
      <text x={5} y={12} className="text-[9px] fill-slate-500">{t.simulator.forceAxis}</text>
      <text x={w} y={h + 18} className="text-[9px] fill-slate-500" textAnchor="end">{t.simulator.gapAxis}</text>

      {[0.25, 0.5, 0.75].map((tt) => (
        <line key={tt} x1="0" y1={round(h - h * 0.9 * tt, 2)} x2={w} y2={round(h - h * 0.9 * tt, 2)} stroke="#e2e8f0" strokeWidth="0.5" />
      ))}
      <text x="0" y={h + 12} className="text-[8px] fill-slate-400">50</text>
      <text x={w / 2} y={h + 12} className="text-[8px] fill-slate-400" textAnchor="middle">175</text>
      <text x={w} y={h + 12} className="text-[8px] fill-slate-400" textAnchor="end">300</text>

      <polyline points={netPath} fill="none" stroke="#3b82f6" strokeWidth="2" />
      <polyline points={pulsePath} fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />

      <line x1={cursorX} y1="0" x2={cursorX} y2={h} stroke="#0f172a" strokeWidth="1" strokeDasharray="2,2" />
      <circle cx={cursorX} cy={cursorY} r="4" fill="#3b82f6" stroke="white" strokeWidth="1.5" />

      {/* Legend */}
      <g transform="translate(40, 8)">
        <line x1="0" y1="0" x2="14" y2="0" stroke="#3b82f6" strokeWidth="2" />
        <text x="18" y="4" className="text-[9px] fill-slate-700">{t.simulator.legendNet}</text>
        <line x1="80" y1="0" x2="94" y2="0" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="98" y="4" className="text-[9px] fill-slate-700">{t.simulator.legendPulse}</text>
      </g>
    </svg>
  );
}

// ============================================================
// THEORY DIAGRAM
// ============================================================
function TheoryDiagram({ t }: { t: UIStrings }) {
  return (
    <svg viewBox="0 0 540 240" className="w-full h-auto rounded-xl border bg-slate-50">
      <defs>
        <marker id="arrowT" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L7,3 L0,6 Z" fill="#0f172a" />
        </marker>
        <radialGradient id="atomGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#dc2626" />
          <stop offset="1" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>

      <text x="270" y="20" textAnchor="middle" className="text-xs fill-slate-700 font-bold">
        {t.theory.diagramCaption}
      </text>

      {/* Atom */}
      <g transform="translate(100, 130)">
        <circle r="22" fill="url(#atomGrad)" />
        <text textAnchor="middle" y="4" className="text-[10px] fill-white font-bold">Fe</text>
        <ellipse rx="36" ry="14" fill="none" stroke="#94a3b8" strokeWidth="0.6" />
        <ellipse rx="36" ry="14" fill="none" stroke="#94a3b8" strokeWidth="0.6" transform="rotate(60)" />
        <ellipse rx="36" ry="14" fill="none" stroke="#94a3b8" strokeWidth="0.6" transform="rotate(120)" />
        <circle cx="36" cy="0" r="4" fill="#2563eb" />
        <text x="44" y="-2" className="text-[9px] fill-blue-700 font-bold">e⁻</text>
        <path d="M 36 0 q 8 -4 6 -12" fill="none" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowT)" />
        <text x="50" y="-12" className="text-[9px] fill-red-600 font-bold">
          {t === stringsByLang.en ? "spin" : "ספין"}
        </text>
      </g>

      <line x1="170" y1="130" x2="220" y2="130" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowT)" />
      <text x="195" y="125" textAnchor="middle" className="text-[9px] fill-slate-600 font-medium">{t.theory.aligned}</text>

      {/* Bar magnet */}
      <g transform="translate(280, 130)">
        <rect x="0" y="-12" width="80" height="24" rx="2" fill="url(#atomGrad)" />
        <text x="20" y="3" textAnchor="middle" className="text-[10px] fill-white font-bold">N</text>
        <text x="60" y="3" textAnchor="middle" className="text-[10px] fill-white font-bold">S</text>
        <path d="M 20 -12 C 10 -40, 70 -40, 60 -12" fill="none" stroke="#dc2626" strokeWidth="0.8" />
        <path d="M 25 -12 C 18 -32, 62 -32, 55 -12" fill="none" stroke="#dc2626" strokeWidth="0.8" />
        <path d="M 20 12 C 10 40, 70 40, 60 12" fill="none" stroke="#dc2626" strokeWidth="0.8" />
        <path d="M 25 12 C 18 32, 62 32, 55 12" fill="none" stroke="#dc2626" strokeWidth="0.8" />
      </g>

      <line x1="370" y1="130" x2="420" y2="130" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowT)" />
      <text x="395" y="125" textAnchor="middle" className="text-[9px] fill-slate-600 font-medium">{t.theory.concentrated}</text>

      {/* Force output */}
      <g transform="translate(430, 130)">
        <rect x="0" y="-20" width="100" height="40" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
        <text x="50" y="-4" textAnchor="middle" className="text-[10px] fill-green-800 font-bold">{t.theory.motive}</text>
        <text x="50" y="10" textAnchor="middle" className="text-[9px] fill-green-700">{t.theory.noElectronFlow}</text>
      </g>
    </svg>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function Home() {
  const [lang, setLang] = useLanguage();
  const t = stringsByLang[lang];
  const vt = variantStringsByLang[lang];
  // Variant toggle: "original" (Johnson patent), "flap" (circular disc variant),
  // or "push" (image-based diametric push motor).
  // Persisted to localStorage so the user's choice survives a refresh.
  const [variant, setVariant] = useState<"original" | "flap" | "push">(() => {
    if (typeof window === "undefined") return "original";
    try {
      const v = localStorage.getItem("pmm-variant");
      return v === "flap" || v === "push" || v === "original" ? (v as "original" | "flap" | "push") : "original";
    } catch {
      return "original";
    }
  });

  // Persist variant choice
  useEffect(() => {
    try {
      localStorage.setItem("pmm-variant", variant);
    } catch {
      // ignore
    }
    // Scroll to top when switching variants so the user sees the start of the new design
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [variant]);

  // Localized patent data — switches between English and Hebrew data modules
  // based on the current language. Hooks must run unconditionally before any
  // early return, so we always compute the data even when we won't use it.
  const data = dataByLang[lang];
  const {
    patentInfo,
    bomItems,
    workshopTools,
    theoryPoints,
    prototypeDimensions,
    linearBuildSteps,
    rotaryBuildSteps,
    patentClaims,
    safetyItems,
    troubleshooting,
  } = data;

  const [activeFilter, setActiveFilter] = useState<"all" | "magnet" | "metal" | "structural" | "hardware" | "tooling">("all");
  const [bomSearch, setBomSearch] = useState("");
  const [completedLinear, setCompletedLinear] = useState<Set<string>>(new Set());
  const [completedRotary, setCompletedRotary] = useState<Set<string>>(new Set());
  const [completedBom, setCompletedBom] = useState<Set<string>>(new Set());
  const [claimSearch, setClaimSearch] = useState("");

  const activeSection = useScrollSpy();

  const filteredBom = useMemo(() => {
    return bomItems.filter((b) => {
      if (activeFilter !== "all" && b.category !== activeFilter) return false;
      if (bomSearch && !`${b.part} ${b.spec} ${b.purpose} ${b.source}`.toLowerCase().includes(bomSearch.toLowerCase())) return false;
      return true;
    });
  }, [activeFilter, bomSearch, bomItems]);

  const filteredClaims = useMemo(() => {
    if (!claimSearch) return patentClaims;
    return patentClaims.filter((c) => c.text.toLowerCase().includes(claimSearch.toLowerCase()));
  }, [claimSearch, patentClaims]);

  // ⬇⬇ EARLY RETURN for the variant pages — placed AFTER all hooks so we don't
  // violate the React Hooks "rules of hooks" rule.
  if (variant === "flap") {
    return (
      <FlapVariantPage
        lang={lang}
        onPrint={() => window.print()}
        onBackToOriginal={() => setVariant("original")}
        onLanguageToggle={() => setLang(lang === "en" ? "he" : "en")}
        onGoToPush={() => setVariant("push")}
      />
    );
  }
  if (variant === "push") {
    return (
      <PushVariantPage
        lang={lang}
        onPrint={() => window.print()}
        onBackToOriginal={() => setVariant("original")}
        onLanguageToggle={() => setLang(lang === "en" ? "he" : "en")}
        onGoToFlap={() => setVariant("flap")}
      />
    );
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSet(next);
  };

  const linearProgress = (completedLinear.size / (linearBuildSteps.length * 4)) * 100;
  const rotaryProgress = (completedRotary.size / (rotaryBuildSteps.length * 4)) * 100;
  const bomProgress = (completedBom.size / bomItems.length) * 100;

  // Print handler — opens the browser's print dialog. The user can save as PDF.
  // Print CSS hides the sticky nav and footer for a clean printout.
  const handlePrint = () => {
    window.print();
  };

  // Section metadata (icon + label key in nav)
  const sectionsMeta = [
    { id: "overview", label: t.nav.overview, Icon: FileText },
    { id: "theory", label: t.nav.theory, Icon: BookOpen },
    { id: "bom", label: t.nav.bom, Icon: Boxes },
    { id: "tools", label: t.nav.tools, Icon: Wrench },
    { id: "linear", label: t.nav.linear, Icon: ArrowLeftRight },
    { id: "rotary", label: t.nav.rotary, Icon: RotateCw },
    { id: "simulator", label: t.nav.simulator, Icon: Gauge },
    { id: "safety", label: t.nav.safety, Icon: ShieldAlert },
    { id: "claims", label: t.nav.claims, Icon: ListChecks },
    { id: "troubleshoot", label: t.nav.troubleshoot, Icon: TriangleAlert },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-600 to-slate-900 flex items-center justify-center text-white">
              <Magnet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">{t.headerTitle}</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">{t.headerSubtitle}</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {sectionsMeta.map((s) => {
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <s.Icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              );
            })}
          </nav>

          {/* Right: design toggle + print button + language toggle */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => setVariant("push")}
              className="text-xs gap-1.5 bg-gradient-to-r from-purple-600 to-slate-900 hover:from-purple-700 hover:to-slate-800"
              title={vt.pushSubtitle}
            >
              <Target className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{vt.push}</span>
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => setVariant("flap")}
              className="text-xs gap-1.5 bg-gradient-to-r from-orange-600 to-slate-900 hover:from-orange-700 hover:to-slate-800"
              title={vt.flapSubtitle}
            >
              <Disc3 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{vt.flap}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="text-xs gap-1.5 print-hide"
              title={t === stringsByLang.en ? "Print or save as PDF" : "הדפסה או שמירה כ-PDF"}
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t === stringsByLang.en ? "Print / PDF" : "הדפס / PDF"}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLang(lang === "en" ? "he" : "en")}
              className="text-xs gap-1.5"
            >
              <Languages className="h-3.5 w-3.5" />
              {t.langToggle}
            </Button>
            <div className="lg:hidden">
              <select
                onChange={(e) => scrollTo(e.target.value)}
                className="text-xs border rounded px-2 py-1 bg-white"
                value={activeSection}
                aria-label="Section navigation"
              >
                {sectionsMeta.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO / OVERVIEW ===== */}
      <section id="overview" className="container mx-auto max-w-7xl px-4 pt-12 pb-8 scroll-mt-20">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Badge className="mb-3" variant="secondary">{t.overview.badge}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {t.overview.titleLead}{" "}
                <span className="bg-gradient-to-r from-red-600 to-slate-900 bg-clip-text text-transparent">
                  {t.overview.titleHighlight}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mt-3">{t.overview.intro}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> {t.overview.factsCard}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{t.overview.number}</span><span className="font-medium">{patentInfo.number}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t.overview.inventor}</span><span className="font-medium">H. R. Johnson</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t.overview.filed}</span><span className="font-medium">{patentInfo.filed}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t.overview.issued}</span><span className="font-medium">{patentInfo.issued}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t.overview.applNo}</span><span className="font-medium">{patentInfo.applNo}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t.overview.claimsLabel}</span><span className="font-medium">{patentInfo.claims}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t.overview.drawings}</span><span className="font-medium">{patentInfo.drawings}</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Cpu className="h-4 w-4" /> {t.overview.classificationCard}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.overview.intlClass}</p>
                    <div className="flex flex-wrap gap-1">
                      {patentInfo.intClass.map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.overview.usClassLabel}</p>
                    <div className="flex flex-wrap gap-1">
                      {patentInfo.usClass.map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t.overview.examiner}</span>
                      <span>{patentInfo.examiner}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t.overview.attorney}</span>
                      <span>{patentInfo.attorney}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5" /> {t.overview.whatTitle}</CardTitle>
                <CardDescription>{t.overview.whatSubtitle}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed space-y-3">
                <p>{t.overview.para1}</p>
                <p>{t.overview.para2}</p>
                <p>{t.overview.para3}</p>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Ruler className="h-4 w-4" /> {t.overview.dimensionsTitle}</CardTitle>
                <CardDescription>{t.overview.dimensionsSubtitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {prototypeDimensions.map((d) => (
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

            <Card className="bg-gradient-to-br from-slate-900 to-slate-700 text-white border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-white"><Beaker className="h-4 w-4" /> {t.overview.keyInsightTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-slate-100">
                <p>{t.overview.keyInsightP1}</p>
                <p>{t.overview.keyInsightP2}</p>
                <p className="text-slate-300 italic text-[10px]">{t.overview.keyInsightP3}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" /> {t.overview.glanceTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500" /><span>{t.overview.glance1}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500" /><span>{t.overview.glance2}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /><span>{t.overview.glance3}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500" /><span>{t.overview.glance4}</span></div>
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-purple-500" /><span>{t.overview.glance5}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== THEORY ===== */}
      <section id="theory" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader icon={<BookOpen className="h-5 w-5" />} title={t.theory.title} subtitle={t.theory.subtitle} />

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Cpu className="h-5 w-5 text-red-500" /> {t.theory.diagramTitle}</CardTitle>
              <CardDescription>{t.theory.diagramCaption}</CardDescription>
            </CardHeader>
            <CardContent>
              <TheoryDiagram t={t} />
            </CardContent>
          </Card>

          {theoryPoints.map((tp, i) => (
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

      {/* ===== BOM ===== */}
      <section id="bom" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-white/60 rounded-xl">
        <SectionHeader icon={<Boxes className="h-5 w-5" />} title={t.bom.title} subtitle={t.bom.subtitle} />

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t.bom.acquisition}</span>
            <span className="font-medium">{completedBom.size} / {bomItems.length}</span>
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
          {t.bom.showing} {filteredBom.length} {t.bom.of} {bomItems.length}.
          {t === stringsByLang.en
            ? " Items marked "
            : " פריטים המסומנים "}
          <Badge variant="destructive" className="text-[10px] mx-1">{t.bom.critical}</Badge>
          {t === stringsByLang.en
            ? "cannot be substituted without re-validating the design."
            : "אינם ניתנים להחלפה ללא אימות מחדש של התכנון."}
        </p>
      </section>

      {/* ===== TOOLS ===== */}
      <section id="tools" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader icon={<Wrench className="h-5 w-5" />} title={t.tools.title} subtitle={t.tools.subtitle} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workshopTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    tool.required ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
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

      {/* ===== LINEAR BUILD ===== */}
      <section id="linear" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-white/60 rounded-xl">
        <SectionHeader icon={<ArrowLeftRight className="h-5 w-5" />} title={t.build.linearTitle} subtitle={t.build.linearSubtitle} />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5" /> {t.build.interactiveTitle}</CardTitle>
            <CardDescription>{t.build.linearInteractDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <LinearMotorDiagram t={t} />
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t.build.checklistProgress}</span>
            <span className="font-medium">{completedLinear.size} / {linearBuildSteps.length * 4} {t.build.checks}</span>
          </div>
          <Progress value={linearProgress} />
        </div>

        <div className="space-y-4">
          {linearBuildSteps.map((step, i) => (
            <BuildStepCard
              key={step.id}
              step={step}
              index={i}
              t={t}
              completed={completedLinear}
              onToggle={(checkId) => toggle(completedLinear, setCompletedLinear, checkId)}
            />
          ))}
        </div>
      </section>

      {/* ===== ROTARY BUILD ===== */}
      <section id="rotary" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader icon={<RotateCw className="h-5 w-5" />} title={t.build.rotaryTitle} subtitle={t.build.rotarySubtitle} />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5" /> {t.build.interactiveTitle}</CardTitle>
            <CardDescription>{t.build.rotaryInteractDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <RotaryMotorDiagram t={t} />
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t.build.checklistProgress}</span>
            <span className="font-medium">{completedRotary.size} / {rotaryBuildSteps.length * 4} {t.build.checks}</span>
          </div>
          <Progress value={rotaryProgress} />
        </div>

        <div className="space-y-4">
          {rotaryBuildSteps.map((step, i) => (
            <BuildStepCard
              key={step.id}
              step={step}
              index={i}
              t={t}
              completed={completedRotary}
              onToggle={(checkId) => toggle(completedRotary, setCompletedRotary, checkId)}
            />
          ))}
        </div>
      </section>

      {/* ===== SIMULATOR ===== */}
      <section id="simulator" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-slate-900 text-white rounded-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Gauge className="h-6 w-6 text-red-400" /> {t.simulator.title}</h2>
          <p className="text-slate-300 mt-1">{t.simulator.subtitle}</p>
        </div>
        <div className="bg-white text-slate-900 rounded-xl p-6">
          <AirGapSimulator t={t} />
        </div>
        <p className="text-xs text-slate-400 mt-3">
          {t === stringsByLang.en
            ? "Model: F = k · Br² · exp(−gap / 5mm). Pulsation approximated as a Gaussian peak around the optimal gap. Values are illustrative — your actual build will differ based on magnet quality, geometry tolerances, and surface finish."
            : "מודל: F = k · Br² · exp(−gap / 5mm). פעימה מקורבת כפסגת גאוסיאנית סביב הרווח האופטימלי. הערכים להמחשה — הבנייה בפועל תשתנה בהתאם לאיכות המגנט, טולרנסי הגיאומטריה, וגימור השטח."}
        </p>
      </section>

      {/* ===== SAFETY ===== */}
      <section id="safety" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader icon={<ShieldAlert className="h-5 w-5" />} title={t.safety.title} subtitle={t.safety.subtitle} />
        <div className="grid md:grid-cols-2 gap-4">
          {safetyItems.map((s) => {
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

      {/* ===== CLAIMS ===== */}
      <section id="claims" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-white/60 rounded-xl">
        <SectionHeader icon={<ListChecks className="h-5 w-5" />} title={t.claims.title} subtitle={t.claims.subtitle} />
        <div className="mb-4 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.claims.searchPlaceholder}
              value={claimSearch}
              onChange={(e) => setClaimSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="space-y-2">
          {filteredClaims.map((c) => (
            <Card key={c.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {c.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`text-[10px] ${
                        c.type === "apparatus" ? "border-blue-300 text-blue-700" :
                        c.type === "method" ? "border-emerald-300 text-emerald-700" :
                        "border-slate-300 text-slate-700"
                      }`}>{t.claims.type[c.type]}</Badge>
                      {c.id === 1 || c.id === 14 || c.id === 22 ? (
                        <Badge variant="default" className="text-[10px]">{t.claims.independent}</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">{t.claims.dependent}</Badge>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{c.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredClaims.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">{t.claims.noResults}</p>
        )}
      </section>

      {/* ===== TROUBLESHOOT ===== */}
      <section id="troubleshoot" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader icon={<TriangleAlert className="h-5 w-5" />} title={t.troubleshoot.title} subtitle={t.troubleshoot.subtitle} />
        <div className="grid md:grid-cols-2 gap-4">
          {troubleshooting.map((tr, i) => (
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
                <Magnet className="h-4 w-4" /> {t.footer.patentInfo}
              </h3>
              <p className="text-xs text-slate-400">{t.footer.buildInfo}</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Factory className="h-4 w-4" /> {t.overview.glanceTitle}</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>{t.overview.glance1}</li>
                <li>{t.overview.glance2}</li>
                <li>{t.overview.glance3}</li>
                <li>{t.overview.glance4}</li>
                <li>{t.overview.glance5}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Info className="h-4 w-4" /> {t.footer.disclaimerTitle}</h3>
              <p className="text-xs text-slate-400">{t.footer.disclaimerBody}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between flex-wrap gap-2">
            <span>{t.footer.metaLine}</span>
            <span>{patentInfo.number} · {patentInfo.issued} · {patentInfo.claims} {t === stringsByLang.en ? "claims" : "תביעות"} · {patentInfo.drawings} {t === stringsByLang.en ? "drawings" : "שרטוטים"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
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
