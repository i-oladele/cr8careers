import { useState } from 'react';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: number | string;
  points: number;
}

type QuestionType = Question['type'];

interface QuizData {
  title: string;
  description: string;
  timeLimit: number; // in minutes
  passingScore: number;
  questions: Question[];
}

interface QuizBuilderProps {
  onQuizCreate: (quiz: QuizData) => void;
  initialQuiz?: QuizData;
}

export function QuizBuilder({ onQuizCreate, initialQuiz }: QuizBuilderProps) {
  const [quiz, setQuiz] = useState<QuizData>(
    initialQuiz || {
      title: '',
      description: '',
      timeLimit: 30,
      passingScore: 70,
      questions: []
    }
  );

  const addQuestion = () => {
    const newQuestion: Question = {
      id: 'q' + Date.now(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    };
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQuestion]
    });
  };

  const updateQuestion = <K extends keyof Question>(index: number, field: K, value: Question[K]) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    const question = updatedQuestions[questionIndex];
    if (question.options) {
      question.options = [...question.options, ''];
    }
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...quiz.questions];
    const question = updatedQuestions[questionIndex];
    if (question.options) {
      question.options[optionIndex] = value;
    }
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    const question = updatedQuestions[questionIndex];
    if (question.options && question.options.length > 2) {
      question.options = question.options.filter((_, i) => i !== optionIndex);
      if (typeof question.correctAnswer === 'number' && question.options && question.correctAnswer >= question.options.length) {
        question.correctAnswer = question.options.length - 1;
      }
    }
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate quiz
    if (!quiz.title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    if (quiz.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Validate each question
    for (const question of quiz.questions) {
      if (!question.question.trim()) {
        alert('Please fill in all question fields');
        return;
      }

      if (question.type === 'multiple-choice' && question.options) {
        const validOptions = question.options.filter(opt => opt.trim());
        if (validOptions.length < 2) {
          alert('Multiple choice questions must have at least 2 options');
          return;
        }
      }
    }

    onQuizCreate(quiz);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg mb-4">Quiz Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                required
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={quiz.timeLimit}
                onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={quiz.description}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
              rows={3}
              placeholder="Enter quiz description"
            />
          </div>
          <div className="mt-4">
            <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
              Passing Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={quiz.passingScore}
              onChange={(e) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg">Questions</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-[#0d9488] text-white px-4 py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
            >
              Add Question
            </button>
          </div>

          {quiz.questions.length === 0 ? (
            <p className="font-['DM_Sans',sans-serif] text-gray-500 text-center py-8">
              No questions added yet. Click "Add Question" to get started.
            </p>
          ) : (
            <div className="space-y-6">
              {quiz.questions.map((question, qIndex) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-['DM_Sans',sans-serif] font-semibold">
                      Question {qIndex + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(qIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                        Question Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(qIndex, 'type', e.target.value as QuestionType)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                        Question *
                      </label>
                      <textarea
                        required
                        value={question.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                        rows={3}
                        placeholder="Enter your question"
                      />
                    </div>

                    {question.type === 'multiple-choice' && question.options && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700">
                            Answer Options
                          </label>
                          <button
                            type="button"
                            onClick={() => addOption(qIndex)}
                            className="text-[#0d9488] hover:text-[#0a7a70] font-['DM_Sans',sans-serif] text-sm"
                          >
                            + Add Option
                          </button>
                        </div>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === oIndex}
                                onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                className="w-4 h-4"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif]"
                                placeholder={`Option ${oIndex + 1}`}
                              />
                              {(question.options?.length ?? 0) > 2 && (
                                <button
                                  type="button"
                                  onClick={() => deleteOption(qIndex, oIndex)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="font-['DM_Sans',sans-serif] text-sm text-gray-500 mt-2">
                          Select the radio button next to the correct answer
                        </p>
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div>
                        <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                          Correct Answer
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === 'true'}
                              onChange={() => updateQuestion(qIndex, 'correctAnswer', 'true')}
                              className="w-4 h-4 mr-2"
                            />
                            True
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === 'false'}
                              onChange={() => updateQuestion(qIndex, 'correctAnswer', 'false')}
                              className="w-4 h-4 mr-2"
                            />
                            False
                          </label>
                        </div>
                      </div>
                    )}

                    {question.type === 'short-answer' && (
                      <div>
                        <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                          Correct Answer (for reference)
                        </label>
                        <input
                          type="text"
                          value={question.correctAnswer as string}
                          onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                          placeholder="Enter the correct answer"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                        Points
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-['DM_Sans',sans-serif] font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
          >
            {initialQuiz ? 'Update Quiz' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}
