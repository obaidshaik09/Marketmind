import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED = {
  'text/plain': 'txt',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

function extOf(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  if (ext === 'txt') return 'txt';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  return null;
}

async function readPdf(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(' '));
  }
  return pages.join('\n').trim();
}

async function readDocx(file) {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return (result.value || '').trim();
}

async function readTxt(file) {
  return file.text();
}

export async function readAttachment(file) {
  if (!file) throw new Error('No file selected.');
  if (file.size > MAX_BYTES) {
    throw new Error('File is too large. Maximum size is 2 MB.');
  }

  const type = ALLOWED[file.type] || extOf(file.name);
  if (!type) {
    throw new Error('Unsupported file type. Please upload .txt, .pdf, or .docx');
  }

  let text = '';
  if (type === 'txt') text = await readTxt(file);
  else if (type === 'pdf') text = await readPdf(file);
  else if (type === 'docx') text = await readDocx(file);

  if (!text.trim()) {
    throw new Error('Could not extract text from this file. Try a different format.');
  }

  const MAX_CHARS = 12000;
  if (text.length > MAX_CHARS) {
    text = `${text.slice(0, MAX_CHARS)}\n\n[Truncated — file was longer than ${MAX_CHARS} characters.]`;
  }

  return { fileName: file.name, fileType: type, text };
}
