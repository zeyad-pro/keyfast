export type Dict = {
  brand: string;
  tagline: string;
  subtitle: string;
  navDashboard: string;
  navNew: string;
  navHelp: string;
  reset: string;
  resetConfirm: string;
  resetDone: string;

  themeLight: string;
  themeDark: string;

  welcomeTitle: string;
  welcomeBody: string;
  welcomeAdd: string;
  welcomeSkip: string;
  emptyTitle: string;
  emptyBody: string;
  dateFormat: string;
  invalidDateFormat: string;
  githubSource: string;

  streak: string;
  current: string;
  max: string;
  maxAccuracy: string;
  avg: string;
  completed: string;
  unlimited: string;
  days: string;

  chartSpeed: string;
  chartAccuracy: string;
  chartBoth: string;
  wpm: string;
  accuracy: string;
  baseline: string;
  day: string;

  newSessionTitle: string;
  newSessionSubtitle: string;
  editSession: string;
  date: string;
  speedLabel: string;
  speedPlaceholder: string;
  accuracyLabel: string;
  accuracyPlaceholder: string;
  add: string;
  save: string;
  cancel: string;
  saved: string;
  updated: string;
  deleted: string;
  invalidWpm: string;
  invalidAccuracy: string;
  invalidDate: string;
  duplicate: string;

  viewEntries: string;
  viewFull: string;
  futureDate: string;


  performanceEyebrow: string;
performanceTitle: string;

  history: string;
  recordedDays: string;
  actions: string;
  noDays: string;
  csv: string;
  json: string;

  helpTitle: string;
  helpIntro: string;
  helpBullet1: string;
  helpBullet2: string;
  helpBullet3: string;
  helpBullet4: string;
  settings: string;
  settingsStart: string;
  settingsGoal: string;
  settingsBaselineWpm: string;
  settingsBaselineAcc: string;
  settingsSaved: string;
  openSettings: string;

  madeBy: string;
  footerNote: string;
};

export const translations: Record<"en" | "ar", Dict> = {
  en: {
    brand: "KeyFast",
    tagline: "Typing speed lab",
    navDashboard: "Dashboard",
    subtitle:
      "Track your WPM and accuracy by real calendar date. Days you skip stay empty — no fake points.",
    navNew: "New Day",
    navHelp: "How it works",
    reset: "Reset progress",
    resetConfirm: "Reset all progress and return to the baseline?",
    resetDone: "Progress reset.",

    themeLight: "Light mode",
    themeDark: "Dark mode",

    // stats
    streak: "Day streak",
    current: "Current speed",
    max: "Max WPM",
    maxAccuracy: "Max accuracy",
    avg: "Average accuracy",
    completed: "Days logged",
    unlimited: "unlimited",
    days: "days",

    welcomeTitle: "Welcome to KeyFast",
    welcomeBody:
      "Log your first session to start tracking speed and accuracy — or skip and explore first.",
    welcomeAdd: "Log first day",
    welcomeSkip: "Skip for now",
    emptyTitle: "No sessions yet.",
    emptyBody: "Log your first day to start seeing charts.",
    dateFormat: "Format: dd/mm/yyyy",
    invalidDateFormat: "Enter date as dd/mm/yyyy",
    githubSource: "Source on GitHub",


      performanceEyebrow: "Performance",
performanceTitle: "Three views of your progress",

    viewEntries: "Completed only",
    viewFull: "Full timeline",
    futureDate: "You can't log a future date.",

    // charts
    chartSpeed: "Speed over time",
    chartAccuracy: "Accuracy over time",
    chartBoth: "Speed & accuracy",
    wpm: "WPM",
    accuracy: "Accuracy",
    baseline: "Baseline",
    day: "Day",

    // form
    newSessionTitle: "Log a session",
    newSessionSubtitle: "Fill in your results for today or any previous day.",
    editSession: "Edit session",
    date: "Date",
    speedLabel: "Speed (WPM)",
    speedPlaceholder: "e.g. 55.5",
    accuracyLabel: "Accuracy (%)",
    accuracyPlaceholder: "e.g. 96.5",
    add: "Add result",
    save: "Save changes",
    cancel: "Cancel",
    saved: "Session saved.",
    updated: "Entry updated.",
    deleted: "Entry deleted.",
    invalidWpm: "Enter a valid WPM between 1 and 400.",
    invalidAccuracy: "Accuracy must be between 0 and 100.",
    invalidDate: "That date is outside the tracked range.",
    duplicate: "That date already has an entry.",

    // history
    history: "History",
    recordedDays: "Recorded days",
    actions: "Actions",
    noDays: "No recorded days yet.",
    csv: "CSV",
    json: "JSON",

    // help
    helpTitle: "How KeyFast works",
    helpIntro:
      "KeyFast tracks your typing speed and accuracy day by day so you can see real progress.",
    helpBullet1:
      "Log one session per day. If you skip a day it just stays empty — no fake points.",
    helpBullet2:
      "Charts are drawn from your first session date. Day 1 is your starting point.",
    helpBullet3: "Decimals are supported. Enter 55.5 or 55.05 in either field.",
    helpBullet4:
      "Everything is stored locally in your browser. Nothing leaves your device.",
    settings: "Settings",
    settingsStart: "Start date",
    settingsGoal: "Goal (days, 0 = unlimited)",
    settingsBaselineWpm: "Baseline WPM",
    settingsBaselineAcc: "Baseline accuracy (%)",
    settingsSaved: "Settings saved.",
    openSettings: "Open settings",

    // misc
    madeBy: "Made by",
    footerNote: "Stored locally in your browser",
  },
  ar: {
    brand: "KeyFast",
    tagline: "مختبر سرعة الكتابة",
    navDashboard: "لوحة التحكم",
    navNew: "جلسة جديدة",
    subtitle:
      "تابع سرعتك ودقتك حسب التاريخ الفعلي. الأيام اللي مابتتدربش فيها بتفضل فاضية — مفيش نقاط وهمية.",
    navHelp: "إزاي بيشتغل",
    reset: "إعادة الضبط",
    resetConfirm: "هل تريد إعادة ضبط كل التقدم؟",
    resetDone: "تمت إعادة الضبط.",

    themeLight: "الوضع الفاتح",
    themeDark: "الوضع الداكن",

    performanceEyebrow: "الأداء",
performanceTitle: "ثلاث زوايا لتقدمك",

    streak: "سلسلة الأيام",
    current: "السرعة الحالية",
    max: "أعلى سرعة",
    maxAccuracy: "أعلى دقة",
    avg: "متوسط الدقة",
    completed: "الأيام المسجلة",
    unlimited: "غير محدود",
    days: "أيام",

    chartSpeed: "السرعة على مدار الوقت",
    chartAccuracy: "الدقة على مدار الوقت",
    chartBoth: "السرعة والدقة",
    wpm: "WPM",
    accuracy: "الدقة",
    baseline: "خط الأساس",
    day: "اليوم",

    welcomeTitle: "أهلًا في KeyFast",
    welcomeBody:
      "سجّل أول جلسة عشان تبدأ تتابع سرعتك ودقتك — أو اسكيب واتفرج الأول.",
    welcomeAdd: "سجّل أول يوم",
    welcomeSkip: "اسكيب دلوقتي",
    emptyTitle: "مفيش جلسات لسه.",
    emptyBody: "سجّل أول يوم عشان الرسوم تبدأ تظهر.",
    dateFormat: "الصيغة: يوم/شهر/سنة",
    invalidDateFormat: "اكتب التاريخ بالشكل يوم/شهر/سنة",
    githubSource: "الكود على GitHub",

    newSessionTitle: "سجّل جلسة",
    newSessionSubtitle: "اكتب نتايجك النهاردة أو لأي يوم فاتك.",
    editSession: "تعديل الجلسة",
    date: "التاريخ",
    speedLabel: "السرعة (WPM)",
    speedPlaceholder: "مثال: 55.5",
    accuracyLabel: "الدقة (%)",
    accuracyPlaceholder: "مثال: 96.5",
    add: "أضف النتيجة",
    save: "حفظ التعديلات",
    cancel: "إلغاء",
    saved: "تم حفظ الجلسة.",
    updated: "تم تحديث النتيجة.",
    deleted: "تم حذف النتيجة.",
    invalidWpm: "أدخل سرعة بين 1 و400.",
    invalidAccuracy: "الدقة يجب أن تكون بين 0 و100.",
    invalidDate: "التاريخ خارج النطاق المسجّل.",
    duplicate: "في نتيجة مسجلة بالفعل في التاريخ ده.",

    viewEntries: "المسجّل بس",
    viewFull: "الجدول كامل",
    futureDate: "مش مسموح تسجّل تاريخ في المستقبل.",

    history: "السجل",
    recordedDays: "الأيام المسجلة",
    actions: "إجراءات",
    noDays: "لا يوجد أيام مسجلة.",
    csv: "CSV",
    json: "JSON",

    helpTitle: "KeyFast بيشتغل إزاي",
    helpIntro: "KeyFast بيتابع سرعتك ودقتك يوم بيوم عشان تشوف تقدمك الحقيقي.",
    helpBullet1:
      "سجّل جلسة واحدة كل يوم. لو فاتك يوم بيفضل فاضي — مفيش نقاط وهمية.",
    helpBullet2:
      "الرسوم البيانية بتتحسب من أول تاريخ بدأت فيه. اليوم 1 هو نقطة البداية.",
    helpBullet3: "الكسور مدعومة. اكتب 55.5 أو 55.05 في أي خانة.",
    helpBullet4:
      "كل حاجة متسجلة محليًا في المتصفح. مفيش بيانات بتطلع من جهازك.",
    settings: "الإعدادات",
    settingsStart: "تاريخ البداية",
    settingsGoal: "الهدف (بالأيام، 0 = غير محدود)",
    settingsBaselineWpm: "خط أساس السرعة",
    settingsBaselineAcc: "خط أساس الدقة (%)",
    settingsSaved: "تم حفظ الإعدادات.",
    openSettings: "افتح الإعدادات",

    madeBy: "صنع بواسطة",
    footerNote: "محفوظة محليًا في متصفحك",
  },
};

export type Lang = keyof typeof translations;
