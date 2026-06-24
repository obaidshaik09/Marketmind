import { getQuizQuestions } from '../../data/quizBank';

export const definition = {
  name: 'skill_quiz',
  description: 'Generate practice quiz. Topics: JavaScript basics, SQL, Python, Excel, behavioral interview, resume knowledge, LinkedIn basics.',
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

export function execute({ topic, difficulty = 'easy', count = 5 }) {
  const quiz = getQuizQuestions(topic, difficulty, Math.min(Math.max(Math.floor(count) || 5, 1), 5));
  if (!quiz) {
    return 'Topics: JavaScript basics, SQL, Python, Excel, behavioral interview, resume knowledge, LinkedIn basics.';
  }
  return JSON.stringify({
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    questions_for_user: quiz.questions.map((q) => ({
      number: q.number, question: q.question, options: q.options,
    })),
    answer_key: quiz.questions.map((q) => ({
      number: q.number, answer: q.answer, explanation: q.explanation,
    })),
    instructions: 'Present questions, grade answers, assign one practice task.',
  }, null, 2);
}
