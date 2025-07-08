// src/types.ts

/**
 * Rozhranie pre diakritickú mapu.
 * Kľúčom je základný znak bez diakritiky (napr. 'a'),
 * hodnotou je reťazec regulárneho výrazu, ktorý zodpovedá tomuto znaku
 * a jeho diakritickým variantom (napr. '[a,á,ä]').
 */
export interface DiacriticMap {
  [key: string]: string;
}