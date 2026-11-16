import { PracticeProblem } from '../types/math';

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickOne = <T,>(items: T[]): T => items[randInt(0, items.length - 1)];

export type GeneratorMode =
  | 'all'
  | 'basic'
  | 'more'
  | 'less'
  | 'transfer'
  | 'same_change'
  | 'digit_zero'
  | 'single_side'
  | 'three_quantities';

export function generateRandomProblem(mode: GeneratorMode = 'all'): PracticeProblem {
  const allModes: Array<Exclude<GeneratorMode, 'all'>> = [
    'basic',
    'more',
    'less',
    'transfer',
    'same_change',
    'digit_zero',
    'single_side',
    'three_quantities',
  ];
  const effectiveMode: Exclude<GeneratorMode, 'all'> =
    mode === 'all' ? pickOne(allModes) : mode;

  const uid = `gen-${Date.now()}-${randInt(100, 999)}`;

  if (effectiveMode === 'basic') {
    const scenarios = [
      { large: '甲队人数', small: '乙队人数', unit: '人', verb: '多' },
      { large: '大货车载重', small: '小货车载重', unit: '吨', verb: '多' },
      { large: '故事书', small: '连环画', unit: '本', verb: '多' },
      { large: '苹果树', small: '橘子树', unit: '棵', verb: '多' },
    ];
    const sc = pickOne(scenarios);
    const multiple = randInt(3, 6);
    const smallVal = randInt(12, 65);
    const largeVal = smallVal * multiple;
    const diff = largeVal - smallVal;

    return {
      id: uid,
      chapterId: 'basic',
      code: '随机变式题',
      title: `标准差倍：${sc.large}与${sc.small}`,
      difficulty: 1,
      questionText: `${sc.large}比${sc.small}${sc.verb} ${diff} ${sc.unit}，${sc.large}是${sc.small}的 ${multiple} 倍。${sc.large}和${sc.small}各是多少${sc.unit}？`,
      answerFields: [
        { key: 'large', label: sc.large, unit: sc.unit, correctValue: largeVal },
        { key: 'small', label: sc.small, unit: sc.unit, correctValue: smallVal },
      ],
      hint: `把${sc.small}看作 1 份，${sc.large}是 ${multiple} 份，相差 ${multiple} - 1 = ${multiple - 1} 份。`,
      commonMistakes: [
        {
          check: (ans) => ans.small === Math.round(diff / multiple),
          feedback: `记得用倍数减 1！${diff} 对应的是 ${multiple} - 1 = ${multiple - 1} 份，而不是 ${multiple} 份哦。`,
        },
      ],
      diagram: {
        smallLabel: sc.small,
        largeLabel: sc.large,
        unit: sc.unit,
        smallValue: smallVal,
        multiple,
        extra: 0,
        givenDiff: diff,
        effectiveDiff: diff,
        diffNote: `相差 ${multiple} - 1 = ${multiple - 1} 份，对应 ${diff} ${sc.unit}`,
      },
      steps: [
        {
          title: '找准相差份数',
          explanation: `把${sc.small}看作 1 份，${sc.large}有 ${multiple} 份，多出 ${multiple} - 1 = ${multiple - 1} 份。`,
          formula: `相差份数 = ${multiple} - 1 = ${multiple - 1}（份）`,
          focusPart: 'diff',
        },
        {
          title: `求 1 份量（${sc.small}）`,
          explanation: `用差除以相差的份数得到${sc.small}。`,
          formula: `${sc.small} = ${diff} ÷ ${multiple - 1} = ${smallVal}（${sc.unit}）`,
          focusPart: 'base',
        },
        {
          title: `求多倍量（${sc.large}）`,
          explanation: `${sc.large}是${sc.small}的 ${multiple} 倍。`,
          formula: `${sc.large} = ${smallVal} × ${multiple} = ${largeVal}（${sc.unit}）`,
          focusPart: 'result',
        },
      ],
    };
  }

  if (effectiveMode === 'more') {
    const scenarios = [
      { large: '红气球', small: '蓝气球', unit: '个' },
      { large: '甲桶油', small: '乙桶油', unit: '千克' },
      { large: '松树', small: '柏树', unit: '棵' },
    ];
    const sc = pickOne(scenarios);
    const multiple = randInt(3, 5);
    const smallVal = randInt(10, 45);
    const extra = randInt(3, 14);
    const largeVal = smallVal * multiple + extra;
    const givenDiff = largeVal - smallVal;
    const effectiveDiff = givenDiff - extra;

    return {
      id: uid,
      chapterId: 'more_less',
      code: '随机变式题',
      title: `几倍多几：${sc.large}与${sc.small}`,
      difficulty: 2,
      questionText: `${sc.large}比${sc.small}多 ${givenDiff} ${sc.unit}，且${sc.large}比${sc.small}的 ${multiple} 倍多 ${extra} ${sc.unit}。${sc.large}和${sc.small}各有多少${sc.unit}？`,
      answerFields: [
        { key: 'large', label: sc.large, unit: sc.unit, correctValue: largeVal },
        { key: 'small', label: sc.small, unit: sc.unit, correctValue: smallVal },
      ],
      hint: `先把多出的 ${extra} ${sc.unit}减掉，整倍差 = ${givenDiff} - ${extra} = ${effectiveDiff} ${sc.unit}！`,
      commonMistakes: [
        {
          check: (ans) => ans.small === Math.round((givenDiff + extra) / (multiple - 1)),
          feedback: `几倍“多”几时，先把多余的 ${extra} 减掉，差值应该变小（${givenDiff} - ${extra} = ${effectiveDiff}），不能用加法哦。`,
        },
      ],
      diagram: {
        smallLabel: sc.small,
        largeLabel: sc.large,
        unit: sc.unit,
        smallValue: smallVal,
        multiple,
        extra,
        givenDiff,
        effectiveDiff,
        diffNote: `减去多余的 ${extra} ${sc.unit}，整倍差 = ${givenDiff} - ${extra} = ${effectiveDiff} ${sc.unit}`,
      },
      steps: [
        {
          title: '去掉多余部分凑成整倍',
          explanation: `把多出来的 ${extra} ${sc.unit}剪掉后，正好是 ${multiple} 倍。`,
          formula: `整倍差 = ${givenDiff} - ${extra} = ${effectiveDiff}（${sc.unit}）`,
          focusPart: 'adjust',
        },
        {
          title: `求 1 份量（${sc.small}）`,
          explanation: `${effectiveDiff} 对应 ${multiple} - 1 = ${multiple - 1} 份。`,
          formula: `${sc.small} = ${effectiveDiff} ÷ (${multiple} - 1) = ${smallVal}（${sc.unit}）`,
          focusPart: 'base',
        },
        {
          title: `求${sc.large}`,
          explanation: `用 1 份量乘 ${multiple} 再加上刚才减掉的 ${extra}。`,
          formula: `${sc.large} = ${smallVal} × ${multiple} + ${extra} = ${largeVal}（${sc.unit}）`,
          focusPart: 'result',
        },
      ],
    };
  }

  if (effectiveMode === 'less') {
    const scenarios = [
      { large: '大箱橘子', small: '小箱橘子', unit: '个' },
      { large: '科技馆门票', small: '动物园门票', unit: '元' },
      { large: '白兔', small: '灰兔', unit: '只' },
    ];
    const sc = pickOne(scenarios);
    const multiple = randInt(3, 5);
    const smallVal = randInt(15, 50);
    const lack = randInt(3, 12);
    const largeVal = smallVal * multiple - lack;
    const givenDiff = largeVal - smallVal;
    const effectiveDiff = givenDiff + lack;

    return {
      id: uid,
      chapterId: 'more_less',
      code: '随机变式题',
      title: `几倍少几：${sc.large}与${sc.small}`,
      difficulty: 2,
      questionText: `${sc.large}比${sc.small}多 ${givenDiff} ${sc.unit}，且${sc.large}比${sc.small}的 ${multiple} 倍少 ${lack} ${sc.unit}。${sc.large}和${sc.small}各是多少${sc.unit}？`,
      answerFields: [
        { key: 'large', label: sc.large, unit: sc.unit, correctValue: largeVal },
        { key: 'small', label: sc.small, unit: sc.unit, correctValue: smallVal },
      ],
      hint: `虚线补齐缺少的 ${lack} ${sc.unit}，整倍差就会增大：${givenDiff} + ${lack} = ${effectiveDiff} ${sc.unit}！`,
      commonMistakes: [
        {
          check: (ans) => ans.small === Math.round((givenDiff - lack) / (multiple - 1)),
          feedback: `几倍“少”几时，需要把不足的 ${lack} 补齐，所以差会增加：${givenDiff} + ${lack} = ${effectiveDiff}。`,
        },
      ],
      diagram: {
        smallLabel: sc.small,
        largeLabel: sc.large,
        unit: sc.unit,
        smallValue: smallVal,
        multiple,
        extra: -lack,
        givenDiff,
        effectiveDiff,
        diffNote: `虚线补齐少的 ${lack} ${sc.unit}，整倍差 = ${givenDiff} + ${lack} = ${effectiveDiff} ${sc.unit}`,
      },
      steps: [
        {
          title: '虚线补齐凑足整倍',
          explanation: `给${sc.large}补上缺少的 ${lack} ${sc.unit}，正好达到 ${multiple} 倍。`,
          formula: `整倍差 = ${givenDiff} + ${lack} = ${effectiveDiff}（${sc.unit}）`,
          focusPart: 'adjust',
        },
        {
          title: `求 1 份量（${sc.small}）`,
          explanation: `${effectiveDiff} 对应 ${multiple} - 1 = ${multiple - 1} 份。`,
          formula: `${sc.small} = ${effectiveDiff} ÷ (${multiple} - 1) = ${smallVal}（${sc.unit}）`,
          focusPart: 'base',
        },
        {
          title: `求${sc.large}`,
          explanation: `减去刚才借来补齐的 ${lack} ${sc.unit}（或用 ${smallVal} + ${givenDiff}）。`,
          formula: `${sc.large} = ${smallVal} × ${multiple} - ${lack} = ${largeVal}（${sc.unit}）`,
          focusPart: 'result',
        },
      ],
    };
  }

  if (effectiveMode === 'transfer') {
    const scenarios = [
      { a: '甲班', b: '乙班', item: '图书', unit: '本' },
      { a: '哥哥', b: '弟弟', item: '弹珠', unit: '颗' },
      { a: '左盘', b: '右盘', item: '糖果', unit: '块' },
    ];
    const sc = pickOne(scenarios);
    const multiple = pickOne([3, 5]);
    const halfMultipleDiff = (multiple - 1) / 2;
    const nowSmall = randInt(6, 24);
    const transfer = nowSmall * halfMultipleDiff;
    const origin = nowSmall + transfer;
    const effectiveDiff = transfer * 2;

    return {
      id: uid,
      chapterId: 'transfer',
      code: '随机变式题',
      title: `移多补少：${sc.a}与${sc.b}分${sc.item}`,
      difficulty: 2,
      questionText: `${sc.a}和${sc.b}的${sc.item}原本一样多。如果从${sc.a}拿 ${transfer} ${sc.unit}放到${sc.b}，这时${sc.b}的${sc.item}正好是${sc.a}的 ${multiple} 倍。原来各有多少${sc.unit}？`,
      answerFields: [
        { key: 'origin', label: '原来各有', unit: sc.unit, correctValue: origin },
      ],
      hint: `${sc.a}少 ${transfer}，${sc.b}多 ${transfer}，现在的差是 ${transfer} × 2 = ${effectiveDiff} ${sc.unit}！`,
      commonMistakes: [
        {
          check: (ans) => ans.origin === nowSmall,
          feedback: `${nowSmall} ${sc.unit}是“现在${sc.a}”的数量！还要把拿走的 ${transfer} ${sc.unit}加回来。`,
        },
        {
          check: (ans) => ans.origin === Math.round(transfer / (multiple - 1)) + transfer,
          feedback: `忘记把移动的数量乘 2 啦！一边少 ${transfer}，另一边多 ${transfer}，差是 ${transfer} × 2 = ${effectiveDiff}。`,
        },
      ],
      diagram: {
        smallLabel: `现在${sc.a}`,
        largeLabel: `现在${sc.b}`,
        unit: sc.unit,
        smallValue: nowSmall,
        multiple,
        extra: 0,
        givenDiff: effectiveDiff,
        effectiveDiff,
        diffNote: `一少一多，现差 = ${transfer} × 2 = ${effectiveDiff} ${sc.unit}`,
        offsetNote: `原来各有 = 现在${sc.a} ${nowSmall} + 拿出的 ${transfer} = ${origin} ${sc.unit}`,
      },
      steps: [
        {
          title: '算出移动后的暗差',
          explanation: `原来一样多，从${sc.a}拿 ${transfer} ${sc.unit}给${sc.b}，相差 ${transfer} × 2 = ${effectiveDiff} ${sc.unit}。`,
          formula: `现差 = ${transfer} × 2 = ${effectiveDiff}（${sc.unit}）`,
          focusPart: 'diff',
        },
        {
          title: `求现在较少的${sc.a}`,
          explanation: `${effectiveDiff} 对应 ${multiple} - 1 = ${multiple - 1} 份。`,
          formula: `现在${sc.a} = ${effectiveDiff} ÷ (${multiple} - 1) = ${nowSmall}（${sc.unit}）`,
          focusPart: 'base',
        },
        {
          title: '还原原来各有数量',
          explanation: `把拿走的 ${transfer} ${sc.unit}加回${sc.a}即可。`,
          formula: `原来各有 = ${nowSmall} + ${transfer} = ${origin}（${sc.unit}）`,
          focusPart: 'result',
        },
      ],
    };
  }

  if (effectiveMode === 'digit_zero') {
    const isDrop = randInt(0, 1) === 1;
    const baseNum = randInt(11, 58);
    const diff = baseNum * 9;
    const bigNum = baseNum * 10;

    if (!isDrop) {
      return {
        id: uid,
        chapterId: 'digit_zero',
        code: '随机变式题',
        title: '数字谜差倍：末尾添 0',
        difficulty: 2,
        questionText: `在一个整数的末尾添上一个 0 后，得到的新数比原来的数大 ${diff}。原来的整数是多少？`,
        answerFields: [{ key: 'small', label: '原来的整数', unit: '', correctValue: baseNum }],
        hint: `末尾添上一个 0 变成原数的 10 倍，相差 10 - 1 = 9 份，对应 ${diff}。`,
        commonMistakes: [
          {
            check: (ans) => ans.small === bigNum,
            feedback: `${bigNum} 是添 0 之后的新数，题目问的是原来的整数 ${baseNum} 哦！`,
          },
        ],
        diagram: {
          smallLabel: '原来的数',
          largeLabel: '添0后的新数',
          unit: '',
          smallValue: baseNum,
          multiple: 10,
          extra: 0,
          givenDiff: diff,
          effectiveDiff: diff,
          diffNote: `添 0 变 10 倍，相差 9 份 = ${diff}`,
        },
        steps: [
          {
            title: '翻译添 0 倍数',
            explanation: '末尾添一个 0 扩大到 10 倍，多出 10 - 1 = 9 份。',
            formula: '相差份数 = 10 - 1 = 9（份）',
            focusPart: 'diff',
          },
          {
            title: '求原数（1 份）',
            explanation: `${diff} 对应 9 份。`,
            formula: `原数 = ${diff} ÷ 9 = ${baseNum}`,
            focusPart: 'base',
          },
          {
            title: '验算结果',
            explanation: `${bigNum} - ${baseNum} = ${diff}，准确无误。`,
            formula: `${bigNum} - ${baseNum} = ${diff}`,
            focusPart: 'result',
          },
        ],
      };
    }

    return {
      id: uid,
      chapterId: 'digit_zero',
      code: '随机变式题',
      title: '数字谜差倍：漏写末尾 0',
      difficulty: 2,
      questionText: `小虎把一个末尾有 0 的整数漏写了末尾的 0，结果写出的数比原来的数小了 ${diff}。原来的数是多少？`,
      answerFields: [{ key: 'large', label: '原来的数', unit: '', correctValue: bigNum }],
      hint: `漏写末尾的 0，原数是错误数的 10 倍，先用 ${diff} ÷ 9 求出错误数，再乘 10 还原原数！`,
      commonMistakes: [
        {
          check: (ans) => ans.large === baseNum,
          feedback: `${baseNum} 是漏掉 0 之后写错的数，原来的数还要乘 10：${baseNum} × 10 = ${bigNum}！`,
        },
      ],
      diagram: {
        smallLabel: '漏0的错数',
        largeLabel: '原来的数',
        unit: '',
        smallValue: baseNum,
        multiple: 10,
        extra: 0,
        givenDiff: diff,
        effectiveDiff: diff,
        diffNote: `原数是错数的 10 倍，相差 9 份 = ${diff}`,
      },
      steps: [
        {
          title: '找相差份数',
          explanation: '漏掉末尾 0，原数是错数的 10 倍，相差 10 - 1 = 9 份。',
          formula: '相差份数 = 10 - 1 = 9（份）',
          focusPart: 'diff',
        },
        {
          title: '求漏写 0 的错数',
          explanation: `${diff} ÷ 9 = ${baseNum}。`,
          formula: `错数 = ${diff} ÷ 9 = ${baseNum}`,
          focusPart: 'base',
        },
        {
          title: '还原原来的数',
          explanation: `把漏掉的 0 补回去。`,
          formula: `原来的数 = ${baseNum} × 10 = ${bigNum}`,
          focusPart: 'result',
        },
      ],
    };
  }

  if (effectiveMode === 'single_side') {
    const scenarios = [
      { fixed: '黑兔', changing: '白兔', unit: '只', action: '又买来' },
      { fixed: '科技书', changing: '故事书', unit: '本', action: '又借来' },
      { fixed: '桃树', changing: '苹果树', unit: '棵', action: '又新种了' },
    ];
    const sc = pickOne(scenarios);
    const beforeMult = randInt(2, 4);
    const deltaMult = randInt(2, 3);
    const afterMult = beforeMult + deltaMult;
    const fixedVal = randInt(10, 30);
    const deltaVal = fixedVal * deltaMult;
    const origChanging = fixedVal * beforeMult;
    const afterChanging = fixedVal * afterMult;

    return {
      id: uid,
      chapterId: 'single_side',
      code: '随机变式题',
      title: `单边变化差倍：${sc.changing}与${sc.fixed}`,
      difficulty: 2,
      questionText: `${sc.changing}的数量原来是${sc.fixed}的 ${beforeMult} 倍，${sc.action} ${deltaVal} ${sc.unit}${sc.changing}后（${sc.fixed}不变），现在${sc.changing}是${sc.fixed}的 ${afterMult} 倍。原来${sc.changing}和${sc.fixed}各有多少${sc.unit}？`,
      answerFields: [
        { key: 'large', label: `原来${sc.changing}`, unit: sc.unit, correctValue: origChanging },
        { key: 'small', label: sc.fixed, unit: sc.unit, correctValue: fixedVal },
      ],
      hint: `${sc.fixed}数量始终不变，看作 1 份！${sc.changing}从 ${beforeMult} 份变成 ${afterMult} 份，增加了 ${afterMult} - ${beforeMult} = ${deltaMult} 份，对应 ${deltaVal} ${sc.unit}。`,
      commonMistakes: [
        {
          check: (ans) => ans.large === afterChanging,
          feedback: `${afterChanging} 是变化之后现在的数量，题目问的是“原来”的${sc.changing}：${fixedVal} × ${beforeMult} = ${origChanging}！`,
        },
      ],
      diagram: {
        smallLabel: `${sc.fixed}（不变）`,
        largeLabel: `原来${sc.changing}`,
        unit: sc.unit,
        smallValue: fixedVal,
        multiple: beforeMult,
        extra: 0,
        givenDiff: deltaVal,
        effectiveDiff: deltaVal,
        diffNote: `${sc.fixed}不变，${sc.changing}从 ${beforeMult} 份增到 ${afterMult} 份，多出 ${deltaMult} 份 = ${deltaVal}`,
        compareBar: {
          label: `现在${sc.changing}`,
          multiple: afterMult,
          value: afterChanging,
          mode: 'single_side',
        },
      },
      steps: [
        {
          title: `固定${sc.fixed}为 1 份`,
          explanation: `${sc.changing}从 ${beforeMult} 份增加到 ${afterMult} 份，多出 ${afterMult} - ${beforeMult} = ${deltaMult} 份。`,
          formula: `增加份数 = ${afterMult} - ${beforeMult} = ${deltaMult}（份）`,
          focusPart: 'diff',
        },
        {
          title: `求${sc.fixed}（1 份量）`,
          explanation: `${deltaVal} 对应 ${deltaMult} 份。`,
          formula: `${sc.fixed} = ${deltaVal} ÷ ${deltaMult} = ${fixedVal}（${sc.unit}）`,
          focusPart: 'base',
        },
        {
          title: `求原来${sc.changing}`,
          explanation: `原来${sc.changing}是${sc.fixed}的 ${beforeMult} 倍。`,
          formula: `原来${sc.changing} = ${fixedVal} × ${beforeMult} = ${origChanging}（${sc.unit}）`,
          focusPart: 'result',
        },
      ],
    };
  }

  if (effectiveMode === 'three_quantities') {
    const scenarios = [
      { small: '排球', mid: '足球', large: '篮球', unit: '个' },
      { small: '乙数', mid: '甲数', large: '丙数', unit: '' },
      { small: '红花', mid: '黄花', large: '紫花', unit: '朵' },
    ];
    const sc = pickOne(scenarios);
    const midMult = randInt(2, 3);
    const largeMult = midMult + randInt(2, 3);
    const smallVal = randInt(8, 22);
    const midVal = smallVal * midMult;
    const largeVal = smallVal * largeMult;
    const diff = largeVal - midVal;

    return {
      id: uid,
      chapterId: 'three_quantities',
      code: '随机变式题',
      title: `三量差倍：${sc.small}、${sc.mid}、${sc.large}`,
      difficulty: 2,
      questionText: `${sc.mid}是${sc.small}的 ${midMult} 倍，${sc.large}是${sc.small}的 ${largeMult} 倍，且${sc.large}比${sc.mid}多 ${diff} ${sc.unit}。三者各是多少${sc.unit}？`,
      answerFields: [
        { key: 'small', label: sc.small, unit: sc.unit, correctValue: smallVal },
        { key: 'mid', label: sc.mid, unit: sc.unit, correctValue: midVal },
        { key: 'large', label: sc.large, unit: sc.unit, correctValue: largeVal },
      ],
      hint: `把${sc.small}看作 1 份，${sc.mid}是 ${midMult} 份，${sc.large}是 ${largeMult} 份，${sc.large}比${sc.mid}多 ${largeMult} - ${midMult} = ${largeMult - midMult} 份！`,
      commonMistakes: [
        {
          check: (ans) => ans.small === Math.round(diff / (largeMult - 1)),
          feedback: `${diff} 是${sc.large}和${sc.mid}的差（${largeMult} - ${midMult} = ${largeMult - midMult} 份），不是和${sc.small}的差哦！`,
        },
      ],
      diagram: {
        smallLabel: sc.small,
        largeLabel: sc.mid,
        unit: sc.unit,
        smallValue: smallVal,
        multiple: midMult,
        extra: 0,
        givenDiff: diff,
        effectiveDiff: diff,
        diffNote: `${sc.large}（${largeMult}份）比${sc.mid}（${midMult}份）多 ${largeMult - midMult} 份 = ${diff}`,
        compareBar: {
          label: sc.large,
          multiple: largeMult,
          value: largeVal,
          mode: 'three_way',
        },
      },
      steps: [
        {
          title: `统一成${sc.small}的倍数`,
          explanation: `设${sc.small}为 1 份，${sc.mid}占 ${midMult} 份，${sc.large}占 ${largeMult} 份，相差 ${largeMult - midMult} 份。`,
          formula: `相差份数 = ${largeMult} - ${midMult} = ${largeMult - midMult}（份）`,
          focusPart: 'diff',
        },
        {
          title: `求 1 份量（${sc.small}）`,
          explanation: `${diff} 对应 ${largeMult - midMult} 份。`,
          formula: `${sc.small} = ${diff} ÷ (${largeMult} - ${midMult}) = ${smallVal}${sc.unit ? `（${sc.unit}）` : ''}`,
          focusPart: 'base',
        },
        {
          title: `求${sc.mid}与${sc.large}`,
          explanation: `分别乘以各自倍数。`,
          formula: `${sc.mid} = ${midVal}，${sc.large} = ${largeVal}`,
          focusPart: 'result',
        },
      ],
    };
  }

  // same_change (年龄问题)
  const multiple = pickOne([3, 4]);
  const yearsLater = randInt(2, 8);
  const childThen = randInt(10, 18);
  const childNow = childThen - yearsLater;
  const ageDiff = childThen * (multiple - 1);
  const parentNow = childNow + ageDiff;
  const parentThen = childThen * multiple;

  return {
    id: uid,
    chapterId: 'same_change',
    code: '随机变式题',
    title: '年龄倍数暗差（差不变）',
    difficulty: 2,
    questionText: `今年爸爸 ${parentNow} 岁，乐乐 ${childNow} 岁。多少年后，爸爸的年龄正好是乐乐的 ${multiple} 倍？`,
    answerFields: [
      { key: 'years', label: '经过年数', unit: '年后', correctValue: yearsLater },
    ],
    hint: `爸爸和乐乐的年龄差始终是 ${parentNow} - ${childNow} = ${ageDiff} 岁！先求出那时乐乐的年龄，再减去今年的 ${childNow} 岁。`,
    commonMistakes: [
      {
        check: (ans) => ans.years === childThen,
        feedback: `${childThen} 岁是“那时乐乐的年龄”！题目问的是“多少年后”，用 ${childThen} - ${childNow} = ${yearsLater} 年。`,
      },
    ],
    diagram: {
      smallLabel: '那时乐乐',
      largeLabel: '那时爸爸',
      unit: '岁',
      smallValue: childThen,
      multiple,
      extra: 0,
      givenDiff: ageDiff,
      effectiveDiff: ageDiff,
      diffNote: `年龄差永远不变：${parentNow} - ${childNow} = ${ageDiff} 岁`,
      offsetNote: `乐乐从 ${childNow} 岁长到 ${childThen} 岁，需要 ${yearsLater} 年（那时爸爸 ${parentThen} 岁）`,
    },
    steps: [
      {
        title: '求不变的年龄差',
        explanation: '父子二人每年同时长 1 岁，年龄差永远不会变。',
        formula: `年龄差 = ${parentNow} - ${childNow} = ${ageDiff}（岁）`,
        focusPart: 'diff',
      },
      {
        title: '求变成倍数时乐乐的年龄',
        explanation: `${ageDiff} 岁对应 ${multiple} - 1 = ${multiple - 1} 份。`,
        formula: `那时乐乐 = ${ageDiff} ÷ (${multiple} - 1) = ${childThen}（岁）`,
        focusPart: 'base',
      },
      {
        title: '求经过的年数',
        explanation: `用那时乐乐的 ${childThen} 岁减去今年的 ${childNow} 岁。`,
        formula: `经过年数 = ${childThen} - ${childNow} = ${yearsLater}（年）`,
        focusPart: 'result',
      },
    ],
  };
}
