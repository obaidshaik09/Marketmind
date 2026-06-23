// src/utils/formatMessage.js
//
// Ports the original app's lightweight formatting: escapes HTML first,
// then applies a small set of markdown-like replacements for bold,
// italic, headers, and bullet lists. Output is only ever used via
// dangerouslySetInnerHTML after this escaping step, mirroring the
// original behavior safely.

export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escapeForUserBubble(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

export function formatBotMessage(text) {
  let s = escapeHtml(text);

  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
  s = s.replace(
    /^### (.+)$/gm,
    '<strong class="bubble-heading-sm">$1</strong>'
  );
  s = s.replace(/^## (.+)$/gm, '<strong class="bubble-heading-lg">$1</strong>');
  s = s.replace(/^- (.+)$/gm, '<li>$1</li>');
  s = s.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  s = s.replace(/\n/g, '<br>');

  return s;
}
