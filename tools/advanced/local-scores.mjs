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
// extra: e.g. { period: "the last week" } for questions whose answers only make sense for one week
function scored(id, section, text, labels, worstFirst = false, extra = {}) {
  return {
    id, section, text, ...extra,
    // Shown from 0 (worst) to 4 (best), as in the owner's 2026-10-20 Word documents.
    // The value for each answer is unchanged.
    options: labels.map((label, i) => ({ value: String(worstFirst ? i : 4 - i), label }))
      .sort((a, b) => Number(a.value) - Number(b.value)),
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
  scored(6, "Pain and symptoms", "In the last week, how often have you needed pain relief for your knee?", ["Not at all", "1 day a week", "1-3 days", "4-6 days", "Everyday"], false, { period: "the last week" }),
  scored(7, "Sleep", "In the last week, on how many nights did your knee make it hard to fall asleep?", NIGHTS, false, { period: "the last week" }),
  scored(8, "Sleep", "In the last week, on how many nights did knee pain wake you?", NIGHTS, false, { period: "the last week" }),
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
  scored(40, "Female health", "In the last week, on how many nights did hot flushes or night sweats disturb your sleep?", NIGHTS, false, { period: "the last week" }),
  scored(41, "Female health", "How much aching or stiffness have you had in joints other than the injured/operated knee?", SEVERITY),
  scored(42, "Female health", "How much do your knee symptoms (pain, swelling, stiffness) change across your menstrual cycle?", SEVERITY),
  scored(43, "Female health", "How much period-related or hormonal symptoms (pain, heavy bleeding, mood) limited your rehab or sport?", SEVERITY),
];

// Female Knee Score FK21 ("Female Knee Score" Word document, version 2, 2026-10-20).
// Its 10 knee questions are taken word for word from the Long Knee Score, renumbered 1 to 10.
// Its last 11 questions are the same female health questions as before, renumbered 11 to 21.
const FK_FROM_LK32 = [1, 4, 9, 11, 16, 24, 26, 29, 31, 32];
const FK_CORE = FK_FROM_LK32.map((lk, i) => ({ ...CORE.find(q => q.id === lk), id: i + 1 }));
const FK_EXTRA = FEMALE_EXTRA.map(q => ({ ...q, id: q.id - 22 }));
const FK_SECTIONS = ["Pain and symptoms", "Sleep", "Stability", "Daily function", "Sport function", "Activity level", "Confidence", "Global"];

const SHARED = {
  category: "General Knee",
  scoringRange: { min: 0, max: 100 },
  scoringDirection: "higher_better",
  validationLevel: "Awaiting Validation",
  licenseType: "Free",
  licenseDetails: "Free for clinical and research use via mykneescore platform",
  citation: "mykneescore development team. 2026. Awaiting validation.",
};

// Asked at the end of every My Knee Score questionnaire (owner, 2026-11-07).
// Recorded with the result, never scored, and not numbered.
export const ABOUT_YOU = [
  { id: "age", section: "About you", outro: true, scored: false, optional: true, type: "fields",
    text: "What is your age?", hint: "Optional. Leave blank if you prefer not to say.",
    fields: [{ key: "age", label: "Age in years", input: "number", min: 1, max: 120 }] },
  { id: "sex", section: "About you", outro: true, scored: false, optional: true,
    text: "Are you male or female?", hint: "Optional. You can skip this question.",
    options: ["Male", "Female", "Prefer not to say"].map(label => ({ value: label, label })) },
];

// ---------- Pedi-IKDC ----------
// Published score (not ours). Wording copied exactly from the original form:
// Kocher MS et al. Am J Sports Med 2011;39(5):933-939, online Appendix 1
// (ds_10.1177_0363546510383002_app1.pdf, supplied by the owner 2026-11-14).
// Options are shown in the form's order. Study-only fields (study ID,
// questionnaire type, dates distributed and completed) are left out.
//
// Scoring follows the 18 scored items listed in the paper's Appendix 2:
// activity with pain 0-4, pain in the past 4 weeks 0-10, severity of pain 0-10,
// swelling 0-4, activity with swelling 0-4, catching 0-2 (locking and catching,
// 0-1 each), activity with giving way 0-4, highest activity 0-4, the nine
// activities 0-4 each, overall knee function 0-10. Higher is better throughout.
// Total = sum / 88 x 100, by the generic engine (quickScore) unchanged.
// Question 4 (moving or bending), 12 (before the injury) and 14 (who completed
// it) are not among those items, so they are recorded but not scored. Unscored
// answers use text values, so the engine skips them.
const PEDI_ACT = [
  "Very hard activities like jumping or turning fast to change direction, like in basketball or soccer",
  "Hard activities like heavy lifting, skiing or tennis",
  "Sort of hard activities like walking fast or jogging",
  "Light activities like walking at a normal speed",
];
const pediActivity = (id, num, section, text, last) => ({
  id, num, section, text,
  options: [...PEDI_ACT, last].map((label, i) => ({ value: String(4 - i), label })),
});
// 0 to 10 scale; worstHigh = the form's 10 is the worst answer
const pediScale = (id, num, section, text, low, high, worstHigh) => ({
  id, num, section, text,
  options: Array.from({ length: 11 }, (_, n) => ({
    value: String(worstHigh ? 10 - n : n),
    label: n === 0 ? `0 (${low})` : n === 10 ? `10 (${high})` : String(n),
  })),
});
const PEDI_ABILITY = ["No, not at all", "Yes, a little", "Yes, somewhat", "Yes, a lot", "I can’t do this"];
const pediAbility = (id, letter, text) => ({
  id, num: "11" + letter, section: "Sports activities",
  stem: "Does your injured knee affect your ability to:", text,
  options: PEDI_ABILITY.map((label, i) => ({ value: String(4 - i), label })),
});
const pediYesNo = (id, num, text) => ({
  id, num, section: "Symptoms", text,
  options: [{ value: "0", label: "Yes" }, { value: "1", label: "No" }],
});

const PEDI_IKDC_QUESTIONS = [
  {
    id: "injured", section: "Before you start", intro: true, scored: false, optional: true, type: "fields",
    text: "We would like to learn more about your injured knee. Each of the questions asks you a different question about your injured knee. Please answer each question below.",
    fields: [{ key: "date", label: "Date you injured your knee", input: "date" }],
    hint: "Optional. Leave blank if you are not sure.",
  },
  pediActivity(1, "1", "Symptoms", "If you were asked to do the activities below, what is the most you could do today without making your injured knee hurt a lot?",
    "I can’t do any of the activities listed above because my knee hurts too much now"),
  pediScale(2, "2", "Symptoms", "During the past 4 weeks, or since your injury, how much of the time did your injured knee hurt?",
    "Never hurt", "Hurt all of the time", true),
  pediScale(3, "3", "Symptoms", "How badly does your injured knee hurt today?",
    "Does not hurt at all", "Hurts so much I can’t stand it", true),
  {
    id: 4, num: "4", section: "Symptoms", scored: false,
    text: "During the past 4 weeks, or since your injury, how hard has it been to move or bend your injured knee?",
    options: ["Not at all hard", "A little hard", "Somewhat hard", "Very hard", "Extremely hard"].map(label => ({ value: label, label })),
  },
  {
    id: 5, num: "5", section: "Symptoms",
    text: "During the past 4 weeks, or since your injury, how puffy (or swollen) was your injured knee?",
    options: ["Not at all puffy", "A little puffy", "Somewhat puffy", "Very puffy", "Extremely puffy"].map((label, i) => ({ value: String(4 - i), label })),
  },
  pediActivity(6, "6", "Symptoms", "If you were asked to do the activities below, what is the most you could do today without making your injured knee puffy (or swollen)?",
    "I can’t do any of the activities listed above because my injured knee is puffy even when I rest"),
  pediYesNo(7, "7", "During the past 4 weeks, or since your injury, did your injured knee ever get stuck in place (lock) so that you could not move it?"),
  pediYesNo(8, "8", "During the past 4 weeks, or since your injury, did your injured knee ever feel like it was getting stuck (catching), but you could still move it?"),
  pediActivity(9, "9", "Symptoms", "If you were asked to do the activities below, what is the most you could do today without your injured knee feeling like it can’t hold you up?",
    "I can’t do any of the activities listed above because my injured knee feels like it can’t hold me up"),
  pediActivity(10, "10", "Sports activities", "What is the most you can do on your injured knee most of the time?",
    "I can’t do any of the activities listed above most of the time"),
  pediAbility(11, "a", "Go up stairs?"),
  pediAbility(12, "b", "Go down stairs?"),
  pediAbility(13, "c", "Kneel on your injured knee?"),
  pediAbility(14, "d", "Squat down like a baseball catcher?"),
  pediAbility(15, "e", "Sit in a chair with your knees bent and feet flat on the floor?"),
  pediAbility(16, "f", "Get up from a chair?"),
  pediAbility(17, "g", "Run?"),
  pediAbility(18, "h", "Jump and land on your injured knee?"),
  pediAbility(19, "i", "Start and stop moving quickly?"),
  {
    ...pediScale(20, "12", "Sports activities", "How well did your knee work before you injured it?",
      "I could not do anything at all", "I could do anything I wanted to", false),
    scored: false,
  },
  pediScale(21, "13", "Sports activities", "How well does your knee work now?",
    "I am not able to do anything at all", "I am able to do anything I want to do", false),
  {
    id: 22, num: "14", scored: false, text: "Who completed the questionnaire?",
    options: ["Child alone", "Child with help from parent/adult"].map(label => ({ value: label, label })),
  },
];
// Unscored 0 to 10 answers become text ("Rated 7 out of 10") so the engine skips them
PEDI_IKDC_QUESTIONS.find(q => q.id === 20).options.forEach(o => { o.value = "Rated " + o.value + " out of 10"; });

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
    questionSet: [SINCE_INJURY, PERIOD, ...CORE, ...ABOUT_YOU],
    parts: [{ label: "Knee score", ids: CORE.map(q => q.id) }],
    ...SHARED,
  },
  {
    id: "fk21",
    name: "FK21 (Female Knee)",
    fullName: "mykneescore Female Knee Score - FK21",
    acronym: "FK21",
    questions: 21,
    completionTime: "6-8 min",
    subscales: [...FK_SECTIONS, "About you (not scored)", "Female health"],
    description: "10 key knee questions plus 11 questions on hormonal status and female health. Gives a knee score out of 100 and a separate female health score.",
    whatItMeasures: "Pain, swelling, sleep, stability, stairs, landing and changing direction, activity level, confidence and overall knee function, plus hormonal status, contraception, HRT, related conditions, fatigue, pelvic floor symptoms, night sweats, other joint symptoms and changes across the menstrual cycle.",
    whoItsFor: "Women and girls with a knee problem, especially during rehab or return to sport, where hormonal and female health factors may affect recovery.",
    typicalUse: "Assessment that records female health factors alongside knee function, for discussion with a clinician.",
    strengths: ["Knee questions are taken word for word from the Long Knee Score (LK32)", "Records hormonal and female health factors that standard knee scores leave out", "Free to use"],
    limitations: ["Awaiting validation: no published reliability, validity or responsiveness data yet", "The knee score uses 10 questions, so it is less detailed than the Long Knee Score", "Questions 11 to 15 are recorded for context and do not change either score"],
    scoringInterpretation: "Knee score: questions 1 to 10, 0 = severe problems, 100 = no problems. Female health score: questions 16 to 21, 0 = large impact, 100 = no impact. Time since injury or operation, the period you answered about, and questions 11 to 15 are recorded with your result, not scored. Not yet validated, so treat the results as a guide.",
    questionSet: [SINCE_INJURY, PERIOD, ...FK_CORE, ...FK_EXTRA, ...ABOUT_YOU],
    // Score parts: the headline score, then extra scores shown below it
    parts: [
      { label: "Knee score", ids: FK_CORE.map(q => q.id) },
      { label: "Female health score", ids: FK_EXTRA.filter(q => q.scored !== false).map(q => q.id) },
    ],
    ...SHARED,
  },
  {
    // Published score (not ours), on the Paediatrics page. Replaces the research
    // export's version, whose wording did not match the original form.
    id: "pedi-ikdc",
    external: true,
    name: "Pedi-IKDC",
    fullName: "Pediatric IKDC Subjective Knee Evaluation Form",
    acronym: "Pedi-IKDC",
    category: "Sports Knee",
    questions: 14,
    numOf: 14,
    recordTitle: "Recorded, not scored",
    completionTime: "5-8 min",
    subscales: ["Symptoms", "Sports Activities"],
    description: "Pediatric-specific version of IKDC validated for children and adolescents ages 10-18 with various knee conditions.",
    whatItMeasures: "Knee symptoms, sports function, and daily activities adapted for pediatric language and activities.",
    whoItsFor: "Children and adolescents (10-18 years) with knee injuries or conditions requiring outcome assessment.",
    typicalUse: "Pediatric ACL injuries, adolescent sports injuries, youth athletics programs.",
    strengths: ["Age-appropriate language and activities", "Validated for pediatric population", "Based on proven IKDC", "Free to use"],
    limitations: ["Limited to pediatric population (10-18)", "May require parental assistance for younger children", "Cannot compare directly to adult IKDC"],
    validationLevel: "Well Validated",
    mcid: 10,
    scoringRange: { min: 0, max: 100 },
    scoringDirection: "higher_better",
    scoringInterpretation: "0-100 scale, higher = better function. Similar interpretation to adult IKDC. Questions 4, 12 and 14 are recorded with your result but not scored, as in the published scoring.",
    licenseType: "Free",
    citation: "Kocher MS, et al. Reliability, validity, and responsiveness of the pediatric IKDC subjective knee evaluation form. Am J Sports Med. 2011;39(5):933-939.",
    pubmedId: "21068443",
    doi: "10.1177/0363546510383002",
    questionSet: PEDI_IKDC_QUESTIONS,
  },
  {
    // Published score (not ours): listed on the Paediatrics page, without our About you questions.
    // Question wording exactly as in Marot et al. 2021, confirmed by the owner from the paper (2026-11-13).
    id: "pedi-skv",
    external: true,
    name: "Pedi-SKV",
    fullName: "Pediatric Simple Knee Value",
    acronym: "Pedi-SKV",
    category: "General Knee",
    questions: 1,
    completionTime: "Under 1 min",
    subscales: ["Single overall rating"],
    description: "One question: how your knee compares with a normal knee, from 0 to 100. Developed and tested in children and teenagers.",
    whatItMeasures: "Your overall view of your knee, as a percentage of a normal knee.",
    whoItsFor: "Children and teenagers with a knee problem, for a very quick check or to track progress between longer questionnaires.",
    typicalUse: "Quick follow-up at home or in clinic, before and after treatment or surgery.",
    strengths: ["Takes seconds to complete", "Easy for children to understand", "In its validation study it agreed strongly with the Pedi-IKDC and Lysholm scores, and picked up change after surgery"],
    limitations: ["A single rating cannot show which part of knee function is affected", "Validated in a small study (44 patients)"],
    validationLevel: "Validated",
    scoringRange: { min: 0, max: 100 },
    scoringDirection: "higher_better",
    scoringInterpretation: "100 is a normal knee. Your answer is your score. Lower numbers mean your knee feels further from normal.",
    licenseType: "Free",
    citation: "Marot V, Vilette H, Dalmas Y, Justo A, Reina N, Cavaignac E, Berard E, Accadbled F. Pediatric Simple Knee Value: a simple patient-reported outcome measure for the knee. J Child Orthop. 2021.",
    doi: "10.1302/1863-2548.15.200237",
    questionSet: [{
      id: 1, type: "percent",
      text: "How would you rate your knee today as a percentage of normal (0% to 100% scale with 100% being normal)?",
      inputLabel: "Your answer (0% to 100%)", lowLabel: "0%", highLabel: "100%",
      options: [{ value: "0", label: "0" }, { value: "100", label: "100" }],
    }],
  },
];
