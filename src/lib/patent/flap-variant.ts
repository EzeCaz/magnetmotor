// Circular Flap Magnetic Motor — a variant of Johnson's US 4,151,431
// A ferromagnetic circular disc rotor driven by 2-3 static side magnets.
// Adapted from the patent's framework: still uses permanent magnets and
// flux concentration, but replaces the permanent-magnet armature with
// a soft-ferromagnetic "flap" disc.

import type {
  BomItem,
  Tool,
  TheoryPoint,
  Dimension,
  BuildStep,
  SafetyItem,
  Troubleshoot,
} from "./data";

export interface FlapVariantInfo {
  number: string;
  title: string;
  parentPatent: string;
  type: string;
  description: string;
}

export const flapVariantInfo: FlapVariantInfo = {
  number: "US 4,151,431 — Variant",
  title: "Circular Flap Magnetic Motor",
  parentPatent: "Adapted from Howard R. Johnson's 1979 patent",
  type: "Rotary motor with ferromagnetic disc rotor",
  description:
    "A modified embodiment of the Johnson permanent magnet motor concept. Instead of using permanent magnets on the armature, this design uses a soft-ferromagnetic circular disc (the 'flap') as the rotor, driven by 2 or 3 static NdFeB magnets positioned on the side. Geometric asymmetry in the disc profile plus flux shielding at the exit side of each magnet produces continuous rotation.",
};

// --- FLAP VARIANT THEORY ---
export const flapTheoryPoints: TheoryPoint[] = [
  {
    id: "FT1",
    title: "Why a Ferromagnetic Disc Instead of a Magnet Armature",
    body: [
      "Johnson's original design uses permanent magnets on both the stator and the armature, relying on the geometric relationship between like and opposite poles to produce a net unidirectional force. The flap variant takes a different approach: replace the magnet armature with a soft-ferromagnetic disc. The disc itself is not a magnet — it is a 'passive' piece of magnetic material that responds to the fields of the surrounding static magnets.",
      "The advantage is simplicity and cost. Soft iron or mild steel is far cheaper than NdFeB and much easier to machine. The disc does not need to be magnetized, does not lose its field over time, and is not sensitive to temperature the way NdFeB is. The drawback is that the disc responds only to attraction forces (no repulsion), so the geometry must do all the work of producing net torque.",
      "In this variant, the static side magnets are positioned at calculated angles around the disc. Each magnet attracts the disc toward its angular position. The disc's geometry — thicker on one side, thinner on the other — ensures that the attraction is stronger when the disc is approaching a magnet than when it is leaving one. The net torque over a full revolution is therefore non-zero.",
    ],
  },
  {
    id: "FT2",
    title: "Geometric Asymmetry — The Reluctance Step",
    body: [
      "The disc is not a uniform flat circle. One half (e.g., from 0° to 180°) is full thickness, while the other half (from 180° to 360°) is thinner by approximately 30–40%. This 'reluctance step' is the key geometric feature that makes continuous rotation possible. The thicker half presents a lower-reluctance path to the magnets, so the magnets pull the disc toward the thicker half.",
      "Without this asymmetry, the disc would simply lock at the position closest to the nearest magnet — the same equilibrium that any piece of iron reaches near a magnet. The step creates a gradient in the magnetic force as a function of rotation angle. As the disc rotates, the net torque on it is positive (in the direction of rotation) when the thicker half is approaching a magnet, and negative when the thicker half is leaving a magnet.",
      "By positioning the magnets at angles where the 'approach' torque is greater than the 'exit' torque, the time-average net torque becomes positive. This is the same principle used in classical reluctance motors (e.g., stepper motors), but here it is achieved with static permanent magnets rather than electromagnets.",
    ],
  },
  {
    id: "FT3",
    title: "Side-Magnet Configuration — 2 vs 3 Magnets",
    body: [
      "With 2 magnets positioned 180° apart, the disc experiences symmetric attraction from both sides. This would lock the disc in place at one of two stable equilibria. To break the symmetry, the 2-magnet version positions the magnets at non-180° angles (e.g., 150° apart) so the disc is always slightly more attracted to one of them, creating a continuous pull.",
      "The 3-magnet version is more common. Three magnets positioned at non-120° angles (e.g., 0°, 130°, 240°) create a rotating asymmetry. As the disc rotates, each magnet in turn becomes the 'dominant' attractor. The angular staggering smooths the torque ripple and produces more uniform rotation than the 2-magnet version.",
      "In both configurations, the magnets should be mounted on adjustable brackets so the builder can fine-tune the angular positions. A few degrees of adjustment can make the difference between a disc that rotates smoothly and one that locks or oscillates. This is the same tuning principle Johnson describes for the original patent — small geometric changes have large effects on the motor's behavior.",
    ],
  },
  {
    id: "FT4",
    title: "The Exit-Side Shield — Breaking the Lock",
    body: [
      "The biggest obstacle to continuous rotation in a ferromagnetic-disc motor is the 'lock' that occurs when a thick part of the disc is directly in front of a magnet. At that position, the attraction is at its maximum, and the disc has no torque to push it past the magnet. Some mechanism must reduce the hold force at the exit side to let the disc continue rotating.",
      "The flap variant uses μ-metal (Netic Co-Netic) shield pieces positioned just past each magnet on the exit side of rotation. These shields provide a low-reluctance return path that diverts flux away from the disc just as it reaches the magnet, weakening the attraction at the critical moment. The disc coasts past the magnet on its momentum, and the next magnet in the sequence takes over.",
      "The shield thickness and position are critical. Too thick, and the shield weakens the magnet's attraction throughout the rotation cycle (no net torque). Too thin, and it does not weaken the hold force enough (the disc locks). The builder must iterate on the shield geometry — typically a 0.030–0.060 in thick piece positioned 10–15° past each magnet on the exit side — to find the sweet spot.",
    ],
  },
  {
    id: "FT5",
    title: "Speed Regulation by Air Gap and Magnet Offset",
    body: [
      "Unlike the original patent's threaded-shaft speed regulator, the flap variant regulates speed by adjusting the air gap between the magnets and the disc. Moving the magnets closer increases the attraction force and the rotation speed; moving them further away reduces both. Each magnet bracket should have a fine-pitch screw adjustment for this.",
      "An alternative regulation mechanism is radial offset — sliding each magnet tangentially around the disc by a few degrees. This changes the timing of the attraction pulse relative to the disc's rotation, similar to adjusting ignition timing in an internal-combustion engine. Forward advance gives more torque at low speeds; retard gives more torque at high speeds.",
      "A useful feature is a friction brake on the disc shaft — a thumbscrew that presses a felt pad against the shaft. This provides a mechanical load for tuning: increase the brake until the disc stalls, then back off slightly. The brake torque at the stall point is the maximum output torque of the motor at that magnet configuration.",
    ],
  },
];

// --- FLAP VARIANT BOM ---
export const flapBomItems: BomItem[] = [
  {
    id: "F-BOM-01",
    part: "Ferromagnetic Disc (the 'Flap')",
    spec: "1018 mild steel or soft iron, 6 in OD × 0.375 in thick, with stepped profile (half at full thickness, half milled down to 0.250 in)",
    qty: "1",
    purpose: "The rotating rotor — soft ferromagnetic material that responds to the side magnets' fields",
    source: " McMaster-Carr / OnlineMetals / local machine shop",
    category: "metal",
    critical: true,
  },
  {
    id: "F-BOM-02",
    part: "Side Magnets (2-magnet version)",
    spec: "NdFeB N42–N50, 1×1×0.5 in blocks, Ni-Cu-Ni coated, with non-magnetic mounting hardware",
    qty: "2",
    purpose: "Static side magnets that attract the ferromagnetic disc and produce rotation",
    source: "K&J Magnetics / CMS Magnetics / SuperMagnetMan",
    category: "magnet",
    critical: true,
  },
  {
    id: "F-BOM-03",
    part: "Side Magnets (3-magnet version)",
    spec: "Same as F-BOM-02, but 3 pieces for smoother torque and higher rotation speed",
    qty: "3",
    purpose: "Static side magnets at non-120° angles for continuous rotation with low torque ripple",
    source: "K&J Magnetics / CMS Magnetics / SuperMagnetMan",
    category: "magnet",
    critical: true,
  },
  {
    id: "F-BOM-04",
    part: "Magnetic Shield Pieces (Exit-Side Shields)",
    spec: "Netic Co-Netic or μ-metal, 0.030–0.060 in thick, 1×0.5 in pieces, one per magnet",
    qty: "2 or 3 (matching magnet count)",
    purpose: "Divert flux at the exit side of each magnet to prevent disc lock-up",
    source: "Magnetic Shield Corp.",
    category: "metal",
    critical: true,
  },
  {
    id: "F-BOM-05",
    part: "Vertical Shaft",
    spec: "Stainless steel 304, 1/4 in diameter, 4 in long, with keyway or flat for set screws",
    qty: "1",
    purpose: "Rotational axis for the disc; non-magnetic to avoid disturbing the field",
    source: "McMaster-Carr",
    category: "structural",
    critical: true,
  },
  {
    id: "F-BOM-06",
    part: "Ball Bearings (Radial)",
    spec: "Sealed radial ball bearings, 1/4 in ID × 1/2 in OD × 0.196 in wide (e.g., R4-2RS)",
    qty: "2",
    purpose: "Low-friction rotation support for the shaft",
    source: "McMaster-Carr / VXB bearings",
    category: "structural",
    critical: true,
  },
  {
    id: "F-BOM-07",
    part: "Bearing Housings",
    spec: "Aluminum 6061, bored to 0.500 in to press-fit the bearings, with mounting flanges",
    qty: "2",
    purpose: "Hold the bearings rigidly on the base plate; align the shaft vertically",
    source: "Custom machined or McMaster-Carr",
    category: "structural",
    critical: false,
  },
  {
    id: "F-BOM-08",
    part: "Base Plate",
    spec: "Aluminum 6061-T6, 0.5 in thick, 10×10 in, with drilled/tapped mounting holes",
    qty: "1",
    purpose: "Rigid foundation for the disc, bearings, and magnet brackets",
    source: "McMaster-Carr / OnlineMetals",
    category: "structural",
    critical: false,
  },
  {
    id: "F-BOM-09",
    part: "Magnet Mounting Brackets",
    spec: "Aluminum 6061 angle brackets, slotted for tangential adjustment, non-magnetic",
    qty: "2 or 3 (matching magnet count)",
    purpose: "Position each side magnet radially around the disc; allow fine-tuning of angular position",
    source: "Custom fabricated or 8020 extrusion system",
    category: "structural",
    critical: true,
  },
  {
    id: "F-BOM-10",
    part: "Air-Gap Adjustment Screws",
    spec: "Stainless steel 1/4-20 threaded rod, 2 in long, with knurled thumbscrews and lock nuts",
    qty: "1 per magnet",
    purpose: "Fine radial adjustment of each magnet's distance from the disc for speed control",
    source: "McMaster-Carr",
    category: "hardware",
    critical: false,
  },
  {
    id: "F-BOM-11",
    part: "Disc Set Collars",
    spec: "Stainless steel 1/4 in set collars, with hex socket set screws",
    qty: "2",
    purpose: "Fix the disc axially on the shaft; prevent vertical play",
    source: "McMaster-Carr",
    category: "hardware",
    critical: false,
  },
  {
    id: "F-BOM-12",
    part: "Friction Brake (Optional)",
    spec: "Brass thumbscrew with felt pad, 1/4-20 thread, mounted to a bracket beside the shaft",
    qty: "1 (optional, for tuning)",
    purpose: "Apply controlled friction load to the shaft for tuning the motor's stall torque",
    source: "McMaster-Carr",
    category: "hardware",
    critical: false,
  },
  {
    id: "F-BOM-13",
    part: "Pulley or Flywheel (Optional)",
    spec: "Aluminum 2 in OD pulley or 4 in OD flywheel, 1/4 in bore with set screw",
    qty: "1 (optional, for load testing)",
    purpose: "Mount on the shaft to measure torque output via a string-and-weight brake test",
    source: "McMaster-Carr / SDP/SI",
    category: "hardware",
    critical: false,
  },
  {
    id: "F-BOM-14",
    part: "Fastener Kit",
    spec: "304 stainless steel screws (10-32, 1/4-20) and washers, non-magnetic",
    qty: "Assorted (30+)",
    purpose: "Assemble the brackets, housings, and base plate without disturbing the magnetic field",
    source: "McMaster-Carr",
    category: "hardware",
    critical: true,
  },
  {
    id: "F-BOM-15",
    part: "Polarity Marker",
    spec: "Magnetic polarity indicator (Magnaflux or equivalent)",
    qty: "1",
    purpose: "Verify and label N/S orientation of each side magnet before assembly",
    source: "Magnaflux / K&J Magnetics",
    category: "tooling",
    critical: true,
  },
  {
    id: "F-BOM-16",
    part: "Gaussmeter / Hall Probe",
    spec: "0–2000 G range, axial Hall probe (e.g., Lakeshore 410)",
    qty: "1",
    purpose: "Measure surface flux density of magnets; verify disc is non-magnetized",
    source: "Lakeshore / AlphaLab",
    category: "tooling",
    critical: false,
  },
  {
    id: "F-BOM-17",
    part: "Precision Calipers / Micrometer",
    spec: "0–6 in digital caliper (0.001 in resolution)",
    qty: "1",
    purpose: "Measure disc thickness profile, set air gaps accurately",
    source: "Mitutoyo / any",
    category: "tooling",
    critical: true,
  },
  {
    id: "F-BOM-18",
    part: "Stroboscope / Tachometer",
    spec: "Handheld optical tachometer, 1–99999 RPM range",
    qty: "1",
    purpose: "Measure disc rotation speed after build and during tuning",
    source: " McMaster-Carr / Shimpo",
    category: "tooling",
    critical: false,
  },
];

// --- WORKSHOP TOOLS (specific to flap variant) ---
export const flapWorkshopTools: Tool[] = [
  { id: "FT-01", name: "Lathe (Metal Turning)", purpose: "Turn the steel disc to size, machine the stepped profile, drill/bore the center hole", required: true },
  { id: "FT-02", name: "Milling Machine", purpose: "Mill the asymmetric thickness profile on the disc; machine bearing housings", required: true },
  { id: "FT-03", name: "Drill Press", purpose: "Drill mounting holes in base plate and brackets", required: true },
  { id: "FT-04", name: "Tap & Die Set (10-32, 1/4-20)", purpose: "Thread holes for stainless fasteners", required: true },
  { id: "FT-05", name: "Dial Indicator + Magnetic Base", purpose: "Measure disc runout; verify shaft is perpendicular to base", required: true },
  { id: "FT-06", name: "Surface Plate (Optional)", purpose: "Flatten the disc faces against a precision reference surface", required: false },
  { id: "FT-07", name: "Bench Sander / Belt Sander", purpose: "Deburr edges after machining; polish disc surfaces", required: false },
  { id: "FT-08", name: "Arbor Press or Hydraulic Press", purpose: "Press bearings into housings; press set collars onto shaft", required: false },
  { id: "FT-09", name: "Eye Protection + Gloves", purpose: "NdFeB magnets can pinch and shatter; chips from machining are sharp", required: true },
  { id: "FT-10", name: "Non-Magnetic Tools (Brass/Aluminum)", purpose: "Handle magnets without ferrous tools sticking to them", required: true },
];

// --- PROTOTYPE DIMENSIONS ---
export const flapPrototypeDimensions: Dimension[] = [
  { parameter: "Disc diameter", value: "6.000 in", notes: "Outer diameter of the ferromagnetic flap" },
  { parameter: "Disc full thickness (thick half)", value: "0.375 in", notes: "From 0° to 180° around the disc" },
  { parameter: "Disc thin thickness (thin half)", value: "0.250 in", notes: "From 180° to 360° around the disc; 33% thinner" },
  { parameter: "Shaft diameter", value: "0.250 in", notes: "Stainless steel 304 vertical axis" },
  { parameter: "Magnet size (each)", value: "1×1×0.5 in", notes: "NdFeB N42-N50 block magnets" },
  { parameter: "Magnet-to-disc air gap (radial)", value: "0.060 in", notes: "Adjustable via thumbscrew; tune for max speed" },
  { parameter: "2-magnet angular spacing", value: "150° apart", notes: "Non-180° to break symmetry and enable rotation" },
  { parameter: "3-magnet angular spacing", value: "0°, 130°, 240°", notes: "Non-120° staggering for smoother torque" },
  { parameter: "Shield thickness (exit side)", value: "0.040 in", notes: "Netic Co-Netic μ-metal, positioned 15° past each magnet" },
];

// --- BUILD STEPS ---
export const flapBuildSteps: BuildStep[] = [
  {
    id: "F-1",
    phase: "Preparation",
    title: "Verify Disc Material and Magnets",
    duration: "1–2 h",
    description:
      "Order a 6 in OD × 0.375 in thick disc of 1018 mild steel or soft iron (low-carbon, high-permeability). Verify with a gaussmeter that the disc is NOT magnetized — any residual field will create a preferred orientation and prevent smooth rotation. Sort and label the side magnets with a polarity marker — both magnets in the 2-magnet version should have the same pole (e.g., N) facing the disc.",
    checks: [
      "Disc measures zero on the gaussmeter (no residual magnetization)",
      "All side magnets have N (or S) consistently marked on the disc-facing face",
      "Shields (Netic Co-Netic) are verified non-magnetic in their as-supplied state",
      "All magnets have the same dimensions and grade (mixing grades creates uneven forces)",
    ],
    warning:
      "If the disc has any residual magnetization, it must be degaussed before assembly. Use a degausser or pass it slowly through an AC magnetic field (e.g., a bulk tape eraser).",
  },
  {
    id: "F-2",
    phase: "Foundation",
    title: "Machine the Disc with Stepped Profile",
    duration: "3–5 h",
    description:
      "Mount the disc in a lathe and face both sides to ensure they are flat and parallel. Then mount the disc on a milling machine and mill one half (e.g., from 0° to 180°) down to 0.250 in thickness — leaving the other half at 0.375 in. This creates the 'reluctance step' that produces the asymmetric attraction. Use a dividing head to set the exact 180° boundary; a few degrees of error here will create a noticeable pulsation in the rotation.",
    checks: [
      "Disc faces are flat to within 0.001 in TIR",
      "Thick half measures 0.375 in ±0.002 in",
      "Thin half measures 0.250 in ±0.002 in",
      "Step boundary is at exactly 180° (verified with dividing head)",
      "Center bore is 0.250 in reamed for the shaft, concentric to the OD within 0.001 in TIR",
    ],
    warning:
      "Do not heat the disc above 200°C during machining — excessive heat can cause residual magnetization in mild steel. Use cutting fluid liberally and take light cuts.",
  },
  {
    id: "F-3",
    phase: "Foundation",
    title: "Assemble Base Plate, Bearings, and Shaft",
    duration: "2–3 h",
    description:
      "Mount the two bearing housings on the base plate, spaced approximately 3 in apart. Press one bearing into each housing. Slide the stainless shaft through both bearings, then through the disc, and secure with set collars above and below the disc. The disc should rotate freely with no vertical play and minimal axial wobble.",
    checks: [
      "Shaft is perpendicular to the base plate (verified with a square, within 0.002 in over 4 in)",
      "Disc rotates freely with no binding",
      "Disc runout (axial) is less than 0.003 in TIR when rotated by hand",
      "Set collars lock the disc axially; no vertical play",
    ],
  },
  {
    id: "F-4",
    phase: "Armature",
    title: "Mount Side Magnets on Adjustable Brackets",
    duration: "2–3 h",
    description:
      "Mount each side magnet on an aluminum angle bracket using non-magnetic stainless screws. The bracket has slotted holes for tangential adjustment and a thumbscrew for radial air-gap adjustment. For the 2-magnet version, position the brackets at 0° and 150° around the disc. For the 3-magnet version, position them at 0°, 130°, and 240°. The disc-facing pole of each magnet should be the same (e.g., all N).",
    checks: [
      "Each magnet's disc-facing pole is the same (all N or all S)",
      "Air gap (magnet face to disc edge) is approximately 0.060 in initial setting",
      "Angular positions match the chosen configuration (150° / 130°+240°)",
      "Brackets are rigid; no magnet movement when the disc is rotated by hand",
    ],
    warning:
      "Keep magnets at least 6 in from each other during mounting to prevent sudden snap-together pinch injuries. Use brass spacers as temporary mechanical stops.",
  },
  {
    id: "F-5",
    phase: "Armature",
    title: "Install μ-Metal Shields at Exit Side of Each Magnet",
    duration: "1–2 h",
    description:
      "Cut 1×0.5 in pieces of Netic Co-Netic, one per magnet. Bond each piece to a small bracket positioned 10–15° past its corresponding magnet on the exit side of rotation (the direction the disc is intended to rotate). The shield's purpose is to divert flux away from the disc at the critical 'hold' position so the disc coasts past the magnet.",
    checks: [
      "Each shield is positioned 10–15° past its magnet on the exit side of rotation",
      "Shield-to-disc air gap matches the magnet-to-disc air gap (~0.060 in)",
      "Shields are bonded securely; no movement when the disc rotates",
      "Shields do not extend past the magnet on the approach side (would weaken the attraction pulse)",
    ],
    warning:
      "Do not bend or hammer the μ-metal shields — even small dents reduce permeability and degrade the shielding effect. Handle with plastic tools only.",
  },
  {
    id: "F-6",
    phase: "Tuning",
    title: "Initial Spin Test and Direction Verification",
    duration: "1 h",
    description:
      "Spin the disc gently by hand in the intended direction of rotation (the direction in which the shields are positioned past the magnets). The disc should continue rotating for several seconds after release. If the disc stops abruptly or rotates in the opposite direction, the shields may be on the wrong side or the magnets may be at the wrong angles.",
    checks: [
      "Disc continues rotating for at least 3 seconds after a gentle hand spin",
      "Direction of rotation matches the shield-side direction",
      "No audible clicking or magnet-shift sounds during rotation",
      "Disc does not oscillate back-and-forth (would indicate wrong angular positions)",
    ],
    warning:
      "If the disc rotates in the opposite direction, your shields are on the wrong side. Disassemble and reposition each shield on the other side of its magnet.",
  },
  {
    id: "F-7",
    phase: "Tuning",
    title: "Iterate Air Gap and Shield Position for Continuous Rotation",
    duration: "3–5 h",
    description:
      "If the disc does not continue rotating on its own (most common after first assembly), iterate: (1) increase the air gap to 0.080 in and retry; (2) move each shield 5° closer to its magnet and retry; (3) adjust each magnet's tangential position by 2–3° to vary the angular staggering. The goal is a configuration where the disc rotates continuously without stalling, with the smoothest possible motion. Use the friction brake to measure stall torque at each configuration.",
    checks: [
      "Disc rotates continuously on its own for at least 30 seconds after a hand-start",
      "Rotation is smooth with no perceptible angular pulsation",
      "Friction brake test: disc stalls at a measurable torque (typically 0.5–2 in·oz for a small prototype)",
      "Stall torque can be increased by reducing the air gap or by using stronger magnets",
    ],
  },
];

// --- SAFETY (similar to original, but with flap-specific notes) ---
export const flapSafetyItems: SafetyItem[] = [
  {
    id: "FS-1",
    title: "Pinch Hazard from Side Magnets",
    detail:
      "The side magnets in this variant are large (1×1×0.5 in NdFeB blocks) and positioned close to the rotating disc. If the disc has any magnetic residual or the magnets shift during assembly, they can snap to the disc with forces exceeding 30 lbf, potentially shattering the disc or trapping fingers. Always use non-magnetic spacers during initial positioning and wear eye protection.",
    severity: "critical",
  },
  {
    id: "FS-2",
    title: "Disc Burst Hazard at High RPM",
    detail:
      "The steel disc has significant mass (≈1.5 lb for 6 in × 0.375 in). At high rotation speeds, a disc imbalance or fracture can launch fragments at dangerous velocities. Always test initial rotation behind a clear polycarbonate shield, and balance the disc by adding set screws to the thin half if necessary. Maximum recommended speed is 600 RPM.",
    severity: "critical",
  },
  {
    id: "FS-3",
    title: "Machining Steel — Chip and Heat Hazards",
    detail:
      "Machining mild steel produces hot, sharp chips. Use cutting fluid liberally, wear gloves and eye protection, and clear chips with a brush (never with hands). The disc can reach 80°C during aggressive milling — let it cool before handling.",
    severity: "caution",
  },
  {
    id: "FS-4",
    title: "μ-Metal Fragility",
    detail:
      "Netic Co-Netic and other μ-metal alloys are mechanically soft and dent easily. Do not bend or hammer them. The shields must be flat to within 0.005 in for the shielding effect to work — even small dents reduce permeability and degrade the flux-diversion behavior.",
    severity: "note",
  },
  {
    id: "FS-5",
    title: "Magnetic Field Interference",
    detail:
      "Keep the assembled motor at least 12 in (30 cm) away from pacemakers, magnetic storage media, CRT displays, and credit-card stripes. The static field from N42 magnets can wipe magnetic stripe cards at distances up to 6 in.",
    severity: "caution",
  },
  {
    id: "FS-6",
    title: "Scientific Status of the Variant",
    detail:
      "Like the parent patent, this variant describes a permanent-magnet-only motor. Mainstream physics (the second law of thermodynamics) implies a static magnetic field alone cannot produce net work indefinitely. The variant is best treated as an engineering case study in magnetic-reluctance motor design rather than a working free-energy machine. Continuous rotation observed during tuning is likely due to disc momentum and small thermal/vibration asymmetries rather than the magnetic configuration alone.",
    severity: "note",
  },
];

// --- TROUBLESHOOTING (specific to flap variant) ---
export const flapTroubleshooting: Troubleshoot[] = [
  {
    symptom: "Disc locks at one of the magnet positions and will not rotate",
    cause: "Hold force from the magnet exceeds the disc's momentum; shield is too thin or in the wrong position",
    fix: "Increase shield thickness to 0.060 in; move the shield 5° closer to the magnet on the exit side; increase the magnet-to-disc air gap by 0.020 in.",
  },
  {
    symptom: "Disc rotates but in the wrong direction (opposite to shield side)",
    cause: "Shields are positioned on the wrong side of their magnets (approach side instead of exit side)",
    fix: "Disassemble each shield and reposition it on the other side of its corresponding magnet, 10–15° past the magnet in the intended direction of rotation.",
  },
  {
    symptom: "Disc oscillates back-and-forth instead of rotating continuously",
    cause: "Magnets are at symmetric angles (180° or 120°) — disc finds a stable equilibrium",
    fix: "Adjust magnet angles to break symmetry: for 2 magnets use 150° apart; for 3 magnets use 0°, 130°, 240°.",
  },
  {
    symptom: "Disc rotates but very slowly (<50 RPM)",
    cause: "Air gap is too large, or the reluctance step is too shallow",
    fix: "Reduce air gap to 0.040 in (carefully, watching for stall); if that doesn't help, re-machine the disc with a deeper step (e.g., 0.375 → 0.200 in instead of 0.250 in).",
  },
  {
    symptom: "Disc has noticeable wobble or vibration",
    cause: "Disc is unbalanced — the thick half is heavier than the thin half, creating a center-of-mass offset",
    fix: "Add set screws to the thin half at calculated positions to balance the disc, OR drill lightening holes in the thick half. Use a dynamic balancer to verify.",
  },
  {
    symptom: "Disc stalls under any small load (e.g., touching the shaft with a finger)",
    cause: "Stall torque is too low — magnets are too weak, or the disc material has low permeability",
    fix: "Upgrade magnets to N52 grade; if still low, switch disc material from 1018 steel to soft iron or Permalloy (much higher permeability).",
  },
];

// --- CONFIGURATIONS (2-magnet vs 3-magnet) ---
export interface FlapConfig {
  id: "2-magnet" | "3-magnet";
  label: string;
  description: string;
  angles: number[]; // angular positions of magnets in degrees
  pros: string[];
  cons: string[];
}

export const flapConfigs: FlapConfig[] = [
  {
    id: "2-magnet",
    label: "2-Magnet Configuration",
    description:
      "Two side magnets positioned 150° apart (non-180° to break symmetry). Simpler to build and tune. Lower rotation speed and lower torque than the 3-magnet version.",
    angles: [0, 150],
    pros: [
      "Fewer magnets to position and tune",
      "Lower cost",
      "Simpler bracket fabrication",
      "Easier to identify which magnet is causing a stall",
    ],
    cons: [
      "Lower average torque",
      "More torque ripple (less smooth rotation)",
      "More sensitive to angular position errors",
      "Lower maximum RPM",
    ],
  },
  {
    id: "3-magnet",
    label: "3-Magnet Configuration",
    description:
      "Three side magnets positioned at 0°, 130°, and 240° (non-120° staggering for smooth continuous rotation). Higher rotation speed and torque than the 2-magnet version, with significantly smoother motion.",
    angles: [0, 130, 240],
    pros: [
      "Higher average torque",
      "Smoother rotation (less torque ripple)",
      "Higher maximum RPM",
      "More forgiving of small angular position errors",
    ],
    cons: [
      "Higher cost (3 magnets and 3 shields)",
      "More brackets to fabricate and align",
      "More complex tuning (3-way interaction)",
      "Longer total build time",
    ],
  },
];
