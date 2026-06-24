const ACTION_VERBS = [
  'achieved', 'administered', 'analyzed', 'built', 'collaborated', 'created',
  'delivered', 'designed', 'developed', 'engineered', 'executed', 'implemented',
  'improved', 'increased', 'launched', 'led', 'managed', 'optimized', 'produced', 'reduced',
];

const WEAK_VERBS = ['helped', 'worked on', 'responsible for', 'assisted with'];

const RESUME_SECTIONS = [
  { name: 'Contact Information', patterns: [/email|phone|linkedin|@\w+\.\w+/i] },
  { name: 'Experience', patterns: [/experience|employment/i] },
  { name: 'Education', patterns: [/education|university|degree/i] },
  { name: 'Skills', patterns: [/skills|technologies/i] },
];

export const definition = {
  name: 'analyze_resume',
  description: 'Analyze resume text for US format, ATS compatibility, and improvements. Use when user pastes or attaches a resume.',
  input_schema: {
    type: 'object',
    properties: {
      resume_text: { type: 'string' },
      target_role: { type: 'string' },
    },
    required: ['resume_text'],
  },
};

export function execute({ resume_text, target_role }) {
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
  const weakVerbHits = WEAK_VERBS.filter((v) => new RegExp(v, 'i').test(text));
  const suggestions = [];
  if (!/\S+@\S+\.\S+/.test(text)) suggestions.push('Add a professional email.');
  if (bulletCount < 3) suggestions.push('Add bullet points with action verbs and metrics.');
  if (weakVerbHits.length) suggestions.push(`Replace "${weakVerbHits[0]}" with stronger verbs.`);
  return JSON.stringify({
    word_count: wordCount,
    bullet_count: bulletCount,
    sections_found: foundSections,
    sections_missing: missingSections,
    action_verbs_found: actionVerbHits.slice(0, 8),
    weak_phrases_found: weakVerbHits,
    length_assessment: wordCount > 600 ? 'Too long — aim for 1 page.' : 'Length looks good.',
    suggestions,
    target_role: target_role || 'not specified',
  }, null, 2);
}
