export const TOPICS = [
  { id: 'general', icon: '🚀', label: 'Getting Started' },
  { id: 'resume', icon: '📄', label: 'Resume & Cover Letter' },
  { id: 'portals', icon: '💼', label: 'Job Portals' },
  { id: 'linkedin', icon: '🔗', label: 'LinkedIn' },
  { id: 'interviews', icon: '🎯', label: 'Interviews' },
  { id: 'vendor', icon: '📞', label: 'Vendor & Staffing' },
  { id: 'visa', icon: '🛂', label: 'Visa & Work Auth' },
  { id: 'skills', icon: '⚡', label: 'Skill Building' },
];

export const TOPIC_LABELS = {
  general: '🚀 Getting Started',
  resume: '📄 Resume & Cover Letter',
  portals: '💼 Job Portals',
  linkedin: '🔗 LinkedIn',
  interviews: '🎯 Interviews',
  vendor: '📞 Vendor & Staffing',
  visa: '🛂 Visa & Work Auth',
  skills: '⚡ Skill Building',
};

export const FEATURES = [
  { icon: '📄', title: 'Resume Builder', desc: 'Build a US resume from scratch' },
  { icon: '📎', title: 'File Attachments', desc: 'Upload .txt, .pdf, or .docx resumes' },
  { icon: '🔗', title: 'LinkedIn Coach', desc: 'Headline, summary, networking' },
  { icon: '🎯', title: 'Interview Prep', desc: 'STAR method, mock calls' },
  { icon: '⚡', title: 'Skill-Up Plans', desc: 'Quizzes and practice tasks' },
  { icon: '🔍', title: 'Live Research', desc: 'Web search for salaries & trends' },
];

export const AUDIENCES = [
  'US Citizens',
  'Green Card Holders',
  'F-1 Students / OPT',
  'Work Visa Holders',
  'New Graduates',
  'Career Changers',
];

export const STARTER_PROMPTS = {
  general: [
    { title: 'Start job search', subtitle: 'New grad roadmap', prompt: 'I just graduated — how do I start my US job search?' },
    { title: 'Salary research', subtitle: 'Live web search', prompt: 'What are entry-level data analyst salaries in Texas?' },
    { title: 'Career switch', subtitle: 'Into IT', prompt: 'How do I switch careers into IT with no experience?' },
    { title: 'OPT guidance', subtitle: 'International students', prompt: 'I am on OPT — what should I focus on first?' },
  ],
  resume: [
    { title: 'Build from scratch', subtitle: 'No resume yet', prompt: 'Help me build a resume from scratch — I am a new grad' },
    { title: 'Step-by-step', subtitle: 'Walk me through', prompt: 'I have no resume yet — walk me through creating one step by step' },
    { title: 'ATS tips', subtitle: 'Pass the scanner', prompt: 'What is ATS and how do I pass it?' },
    { title: 'Review resume', subtitle: 'Attach or paste', prompt: 'Review my resume — what should I improve?' },
  ],
  portals: [
    { title: 'IT job sites', subtitle: 'Where to apply', prompt: 'Which job portals should I use for IT roles?' },
    { title: 'Indeed profile', subtitle: 'Stand out', prompt: 'How do I set up a strong Indeed profile?' },
    { title: 'Student sites', subtitle: 'International', prompt: 'Best job sites for international students?' },
    { title: 'Handshake', subtitle: 'Campus jobs', prompt: 'How do I use Handshake as a student?' },
  ],
  linkedin: [
    { title: 'Headline', subtitle: 'First impression', prompt: 'How do I write a strong LinkedIn headline?' },
    { title: 'Summary', subtitle: 'About section', prompt: 'What should my LinkedIn summary include?' },
    { title: 'Recruiters', subtitle: 'Outreach tips', prompt: 'How do I reach out to recruiters on LinkedIn?' },
    { title: 'No US experience', subtitle: 'Still stand out', prompt: 'LinkedIn tips with no US work experience' },
  ],
  interviews: [
    { title: 'Tell me about yourself', subtitle: 'Opening question', prompt: 'How do I answer "Tell me about yourself"?' },
    { title: 'STAR method', subtitle: 'Behavioral', prompt: 'Explain the STAR method for behavioral interviews' },
    { title: 'Technical prep', subtitle: 'Junior devs', prompt: 'Common technical interview questions for junior developers' },
    { title: 'Phone screen', subtitle: 'First round', prompt: 'How do I prepare for a phone screen?' },
  ],
  vendor: [
    { title: 'Vendor calls', subtitle: 'What to expect', prompt: 'What is a vendor call and how do I prepare?' },
    { title: 'Red flags', subtitle: 'Staffing agencies', prompt: 'Red flags to watch for with staffing agencies' },
    { title: 'Rate negotiation', subtitle: 'Contract roles', prompt: 'How do I negotiate a contract rate?' },
    { title: 'W2 vs C2C', subtitle: 'Know the difference', prompt: 'W2 vs C2C — what should I know as a job seeker?' },
  ],
  visa: [
    { title: 'OPT basics', subtitle: 'Job search', prompt: 'What is OPT and how does it work for job search?' },
    { title: 'CPT', subtitle: 'While studying', prompt: 'Can I work on CPT while studying?' },
    { title: 'H-1B', subtitle: 'Sponsorship', prompt: 'What should I know about H-1B sponsorship?' },
    { title: 'Disclosure', subtitle: 'When to tell employers', prompt: 'Do I tell employers about my visa status?' },
  ],
  skills: [
    { title: 'JavaScript plan', subtitle: '2-week skill-up', prompt: 'Give me a 2-week JavaScript skill-up plan with practice tasks' },
    { title: 'SQL quiz', subtitle: 'Test your skills', prompt: 'Quiz me on 5 SQL basics then assign homework' },
    { title: 'Business analyst', subtitle: 'Required skills', prompt: 'What skills do I need for a business analyst role?' },
    { title: 'Excel plan', subtitle: 'Weekly tasks', prompt: 'Create a skill-up plan for Excel with weekly tasks' },
  ],
};

// Quick prompts for mid-chat popover (first 2 per topic)
export function getQuickPrompts(topicId) {
  const prompts = STARTER_PROMPTS[topicId] || STARTER_PROMPTS.general;
  return prompts.slice(0, 2);
}
