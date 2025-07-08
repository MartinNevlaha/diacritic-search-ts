// src/utils.ts

/**
 * Normalizuje reťazec tým, že prevedie diakritické znaky
 * na ich základné (ASCII) ekvivalenty.
 * Používa Unicode Normalization Form Canonical Decomposition (NFD)
 * a následne odstráni kombinujúce diakritické značky.
 *
 * @param text Vstupný reťazec s diakritikou.
 * @returns Reťazec bez diakritiky.
 */
export function normalizeDiacritics(text: string): string {
    // Normalizácia na NFD rozloží diakritické znaky na základný znak + kombinujúcu značku.
    // Napr. 'á' -> 'a' + '\u0301'
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Escapuje všetky špeciálne znaky regulárneho výrazu vo vstupe,
 * aby boli interpretované ako literály a nie ako metaznaky.
 *
 * @param literal String, ktorý sa má escapovať.
 * @returns Escapovaný reťazec.
 */
export function escapeRegExp(literal: string): string {
    return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& znamená celý nájdený zhodný podreťazec
}