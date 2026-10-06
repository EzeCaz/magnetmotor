// Bilingual UI strings for the Permanent Magnet Motor build guide.
// Patent technical content (claims text, abstract) stays in English (source language).
// UI labels, section headers, navigation, and helper text are translated to Hebrew.

export type Lang = "en" | "he";

export interface UIStrings {
  // Header
  headerTitle: string;
  headerSubtitle: string;
  langToggle: string;

  // Navigation
  nav: {
    overview: string;
    theory: string;
    bom: string;
    tools: string;
    linear: string;
    rotary: string;
    simulator: string;
    safety: string;
    claims: string;
    troubleshoot: string;
  };

  // Overview section
  overview: {
    badge: string;
    titleLead: string;
    titleHighlight: string;
    titleTrail: string;
    intro: string;
    factsCard: string;
    classificationCard: string;
    intlClass: string;
    usClassLabel: string;
    inventor: string;
    filed: string;
    issued: string;
    applNo: string;
    number: string;
    claimsLabel: string;
    drawings: string;
    examiner: string;
    attorney: string;
    whatTitle: string;
    whatSubtitle: string;
    para1: string;
    para2: string;
    para3: string;
    dimensionsTitle: string;
    dimensionsSubtitle: string;
    keyInsightTitle: string;
    keyInsightP1: string;
    keyInsightP2: string;
    keyInsightP3: string;
    glanceTitle: string;
    glance1: string;
    glance2: string;
    glance3: string;
    glance4: string;
    glance5: string;
  };

  // Theory
  theory: {
    title: string;
    subtitle: string;
    diagramTitle: string;
    diagramCaption: string;
    aligned: string;
    concentrated: string;
    motive: string;
    noElectronFlow: string;
  };

  // BOM
  bom: {
    title: string;
    subtitle: string;
    progressLabel: string;
    acquisition: string;
    filters: {
      all: string;
      magnet: string;
      metal: string;
      structural: string;
      hardware: string;
      tooling: string;
    };
    searchPlaceholder: string;
    cols: {
      id: string;
      part: string;
      spec: string;
      qty: string;
      purpose: string;
      source: string;
      type: string;
    };
    showing: string;
    of: string;
    critical: string;
  };

  // Tools
  tools: {
    title: string;
    subtitle: string;
    required: string;
    optional: string;
  };

  // Build steps
  build: {
    linearTitle: string;
    linearSubtitle: string;
    rotaryTitle: string;
    rotarySubtitle: string;
    checklistProgress: string;
    checks: string;
    duration: string;
    verificationTitle: string;
    warningTitle: string;
    interactiveTitle: string;
    linearInteractDesc: string;
    rotaryInteractDesc: string;
    autoRun: string;
    pause: string;
    position: string;
    trackStart: string;
    trackEnd: string;
    alwaysOn: string;
    alwaysOnDesc: string;
    lengthRatio: string;
    lengthRatioDesc: string;
    varSpacing: string;
    varSpacingDesc: string;
    axialEngagement: string;
    low: string;
    full: string;
    spin: string;
    motionDir: string;
  };

  // Phases
  phases: {
    Preparation: string;
    Foundation: string;
    Armature: string;
    Tuning: string;
    Assembly: string;
  };

  // Simulator
  simulator: {
    title: string;
    subtitle: string;
    airGapLabel: string;
    magnetGradeLabel: string;
    forceOutputTitle: string;
    netThrust: string;
    peakPulsation: string;
    smoothness: string;
    magnetRemanence: string;
    chartTitle: string;
    chartDesc: string;
    optimizationTitle: string;
    optExcellent: string;
    optAcceptable: string;
    optHigh: string;
    forceAxis: string;
    gapAxis: string;
    legendNet: string;
    legendPulse: string;
  };

  // Safety
  safety: {
    title: string;
    subtitle: string;
    severity: {
      critical: string;
      caution: string;
      note: string;
    };
  };

  // Claims
  claims: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    type: {
      apparatus: string;
      method: string;
      subcombination: string;
    };
    independent: string;
    dependent: string;
    noResults: string;
  };

  // Troubleshooting
  troubleshoot: {
    title: string;
    subtitle: string;
    causeLabel: string;
    fixLabel: string;
  };

  // Footer
  footer: {
    patentInfo: string;
    buildInfo: string;
    disclaimerTitle: string;
    disclaimerBody: string;
    builtFor: string;
    metaLine: string;
  };
}

// English UI strings (default)
export const enStrings: UIStrings = {
  headerTitle: "Permanent Magnet Motor",
  headerSubtitle: "US 4,151,431 — Engineer's Build Guide",
  langToggle: "עברית",

  nav: {
    overview: "Overview",
    theory: "Theory",
    bom: "Materials (BOM)",
    tools: "Tools & Workshop",
    linear: "Linear Build",
    rotary: "Rotary Build",
    simulator: "Force Simulator",
    safety: "Safety",
    claims: "Patent Claims",
    troubleshoot: "Troubleshooting",
  },

  overview: {
    badge: "Patent US 4,151,431",
    titleLead: "Build a",
    titleHighlight: "Permanent Magnet Motor",
    titleTrail: "",
    intro:
      "A complete, interactive engineering plan derived directly from Howard R. Johnson's 1979 patent — covering theory, materials, fabrication, assembly, tuning, and operation. Every step, every part, every dimension you need.",
    factsCard: "Patent Facts",
    classificationCard: "Classification",
    intlClass: "International (Int. Cl.)",
    usClassLabel: "U.S. Classification",
    inventor: "Inventor",
    filed: "Filed",
    issued: "Issued",
    applNo: "Appl. No.",
    number: "Number",
    claimsLabel: "Claims",
    drawings: "Drawings",
    examiner: "Examiner",
    attorney: "Attorney",
    whatTitle: "What This Motor Does",
    whatSubtitle: "The core inventive concept in one paragraph",
    para1:
      "The Johnson permanent magnet motor produces relative motion between an armature and a stator using only static magnetic fields — no electrical current, no commutator, no brushes. The unpaired electron spins within permanent magnets are treated as a continuous source of motive power, analogous to a room-temperature superconductor.",
    para2:
      "The breakthrough is geometric. The armature magnet's length is set to be slightly greater than the combined width of two stator magnets plus one inter-magnet gap. At every position along the track, the leading pole of the armature is repelled by an adjacent like pole while the trailing pole is attracted by an opposite pole. The resultant force vector always points in the same direction — producing continuous motion along the track.",
    para3:
      "Both a linear embodiment and a rotary embodiment are described. The rotary version includes a threaded shaft that allows the builder to axially displace the armature and thereby regulate the rotational speed — a fully mechanical throttle with zero electrical components.",
    dimensionsTitle: "Prototype Dimensions",
    dimensionsSubtitle: "From the patent's working example",
    keyInsightTitle: "Key Insight",
    keyInsightP1:
      "The armature length must be slightly longer than 2 stator widths + 1 gap. This is the entire trick.",
    keyInsightP2:
      "Reversing the armature magnet (N↔S) reverses the direction of motion. No electrical switching required.",
    keyInsightP3: "Mechanical advantage claimed: greater than 100:1.",
    glanceTitle: "At a Glance",
    glance1: "2 embodiments (linear + rotary)",
    glance2: "~14 build steps total",
    glance3: "19 BOM items",
    glance4: "10 workshop tools",
    glance5: "25 patent claims",
  },

  theory: {
    title: "Theory of Operation",
    subtitle:
      "How static magnetic fields produce continuous thrust — the physics behind the patent",
    diagramTitle: "Spin → Field → Force",
    diagramCaption:
      "Unpaired Electron Spins in a Ferromagnet → Source of the Permanent Magnetic Field",
    aligned: "aligned spins",
    concentrated: "concentrated field",
    motive: "Motive Force",
    noElectronFlow: "No electron flow",
  },

  bom: {
    title: "Bill of Materials",
    subtitle: "Every part you need — magnets, structural, hardware, and tooling",
    progressLabel: "Acquisition progress",
    acquisition: "Acquisition progress",
    filters: {
      all: "All Categories",
      magnet: "Magnet",
      metal: "Metal",
      structural: "Structural",
      hardware: "Hardware",
      tooling: "Tooling",
    },
    searchPlaceholder: "Search parts, specs, sources...",
    cols: {
      id: "ID",
      part: "Part",
      spec: "Specification",
      qty: "Qty",
      purpose: "Purpose",
      source: "Source",
      type: "Type",
    },
    showing: "Showing",
    of: "of",
    critical: "critical",
  },

  tools: {
    title: "Tools & Workshop Setup",
    subtitle: "What your workshop needs before you start cutting metal",
    required: "Required",
    optional: "Optional / Nice-to-have",
  },

  build: {
    linearTitle: "Linear Embodiment — Build Guide",
    linearSubtitle: "7 phases from raw magnet stock to a moving prototype",
    rotaryTitle: "Rotary Embodiment — Build Guide",
    rotarySubtitle: "7 phases for the circular motor with speed regulator",
    checklistProgress: "Build checklist progress",
    checks: "checks",
    duration: "Est. duration",
    verificationTitle: "Verification Checklist",
    warningTitle: "Warning",
    interactiveTitle: "Interactive Geometry",
    linearInteractDesc:
      "Drag the slider (or press Auto-run) to see how the armature traverses the stator track",
    rotaryInteractDesc:
      "Watch the 3 staggered armature magnets rotate around 12 stator magnets — adjust axial engagement to change speed",
    autoRun: "Auto-run",
    pause: "Pause",
    position: "Position",
    trackStart: "Track start",
    trackEnd: "Track end",
    alwaysOn: "Always-On Thrust",
    alwaysOnDesc:
      "At every position, the N pole of the armature is repelled by the next stator N pole while the S pole is attracted by the previous stator S pole. Net force vector always points left.",
    lengthRatio: "2-Stator Length Ratio",
    lengthRatioDesc:
      "Armature length ≈ 2 stator widths + 1 gap. This guarantees that one end is always in repulsion while the other is always in attraction.",
    varSpacing: "Variable Stator Spacing",
    varSpacingDesc:
      "Stator gaps alternate slightly to smooth the force pulse. Reversing the armature (N↔S) reverses the direction of motion.",
    axialEngagement: "Axial engagement (speed regulator)",
    low: "Low (slow)",
    full: "Full (fast)",
    spin: "Spin",
    motionDir: "← direction of motion (N left, S right) →",
  },

  phases: {
    Preparation: "Preparation",
    Foundation: "Foundation",
    Armature: "Armature",
    Tuning: "Tuning",
    Assembly: "Assembly",
  },

  simulator: {
    title: "Force vs Air-Gap Simulator",
    subtitle:
      "A first-order engineering model to help you choose the right air gap and magnet grade for your build",
    airGapLabel: "Air gap",
    magnetGradeLabel: "Magnet grade",
    forceOutputTitle: "Estimated Force Output",
    netThrust: "Net thrust (lbf)",
    peakPulsation: "Peak pulsation (lbf)",
    smoothness: "Smoothness index",
    magnetRemanence: "Magnet remanence Br",
    chartTitle: "Trade-off Visualization",
    chartDesc:
      "Blue = net thrust vs air gap; red = pulsation amplitude. The patent recommends an air gap around 0.125 in (3.18 mm) — close to the \"knee\" where thrust is still high but pulsation begins to drop off.",
    optimizationTitle: "Optimization Tip",
    optExcellent: "Excellent smoothness — keep current gap.",
    optAcceptable: "Acceptable; consider widening gap slightly to reduce pulsation.",
    optHigh:
      "Pulsation is high — widen the gap by 0.020 in or add a second staggered armature magnet.",
    forceAxis: "Force (lbf)",
    gapAxis: "Air gap (mils)",
    legendNet: "Net thrust",
    legendPulse: "Pulsation",
  },

  safety: {
    title: "Safety, Warnings & Engineering Notes",
    subtitle: "Critical information before you handle high-field magnets",
    severity: {
      critical: "critical",
      caution: "caution",
      note: "note",
    },
  },

  claims: {
    title: "Patent Claims — Reference",
    subtitle: "The 25 legal claims that define the invention's scope",
    searchPlaceholder: "Search claims by keyword...",
    type: {
      apparatus: "apparatus",
      method: "method",
      subcombination: "subcombination",
    },
    independent: "independent",
    dependent: "dependent",
    noResults: "No claims match your search.",
  },

  troubleshoot: {
    title: "Troubleshooting Guide",
    subtitle: "Common failure modes and how to fix them",
    causeLabel: "Likely cause",
    fixLabel: "Fix",
  },

  footer: {
    patentInfo: "US 4,151,431",
    buildInfo:
      "Permanent Magnet Motor — Howard R. Johnson, issued April 24, 1979. Source document: patent specification, claims, and 10 drawing figures.",
    disclaimerTitle: "Disclaimer",
    disclaimerBody:
      "This build guide is a faithful engineering reinterpretation of the patent disclosure. The patent's claim of continuous motive power from permanent magnets alone is not consistent with the second law of thermodynamics and should be treated as an engineering case study in magnetic field manipulation rather than a working free-energy machine.",
    builtFor: "Build Information",
    metaLine: "Built for engineers, from the patent record.",
  },
};

// Hebrew UI strings
export const heStrings: UIStrings = {
  headerTitle: "מנוע מגנטים קבועים",
  headerSubtitle: "US 4,151,431 — מדריך בנייה למהנדס",
  langToggle: "English",

  nav: {
    overview: "סקירה כללית",
    theory: "תיאוריה",
    bom: "חומרים (BOM)",
    tools: "כלים וסדנה",
    linear: "בנייה לינארית",
    rotary: "בנייה רוטרית",
    simulator: "סימולטור כוח",
    safety: "בטיחות",
    claims: "תביעות הפטנט",
    troubleshoot: "פתרון בעיות",
  },

  overview: {
    badge: "פטנט US 4,151,431",
    titleLead: "בנו",
    titleHighlight: "מנוע מגנטים קבועים",
    titleTrail: "",
    intro:
      "תוכנית הנדסית מקיפה ואינטראקטיבית שנגזרה ישירות מהפטנט של הווארד ר. ג'ונסון מ-1979 — הכוללת תיאוריה, חומרים, ייצור, הרכבה, כיול והפעלה. כל צעד, כל חלק, כל מימד שנדרש.",
    factsCard: "נתוני הפטנט",
    classificationCard: "סיווג",
    intlClass: "סיווג בינלאומי (Int. Cl.)",
    usClassLabel: "סיווג אמריקאי",
    inventor: "ממציא",
    filed: "תאריך הגשה",
    issued: "תאריך הנפקה",
    applNo: "מספר בקשה",
    number: "מספר",
    claimsLabel: "תביעות",
    drawings: "שרטוטים",
    examiner: "בוחן",
    attorney: "עורך דין",
    whatTitle: "מה המנוע הזה עושה",
    whatSubtitle: "הרעיון המרכזי של ההמצאה בפסקה אחת",
    para1:
      "מנוע המגנטים הקבועים של ג'ונסון מייצר תנועה יחסית בין ארמטורה לסטטור באמצעות שדות מגנטיים סטטיים בלבד — ללא זרם חשמלי, ללא קומוטטור, ללא מברשות. הספינים של האלקטרונים הלא-מזווגים בתוך מגנטים קבועים נחשבים כמקור רציף לכוח מניע, בדומה למוליך-על בטמפרטורת החדר.",
    para2:
      "הפריצה היא גיאומטרית. אורך המגנט הארמטורה נקבע להיות מעט גדול יותר מרוחב שני מגנטי סטטור יחד עם רווח אחד ביניהם. בכל מיקום לאורך המסיל, הקוטב המוביל של הארמטורה נדחה על ידי קוטב דומה סמוך, בעוד הקוטב העוקב נמשך על ידי קוטב הפוך. וקטור הכוח השקול תמיד פונה לאותו כיוון — ומייצר תנועה רציפה לאורך המסיל.",
    para3:
      "הפטנט מתאר גם מימוש לינארי וגם מימוש רוטרי. הגרסה הרוטרית כוללת ציר מחורץ המאפשר לבנאי להזיז את הארמטורה לאורך הציר ובכך לווסת את מהירות הסיבוב — מצערת מכנית לחלוטין ללא רכיבים חשמליים.",
    dimensionsTitle: "מידות אב-טיפוס",
    dimensionsSubtitle: "מדוגמת העבודה בפטנט",
    keyInsightTitle: "תובנה מרכזית",
    keyInsightP1:
      "אורך הארמטורה חייב להיות מעט ארוך יותר מ-2 רוחבי סטטור + רווח אחד. זהו כל הסוד.",
    keyInsightP2:
      "היפוך הארמטורה (N↔S) הופך את כיוון התנועה. אין צורך במיתוג חשמלי.",
    keyInsightP3: "יתרון מכני נטען: גדול מ-100:1.",
    glanceTitle: "במבט מהיר",
    glance1: "2 מימושים (לינארי + רוטרי)",
    glance2: "כ-14 שלבי בנייה סך הכל",
    glance3: "19 פריטים ב-BOM",
    glance4: "10 כלי סדנה",
    glance5: "25 תביעות פטנט",
  },

  theory: {
    title: "תורת הפעולה",
    subtitle:
      "כיצד שדות מגנטיים סטטיים מייצרים דחף רציף — הפיזיקה מאחורי הפטנט",
    diagramTitle: "ספין → שדה → כוח",
    diagramCaption: "ספינים של אלקטרונים לא-מזווגים בחומר פרומגנטי → מקור השדה המגנטי הקבוע",
    aligned: "ספינים מיושרים",
    concentrated: "שדה מרוכז",
    motive: "כוח מניע",
    noElectronFlow: "ללא זרימת אלקטרונים",
  },

  bom: {
    title: "חשבונית חומרים (BOM)",
    subtitle: "כל חלק שנדרש — מגנטים, מבני, חומרה וכלים",
    progressLabel: "התקדמות רכישה",
    acquisition: "התקדמות רכישה",
    filters: {
      all: "כל הקטגוריות",
      magnet: "מגנטים",
      metal: "מתכת",
      structural: "מבני",
      hardware: "חומרה",
      tooling: "כלים",
    },
    searchPlaceholder: "חיפוש חלקים, מפרטים, ספקים...",
    cols: {
      id: "מזהה",
      part: "פריט",
      spec: "מפרט",
      qty: "כמות",
      purpose: "תכלית",
      source: "ספק",
      type: "סוג",
    },
    showing: "מציג",
    of: "מתוך",
    critical: "קריטי",
  },

  tools: {
    title: "כלים והכנת סדנה",
    subtitle: "מה סדנתך צריכה לפני שמתחילים לחתוך מתכת",
    required: "נדרש",
    optional: "אופציונלי / נחמד להוספה",
  },

  build: {
    linearTitle: "מימוש לינארי — מדריך בנייה",
    linearSubtitle: "7 שלבים מחומר מגנטי גולמי לאב-טיפוס נע",
    rotaryTitle: "מימוש רוטרי — מדריך בנייה",
    rotarySubtitle: "7 שלבים למנוע המעגלי עם ווסת מהירות",
    checklistProgress: "התקדמות רשימת בדיקה",
    checks: "בדיקות",
    duration: "משך מוערך",
    verificationTitle: "רשימת אימות",
    warningTitle: "אזהרה",
    interactiveTitle: "גיאומטריה אינטראקטיבית",
    linearInteractDesc:
      "גררו את הסליידר (או לחצו על הפעלה אוטומטית) כדי לראות כיצד הארמטורה חוצה את מסיל הסטטור",
    rotaryInteractDesc:
      "צפו ב-3 מגנטי ארמטורה מדורגים מסתובבים סביב 12 מגנטי סטטור — כוונו את ההצמדה הצירית כדי לשנות מהירות",
    autoRun: "הפעלה אוטומטית",
    pause: "עצור",
    position: "מיקום",
    trackStart: "תחילת מסיל",
    trackEnd: "סוף מסיל",
    alwaysOn: "דחף תמידי",
    alwaysOnDesc:
      "בכל מיקום, קוטב N של הארמטורה נדחה על ידי קוטב N הסטטור הבא, בעוד קוטב S נמשך על ידי קוטב S הקודם. וקטור הכוח תמיד פונה שמאלה.",
    lengthRatio: "יחס אורך 2-סטטורים",
    lengthRatioDesc:
      "אורך ארמטורה ≈ 2 רוחבי סטטור + רווח. זה מבטיח שקצה אחד תמיד בדחייה והשני תמיד במשיכה.",
    varSpacing: "ריווח משתנה של סטטור",
    varSpacingDesc:
      "רווחי סטטור משתנים מעט כדי להחליק את דופק הכוח. היפוך הארמטורה (N↔S) הופך את כיוון התנועה.",
    axialEngagement: "הצמדה צירית (וסת מהירות)",
    low: "נמוכה (אט)",
    full: "מלאה (מהר)",
    spin: "סובב",
    motionDir: "← כיוון תנועה (N שמאל, S ימין) →",
  },

  phases: {
    Preparation: "הכנה",
    Foundation: "יסוד",
    Armature: "ארמטורה",
    Tuning: "כיול",
    Assembly: "הרכבה",
  },

  simulator: {
    title: "סימולטור כוח מול רווח אוויר",
    subtitle:
      "מודל הנדסי מסדר ראשון לסיוע בבחירת רווח האוויר ודרגת המגנט לבנייה",
    airGapLabel: "רווח אוויר",
    magnetGradeLabel: "דרגת מגנט",
    forceOutputTitle: "תפוקת כוח מוערכת",
    netThrust: "דחף נטו (lbf)",
    peakPulsation: "פעימת שיא (lbf)",
    smoothness: "מדד חלקות",
    magnetRemanence: "שרידות מגנט Br",
    chartTitle: "ויזואליזציה של פשרה",
    chartDesc:
      "כחול = דחף נטו מול רווח אוויר; אדום = משרעת פעימה. הפטנט ממליץ על רווח אוויר של כ-0.125 אינץ' (3.18 מ\"מ) — קרוב ל\"ברך\" שבה הדחף עדיין גבוה אך הפעימה מתחילה לרדת.",
    optimizationTitle: "טיפ אופטימיזציה",
    optExcellent: "חלקות מצוינת — שמרו על הרווח הנוכחי.",
    optAcceptable: "קביל; כדאי להרחיב את הרווח מעט כדי להקטין פעימה.",
    optHigh: "פעימה גבוהה — הרחיבו את הרווח ב-0.020 אינץ' או הוסיפו מגנט ארמטורה מדורג שני.",
    forceAxis: "כוח (lbf)",
    gapAxis: "רווח אוויר (mils)",
    legendNet: "דחף נטו",
    legendPulse: "פעימה",
  },

  safety: {
    title: "בטיחות, אזהרות והערות הנדסיות",
    subtitle: "מידע קריטי לפני טיפול במגנטים בשדה חזק",
    severity: {
      critical: "קריטי",
      caution: "זהירות",
      note: "הערה",
    },
  },

  claims: {
    title: "תביעות הפטנט — הפניה",
    subtitle: "25 התביעות המשפטיות המגדירות את היקף ההמצאה",
    searchPlaceholder: "חיפוש תביעות לפי מילת מפתח...",
    type: {
      apparatus: "מכשיר",
      method: "שיטה",
      subcombination: "תת-קומבינציה",
    },
    independent: "עצמאית",
    dependent: "תלויה",
    noResults: "אין תביעות התואמות לחיפוש.",
  },

  troubleshoot: {
    title: "מדריך פתרון בעיות",
    subtitle: "מצבי כשל נפוצים וכיצד לתקן אותם",
    causeLabel: "סיבה סבירה",
    fixLabel: "תיקון",
  },

  footer: {
    patentInfo: "US 4,151,431",
    buildInfo:
      "מנוע מגנטים קבועים — הווארד ר. ג'ונסון, הונפק ב-24 באפריל 1979. מסמך מקור: מפרט הפטנט, תביעות, ו-10 דמויות שרטוט.",
    disclaimerTitle: "כתב ויתור",
    disclaimerBody:
      "מדריך בנייה זה הוא פרשנות הנדסית נאמנה של גילוי הפטנט. טענת הפטנט בדבר כוח מניע רציף ממגנטים קבועים בלבד אינה עקבית עם החוק השני של התרמודינמיקה ויש להתייחס אליה כאל מקרה מחקר הנדסי במניפולציית שדה מגנטי, ולא כאל מכונת אנרגיה חופשית עובדת.",
    builtFor: "מידע בנייה",
    metaLine: "נבנה למהנדסים, מתוך רשומות הפטנט.",
  },
};

export const stringsByLang: Record<Lang, UIStrings> = {
  en: enStrings,
  he: heStrings,
};

// ============================================================
// Variant UI strings — for the design toggle between the
// original patent and the circular flap variant.
// ============================================================
export interface VariantStrings {
  toggleLabel: string;
  original: string;
  originalSubtitle: string;
  flap: string;
  flapSubtitle: string;
}

const variantStringsEn: VariantStrings = {
  toggleLabel: "Design",
  original: "Original Patent (US 4,151,431)",
  originalSubtitle: "Howard R. Johnson's 1979 design — magnet armature + magnet stator",
  flap: "Circular Flap Variant",
  flapSubtitle: "Modified design — ferromagnetic disc + 2-3 static side magnets",
};

const variantStringsHe: VariantStrings = {
  toggleLabel: "תכנון",
  original: "הפטנט המקורי (US 4,151,431)",
  originalSubtitle: "תכנון ג'ונסון מ-1979 — ארמטורה מגנטית + סטטור מגנטי",
  flap: "וריאנט דיסקה מסתובבת",
  flapSubtitle: "תכנון מותאם — דיסקה פרומגנטית + 2-3 מגנטי צד סטטיים",
};

export const variantStringsByLang: Record<Lang, VariantStrings> = {
  en: variantStringsEn,
  he: variantStringsHe,
};

// ============================================================
// Localized data accessor
// Returns the appropriate data module (English or Hebrew) for the
// current language. This is what the page imports to render
// language-aware BOM, claims, build steps, etc.
// ============================================================
import {
  patentInfo as patentInfoEn,
  bomItems as bomItemsEn,
  workshopTools as workshopToolsEn,
  theoryPoints as theoryPointsEn,
  prototypeDimensions as prototypeDimensionsEn,
  linearBuildSteps as linearBuildStepsEn,
  rotaryBuildSteps as rotaryBuildStepsEn,
  patentClaims as patentClaimsEn,
  safetyItems as safetyItemsEn,
  troubleshooting as troubleshootingEn,
} from "./data";
import {
  patentInfoHe,
  bomItemsHe,
  workshopToolsHe,
  theoryPointsHe,
  prototypeDimensionsHe,
  linearBuildStepsHe,
  rotaryBuildStepsHe,
  patentClaimsHe,
  safetyItemsHe,
  troubleshootingHe,
} from "./data.he";

export interface LocalizedData {
  patentInfo: typeof patentInfoEn;
  bomItems: typeof bomItemsEn;
  workshopTools: typeof workshopToolsEn;
  theoryPoints: typeof theoryPointsEn;
  prototypeDimensions: typeof prototypeDimensionsEn;
  linearBuildSteps: typeof linearBuildStepsEn;
  rotaryBuildSteps: typeof rotaryBuildStepsEn;
  patentClaims: typeof patentClaimsEn;
  safetyItems: typeof safetyItemsEn;
  troubleshooting: typeof troubleshootingEn;
}

export const dataByLang: Record<Lang, LocalizedData> = {
  en: {
    patentInfo: patentInfoEn,
    bomItems: bomItemsEn,
    workshopTools: workshopToolsEn,
    theoryPoints: theoryPointsEn,
    prototypeDimensions: prototypeDimensionsEn,
    linearBuildSteps: linearBuildStepsEn,
    rotaryBuildSteps: rotaryBuildStepsEn,
    patentClaims: patentClaimsEn,
    safetyItems: safetyItemsEn,
    troubleshooting: troubleshootingEn,
  },
  he: {
    patentInfo: patentInfoHe,
    bomItems: bomItemsHe,
    workshopTools: workshopToolsHe,
    theoryPoints: theoryPointsHe,
    prototypeDimensions: prototypeDimensionsHe,
    linearBuildSteps: linearBuildStepsHe,
    rotaryBuildSteps: rotaryBuildStepsHe,
    patentClaims: patentClaimsHe,
    safetyItems: safetyItemsHe,
    troubleshooting: troubleshootingHe,
  },
};

// ============================================================
// Accept-Language auto-detection
// Returns the preferred language based on the Accept-Language header
// or navigator.languages. Defaults to "en" if no preference or
// if Hebrew is not explicitly preferred.
// ============================================================
export function detectLanguage(acceptLanguage: string | null | undefined): Lang {
  if (!acceptLanguage) return "en";
  // Parse the Accept-Language header: "en-US,en;q=0.9,he;q=0.8,fr;q=0.7"
  const entries = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, qStr] = part.trim().split(";");
      const q = qStr ? parseFloat(qStr.replace("q=", "")) : 1;
      return { tag: tag.toLowerCase(), q: isNaN(q) ? 1 : q };
    })
    .filter((e) => e.tag)
    .sort((a, b) => b.q - a.q);

  for (const e of entries) {
    if (e.tag.startsWith("he") || e.tag.startsWith("iw") || e.tag.startsWith("he-il")) return "he";
    if (e.tag.startsWith("en")) return "en"; // first match wins if no Hebrew ahead
  }
  return "en";
}

export function detectLanguageFromNavigator(): Lang {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages ?? [navigator.language];
  const acceptHeader = langs.join(",");
  return detectLanguage(acceptHeader);
}

// ============================================================
// Localized FLAP VARIANT data accessor
// Same pattern as dataByLang but for the flap variant module.
// ============================================================
import {
  flapVariantInfo as flapVariantInfoEn,
  flapTheoryPoints as flapTheoryPointsEn,
  flapBomItems as flapBomItemsEn,
  flapWorkshopTools as flapWorkshopToolsEn,
  flapPrototypeDimensions as flapPrototypeDimensionsEn,
  flapBuildSteps as flapBuildStepsEn,
  flapSafetyItems as flapSafetyItemsEn,
  flapTroubleshooting as flapTroubleshootingEn,
  flapConfigs as flapConfigsEn,
} from "./flap-variant";
import {
  flapVariantInfoHe,
  flapTheoryPointsHe,
  flapBomItemsHe,
  flapWorkshopToolsHe,
  flapPrototypeDimensionsHe,
  flapBuildStepsHe,
  flapSafetyItemsHe,
  flapTroubleshootingHe,
  flapConfigsHe,
} from "./flap-variant.he";

export interface LocalizedFlapData {
  flapVariantInfo: typeof flapVariantInfoEn;
  flapTheoryPoints: typeof flapTheoryPointsEn;
  flapBomItems: typeof flapBomItemsEn;
  flapWorkshopTools: typeof flapWorkshopToolsEn;
  flapPrototypeDimensions: typeof flapPrototypeDimensionsEn;
  flapBuildSteps: typeof flapBuildStepsEn;
  flapSafetyItems: typeof flapSafetyItemsEn;
  flapTroubleshooting: typeof flapTroubleshootingEn;
  flapConfigs: typeof flapConfigsEn;
}

export const flapDataByLang: Record<Lang, LocalizedFlapData> = {
  en: {
    flapVariantInfo: flapVariantInfoEn,
    flapTheoryPoints: flapTheoryPointsEn,
    flapBomItems: flapBomItemsEn,
    flapWorkshopTools: flapWorkshopToolsEn,
    flapPrototypeDimensions: flapPrototypeDimensionsEn,
    flapBuildSteps: flapBuildStepsEn,
    flapSafetyItems: flapSafetyItemsEn,
    flapTroubleshooting: flapTroubleshootingEn,
    flapConfigs: flapConfigsEn,
  },
  he: {
    flapVariantInfo: flapVariantInfoHe,
    flapTheoryPoints: flapTheoryPointsHe,
    flapBomItems: flapBomItemsHe,
    flapWorkshopTools: flapWorkshopToolsHe,
    flapPrototypeDimensions: flapPrototypeDimensionsHe,
    flapBuildSteps: flapBuildStepsHe,
    flapSafetyItems: flapSafetyItemsHe,
    flapTroubleshooting: flapTroubleshootingHe,
    flapConfigs: flapConfigsHe,
  },
};
