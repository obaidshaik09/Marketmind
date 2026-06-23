export const QUIZ_BANK = {
  'javascript basics': {
    easy: [
      { question: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'function', 'define'], answer: 'let', explanation: 'let and const are block-scoped; var is function-scoped.' },
      { question: 'What does typeof null return?', options: ['"null"', '"undefined"', '"object"', '"number"'], answer: '"object"', explanation: 'typeof null is "object" — a known JavaScript quirk.' },
      { question: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], answer: 'push()', explanation: 'push() adds to the end; unshift() adds to the beginning.' },
      { question: 'What is the result of 3 + "3"?', options: ['6', '33', 'NaN', 'Error'], answer: '33', explanation: '+ coerces the number to a string and concatenates.' },
      { question: 'Which symbol is strict equality?', options: ['==', '===', '=', '!='], answer: '===', explanation: '=== compares value and type without coercion.' },
    ],
  },
  sql: {
    easy: [
      { question: 'Which clause filters rows before grouping?', options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'], answer: 'WHERE', explanation: 'WHERE filters rows; HAVING filters after GROUP BY.' },
      { question: 'Which JOIN returns only matching rows?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'CROSS JOIN'], answer: 'INNER JOIN', explanation: 'INNER JOIN returns rows matching in both tables.' },
      { question: 'What does SELECT DISTINCT do?', options: ['Sorts', 'Removes duplicates', 'Counts rows', 'Joins tables'], answer: 'Removes duplicates', explanation: 'DISTINCT returns unique values.' },
      { question: 'Which function counts non-null values?', options: ['SUM', 'AVG', 'COUNT', 'MAX'], answer: 'COUNT', explanation: 'COUNT(column) counts non-null values.' },
      { question: 'Which keyword sorts results?', options: ['SORT', 'ORDER BY', 'GROUP BY', 'ARRANGE'], answer: 'ORDER BY', explanation: 'ORDER BY sorts ascending or descending.' },
    ],
  },
  python: {
    easy: [
      { question: 'Which type is mutable and ordered?', options: ['tuple', 'list', 'str', 'frozenset'], answer: 'list', explanation: 'Lists are mutable; tuples and strings are not.' },
      { question: 'What does len([]) return?', options: ['None', '0', '1', 'Error'], answer: '0', explanation: 'An empty list has length 0.' },
      { question: 'Which keyword defines a function?', options: ['function', 'def', 'func', 'fn'], answer: 'def', explanation: 'def defines named functions in Python.' },
      { question: 'What is 5 // 2 in Python?', options: ['2.5', '2', '3', '2.0'], answer: '2', explanation: '// is floor division.' },
      { question: 'How do you add to a dict?', options: ['append()', 'dict[key] = value', 'push()', 'add()'], answer: 'dict[key] = value', explanation: 'Assign with brackets or use update().' },
    ],
  },
  excel: {
    easy: [
      { question: 'Which function looks up a value in a table?', options: ['SUMIF', 'VLOOKUP', 'COUNTA', 'CONCAT'], answer: 'VLOOKUP', explanation: 'VLOOKUP/XLOOKUP searches vertically.' },
      { question: 'What does $ in $A$1 do?', options: ['Currency', 'Absolute reference', 'Multiply', 'Nothing'], answer: 'Absolute reference', explanation: 'Absolute refs do not change when copied.' },
      { question: 'Which counts cells meeting a condition?', options: ['COUNT', 'COUNTA', 'COUNTIF', 'SUM'], answer: 'COUNTIF', explanation: 'COUNTIF counts matching a criterion.' },
      { question: 'Save shortcut on Windows?', options: ['Ctrl+S', 'Ctrl+P', 'Alt+F4', 'F5'], answer: 'Ctrl+S', explanation: 'Ctrl+S saves the workbook.' },
      { question: 'Which removes duplicate rows?', options: ['Sort', 'Filter', 'Remove Duplicates', 'Text to Columns'], answer: 'Remove Duplicates', explanation: 'Data > Remove Duplicates.' },
    ],
  },
  'behavioral interview': {
    easy: [
      { question: 'What does STAR stand for?', options: ['Skill, Task, Action, Result', 'Situation, Task, Action, Result', 'Story, Timing, Answer, Review', 'Start, Try, Adjust, Repeat'], answer: 'Situation, Task, Action, Result', explanation: 'STAR structures behavioral answers.' },
      { question: 'Best approach to "What is your weakness?"', options: ['Say none', 'Real weakness + improvement plan', 'Strength as weakness', 'Refuse'], answer: 'Real weakness + improvement plan', explanation: 'Shows self-awareness and growth.' },
      { question: 'Purpose of "Tell me about yourself"?', options: ['Test memory', 'Professional summary + communication', 'Verify GPA', 'Fill time'], answer: 'Professional summary + communication', explanation: '60–90 second career pitch.' },
      { question: 'What to do at end of interview?', options: ['Leave immediately', 'Ask thoughtful questions', 'Negotiate salary', 'Ask if you got the job'], answer: 'Ask thoughtful questions', explanation: 'Good questions show interest.' },
      { question: 'Ideal behavioral answer length?', options: ['30 sec', '1–2 min', '5+ min', 'As long as possible'], answer: '1–2 min', explanation: 'Concise STAR answers work best.' },
    ],
  },
  'resume knowledge': {
    easy: [
      { question: 'US resume length for new grad?', options: ['3–4 pages', '1 page', 'Half page', 'No limit'], answer: '1 page', explanation: 'One strong page for early career.' },
      { question: 'Include photo on US resume?', options: ['Always', 'Usually no', 'IT only', 'If asked'], answer: 'Usually no', explanation: 'US resumes typically omit photos.' },
      { question: 'What is ATS?', options: ['Interview type', 'Applicant Tracking System', 'LinkedIn feature', 'Visa category'], answer: 'Applicant Tracking System', explanation: 'Software that scans resumes for keywords.' },
      { question: 'Section to put near top?', options: ['Hobbies', 'Education or Experience', 'References', 'High school'], answer: 'Education or Experience', explanation: 'Lead with most relevant content.' },
      { question: 'Strong resume bullet format?', options: ['Duties only', 'Action verb + result + metric', 'Paragraphs', 'Manager quotes'], answer: 'Action verb + result + metric', explanation: 'Quantify impact where possible.' },
    ],
  },
  'linkedin basics': {
    easy: [
      { question: 'LinkedIn headline character limit?', options: ['50', '120', '220', '500'], answer: '220', explanation: 'Use role + value proposition.' },
      { question: 'Best profile photo style?', options: ['Group photo', 'Professional, clear face', 'No photo', 'Logo only'], answer: 'Professional, clear face', explanation: 'Professional photos get more views.' },
      { question: 'Good reason to connect?', options: ['Random add', 'Met them or shared context', 'Sell immediately', 'Inflate count'], answer: 'Met them or shared context', explanation: 'Personalize connection notes.' },
      { question: 'Summary voice?', options: ['Third person only', 'First person', 'Either', 'Bullets only'], answer: 'First person', explanation: '"I am a data analyst..." reads naturally.' },
      { question: 'What does Open to Work do?', options: ['Posts resume', 'Signals job search to recruiters', 'Auto-applies', 'Deletes job'], answer: 'Signals job search to recruiters', explanation: 'Visible to all or recruiters only.' },
    ],
  },
};

const ALIASES = {
  javascript: 'javascript basics', js: 'javascript basics', 'java basics': 'javascript basics',
  'sql basics': 'sql', 'python basics': 'python', behavioral: 'behavioral interview',
  star: 'behavioral interview', resume: 'resume knowledge', ats: 'resume knowledge', linkedin: 'linkedin basics',
};

export function resolveQuizTopic(raw) {
  const n = (raw || '').toLowerCase().trim();
  if (QUIZ_BANK[n]) return n;
  if (ALIASES[n]) return ALIASES[n];
  for (const key of Object.keys(QUIZ_BANK)) {
    if (n.includes(key) || key.includes(n)) return key;
  }
  return null;
}

export function getQuizQuestions(topic, difficulty = 'easy', count = 5) {
  const resolved = resolveQuizTopic(topic);
  if (!resolved) return null;
  const bank = QUIZ_BANK[resolved];
  const level = bank[difficulty] ? difficulty : 'easy';
  const pool = [...(bank[level] || [])];
  if (!pool.length) return null;
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return {
    topic: resolved,
    difficulty: level,
    questions: shuffled.slice(0, Math.min(count, shuffled.length)).map((q, i) => ({
      number: i + 1, question: q.question, options: q.options || null,
      answer: q.answer, explanation: q.explanation,
    })),
  };
}
