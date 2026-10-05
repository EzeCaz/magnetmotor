"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
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
  type BomItem,
} from "@/lib/patent/data";
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
} from "lucide-react";

// ============================================================
// SECTION NAVIGATION
// ============================================================
const sections = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "theory", label: "Theory", icon: BookOpen },
  { id: "bom", label: "Materials (BOM)", icon: Boxes },
  { id: "tools", label: "Tools & Workshop", icon: Wrench },
  { id: "linear", label: "Linear Build", icon: ArrowLeftRight },
  { id: "rotary", label: "Rotary Build", icon: RotateCw },
  { id: "simulator", label: "Force Simulator", icon: Gauge },
  { id: "safety", label: "Safety", icon: ShieldAlert },
  { id: "claims", label: "Patent Claims", icon: ListChecks },
  { id: "troubleshoot", label: "Troubleshooting", icon: TriangleAlert },
];

// ============================================================
// HELPERS
// ============================================================
function useScrollSpy() {
  const [active, setActive] = useState("overview");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

// ============================================================
// LINEAR MOTOR INTERACTIVE SVG
// ============================================================
function LinearMotorDiagram() {
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

  const armatureX = TRACK_LEFT + (position / 100) * (TRACK_RIGHT - TRACK_LEFT - ARMATURE_LEN);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Interactive linear motor — slide the armature along the stator track
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Each stator magnet (red = N up, blue = S down) is 1 in wide; gap is 0.25 in. Armature is 3 in long (≈ 2 stators + 1 gap).
          </p>
        </div>
        <Button
          size="sm"
          variant={autoPlay ? "secondary" : "default"}
          onClick={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? "Pause" : "Auto-run"}
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
          High-μ backing plate (Netic Co-Netic)
        </text>

        {/* Stator magnets */}
        {Array.from({ length: STATOR_COUNT }).map((_, i) => {
          const x = TRACK_LEFT + i * (STATOR_W + STATOR_GAP);
          // Variable gap: alternate slightly to show "varied spacing"
          const offsetX = i % 2 === 0 ? 0 : 3;
          return (
            <g key={i}>
              {/* N face (top, red) */}
              <rect x={x + offsetX} y={100} width={STATOR_W} height={20} fill="url(#statorGradN)" stroke="#7f1d1d" strokeWidth="0.5" />
              <text x={x + offsetX + STATOR_W / 2} y={114} textAnchor="middle" className="text-[10px] fill-white font-bold">N</text>
              {/* S face (bottom, blue) — bonded to backing */}
              <rect x={x + offsetX} y={120} width={STATOR_W} height={20} fill="url(#statorGradS)" stroke="#1e3a8a" strokeWidth="0.5" />
              <text x={x + offsetX + STATOR_W / 2} y={134} textAnchor="middle" className="text-[10px] fill-white font-bold">S</text>
            </g>
          );
        })}

        {/* Air gap indicator */}
        <line x1={TRACK_LEFT} y1={92} x2={TRACK_RIGHT} y2={92} stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="0.5" />
        <text x={TRACK_RIGHT + 4} y={96} className="text-[9px] fill-slate-500">air gap ≈ 0.125 in</text>

        {/* Armature magnet (bowed, with beveled ends) */}
        <g transform={`translate(${armatureX}, 0)`}>
          {/* Concave-down bowed body */}
          <path
            d={`M 0,80 Q ${ARMATURE_LEN / 2},72 ${ARMATURE_LEN},80 L ${ARMATURE_LEN - 6},95 Q ${ARMATURE_LEN / 2},88 6,95 Z`}
            fill="url(#armatureGrad)"
            stroke="#7f1d1d"
            strokeWidth="0.8"
          />
          {/* Beveled pole end caps */}
          <polygon points={`0,80 -5,82 -5,93 0,95`} fill="#7f1d1d" />
          <polygon points={`${ARMATURE_LEN},80 ${ARMATURE_LEN + 5},82 ${ARMATURE_LEN + 5},93 ${ARMATURE_LEN},95`} fill="#7f1d1d" />
          {/* N pole label (left end) */}
          <text x={6} y={90} className="text-[10px] fill-white font-bold">N</text>
          {/* S pole label (right end) */}
          <text x={ARMATURE_LEN - 12} y={90} className="text-[10px] fill-white font-bold">S</text>

          {/* Force vector */}
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

        {/* Direction-of-motion indicator */}
        <text x={TRACK_LEFT} y={195} className="text-[10px] fill-slate-600 font-medium">← direction of motion (N left, S right) →</text>

        {/* Track reference line */}
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
          <span>Track start</span>
          <span>Position: {position.toFixed(0)}%</span>
          <span>Track end</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
          <p className="font-semibold text-emerald-900 flex items-center gap-2">
            <Zap className="h-4 w-4" /> Always-On Thrust
          </p>
          <p className="text-xs text-emerald-800 mt-1">
            At every position, the N pole of the armature is repelled by the next stator N pole while the S pole is attracted by the previous stator S pole. Net force vector always points left.
          </p>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="font-semibold text-amber-900 flex items-center gap-2">
            <Layers className="h-4 w-4" /> 2-Stator Length Ratio
          </p>
          <p className="text-xs text-amber-800 mt-1">
            Armature length ≈ 2 stator widths + 1 gap. This guarantees that one end is always in repulsion while the other is always in attraction.
          </p>
        </div>
        <div className="rounded-lg bg-sky-50 border border-sky-200 p-3">
          <p className="font-semibold text-sky-900 flex items-center gap-2">
            <Settings className="h-4 w-4" /> Variable Stator Spacing
          </p>
          <p className="text-xs text-sky-800 mt-1">
            Stator gaps alternate slightly to smooth the force pulse. Reversing the armature (N↔S) reverses the direction of motion.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ROTARY MOTOR INTERACTIVE SVG
// ============================================================
function RotaryMotorDiagram() {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Interactive rotary motor — 3 staggered armature magnets rotate around 12 stator magnets
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Adjust axial engagement to see the effect on rotation speed (speed regulator from the patent).
          </p>
        </div>
        <Button size="sm" variant={autoPlay ? "secondary" : "default"} onClick={() => setAutoPlay(!autoPlay)}>
          {autoPlay ? "Pause" : "Spin"}
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

        {/* Stator outer ring (high-μ sleeve) */}
        <circle cx={cx} cy={cy} r={statorR - 10} fill="url(#statorRingGrad)" stroke="#475569" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={statorR} fill="none" stroke="#64748b" strokeWidth="3" />
        <text x={cx} y={cy - statorR - 8} textAnchor="middle" className="text-[10px] fill-slate-600 font-medium">
          High-μ sleeve (Netic Co-Netic annular ring)
        </text>

        {/* 12 stator magnets as wedges around the ring */}
        {Array.from({ length: statorCount }).map((_, i) => {
          const a = (i / statorCount) * 2 * Math.PI - Math.PI / 2;
          const wAngle = (2 * Math.PI) / statorCount * 0.85;
          // Slight variation in spacing
          const offset = i % 2 === 0 ? 0 : 0.04;
          const aStart = a - wAngle / 2 + offset;
          const aEnd = a + wAngle / 2 + offset;
          const rIn = statorR - 22;
          const rOut = statorR - 3;
          const x1 = cx + rOut * Math.cos(aStart);
          const y1 = cy + rOut * Math.sin(aStart);
          const x2 = cx + rOut * Math.cos(aEnd);
          const y2 = cy + rOut * Math.sin(aEnd);
          const x3 = cx + rIn * Math.cos(aEnd);
          const y3 = cy + rIn * Math.sin(aEnd);
          const x4 = cx + rIn * Math.cos(aStart);
          const y4 = cy + rIn * Math.sin(aStart);
          return (
            <g key={i}>
              <path
                d={`M ${x1} ${y1} A ${rOut} ${rOut} 0 0 0 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 0 1 ${x4} ${y4} Z`}
                fill="url(#wedgeGradN)"
                stroke="#7f1d1d"
                strokeWidth="0.6"
              />
              <text
                x={cx + (rOut - 12) * Math.cos(a)}
                y={cy + (rOut - 12) * Math.sin(a) + 3}
                textAnchor="middle"
                className="text-[9px] fill-white font-bold"
              >
                N
              </text>
            </g>
          );
        })}

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={45} fill="url(#hubGrad)" stroke="#334155" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={8} fill="#1e293b" />
        {/* Threaded shaft visualization */}
        <line x1={cx} y1={cy - 8} x2={cx} y2={cy - 60} stroke="#94a3b8" strokeWidth="2" strokeDasharray="2,2" />
        <text x={cx + 8} y={cy - 60} className="text-[9px] fill-slate-600">threaded shaft</text>

        {/* 3 armature magnets at stagger angles, rotating */}
        <g transform={`rotate(${angle} ${cx} ${cy})`}>
          {armatureAngles.map((baseAngle, i) => {
            const a = (baseAngle * Math.PI) / 180 - Math.PI / 2;
            const rA = armatureR - 10;
            const x = cx + rA * Math.cos(a);
            const y = cy + rA * Math.sin(a);
            const engagement = axialEngagement / 100;
            // Scale armature magnet width by engagement
            const wedgeHalfAngle = (2 * Math.PI / statorCount) * 0.45 * engagement;
            const aStart = a - wedgeHalfAngle;
            const aEnd = a + wedgeHalfAngle;
            const rIn = armatureR - 18;
            const rOut = armatureR - 2;
            const x1 = cx + rOut * Math.cos(aStart);
            const y1 = cy + rOut * Math.sin(aStart);
            const x2 = cx + rOut * Math.cos(aEnd);
            const y2 = cy + rOut * Math.sin(aEnd);
            const x3 = cx + rIn * Math.cos(aEnd);
            const y3 = cy + rIn * Math.sin(aEnd);
            const x4 = cx + rIn * Math.cos(aStart);
            const y4 = cy + rIn * Math.sin(aStart);
            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${y1} A ${rOut} ${rOut} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 0 0 ${x4} ${y4} Z`}
                  fill="url(#wedgeGradS)"
                  stroke="#1e3a8a"
                  strokeWidth="0.8"
                />
                <text
                  x={cx + (rIn + 5) * Math.cos(a)}
                  y={cy + (rIn + 5) * Math.sin(a) + 3}
                  textAnchor="middle"
                  transform={`rotate(${baseAngle + 90} ${cx + (rIn + 5) * Math.cos(a)} ${cy + (rIn + 5) * Math.sin(a) + 3})`}
                  className="text-[9px] fill-white font-bold"
                >
                  S
                </text>
              </g>
            );
          })}

          {/* Rotation arrow */}
          <path
            d={`M ${cx + 55} ${cy} A 55 55 0 0 1 ${cx + 38} ${cy + 40}`}
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            markerEnd="url(#arrowRot)"
          />
        </g>

        {/* Direction label */}
        <text x={cx} y={cy + armatureR + 25} textAnchor="middle" className="text-[10px] fill-slate-600 font-medium">
          ↻ rotation (staggered armature magnets 0°, 122°, 244°)
        </text>

        {/* Engagement indicator visualization */}
        <text x="20" y="20" className="text-[10px] fill-slate-600 font-medium">Axial engagement: {axialEngagement}%</text>
        <rect x="20" y="25" width="120" height="6" rx="2" fill="#e2e8f0" />
        <rect x="20" y="25" width={(axialEngagement / 100) * 120} height="6" rx="2" fill="#dc2626" />
      </svg>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-medium">
          Axial engagement (speed regulator)
        </label>
        <Slider
          value={[axialEngagement]}
          onValueChange={(v) => setAxialEngagement(v[0])}
          min={20}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low (slow)</span>
          <span>{axialEngagement}%</span>
          <span>Full (fast)</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORCE vs AIR-GAP SIMULATOR
// ============================================================
function AirGapSimulator() {
  const [gap, setGap] = useState(125); // mils (0.001 in)
  const [magnetGrade, setMagnetGrade] = useState(50); // N50
  // Simplified force model: F = k * Br^2 * exp(-gap/gap0)
  // Br for NdFeB N50 ≈ 1.4 T; N42 ≈ 1.28 T
  const Br = 1.28 + ((magnetGrade - 42) / 8) * 0.05;
  const k = 0.05;
  const gapMm = gap * 0.0254; // mils → mm
  const forceNet = k * Br * Br * Math.exp(-(gapMm / 5)) * 100;
  const forcePulse = 0.4 * forceNet * Math.exp(-Math.abs(gapMm - 3) / 6);
  const smoothness = Math.max(0, 100 - (forcePulse / forceNet) * 100);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Air gap: {(gap / 1000).toFixed(3)} in ({(gapMm).toFixed(2)} mm)</label>
          <Slider value={[gap]} onValueChange={(v) => setGap(v[0])} min={50} max={300} step={5} className="mt-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.050 in (close, pulsing)</span>
            <span>0.300 in (loose, weak)</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Magnet grade: N{magnetGrade}</label>
          <Slider value={[magnetGrade]} onValueChange={(v) => setMagnetGrade(v[0])} min={35} max={55} step={1} className="mt-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>N35 (weaker)</span>
            <span>N55 (strongest)</span>
          </div>
        </div>

        <Card className="bg-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Gauge className="h-4 w-4 text-red-500" /> Estimated Force Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Net thrust (lbf)</span>
              <span className="font-bold text-emerald-600">{forceNet.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peak pulsation (lbf)</span>
              <span className="font-bold text-amber-600">{forcePulse.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Smoothness index</span>
              <span className="font-bold" style={{ color: smoothness > 75 ? "#16a34a" : smoothness > 50 ? "#d97706" : "#dc2626" }}>
                {smoothness.toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Magnet remanence Br</span>
              <span className="font-bold">{Br.toFixed(2)} T</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Microscope className="h-4 w-4 text-blue-500" /> Trade-off Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ForceChart gap={gap} magnetGrade={magnetGrade} />
            <p className="text-xs text-muted-foreground mt-3">
              Blue = net thrust vs air gap; red = pulsation amplitude. The patent recommends an air gap around 0.125 in (3.18 mm) — close to the "knee" where thrust is still high but pulsation begins to drop off.
            </p>
          </CardContent>
        </Card>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Optimization Tip</AlertTitle>
          <AlertDescription>
            For your current settings: {smoothness > 75 ? "Excellent smoothness — keep current gap." : smoothness > 50 ? "Acceptable; consider widening gap slightly to reduce pulsation." : "Pulsation is high — widen the gap by 0.020 in or add a second staggered armature magnet."}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

function ForceChart({ gap, magnetGrade }: { gap: number; magnetGrade: number }) {
  const w = 320;
  const h = 160;
  const points: { x: number; netF: number; pulse: number }[] = [];
  for (let g = 50; g <= 300; g += 5) {
    const Br = 1.28 + ((magnetGrade - 42) / 8) * 0.05;
    const k = 0.05;
    const gapMm = g * 0.0254;
    const netF = k * Br * Br * Math.exp(-gapMm / 5) * 100;
    const pulse = 0.4 * netF * Math.exp(-Math.abs(gapMm - 3) / 6);
    points.push({ x: ((g - 50) / 250) * w, netF, pulse });
  }
  const maxF = Math.max(...points.map((p) => p.netF));
  const netPath = points.map((p) => `${p.x},${h - (p.netF / maxF) * h * 0.9}`).join(" ");
  const pulsePath = points.map((p) => `${p.x},${h - (p.pulse / maxF) * h * 0.9}`).join(" ");
  const cursorX = ((gap - 50) / 250) * w;

  return (
    <svg viewBox={`0 0 ${w + 30} ${h + 30}`} className="w-full h-auto">
      <text x={5} y={12} className="text-[9px] fill-slate-500">Force (lbf)</text>
      <text x={w} y={h + 18} className="text-[9px] fill-slate-500" textAnchor="end">Air gap (mils)</text>

      {/* Y axis grid */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="0" y1={h - h * 0.9 * t} x2={w} y2={h - h * 0.9 * t} stroke="#e2e8f0" strokeWidth="0.5" />
      ))}
      {/* X axis labels */}
      <text x="0" y={h + 12} className="text-[8px] fill-slate-400">50</text>
      <text x={w / 2} y={h + 12} className="text-[8px] fill-slate-400" textAnchor="middle">175</text>
      <text x={w} y={h + 12} className="text-[8px] fill-slate-400" textAnchor="end">300</text>

      <polyline points={netPath} fill="none" stroke="#3b82f6" strokeWidth="2" />
      <polyline points={pulsePath} fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />

      {/* Cursor */}
      <line x1={cursorX} y1="0" x2={cursorX} y2={h} stroke="#0f172a" strokeWidth="1" strokeDasharray="2,2" />
      <circle cx={cursorX} cy={h - (points.find((p) => Math.abs(p.x - cursorX) < 1)?.netF || 0) / maxF * h * 0.9} r="4" fill="#3b82f6" stroke="white" strokeWidth="1.5" />

      {/* Legend */}
      <g transform="translate(40, 8)">
        <line x1="0" y1="0" x2="14" y2="0" stroke="#3b82f6" strokeWidth="2" />
        <text x="18" y="4" className="text-[9px] fill-slate-700">Net thrust</text>
        <line x1="80" y1="0" x2="94" y2="0" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="98" y="4" className="text-[9px] fill-slate-700">Pulsation</text>
      </g>
    </svg>
  );
}

// ============================================================
// THEORY DIAGRAM (electron spin / superconductor analogy)
// ============================================================
function TheoryDiagram() {
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

      {/* Title */}
      <text x="270" y="20" textAnchor="middle" className="text-xs fill-slate-700 font-bold">
        Unpaired Electron Spins in a Ferromagnet → Source of the Permanent Magnetic Field
      </text>

      {/* Atom 1 */}
      <g transform="translate(100, 130)">
        <circle r="22" fill="url(#atomGrad)" />
        <text textAnchor="middle" y="4" className="text-[10px] fill-white font-bold">Fe</text>
        {/* Spinning electrons (orbits) */}
        <ellipse rx="36" ry="14" fill="none" stroke="#94a3b8" strokeWidth="0.6" transform="rotate(0)" />
        <ellipse rx="36" ry="14" fill="none" stroke="#94a3b8" strokeWidth="0.6" transform="rotate(60)" />
        <ellipse rx="36" ry="14" fill="none" stroke="#94a3b8" strokeWidth="0.6" transform="rotate(120)" />
        {/* Electron with spin arrow */}
        <circle cx="36" cy="0" r="4" fill="#2563eb" />
        <text x="44" y="-2" className="text-[9px] fill-blue-700 font-bold">e⁻</text>
        <path d="M 36 0 q 8 -4 6 -12" fill="none" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowT)" />
        <text x="50" y="-12" className="text-[9px] fill-red-600 font-bold">spin</text>
      </g>

      {/* Arrow → magnetic field */}
      <line x1="170" y1="130" x2="220" y2="130" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowT)" />
      <text x="195" y="125" textAnchor="middle" className="text-[9px] fill-slate-600 font-medium">aligned spins</text>

      {/* Magnetic field representation */}
      <g transform="translate(280, 130)">
        {/* Bar magnet */}
        <rect x="0" y="-12" width="80" height="24" rx="2" fill="url(#atomGrad)" />
        <text x="20" y="3" textAnchor="middle" className="text-[10px] fill-white font-bold">N</text>
        <text x="60" y="3" textAnchor="middle" className="text-[10px] fill-white font-bold">S</text>
        {/* Field lines */}
        <path d="M 20 -12 C 10 -40, 70 -40, 60 -12" fill="none" stroke="#dc2626" strokeWidth="0.8" />
        <path d="M 25 -12 C 18 -32, 62 -32, 55 -12" fill="none" stroke="#dc2626" strokeWidth="0.8" />
        <path d="M 20 12 C 10 40, 70 40, 60 12" fill="none" stroke="#dc2626" strokeWidth="0.8" />
        <path d="M 25 12 C 18 32, 62 32, 55 12" fill="none" stroke="#dc2626" strokeWidth="0.8" />
      </g>

      {/* Arrow → usable force */}
      <line x1="370" y1="130" x2="420" y2="130" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowT)" />
      <text x="395" y="125" textAnchor="middle" className="text-[9px] fill-slate-600 font-medium">concentrated field</text>

      {/* Force output */}
      <g transform="translate(430, 130)">
        <rect x="0" y="-20" width="100" height="40" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
        <text x="50" y="-4" textAnchor="middle" className="text-[10px] fill-green-800 font-bold">Motive Force</text>
        <text x="50" y="10" textAnchor="middle" className="text-[9px] fill-green-700">No electron flow</text>
      </g>

      {/* Caption */}
      <text x="270" y="225" textAnchor="middle" className="text-[10px] fill-slate-600 font-medium">
        In a ferromagnet, unpaired electron spins align and create a continuous B-field. Johnson's motor geometry
        converts this static field into a unidirectional thrust.
      </text>
    </svg>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"all" | BomItem["category"]>("all");
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
  }, [activeFilter, bomSearch]);

  const filteredClaims = useMemo(() => {
    if (!claimSearch) return patentClaims;
    return patentClaims.filter((c) => c.text.toLowerCase().includes(claimSearch.toLowerCase()));
  }, [claimSearch]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSet(next);
  };

  const linearProgress = (completedLinear.size / (linearBuildSteps.length * 4)) * 100; // *4 checks per step
  const rotaryProgress = (completedRotary.size / (rotaryBuildSteps.length * 4)) * 100;
  const bomProgress = (completedBom.size / bomItems.length) * 100;

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
              <h1 className="text-sm font-bold leading-tight">Permanent Magnet Motor</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">US 4,151,431 — Engineer's Build Guide</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              );
            })}
          </nav>
          <div className="lg:hidden">
            <select
              onChange={(e) => scrollTo(e.target.value)}
              className="text-xs border rounded px-2 py-1"
              value={activeSection}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* ===== HERO / OVERVIEW ===== */}
      <section id="overview" className="container mx-auto max-w-7xl px-4 pt-12 pb-8 scroll-mt-20">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Badge className="mb-3" variant="secondary">Patent {patentInfo.number}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Build a{" "}
                <span className="bg-gradient-to-r from-red-600 to-slate-900 bg-clip-text text-transparent">
                  Permanent Magnet Motor
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mt-3">
                A complete, interactive engineering plan derived directly from Howard R. Johnson's 1979 patent — covering theory, materials, fabrication, assembly, tuning, and operation. Every step, every part, every dimension you need.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Patent Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Number</span><span className="font-medium">{patentInfo.number}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Inventor</span><span className="font-medium">H. R. Johnson</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Filed</span><span className="font-medium">{patentInfo.filed}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Issued</span><span className="font-medium">{patentInfo.issued}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Appl. No.</span><span className="font-medium">{patentInfo.applNo}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Claims</span><span className="font-medium">{patentInfo.claims}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Drawings</span><span className="font-medium">{patentInfo.drawings}</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Cpu className="h-4 w-4" /> Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">International (Int. Cl.)</p>
                    <div className="flex flex-wrap gap-1">
                      {patentInfo.intClass.map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">U.S. Classification</p>
                    <div className="flex flex-wrap gap-1">
                      {patentInfo.usClass.map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Examiner</span>
                      <span>{patentInfo.examiner}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Attorney</span>
                      <span>{patentInfo.attorney}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5" /> What This Motor Does</CardTitle>
                <CardDescription>
                  The core inventive concept in one paragraph
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed space-y-3">
                <p>
                  The Johnson permanent magnet motor produces relative motion between an armature and a stator using <strong>only static magnetic fields</strong> — no electrical current, no commutator, no brushes. The unpaired electron spins within permanent magnets are treated as a continuous source of motive power, analogous to a room-temperature superconductor.
                </p>
                <p>
                  The breakthrough is geometric. The armature magnet's length is set to be slightly greater than the combined width of <strong>two stator magnets plus one inter-magnet gap</strong>. At every position along the track, the leading pole of the armature is repelled by an adjacent like pole while the trailing pole is attracted by an opposite pole. The resultant force vector always points in the same direction — producing continuous motion along the track.
                </p>
                <p>
                  Both a <strong>linear</strong> embodiment and a <strong>rotary</strong> embodiment are described. The rotary version includes a threaded shaft that allows the builder to axially displace the armature and thereby regulate the rotational speed — a fully mechanical throttle with zero electrical components.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right column: prototype dimensions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Ruler className="h-4 w-4" /> Prototype Dimensions</CardTitle>
                <CardDescription>From the patent's working example</CardDescription>
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
                <CardTitle className="text-base flex items-center gap-2 text-white"><Beaker className="h-4 w-4" /> Key Insight</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-slate-100">
                <p>
                  The armature length must be slightly <strong>longer</strong> than 2 stator widths + 1 gap. This is the entire trick.
                </p>
                <p>
                  Reversing the armature magnet (N↔S) reverses the direction of motion. No electrical switching required.
                </p>
                <p className="text-slate-300 italic text-[10px]">
                  Mechanical advantage claimed: greater than 100:1.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" /> At a Glance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>2 embodiments (linear + rotary)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>~14 build steps total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>19 BOM items</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>10 workshop tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>25 patent claims</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== THEORY ===== */}
      <section id="theory" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<BookOpen className="h-5 w-5" />}
          title="Theory of Operation"
          subtitle="How static magnetic fields produce continuous thrust — the physics behind the patent"
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Cpu className="h-5 w-5 text-red-500" /> Spin → Field → Force</CardTitle>
              <CardDescription>The conceptual pipeline behind the invention</CardDescription>
            </CardHeader>
            <CardContent>
              <TheoryDiagram />
            </CardContent>
          </Card>

          {theoryPoints.map((t, i) => (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <CardTitle className="text-base">{t.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3 text-muted-foreground">
                {t.body.map((para, j) => (
                  <p key={j} className="leading-relaxed">{para}</p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== BOM ===== */}
      <section id="bom" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-white/60 rounded-xl">
        <SectionHeader
          icon={<Boxes className="h-5 w-5" />}
          title="Bill of Materials"
          subtitle="Every part you need — magnets, structural, hardware, and tooling"
        />

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Acquisition progress</span>
            <span className="font-medium">{completedBom.size} / {bomItems.length}</span>
          </div>
          <Progress value={bomProgress} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {(["all", "magnet", "metal", "structural", "hardware", "tooling"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={activeFilter === f ? "default" : "outline"}
              onClick={() => setActiveFilter(f)}
              className="text-xs"
            >
              {f === "all" ? "All Categories" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
          <div className="flex-1 min-w-[200px] max-w-xs ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parts, specs, sources..."
                value={bomSearch}
                onChange={(e) => setBomSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </div>

        {/* BOM table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">✓</th>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Part</th>
                <th className="p-3 text-left">Specification</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Purpose</th>
                <th className="p-3 text-left">Source</th>
                <th className="p-3 text-left">Type</th>
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
                      {b.category}
                    </Badge>
                    {b.critical && (
                      <Badge variant="destructive" className="text-[10px] ml-1">critical</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Showing {filteredBom.length} of {bomItems.length} items. Items marked <Badge variant="destructive" className="text-[10px]">critical</Badge> cannot be substituted without re-validating the design.
        </p>
      </section>

      {/* ===== TOOLS ===== */}
      <section id="tools" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<Wrench className="h-5 w-5" />}
          title="Tools & Workshop Setup"
          subtitle="What your workshop needs before you start cutting metal"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workshopTools.map((t) => (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    t.required ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    <Hammer className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.purpose}</p>
                    {t.required ? (
                      <Badge variant="destructive" className="text-[10px] mt-2">Required</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] mt-2">Optional / Nice-to-have</Badge>
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
        <SectionHeader
          icon={<ArrowLeftRight className="h-5 w-5" />}
          title="Linear Embodiment — Build Guide"
          subtitle="7 phases from raw magnet stock to a moving prototype"
        />

        {/* Interactive diagram */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5" /> Interactive Geometry</CardTitle>
            <CardDescription>Drag the slider (or press Auto-run) to see how the armature traverses the stator track</CardDescription>
          </CardHeader>
          <CardContent>
            <LinearMotorDiagram />
          </CardContent>
        </Card>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Build checklist progress</span>
            <span className="font-medium">{completedLinear.size} / {linearBuildSteps.length * 4} checks</span>
          </div>
          <Progress value={linearProgress} />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {linearBuildSteps.map((step, i) => (
            <BuildStepCard
              key={step.id}
              step={step}
              index={i}
              completed={completedLinear}
              onToggle={(checkId) => toggle(completedLinear, setCompletedLinear, checkId)}
            />
          ))}
        </div>
      </section>

      {/* ===== ROTARY BUILD ===== */}
      <section id="rotary" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<RotateCw className="h-5 w-5" />}
          title="Rotary Embodiment — Build Guide"
          subtitle="7 phases for the circular motor with speed regulator"
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5" /> Interactive Geometry</CardTitle>
            <CardDescription>Watch the 3 staggered armature magnets rotate around 12 stator magnets — adjust axial engagement to change speed</CardDescription>
          </CardHeader>
          <CardContent>
            <RotaryMotorDiagram />
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Build checklist progress</span>
            <span className="font-medium">{completedRotary.size} / {rotaryBuildSteps.length * 4} checks</span>
          </div>
          <Progress value={rotaryProgress} />
        </div>

        <div className="space-y-4">
          {rotaryBuildSteps.map((step, i) => (
            <BuildStepCard
              key={step.id}
              step={step}
              index={i}
              completed={completedRotary}
              onToggle={(checkId) => toggle(completedRotary, setCompletedRotary, checkId)}
            />
          ))}
        </div>
      </section>

      {/* ===== SIMULATOR ===== */}
      <section id="simulator" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20 bg-slate-900 text-white rounded-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Gauge className="h-6 w-6 text-red-400" /> Force vs Air-Gap Simulator</h2>
          <p className="text-slate-300 mt-1">A first-order engineering model to help you choose the right air gap and magnet grade for your build</p>
        </div>
        <div className="bg-white text-slate-900 rounded-xl p-6">
          <AirGapSimulator />
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Model: F = k · Br² · exp(−gap / 5mm). Pulsation approximated as a Gaussian peak around the optimal gap. Values are illustrative — your actual build will differ based on magnet quality, geometry tolerances, and surface finish.
        </p>
      </section>

      {/* ===== SAFETY ===== */}
      <section id="safety" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<ShieldAlert className="h-5 w-5" />}
          title="Safety, Warnings & Engineering Notes"
          subtitle="Critical information before you handle high-field magnets"
        />
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
                  <Badge variant="outline" className={`text-[10px] capitalize ${
                    s.severity === "critical" ? "border-red-400 text-red-700" :
                    s.severity === "caution" ? "border-amber-400 text-amber-700" :
                    "border-slate-400 text-slate-700"
                  }`}>
                    {s.severity}
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
        <SectionHeader
          icon={<ListChecks className="h-5 w-5" />}
          title="Patent Claims — Reference"
          subtitle="The 25 legal claims that define the invention's scope"
        />
        <div className="mb-4 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search claims by keyword..."
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
                      <Badge variant="outline" className={`text-[10px] capitalize ${
                        c.type === "apparatus" ? "border-blue-300 text-blue-700" :
                        c.type === "method" ? "border-emerald-300 text-emerald-700" :
                        "border-slate-300 text-slate-700"
                      }`}>{c.type}</Badge>
                      {c.id === 1 || c.id === 14 || c.id === 22 ? (
                        <Badge variant="default" className="text-[10px]">independent</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">dependent</Badge>
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
          <p className="text-center text-muted-foreground py-8 text-sm">No claims match your search.</p>
        )}
      </section>

      {/* ===== TROUBLESHOOT ===== */}
      <section id="troubleshoot" className="container mx-auto max-w-7xl px-4 py-12 scroll-mt-20">
        <SectionHeader
          icon={<TriangleAlert className="h-5 w-5" />}
          title="Troubleshooting Guide"
          subtitle="Common failure modes and how to fix them"
        />
        <div className="grid md:grid-cols-2 gap-4">
          {troubleshooting.map((t, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-start gap-2">
                  <TriangleAlert className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  {t.symptom}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase">Likely cause</p>
                  <p className="text-sm">{t.cause}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-emerald-700 font-medium uppercase">Fix</p>
                  <p className="text-sm">{t.fix}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto border-t bg-slate-900 text-slate-300">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Magnet className="h-4 w-4" /> US 4,151,431
              </h3>
              <p className="text-xs text-slate-400">
                Permanent Magnet Motor — Howard R. Johnson, issued April 24, 1979. Source document: patent specification, claims, and 10 drawing figures.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Factory className="h-4 w-4" /> Build Information</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>2 embodiments: linear &amp; rotary</li>
                <li>19 BOM items, 10 workshop tools</li>
                <li>~14 assembly steps (7 per embodiment)</li>
                <li>Engineering model included for tuning</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Info className="h-4 w-4" /> Disclaimer</h3>
              <p className="text-xs text-slate-400">
                This build guide is a faithful engineering reinterpretation of the patent disclosure. The patent's claim of continuous motive power from permanent magnets alone is not consistent with the second law of thermodynamics and should be treated as an engineering case study in magnetic field manipulation rather than a working free-energy machine.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between flex-wrap gap-2">
            <span>Built for engineers, from the patent record.</span>
            <span>{patentInfo.number} · {patentInfo.issued} · {patentInfo.claims} claims · {patentInfo.drawings} drawings</span>
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
  completed,
  onToggle,
}: {
  step: { id: string; phase: string; title: string; duration: string; description: string; checks: string[]; warning?: string };
  index: number;
  completed: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const stepChecksCompleted = step.checks.filter((_, i) => completed.has(`${step.id}-${i}`)).length;
  const stepComplete = stepChecksCompleted === step.checks.length;

  return (
    <Card className={`overflow-hidden transition-all ${stepComplete ? "border-emerald-400 bg-emerald-50/40" : ""}`}>
      <CardHeader
        className="cursor-pointer pb-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            stepComplete ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
          }`}>
            {stepComplete ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px]">{step.phase}</Badge>
              <CardTitle className="text-base">{step.title}</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Est. duration: {step.duration}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {stepChecksCompleted}/{step.checks.length} checks
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
              <AlertTitle className="text-amber-900 text-sm">Warning</AlertTitle>
              <AlertDescription className="text-amber-800 text-xs">{step.warning}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase text-muted-foreground">Verification Checklist</p>
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
                  <span className={`text-sm ${isDone ? "line-through text-muted-foreground" : ""}`}>
                    {check}
                  </span>
                </label>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
