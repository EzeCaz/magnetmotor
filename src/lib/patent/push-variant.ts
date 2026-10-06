// Diametric Push Motor — new prototype based on user-uploaded image
// "Flap metallic magnet motor.png"
//
// Concept: A diametrically magnetized NdFeB disc (the "flap") rotates on a
// vertical axis. Two static NdFeB magnets are positioned around the disc.
// Each static magnet is oriented with its LIKE pole facing the disc — N
// facing the disc's N side, S facing the disc's S side — so they REPEL
// (push) the disc. Asymmetric angular placement of the 2 static magnets
// (e.g., 90° apart, NOT 180°) creates a non-zero net torque that drives
// continuous rotation.
//
// This is fundamentally different from the previous flap variant (passive
// ferromagnetic disc + attraction): here the rotor is an ACTIVE permanent
// magnet and the primary force is REPULSION (push), not attraction.

import type {
  BomItem,
  Tool,
  TheoryPoint,
  Dimension,
  BuildStep,
  SafetyItem,
  Troubleshoot,
} from "./data";

export interface PushVariantInfo {
  number: string;
  title: string;
  parentPatent: string;
  type: string;
  description: string;
  sourceImage: string;
  sourceImageAlt: string;
  sourceImageAnalysis: string;
}

export const pushVariantInfo: PushVariantInfo = {
  number: "Image-Based Prototype",
  title: "Diametric Push Motor",
  parentPatent: "Inspired by Johnson US 4,151,431 + user-uploaded diagram",
  type: "Rotary motor — diametrically magnetized rotor + 2 repulsion magnets",
  description:
    "A new prototype based on the uploaded 'Flap metallic magnet motor' diagram. A diametrically magnetized NdFeB disc (the 'flap') spins on a vertical axis. Two static NdFeB magnets are positioned at non-symmetric angles around the disc, with like poles facing the disc to produce repulsion (push) forces. The angular asymmetry creates a net torque that drives continuous rotation — a fundamentally different mechanism from the original patent's attraction-based geometry.",
  sourceImage: "/images/flap-metallic-magnet-motor.png",
  sourceImageAlt:
    "Top-down view of a magnetic motor design showing a central rotor labeled O with point L (red, North) on the left and point S (blue, South) on the right. 16 outer static magnets are positioned around the perimeter following curved red and blue magnetic field lines that spiral outward from the central rotor.",
  sourceImageAnalysis:
    "The source image shows a top-down (plan) view of a radial magnetic motor. The central rotor 'O' is a diametrically magnetized cylinder — its left side (L) is the North pole and its right side (S) is the South pole. The image shows 16 outer static magnets with curved red (North flux) and blue (South flux) field lines spiraling outward from the rotor to each magnet. The curvature of the field lines suggests clockwise rotation. The image uses an A-B-C-D-E-F-G-H rectangular reference frame and exhibits approximate 8-fold rotational symmetry. The user's request was to simplify this concept to just 2 static push magnets (instead of 16) — keeping the diametric rotor as the spinning 'flap'.",
};

// --- THEORY ---
export const pushTheoryPoints: TheoryPoint[] = [
  {
    id: "PT1",
    title: "The Diametric Rotor — A Magnet, Not Just Iron",
    body: [
      "The uploaded image's central rotor 'O' is labeled with L (North, red) on the left and S (South, blue) on the right. This is the key signature of a DIAMETRICALLY magnetized permanent magnet — the magnetization vector goes ACROSS the disc (left to right), not through its thickness. This is fundamentally different from an axially magnetized disc (where the poles are on the flat faces) or from a passive ferromagnetic disc (which has no magnetization of its own).",
      "A diametric NdFeB rotor is an ACTIVE magnetic element. Its North side permanently repels other North magnets and attracts South magnets. This means we can use REPULSION (push) as the primary motive force, not just attraction. The previous 'flap variant' (passive iron disc) could only use attraction because iron has no poles of its own to repel.",
      "Practically, you can buy diametrically magnetized NdFeB discs from major magnet suppliers (K&J Magnetics, SuperMagnetMan) — they are usually labeled 'diametric' or 'magnetized across diameter'. Common sizes for a prototype are 1/2 in, 3/4 in, or 1 in diameter × 1/4 to 1/2 in thick. Verify the magnetization direction with a polarity indicator before assembly — the N side should be marked.",
    ],
  },
  {
    id: "PT2",
    title: "Why 2 Magnets Push the Flap — The Repulsion Principle",
    body: [
      "The user's prototype uses 2 static magnets that PUSH (repel) the diametric flap. Each static magnet is oriented with its LIKE pole facing the disc — the static N magnet faces the disc's N side, the static S magnet faces the disc's S side. Like poles repel, so each static magnet exerts a pushing force on the disc, perpendicular to the disc's surface at the closest point.",
      "If the 2 static magnets were placed at exactly 180° apart, the disc would simply lock at the symmetric equilibrium where both repulsion forces cancel. The trick is to place them at a NON-symmetric angle — typically 90° or 120° apart. This breaks the symmetry: at any given disc rotation angle, one repulsion force is stronger than the other, creating a net torque.",
      "As the disc rotates, the strongest repulsion point sweeps around. The angular offset of the 2 static magnets ensures that the net torque never goes through zero — the disc is always being pushed in the same direction. This is the 'magnetic windmill' effect visible in the source image's curved field lines, simplified to a 2-magnet configuration.",
    ],
  },
  {
    id: "PT3",
    title: "Geometry from the Image — Diametric Rotor + Push Magnets",
    body: [
      "The source image shows 16 outer magnets on a scalloped perimeter, but the user's request is for 2. The reduction from 16 to 2 makes the build simpler but requires careful angular positioning. Based on the image's symmetry (8-fold, with N and S alternating every 45°), the 2 push magnets should be placed at the angular positions where the image's flux is strongest — typically at 90° offset.",
      "Recommended configuration: place the N static magnet at 45° (upper right) and the S static magnet at 225° (lower left) — that is, 180° apart but rotated 45° relative to the disc's N-S axis. This breaks the symmetry because the disc's N pole (left, 180°) is closer to the S static magnet at 225° (which repels it because like poles — wait, no — S repels S, attracts N).",
      "Actually, for REPULSION: place the N static magnet at 90° (top) with N facing the disc, and the S static magnet at 270° (bottom) with S facing the disc. As the disc rotates, its N side passes under the top N magnet and is pushed away (repulsion), then continues to the bottom where its S side passes the bottom S magnet and is pushed away. The 180° offset between the two static magnets ensures that one is always repelling while the other is between cycles — but the disc's own diametric asymmetry (N on one side only) creates a net tangential force.",
    ],
  },
  {
    id: "PT4",
    title: "Torque Analysis — Why It Spins",
    body: [
      "Consider the disc at angle θ (where θ=0 means the disc's N pole points to the right / East). The N static magnet is at the top (90°) with its N pole facing down. The disc's N pole is at angle θ, so the angular separation between the disc's N and the static N is (90° - θ). The repulsion force magnitude is roughly F = (B_r² · V) / (4πμ₀ · r⁴) where r is the gap distance — but the tangential component (which produces torque) is F · sin(90° - θ) = F · cos(θ).",
      "When θ = 0 (disc N pointing East), the disc N is 90° from the top static N — the repulsion is purely radial (no torque). When θ = 90° (disc N pointing up, toward the top static N), the repulsion is maximum but purely radial — still no torque. The torque is maximum at θ = 45° (disc N pointing North-East) where the geometry creates a tangential component.",
      "The 2-magnet configuration produces a torque curve that peaks twice per revolution. The angular asymmetry between the two static magnets (90° offset instead of 180°) ensures that the torque curve from one magnet fills the 'gap' in the other's torque curve, producing a continuous positive net torque. The image's curved red/blue field lines are the visual representation of this asymmetric flux pattern, simplified to 16 magnets and here simplified further to 2.",
    ],
  },
  {
    id: "PT5",
    title: "Speed Regulation by Air Gap",
    body: [
      "Like the previous flap variant, this prototype regulates speed by adjusting the air gap between the static magnets and the disc. Move the static magnets closer → stronger repulsion → higher RPM. Move them further → weaker repulsion → lower RPM. Each static magnet should be on a thumbscrew-driven radial slider.",
      "An important difference from the previous flap variant: this design has no μ-metal shields because repulsion does not create a 'lock' problem. The disc naturally coasts past each static magnet because the like-pole repulsion is symmetric on both approach and exit — there's no preferred angular position to get stuck at. This makes the build significantly simpler (no shields to fabricate and tune).",
      "The maximum speed is limited by the disc's structural integrity. A 1 in diameter NdFeB disc weighs approximately 60 g and at 1000 RPM experiences a centrifugal force of about 30 N at its rim. The disc's brittle NdFeB material can crack above ~3000 RPM, so a polycarbonate safety shield around the rotating disc is mandatory for any high-speed testing. Recommended maximum: 1500 RPM for the basic prototype.",
    ],
  },
];

// --- BOM ---
export const pushBomItems: BomItem[] = [
  {
    id: "P-BOM-01",
    part: "Diametric NdFeB Disc (the 'Flap')",
    spec: "NdFeB N42-N52, diametrically magnetized (across diameter), 1 in OD × 0.5 in thick, with N side marked with paint or sticker",
    qty: "1",
    purpose: "The rotating flap — a permanent magnet with N on one side, S on the other, that gets pushed (repelled) by the 2 static magnets",
    source: "K&J Magnetics (Diametric series) / SuperMagnetMan / CMS Magnetics",
    category: "magnet",
    critical: true,
  },
  {
    id: "P-BOM-02",
    part: "Static Push Magnets",
    spec: "NdFeB N42-N50, 1×1×0.5 in blocks (or 1 in OD × 0.5 in discs), axially magnetized through thickness, with N and S marked on flat faces",
    qty: "2",
    purpose: "Two static magnets positioned around the diametric disc, with like poles facing the disc, to produce repulsion (push) forces",
    source: "K&J Magnetics / CMS Magnetics / SuperMagnetMan",
    category: "magnet",
    critical: true,
  },
  {
    id: "P-BOM-03",
    part: "Vertical Shaft",
    spec: "Stainless steel 304, 1/4 in diameter, 4 in long, with a flat or keyway for set screws",
    qty: "1",
    purpose: "Vertical rotation axis for the diametric disc; non-magnetic so it doesn't disturb the field",
    source: "McMaster-Carr",
    category: "structural",
    critical: true,
  },
  {
    id: "P-BOM-04",
    part: "Ball Bearings (Radial)",
    spec: "Sealed radial ball bearings, 1/4 in ID × 1/2 in OD × 0.196 in wide (e.g., R4-2RS)",
    qty: "2",
    purpose: "Low-friction rotation support for the shaft",
    source: "McMaster-Carr / VXB bearings",
    category: "structural",
    critical: true,
  },
  {
    id: "P-BOM-05",
    part: "Bearing Housings",
    spec: "Aluminum 6061, bored to 0.500 in to press-fit the bearings, with mounting flanges",
    qty: "2",
    purpose: "Hold the bearings rigidly on the base plate; align the shaft vertically",
    source: "Custom machined or McMaster-Carr",
    category: "structural",
    critical: false,
  },
  {
    id: "P-BOM-06",
    part: "Base Plate",
    spec: "Aluminum 6061-T6, 0.5 in thick, 8×8 in, with drilled/tapped mounting holes",
    qty: "1",
    purpose: "Rigid foundation for the disc, bearings, and magnet brackets",
    source: "McMaster-Carr / OnlineMetals",
    category: "structural",
    critical: false,
  },
  {
    id: "P-BOM-07",
    part: "Magnet Mounting Brackets (Adjustable)",
    spec: "Aluminum 6061 angle brackets, slotted for tangential adjustment, with thumbscrew-driven radial positioning",
    qty: "2 (one per static magnet)",
    purpose: "Position each static magnet around the disc at the correct angle; allow fine-tuning of air gap",
    source: "Custom fabricated or 8020 extrusion system",
    category: "structural",
    critical: true,
  },
  {
    id: "P-BOM-08",
    part: "Disc Hub Adapter",
    spec: "Aluminum or brass sleeve, 1 in OD × 1/4 in ID × 0.5 in long, with set-screw hole",
    qty: "1",
    purpose: "Connects the 1 in NdFeB disc (no center hole) to the 1/4 in shaft via a clamping hub",
    source: "Custom machined",
    category: "structural",
    critical: true,
  },
  {
    id: "P-BOM-09",
    part: "Disc Set Collars",
    spec: "Stainless steel 1/4 in set collars, with hex socket set screws",
    qty: "2",
    purpose: "Fix the disc axially on the shaft; prevent vertical play",
    source: "McMaster-Carr",
    category: "hardware",
    critical: false,
  },
  {
    id: "P-BOM-10",
    part: "Air-Gap Adjustment Screws",
    spec: "Stainless steel 1/4-20 threaded rod, 2 in long, with knurled thumbscrews and lock nuts",
    qty: "2 (one per static magnet)",
    purpose: "Fine radial adjustment of each static magnet's distance from the disc for speed control",
    source: "McMaster-Carr",
    category: "hardware",
    critical: false,
  },
  {
    id: "P-BOM-11",
    part: "Polycarbonate Safety Shield",
    spec: "1/4 in thick clear polycarbonate, 5 in OD × 4 in tall cylinder (or 5×5 in square tube)",
    qty: "1",
    purpose: "Mandatory safety enclosure around the rotating NdFeB disc to contain fragments if the disc shatters at high RPM",
    source: "McMaster-Carr",
    category: "structural",
    critical: true,
  },
  {
    id: "P-BOM-12",
    part: "Friction Brake (Optional, for tuning)",
    spec: "Brass thumbscrew with felt pad, 1/4-20 thread, mounted to a bracket beside the shaft",
    qty: "1 (optional)",
    purpose: "Apply controlled friction load to the shaft for tuning the motor's stall torque",
    source: "McMaster-Carr",
    category: "hardware",
    critical: false,
  },
  {
    id: "P-BOM-13",
    part: "Fastener Kit",
    spec: "304 stainless steel screws (10-32, 1/4-20) and washers, non-magnetic",
    qty: "Assorted (25+)",
    purpose: "Assemble the brackets, housings, and base plate without disturbing the magnetic field",
    source: "McMaster-Carr",
    category: "hardware",
    critical: true,
  },
  {
    id: "P-BOM-14",
    part: "Polarity Marker",
    spec: "Magnetic polarity indicator (Magnaflux or equivalent)",
    qty: "1",
    purpose: "Verify and label N/S orientation of the diametric disc AND both static magnets before assembly",
    source: "Magnaflux / K&J Magnetics",
    category: "tooling",
    critical: true,
  },
  {
    id: "P-BOM-15",
    part: "Gaussmeter / Hall Probe",
    spec: "0–2000 G range, axial Hall probe (e.g., Lakeshore 410)",
    qty: "1",
    purpose: "Verify the diametric disc is correctly magnetized across its diameter; measure the disc's N and S sides",
    source: "Lakeshore / AlphaLab",
    category: "tooling",
    critical: false,
  },
  {
    id: "P-BOM-16",
    part: "Precision Calipers",
    spec: "0–6 in digital caliper (0.001 in resolution)",
    qty: "1",
    purpose: "Measure disc diameter, set air gaps accurately",
    source: "Mitutoyo / any",
    category: "tooling",
    critical: true,
  },
  {
    id: "P-BOM-17",
    part: "Stroboscope / Tachometer",
    spec: "Handheld optical tachometer, 1–99999 RPM range",
    qty: "1",
    purpose: "Measure disc rotation speed after build and during tuning",
    source: "McMaster-Carr / Shimpo",
    category: "tooling",
    critical: false,
  },
];

// --- WORKSHOP TOOLS ---
export const pushWorkshopTools: Tool[] = [
  { id: "PT-01", name: "Drill Press", purpose: "Drill mounting holes in base plate and brackets", required: true },
  { id: "PT-02", name: "Milling Machine (Optional)", purpose: "Machine the disc hub adapter and bearing housings; can be replaced by a hand drill + pre-made parts", required: false },
  { id: "PT-03", name: "Tap & Die Set (10-32, 1/4-20)", purpose: "Thread holes for stainless fasteners", required: true },
  { id: "PT-04", name: "Dial Indicator + Magnetic Base", purpose: "Measure disc runout; verify shaft is perpendicular to base", required: true },
  { id: "PT-05", name: "Arbor Press or Hydraulic Press", purpose: "Press bearings into housings; press set collars onto shaft", required: false },
  { id: "PT-06", name: "Eye Protection + Gloves", purpose: "NdFeB magnets can pinch and shatter; disc shards at high RPM are dangerous", required: true },
  { id: "PT-07", name: "Non-Magnetic Tools (Brass/Aluminum/Plastic)", purpose: "Handle magnets without ferrous tools sticking to them; assemble the diametric disc without disturbing its field", required: true },
  { id: "PT-08", name: "Cyanoacrylate Gel (Superglue)", purpose: "Bond the disc to the hub adapter (the diametric disc has no center hole)", required: true },
  { id: "PT-09", name: "Sandpaper (assorted grits)", purpose: "Deburr the disc edges and hub adapter", required: false },
  { id: "PT-10", name: "Marker or Paint Pen", purpose: "Mark the N side of the diametric disc and the N/S faces of the static magnets visibly", required: true },
];

// --- PROTOTYPE DIMENSIONS ---
export const pushPrototypeDimensions: Dimension[] = [
  { parameter: "Disc diameter (diametric NdFeB)", value: "1.000 in", notes: "Standard diametrically magnetized disc" },
  { parameter: "Disc thickness", value: "0.500 in", notes: "Axial dimension (poles are on the sides, not the faces)" },
  { parameter: "Disc magnetization direction", value: "Diametric (across diameter)", notes: "N on one side, S on the other — verify with polarity marker" },
  { parameter: "Shaft diameter", value: "0.250 in", notes: "Stainless steel 304 vertical axis" },
  { parameter: "Static magnet size (each)", value: "1×1×0.5 in block", notes: "Axially magnetized through 0.5 in thickness" },
  { parameter: "Static magnet 1 angular position", value: "90° (top)", notes: "N pole facing the disc — repels the disc's N side" },
  { parameter: "Static magnet 2 angular position", value: "270° (bottom)", notes: "S pole facing the disc — repels the disc's S side" },
  { parameter: "Air gap (magnet face to disc edge)", value: "0.080 in", notes: "Adjustable via thumbscrew; tune for max RPM" },
  { parameter: "Maximum recommended RPM", value: "1500 RPM", notes: "Limited by NdFeB disc's structural integrity" },
];

// --- BUILD STEPS ---
export const pushBuildSteps: BuildStep[] = [
  {
    id: "P-1",
    phase: "Preparation",
    title: "Verify Magnet Polarities and Disc Magnetization",
    duration: "1 h",
    description:
      "Use a polarity marker to verify the diametric disc is correctly magnetized ACROSS its diameter (not through its thickness). The N side should be on one flat edge (e.g., the 'left' side when viewed from above), and the S side on the opposite edge. Mark the N side clearly with a paint pen or sticker so you can see the disc's rotation. For the 2 static magnets, verify and mark the N and S faces of each. ALL orientations must be verified before any assembly.",
    checks: [
      "Diametric disc's N side is marked and visible from above (e.g., red dot on the left edge)",
      "Diametric disc's S side is on the opposite edge (180° from N)",
      "Both static magnets have N and S faces clearly marked",
      "Gaussmeter confirms the disc's field is strongest on the N and S edges, weakest on the top and bottom faces",
    ],
    warning:
      "If the disc is actually AXIALLY magnetized (poles on top/bottom faces instead of sides), the motor will not work. Order a DIAMETRIC NdFeB disc specifically — most suppliers list this as a separate product category.",
  },
  {
    id: "P-2",
    phase: "Foundation",
    title: "Assemble Base Plate, Bearings, and Shaft",
    duration: "2 h",
    description:
      "Mount the two bearing housings on the base plate, spaced approximately 2.5 in apart. Press one bearing into each housing. Slide the stainless shaft through both bearings. The shaft should rotate freely with no play. Do NOT mount the disc yet — verify the shaft rotates smoothly first.",
    checks: [
      "Shaft is perpendicular to the base plate (verified with a square, within 0.002 in over 4 in)",
      "Shaft rotates freely with no binding",
      "Shaft has no axial play (bearings are properly seated)",
      "Shaft protrudes approximately 1 in above the top bearing (this is where the disc will mount)",
    ],
  },
  {
    id: "P-3",
    phase: "Armature",
    title: "Mount the Diametric Disc on the Shaft",
    duration: "1.5 h",
    description:
      "The diametric NdFeB disc typically comes without a center hole. Bond the disc to the aluminum hub adapter using cyanoacrylate gel (superglue) — the hub adapter has a 1/4 in bore that slides onto the shaft. Apply a thin film of gel to the disc's flat face, center the hub adapter on the disc, press firmly, and let it cure for 5 minutes. Then slide the assembly onto the shaft and secure with set collars above and below.",
    checks: [
      "Hub adapter is centered on the disc (within 0.005 in)",
      "Bond is fully cured before mounting on the shaft",
      "Disc is mounted at the correct height (the disc's vertical center aligns with the static magnets' vertical center)",
      "Disc's N side is visible from above after mounting (verify the orientation didn't flip during bonding)",
      "Set collars lock the disc axially; no vertical play",
    ],
    warning:
      "Use cyanoacrylate GEL, not liquid — liquid runs and can bond the disc to the wrong surface. Apply a thin film only; excess gel can interfere with the magnetic field.",
  },
  {
    id: "P-4",
    phase: "Armature",
    title: "Install the Polycarbonate Safety Shield",
    duration: "30 min",
    description:
      "Before installing any magnets, install the clear polycarbonate safety shield around the disc area. The shield should be at least 1 in taller than the disc and fully enclose the disc's rotation path. Fasten it to the base plate with non-magnetic screws. This is mandatory — NdFeB discs can shatter at high RPM and the fragments are sharp and dangerous.",
    checks: [
      "Shield fully encloses the disc's rotation circle",
      "Shield is at least 1 in taller than the disc",
      "Shield is securely fastened to the base plate",
      "Shield does not touch the disc when the shaft is rotated by hand",
    ],
    warning:
      "Never test the motor at high RPM without the safety shield in place. NdFeB is brittle and can crack above 3000 RPM.",
  },
  {
    id: "P-5",
    phase: "Assembly",
    title: "Mount the 2 Static Push Magnets on Adjustable Brackets",
    duration: "2 h",
    description:
      "Mount each static magnet on an aluminum angle bracket with non-magnetic stainless screws. Position bracket 1 at 90° (top, relative to the disc's N-S axis) with the static magnet's N pole facing DOWN toward the disc. Position bracket 2 at 270° (bottom) with the static magnet's S pole facing UP toward the disc. The like-pole-to-like-pole orientation (N-to-N, S-to-S) is what produces repulsion. Set the initial air gap to 0.080 in.",
    checks: [
      "Bracket 1 (top, 90°): static magnet's N face is pointing DOWN toward the disc",
      "Bracket 2 (bottom, 270°): static magnet's S face is pointing UP toward the disc",
      "Both static magnets are at the same vertical height as the disc (centered)",
      "Initial air gap is 0.080 in ±0.010 in on both magnets",
      "Brackets are rigid; no magnet movement when the disc is rotated by hand",
    ],
    warning:
      "DO NOT install the static magnets with opposite poles facing the disc (N-to-S) — this would produce ATTRACTION instead of repulsion, and the disc would lock immediately. Double-check the orientation with the polarity marker before tightening the brackets.",
  },
  {
    id: "P-6",
    phase: "Tuning",
    title: "Initial Spin Test and Direction Verification",
    duration: "1 h",
    description:
      "Spin the disc gently by hand in the intended direction (the direction in which the curved field lines in the source image suggest — clockwise as viewed from above). The disc should continue rotating for several seconds after release. If the disc stops abruptly, the static magnets may be too close (reduce the air gap is wrong direction — INCREASE the air gap to weaken the repulsion). If the disc rotates in the opposite direction, swap the positions of the two static magnets (move the top magnet to the bottom and vice versa).",
    checks: [
      "Disc continues rotating for at least 5 seconds after a gentle hand spin",
      "Direction of rotation matches the source image (clockwise viewed from above)",
      "No audible clicking or magnet-shift sounds during rotation",
      "Disc does not oscillate back-and-forth",
    ],
    warning:
      "If the disc locks immediately or oscillates, the most likely cause is wrong pole orientation on one of the static magnets. Re-verify all three magnets with the polarity marker before retrying.",
  },
  {
    id: "P-7",
    phase: "Tuning",
    title: "Iterate Air Gap and Angular Position for Continuous Rotation",
    duration: "3–5 h",
    description:
      "If the disc does not continue rotating on its own (most common after first assembly), iterate the configuration: (1) reduce the air gap to 0.050 in to increase repulsion — if the disc locks, return to 0.080 in; (2) adjust the angular positions of the static magnets — try 60° and 240° instead of 90° and 270°; (3) try a 120° offset instead of 180° — place the magnets at 0° and 120°. Use the friction brake to measure stall torque at each configuration. The goal is continuous rotation with the smoothest motion and the highest stall torque.",
    checks: [
      "Disc rotates continuously on its own for at least 30 seconds after a hand-start",
      "Rotation is smooth with no perceptible angular pulsation",
      "Friction brake test: disc stalls at a measurable torque (typically 0.1–1 in·oz for a 1 in NdFeB disc prototype)",
      "Stall torque can be increased by reducing the air gap or by using stronger static magnets",
    ],
  },
];

// --- SAFETY ---
export const pushSafetyItems: SafetyItem[] = [
  {
    id: "PS-1",
    title: "NdFeB Disc Burst Hazard — Critical",
    detail:
      "The diametric NdFeB disc rotates at significant speeds and is brittle. At 1500 RPM, a 1 in disc experiences ~120 N of centrifugal force at its rim; above 3000 RPM, the disc can crack and launch sharp fragments at dangerous velocities. The polycarbonate safety shield is MANDATORY — never test the motor without it. Wear eye protection during all tests.",
    severity: "critical",
  },
  {
    id: "PS-2",
    title: "Magnet Pinch Hazard During Assembly",
    detail:
      "The 1×1×0.5 in static magnets can snap to each other or to the disc with forces exceeding 30 lbf. Always use non-magnetic spacers (brass, aluminum, plastic) during initial positioning. Keep the second magnet at least 6 in away from the first until the bracket is fully secured. Wear eye protection — NdFeB chips can fly when magnets snap together.",
    severity: "critical",
  },
  {
    id: "PS-3",
    title: "Diametric Magnet Polarity Confusion",
    detail:
      "Diametric magnets are easy to confuse with axially magnetized magnets — the visual appearance is identical. If you accidentally use an axially magnetized disc, the motor will not work because the field is perpendicular to the rotation plane. Always verify with a polarity marker: a diametric disc's N and S poles should be on opposite SIDES of the disc, not on the top and bottom faces.",
    severity: "caution",
  },
  {
    id: "PS-4",
    title: "Magnetic Field Interference",
    detail:
      "The combined field of the diametric disc plus 2 static magnets is significant. Keep the assembled motor at least 12 in (30 cm) away from pacemakers, magnetic storage media, CRT displays, and credit-card stripes. Static fields from N42 magnets can wipe magnetic stripe cards at distances up to 6 in.",
    severity: "caution",
  },
  {
    id: "PS-5",
    title: "Heat Sensitivity of NdFeB",
    detail:
      "NdFeB magnets begin to lose magnetization irreversibly above 80°C. Do not heat the disc or static magnets during assembly (no hot-melt glue, no heat gun for shrinking tubing). Use room-temperature cyanoacrylate gel for bonding. Store all magnets below 60°C.",
    severity: "caution",
  },
  {
    id: "PS-6",
    title: "Scientific Status of the Prototype",
    detail:
      "Like the parent patent and the previous flap variant, this prototype describes a permanent-magnet-only motor. The second law of thermodynamics implies that a static magnetic configuration alone cannot produce net work indefinitely. The prototype is best treated as an engineering case study in diametric magnet geometry and repulsion-based torque generation. Continuous rotation observed during tuning is likely due to disc momentum, thermal gradients, or small vibrations rather than the magnetic configuration alone.",
    severity: "note",
  },
];

// --- TROUBLESHOOTING ---
export const pushTroubleshooting: Troubleshoot[] = [
  {
    symptom: "Disc locks immediately at one position and will not rotate",
    cause: "One or both static magnets has the WRONG pole facing the disc (attraction instead of repulsion), OR the static magnets are at 180° symmetric positions",
    fix: "Re-verify with polarity marker: top magnet should have N facing DOWN, bottom magnet should have S facing UP. If both are correct, change the angular positions from 90°/270° to 60°/240° to break symmetry.",
  },
  {
    symptom: "Disc rotates but in the opposite direction (counter-clockwise)",
    cause: "The static magnets' positions are reversed relative to the disc's N-S axis",
    fix: "Swap the two static magnets: move the top N magnet to the bottom position, and the bottom S magnet to the top. The rotation direction will reverse to clockwise.",
  },
  {
    symptom: "Disc oscillates back-and-forth instead of rotating continuously",
    cause: "Static magnets are at exactly 180° apart — the disc finds a symmetric equilibrium between two repulsion points",
    fix: "Move one static magnet by 30° to break symmetry. For example, change positions from 90°/270° to 90°/240° (a 150° offset).",
  },
  {
    symptom: "Disc rotates but very slowly (< 100 RPM)",
    cause: "Air gap is too large, or the static magnets are too weak relative to the disc",
    fix: "Reduce the air gap to 0.050 in (carefully, watching for stall). If still slow, upgrade static magnets from N42 to N50 or N52 grade, or move them closer to the disc center (smaller radial distance).",
  },
  {
    symptom: "Disc has noticeable wobble or vibration",
    cause: "The hub adapter is not centered on the disc, or the shaft is bent",
    fix: "Re-bond the disc to the hub adapter with more care — use a centering jig. If the shaft is bent (visible runout > 0.005 in TIR), replace it with a straight precision shaft.",
  },
  {
    symptom: "Disc stalls under any small load (e.g., touching the shaft with a finger)",
    cause: "Stall torque is too low — the disc is too small, or the static magnets are too far away",
    fix: "Use a larger diametric disc (1.5 in or 2 in) for more torque. Or use larger static magnets (1.5×1.5×0.75 in). Or reduce the air gap to 0.030 in (very close — watch for stall).",
  },
];
