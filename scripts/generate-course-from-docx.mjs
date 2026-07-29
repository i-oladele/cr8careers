import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const [, , sourcePath, outputPath] = process.argv;
if (!sourcePath || !outputPath) {
  console.error('Usage: node scripts/generate-course-from-docx.mjs <course.docx> <migration.sql>');
  process.exit(1);
}

// Confirm the source exists before invoking unzip so failures are easier to diagnose.
readFileSync(sourcePath);
const xml = execFileSync('unzip', ['-p', sourcePath, 'word/document.xml'], { encoding: 'utf8' });

const decodeXml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const paragraphs = [...xml.matchAll(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g)]
  .map(([, paragraph]) => decodeXml(
    [...paragraph.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>|<w:(?:tab|br)\s*\/>/g)]
      .map(match => match[1] ?? ' ')
      .join('')
  ).replace(/\s+/g, ' ').trim())
  .filter(Boolean);

const slug = (value) => value.toLowerCase()
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
const escapeHtml = (value) => value
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const contentHtml = (items) => items.map((text) => {
  const escaped = escapeHtml(text);
  if (/^(CASE STUDY|Why This Programme|What You'll|From Technical|Course Closing)/i.test(text)
      || (/^[A-Z][A-Z\s·&.-]+$/.test(text) && text.length < 100)) {
    return `<h4>${escaped}</h4>`;
  }
  if (/^\d+\.\s/.test(text) || /^[A-Z] —/.test(text)) return `<p><strong>${escaped}</strong></p>`;
  return `<p>${escaped}</p>`;
}).join('\n');
const duration = (items) => {
  const words = items.join(' ').split(/\s+/).filter(Boolean).length;
  return `${Math.max(10, Math.ceil((words / 180) / 5) * 5)} min`;
};

function parseQuestions(items, idPrefix) {
  const questions = [];
  let current = null;
  for (const line of items) {
    const questionMatch = line.match(/^Q(\d+)\.\s*(.+)$/);
    if (questionMatch) {
      if (current) questions.push(current);
      current = {
        id: `${idPrefix}-q${questionMatch[1]}`,
        question: questionMatch[2],
        type: 'single',
        options: [],
        correctAnswers: [],
      };
      continue;
    }
    const optionMatch = line.match(/^([A-D])\.\s*(.+)$/);
    if (current && optionMatch) {
      const optionId = optionMatch[1].toLowerCase();
      const isCorrect = /✓/.test(optionMatch[2]);
      current.options.push({ id: optionId, text: optionMatch[2].replace(/\s*✓\s*$/, '').trim() });
      if (isCorrect) current.correctAnswers.push(optionId);
    }
  }
  if (current) questions.push(current);
  for (const question of questions) {
    if (question.options.length !== 4 || question.correctAnswers.length !== 1) {
      throw new Error(`Invalid assessment question: ${question.id}`);
    }
  }
  return questions;
}

const moduleHeaders = paragraphs
  .map((text, index) => ({ text, index, match: text.match(/^Module (\d+)\s+[—-]\s+(.+)$/) }))
  .filter(item => item.match);
if (moduleHeaders.length !== 10) throw new Error(`Expected 10 modules, found ${moduleHeaders.length}`);

const prologueStart = paragraphs.indexOf('PROLOGUE');
const firstWeek = paragraphs.findIndex(text => /^Week 1$/.test(text));
const introduction = paragraphs.slice(prologueStart, firstWeek);

const modules = moduleHeaders.map((header, moduleIndex) => {
  const number = Number(header.match[1]);
  const title = header.match[2];
  const end = moduleHeaders[moduleIndex + 1]?.index ?? paragraphs.length;
  const body = paragraphs.slice(header.index + 1, end);
  const finalAssessmentIndex = body.indexOf('Final Assessment');
  const closingIndex = body.indexOf('Course Closing Remark');
  const assessmentIndex = body.indexOf('Check Your Understanding');
  const contentEnd = assessmentIndex >= 0 ? assessmentIndex : body.length;
  const content = body.slice(0, contentEnd);
  const sectionStarts = content
    .map((text, index) => ({ text, index, match: text.match(new RegExp(`^${number}\\.(\\d+)\\s+(.+)$`)) }))
    .filter(item => item.match);

  const lessons = [];
  const firstSectionIndex = sectionStarts[0]?.index ?? content.length;
  const overview = content.slice(0, firstSectionIndex).filter(text => !/^Week \d+$/.test(text));
  if (moduleIndex === 0) overview.unshift(...introduction);
  if (overview.length) {
    lessons.push({
      id: `module-${number}-overview`, title: moduleIndex === 0 ? 'Programme Introduction' : `Module ${number} Overview`,
      content: contentHtml(overview), duration: duration(overview), type: 'text',
    });
  }

  sectionStarts.forEach((section, sectionIndex) => {
    const sectionEnd = sectionStarts[sectionIndex + 1]?.index ?? content.length;
    const sectionBody = content.slice(section.index + 1, sectionEnd);
    lessons.push({
      id: `module-${number}-${slug(section.match[2])}`,
      title: section.match[2], content: contentHtml(sectionBody), duration: duration(sectionBody), type: 'text',
    });
  });

  if (assessmentIndex >= 0) {
    const quizEnd = finalAssessmentIndex >= 0 ? finalAssessmentIndex : (closingIndex >= 0 ? closingIndex : body.length);
    const questions = parseQuestions(body.slice(assessmentIndex + 1, quizEnd), `module-${number}-assessment`);
    lessons.push({
      id: `module-${number}-assessment`, title: `Module ${number} Assessment`,
      content: '<p>Test your understanding before moving ahead.</p>', duration: '10 min', type: 'quiz', quizQuestions: questions,
    });
  }

  if (finalAssessmentIndex >= 0) {
    const finalEnd = closingIndex >= 0 ? closingIndex : body.length;
    lessons.push({
      id: 'final-assessment', title: 'Final Assessment',
      content: '<p>Complete the final assessment to demonstrate your mastery of the programme.</p>',
      duration: '20 min', type: 'quiz',
      quizQuestions: parseQuestions(body.slice(finalAssessmentIndex + 1, finalEnd), 'final-assessment'),
    });
  }
  if (closingIndex >= 0) {
    const closing = body.slice(closingIndex + 1);
    lessons.push({
      id: 'course-closing-remark', title: 'Course Closing Remark', content: contentHtml(closing),
      duration: duration(closing), type: 'text',
    });
  }

  return {
    id: `module-${number}-${slug(title)}`,
    title,
    description: `Week ${number <= 4 ? 1 : number <= 6 ? 2 : 3} · Emotional intelligence for hospitality leadership`,
    lessons,
  };
});

const course = {
  id: 'calm-in-the-rush-emotional-intelligence-hospitality-leaders',
  title: 'The Calm in the Rush: Emotional Intelligence & Peak Performance Under Pressure',
  description: "A three-week leadership and soft-skills programme for hospitality leaders. Follow one General Manager's journey from crisis to composure while mastering emotional intelligence, communication, conflict resolution, resilient leadership, decision-making, and sustainable peak performance.",
  duration: '3 Weeks | Self-Paced',
  level: 'Intermediate',
  price: 'Free',
  category: 'Leadership',
  instructor: 'Cre8career',
  modules,
};

const sqlString = (value) => `'${String(value).replaceAll("'", "''")}'`;
const sql = `-- Generated from: ${basename(sourcePath)}\n-- Re-run safely: the stable course id makes this migration idempotent.\n\ninsert into public.courses (\n  id, title, description, duration, level, price, category, instructor, modules, thumbnail_url\n) values (\n  ${sqlString(course.id)},\n  ${sqlString(course.title)},\n  ${sqlString(course.description)},\n  ${sqlString(course.duration)},\n  ${sqlString(course.level)},\n  ${sqlString(course.price)},\n  ${sqlString(course.category)},\n  ${sqlString(course.instructor)},\n  ${sqlString(JSON.stringify(course.modules))}::jsonb,\n  ''\n)\non conflict (id) do update set\n  title = excluded.title, description = excluded.description, duration = excluded.duration,\n  level = excluded.level, price = excluded.price, category = excluded.category,\n  instructor = excluded.instructor, modules = excluded.modules,\n  thumbnail_url = coalesce(nullif(public.courses.thumbnail_url, ''), excluded.thumbnail_url),\n  updated_at = now();\n`;

writeFileSync(outputPath, sql);
console.log(JSON.stringify({
  outputPath,
  modules: modules.length,
  lessons: modules.reduce((total, module) => total + module.lessons.length, 0),
  quizQuestions: modules.flatMap(module => module.lessons).reduce((total, lesson) => total + (lesson.quizQuestions?.length ?? 0), 0),
}, null, 2));
