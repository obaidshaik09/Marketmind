import { getSkillUpPlan } from '../../data/skillUpBank';

export const definition = {
  name: 'skill_up',
  description:
    'Generate skill-up plan with weekly goals, resources, and practice tasks. Skills: JavaScript, SQL, Python, Excel, data analyst, business analyst, communication, resume.',
  input_schema: {
    type: 'object',
    properties: {
      skill: { type: 'string' },
      level: { type: 'string', enum: ['beginner', 'intermediate'] },
      weeks: { type: 'number' },
    },
    required: ['skill'],
  },
};

export function execute({ skill, level = 'beginner', weeks }) {
  const plan = getSkillUpPlan(skill, level, weeks);
  if (!plan) {
    return 'Available: JavaScript, SQL, Python, Excel, data analyst, business analyst, communication, resume writing.';
  }
  return JSON.stringify({
    ...plan,
    instructions: 'Walk through week by week. Offer skill_quiz after each week.',
  }, null, 2);
}
