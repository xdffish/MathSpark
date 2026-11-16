import React from 'react';
import { SegmentDiagramConfig } from '../types/math';

interface SegmentDiagramSVGProps {
  config: SegmentDiagramConfig;
  /** 是否显示具体算出来的数值；做题提示模式下可隐藏 1 份数值显示 "?" */
  revealNumbers?: boolean;
  /** 当前高亮的推理阶段 */
  focusPart?: 'all' | 'base' | 'diff' | 'adjust' | 'result';
}

export const SegmentDiagramSVG: React.FC<SegmentDiagramSVGProps> = ({
  config,
  revealNumbers = true,
  focusPart = 'all',
}) => {
  const {
    smallLabel,
    largeLabel,
    unit,
    smallValue,
    multiple,
    extra,
    givenDiff,
    effectiveDiff,
    diffNote,
    offsetNote,
    compareBar,
  } = config;

  const hasThirdBar = Boolean(compareBar);
  const svgWidth = 760;
  const svgHeight = hasThirdBar ? 336 : 292;
  const leftMargin = 136;
  const rightMargin = 72;
  const maxBarWidth = svgWidth - leftMargin - rightMargin;

  const maxMultiple = compareBar
    ? Math.max(multiple, compareBar.multiple)
    : multiple;

  const extraVisualRatio =
    extra !== 0
      ? Math.min(0.6, Math.max(0.26, Math.abs(extra) / Math.max(smallValue, 1)))
      : 0;
  const compareExtraRatio =
    compareBar?.extra && compareBar.extra > 0 ? 0.35 : 0;

  const totalUnits =
    maxMultiple +
    Math.max(extra > 0 ? extraVisualRatio : 0, compareExtraRatio);
  const unitPx = Math.min(126, Math.max(42, maxBarWidth / Math.max(totalUnits, 2.2)));

  const smallY = hasThirdBar ? 62 : 78;
  const largeY = hasThirdBar ? 132 : 164;
  const thirdY = 204;

  const smallEndX = leftMargin + unitPx;
  const multipleEndX = leftMargin + multiple * unitPx;

  const extraPx =
    extra !== 0
      ? Math.max(32, Math.min(unitPx * 0.7, unitPx * extraVisualRatio))
      : 0;
  const actualLargeEndX =
    extra > 0
      ? multipleEndX + extraPx
      : extra < 0
      ? multipleEndX - extraPx
      : multipleEndX;

  const fullMultipleEndX = multipleEndX;
  const largeDisplayValue = smallValue * multiple + extra;

  const isBaseDim = focusPart !== 'all' && focusPart !== 'base' && focusPart !== 'result';
  const isDiffFocus = focusPart === 'diff' || focusPart === 'adjust';
  const isAdjustFocus = focusPart === 'adjust';
  const isResultFocus = focusPart === 'result';

  const makeBottomBracket = (x1: number, x2: number, y: number, depth = 12) => {
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y} L ${x1} ${y + depth - 4} Q ${x1} ${y + depth} ${x1 + 6} ${y + depth} L ${mid - 6} ${y + depth} L ${mid} ${y + depth + 6} L ${mid + 6} ${y + depth} L ${x2 - 6} ${y + depth} Q ${x2} ${y + depth} ${x2} ${y + depth - 4} L ${x2} ${y}`;
  };

  const makeTopBracket = (x1: number, x2: number, y: number, height = 10) => {
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y} L ${x1} ${y - height + 3} Q ${x1} ${y - height} ${x1 + 5} ${y - height} L ${mid - 5} ${y - height} L ${mid} ${y - height - 5} L ${mid + 5} ${y - height} L ${x2 - 5} ${y - height} Q ${x2} ${y - height} ${x2} ${y - height + 3} L ${x2} ${y}`;
  };

  const compactUnitLabels = maxMultiple >= 7;

  // Render 3-bar diagram when compareBar is provided (三量差倍 / 单边增减)
  if (compareBar) {
    const thirdMultipleEndX = leftMargin + compareBar.multiple * unitPx;
    const thirdExtra = compareBar.extra ?? 0;
    const thirdExtraPx = thirdExtra > 0 ? Math.max(30, unitPx * 0.35) : 0;
    const actualThirdEndX = thirdMultipleEndX + thirdExtraPx;
    const alignStartX = multipleEndX;

    return (
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[560px] h-auto select-none"
          role="img"
          aria-label={`${smallLabel}、${largeLabel}与${compareBar.label}线段对比图`}
        >
          {/* Row 1: 1-Unit Benchmark */}
          <text
            x={leftMargin - 14}
            y={smallY + 4}
            textAnchor="end"
            className="fill-slate-800 text-[14px] font-semibold"
          >
            {smallLabel}
          </text>
          <text
            x={leftMargin - 14}
            y={smallY + 20}
            textAnchor="end"
            className="fill-slate-500 text-[11px]"
          >
            （1 份基准）
          </text>

          <g style={{ opacity: isBaseDim ? 0.55 : 1, transition: 'opacity 180ms ease' }}>
            <path
              d={makeTopBracket(leftMargin, smallEndX, smallY - 7, 8)}
              fill="none"
              stroke="#0284C7"
              strokeWidth="1.6"
            />
            <text
              x={(leftMargin + smallEndX) / 2}
              y={smallY - 22}
              textAnchor="middle"
              className="fill-sky-700 text-[12px] font-semibold font-mono-math"
            >
              {revealNumbers ? `${smallValue}${unit}` : '？(1份)'}
            </text>
            <line
              x1={leftMargin}
              y1={smallY}
              x2={smallEndX}
              y2={smallY}
              stroke="#0284C7"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx={leftMargin} cy={smallY} r="4" fill="#0284C7" />
            <circle cx={smallEndX} cy={smallY} r="4" fill="#0284C7" />
          </g>

          {/* Vertical guide at 1 unit */}
          <line
            x1={smallEndX}
            y1={smallY + 6}
            x2={smallEndX}
            y2={thirdY + 12}
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Row 2: Second Quantity */}
          <text
            x={leftMargin - 14}
            y={largeY + 4}
            textAnchor="end"
            className="fill-slate-800 text-[14px] font-semibold"
          >
            {largeLabel}
          </text>
          <text
            x={leftMargin - 14}
            y={largeY + 20}
            textAnchor="end"
            className="fill-slate-500 text-[11px]"
          >
            （{multiple} 份）
          </text>

          <line
            x1={leftMargin}
            y1={largeY}
            x2={multipleEndX}
            y2={largeY}
            stroke="#0284C7"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {Array.from({ length: multiple + 1 }).map((_, i) => {
            const x = leftMargin + i * unitPx;
            return (
              <g key={`r2-${i}`}>
                <line
                  x1={x}
                  y1={largeY - 6}
                  x2={x}
                  y2={largeY + 6}
                  stroke="#0369A1"
                  strokeWidth="2"
                />
                {i < multiple && !compactUnitLabels && (
                  <text
                    x={x + unitPx / 2}
                    y={largeY - 12}
                    textAnchor="middle"
                    className="fill-slate-500 text-[11px]"
                  >
                    1份
                  </text>
                )}
              </g>
            );
          })}
          {revealNumbers && (
            <text
              x={multipleEndX + 12}
              y={largeY + 4}
              className="fill-slate-700 text-[12px] font-semibold font-mono-math"
            >
              {largeDisplayValue}{unit}
            </text>
          )}

          {/* Vertical alignment guide from Row 2 end down to Row 3 */}
          <line
            x1={alignStartX}
            y1={largeY + 6}
            x2={alignStartX}
            y2={thirdY + 18}
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />

          {/* Row 3: Third / After Quantity */}
          <text
            x={leftMargin - 14}
            y={thirdY + 4}
            textAnchor="end"
            className="fill-slate-800 text-[14px] font-semibold"
          >
            {compareBar.label}
          </text>
          <text
            x={leftMargin - 14}
            y={thirdY + 20}
            textAnchor="end"
            className="fill-slate-500 text-[11px]"
          >
            {thirdExtra > 0
              ? `（${compareBar.multiple} 份多 ${thirdExtra}）`
              : `（${compareBar.multiple} 份）`}
          </text>

          {/* Same-as-Row-2 prefix */}
          <line
            x1={leftMargin}
            y1={thirdY}
            x2={alignStartX}
            y2={thirdY}
            stroke="#0284C7"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ opacity: isDiffFocus ? 0.5 : 1 }}
          />
          {/* Difference portion in Amber */}
          <line
            x1={alignStartX}
            y1={thirdY}
            x2={thirdMultipleEndX}
            y2={thirdY}
            stroke={isDiffFocus || isResultFocus ? '#D97706' : '#0F172A'}
            strokeWidth="6"
          />
          {thirdExtra > 0 && (
            <line
              x1={thirdMultipleEndX}
              y1={thirdY}
              x2={actualThirdEndX}
              y2={thirdY}
              stroke="#E11D48"
              strokeWidth="6"
              strokeLinecap="round"
            />
          )}
          {Array.from({ length: compareBar.multiple + 1 }).map((_, i) => {
            const x = leftMargin + i * unitPx;
            return (
              <line
                key={`r3-${i}`}
                x1={x}
                y1={thirdY - 6}
                x2={x}
                y2={thirdY + 6}
                stroke={i >= multiple ? '#B45309' : '#0369A1'}
                strokeWidth="2"
              />
            );
          })}
          {thirdExtra > 0 && (
            <text
              x={(thirdMultipleEndX + actualThirdEndX) / 2}
              y={thirdY - 12}
              textAnchor="middle"
              className="fill-rose-600 text-[11px] font-semibold font-mono-math"
            >
              +{thirdExtra}{unit}
            </text>
          )}
          {revealNumbers && (
            <text
              x={actualThirdEndX + 12}
              y={thirdY + 4}
              className="fill-slate-700 text-[12px] font-semibold font-mono-math"
            >
              {compareBar.value}{unit}
            </text>
          )}

          {/* Difference Bracket between Row 2 and Row 3 */}
          <path
            d={makeBottomBracket(alignStartX, actualThirdEndX, thirdY + 12, 12)}
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
          />
          <text
            x={(alignStartX + actualThirdEndX) / 2}
            y={thirdY + 46}
            textAnchor="middle"
            className="fill-amber-700 text-[13px] font-semibold font-mono-math"
          >
            {thirdExtra > 0
              ? `相差 ${givenDiff}${unit}（去掉+${thirdExtra}后，整倍差 ${effectiveDiff}${unit} = ${compareBar.multiple - multiple} 份）`
              : `相差 ${givenDiff}${unit}（对应 ${compareBar.multiple} - ${multiple} = ${compareBar.multiple - multiple} 份）`}
          </text>

          {(diffNote || offsetNote) && (
            <text x={leftMargin} y={svgHeight - 14} className="fill-slate-500 text-[12px]">
              {[diffNote, offsetNote].filter(Boolean).join(' · ')}
            </text>
          )}
        </svg>
      </div>
    );
  }

  // Standard 2-bar Diagram
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full min-w-[540px] h-auto select-none"
        role="img"
        aria-label={`${smallLabel}与${largeLabel}差倍关系线段图`}
      >
        {/* Top Row Label */}
        <text
          x={leftMargin - 16}
          y={smallY + 5}
          textAnchor="end"
          className="fill-slate-800 text-[15px] font-semibold"
        >
          {smallLabel}
        </text>
        <text
          x={leftMargin - 16}
          y={smallY + 23}
          textAnchor="end"
          className="fill-slate-500 text-[12px]"
        >
          （1 份）
        </text>

        {/* 1-Unit Segment (Small Value) */}
        <g style={{ opacity: isBaseDim ? 0.55 : 1, transition: 'opacity 180ms ease' }}>
          <path
            d={makeTopBracket(leftMargin, smallEndX, smallY - 8, 9)}
            fill="none"
            stroke="#0284C7"
            strokeWidth="1.75"
          />
          <text
            x={(leftMargin + smallEndX) / 2}
            y={smallY - 26}
            textAnchor="middle"
            className="fill-sky-700 text-[13px] font-semibold font-mono-math"
          >
            {revealNumbers ? `${smallValue}${unit}` : '？(1份)'}
          </text>

          <line
            x1={leftMargin}
            y1={smallY}
            x2={smallEndX}
            y2={smallY}
            stroke="#0284C7"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx={leftMargin} cy={smallY} r="4.5" fill="#0284C7" />
          <circle cx={smallEndX} cy={smallY} r="4.5" fill="#0284C7" />
        </g>

        {/* Vertical Alignment Dashed Line */}
        <line
          x1={smallEndX}
          y1={smallY + 6}
          x2={smallEndX}
          y2={largeY + 24}
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />

        {/* Bottom Row Label */}
        <text
          x={leftMargin - 16}
          y={largeY + 5}
          textAnchor="end"
          className="fill-slate-800 text-[15px] font-semibold"
        >
          {largeLabel}
        </text>
        <text
          x={leftMargin - 16}
          y={largeY + 23}
          textAnchor="end"
          className="fill-slate-500 text-[12px]"
        >
          {extra === 0
            ? `（${multiple} 份）`
            : extra > 0
            ? `（${multiple} 份多 ${extra}）`
            : `（${multiple} 份少 ${Math.abs(extra)}）`}
        </text>

        {/* First segment of Large Value */}
        <g style={{ opacity: isDiffFocus ? 0.45 : 1, transition: 'opacity 180ms ease' }}>
          <line
            x1={leftMargin}
            y1={largeY}
            x2={smallEndX}
            y2={largeY}
            stroke="#0284C7"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx={leftMargin} cy={largeY} r="4.5" fill="#0284C7" />
          <text
            x={(leftMargin + smallEndX) / 2}
            y={largeY - 14}
            textAnchor="middle"
            className="fill-sky-700 text-[12px] font-medium"
          >
            {compactUnitLabels ? '1' : '同样多 1 份'}
          </text>
        </g>

        {/* Remaining (multiple - 1) full segments */}
        {Array.from({ length: Math.max(0, multiple - 1) }).map((_, idx) => {
          const segStart = smallEndX + idx * unitPx;
          const isLastMultipleSeg = idx === multiple - 2;
          const segEnd =
            extra < 0 && isLastMultipleSeg
              ? actualLargeEndX
              : smallEndX + (idx + 1) * unitPx;

          return (
            <g
              key={idx}
              style={{
                opacity: focusPart === 'base' ? 0.45 : 1,
                transition: 'opacity 180ms ease',
              }}
            >
              <line
                x1={segStart}
                y1={largeY}
                x2={segEnd}
                y2={largeY}
                stroke={isDiffFocus || isResultFocus ? '#D97706' : '#0F172A'}
                strokeWidth="6"
              />
              <line
                x1={segStart}
                y1={largeY - 7}
                x2={segStart}
                y2={largeY + 7}
                stroke="#475569"
                strokeWidth="2"
              />
              <text
                x={(segStart + segEnd) / 2}
                y={largeY - 14}
                textAnchor="middle"
                className="fill-slate-600 text-[11px] font-mono-math"
              >
                {extra < 0 && isLastMultipleSeg
                  ? '不足1份'
                  : compactUnitLabels
                  ? `${idx + 2}`
                  : `第${idx + 2}份`}
              </text>
            </g>
          );
        })}

        {/* Case A: Extra > 0 */}
        {extra > 0 && (
          <g style={{ opacity: isAdjustFocus || focusPart === 'all' || isResultFocus ? 1 : 0.6 }}>
            <line
              x1={multipleEndX}
              y1={largeY}
              x2={actualLargeEndX}
              y2={largeY}
              stroke="#E11D48"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1={multipleEndX}
              y1={largeY - 8}
              x2={multipleEndX}
              y2={largeY + 8}
              stroke="#E11D48"
              strokeWidth="2.5"
            />
            <circle cx={actualLargeEndX} cy={largeY} r="4.5" fill="#E11D48" />
            <text
              x={(multipleEndX + actualLargeEndX) / 2}
              y={largeY - 14}
              textAnchor="middle"
              className="fill-rose-600 text-[12px] font-semibold font-mono-math"
            >
              +{extra}{unit}
            </text>
          </g>
        )}

        {/* Case B: Extra < 0 */}
        {extra < 0 && (
          <g style={{ opacity: isAdjustFocus || focusPart === 'all' || isDiffFocus ? 1 : 0.6 }}>
            <line
              x1={actualLargeEndX}
              y1={largeY}
              x2={fullMultipleEndX}
              y2={largeY}
              stroke="#E11D48"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <circle cx={actualLargeEndX} cy={largeY} r="4.5" fill="#0F172A" />
            <circle
              cx={fullMultipleEndX}
              cy={largeY}
              r="4"
              fill="#FFFFFF"
              stroke="#E11D48"
              strokeWidth="2"
            />
            <text
              x={(actualLargeEndX + fullMultipleEndX) / 2}
              y={largeY - 14}
              textAnchor="middle"
              className="fill-rose-600 text-[12px] font-semibold font-mono-math"
            >
              补{Math.abs(extra)}{unit}
            </text>
          </g>
        )}

        {/* Case C: Extra === 0 */}
        {extra === 0 && (
          <circle
            cx={multipleEndX}
            cy={largeY}
            r="4.5"
            fill={isDiffFocus || isResultFocus ? '#D97706' : '#0F172A'}
          />
        )}

        {revealNumbers && (
          <text
            x={Math.max(actualLargeEndX, fullMultipleEndX) + 12}
            y={largeY + 5}
            className="fill-slate-700 text-[13px] font-semibold font-mono-math"
          >
            共 {largeDisplayValue}{unit}
          </text>
        )}

        {/* Bottom Difference Bracket */}
        {extra === 0 ? (
          <g>
            <path
              d={makeBottomBracket(smallEndX, multipleEndX, largeY + 12, 13)}
              fill="none"
              stroke="#D97706"
              strokeWidth="2"
            />
            <text
              x={(smallEndX + multipleEndX) / 2}
              y={largeY + 46}
              textAnchor="middle"
              className="fill-amber-700 text-[13px] font-semibold font-mono-math"
            >
              相差 {givenDiff}{unit}（对应 {multiple} - 1 = {multiple - 1} 份）
            </text>
          </g>
        ) : (
          <g>
            <path
              d={makeBottomBracket(smallEndX, actualLargeEndX, largeY + 12, 11)}
              fill="none"
              stroke="#64748B"
              strokeWidth="1.75"
            />
            <text
              x={(smallEndX + actualLargeEndX) / 2}
              y={largeY + 42}
              textAnchor="middle"
              className="fill-slate-600 text-[12px] font-medium font-mono-math"
            >
              原差：{givenDiff}{unit}
            </text>

            <path
              d={makeBottomBracket(smallEndX, fullMultipleEndX, largeY + 50, 11)}
              fill="none"
              stroke="#D97706"
              strokeWidth="2"
            />
            <text
              x={(smallEndX + fullMultipleEndX) / 2}
              y={largeY + 80}
              textAnchor="middle"
              className="fill-amber-700 text-[13px] font-semibold font-mono-math"
            >
              整倍差：{effectiveDiff}{unit}（{multiple - 1} 份）
            </text>
          </g>
        )}

        {(diffNote || offsetNote) && (
          <text x={leftMargin} y={svgHeight - 12} className="fill-slate-500 text-[12px]">
            {[diffNote, offsetNote].filter(Boolean).join(' · ')}
          </text>
        )}
      </svg>
    </div>
  );
};
