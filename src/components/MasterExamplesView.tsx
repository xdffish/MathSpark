import React, { useState, useEffect } from 'react';
import { CURRICULUM_CHAPTERS } from '../data/curriculum';
import { PracticeProblem, ProblemCategory } from '../types/math';
import { ProblemSolverCard } from './ProblemSolverCard';
import { CheckCircle2 } from 'lucide-react';

interface MasterExamplesViewProps {
  solvedIds: string[];
  onSolved: (problemId: string) => void;
  onWrongAttempt: (problem: PracticeProblem, userAnswers: Record<string, number>) => void;
  initialChapterId?: ProblemCategory;
}

export const MasterExamplesView: React.FC<MasterExamplesViewProps> = ({
  solvedIds,
  onSolved,
  onWrongAttempt,
  initialChapterId = 'basic',
}) => {
  const [activeChapterId, setActiveChapterId] = useState<ProblemCategory>(initialChapterId);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    setActiveChapterId(initialChapterId);
    setSelectedIndex(0);
  }, [initialChapterId]);

  const chapter =
    CURRICULUM_CHAPTERS.find((c) => c.id === activeChapterId) ?? CURRICULUM_CHAPTERS[0];

  const chapterProblems: PracticeProblem[] = [chapter.example, ...chapter.exercises];
  const currentProblem = chapterProblems[selectedIndex] ?? chapter.example;

  const handleSelectChapter = (id: ProblemCategory) => {
    setActiveChapterId(id);
    setSelectedIndex(0);
  };

  const handleNextProblem = () => {
    if (selectedIndex < chapterProblems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      const currentChapterIdx = CURRICULUM_CHAPTERS.findIndex((c) => c.id === activeChapterId);
      if (currentChapterIdx < CURRICULUM_CHAPTERS.length - 1) {
        setActiveChapterId(CURRICULUM_CHAPTERS[currentChapterIdx + 1].id);
        setSelectedIndex(0);
      }
    }
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-5 space-y-1.5">
        <p className="text-xs font-medium text-sky-700 tracking-wide">
          教材同步 · 八大经典差倍专题
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          举一反三 A 版：王牌例题与同步训练
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          覆盖标准差倍、几倍多/少几、同增同减、移多补少、双条件转化、添0去0、单边增减与三量差倍共 8 讲 32 道精选原题。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: 8 Chapters */}
        <aside className="lg:col-span-4 space-y-2.5">
          {CURRICULUM_CHAPTERS.map((item) => {
            const totalInChapter = 1 + item.exercises.length;
            const solvedCount = [item.example, ...item.exercises].filter((p) =>
              solvedIds.includes(p.id)
            ).length;
            const isActive = item.id === activeChapterId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectChapter(item.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white border-sky-300 shadow-xs'
                    : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className={`font-semibold ${isActive ? 'text-sky-700' : 'text-slate-600'}`}>
                    {item.orderLabel}
                  </span>
                  <span className="font-mono-math tabular-nums">
                    已完成 {solvedCount} / {totalInChapter}
                  </span>
                </div>

                <h2 className="mt-1 text-base font-semibold text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {item.subtitle}
                </p>
              </button>
            );
          })}
        </aside>

        {/* Right Main Content */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">
                {chapter.orderLabel} 核心口诀
              </span>
              <span className="font-mono-math text-sky-700 font-medium">
                {chapter.coreFormula}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {chapter.keyInsight}
            </p>

            {/* Segmented Switcher for 例题 + 举一反三 1~3 */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              {chapterProblems.map((prob, idx) => {
                const solved = solvedIds.includes(prob.id);
                const selected = idx === selectedIndex;
                return (
                  <button
                    key={prob.id}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selected
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {solved && (
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${selected ? 'text-emerald-400' : 'text-emerald-600'}`}
                      />
                    )}
                    {prob.code}
                  </button>
                );
              })}
            </div>
          </div>

          <ProblemSolverCard
            problem={currentProblem}
            isSolved={solvedIds.includes(currentProblem.id)}
            onSolved={onSolved}
            onWrongAttempt={onWrongAttempt}
            defaultShowDiagram={selectedIndex === 0}
            defaultShowSteps={selectedIndex === 0}
            onNextProblem={
              selectedIndex < chapterProblems.length - 1 ||
              activeChapterId !== CURRICULUM_CHAPTERS[CURRICULUM_CHAPTERS.length - 1].id
                ? handleNextProblem
                : undefined
            }
            nextLabel={
              selectedIndex < chapterProblems.length - 1
                ? '做下一道举一反三'
                : '进入下一讲'
            }
          />
        </div>
      </div>
    </section>
  );
};
