// example.ts
import {
  diacriticInsensitiveTransform,
  searchDiacriticInsensitive,
  searchMultiWordDiacriticInsensitive, // Importujeme novú funkciu
  slovakDiacriticMap,
  czechDiacriticMap,
  slovakCzechDiacriticMap
} from './index.js';

async function runExample() {
  console.log("--- Diacritic Insensitive Search Example (Vylepšené) ---");

  // --- Príklad 1: Normalizácia vstupu a vylepšené escapovanie ---
  console.log("\n### Normalizácia vstupu a escapovanie ###");
  const queryWithDiacritic = "Košice";
  const transformedQueryDiacritic = diacriticInsensitiveTransform(queryWithDiacritic, slovakDiacriticMap);
  console.log(`Query s diakritikou "${queryWithDiacritic}" -> Transformed: "${transformedQueryDiacritic}"`); // Očakávané: K[o,ó,ô]šice

  const queryWithSpecialChars = "file.txt";
  const transformedQuerySpecial = diacriticInsensitiveTransform(queryWithSpecialChars, slovakDiacriticMap);
  console.log(`Query so špeciálnymi znakmi "${queryWithSpecialChars}" -> Transformed: "${transformedQuerySpecial}"`); // Očakávané: file\.txt

  const queryWithSpecialAndDiacritic = "Město.txt";
  const transformedQueryMixed = diacriticInsensitiveTransform(queryWithSpecialAndDiacritic, slovakCzechDiacriticMap);
  console.log(`Query mix "${queryWithSpecialAndDiacritic}" -> Transformed: "${transformedQueryMixed}"`); // Očakávané: M[e,é,ě]sto\.txt


  // --- Príklad 2: Slovenská diakritika ---
  console.log("\n### Slovenská diakritika ###");
  const slovakText = "Chcem ísť do Bratislavy, do Múzea.";
  const slovakQuery1 = "bratislava";
  const slovakQuery2 = "ist";
  const slovakQuery3 = "muzeum"; // Hľadá "Múzea"

  console.log(`Text: "${slovakText}"`);
  console.log(`Vyhľadávam "${slovakQuery1}" (SK): ${searchDiacriticInsensitive(slovakText, slovakQuery1, slovakDiacriticMap)}`); // true
  console.log(`Vyhľadávam "${slovakQuery2}" (SK): ${searchDiacriticInsensitive(slovakText, slovakQuery2, slovakDiacriticMap)}`);     // true (pre "ísť")
  console.log(`Vyhľadávam "${slovakQuery3}" (SK): ${searchDiacriticInsensitive(slovakText, slovakQuery3, slovakDiacriticMap)}`);     // true (pre "Múzea")

  // --- Príklad 3: Česká diakritika ---
  console.log("\n### Česká diakritika ###");
  const czechText = "Potřebuji zajít do Plzně na oběd, v Přerově.";
  const czechQuery1 = "potrebuji";
  const czechQuery2 = "plzne";
  const czechQuery3 = "obed";
  const czechQuery4 = "prerov"; // Hľadá "Přerově"

  console.log(`Text: "${czechText}"`);
  console.log(`Vyhľadávam "${czechQuery1}" (CZ): ${searchDiacriticInsensitive(czechText, czechQuery1, czechDiacriticMap)}`); // true (pre "Potřebuji")
  console.log(`Vyhľadávam "${czechQuery2}" (CZ): ${searchDiacriticInsensitive(czechText, czechQuery2, czechDiacriticMap)}`);     // true (pre "Plzně")
  console.log(`Vyhľadávam "${czechQuery3}" (CZ): ${searchDiacriticInsensitive(czechText, czechQuery3, czechDiacriticMap)}`);     // true (pre "oběd")
  console.log(`Vyhľadávam "${czechQuery4}" (CZ): ${searchDiacriticInsensitive(czechText, czechQuery4, czechDiacriticMap)}`);     // true (pre "Přerově")

  // --- Príklad 4: Vyhľadávanie Viacerých Slov ---
  console.log("\n### Vyhľadávanie Viacerých Slov ###");
  const multiWordText = "Chcem navštíviť hlavné mesto Slovenska, Bratislavu.";
  const multiWordQuery1 = "hlavne mesto slovenska";
  const multiWordQuery2 = "Navštívit Bratislavu"; // Test s diakritikou v dopyte
  const multiWordQuery3 = "mesto slovenska"; // Zhoduje sa
  const multiWordQuery4 = "mesto slovensko"; // Nezhoduje sa presne (kvoli 'a' na konci)
  const multiWordQuery5 = "slovenska hlavne"; // Zlé poradie

  console.log(`Text: "${multiWordText}"`);
  console.log(`Vyhľadávam "${multiWordQuery1}" (SKCZ): ${searchMultiWordDiacriticInsensitive(multiWordText, multiWordQuery1, slovakCzechDiacriticMap)}`); // true
  console.log(`Vyhľadávam "${multiWordQuery2}" (SKCZ): ${searchMultiWordDiacriticInsensitive(multiWordText, multiWordQuery2, slovakCzechDiacriticMap)}`); // true
  console.log(`Vyhľadávam "${multiWordQuery3}" (SKCZ): ${searchMultiWordDiacriticInsensitive(multiWordText, multiWordQuery3, slovakCzechDiacriticMap)}`); // true
  console.log(`Vyhľadávam "${multiWordQuery4}" (SKCZ): ${searchMultiWordDiacriticInsensitive(multiWordText, multiWordQuery4, slovakCzechDiacriticMap)}`); // false (lebo "slovensko" != "Slovenska")
  console.log(`Vyhľadávam "${multiWordQuery5}" (SKCZ): ${searchMultiWordDiacriticInsensitive(multiWordText, multiWordQuery5, slovakCzechDiacriticMap)}`); // false (zlé poradie)

  const sentenceCZ = "Potřebuji zajít do Plzně.";
  console.log(`\nText: "${sentenceCZ}"`);
  console.log(`Vyhľadávam "zajit plzne" (CZ): ${searchMultiWordDiacriticInsensitive(sentenceCZ, "zajit plzne", czechDiacriticMap)}`); // true
}

runExample().catch(console.error);