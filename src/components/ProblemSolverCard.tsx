import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Compass,
  Lightbulb,
  BookOpen,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { PracticeProblem } from '../types/math';
import { SegmentDiagramSVG } from './SegmentDiagramSVG';

interface ProblemSolverCardProps {
  problem: PracticeProblem;
  isSolved?: boolean;
  onSolved?: (problemId: string) => void;
  onWrongAttempt?: (
    problem: PracticeProblem,
    userAnswers: Record<string, number>
  ) => void;
  defaultShowSteps?: boolean;
  defaultShowDiagram?: boolean;
  onNextProblem?: () => void;
  nextLabel?: string;
}

export const ProblemSolverCard: React.FC<ProblemSolverCardProps> = ({
  problem,
  isSolved = false,
  onSolved,
  onWrongAttempt,
  defaultShowSteps = false,
  defaultShowDiagram = false,
  onNextProblem,
  nextLabel = '下一题',
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [showDiagram, setShowDiagram] = useState<boolean>(defaultShowDiagram);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSteps, setShowSteps] = useState<boolean>(defaultShowSteps);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Reset local state when problem changes
  useEffect(() => {
    setInputs({});
    setStatus(isSolved ? 'correct' : 'idle');
    setFeedback(isSolved ? '这道题你已经顺利过关啦，可以随时查看线段图或步骤复盘。' : '');
    setShowDiagram(defaultShowDiagram || isSolved);
    setShowHint(false);
    setShowSteps(defaultShowSteps);
    setActiveStep(0);
  }, [problem.id, defaultShowDiagram, defaultShowSteps, isSolved]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed: Record<string, number> = {};
    for (const field of problem.answerFields) {
      const raw = (inputs[field.key] ?? '').trim();
      if (raw === '' || Number.isNaN(Number(raw))) {
        setStatus('wrong');
        setFeedback(`请先把“${field.label}”的数字填写完整再提交哦。`);
        return;
      }
      parsed[field.key] = Number(raw);
    }

    const allCorrect = problem.answerFields.every(
      (field) => parsed[field.key] === field.correctValue
    );

    if (allCorrect) {
      setStatus('correct');
      setFeedback('太棒了！思路清晰、计算完全正确，你已经掌握这一题的差倍关系啦！');
      setShowDiagram(true);
      onSolved?.(problem.id);
    } else {
      setStatus('wrong');
      const matchedMistake = problem.commonMistakes.find((m) => m.check(parsed));
      setFeedback(
        matchedMistake
          ? matchedMistake.feedback
          : '再检查一下哦！建议打开“线段图提示”，数一数差值一共对应几份（记得倍数要减 1 哦）。'
      );
      onWrongAttempt?.(problem, parsed);
    }
  };

  const handleReset = () => {
    setInputs({});
    setStatus('idle');
    setFeedback('');
  };

  const focusPart =
    showSteps && activeStep > 0
      ? problem.steps[activeStep - 1]?.focusPart ?? 'all'
      : 'all';

  const difficultyLabel =
    problem.difficulty === 1
      ? '基础巩固'
      : problem.difficulty === 2
      ? '能力进阶'
      : '奥数挑战';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 space-y-6">
      {/* Unboxed Clean Metadata & Title */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-sky-700">{problem.code}</span>
          <span aria-hidden="true">·</span>
          <span>{difficultyLabel}</span>
          {status === 'correct' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                已掌握
              </span>
            </>
          )}
        </div>

        <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
          {problem.title}
        </h3>
      </div>

      {/* Question Stem */}
      <p className="text-base sm:text-[17px] text-slate-800 leading-relaxed font-normal">
        {problem.questionText}
      </p>

      {/* Answer Input Form */}
      <form
        onSubmit={handleSubmit}
        className="pt-2 border-t border-slate-100 space-y-4"
      >
        <div
          className={`grid grid-cols-1 gap-4 pt-2 ${
            problem.answerFields.length === 3
              ? 'sm:grid-cols-3'
              : problem.answerFields.length === 2
              ? 'sm:grid-cols-2'
              : 'sm:grid-cols-1 max-w-sm'
          }`}
        >
          {problem.answerFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label
                htmlFor={`input-${problem.id}-${field.key}`}
                className="block text-xs font-medium text-slate-700"
              >
                {field.label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={`input-${problem.id}-${field.key}`}
                  type="number"
                  inputMode="numeric"
                  placeholder="输入数字"
                  value={inputs[field.key] ?? ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-base font-mono-math tabular-nums bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 transition-colors"
                />
                {field.unit && (
                  <span className="text-sm font-medium text-slate-600 whitespace-nowrap shrink-0">
                    {field.unit}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              检查答案
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              清空重填
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDiagram((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showDiagram
                  ? 'bg-sky-50 border-sky-200 text-sky-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              {showDiagram ? '收起线段图' : '画线段图提示'}
            </button>

            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showHint
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? '收起思路' : '思路点拨'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowSteps((v) => !v);
                if (!showSteps) setShowDiagram(true);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showSteps
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {showSteps ? '收起分步解答' : '查看分步解答'}
            </button>
          </div>
        </div>
      </form>

      {/* Feedback Banner (Always icon + text label, no border-l-4) */}
      {status !== 'idle' && feedback && (
        <div
          role="status"
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border ${
            status === 'correct'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {status === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 text-sm">
              <p className="font-semibold">
                {status === 'correct' ? '回答正确' : '再想一想'}
              </p>
              <p className="leading-relaxed opacity-95">{feedback}</p>
            </div>
          </div>

          {status === 'correct' && onNextProblem && (
            <button
              type="button"
              onClick={onNextProblem}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
            >
              {nextLabel}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Hint Box */}
      {showHint && (
        <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 text-sm text-amber-950 space-y-1">
          <p className="font-semibold text-amber-800">老师点拨</p>
          <p className="leading-relaxed">{problem.hint}</p>
        </div>
      )}

      {/* Interactive Segment Diagram */}
      {showDiagram && (
        <div className="rounded-lg math-grid-bg border border-slate-200 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-slate-700">
              本题线段图（{status === 'correct' || showSteps ? '已显示完整数值' : '思考模式：暂隐藏未知数'}）
            </span>
          </div>
          <SegmentDiagramSVG
            config={problem.diagram}
            revealNumbers={status === 'correct' || showSteps}
            focusPart={focusPart}
          />
        </div>
      )}

      {/* Step-by-step Walkthrough */}
      {showSteps && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              举一反三 · 分步精讲（点击任意一步可联动高亮线段图）
            </h4>
            {activeStep > 0 && (
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="text-xs font-medium text-sky-700 hover:underline cursor-pointer"
              >
                显示全图
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {problem.steps.map((step, idx) => {
              const isSelected = activeStep === idx + 1;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveStep(idx + 1)}
                  className={`text-left p-4 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-50/70 border-sky-300'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      第 {idx + 1} 步
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {step.title}
                    </p>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {step.explanation}
                    </p>
                  </div>
                  <p className="mt-3 pt-2.5 border-t border-slate-200/70 text-xs sm:text-sm font-semibold font-mono-math text-sky-800 tabular-nums">
                    {step.formula}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
