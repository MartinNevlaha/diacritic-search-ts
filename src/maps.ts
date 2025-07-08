// src/maps.ts
import { DiacriticMap } from './types.js';

/**
 * Diakritická mapa pre slovenčinu.
 * Mapuje základné znaky na regulárne výrazy zahŕňajúce aj ich diakritické varianty.
 */
export const slovakDiacriticMap: DiacriticMap = {
  a: '[a,á,ä]',
  e: '[e,é]',
  i: '[i,í]',
  o: '[o,ó,ô]',
  u: '[u,ú]',
  y: '[y,ý]',
  l: '[l,ľ,ĺ]',
  r: '[r,ŕ]',
  c: '[c,č]',
  d: '[d,ď]',
  n: '[n,ň]',
  s: '[s,š]',
  t: '[t,ť]',
  z: '[z,ž]',
};

/**
 * Diakritická mapa pre češtinu.
 * Obsahuje znaky špecifické pre češtinu a zdieľané so slovenčinou.
 */
export const czechDiacriticMap: DiacriticMap = {
  a: '[a,á]',
  // FIX: Ensure 'e' is only defined once with all its Czech variants
  e: '[e,é,ě]', // Combined 'e', 'é', and 'ě' for Czech
  i: '[i,í]',
  o: '[o,ó]',
  u: '[u,ú]',
  y: '[y,ý]',
  c: '[c,č]',
  d: '[d,ď]',
  n: '[n,ň]',
  r: '[r,ř]',   // Czech 'ř' included here
  s: '[s,š]',
  t: '[t,ť]',
  z: '[z,ž]',
};

/**
 * Spoločná diakritická mapa pre slovenčinu a češtinu.
 * Spája všetky unikátne diakritické varianty z oboch jazykov.
 *
 * Each character in the combined map should include all relevant diacritics
 * from both languages. For example, 'a' needs 'á' (SK/CZ) and 'ä' (SK).
 * 'e' needs 'é' (SK/CZ) and 'ě' (CZ).
 * 'r' needs 'ŕ' (SK) and 'ř' (CZ).
 */
export const slovakCzechDiacriticMap: DiacriticMap = {
  // Combine all relevant diacritics for each base letter
  a: '[a,á,ä]',
  e: '[e,é,ě]', // Combined for Slovak 'é' and Czech 'ě'
  i: '[i,í]',
  o: '[o,ó,ô]', // Combined for Slovak 'ô'
  u: '[u,ú]',
  y: '[y,ý]',
  l: '[l,ľ,ĺ]', // Slovak specific
  r: '[r,ŕ,ř]', // Combined for Slovak 'ŕ' and Czech 'ř'
  c: '[c,č]',
  d: '[d,ď]',
  n: '[n,ň]',
  s: '[s,š]',
  t: '[t,ť]',
  z: '[z,ž]',
};