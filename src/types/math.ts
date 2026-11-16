export type ProblemCategory =
  | 'basic'
  | 'more_less'
  | 'same_change'
  | 'transfer'
  | 'comprehensive'
  | 'digit_zero'
  | 'single_side'
  | 'three_quantities';

export interface SegmentDiagramConfig {
  /** 1倍量名称（较小量或不变基准量） */
  smallLabel: string;
  /** 多倍量名称（较大量） */
  largeLabel: string;
  /** 单位（如 吨、本、岁、元） */
  unit: string;
  /** 1倍量真实数值 */
  smallValue: number;
  /** 倍数（整倍部分） */
  multiple: number;
  /** 几倍多几(>0) 或 几倍少几(<0) */
  extra: number;
  /** 原始差值或题目给定的差值 */
  givenDiff: number;
  /** 经过去多/补少或移多补少后，对应整倍差的数值 */
  effectiveDiff: number;
  /** 暗差说明文字（如：年龄差不变 / 移多补少 12×2=24） */
  diffNote?: string;
  /** 虚线附加段说明（如：同减7吨 / 原来多12枚） */
  offsetNote?: string;
  /** 可选第三条线段（用于“三量差倍”或“单边增减前后对比”） */
  compareBar?: {
    label: string;
    multiple: number;
    extra?: number;
    value: number;
    /** 'three_way' 表示三量差倍（差在第2与第3条之间）；'single_side' 表示单边变化前后对比 */
    mode: 'three_way' | 'single_side';
  };
}

export interface SolutionStep {
  title: string;
  explanation: string;
  formula: string;
  focusPart: 'all' | 'base' | 'diff' | 'adjust' | 'result';
}

export interface AnswerField {
  key: string;
  label: string;
  unit: string;
  correctValue: number;
}

export interface PracticeProblem {
  id: string;
  chapterId: ProblemCategory;
  code: string;
  title: string;
  difficulty: 1 | 2 | 3;
  questionText: string;
  /** 交互填空字段（1~3个结果） */
  answerFields: AnswerField[];
  /** 核心口诀提示 */
  hint: string;
  /** 常见错因自动识别规则（例如未减1、加减反向、忘记乘2） */
  commonMistakes: Array<{
    check: (answers: Record<string, number>) => boolean;
    feedback: string;
  }>;
  diagram: SegmentDiagramConfig;
  steps: SolutionStep[];
}

export interface ChapterModule {
  id: ProblemCategory;
  orderLabel: string;
  title: string;
  subtitle: string;
  coreFormula: string;
  keyInsight: string;
  example: PracticeProblem;
  exercises: PracticeProblem[];
}

export interface WrongNoteEntry {
  id: string;
  problemId: string;
  code: string;
  title: string;
  questionText: string;
  userAnswers: Record<string, number>;
  correctAnswers: Record<string, number>;
  timestamp: number;
  problem: PracticeProblem;
}
