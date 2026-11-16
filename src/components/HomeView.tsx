import React, { useState } from 'react';
import {
  ArrowRight,
  Compass,
  BookOpen,
  Shuffle,
  Star,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CURRICULUM_CHAPTERS } from '../data/curriculum';
import { ProblemCategory } from '../types/math';

interface HomeViewProps {
  solvedIds: string[];
  wrongCount: number;
  onOpenChapter: (chapterId: ProblemCategory) => void;
  onOpenSandboxMode: (chapterId: ProblemCategory) => void;
  onPracticeType: (chapterId: ProblemCategory) => void;
  onStartMixedPractice: () => void;
  onOpenWrongNotes: () => void;
}

const CHAPTER_THEMES: Record<
  ProblemCategory,
  {
    adventureName: string;
    storyTag: string;
    accentBg: string;
    accentBorder: string;
    accentText: string;
  }
> = {
  basic: {
    adventureName: '森林粮仓小管家',
    storyTag: '第一站 · 认识 1 份小积木',
    accentBg: 'bg-sky-50/70',
    accentBorder: 'border-sky-200',
    accentText: 'text-sky-700',
  },
  more_less: {
    adventureName: '神奇剪刀与补丁',
    storyTag: '第二站 · 多余剪掉、缺少补齐',
    accentBg: 'bg-amber-50/70',
    accentBorder: 'border-amber-200',
    accentText: 'text-amber-700',
  },
  same_change: {
    adventureName: '时光机与年龄密码',
    storyTag: '第三站 · 一起长大差不变',
    accentBg: 'bg-emerald-50/70',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-700',
  },
  transfer: {
    adventureName: '围棋子大搬家',
    storyTag: '第四站 · 你少我多差翻倍',
    accentBg: 'bg-indigo-50/70',
    accentBorder: 'border-indigo-200',
    accentText: 'text-indigo-700',
  },
  comprehensive: {
    adventureName: '双筐苹果侦探社',
    storyTag: '第五站 · 两句线索破谜题',
    accentBg: 'bg-rose-50/70',
    accentBorder: 'border-rose-200',
    accentText: 'text-rose-700',
  },
  digit_zero: {
    adventureName: '会变身的“0”魔法',
    storyTag: '第六站 · 添 0 立刻变 10 倍',
    accentBg: 'bg-cyan-50/70',
    accentBorder: 'border-cyan-200',
    accentText: 'text-cyan-700',
  },
  single_side: {
    adventureName: '小兔队伍变变变',
    storyTag: '第七站 · 抓住不变的小队长',
    accentBg: 'bg-violet-50/70',
    accentBorder: 'border-violet-200',
    accentText: 'text-violet-700',
  },
  three_quantities: {
    adventureName: '三宝排队比高矮',
    storyTag: '第八站 · 三条线段齐步走',
    accentBg: 'bg-orange-50/70',
    accentBorder: 'border-orange-200',
    accentText: 'text-orange-700',
  },
};

const WARMUP_RIDDLES = [
  {
    question: '哥哥的贴画是弟弟的 3 倍，哥哥比弟弟多 10 张。弟弟有几张贴画？',
    options: [3, 5, 10],
    correct: 5,
    explain: '哥哥 3 份，弟弟 1 份，多出 3 - 1 = 2 份对应 10 张，1 份 = 10 ÷ 2 = 5 张！',
  },
  {
    question: '在一个数的末尾添上一个 0，新数比原来大了 27。原来的数是多少？',
    options: [3, 9, 27],
    correct: 3,
    explain: '添上 0 变成 10 倍，相差 10 - 1 = 9 份，27 ÷ 9 = 3！',
  },
  {
    question: '甲、乙两堆糖本来一样多，甲给乙 4 颗后，乙比甲多几颗？',
    options: [4, 8, 12],
    correct: 8,
    explain: '甲少了 4 颗，同时乙多了 4 颗，一来一回相差 4 × 2 = 8 颗！',
  },
  {
    question: '姐姐今年 14 岁，妹妹今年 6 岁。10 年后姐姐比妹妹大几岁？',
    options: [8, 10, 18],
    correct: 8,
    explain: '不管过多少年，两人的年龄差永远不变：14 - 6 = 8 岁！',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  solvedIds,
  wrongCount,
  onOpenChapter,
  onOpenSandboxMode,
  onPracticeType,
  onStartMixedPractice,
  onOpenWrongNotes,
}) => {
  const totalCurriculumCount = CURRICULUM_CHAPTERS.reduce(
    (acc, ch) => acc + 1 + ch.exercises.length,
    0
  );

  // Interactive mini wooden-blocks playground state
  const [blockMult, setBlockMult] = useState<number>(3);
  const [blockUnitVal, setBlockUnitVal] = useState<number>(5);

  // Quick owl riddle state
  const [riddleIdx, setRiddleIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  // Image error fallbacks
  const [heroImgError, setHeroImgError] = useState<boolean>(false);
  const [owlImgError, setOwlImgError] = useState<boolean>(false);
  const [mapImgError, setMapImgError] = useState<boolean>(false);

  const currentRiddle = WARMUP_RIDDLES[riddleIdx];
  const isRiddleCorrect = selectedOpt === currentRiddle.correct;

  const handleNextRiddle = () => {
    setRiddleIdx((prev) => (prev + 1) % WARMUP_RIDDLES.length);
    setSelectedOpt(null);
  };

  const blockDiffVal = blockUnitVal * (blockMult - 1);

  return (
    <div className="space-y-10">
      {/* 1. Storybook Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3.5">
            <p className="text-xs font-semibold text-sky-700 tracking-wide">
              小学奥数举一反三 · A 版差倍探险乐园
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight text-balance">
              把应用题变成积木，一眼看穿差倍秘密！
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              遇到“谁是谁的几倍、谁比谁多多少”别慌张！跟着小积木和线段图一起排排队，轻松闯过 8 大经典奥数关卡，收集满 32 颗通关小星星。
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenChapter('basic')}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                开启第 1 关冒险
              </button>

              <button
                type="button"
                onClick={() => onOpenSandboxMode('basic')}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-700" />
                玩转线段图沙盒
              </button>

              <button
                type="button"
                onClick={onStartMixedPractice}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Shuffle className="w-4 h-4 text-slate-600" />
                随机挑战
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 tabular-nums">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                已收集通关星星：
                <strong className="text-slate-900 font-mono-math text-sm">
                  {solvedIds.length}
                </strong>
                <span>/ {totalCurriculumCount} 颗</span>
              </span>

              <button
                type="button"
                onClick={onOpenWrongNotes}
                className="font-medium text-slate-700 hover:text-rose-700 transition-colors cursor-pointer"
              >
                错题宝盒：
                <strong className="text-rose-700 font-mono-math">{wrongCount}</strong> 题待消灭 →
              </button>
            </div>
          </div>
        </div>

        {/* Right Hero Illustration */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
          {!heroImgError ? (
            <img
              src="/src/assets/images/hero_math_adventure_1794818922272.jpg"
              alt="小学生们在书桌旁用彩色木条积木对比长短、学习差倍计算的插画"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgError(true)}
              className="w-full h-64 sm:h-72 lg:h-full object-cover"
            />
          ) : (
            <div className="w-full h-64 lg:h-full bg-gradient-to-br from-sky-50 via-amber-50 to-white flex flex-col items-center justify-center p-6 text-center space-y-2">
              <Sparkles className="w-10 h-10 text-sky-600" />
              <p className="text-base font-semibold text-slate-800">
                积木排排队，差倍一看就会
              </p>
              <p className="text-xs text-slate-500">
                举一反三·A版 差倍思维工坊
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Interactive Kid-Friendly Toy Row: Block Builder + Owl Teacher 10s Riddle */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (7 cols): Interactive Wooden Block Toy */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                小积木变魔术：为什么倍数要减 1？
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                点一点下面的按钮，看看多出来的积木有几块！
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              {[2, 3, 4, 5].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setBlockMult(m)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    blockMult === m
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m} 倍
                </button>
              ))}
            </div>
          </div>

          {/* Visual Toy Blocks */}
          <div className="rounded-xl math-grid-bg border border-slate-200 p-4 sm:p-5 space-y-4">
            {/* Row 1: Small */}
            <div className="flex items-center gap-3">
              <span className="w-14 text-xs font-semibold text-slate-700 shrink-0">
                弟弟 1份
              </span>
              <div className="flex items-center gap-1.5">
                <div className="h-9 w-16 sm:w-20 rounded-lg bg-sky-500 text-white font-mono-math text-sm font-bold flex items-center justify-center shadow-xs">
                  {blockUnitVal}
                </div>
              </div>
            </div>

            {/* Row 2: Large */}
            <div className="flex items-center gap-3">
              <span className="w-14 text-xs font-semibold text-slate-700 shrink-0">
                哥哥 {blockMult}份
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="h-9 w-16 sm:w-20 rounded-lg bg-sky-500/85 text-white font-mono-math text-sm font-bold flex items-center justify-center">
                  {blockUnitVal}
                </div>
                {Array.from({ length: blockMult - 1 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-9 w-16 sm:w-20 rounded-lg bg-amber-400 text-amber-950 font-mono-math text-sm font-bold flex items-center justify-center border border-amber-500/40"
                  >
                    {blockUnitVal}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-700">
                黄色多出来的积木一共有{' '}
                <strong className="font-mono-math text-amber-700 text-sm">
                  {blockMult} - 1 = {blockMult - 1}
                </strong>{' '}
                块，合起来多{' '}
                <strong className="font-mono-math text-amber-700 text-sm">
                  {blockDiffVal}
                </strong>
                ！
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">每块代表：</span>
                {[4, 5, 8, 10].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setBlockUnitVal(v)}
                    className={`px-2 py-1 rounded text-xs font-mono-math cursor-pointer border transition-colors ${
                      blockUnitVal === v
                        ? 'bg-sky-600 border-sky-600 text-white font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Owl Teacher 10-Second Warm-Up Riddle */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
              {!owlImgError ? (
                <img
                  src="/src/assets/images/mascot_math_owl_1794818922683.jpg"
                  alt="戴着圆眼镜拿木尺的猫头鹰数学老师"
                  referrerPolicy="no-referrer"
                  onError={() => setOwlImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sky-700">
                  <Sparkles className="w-7 h-7" />
                </div>
              )}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-amber-700">
                  猫头鹰老师 · 10 秒小热身
                </span>
                <button
                  type="button"
                  onClick={handleNextRiddle}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-sky-700 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  换一题
                </button>
              </div>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                {currentRiddle.question}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {currentRiddle.options.map((opt) => {
              const isSelected = selectedOpt === opt;
              const isCorrectChoice = opt === currentRiddle.correct;
              let btnStyle =
                'bg-slate-50 border-slate-200 text-slate-800 hover:bg-sky-50 hover:border-sky-300';
              if (selectedOpt !== null) {
                if (isSelected && isCorrectChoice) {
                  btnStyle = 'bg-emerald-600 border-emerald-600 text-white';
                } else if (isSelected && !isCorrectChoice) {
                  btnStyle = 'bg-rose-600 border-rose-600 text-white';
                } else if (isCorrectChoice) {
                  btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedOpt(opt)}
                  className={`py-2.5 text-sm font-bold font-mono-math rounded-xl border transition-colors cursor-pointer ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedOpt !== null ? (
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                isRiddleCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {isRiddleCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold">
                  {isRiddleCorrect ? '答对啦！' : '差一点点，看看解析：'}
                </span>
                {currentRiddle.explain}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              点击上面一个数字选项，马上看看自己有没有答对！
            </p>
          )}
        </div>
      </section>

      {/* 3. Adventure Trail Banner + 8 Problem Types Map */}
      <section className="space-y-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white">
          {!mapImgError ? (
            <div className="relative h-48 sm:h-56 w-full">
              <img
                src="/src/assets/images/challenge_trophy_map_1794818922937.jpg"
                alt="通往数学天文台的八个关卡冒险地图插画"
                referrerPolicy="no-referrer"
                onError={() => setMapImgError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <p className="text-xs font-medium text-amber-300">
                    《举一反三·A版》差倍闯关地图
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                    八大差倍冒险关卡，挑一关出发吧！
                  </h2>
                </div>
                <span className="text-xs font-mono-math tabular-nums text-slate-200">
                  共 8 关 · 32 道例题与练习 · 无限变式
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-900 text-white">
              <h2 className="text-xl font-bold">八大差倍冒险关卡，挑一关出发吧！</h2>
            </div>
          )}
        </div>

        {/* 8 Adventure Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURRICULUM_CHAPTERS.map((chapter, idx) => {
            const theme = CHAPTER_THEMES[chapter.id];
            const chapterProblems = [chapter.example, ...chapter.exercises];
            const solvedCount = chapterProblems.filter((p) =>
              solvedIds.includes(p.id)
            ).length;
            const isMastered = solvedCount === chapterProblems.length;

            return (
              <article
                key={chapter.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                {/* Playful Tinted Header Band */}
                <div className={`px-5 py-4 border-b ${theme.accentBg} ${theme.accentBorder}`}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className={`font-bold ${theme.accentText}`}>
                      第 {idx + 1} 关 · {theme.adventureName}
                    </span>
                    <span className="font-mono-math tabular-nums text-slate-600">
                      {solvedCount}/{chapterProblems.length}
                    </span>
                  </div>

                  {/* 4-Star Progress Indicator */}
                  <div className="mt-2 flex items-center gap-1" aria-label={`已获得 ${solvedCount} 颗星，共 ${chapterProblems.length} 颗`}>
                    {chapterProblems.map((p) => {
                      const gotStar = solvedIds.includes(p.id);
                      return (
                        <Star
                          key={p.id}
                          className={`w-4 h-4 ${
                            gotStar
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      );
                    })}
                    {isMastered && (
                      <span className="ml-1.5 text-[11px] font-semibold text-emerald-700">
                        已通关
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-500">{theme.storyTag}</p>
                    <h3 className="text-base font-bold text-slate-900">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {chapter.subtitle}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => onOpenChapter(chapter.id)}
                      className="w-full inline-flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <span>闯关学例题</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenSandboxMode(chapter.id)}
                        className="flex-1 py-1.5 text-xs font-medium text-slate-700 hover:text-sky-700 hover:bg-sky-50/70 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                      >
                        看积木图
                      </button>
                      <span className="text-slate-200" aria-hidden="true">|</span>
                      <button
                        type="button"
                        onClick={() => onPracticeType(chapter.id)}
                        className="flex-1 py-1.5 text-xs font-medium text-sky-700 hover:text-sky-800 hover:bg-sky-50/70 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                      >
                        专项练一练
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
