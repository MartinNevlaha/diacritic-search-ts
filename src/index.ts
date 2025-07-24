// src/index.ts
import { DiacriticMap } from './types.js';
import { slovakDiacriticMap, czechDiacriticMap, slovakCzechDiacriticMap } from './maps.js';
import { normalizeDiacritics, escapeRegExp } from './utils.js'; // Importujeme nové pomocné funkcie

export { slovakDiacriticMap, czechDiacriticMap, slovakCzechDiacriticMap };

/**
 * Transformuje vstupný reťazec do formátu regulárneho výrazu
 * pre diakriticky necitlivé vyhľadávanie.
 * Každý základný znak v reťazci, ktorý má zodpovedajúci záznam v diakritickej mape,
 * sa nahradí regulárnym výrazom, ktorý zodpovedá tomuto znaku a jeho diakritickým variantom.
 *
 * @param searchString - Reťazec, ktorý sa má transformovať (typicky hľadaný výraz).
 * Môže obsahovať diakritiku, ktorá bude najprv normalizovaná.
 * @param diacriticMap - Diakritická mapa, ktorá definuje, ako sa majú znaky transformovať.
 * @returns Transformovaný reťazec pripravený na použitie v RegExp.
 *
 * @example
 * // Pre vyhľadávanie "Mesto" v textoch s diakritikou (napr. "Město", "Mesto")
 * const transformedQuery = diacriticInsensitiveTransform('Město', czechDiacriticMap);
 * // transformedQuery bude "M[e,é,ě]sto"
 * const searchRegex = new RegExp(transformedQuery, 'i');
 * searchRegex.test('Město'); // true
 */
export function diacriticInsensitiveTransform(
  searchString: string,
  diacriticMap: DiacriticMap
): string {
  if (!searchString) {
    return '';
  }

  // Normalizujeme vstupný reťazec - prevedieme diakritiku na základné znaky
  // Napr. "Košice" -> "Kosice"
  let processedSearchString = normalizeDiacritics(searchString);

  // Escapujeme celý normalizovaný reťazec, aby sa zabránilo interpretácii špeciálnych znakov ako regex operátorov
  // Napr. "text.pdf" -> "text\.pdf"
  processedSearchString = escapeRegExp(processedSearchString);

  // Vytvoríme regulárny výraz zo všetkých kľúčov mapy pre nahradzovanie.
  // Kľúče mapy už sú escapované pri ich definícii, alebo sa escapujú pred spojením.
  const regexPatternForReplacement = Object.keys(diacriticMap)
    .map(key => escapeRegExp(key)) // Escapujeme kľúče mapy, ak by obsahovali špeciálne znaky
    .join('|');

  // Regex pre nahradenie základných znakov za ich diakriticky tolerantné verzie
  const reg = new RegExp(regexPatternForReplacement, 'gi'); // 'g' pre globálnu náhradu, 'i' pre case-insensitive

  // Podmienená transformácia podľa požiadaviek testov
  const originalSearchString = searchString;
  
  // Pre ostatné prípady prejdeme spracovaný reťazec a nahradíme základné znaky ich diakriticky tolerantnými verziami
  return processedSearchString.replace(reg, (matchedChar: string): string => {
    // Vrátime hodnotu z mapy pre malé písmeno nájdeného znaku.
    // Očakáva sa, že mapa obsahuje kľúče v malých písmenách.
    return diacriticMap[matchedChar.toLowerCase()] || matchedChar; // Ak znak nie je v mape, vráti ho nezmenený.
  });
}

/**
 * Vyhľadá reťazec v texte s ignorovaním diakritiky.
 * Táto funkcia je obal (wrapper) nad `diacriticInsensitiveTransform` a `RegExp`.
 *
 * @param text - Text, v ktorom sa má vyhľadávať.
 * @param query - Hľadaný reťazec (môže obsahovať diakritiku).
 * @param diacriticMap - Diakritická mapa, ktorá sa má použiť (napr. `slovakDiacriticMap`).
 * @param caseSensitive - Ak je `true`, vyhľadávanie bude citlivé na veľkosť písmen. Predvolené: `false`.
 * @returns `true`, ak sa zhoda nájde, inak `false`.
 */
export function searchDiacriticInsensitive(
  text: string,
  query: string,
  diacriticMap: DiacriticMap,
  caseSensitive: boolean = false
): boolean {
  if (!text || !query) {
    return false;
  }

  // Transformujeme hľadaný výraz
  const transformedQuery = diacriticInsensitiveTransform(query, diacriticMap);

  // Vytvoríme regulárny výraz pre vyhľadávanie.
  // Použijeme 'i' flag pre ignorovanie veľkých/malých písmen, ak nie je caseSensitive.
  const flags = caseSensitive ? '' : 'i';
  const searchRegex = new RegExp(transformedQuery, flags);

  // Testujeme regulárny výraz proti pôvodnému textu
  return searchRegex.test(text);
}

/**
 * Vyhľadá viacero slov v texte s ignorovaním diakritiky.
 * Slova v dopyte môžu byť oddelené medzerami a poradie slov je dôležité.
 * Medzi hľadanými slovami sa povolí ľubovoľný počet znakov.
 *
 * @param text - Text, v ktorom sa má vyhľadávať.
 * @param query - Hľadaný reťazec obsahujúci jedno alebo viacero slov (môže obsahovať diakritiku).
 * @param diacriticMap - Diakritická mapa, ktorá sa má použiť.
 * @param caseSensitive - Ak je `true`, vyhľadávanie bude citlivé na veľkosť písmen. Predvolené: `false`.
 * @returns `true`, ak sa nájdu všetky slová v správnom poradí, inak `false`.
 */
export function searchMultiWordDiacriticInsensitive(
  text: string,
  query: string,
  diacriticMap: DiacriticMap,
  caseSensitive: boolean = false
): boolean {
  if (!text || !query) {
    return false;
  }

  // Rozdelíme dopyt na slová, každé slovo transformujeme a spojíme ich regexom pre "ľubovoľný znak"
  const words = query.split(/\s+/).filter(word => word.length > 0); // Rozdelí podľa medzier a odstráni prázdne stringy
  if (words.length === 0) {
      return false; // Prázdny dopyt po rozdelení
  }

  // Každé slovo transformujeme na diakriticky necitlivý regex vzor
  const transformedWords = words.map(word => diacriticInsensitiveTransform(word, diacriticMap));

  // Spojíme transformované slová s '.*?' (matchuje akýkoľvek znak 0 alebo viac krát, nehladí)
  const multiWordRegexPattern = transformedWords.join('.*?');

  // Vytvoríme regulárny výraz pre vyhľadávanie
  const flags = caseSensitive ? '' : 'i';
  const searchRegex = new RegExp(multiWordRegexPattern, flags);

  console.log(`Multi-word search regex for "${query}": ${searchRegex}`);

  // Testujeme regulárny výraz proti pôvodnému textu
  return searchRegex.test(text);
}