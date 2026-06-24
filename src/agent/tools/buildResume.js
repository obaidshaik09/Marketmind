export const definition = {
  name: 'build_resume',
  description:
    'Build a complete US-format resume from scratch. Use when user wants to create a new resume or has no resume yet.',
  input_schema: {
    type: 'object',
    properties: {
      full_name: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      city_state: { type: 'string' },
      linkedin: { type: 'string' },
      target_role: { type: 'string' },
      summary: { type: 'string' },
      education: { type: 'array', items: { type: 'object' } },
      experience: { type: 'array', items: { type: 'object' } },
      projects: { type: 'array', items: { type: 'object' } },
      skills: { type: 'array', items: { type: 'string' } },
      certifications: { type: 'array', items: { type: 'string' } },
    },
    required: ['full_name', 'email', 'target_role'],
  },
};

export function execute(input) {
  const {
    full_name, email, phone, city_state, linkedin, target_role, summary,
    education = [], experience = [], projects = [], skills = [], certifications = [],
  } = input;

  const contact = [full_name, email, phone, city_state, linkedin].filter(Boolean).join(' | ');
  const draftSummary =
    summary ||
    `Motivated ${target_role} with strong foundation in ${skills.slice(0, 4).join(', ') || 'relevant skills'}. Seeking to contribute and grow in a US-based role.`;

  let resume = `${full_name.toUpperCase()}\n${contact}\n\nSUMMARY\n${draftSummary}\n\n`;
  if (skills.length) resume += `SKILLS\n${skills.join(' · ')}\n\n`;
  if (experience.length) {
    resume += 'EXPERIENCE\n';
    experience.forEach((exp) => {
      resume += `${exp.title} | ${exp.company} | ${exp.dates || ''}\n`;
      (exp.bullets || []).forEach((b) => { resume += `• ${b}\n`; });
      resume += '\n';
    });
  }
  if (projects.length) {
    resume += 'PROJECTS\n';
    projects.forEach((p) => {
      resume += `${p.name}${p.tech ? ` (${p.tech})` : ''}\n• ${p.description}\n\n`;
    });
  }
  if (education.length) {
    resume += 'EDUCATION\n';
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
      'Save as .docx or plain PDF for ATS.',
      'Tailor SKILLS to each job description.',
      'Keep to 1 page for new graduates.',
    ],
  }, null, 2);
}
