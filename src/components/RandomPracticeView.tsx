import React, { useState } from 'react';
import { Shuffle, CheckCircle2 } from 'lucide-react';
import { GeneratorMode, generateRandomProblem } from '../utils/problemGenerator';
import { PracticeProblem } from '../types/math';
import { ProblemSolverCard } from './ProblemSolverCard';

interface RandomPracticeViewProps {
  onWrongAttempt: (problem: PracticeProblem, userAnswers: Record<string, number>) => void;
  initialProblem?: PracticeProblem | null;
  initialMode?: GeneratorMode;
}

export const RandomPracticeView: React.FC<RandomPracticeViewProps> = ({
  onWrongAttempt,
  initialProblem = null,
  initialMode = 'all',
}) => {
  const [mode, setMode] = useState<GeneratorMode>(initialMode);
  const [currentProblem, setCurrentProblem] = useState<PracticeProblem>(
    () => initialProblem ?? generateRandomProblem(initialMode)
  );
  const [sessionSolvedIds, setSessionSolvedIds] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(0);

  const handleGenerate = (nextMode: GeneratorMode = mode) => {
    setMode(nextMode);
    setCurrentProblem(generateRandomProblem(nextMode));
  };

  const handleSolved = (problemId: string) => {
    if (!sessionSolvedIds.includes(problemId)) {
      setSessionSolvedIds((prev) => [...prev, problemId]);
      setStreak((s) => s + 1);
    }
  };

  const handleWrong = (problem: PracticeProblem, userAnswers: Record<string, number>) => {
    setStreak(0);
    onWrongAttempt(problem, userAnswers);
  };

  const modes: Array<{ id: GeneratorMode; label: string }> = [
    { id: 'all', label: '混合挑战' },
    { id: 'basic', label: '标准差倍' },
    { id: 'more', label: '几倍多几' },
    { id: 'less', label: '几倍少几' },
    { id: 'transfer', label: '移多补少' },
    { id: 'same_change', label: '年龄暗差' },
    { id: 'digit_zero', label: '添0去0' },
    { id: 'single_side', label: '单边变化' },
    { id: 'three_quantities', label: '三量差倍' },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-sky-700 tracking-wide">
            无限变式训练 · 8 类差倍题型全覆盖
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            差倍实战闯关练习台
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            可按“标准差倍、几倍多/少几、移多补少、年龄暗差、添0去0、单边变化、三量差倍”精准刷题，或开启混合挑战！
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              本次答对{' '}
              <span className="font-mono-math font-semibold tabular-nums">
                {sessionSolvedIds.length}
              </span>{' '}
              题
            </span>
            <span aria-hidden="true">·</span>
            <span>
              当前连对{' '}
              <span className="font-mono-math font-semibold text-slate-900 tabular-nums">
                {streak}
              </span>{' '}
              题
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleGenerate(mode)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            换一道新题
          </button>
        </div>
      </div>

      {/* Topic Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg w-fit">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleGenerate(m.id)}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === m.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <ProblemSolverCard
        problem={currentProblem}
        isSolved={sessionSolvedIds.includes(currentProblem.id)}
        onSolved={handleSolved}
        onWrongAttempt={handleWrong}
        onNextProblem={() => handleGenerate(mode)}
        nextLabel="继续下一道变式题"
      />
    </section>
  );
};
