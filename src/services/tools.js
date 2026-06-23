import { getQuizQuestions } from '../data/quizBank';
import { getSkillUpPlan } from '../data/skillUpBank';

const SERPAPI_KEY = process.env.REACT_APP_SERPAPI_API_KEY || '';
const API_BASE = process.env.REACT_APP_API_URL || '';

async function callServerTool(endpoint, body) {
  try {
    const res = await fetch(`${API_BASE}/api/tools/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      return data.result;
    }
  } catch {
    // Server not running — fall through to browser attempt
  }
  return null;
}

const ACTION_VERBS = [
  'achieved', 'administered', 'analyzed', 'built', 'collaborated', 'created',
  'delivered', 'designed', 'developed', 'engineered', 'executed', 'generated',
  'implemented', 'improved', 'increased', 'launched', 'led', 'managed', 'optimized',
  'organized', 'produced', 'reduced', 'resolved', 'streamlined', 'supervised',
];

const WEAK_VERBS = ['helped', 'worked on', 'responsible for', 'assisted with', 'was involved in'];

const RESUME_SECTIONS = [
  { name: 'Contact Information', patterns: [/email|phone|linkedin|github|@\w+\.\w+/i] },
  { name: 'Summary or Objective', patterns: [/summary|objective|profile/i] },
  { name: 'Experience', patterns: [/experience|employment|work history/i] },
  { name: 'Education', patterns: [/education|university|college|bachelor|master|degree/i] },
  { name: 'Skills', patterns: [/skills|technologies|competencies|tools/i] },
  { name: 'Projects', patterns: [/projects|portfolio/i] },
  { name: 'Certifications', patterns: [/certification|certified|certificate/i] },
];

// ── WEB SEARCH ──────────────────────────────────────────────────────────────
const webSearchDefinition = {
  name: 'web_search',
  description:
    'Search the web for current salary data, job market trends, visa updates, or hiring news. ALWAYS use when user asks about current salaries, trends, or recent information.',
  input_schema: {
    type: 'object',
    properties: { query: { type: 'string', description: 'Short specific search query.' } },
    required: ['query'],
  },
};

async function executeWebSearch({ query }) {
  const serverResult = await callServerTool('web-search', { query });
  if (serverResult) return serverResult;

  if (!SERPAPI_KEY) {
    return 'Web search needs the backend server running (npm run server) with SERPAPI_API_KEY in server/.env — OR add REACT_APP_SERPAPI_API_KEY to .env and restart. Get a free key at serpapi.com.';
  }
  try {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=5`;
    const response = await fetch(url);
    if (!response.ok) return `Web search failed (status ${response.status}). Start the server: cd server && npm start`;
    const data = await response.json();
    const results = (data.organic_results || []).slice(0, 5);
    if (!results.length) return `No results for "${query}".`;
    return results.map((r, i) => `${i + 1}. ${r.title}\n${r.snippet || ''}\nSource: ${r.link}`).join('\n\n');
  } catch (err) {
    return `Web search failed: ${err.message}. Run the backend server (npm run server) with SERPAPI_API_KEY in server/.env.`;
  }
}

// ── FETCH URL ───────────────────────────────────────────────────────────────
const fetchUrlDefinition = {
  name: 'fetch_url',
  description:
    'Fetch and read a job posting or web page URL. ALWAYS use when user shares a link. Requires backend server for most sites (Indeed, LinkedIn block browser requests).',
  input_schema: {
    type: 'object',
    properties: { url: { type: 'string', description: 'Full http:// or https:// URL.' } },
    required: ['url'],
  },
};

function stripHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

async function executeFetchUrl({ url }) {
  const serverResult = await callServerTool('fetch-url', { url });
  if (serverResult) return serverResult;

  let parsed;
  try { parsed = new URL(url); } catch { return `Error: "${url}" is not a valid URL.`; }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return 'Error: only http/https URLs.';
  try {
    const response = await fetch(parsed.toString());
    if (!response.ok) return `Could not fetch (status ${response.status}). Run backend: npm run server`;
    const text = stripHtml(await response.text());
    return text.length > 6000 ? `${text.slice(0, 6000)}\n\n[Truncated.]` : text;
  } catch (err) {
    return `Fetch failed: ${err.message}. Job sites block browser requests — start the backend server (npm run server) and try again.`;
  }
}

// ── CALCULATOR ──────────────────────────────────────────────────────────────
const calculatorDefinition = {
  name: 'calculator',
  description: 'Evaluate math for salary comparisons, hourly-to-annual rate, offer comparisons.',
  input_schema: {
    type: 'object',
    properties: { expression: { type: 'string', description: 'Math expression: numbers and + - * / ( ) % only.' } },
    required: ['expression'],
  },
};

function executeCalculator({ expression }) {
  if (!/^[0-9\s+\-*/().%]+$/.test(expression)) return 'Error: only numbers and + - * / ( ) % allowed.';
  try {
    const js = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${js});`)();
    if (typeof result !== 'number' || !Number.isFinite(result)) return 'Error: invalid result.';
    return String(result);
  } catch (err) { return `Error: ${err.message}`; }
}

// ── BUILD RESUME FROM SCRATCH ───────────────────────────────────────────────
const buildResumeDefinition = {
  name: 'build_resume',
  description:
    'Build a complete US-format resume from scratch using the user\'s details. Use when user wants to create a new resume, has no resume yet, or asks to build one step by step. Collect info via conversation then call this tool.',
  input_schema: {
    type: 'object',
    properties: {
      full_name: { type: 'string', description: 'Full name.' },
      email: { type: 'string', description: 'Professional email.' },
      phone: { type: 'string', description: 'Phone number.' },
      city_state: { type: 'string', description: 'City, State (e.g. Dallas, TX).' },
      linkedin: { type: 'string', description: 'LinkedIn URL (optional).' },
      target_role: { type: 'string', description: 'Target job title (e.g. Junior Software Engineer).' },
      summary: { type: 'string', description: '2-3 sentence professional summary (optional — tool can draft one).' },
      education: {
        type: 'array',
        description: 'Education entries.',
        items: {
          type: 'object',
          properties: {
            school: { type: 'string' },
            degree: { type: 'string' },
            graduation_year: { type: 'string' },
            gpa: { type: 'string' },
          },
        },
      },
      experience: {
        type: 'array',
        description: 'Work/internship experience.',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            company: { type: 'string' },
            dates: { type: 'string' },
            bullets: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      projects: {
        type: 'array',
        description: 'Projects (great for new grads).',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            tech: { type: 'string' },
          },
        },
      },
      skills: { type: 'array', items: { type: 'string' }, description: 'Technical and soft skills.' },
      certifications: { type: 'array', items: { type: 'string' }, description: 'Certifications (optional).' },
    },
    required: ['full_name', 'email', 'target_role'],
  },
};

function executeBuildResume(input) {
  const {
    full_name, email, phone, city_state, linkedin, target_role, summary,
    education = [], experience = [], projects = [], skills = [], certifications = [],
  } = input;

  const contact = [full_name, email, phone, city_state, linkedin].filter(Boolean).join(' | ');
  const draftSummary = summary || `Motivated ${target_role} with strong foundation in ${skills.slice(0, 4).join(', ') || 'relevant skills'}. Seeking to contribute technical ability and eagerness to learn in a US-based role.`;

  let resume = `${full_name.toUpperCase()}\n${contact}\n\n`;
  resume += `SUMMARY\n${draftSummary}\n\n`;

  if (skills.length) {
    resume += `SKILLS\n${skills.join(' · ')}\n\n`;
  }

  if (experience.length) {
    resume += `EXPERIENCE\n`;
    experience.forEach((exp) => {
      resume += `${exp.title} | ${exp.company} | ${exp.dates || ''}\n`;
      (exp.bullets || []).forEach((b) => { resume += `• ${b}\n`; });
      resume += '\n';
    });
  }

  if (projects.length) {
    resume += `PROJECTS\n`;
    projects.forEach((p) => {
      resume += `${p.name}${p.tech ? ` (${p.tech})` : ''}\n`;
      resume += `• ${p.description}\n\n`;
    });
  }

  if (education.length) {
    resume += `EDUCATION\n`;
    education.forEach((edu) => {
      const gpa = edu.gpa ? ` | GPA: ${edu.gpa}` : '';
      resume += `${edu.degree} | ${edu.school} | ${edu.graduation_year || ''}${gpa}\n`;
    });
    resume += '\n';
  }

  if (certifications.length) {
    resume += `CERTIFICATIONS\n${certifications.map((c) => `• ${c}`).join('\n')}\n`;
  }

  return JSON.stringify({
    resume_text: resume.trim(),
    format: 'US one-page ATS-friendly',
    tips: [
      'Save as .docx or plain PDF for ATS systems.',
      'Tailor the SKILLS section to match each job description.',
      'Keep to 1 page if you are a new graduate or early career.',
      'Use strong action verbs: Developed, Implemented, Led, Analyzed.',
    ],
    next_steps: [
      'Ask me to analyze this resume with analyze_resume.',
      'Share a job URL to tailor keywords with fetch_url.',
    ],
  }, null, 2);
}

// ── ANALYZE RESUME ──────────────────────────────────────────────────────────
const analyzeResumeDefinition = {
  name: 'analyze_resume',
  description: 'Analyze pasted resume text for US format, ATS compatibility, and improvements.',
  input_schema: {
    type: 'object',
    properties: {
      resume_text: { type: 'string' },
      target_role: { type: 'string' },
    },
    required: ['resume_text'],
  },
};

function executeAnalyzeResume({ resume_text, target_role }) {
  const text = (resume_text || '').trim();
  if (!text) return 'Error: no resume text provided.';
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const bulletCount = (text.match(/^[\s]*[-•*]/gm) || []).length;
  const foundSections = [];
  const missingSections = [];
  for (const s of RESUME_SECTIONS) {
    (s.patterns.some((p) => p.test(text)) ? foundSections : missingSections).push(s.name);
  }
  const actionVerbHits = ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, 'i').test(text));
  const weakVerbHits = WEAK_VERBS.filter((v) => new RegExp(v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(text));
  const suggestions = [];
  if (!/\S+@\S+\.\S+/.test(text)) suggestions.push('Add a professional email.');
  if (bulletCount < 3) suggestions.push('Add bullet points with action verbs and metrics.');
  if (weakVerbHits.length) suggestions.push(`Replace "${weakVerbHits[0]}" with stronger verbs.`);
  return JSON.stringify({
    word_count: wordCount, bullet_count: bulletCount,
    sections_found: foundSections, sections_missing: missingSections,
    action_verbs_found: actionVerbHits.slice(0, 8), weak_phrases_found: weakVerbHits,
    length_assessment: wordCount > 600 ? 'Too long — aim for 1 page.' : 'Length OK.',
    suggestions, target_role: target_role || 'not specified',
  }, null, 2);
}

// ── SKILL QUIZ ──────────────────────────────────────────────────────────────
const skillQuizDefinition = {
  name: 'skill_quiz',
  description: 'Generate a practice quiz. Topics: JavaScript basics, SQL, Python, Excel, behavioral interview, resume knowledge, LinkedIn basics.',
  input_schema: {
    type: 'object',
    properties: {
      topic: { type: 'string' },
      difficulty: { type: 'string', enum: ['easy', 'medium'] },
      count: { type: 'number' },
    },
    required: ['topic'],
  },
};

function executeSkillQuiz({ topic, difficulty = 'easy', count = 5 }) {
  const quiz = getQuizQuestions(topic, difficulty, Math.min(Math.max(Math.floor(count) || 5, 1), 5));
  if (!quiz) return 'Topics: JavaScript basics, SQL, Python, Excel, behavioral interview, resume knowledge, LinkedIn basics.';
  return JSON.stringify({
    topic: quiz.topic, difficulty: quiz.difficulty,
    questions_for_user: quiz.questions.map((q) => ({ number: q.number, question: q.question, options: q.options })),
    answer_key: quiz.questions.map((q) => ({ number: q.number, answer: q.answer, explanation: q.explanation })),
    instructions: 'Present questions, grade answers, explain mistakes, assign one practice task.',
  }, null, 2);
}

// ── SKILL UP (learning paths + tasks) ─────────────────────────────────────
const skillUpDefinition = {
  name: 'skill_up',
  description:
    'Generate a structured skill-up plan with weekly goals, resources, and hands-on practice tasks. Use when user wants to learn or improve a skill. Skills: JavaScript, SQL, Python, Excel, data analyst, business analyst, communication, resume.',
  input_schema: {
    type: 'object',
    properties: {
      skill: { type: 'string', description: 'Skill to learn (e.g. JavaScript, SQL, Excel).' },
      level: { type: 'string', enum: ['beginner', 'intermediate'], description: 'Defaults to beginner.' },
      weeks: { type: 'number', description: 'Plan duration in weeks (optional).' },
    },
    required: ['skill'],
  },
};

function executeSkillUp({ skill, level = 'beginner', weeks }) {
  const plan = getSkillUpPlan(skill, level, weeks);
  if (!plan) {
    return 'Available skills: JavaScript, SQL, Python, Excel, data analyst, business analyst, communication, resume writing.';
  }
  return JSON.stringify({
    ...plan,
    instructions: 'Walk the user through the plan week by week. After each week, offer a skill_quiz to test progress.',
  }, null, 2);
}

const TOOLS = [
  { definition: webSearchDefinition, execute: executeWebSearch },
  { definition: fetchUrlDefinition, execute: executeFetchUrl },
  { definition: calculatorDefinition, execute: executeCalculator },
  { definition: buildResumeDefinition, execute: executeBuildResume },
  { definition: analyzeResumeDefinition, execute: executeAnalyzeResume },
  { definition: skillQuizDefinition, execute: executeSkillQuiz },
  { definition: skillUpDefinition, execute: executeSkillUp },
];

export function getToolDefinitions() { return TOOLS.map((t) => t.definition); }

export async function runTool(name, input) {
  const tool = TOOLS.find((t) => t.definition.name === name);
  if (!tool) return `Error: unknown tool "${name}".`;
  try { return await tool.execute(input); } catch (err) { return `Error: ${err.message}`; }
}

export function isWebSearchConfigured() { return Boolean(SERPAPI_KEY); }

export async function isServerAvailable() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch { return false; }
}
