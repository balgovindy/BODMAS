
import { Difficulty } from '../types';

const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

const toSuperscript = (num: number): string => {
  const sups: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return num.toString().split('').map(d => sups[d] || d).join('');
};

export const generateBODMAS = (
  difficulty: Difficulty, 
  useFactorials: boolean = false, 
  useExponents: boolean = false,
  useFractions: boolean = false
): { question: string; answer: number } => {
  const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Small factorials for readability (2! to 5!)
  const getSmallFact = () => {
    const n = getRandom(2, 5); // 2!, 3!, 4!, 5!
    return { text: `${n}!`, val: factorial(n) };
  };

  const getSmallExp = () => {
    const base = getRandom(2, 5);
    const exp = getRandom(2, 3);
    return { text: `${base}${toSuperscript(exp)}`, val: Math.pow(base, exp) };
  };

  const getSmallFrac = () => {
    const denominators = [2, 4, 5, 10];
    const den = denominators[getRandom(0, denominators.length - 1)];
    const num = getRandom(1, den - 1);
    // Return simplified-looking fractions or common ones
    return { text: `${num}/${den}`, val: num / den };
  };

  if (difficulty === Difficulty.EASY) {
    const a = getRandom(5, 20);
    const b = getRandom(5, 20);
    const c = getRandom(1, 10);
    return { question: `${a} + ${b} - ${c}`, answer: a + b - c };
  }

  if (difficulty === Difficulty.MEDIUM) {
    const a = getRandom(2, 10);
    const b = getRandom(2, 10);
    const c = getRandom(1, 20);
    let leftSide = a * b;
    let leftText = `${a} × ${b}`;

    const options = [];
    if (useExponents) options.push('exp');
    if (useFractions) options.push('frac');

    if (options.length > 0 && Math.random() > 0.5) {
      const mode = options[getRandom(0, options.length - 1)];
      if (mode === 'exp') {
        const exp = getSmallExp();
        leftText = exp.text;
        leftSide = exp.val;
      } else {
        const frac = getSmallFrac();
        leftText = frac.text;
        leftSide = frac.val;
      }
    }

    return { question: `${leftText} + ${c}`, answer: leftSide + c };
  }

  if (difficulty === Difficulty.TRICKY) {
    const b = getRandom(2, 6);
    const a = b * getRandom(4, 10); // Ensures clean division result
    const c = getRandom(2, 5);
    const d = getRandom(5, 15);
    
    // Base components
    let valA = a;
    let txtA = `${a}`;
    let valC = c;
    let txtC = `${c}`;
    let valD = d;
    let txtD = `${d}`;

    // Randomly replace operands
    const options = [];
    if (useExponents) options.push('exp');
    if (useFactorials) options.push('fact');
    if (useFractions) options.push('frac');

    if (options.length > 0) {
      const mode = options[getRandom(0, options.length - 1)];
      if (mode === 'exp') {
         const exp = getSmallExp();
         txtC = exp.text;
         valC = exp.val;
      } else if (mode === 'fact') {
         const fact = getSmallFact();
         txtD = fact.text;
         valD = fact.val;
      } else if (mode === 'frac') {
         const frac = getSmallFrac();
         txtC = frac.text;
         valC = frac.val;
      }
    }

    // Question: (a ÷ b) × c + d
    const answer = (valA / b) * valC + valD;
    const question = `${txtA} ÷ ${b} × ${txtC} + ${txtD}`;

    return { question, answer };
  }

  // ULTRA TRICKY: Brackets + Factorials/Exponents/Fractions
  const multiplier = getRandom(2, 6);
  const factor = getRandom(2, 4);
  const inside1 = getRandom(1, 4);
  const inside2 = getRandom(1, 4);
  const dividend = multiplier * factor;
  
  let qInner = `${inside1} + ${inside2}`;
  let innerVal = inside1 + inside2;

  const options = [];
  if (useExponents) options.push('exp');
  if (useFractions) options.push('frac');

  if (options.length > 0 && Math.random() > 0.5) {
    const mode = options[getRandom(0, options.length - 1)];
    if (mode === 'exp') {
      const exp = getSmallExp();
      qInner = `${exp.text} + ${inside2}`;
      innerVal = exp.val + inside2;
    } else {
      const frac = getSmallFrac();
      qInner = `${frac.text} + ${inside2}`;
      innerVal = frac.val + inside2;
    }
  }

  let mainPartVal = (dividend / multiplier) * innerVal;
  let mainPartTxt = `${dividend} ÷ ${multiplier}(${qInner})`;

  if (useFactorials && Math.random() > 0.3) {
    const fact = getSmallFact();
    return { 
      question: `${fact.text} + ${mainPartTxt}`, 
      answer: fact.val + mainPartVal 
    };
  }

  return { question: mainPartTxt, answer: mainPartVal };
};
