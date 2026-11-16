import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SegmentDiagramSVG } from './SegmentDiagramSVG';
import { SegmentDiagramConfig } from '../types/math';

export type SandboxMode =
  | 'basic'
  | 'more'
  | 'less'
  | 'transfer'
  | 'digit_zero'
  | 'single_side'
  | 'three_quantities';

interface SandboxViewProps {
  initialMode?: SandboxMode;
}

export const SandboxView: React.FC<SandboxViewProps> = ({
  initialMode = 'basic',
}) => {
  const [mode, setMode] = useState<SandboxMode>(initialMode);
  const [smallValue, setSmallValue] = useState<number>(40);
  const [multiple, setMultiple] = useState<number>(4);
  const [thirdMultiple, setThirdMultiple] = useState<number>(6);
  const [extraAmount, setExtraAmount] = useState<number>(6);
  const [transferAmount, setTransferAmount] = useState<number>(12);
  const [revealNumbers, setRevealNumbers] = useState<boolean>(true);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setMode(initialMode);
    setStepIndex(0);
    setIsPlaying(false);
  }, [initialMode]);

  const buildConfig = (): {
    config: SegmentDiagramConfig;
    steps: Array<{
      title: string;
      formula: string;
      note: string;
      focus: 'diff' | 'adjust' | 'base' | 'result';
    }>;
  } => {
    if (mode === 'basic') {
      const diff = smallValue * (multiple - 1);
      const largeValue = smallValue * multiple;
      return {
        config: {
          smallLabel: '乙数（较小）',
          largeLabel: '甲数（较大）',
          unit: '',
          smallValue,
          multiple,
          extra: 0,
          givenDiff: diff,
          effectiveDiff: diff,
          diffNote: `甲比乙多 ${multiple} - 1 = ${multiple - 1} 份`,
        },
        steps: [
          {
            title: '1. 找准相差的份数',
            formula: `相差份数 = ${multiple} - 1 = ${multiple - 1}（份）`,
            note: '甲数里面包含了 1 份和乙数同样多的部分，剩下的才是多出的差。',
            focus: 'diff',
          },
          {
            title: '2. 求出 1 份量（乙数）',
            formula: `乙数 = ${diff} ÷ (${multiple} - 1) = ${smallValue}`,
            note: '用两数之差除以相差的份数，就得到 1 份是多少。',
            focus: 'base',
          },
          {
            title: '3. 求出多倍量（甲数）',
            formula: `甲数 = ${smallValue} × ${multiple} = ${largeValue}`,
            note: `也可以用“乙数 + 差”检验：${smallValue} + ${diff} = ${largeValue}。`,
            focus: 'result',
          },
        ],
      };
    }

    if (mode === 'more') {
      const largeValue = smallValue * multiple + extraAmount;
      const givenDiff = largeValue - smallValue;
      const effectiveDiff = givenDiff - extraAmount;
      return {
        config: {
          smallLabel: '乙数（较小）',
          largeLabel: '甲数（较大）',
          unit: '',
          smallValue,
          multiple,
          extra: extraAmount,
          givenDiff,
          effectiveDiff,
          diffNote: `减去多余的 ${extraAmount}，整倍差 = ${givenDiff} - ${extraAmount} = ${effectiveDiff}`,
        },
        steps: [
          {
            title: '1. 先把“尾巴”剪掉凑整倍',
            formula: `整倍差 = ${givenDiff} - ${extraAmount} = ${effectiveDiff}`,
            note: `甲数比乙数的 ${multiple} 倍多 ${extraAmount}，先减掉 ${extraAmount}，差也跟着减少 ${extraAmount}。`,
            focus: 'adjust',
          },
          {
            title: '2. 求出 1 份量（乙数）',
            formula: `乙数 = ${effectiveDiff} ÷ (${multiple} - 1) = ${smallValue}`,
            note: `此时整倍差 ${effectiveDiff} 正好对应 ${multiple - 1} 份。`,
            focus: 'base',
          },
          {
            title: '3. 加回尾巴求甲数',
            formula: `甲数 = ${smallValue} × ${multiple} + ${extraAmount} = ${largeValue}`,
            note: `验算：${largeValue} - ${smallValue} = ${givenDiff}，完全吻合。`,
            focus: 'result',
          },
        ],
      };
    }

    if (mode === 'less') {
      const safeLack = Math.min(extraAmount, smallValue - 2);
      const largeValue = smallValue * multiple - safeLack;
      const givenDiff = largeValue - smallValue;
      const effectiveDiff = givenDiff + safeLack;
      return {
        config: {
          smallLabel: '乙数（较小）',
          largeLabel: '甲数（较大）',
          unit: '',
          smallValue,
          multiple,
          extra: -safeLack,
          givenDiff,
          effectiveDiff,
          diffNote: `虚线补齐缺少的 ${safeLack}，整倍差 = ${givenDiff} + ${safeLack} = ${effectiveDiff}`,
        },
        steps: [
          {
            title: '1. 虚线“补齐”凑整倍',
            formula: `整倍差 = ${givenDiff} + ${safeLack} = ${effectiveDiff}`,
            note: `甲数还差 ${safeLack} 才够 ${multiple} 倍，补上 ${safeLack} 后，两数之差会变大！`,
            focus: 'adjust',
          },
          {
            title: '2. 求出 1 份量（乙数）',
            formula: `乙数 = ${effectiveDiff} ÷ (${multiple} - 1) = ${smallValue}`,
            note: `补齐后的差 ${effectiveDiff} 对应 ${multiple - 1} 份。`,
            focus: 'base',
          },
          {
            title: '3. 减去借来的部分求甲数',
            formula: `甲数 = ${smallValue} × ${multiple} - ${safeLack} = ${largeValue}`,
            note: `验算：${largeValue} - ${smallValue} = ${givenDiff}，准确无误。`,
            focus: 'result',
          },
        ],
      };
    }

    if (mode === 'digit_zero') {
      const diff = smallValue * 9;
      const largeValue = smallValue * 10;
      return {
        config: {
          smallLabel: '原数（1 份）',
          largeLabel: '末尾添0后',
          unit: '',
          smallValue,
          multiple: 10,
          extra: 0,
          givenDiff: diff,
          effectiveDiff: diff,
          diffNote: '末尾添 0 扩大到 10 倍，相差 10 - 1 = 9 份',
        },
        steps: [
          {
            title: '1. 把“添 0”翻译成 10 倍',
            formula: '相差份数 = 10 - 1 = 9（份）',
            note: '整数末尾添上一个 0 等于乘 10，所以新数比原数多 9 份。',
            focus: 'diff',
          },
          {
            title: '2. 求出原来的数（1 份）',
            formula: `原数 = ${diff} ÷ (10 - 1) = ${smallValue}`,
            note: `多出来的 ${diff} 除以 9 就得到原数。`,
            focus: 'base',
          },
          {
            title: '3. 验算末尾添 0 的差',
            formula: `${largeValue} - ${smallValue} = ${diff}`,
            note: '同样道理，漏写末尾 0 时也是除以 9 先求错数，再乘 10 还原！',
            focus: 'result',
          },
        ],
      };
    }

    if (mode === 'single_side') {
      const safeAfter = Math.max(multiple + 1, thirdMultiple);
      const delta = smallValue * (safeAfter - multiple);
      const beforeVal = smallValue * multiple;
      const afterVal = smallValue * safeAfter;
      return {
        config: {
          smallLabel: '乙（不变）',
          largeLabel: '变化前甲',
          unit: '',
          smallValue,
          multiple,
          extra: 0,
          givenDiff: delta,
          effectiveDiff: delta,
          diffNote: `乙不变（1份），甲从 ${multiple} 份增到 ${safeAfter} 份，多出 ${safeAfter - multiple} 份 = ${delta}`,
          compareBar: {
            label: '变化后甲',
            multiple: safeAfter,
            value: afterVal,
            mode: 'single_side',
          },
        },
        steps: [
          {
            title: '1. 锁定“不变量”作为 1 份',
            formula: `份数变化 = ${safeAfter} - ${multiple} = ${safeAfter - multiple}（份）`,
            note: '乙没有变化，甲增加的数量正好等于倍数之差对应的份数。',
            focus: 'diff',
          },
          {
            title: '2. 求出不变量（乙）',
            formula: `乙 = ${delta} ÷ (${safeAfter} - ${multiple}) = ${smallValue}`,
            note: `增加的 ${delta} 除以 ${safeAfter - multiple} 份，算出 1 份量。`,
            focus: 'base',
          },
          {
            title: '3. 求出原来的甲',
            formula: `原来甲 = ${smallValue} × ${multiple} = ${beforeVal}`,
            note: `验证：${beforeVal} + ${delta} = ${afterVal}，正好是 ${smallValue} 的 ${safeAfter} 倍。`,
            focus: 'result',
          },
        ],
      };
    }

    if (mode === 'three_quantities') {
      const safeThird = Math.max(multiple + 1, thirdMultiple);
      const midVal = smallValue * multiple;
      const thirdVal = smallValue * safeThird;
      const diff = thirdVal - midVal;
      return {
        config: {
          smallLabel: '丙（最小）',
          largeLabel: '乙（中量）',
          unit: '',
          smallValue,
          multiple,
          extra: 0,
          givenDiff: diff,
          effectiveDiff: diff,
          diffNote: `丙 1 份、乙 ${multiple} 份、甲 ${safeThird} 份 → 甲比乙多 ${safeThird - multiple} 份`,
          compareBar: {
            label: '甲（最大）',
            multiple: safeThird,
            value: thirdVal,
            mode: 'three_way',
          },
        },
        steps: [
          {
            title: '1. 把三个量统一成“份数”',
            formula: `甲比乙多 = ${safeThird} - ${multiple} = ${safeThird - multiple}（份）`,
            note: '以最小量丙为 1 份，乙占几份、甲占几份，先看清已知差在谁和谁之间。',
            focus: 'diff',
          },
          {
            title: '2. 求出 1 份量（丙）',
            formula: `丙 = ${diff} ÷ (${safeThird} - ${multiple}) = ${smallValue}`,
            note: '用甲、乙之差除以它们的份数差，求得最小量。',
            focus: 'base',
          },
          {
            title: '3. 依次求出乙和甲',
            formula: `乙 = ${midVal}，甲 = ${thirdVal}`,
            note: `验算：${thirdVal} - ${midVal} = ${diff}。`,
            focus: 'result',
          },
        ],
      };
    }

    const oddMultiple = multiple % 2 === 0 ? multiple + 1 : multiple;
    const effectiveDiff = transferAmount * 2;
    const nowSmall = effectiveDiff / (oddMultiple - 1);
    const originEach = nowSmall + transferAmount;
    const nowLarge = nowSmall * oddMultiple;

    return {
      config: {
        smallLabel: '现在甲（给出后）',
        largeLabel: '现在乙（收到后）',
        unit: '',
        smallValue: nowSmall,
        multiple: oddMultiple,
        extra: 0,
        givenDiff: effectiveDiff,
        effectiveDiff,
        diffNote: `甲少 ${transferAmount}、乙多 ${transferAmount} → 现差 = ${transferAmount} × 2 = ${effectiveDiff}`,
        offsetNote: `原来两人各有：${nowSmall} + ${transferAmount} = ${originEach}`,
      },
      steps: [
        {
          title: '1. 计算移多补少产生的暗差',
          formula: `现差 = ${transferAmount} × 2 = ${effectiveDiff}`,
          note: `原本相等时，甲给乙 ${transferAmount} 个，甲少 ${transferAmount} 同时乙多 ${transferAmount}，相差 2 倍！`,
          focus: 'diff',
        },
        {
          title: '2. 求出给出后较少的甲',
          formula: `现在甲 = ${effectiveDiff} ÷ (${oddMultiple} - 1) = ${nowSmall}`,
          note: `此时乙是甲的 ${oddMultiple} 倍，相差 ${oddMultiple - 1} 份。（现乙 = ${nowLarge}）`,
          focus: 'base',
        },
        {
          title: '3. 还原原来各有多少',
          formula: `原来各有 = ${nowSmall} + ${transferAmount} = ${originEach}`,
          note: `把甲给出的 ${transferAmount} 个加回来即可。`,
          focus: 'result',
        },
      ],
    };
  };

  const { config, steps } = buildConfig();
  const focusPart = stepIndex === 0 ? 'all' : steps[stepIndex - 1]?.focus ?? 'all';

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleModeChange = (nextMode: SandboxMode) => {
    setMode(nextMode);
    setStepIndex(0);
    setIsPlaying(false);
    if (nextMode === 'single_side' || nextMode === 'three_quantities') {
      if (thirdMultiple <= multiple) {
        setThirdMultiple(multiple + 2);
      }
    }
    if (nextMode === 'transfer' && transferAmount % 2 !== 0) {
      setTransferAmount(12);
    }
  };

  const sandboxTabs: Array<{ id: SandboxMode; label: string }> = [
    { id: 'basic', label: '标准差倍' },
    { id: 'more', label: '几倍多几' },
    { id: 'less', label: '几倍少几' },
    { id: 'transfer', label: '移多补少' },
    { id: 'digit_zero', label: '添0去0' },
    { id: 'single_side', label: '单边变化' },
    { id: 'three_quantities', label: '三量差倍' },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-sky-700 tracking-wide">
            互动建模实验室 · 7 种线段图模型
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            差倍计算动态线段图沙盒
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            切换不同差倍模型并拖动滑块，实时观察 1 份量、差值括号与多余/补齐线段的变化规律。
          </p>
        </div>

        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0"
          role="tablist"
          aria-label="线段图模式切换"
        >
          {sandboxTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => handleModeChange(tab.id)}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                mode === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-800 text-sm">实时线段图画板</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-math">
                  1份 = {revealNumbers ? config.smallValue : '？'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-math">
                  倍数 = {config.multiple}倍
                  {config.compareBar ? ` → ${config.compareBar.multiple}倍` : ''}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setRevealNumbers((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {revealNumbers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {revealNumbers ? '隐藏数字（考考自己）' : '显示数字'}
              </button>
            </div>

            <div className="mt-4 rounded-lg math-grid-bg border border-slate-100 p-3 sm:p-4">
              <SegmentDiagramSVG
                config={config}
                revealNumbers={revealNumbers}
                focusPart={focusPart}
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepIndex((s) => Math.max(0, s - 1));
                }}
                disabled={stepIndex === 0}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                上一步
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isPlaying) {
                    setIsPlaying(false);
                  } else {
                    if (stepIndex === 0 || stepIndex >= steps.length) {
                      setStepIndex(1);
                    }
                    setIsPlaying(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? '暂停演示' : '自动分步演示'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepIndex((s) => (s >= steps.length ? 0 : s + 1));
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                下一步
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepIndex(0);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                aria-label="重置分步"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                全部显示
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span>蓝色实线：基准份数</span>
              <span>琥珀段：相差部分</span>
              {mode === 'more' && <span>红色实段：多余尾巴</span>}
              {mode === 'less' && <span>红色虚线：补齐部分</span>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900">调整数量参数</h2>

            {mode !== 'transfer' ? (
              <>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label htmlFor="slider-small" className="font-medium text-slate-700">
                      {mode === 'digit_zero'
                        ? '原来的整数（1 份）'
                        : mode === 'single_side'
                        ? '不变的量（1 份）'
                        : '最小量（1 份）'}
                    </label>
                    <span className="font-mono-math font-semibold text-sky-700 tabular-nums">
                      {smallValue}
                    </span>
                  </div>
                  <input
                    id="slider-small"
                    type="range"
                    min={10}
                    max={80}
                    step={2}
                    value={smallValue}
                    onChange={(e) => setSmallValue(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                {mode !== 'digit_zero' && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label htmlFor="slider-multiple" className="font-medium text-slate-700">
                        {mode === 'single_side'
                          ? '变化前的倍数'
                          : mode === 'three_quantities'
                          ? '中间量（乙）的倍数'
                          : '倍数关系'}
                      </label>
                      <span className="font-mono-math font-semibold text-slate-900 tabular-nums">
                        {multiple} 倍
                      </span>
                    </div>
                    <input
                      id="slider-multiple"
                      type="range"
                      min={2}
                      max={mode === 'single_side' || mode === 'three_quantities' ? 4 : 6}
                      step={1}
                      value={Math.min(
                        multiple,
                        mode === 'single_side' || mode === 'three_quantities' ? 4 : 6
                      )}
                      onChange={(e) => {
                        const nextM = Number(e.target.value);
                        setMultiple(nextM);
                        if (thirdMultiple <= nextM) {
                          setThirdMultiple(nextM + 2);
                        }
                      }}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                )}

                {(mode === 'single_side' || mode === 'three_quantities') && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label htmlFor="slider-third-mult" className="font-medium text-slate-700">
                        {mode === 'single_side' ? '变化后的倍数' : '最大量（甲）的倍数'}
                      </label>
                      <span className="font-mono-math font-semibold text-amber-700 tabular-nums">
                        {Math.max(multiple + 1, thirdMultiple)} 倍（相差{' '}
                        {Math.max(multiple + 1, thirdMultiple) - multiple} 份）
                      </span>
                    </div>
                    <input
                      id="slider-third-mult"
                      type="range"
                      min={multiple + 1}
                      max={7}
                      step={1}
                      value={Math.max(multiple + 1, thirdMultiple)}
                      onChange={(e) => setThirdMultiple(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                )}

                {(mode === 'more' || mode === 'less') && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label htmlFor="slider-extra" className="font-medium text-slate-700">
                        {mode === 'more' ? '多出的尾数（+几）' : '缺少的尾数（-几）'}
                      </label>
                      <span className="font-mono-math font-semibold text-rose-600 tabular-nums">
                        {mode === 'more'
                          ? `+${extraAmount}`
                          : `-${Math.min(extraAmount, smallValue - 2)}`}
                      </span>
                    </div>
                    <input
                      id="slider-extra"
                      type="range"
                      min={2}
                      max={20}
                      step={1}
                      value={extraAmount}
                      onChange={(e) => setExtraAmount(Number(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label htmlFor="slider-transfer" className="font-medium text-slate-700">
                      从甲拿给乙的数量（原本一样多）
                    </label>
                    <span className="font-mono-math font-semibold text-amber-700 tabular-nums">
                      {transferAmount} 个（现差 {transferAmount * 2} 个）
                    </span>
                  </div>
                  <input
                    id="slider-transfer"
                    type="range"
                    min={4}
                    max={36}
                    step={2}
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="font-medium text-slate-700">
                      移动后的倍数（选择整除倍数）
                    </label>
                    <span className="font-mono-math font-semibold text-slate-900 tabular-nums">
                      {config.multiple} 倍
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[3, 5].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMultiple(m)}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          (multiple % 2 === 0 ? multiple + 1 : multiple) === m
                            ? 'bg-sky-50 border-sky-300 text-sky-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {m} 倍（相差 {m - 1} 份）
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">算式推演三步曲</h3>
              <span className="text-xs text-slate-500 tabular-nums">
                {stepIndex === 0 ? '总览模式' : `第 ${stepIndex} / ${steps.length} 步`}
              </span>
            </div>

            <div className="space-y-2.5">
              {steps.map((step, idx) => {
                const isActive = stepIndex === 0 || stepIndex === idx + 1;
                const isCurrent = stepIndex === idx + 1;
                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setStepIndex(idx + 1);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-sky-50/70 border-sky-300'
                        : isActive
                        ? 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                        : 'bg-white border-slate-100 opacity-50 hover:opacity-80'
                    }`}
                  >
                    <p className="text-xs font-semibold text-slate-800">{step.title}</p>
                    <p className="mt-1 text-sm font-semibold font-mono-math text-sky-800 tabular-nums">
                      {step.formula}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{step.note}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
