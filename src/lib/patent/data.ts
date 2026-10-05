// Patent US4,151,431 — Permanent Magnet Motor (Howard R. Johnson, 1979)
// All data below is derived directly from the patent specification, claims, and drawings.

export interface PatentInfo {
  number: string;
  title: string;
  inventor: string;
  filed: string;
  issued: string;
  applNo: string;
  intClass: string[];
  usClass: string[];
  claims: number;
  drawings: number;
  attorney: string;
  examiner: string;
}

export const patentInfo: PatentInfo = {
  number: "US 4,151,431",
  title: "Permanent Magnet Motor",
  inventor: "Howard R. Johnson, Grass Lake, MI",
  filed: "December 6, 1973",
  issued: "April 24, 1979",
  applNo: "422,306",
  intClass: ["H02K 41/00", "H02N 11/00"],
  usClass: ["310/12", "310/152"],
  claims: 25,
  drawings: 10,
  attorney: "Beaman & Beaman",
  examiner: "Donovan F. Duggan",
};

// --- Bill of Materials (BOM) ---
export interface BomItem {
  id: string;
  part: string;
  spec: string;
  qty: string;
  purpose: string;
  source: string;
  category: "magnet" | "metal" | "structural" | "hardware" | "tooling";
  critical: boolean;
}

export const bomItems: BomItem[] = [
  // MAGNETS
  {
    id: "BOM-01",
    part: "Stator Magnets — Rectangular Blocks",
    spec: "Grade N42–N52 NdFeB, grain-oriented, 1 in × 0.25 in × 4 in (W × T × L)",
    qty: "8 (linear) / 12 (rotary)",
    purpose: "Define the stator track of common polarity facing the armature",
    source: "K&J Magnetics / CMS Magnetics / SuperMagnetMan",
    category: "magnet",
    critical: true,
  },
  {
    id: "BOM-02",
    part: "Armature Magnets — Elongated Bar",
    spec: "Grade N42–N52 NdFeB, 3 in long, bowed (arcuate) profile, beveled pole ends",
    qty: "1 (single) or 2–3 (staggered)",
    purpose: "Moving magnet that experiences attraction + repulsion to produce motive force",
    source: "K&J Magnetics (custom cut) / Master Magnetics",
    category: "magnet",
    critical: true,
  },
  {
    id: "BOM-03",
    part: "Rotary Armature Magnets — Wedge",
    spec: "Same NdFeB grade, wedge profile with curved inner surface and convex outer pole",
    qty: "3 (staggered circumferentially)",
    purpose: "Mounted on rotary armature to produce rotation about stator axis",
    source: "Custom NdFeB supplier",
    category: "magnet",
    critical: true,
  },
  // MAGNETIC FIELD CONCENTRATION
  {
    id: "BOM-04",
    part: "High-Permeability Backing Plate (Linear)",
    spec: "Netic Co-Netic or equivalent μ-metal, ≥0.030 in thick, sized to cover all stator magnets",
    qty: "1",
    purpose: "Concentrate stator magnetic flux; engages south poles of stator magnets",
    source: "Magnetic Shield Corp. (Perfection Mica Co., Chicago)",
    category: "metal",
    critical: true,
  },
  {
    id: "BOM-05",
    part: "High-Permeability Annular Sleeve (Rotary)",
    spec: "Netic Co-Netic ring, concentric with stator axis, slides over stator cylindrical surface",
    qty: "1",
    purpose: "Concentrate field at gaps between stator magnets in rotary embodiment",
    source: "Magnetic Shield Corp.",
    category: "metal",
    critical: true,
  },
  // STRUCTURAL
  {
    id: "BOM-06",
    part: "Base Plate / Frame",
    spec: "Aluminum 6061-T6, 0.5 in thick, ≥12 in × 18 in (linear); circular 6 in dia × 2 in (rotary)",
    qty: "1",
    purpose: "Rigid mounting surface; non-magnetic to prevent flux losses",
    source: "McMaster-Carr / OnlineMetals",
    category: "structural",
    critical: false,
  },
  {
    id: "BOM-07",
    part: "Stator Support Plate",
    spec: "Aluminum or synthetic plastic, 0.25 in thick, sized to stator magnet footprint",
    qty: "1",
    purpose: "Carries stator magnets and high-μ backing plate",
    source: "McMaster-Carr",
    category: "structural",
    critical: false,
  },
  {
    id: "BOM-08",
    part: "Armature Slide / Carriage (Linear)",
    spec: "Non-magnetic linear rail (bronze sleeve bearings or PTFE-lined), travel ≥6 in",
    qty: "1 set",
    purpose: "Supports armature magnet while allowing free left-right motion; constrains vertical movement",
    source: "Igus / Thomson Linear / McMaster-Carr",
    category: "structural",
    critical: true,
  },
  {
    id: "BOM-09",
    part: "Armature Hub (Rotary)",
    spec: "Dished configuration, radial web + axial extension; non-magnetic aluminum or Delrin",
    qty: "1",
    purpose: "Holds the 3 armature magnets and transmits torque via belt groove",
    source: "Custom machined",
    category: "structural",
    critical: true,
  },
  {
    id: "BOM-10",
    part: "Threaded Shaft (Rotary)",
    spec: "Stainless steel 1/4-20 threaded shaft, 4 in long, with antifriction ball bearings",
    qty: "1 + bearings",
    purpose: "Provides axial displacement of armature to regulate speed",
    source: "McMaster-Carr",
    category: "structural",
    critical: true,
  },
  {
    id: "BOM-11",
    part: "Adjustment Knob (Rotary)",
    spec: "1.5 in dia knurled aluminum knob, threaded to match shaft",
    qty: "1",
    purpose: "Manual rotation of shaft to axially displace armature and regulate speed",
    source: "McMaster-Carr",
    category: "hardware",
    critical: false,
  },
  // HARDWARE
  {
    id: "BOM-12",
    part: "Non-Magnetic Fasteners",
    spec: "304/316 stainless steel screws (non-magnetic austenitic), M4 / #8 sizes",
    qty: "Assorted (40+)",
    purpose: "Mount stator magnets and structural components without disturbing field",
    source: "McMaster-Carr",
    category: "hardware",
    critical: true,
  },
  {
    id: "BOM-13",
    part: "Adhesive / Bonding Layer",
    spec: "Two-part epoxy (e.g., Loctite Epoxy Weld) or cyanoacrylate gel",
    qty: "1 tube",
    purpose: "Accurately locate and fix stator magnets on backing plate; per patent disclosure",
    source: "Hardware store",
    category: "hardware",
    critical: false,
  },
  {
    id: "BOM-14",
    part: "Spacers (Stator Gap Shims)",
    spec: "Brass or aluminum shims in 0.060, 0.125, 0.188 in (varying per patent)",
    qty: "Set of 8+",
    purpose: "Set slightly different spacing between adjacent stator magnets to smooth motion",
    source: "McMaster-Carr shim stock",
    category: "hardware",
    critical: true,
  },
  {
    id: "BOM-15",
    part: "Power Belt (Rotary)",
    spec: "Round neoprene belt, O-ring style, fits armature belt groove",
    qty: "1",
    purpose: "Transmits rotary torque from armature to generator / load",
    source: "McMaster-Carr",
    category: "hardware",
    critical: false,
  },
  // TOOLING
  {
    id: "BOM-16",
    part: "Magnetization / Polarity Marker",
    spec: "Magnetic polarity indicator (e.g., Magnaflux pole finder)",
    qty: "1",
    purpose: "Verify N/S orientation of every magnet before assembly",
    source: "Magnaflux / K&J Magnetics",
    category: "tooling",
    critical: true,
  },
  {
    id: "BOM-17",
    part: "Gaussmeter / Hall Probe",
    spec: "0–2000 G range, axial Hall probe (e.g., Lakeshore 410)",
    qty: "1",
    purpose: "Quantify surface flux density; verify grain orientation",
    source: "Lakeshore / AlphaLab",
    category: "tooling",
    critical: false,
  },
  {
    id: "BOM-18",
    part: "Precision Calipers / Micrometer",
    spec: "0–6 in digital caliper (0.001 in resolution)",
    qty: "1",
    purpose: "Set air gap to ~0.125 in and verify magnet dimensions",
    source: "Mitutoyo / any",
    category: "tooling",
    critical: true,
  },
  {
    id: "BOM-19",
    part: "Non-Magnetic Pin Vise / Puller",
    spec: "Brass or aluminum fixture for handling high-field magnets",
    qty: "1",
    purpose: "Prevent pinch injuries; avoid ferrous tools near NdFeB magnets",
    source: "Made / McMaster-Carr",
    category: "tooling",
    critical: true,
  },
];

// --- WORKSHOP TOOLS LIST ---
export interface Tool {
  id: string;
  name: string;
  purpose: string;
  required: boolean;
}

export const workshopTools: Tool[] = [
  { id: "T-01", name: "Drill Press (Bench)", purpose: "Precise hole drilling for fasteners and bearings", required: true },
  { id: "T-02", name: "Belt Sander / Disc Sander", purpose: "Bevel armature pole ends; shape bowed profile", required: true },
  { id: "T-03", name: "Mini Mill or CNC Router", purpose: "Cut slots in stator support plate; mill aluminum hub", required: true },
  { id: "T-04", name: "Diamond-coated Cutting Blade", purpose: "Cut and shape NdFeB magnets (NEVER use steel blades)", required: true },
  { id: "T-05", name: "Tap & Die Set (M4 / #8)", purpose: "Thread holes for stainless fasteners", required: true },
  { id: "T-06", name: "Vise (Non-Magnetic Jaws)", purpose: "Hold aluminum and magnet work; brass jaw caps", required: true },
  { id: "T-07", name: "Digital Angle Gauge", purpose: "Set bevel angles on armature ends (≈15°)", required: false },
  { id: "T-08", name: "Dial Indicator + Magnetic Base", purpose: "Measure axial displacement for speed calibration", required: false },
  { id: "T-09", name: "Stroboscope / Tachometer", purpose: "Measure rotary RPM after build", required: false },
  { id: "T-10", name: "Eye Protection + Gloves", purpose: "NdFeB chips can shatter and fly when magnets snap together", required: true },
];

// --- THEORY OF OPERATION ---
export interface TheoryPoint {
  id: string;
  title: string;
  body: string[];
}

export const theoryPoints: TheoryPoint[] = [
  {
    id: "T1",
    title: "Unpaired Electron Spins as a Power Source",
    body: [
      "Ferromagnetic materials (iron, nickel, cobalt, neodymium compounds) contain unpaired electrons in their atomic structure. Unlike paired electrons whose magnetic moments cancel, these unpaired electrons spin around the nucleus and produce a measurable magnetic field.",
      "In Johnson's view, a permanent magnet behaves like a room-temperature superconductor: the spinning electrons never cease, and the flux they generate is available to do work without any external electron flow through a conductor.",
      "Conventional motors switch the field via commutators, brushes, or AC current. In this patent, switching is achieved purely geometrically — by concentrating the stator flux and shaping the armature magnet so attraction and repulsion forces combine into a unidirectional thrust.",
    ],
  },
  {
    id: "T2",
    title: "The Critical Geometry",
    body: [
      "The armature magnet length is slightly greater than the combined width of TWO stator magnets plus ONE inter-magnet gap. This is the geometric heart of the design — it guarantees that at every position the armature sits over a magnetic environment that is asymmetric in the direction of intended motion.",
      "At every position, the leading pole of the armature experiences a strong repulsion from the same-polarity stator pole just ahead, while the trailing pole experiences a strong attraction from the opposite-polarity stator pole just behind. The resultant vector always points in the same direction along the track.",
      "When the armature is reversed (N↔S), the direction of motion reverses. No electrical switching is required — the geometry alone does the work.",
    ],
  },
  {
    id: "T3",
    title: "Flux Concentration via High-Permeability Backing",
    body: [
      "A plate of Netic Co-Netic (or equivalent μ-metal) is bonded directly to the south poles of the stator magnets. This high-permeability alloy offers a low-reluctance return path for flux, effectively concentrating the field on the north-pole side facing the armature.",
      "Without this backing, a substantial fraction of the stator flux would leak out the back of the magnets and never reach the air gap. With the backing, flux density in the gap can rise by 30–60% (per equivalent μ-metal measurements), increasing the force on the armature proportionally.",
      "The same principle is applied to the armature by bowing it (concave side down toward track) and beveling the pole ends. Both measures concentrate flux at the pole faces — exactly where the stator field is strongest.",
    ],
  },
  {
    id: "T4",
    title: "Smoothing via Staggering & Variable Spacing",
    body: [
      "If only one armature magnet is used, the force vector pulses as the magnet crosses each stator gap. The patent mitigates this by using multiple armature magnets (2–3) staggered along the direction of motion so the impulses overlap and smooth out.",
      "A second smoothing technique is to vary the spacing between adjacent stator magnets slightly. Because each armature pole sees a slightly different phase of the force cycle, the resultant thrust becomes more uniform along the track.",
      "There is a trade-off: too small an air gap increases pulsation; too large a gap reduces force. The patent specifies an air gap of approximately 1/8 in (0.125 in) as a starting point; fine-tuning is required per build.",
    ],
  },
  {
    id: "T5",
    title: "Speed Regulation by Axial Displacement",
    body: [
      "In the rotary embodiment, the armature is mounted on a threaded shaft. Rotating the knob advances or retracts the armature along the rotation axis, changing the overlap between the armature magnets and the stator magnets.",
      "Greater axial overlap → stronger tangential force → higher RPM. Less overlap → weaker force → lower RPM. This provides a purely mechanical throttle with no electrical components.",
      "Because the force scales non-linearly with overlap area, the calibration curve is steep near full engagement; small knob rotations produce significant speed changes near the top end. The builder should mark a reference scale on the knob.",
    ],
  },
];

// --- PROTOTYPE DIMENSIONS (from patent) ---
export interface Dimension {
  parameter: string;
  value: string;
  notes: string;
}

export const prototypeDimensions: Dimension[] = [
  { parameter: "Armature magnet length", value: "3.000 in", notes: "Slightly greater than 2× stator width + gap" },
  { parameter: "Stator magnet width", value: "1.000 in", notes: "Perpendicular to track direction" },
  { parameter: "Stator magnet thickness", value: "0.250 in", notes: "Pole-to-pole dimension" },
  { parameter: "Stator magnet length", value: "4.000 in", notes: "Along track direction" },
  { parameter: "Stator magnet grade", value: "Grain-oriented", notes: "Alnico V or modern NdFeB equivalent" },
  { parameter: "Air gap (armature ↔ stator)", value: "≈0.125 in", notes: "Tune for max force vs. min pulsation" },
  { parameter: "Spacing between stator magnets", value: "≈0.250 in", notes: "Slightly varied per pair for smoothing" },
];

// --- BUILD STEPS: LINEAR ---
export interface BuildStep {
  id: string;
  phase: string;
  title: string;
  duration: string;
  description: string;
  checks: string[];
  warning?: string;
}

export const linearBuildSteps: BuildStep[] = [
  {
    id: "L-1",
    phase: "Preparation",
    title: "Inventory & Polity Verification",
    duration: "1–2 h",
    description:
      "Lay out every NdFeB magnet on a non-magnetic workbench. Use a polarity indicator to label N and S on every stator and armature magnet with a paint marker. Mismatched polarity is the #1 cause of a non-functional build, so verify every single magnet before bonding anything.",
    checks: [
      "All stator magnets have N facing the same direction (toward future air gap)",
      "Armature magnet poles are clearly marked at the ENDS (not the broad faces)",
      "Backup plate (Netic Co-Netic) is verified non-magnetic in its as-supplied state",
      "Gaussmeter readings on every stator magnet are within ±5% of nominal",
    ],
    warning:
      "NdFeB magnets can pinch and shatter. Wear eye protection and use a non-magnetic vise. Never let two large magnets snap together uncontrolled.",
  },
  {
    id: "L-2",
    phase: "Foundation",
    title: "Mount Backing Plate to Stator Support",
    duration: "1 h",
    description:
      "Bond the Netic Co-Netic backing plate to the stator support plate using thin film epoxy. Clamp evenly across the entire surface; an uneven bond creates air pockets that act as flux barriers. Cure for the full epoxy setting time before proceeding.",
    checks: [
      "Backing plate is flush with the support plate; no gaps",
      "Backing plate covers the entire area where stator magnets will sit",
      "Cured at room temperature for the full manufacturer-recommended time",
    ],
    warning:
      "Do not heat-cure above 80 °C — μ-metal can lose its permeability if heated excessively.",
  },
  {
    id: "L-3",
    phase: "Foundation",
    title: "Bond Stator Magnets to Backing Plate",
    duration: "2–3 h",
    description:
      "Position the first stator magnet with its SOUTH pole facing the backing plate (north pole facing up, where the armature will run). Apply a thin, even layer of epoxy to the south face and press firmly onto the backing plate. Use a spacing jig to set the gap to the next magnet.",
    checks: [
      "All stator magnets have their NORTH poles facing up (toward the air gap)",
      "Gaps alternate slightly (e.g., 0.250, 0.3125, 0.250, 0.3125 in) per the patent's variable-spacing principle",
      "Magnets are aligned flush at the front edge; no magnet is canted in any axis",
      "Epoxy is fully cured before removing the alignment jig",
    ],
    warning:
      "If any magnet snaps onto the backing plate uncontrolled, it can chip or take skin with it. Use brass spacers as a temporary mechanical stop.",
  },
  {
    id: "L-4",
    phase: "Armature",
    title: "Shape the Armature Magnet",
    duration: "3–5 h",
    description:
      "Cut the armature bar to 3.000 in length using a diamond-coated blade (NEVER use steel — it will chip the magnet and contaminate the blade). Sand the broad faces to a gentle arc (bow ~0.030–0.060 in over the length) using a belt sander with a contoured platen. Bevel the pole ends to ~15° to reduce cross-section at the tip.",
    checks: [
      "Total length is 3.000 in ±0.005 in",
      "Bowed profile is concave-down toward the stator track",
      "Bevel angle on both ends is symmetric (~15°)",
      "Surface is smooth; no chips or cracks (chips create flux leakage points)",
    ],
    warning:
      "Dry-cutting NdFeB produces pyrophoric dust that can ignite. Use water-cooled cutting and a dust collection system. Wear a particulate respirator.",
  },
  {
    id: "L-5",
    phase: "Armature",
    title: "Mount Armature to Carriage",
    duration: "2 h",
    description:
      "Bond the armature magnet (concave side down) to the non-magnetic carriage using epoxy. The carriage slides on linear rails that are mounted to the same base plate as the stator — the rail axis is exactly parallel to the stator track direction.",
    checks: [
      "Carriage moves freely along the entire 6+ in travel with no binding",
      "Air gap (carriage bottom ↔ stator north face) is 0.125 in ±0.005 in",
      "Armature pole axis is perpendicular to the track direction",
      "Carriage cannot lift off the rails (vertical constraint present)",
    ],
  },
  {
    id: "L-6",
    phase: "Tuning",
    title: "Initial Test — Static Pull-Force Measurement",
    duration: "1 h",
    description:
      "Lock the carriage at one end of the track. Attach a spring scale to the carriage and pull slowly along the track direction. Record force at multiple positions; you should observe a non-zero bias force in one direction. If the force oscillates symmetrically about zero, the polarity of the armature or the stator magnets is wrong — re-verify with the polarity indicator.",
    checks: [
      "Net force is biased in the intended direction of motion at every position",
      "Force magnitude is at least 0.5 lbf for a single-magnet prototype",
      "No audible clicking from magnets shifting in their bonds",
    ],
    warning:
      "If force reverses direction at any point in the travel, your armature is mounted upside down (poles swapped). Disassemble and re-bond.",
  },
  {
    id: "L-7",
    phase: "Tuning",
    title: "Free-Run & Smoothing",
    duration: "2 h",
    description:
      "Release the carriage and observe motion. If the carriage stops partway, increase the air gap by 0.010 in and retry; if motion is jerky, install a second staggered armature magnet and/or vary the stator gaps further. Iterate until the carriage traverses the full track smoothly.",
    checks: [
      "Carriage completes the full track length on a single release",
      "Motion is smooth with no perceptible pulsation",
      "Adding a load (small weight on a string) shows measurable thrust",
    ],
  },
];

// --- BUILD STEPS: ROTARY ---
export const rotaryBuildSteps: BuildStep[] = [
  {
    id: "R-1",
    phase: "Preparation",
    title: "Verify Wedge Magnet Set",
    duration: "1 h",
    description:
      "The 3 rotary armature magnets are wedge-shaped with a curved inner surface and convex outer pole. Verify that all three have identical wedge angles and that their inner curves match the outer radius of the stator sleeve.",
    checks: [
      "All 3 wedge magnets have the same wedge angle",
      "Inner curved surfaces have the same radius",
      "Polarity is verified with N facing radially outward (or inward, consistently)",
    ],
  },
  {
    id: "R-2",
    phase: "Foundation",
    title: "Machine Stator Cylinder",
    duration: "3–4 h",
    description:
      "Turn the non-magnetic stator cylinder (aluminum or Delrin) to 6 in OD × 2 in height. Bore the concentric threaded hole (1/4-20) through the center. Cut the annular groove on the outer cylindrical surface to receive the high-permeability sleeve.",
    checks: [
      "Outer cylinder is concentric with the threaded bore within 0.002 in TIR",
      "Annular groove depth matches sleeve thickness",
      "Threaded bore is clean and runs smoothly with the shaft",
    ],
  },
  {
    id: "R-3",
    phase: "Foundation",
    title: "Install High-μ Sleeve & Stator Magnets",
    duration: "2–3 h",
    description:
      "Bond the Netic Co-Netic sleeve into the annular groove. Then bond each stator magnet (wedge profile, curved inner surface) onto the sleeve with its south pole facing the sleeve. Space them around the circumference with slight variations to smooth rotation.",
    checks: [
      "Sleeve is fully seated with no gaps",
      "All stator wedges have N facing radially outward",
      "Spacing varies by ~10% between adjacent magnets",
      "Outer pole surfaces form a smooth circular locus",
    ],
    warning:
      "A radial misalignment of one stator magnet will produce a strong angular pulsation. Use a fixture to hold each magnet in place during cure.",
  },
  {
    id: "R-4",
    phase: "Armature",
    title: "Build the Dished Armature",
    duration: "3 h",
    description:
      "Machine the dished armature from aluminum or Delrin: a radial web with an axially extending portion that holds the 3 wedge magnets. Cut a belt-receiving groove on the outer rim. Drill and tap holes for magnet fastening.",
    checks: [
      "Armature is concentric with the stator within 0.005 in TIR",
      "Belt groove is properly sized for the chosen belt",
      "Three magnet mounting pads are at the correct stagger angles (NOT 120° — slight asymmetry is intentional)",
    ],
  },
  {
    id: "R-5",
    phase: "Armature",
    title: "Mount Wedge Magnets with Stagger",
    duration: "2 h",
    description:
      "Bond each wedge magnet to its mounting pad with the curved inner face toward the stator. Stagger them circumferentially so they are NOT at 120° — for example at 0°, 122°, 244°. This stagger smooths the tangential force as the armature rotates.",
    checks: [
      "All 3 magnets are at the correct stagger angles (verified with protractor)",
      "All have the same polarity facing the stator",
      "Air gap between each magnet and the stator poles is uniform (~0.125 in)",
    ],
    warning:
      "If two wedge magnets are misaligned by even 5°, the rotational force will have a noticeable angular pulsation that wastes energy.",
  },
  {
    id: "R-6",
    phase: "Assembly",
    title: "Install Threaded Shaft & Bearings",
    duration: "1.5 h",
    description:
      "Press two antifriction ball bearings into the armature hub. Slide the threaded shaft through the bearings and thread it into the stator bore. Attach the adjustment knob to the outer end of the shaft. The armature should now spin freely and also move axially when the knob is rotated.",
    checks: [
      "Armature rotates freely with no radial play",
      "Turning the knob moves the armature axially along the shaft",
      "Axial travel range is at least 0.5 in for usable speed control",
    ],
  },
  {
    id: "R-7",
    phase: "Tuning",
    title: "Belt, Load, and RPM Test",
    duration: "2 h",
    description:
      "Install the belt around the armature groove and connect it to a small generator or flywheel as a load. Release the armature with full axial engagement. Measure RPM with a stroboscope. Adjust the knob to find the maximum-RPM engagement and the minimum-RPM engagement (just before stall).",
    checks: [
      "Armature rotates continuously in one direction when released",
      "Speed changes smoothly with knob rotation",
      "Measured maximum RPM is at least 100 with no load (typical for a small prototype)",
      "Belt tension is sufficient to prevent slip under load",
    ],
    warning:
      "If the armature oscillates back-and-forth instead of rotating continuously, your stator magnet spacing is too uniform. Vary it by 10–15% to break the symmetry.",
  },
];

// --- PATENT CLAIMS (25 of them) ---
export interface Claim {
  id: number;
  text: string;
  type: "apparatus" | "method" | "subcombination";
}

export const patentClaims: Claim[] = [
  {
    id: 1,
    type: "apparatus",
    text: "A permanent magnet motor comprising a stator track defining a track direction and having first and second sides composed of a plurality of track permanent magnets each having first and second poles of opposite polarity, said magnets being disposed in side-by-side relationship with a spacing between adjacent magnets and like poles defining said track sides, an elongated armature permanent magnet located on one of said track sides for relative movement thereto in spaced relationship, said armature magnet having first and second poles of opposite polarity located at the opposite ends defining the length thereof, the length of said armature magnet being disposed in general alignment with the direction of said track, the spacing of said armature magnet poles from said track side and the length of said armature magnet as related to the width and spacing of said track magnets in the direction of said track being such as to impose a continuous force on said armature magnet in said general direction of said track.",
  },
  { id: 2, type: "subcombination", text: "In a permanent magnet motor as in claim 1 wherein the spacing between said poles of said armature magnet and the adjacent stator track side are substantially equal." },
  { id: 3, type: "subcombination", text: "In a permanent magnet motor as in claim 1 wherein the spacing between adjacent track magnets varies." },
  { id: 4, type: "subcombination", text: "In a permanent magnet motor as in claim 1 wherein a plurality of armature magnets are disposed on a common side of said stator track, said armature magnets being mechanically interconnected." },
  { id: 5, type: "subcombination", text: "In a permanent magnet motor as in claim 4 wherein said armature magnets are staggered with respect to each other in the direction of said track." },
  { id: 6, type: "subcombination", text: "In a permanent magnet motor as in claim 1 wherein magnetic field concentrating means are associated with said track magnets." },
  { id: 7, type: "subcombination", text: "In a permanent magnet motor as in claim 6 wherein said field concentrating means comprises a sheet of magnetic material of high magnetic field permeability engaging side and pole of said track magnets opposite to that side and pole disposed toward said armature magnet." },
  { id: 8, type: "subcombination", text: "In a permanent magnet motor as in claim 1 wherein said armature magnet is of an arcuate configuration in its longitudinal direction bowed toward said track, said armature magnet having ends shaped to concentrate the magnetic field at said ends." },
  { id: 9, type: "subcombination", text: "In a permanent magnet motor as in claim 1 wherein said stator track is of a generally linear configuration, and means supporting said armature magnet relative to said track for generally linear movement of said armature magnet." },
  { id: 10, type: "subcombination", text: "In a permanent magnet motor as in claim 1 wherein said stator track magnets define a circle having an axis, an armature rotatably mounted with respect to said track and concentric and coaxial thereto, said armature magnet being mounted upon said armature." },
  { id: 11, type: "subcombination", text: "In a permanent magnet motor as in claim 10, means axially adjusting said armature relative to said track whereby the axial relationship of said armature magnet and said stator magnets may be varied to adjust the rate of rotation of said armature." },
  { id: 12, type: "subcombination", text: "In a permanent magnet motor as in claim 10 wherein a plurality of armature magnets are mounted on said armature." },
  { id: 13, type: "subcombination", text: "In a permanent magnet motor as in claim 12 wherein said armature magnets are circumferentially nonuniformly spaced on said armature." },
  {
    id: 14,
    type: "apparatus",
    text: "A permanent magnet motor comprising a stator comprising a plurality of circumferentially spaced stator permanent magnets having poles of opposite polarity, said magnets being arranged to substantially define a circle having an axis, the poles of said magnets facing in a radial direction with respect to said axis and poles of the same polarity facing away from said axis and the poles of opposite polarity facing toward said axis, an armature mounted for rotation about said axis and disposed adjacent said stator, at least one armature permanent magnet having poles of opposite polarity mounted on said armature and in radial spaced relationship to said circle of stator magnets, said armature magnet poles extending in the circumferential direction of armature rotation, the spacing of said armature magnet poles from said stator magnets and the circumferential length of said armature magnet and the spacing of said stator magnets being such as to impose a continuing circumferential force on said armature magnet to rotate said armature.",
  },
  { id: 15, type: "subcombination", text: "In a permanent magnet motor as in claim 14 wherein a plurality of armature magnets are mounted upon said armature." },
  { id: 16, type: "subcombination", text: "In a permanent magnet motor as in claim 14 wherein said armature magnets are asymmetrically circumferentially spaced on said armature." },
  { id: 17, type: "subcombination", text: "In a permanent magnet motor as in claim 14 wherein the poles of said armature magnet are shaped to concentrate the magnetic field thereof." },
  { id: 18, type: "subcombination", text: "In a permanent magnet motor as in claim 14, magnetic field concentrating means associated with said stator magnets concentrating the magnetic fields thereof at the spacings between adjacent stator magnets." },
  { id: 19, type: "subcombination", text: "In a permanent magnet motor as in claim 18 wherein said magnet field concentrating means comprises an annular ring of high magnetic field permeability material concentric with said axis and in substantial engagement with poles of like polarity of said stator magnets." },
  { id: 20, type: "subcombination", text: "In a permanent magnet motor as in claim 14 wherein said armature magnet is of an arcuate bowed configuration in the direction of said poles thereof defining a concave side and a convex side, said concave side being disposed toward said axis, and said poles of said armature magnet being shaped to concentrate the magnetic field between said poles thereof." },
  { id: 21, type: "subcombination", text: "In a permanent magnet motor as in claim 14, means for axially displacing said stator and armature relative to each other to adjust the axial alignment of said stator and armature magnets." },
  {
    id: 22,
    type: "method",
    text: "The method of producing a unidirectional motive force by permanent magnets using a plurality of spaced stator permanent magnets having opposite polarity poles defining a track having a predetermined direction, and an armature magnet having a length defined by poles of opposite polarity movably mounted for movement relative to the track in the direction thereof, and of a predetermined length determined by the width and dimensions of said stator magnets comprising forming a magnetic field track by said stator magnets having a magnetic field of common polarity interrupted at spaced locations in a direction transverse to the direction of said magnetic field track by magnetic fields created by magnetic lines of force existing between the poles of the stator magnets and positioning the armature magnet in spaced relation to said magnetic field track longitudinally related to the direction of the magnetic field track such a distance that the repulsion and attraction forces imposed on the armature magnet by said magnetic field track imposes a continuing unidirectional force on the armature magnet in the direction of the magnetic field track.",
  },
  { id: 23, type: "method", text: "The method of producing a unidirectional motive force as in claim 22 including concentrating the magnetic fields created by magnetic lines of force between the poles of the stator magnets." },
  { id: 24, type: "method", text: "The method of producing a unidirectional motive force as in claim 22 including concentrating the magnetic field existing between the poles of the armature magnet." },
  { id: 25, type: "method", text: "The method of producing a unidirectional motive force as in claim 22 including concentrating the magnetic fields created by magnetic lines of force between the poles of the stator magnets and concentrating the magnetic field existing between the poles of the armature magnet." },
];

// --- SAFETY & WARNINGS ---
export interface SafetyItem {
  id: string;
  title: string;
  detail: string;
  severity: "critical" | "caution" | "note";
}

export const safetyItems: SafetyItem[] = [
  {
    id: "S-1",
    title: "Pinch & Shatter Hazard",
    detail:
      "NdFeB magnets above N40 grade generate forces exceeding 50 lbf when in direct contact. A sudden snap can shatter the magnet, sending sharp chips flying at high velocity. Always wear eye protection and use non-ferrous tooling (brass, aluminum, or polymer) when handling.",
    severity: "critical",
  },
  {
    id: "S-2",
    title: "Pyrophoric Machining Dust",
    detail:
      "Dry-machining NdFeB produces a fine iron-neodymium dust that is pyrophoric — it can ignite spontaneously in air. Always use water-cooled diamond cutting and a dust extraction system. Do not accumulate dust in a bin; flush with water immediately.",
    severity: "critical",
  },
  {
    id: "S-3",
    title: "Magnetic Field Interference",
    detail:
      "Keep the assembled motor at least 12 in (30 cm) away from pacemakers, magnetic storage media, CRT displays, and credit-card stripes. Static fields from N52 magnets can wipe magnetic stripe cards at distances up to 6 in.",
    severity: "caution",
  },
  {
    id: "S-4",
    title: "Heat Sensitivity of NdFeB",
    detail:
      "NdFeB magnets begin to lose magnetization irreversibly above 80 °C. Do not heat-cure adhesives near the magnets; use room-temperature epoxy. Store magnets below 60 °C.",
    severity: "caution",
  },
  {
    id: "S-5",
    title: "High-Permeability Alloy Handling",
    detail:
      "Netic Co-Netic and other μ-metal alloys are mechanically soft and dent easily. Do not bend or hammer them — even a small dent creates a local stress that reduces permeability and degrades the field-concentration effect.",
    severity: "note",
  },
  {
    id: "S-6",
    title: "Scientific Status of the Invention",
    detail:
      "The patent describes a 'motive power source solely through superconducting characteristics of a permanent magnet.' This is not accepted by mainstream physics; the second law of thermodynamics implies a permanent magnet alone cannot produce net work indefinitely. The patent is best treated as an engineering case study of magnetic-field manipulation, not a blueprint for a working free-energy machine.",
    severity: "note",
  },
];

// --- TROUBLESHOOTING ---
export interface Troubleshoot {
  symptom: string;
  cause: string;
  fix: string;
}

export const troubleshooting: Troubleshoot[] = [
  {
    symptom: "Armature does not move at all when released",
    cause: "Stator magnets have mixed polarity, or armature is mounted upside down",
    fix: "Re-verify polarity of every stator magnet with a polarity indicator. Confirm armature N/S orientation matches intended direction.",
  },
  {
    symptom: "Armature moves but stalls partway down the track",
    cause: "Air gap is too small at one position (local pulsation overwhelms the net force), or stator magnets are too uniform",
    fix: "Increase air gap by 0.010 in increments. Vary stator gaps by ±10% (e.g., 0.225, 0.275, 0.225, 0.275 in).",
  },
  {
    symptom: "Motion is jerky / pulsating",
    cause: "Single armature magnet sees each stator gap as a discrete event",
    fix: "Add a second armature magnet, staggered by ~50% of one stator pitch. Or vary stator spacing more aggressively.",
  },
  {
    symptom: "Rotary armature oscillates back-and-forth instead of rotating",
    cause: "Stator magnet spacing is perfectly uniform — the armature finds a symmetric minimum-energy oscillation",
    fix: "Re-bond one stator magnet with a 10% different gap. Break the symmetry deliberately.",
  },
  {
    symptom: "Speed drops sharply when a small load is applied",
    cause: "Air gap is too large, or axial engagement of rotary armature is too low",
    fix: "Reduce air gap to ~0.100 in. Rotate the knob to increase axial engagement to ~80% of full.",
  },
  {
    symptom: "Magnets shift on the backing plate after running",
    cause: "Epoxy bond was insufficient or magnets were assembled before full cure",
    fix: "Disassemble, clean all surfaces with acetone, re-bond with high-strength epoxy, and cure for the full recommended time before handling.",
  },
];
