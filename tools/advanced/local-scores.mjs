// My Knee Score's own long-form scores. Source of truth: the Word documents
// "Long Knee Score" and "Female Knee Score" supplied by the site owner (2026-10-08).
// These are not in kneescore-research, so build.mjs adds them to the export.
//
// Scoring: every scored item counts 0 to 4, with 4 for the best answer.
// Items the Word documents score "0 = best" (pain, difficulty and so on) are
// reversed so all items point the same way. Options are shown in the same order
// as the documents. The total uses the generic engine (quickScore) unchanged:
// sum of answers / sum of maximums x 100.

const SEVERITY = ["None", "Mild", "Moderate", "Severe", "Extreme"];
const NIGHTS = ["None", "1 night", "2-3 nights", "4-6 nights", "Every night"];
const FREQUENCY = ["Never", "Rarely", "Sometimes", "Often", "Always"];
const DIFFICULTY = ["No difficulty", "Slight", "Moderate", "Severe", "Unable"];

// labels in document order; worstFirst = the document scores the first label 0 and it is the worst answer
function scored(id, section, text, labels, worstFirst = false) {
  return {
    id, section, text,
    options: labels.map((label, i) => ({ value: String(worstFirst ? i : 4 - i), label })),
  };
}

function context(id, text, labels, extra = {}) {
  return { id, section: "About you", text, scored: false, options: labels.map(label => ({ value: label, label })), ...extra };
}

// Asked first in both scores. Recorded with the result, not scored.
const SINCE_INJURY = context(0, "How long is it since your knee injury or operation?", [
  "Up to 1 week", "Up to 1 month", "Up to 6 months", "Up to 1 year", "More than 1 year", "No specific injury or operation",
], { section: "Before you start", intro: true });

// Asked second. The chosen period is shown as a reminder on every question. Recorded, not scored.
const PERIOD = context("period", "When you answer about your pain and function, which period are you thinking about?", [
  "The last week", "The last month", "The last 6 months", "The last year", "Since my injury or operation",
], { section: "Before you start", intro: true, remind: "Thinking about" });

const CORE = [
  scored(1, "Pain and symptoms", "How much pain do you have during normal daily activities?", SEVERITY),
  scored(2, "Pain and symptoms", "How much pain do you have walking on level ground?", SEVERITY),
  scored(3, "Pain and symptoms", "How much stiffness do you have after sitting or resting?", SEVERITY),
  scored(4, "Pain and symptoms", "How much swelling do you have after activity?", SEVERITY),
  scored(5, "Pain and symptoms", "How much aching or pain do you have the day after exercise or exertion?", SEVERITY),
  scored(6, "Pain and symptoms", "How often have you needed pain relief for your knee?", ["Not at all", "1 day a week", "1-3 days", "4-6 days", "Everyday"]),
  scored(7, "Sleep", "On how many nights did your knee make it hard to fall asleep?", NIGHTS),
  scored(8, "Sleep", "On how many nights did knee pain wake you?", NIGHTS),
  scored(9, "Sleep", "Overall, how much has your knee disturbed the quality of your sleep?", SEVERITY),
  scored(10, "Sleep", "How much has tiredness from knee-related poor sleep affected your daily activities, rehab or work?", SEVERITY),
  scored(11, "Stability", "How often has your knee given way or buckled?", FREQUENCY),
  scored(12, "Stability", "How often has your knee caught or locked?", FREQUENCY),
  scored(13, "Stability", "How difficult is it to feel steady on uneven ground or slopes?", DIFFICULTY),
  scored(14, "Stability", "How well can you fully straighten and bend your knee?", ["Fully", "Slightly limited", "Noticeably limited", "Markedly limited", "Severely limited"]),
  scored(15, "Daily function", "How difficult is it to go up stairs?", DIFFICULTY),
  scored(16, "Daily function", "How difficult is it to go down stairs?", DIFFICULTY),
  scored(17, "Daily function", "How far can you walk on level ground?", ["Around the house only/not at all", "15-30 minutes", "30-60 minutes", "Over 1 hour", "Unlimited"], true),
  scored(18, "Daily function", "How difficult is it to get up from a chair or in and out of a car?", DIFFICULTY),
  scored(19, "Daily function", "How difficult is it to kneel?", DIFFICULTY),
  scored(20, "Daily function", "How difficult is it to squat?", DIFFICULTY),
  scored(21, "Daily function", "How difficult is it to carry shopping or a heavy load?", DIFFICULTY),
  scored(22, "Sport function", "How difficult is it to jog in a straight line for 10 minutes?", DIFFICULTY),
  scored(23, "Sport function", "How difficult is it to jump and take off from both feet?", DIFFICULTY),
  scored(24, "Sport function", "How difficult is it to land on the injured/operated leg after a jump or hop, with control?", DIFFICULTY),
  scored(25, "Sport function", "How difficult is it to twist or pivot on a planted foot?", DIFFICULTY),
  scored(26, "Sport function", "How difficult is it to sidestep or change direction quickly while running?", DIFFICULTY),
  scored(27, "Sport function", "How difficult is it to stop or decelerate suddenly while running?", DIFFICULTY),
  scored(28, "Sport function", "How difficult is it to hop repeatedly on the injured/operated leg?", DIFFICULTY),
  scored(29, "Activity level", "What is the highest level of activity you can do now?", ["Sedentary or very limited walking", "Light work, walking, cycling, swimming", "Non-pivoting sport, jogging, or moderately physical work", "Recreational pivoting sport or heavy manual work", "Competitive or full sport including pivoting"], true),
  scored(30, "Work and role", "What is your current work or main-role status?", ["Unable", "Light duties only", "Reduced hours or duties", "Full with minor modifications", "Full duties"], true),
  scored(31, "Confidence", "How confident are you in trusting your knee during sport or physical tasks, without fear of re-injury?", ["Not at all", "Slightly", "Moderately", "Very", "Completely"], true),
  scored(32, "Global", "How would you rate your overall knee function today?", ["Very poor", "Severely abnormal", "Moderately abnormal", "Nearly normal", "Normal"], true),
];

const SECTIONS = ["Pain and symptoms", "Sleep", "Stability", "Daily function", "Sport function", "Activity level", "Work and role", "Confidence", "Global"];

const FEMALE_EXTRA = [
  context(33, "Which best describes your current hormonal status?", [
    "Regular menstrual cycles", "Irregular cycles", "No periods (not pregnant or menopausal)", "Pregnant",
    "Postpartum or breastfeeding", "Perimenopausal", "Postmenopausal (natural)", "Postmenopausal (surgical or medical)",
  ], { detail: "If postpartum or breastfeeding: how many months?" }),
  { id: 34, section: "About you", text: "If you have cycles: first day of your last period, and usual cycle length (days)", scored: false, optional: true, type: "fields",
    fields: [{ key: "lastPeriod", label: "First day of last period", input: "date" }, { key: "cycleLength", label: "Usual cycle length (days)", input: "number" }] },
  context(35, "Are you using hormonal contraception?", [
    "None", "Combined pill", "Progestogen-only pill", "Implant", "Hormonal IUD", "Copper IUD", "Hormonal coil (IUS)", "Injection", "Ring or patch", "Other",
  ], { detail: "If yes, how long have you been on contraception for?" }),
  context(36, "Are you using menopausal hormone therapy (HRT)?", [
    "None", "Systemic oestrogen ± progestogen", "Vaginal oestrogen only", "Tibolone", "Other",
  ]),
  context(37, "Do you have any of the following? (Tick all that apply)", [
    "PCOS", "Endometriosis", "Thyroid disorder", "Iron deficiency or anaemia", "Low bone density", "Previous stress fracture", "Previous pregnancy or childbirth", "None",
  ], { type: "multi", exclusive: "None" }),
  scored(38, "Female health", "How much has fatigue or low energy limited your rehab or training?", SEVERITY),
  scored(39, "Female health", "How often have you leaked urine or had pelvic floor symptoms when running, jumping or landing?", FREQUENCY),
  scored(40, "Female health", "On how many nights did hot flushes or night sweats disturb your sleep?", NIGHTS),
  scored(41, "Female health", "How much aching or stiffness have you had in joints other than the injured/operated knee?", SEVERITY),
  scored(42, "Female health", "How much do your knee symptoms (pain, swelling, stiffness) change across your menstrual cycle?", SEVERITY),
  scored(43, "Female health", "How much period-related or hormonal symptoms (pain, heavy bleeding, mood) limited your rehab or sport?", SEVERITY),
];

const SHARED = {
  category: "General Knee",
  scoringRange: { min: 0, max: 100 },
  scoringDirection: "higher_better",
  validationLevel: "Awaiting Validation",
  licenseType: "Free",
  licenseDetails: "Free for clinical and research use via mykneescore platform",
  citation: "mykneescore development team. 2026. Awaiting validation.",
};

export const LOCAL_SCORES = [
  {
    id: "lk32",
    name: "LK32 (Long Knee)",
    fullName: "mykneescore Long Knee Score - LK32",
    acronym: "LK32",
    questions: 32,
    completionTime: "8-10 min",
    subscales: SECTIONS,
    description: "A comprehensive 32-question knee score. It covers pain, sleep, stability, daily tasks, sport, activity, work, confidence and overall function, and gives one score out of 100.",
    whatItMeasures: "Pain and symptoms, knee-related sleep, stability, daily function, sport function, activity level, work or main role, confidence in the knee, and overall knee function.",
    whoItsFor: "Anyone with a knee problem who wants a full picture, from everyday tasks to return to sport. Useful before and after treatment or surgery.",
    typicalUse: "Detailed baseline and follow-up assessment, rehab monitoring and return-to-sport planning.",
    strengths: ["Covers symptoms, sleep, function, sport, work and confidence in one questionnaire", "Same 0 to 4 answer scale throughout", "Free to use"],
    limitations: ["Awaiting validation: no published reliability, validity or responsiveness data yet", "Longer than the short scores (about 8 to 10 minutes)", "No MCID or normative data yet"],
    scoringInterpretation: "0 = severe problems, 100 = no problems. Each answer counts 0 to 4, with 4 for the best answer. The total is shown out of 100. The time since injury or operation, and the period you answered about, are recorded with your result so you can compare scores over time. They do not change the score. Not yet validated, so treat the result as a guide.",
    questionSet: [SINCE_INJURY, PERIOD, ...CORE],
    parts: [{ label: "Knee score", ids: CORE.map(q => q.id) }],
    ...SHARED,
  },
  {
    id: "fk43",
    name: "FK43 (Female Knee)",
    fullName: "mykneescore Female Knee Score - FK43",
    acronym: "FK43",
    questions: 43,
    completionTime: "12-15 min",
    subscales: [...SECTIONS, "About you (not scored)", "Female health"],
    description: "The 32 Long Knee Score questions plus 11 questions on hormonal status and female health. Gives a knee score out of 100 and a separate female health score.",
    whatItMeasures: "The full Long Knee Score (pain, sleep, stability, daily function, sport, activity, work, confidence and overall function), plus hormonal status, contraception, HRT, related conditions, fatigue, pelvic floor symptoms, night sweats, other joint symptoms and changes across the menstrual cycle.",
    whoItsFor: "Women and girls with a knee problem, especially during rehab or return to sport, where hormonal and female health factors may affect recovery.",
    typicalUse: "Detailed assessment that records female health factors alongside knee function, for discussion with a clinician.",
    strengths: ["Knee score is the same as the Long Knee Score, so results can be compared", "Records hormonal and female health factors that standard knee scores leave out", "Free to use"],
    limitations: ["Awaiting validation: no published reliability, validity or responsiveness data yet", "The longest score here (about 12 to 15 minutes)", "Questions 33 to 37 are recorded for context and do not change either score"],
    scoringInterpretation: "Knee score: questions 1 to 32, 0 = severe problems, 100 = no problems. Female health score: questions 38 to 43, 0 = large impact, 100 = no impact. Time since injury or operation, the period you answered about, and questions 33 to 37 are recorded with your result, not scored. Not yet validated, so treat the results as a guide.",
    questionSet: [SINCE_INJURY, PERIOD, ...CORE, ...FEMALE_EXTRA],
    // Score parts: the headline score, then extra scores shown below it
    parts: [
      { label: "Knee score", ids: CORE.map(q => q.id) },
      { label: "Female health score", ids: FEMALE_EXTRA.filter(q => q.scored !== false).map(q => q.id) },
    ],
    ...SHARED,
  },
];
