// Learning paths and hands-on practice tasks for the skill_up tool.

export const SKILL_PATHS = {
  javascript: {
    label: 'JavaScript',
    beginner: {
      weeks: 2,
      goals: ['Variables, functions, arrays', 'DOM basics', 'Async/await intro'],
      resources: ['freeCodeCamp JS', 'MDN JavaScript Guide', 'JavaScript.info'],
      tasks: [
        'Build a to-do list app that adds/removes items in the browser.',
        'Write a function that fetches data from a public API and displays it.',
        'Practice 10 array methods: map, filter, reduce on sample data.',
      ],
    },
    intermediate: {
      weeks: 4,
      goals: ['ES6+ features', 'Fetch API', 'Basic algorithms'],
      resources: ['Eloquent JavaScript', 'LeetCode Easy JS', 'Frontend Mentor'],
      tasks: [
        'Build a weather app using a free API.',
        'Solve 5 LeetCode easy array/string problems.',
        'Refactor callback code to async/await.',
      ],
    },
  },
  sql: {
    label: 'SQL',
    beginner: {
      weeks: 2,
      goals: ['SELECT, WHERE, ORDER BY', 'JOINs', 'GROUP BY'],
      resources: ['SQLBolt', 'Mode SQL Tutorial', 'W3Schools SQL'],
      tasks: [
        'Write 10 queries on a sample employees database.',
        'Join two tables and filter results with WHERE.',
        'Calculate averages and counts with GROUP BY.',
      ],
    },
  },
  python: {
    label: 'Python',
    beginner: {
      weeks: 2,
      goals: ['Syntax, loops, functions', 'Lists & dicts', 'File handling'],
      resources: ['Python.org tutorial', 'Automate the Boring Stuff', 'HackerRank Python'],
      tasks: [
        'Write a script that reads a CSV and prints summary stats.',
        'Build a simple contact book using a dictionary.',
        'Solve 5 HackerRank Python easy challenges.',
      ],
    },
  },
  excel: {
    label: 'Excel',
    beginner: {
      weeks: 2,
      goals: ['Formulas, VLOOKUP', 'Pivot tables', 'Charts'],
      resources: ['Excel Easy', 'LinkedIn Learning Excel', 'YouTube ExcelIsFun'],
      tasks: [
        'Create a budget spreadsheet with SUM and percentage formulas.',
        'Build a pivot table from sample sales data.',
        'Use VLOOKUP to match employee IDs to departments.',
      ],
    },
  },
  'data analyst': {
    label: 'Data Analyst',
    beginner: {
      weeks: 4,
      goals: ['Excel + SQL basics', 'Data visualization', 'Basic statistics'],
      resources: ['Google Data Analytics Certificate', 'Kaggle Learn', 'Tableau Public'],
      tasks: [
        'Analyze a Kaggle dataset and write 5 insights with charts.',
        'Write SQL queries to answer business questions on sample data.',
        'Build a Tableau dashboard with 3 visualizations.',
      ],
    },
  },
  'business analyst': {
    label: 'Business Analyst',
    beginner: {
      weeks: 3,
      goals: ['Requirements gathering', 'User stories', 'Process mapping'],
      resources: ['IIBA BABOK overview', 'Coursera BA courses', 'Lucidchart'],
      tasks: [
        'Write 10 user stories for a mobile banking app feature.',
        'Draw a current-state vs future-state process flow.',
        'Create a requirements document for a sample project.',
      ],
    },
  },
  communication: {
    label: 'Professional Communication',
    beginner: {
      weeks: 2,
      goals: ['STAR method', 'Email etiquette', 'Presentation skills'],
      resources: ['Toastmasters', 'LinkedIn Learning soft skills'],
      tasks: [
        'Write 3 STAR-format answers for common interview questions.',
        'Draft a professional follow-up email after an interview.',
        'Record a 2-minute "Tell me about yourself" pitch.',
      ],
    },
  },
  resume: {
    label: 'Resume Writing',
    beginner: {
      weeks: 1,
      goals: ['US format', 'ATS keywords', 'Action verbs + metrics'],
      resources: ['MarketMind resume builder', 'Jobscan.co', 'Harvard resume guide'],
      tasks: [
        'Use build_resume tool to create your first draft.',
        'Rewrite 5 bullets with action verb + metric format.',
        'Tailor resume keywords to one target job posting.',
      ],
    },
  },
};

const ALIASES = {
  js: 'javascript', 'java script': 'javascript',
  'data analysis': 'data analyst', ba: 'business analyst',
  interview: 'communication', star: 'communication',
};

export function resolveSkillPath(skill) {
  const n = (skill || '').toLowerCase().trim();
  if (SKILL_PATHS[n]) return SKILL_PATHS[n];
  if (ALIASES[n]) return SKILL_PATHS[ALIASES[n]];
  for (const key of Object.keys(SKILL_PATHS)) {
    if (n.includes(key) || key.includes(n)) return SKILL_PATHS[key];
  }
  return null;
}

export function getSkillUpPlan(skill, level = 'beginner', weeks) {
  const path = resolveSkillPath(skill);
  if (!path) return null;
  const plan = path[level] || path.beginner;
  if (!plan) return null;
  const duration = weeks || plan.weeks;
  return {
    skill: path.label,
    level,
    duration_weeks: duration,
    weekly_goals: plan.goals,
    recommended_resources: plan.resources,
    hands_on_tasks: plan.tasks,
    tip: 'Complete one task per day. Ask MarketMind to quiz you when ready.',
  };
}
