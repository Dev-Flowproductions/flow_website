import type { L3, SlugSelectBlock } from './types';

export function l(pt: string, en: string, fr: string): L3 {
  return { pt, en, fr };
}

/** Five options — enforces length at compile time via tuple */
export function sb(label: L3, options: readonly [L3, L3, L3, L3, L3]): SlugSelectBlock {
  return { label, options: [...options] };
}
