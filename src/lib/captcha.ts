export type MathCaptcha = { a: number; b: number; answer: number };

export const SSR_CAPTCHA: MathCaptcha = { a: 4, b: 7, answer: 11 };

export function createMathCaptcha(): MathCaptcha {
  const a = 2 + Math.floor(Math.random() * 7);
  const b = 2 + Math.floor(Math.random() * 7);
  return { a, b, answer: a + b };
}

/** Survives React Strict Mode remounts so the displayed sum stays solvable. */
export function createSessionCaptcha(slot: { current: MathCaptcha | null }) {
  if (!slot.current) slot.current = createMathCaptcha();
  return slot.current;
}
