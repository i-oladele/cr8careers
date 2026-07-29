import { X } from 'lucide-react';
import { QuizQuestion } from '../../data/courseContent';
import { uid } from './ids';

export function QuizBuilder({ questions, onChange }: { questions: QuizQuestion[]; onChange: (qs: QuizQuestion[]) => void }) {
  const newQuestion = (): QuizQuestion => ({
    id: uid('q'),
    question: '',
    type: 'single',
    options: [
      { id: uid('o'), text: '' },
      { id: uid('o'), text: '' },
    ],
    correctAnswers: [],
  });

  const updateQuestion = (qId: string, patch: Partial<QuizQuestion>) => {
    onChange(questions.map(q => q.id === qId ? { ...q, ...patch } : q));
  };

  const addOption = (qId: string) => {
    onChange(questions.map(q => q.id === qId
      ? { ...q, options: [...q.options, { id: uid('o'), text: '' }] }
      : q
    ));
  };

  const updateOption = (qId: string, oId: string, text: string) => {
    onChange(questions.map(q => q.id === qId
      ? { ...q, options: q.options.map(o => o.id === oId ? { ...o, text } : o) }
      : q
    ));
  };

  const removeOption = (qId: string, oId: string) => {
    onChange(questions.map(q => q.id === qId
      ? { ...q, options: q.options.filter(o => o.id !== oId), correctAnswers: (q.correctAnswers ?? []).filter(a => a !== oId) }
      : q
    ));
  };

  const toggleCorrect = (q: QuizQuestion, oId: string) => {
    let next: string[];
    if (q.type === 'single') {
      next = [oId];
    } else {
      const correctAnswers = q.correctAnswers ?? [];
      next = correctAnswers.includes(oId)
        ? correctAnswers.filter(a => a !== oId)
        : [...correctAnswers, oId];
    }
    updateQuestion(q.id, { correctAnswers: next });
  };

  return (
    <div className="space-y-3">
      {questions.length === 0 && (
        <p className="text-sm text-gray-400 font-['DM_Sans',sans-serif] text-center py-3">No questions yet. Add your first question.</p>
      )}
      {questions.map((q, qi) => (
        <div key={q.id} className="border border-gray-200 rounded-lg p-3 bg-white space-y-3">
          {/* Question header */}
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-gray-500 mt-2.5 shrink-0 font-['DM_Sans',sans-serif]">Q{qi + 1}</span>
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-['DM_Sans',sans-serif] focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Enter your question..."
            />
            <button onClick={() => onChange(questions.filter(x => x.id !== q.id))} className="text-red-500 hover:text-red-700 p-1 mt-1 shrink-0"><X size={15} /></button>
          </div>

          {/* Answer type toggle */}
          <div className="flex items-center gap-3 pl-6">
            <span className="text-xs text-gray-500 font-['DM_Sans',sans-serif]">Answer type:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-['DM_Sans',sans-serif]">
              <input
                type="radio"
                checked={q.type === 'single'}
                onChange={() => updateQuestion(q.id, { type: 'single', correctAnswers: [] })}
                className="accent-[#ed2a10]"
              />
              Single choice
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-['DM_Sans',sans-serif]">
              <input
                type="radio"
                checked={q.type === 'multi'}
                onChange={() => updateQuestion(q.id, { type: 'multi', correctAnswers: [] })}
                className="accent-[#ed2a10]"
              />
              Multiple choice
            </label>
          </div>

          {/* Options */}
          <div className="space-y-2 pl-6">
            <p className="text-xs text-gray-400 font-['DM_Sans',sans-serif]">
              {q.type === 'single' ? 'Select the correct answer' : 'Select all correct answers'}
            </p>
            {q.options.map((o, oi) => {
              const isCorrect = (q.correctAnswers ?? []).includes(o.id);
              return (
                <div key={o.id} className="flex items-center gap-2">
                  {q.type === 'single' ? (
                    <input type="radio" checked={isCorrect} onChange={() => toggleCorrect(q, o.id)} className="accent-[#ed2a10] shrink-0" title="Mark as correct answer" />
                  ) : (
                    <input type="checkbox" checked={isCorrect} onChange={() => toggleCorrect(q, o.id)} className="accent-[#ed2a10] shrink-0" title="Mark as correct answer" />
                  )}
                  <input
                    type="text"
                    value={o.text}
                    onChange={(e) => updateOption(q.id, o.id, e.target.value)}
                    className={`flex-1 border rounded-lg px-3 py-1.5 text-sm font-['DM_Sans',sans-serif] focus:outline-none focus:ring-1 focus:ring-gray-400 ${isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
                    placeholder={`Option ${oi + 1}`}
                  />
                  {q.options.length > 2 && (
                    <button onClick={() => removeOption(q.id, o.id)} className="text-gray-400 hover:text-red-500 shrink-0"><X size={13} /></button>
                  )}
                </div>
              );
            })}
            <button
              onClick={() => addOption(q.id)}
              className="text-xs text-gray-500 hover:text-gray-700 font-['DM_Sans',sans-serif] flex items-center gap-1 mt-1"
            >
              + Add option
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...questions, newQuestion()])}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-2.5 text-sm text-gray-500 hover:border-[#ed2a10] hover:text-[#ed2a10] transition-colors font-['DM_Sans',sans-serif] font-medium"
      >
        + Add Question
      </button>
    </div>
  );
}
