import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { HomeView } from './components/HomeView';
import { SandboxMode, SandboxView } from './components/SandboxView';
import { MasterExamplesView } from './components/MasterExamplesView';
import { RandomPracticeView } from './components/RandomPracticeView';
import { WrongNotesView } from './components/WrongNotesView';
import { PracticeProblem, ProblemCategory, WrongNoteEntry } from './types/math';
import { CURRICULUM_CHAPTERS } from './data/curriculum';
import { GeneratorMode, generateRandomProblem } from './utils/problemGenerator';

type ActiveTab = 'home' | 'sandbox' | 'examples' | 'practice' | 'wrong_notes';

const STORAGE_SOLVED_KEY = 'olympiad_chabei_solved_v1';
const STORAGE_WRONG_KEY = 'olympiad_chabei_wrong_v1';

const mapCategoryToGeneratorMode = (cat: ProblemCategory): GeneratorMode => {
  switch (cat) {
    case 'basic':
      return 'basic';
    case 'more_less':
      return Math.random() > 0.5 ? 'more' : 'less';
    case 'same_change':
      return 'same_change';
    case 'transfer':
      return 'transfer';
    case 'digit_zero':
      return 'digit_zero';
    case 'single_side':
      return 'single_side';
    case 'three_quantities':
      return 'three_quantities';
    case 'comprehensive':
    default:
      return 'all';
  }
};

const mapCategoryToSandboxMode = (cat: ProblemCategory): SandboxMode => {
  switch (cat) {
    case 'basic':
    case 'same_change':
      return 'basic';
    case 'more_less':
      return 'more';
    case 'transfer':
    case 'comprehensive':
      return 'transfer';
    case 'digit_zero':
      return 'digit_zero';
    case 'single_side':
      return 'single_side';
    case 'three_quantities':
      return 'three_quantities';
    default:
      return 'basic';
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedChapter, setSelectedChapter] = useState<ProblemCategory>('basic');
  const [sandboxInitialMode, setSandboxInitialMode] = useState<SandboxMode>('basic');
  const [practiceMode, setPracticeMode] = useState<GeneratorMode>('all');

  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOLVED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wrongNotes, setWrongNotes] = useState<WrongNoteEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WRONG_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quickRandomProblem, setQuickRandomProblem] = useState<PracticeProblem | null>(null);
  const [practiceKey, setPracticeKey] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SOLVED_KEY, JSON.stringify(solvedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [solvedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WRONG_KEY, JSON.stringify(wrongNotes));
    } catch {
      // Ignore storage quota errors
    }
  }, [wrongNotes]);

  const totalCurriculumCount = CURRICULUM_CHAPTERS.reduce(
    (acc, ch) => acc + 1 + ch.exercises.length,
    0
  );

  const handleSolved = (problemId: string) => {
    setSolvedIds((prev) => (prev.includes(problemId) ? prev : [...prev, problemId]));
  };

  const handleWrongAttempt = (
    problem: PracticeProblem,
    userAnswers: Record<string, number>
  ) => {
    const correctAnswers: Record<string, number> = {};
    for (const f of problem.answerFields) {
      correctAnswers[f.key] = f.correctValue;
    }

    setWrongNotes((prev) => {
      const filtered = prev.filter((item) => item.problemId !== problem.id);
      const nextEntry: WrongNoteEntry = {
        id: `wrong-${problem.id}`,
        problemId: problem.id,
        code: problem.code,
        title: problem.title,
        questionText: problem.questionText,
        userAnswers,
        correctAnswers,
        timestamp: Date.now(),
        problem,
      };
      return [nextEntry, ...filtered].slice(0, 30);
    });
  };

  const handleRemoveWrongNote = (noteId: string) => {
    setWrongNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleClearWrongNotes = () => {
    setWrongNotes([]);
  };

  const handleTriggerRandomPractice = (mode: GeneratorMode = 'all') => {
    setPracticeMode(mode);
    setQuickRandomProblem(generateRandomProblem(mode));
    setPracticeKey((k) => k + 1);
    setActiveTab('practice');
  };

  const handleOpenChapter = (chapterId: ProblemCategory) => {
    setSelectedChapter(chapterId);
    setActiveTab('examples');
  };

  const handleOpenSandboxMode = (chapterId: ProblemCategory) => {
    setSandboxInitialMode(mapCategoryToSandboxMode(chapterId));
    setActiveTab('sandbox');
  };

  const handlePracticeCategory = (chapterId: ProblemCategory) => {
    const mapped = mapCategoryToGeneratorMode(chapterId);
    handleTriggerRandomPractice(mapped);
  };

  const navItems: Array<{ id: ActiveTab; label: string }> = [
    { id: 'home', label: '主页' },
    { id: 'sandbox', label: '线段图沙盒' },
    { id: 'examples', label: '王牌例题' },
    { id: 'practice', label: '闯关练习' },
    { id: 'wrong_notes', label: '错题本' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Three-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Title */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            举一反三·差倍A版
          </button>

          {/* Zone 2: 5 Single-line Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium"
            aria-label="主导航"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-sky-600 text-sky-700 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => handleTriggerRandomPractice('all')}
              className="px-4 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              随机出题
            </button>
          </div>
        </div>

        {/* Mobile Nav Strip */}
        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-4 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-sky-700 font-semibold underline underline-offset-4'
                    : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Quiet Unboxed Progress & Back-to-Home Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2.5">
            {activeTab !== 'home' ? (
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="inline-flex items-center gap-1 font-medium text-sky-700 hover:text-sky-800 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                返回题型主页
              </button>
            ) : (
              <span>小学奥数举一反三 A版</span>
            )}
            <span aria-hidden="true">·</span>
            <span>差倍 8 大专题（三年级/四年级核心）</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-math">
              核心公式：较小数 = 差 ÷ (倍数 - 1)
            </span>
          </div>

          <div className="flex items-center gap-2.5 tabular-nums">
            <span>
              教材通关 <strong className="text-slate-900 font-mono-math">{solvedIds.length}</strong> / {totalCurriculumCount} 题
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('wrong_notes')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              错题本 <strong className="text-rose-700 font-mono-math">{wrongNotes.length}</strong> 题
            </button>
          </div>
        </div>

        {/* Active View Stage */}
        {activeTab === 'home' && (
          <HomeView
            solvedIds={solvedIds}
            wrongCount={wrongNotes.length}
            onOpenChapter={handleOpenChapter}
            onOpenSandboxMode={handleOpenSandboxMode}
            onPracticeType={handlePracticeCategory}
            onStartMixedPractice={() => handleTriggerRandomPractice('all')}
            onOpenWrongNotes={() => setActiveTab('wrong_notes')}
          />
        )}

        {activeTab === 'sandbox' && <SandboxView initialMode={sandboxInitialMode} />}

        {activeTab === 'examples' && (
          <MasterExamplesView
            solvedIds={solvedIds}
            onSolved={handleSolved}
            onWrongAttempt={handleWrongAttempt}
            initialChapterId={selectedChapter}
          />
        )}

        {activeTab === 'practice' && (
          <RandomPracticeView
            key={practiceKey}
            initialProblem={quickRandomProblem}
            initialMode={practiceMode}
            onWrongAttempt={handleWrongAttempt}
          />
        )}

        {activeTab === 'wrong_notes' && (
          <WrongNotesView
            wrongNotes={wrongNotes}
            onRemoveNote={handleRemoveWrongNote}
            onClearAll={handleClearWrongNotes}
            onGoToPractice={() => handleTriggerRandomPractice('all')}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>小学奥数举一反三·A版 差倍问题交互实验室 · 8 大题型动态线段图思维训练</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="hover:text-slate-900 cursor-pointer"
            >
              题型主页
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sandbox')}
              className="hover:text-slate-900 cursor-pointer"
            >
              线段图沙盒
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('examples')}
              className="hover:text-slate-900 cursor-pointer"
            >
              八大王牌例题
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className="hover:text-slate-900 cursor-pointer"
            >
              变式练习
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
