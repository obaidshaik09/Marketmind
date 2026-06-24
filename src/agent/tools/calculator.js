export const definition = {
  name: 'calculator',
  description: 'Evaluate math for salary comparisons, hourly-to-annual rate, offer comparisons.',
  input_schema: {
    type: 'object',
    properties: {
      expression: { type: 'string', description: 'Math expression: numbers and + - * / ( ) % only.' },
    },
    required: ['expression'],
  },
};

export function execute({ expression }) {
  if (!/^[0-9\s+\-*/().%]+$/.test(expression)) {
    return 'Error: only numbers and + - * / ( ) % allowed.';
  }
  try {
    const js = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${js});`)();
    if (typeof result !== 'number' || !Number.isFinite(result)) return 'Error: invalid result.';
    return String(result);
  } catch (err) {
    return `Error: ${err.message}`;
  }
}
