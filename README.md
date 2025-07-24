-----

[![NPM Version](https://img.shields.io/npm/v/diacritic-search-ts.svg)](https://www.npmjs.com/package/diacritic-search-ts)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A simple and efficient TypeScript library for **diacritic-insensitive search** in a Node.js environment. Create robust search functionalities that automatically handle Slovak and Czech diacritics, enhancing the user experience.

-----

## Why this Library?

When searching through text data, users commonly enter terms without diacritics (e.g., "mesto" instead of "Město" or "Košice"). This library solves this by transforming the search query into a **regular expression** that matches both the base character and its diacritized variants.

  * **Language Specificity:** Includes predefined maps for **Slovak** and **Czech**, as well as a combined map.
  * **Reliability:** Uses character mapping for precise comparison, which is better than simple blanket diacritic removal.
  * **Flexibility:** Generates standard regular expressions that can be used with any database or text search engine supporting regex.
  * **TypeScript:** Full type support for safer and more maintainable code.

-----

## Installation

```bash
npm install diacritic-search-ts
# or
yarn add diacritic-search-ts
```

-----

## Usage

The library provides a core `diacriticInsensitiveTransform` function to convert a string and a convenience wrapper `searchDiacriticInsensitive` for direct text matching.

### Available Diacritic Maps

You can choose from the following predefined maps:

  * `slovakDiacriticMap`
  * `czechDiacriticMap`
  * `slovakCzechDiacriticMap` (a combined map for broader tolerance)

### Examples

#### 1\. Transforming a Search String

```typescript
import { diacriticInsensitiveTransform, slovakCzechDiacriticMap } from 'diacritic-search-ts';

const originalQuery = "bratislava";
const transformedQuery = diacriticInsensitiveTransform(originalQuery, slovakCzechDiacriticMap);

console.log(`Original query: "${originalQuery}"`); // bratislava
console.log(`Transformed query (Regex pattern): "${transformedQuery}"`); // bratislava (since it has no characters from the map)

const originalQuery2 = "mesto";
const transformedQuery2 = diacriticInsensitiveTransform(originalQuery2, slovakCzechDiacriticMap);
console.log(`Original query: "${originalQuery2}"`); // mesto
// The transformation for 'e' would change 'e' to '[e,é,ě]'
console.log(`Transformed query (Regex pattern): "${transformedQuery2}"`); // m[e,é,ě]sto
```

#### 2\. Direct Text Matching

```typescript
import { searchDiacriticInsensitive, slovakDiacriticMap, czechDiacriticMap } from 'diacritic-search-ts';

const textSK = "Žijeme v Košiciach.";
console.log(`Text: "${textSK}"`);
console.log(`Searching "kosice" (SK map): ${searchDiacriticInsensitive(textSK, "kosice", slovakDiacriticMap)}`); // true
console.log(`Searching "zije" (SK map): ${searchDiacriticInsensitive(textSK, "zije", slovakDiacriticMap)}`);   // true (for "Žijeme")
console.log(`Searching "zilina" (SK map): ${searchDiacriticInsensitive(textSK, "zilina", slovakDiacriticMap)}`); // false

const textCZ = "Jdu do Plzně na oběd.";
console.log(`\nText: "${textCZ}"`);
console.log(`Searching "plzne" (CZ map): ${searchDiacriticInsensitive(textCZ, "plzne", czechDiacriticMap)}`);     // true (for "Plzně")
console.log(`Searching "obed" (CZ map): ${searchDiacriticInsensitive(textCZ, "obed", czechDiacriticMap)}`);       // true (for "oběd")

// Case sensitivity
const textCase = "Hello World!";
console.log(`\nText: "${textCase}"`);
console.log(`Searching "hello" (case-insensitive): ${searchDiacriticInsensitive(textCase, "hello", slovakDiacriticMap, false)}`); // true
console.log(`Searching "hello" (case-sensitive): ${searchDiacriticInsensitive(textCase, "hello", slovakDiacriticMap, true)}`);   // false
```

-----

## Usage with Databases (e.g., MongoDB)

This library is perfect for enhancing search capabilities in databases that support **regular expressions (regex)**. The core idea is that the library **transforms the user's query into a regex pattern**, which you then send to your database for processing.

### Example with MongoDB (using Mongoose)

Suppose you have a Mongoose model with a `name` field:

```typescript
// Your Mongoose model
import mongoose, { Schema, Document } from 'mongoose';

interface IDocument extends Document {
  name: string;
  description: string;
}

const DocumentSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const MyDocument = mongoose.model<IDocument>('MyDocument', DocumentSchema);

// --- Your search code ---
import { diacriticInsensitiveTransform, slovakCzechDiacriticMap } from 'diacritic-search-ts';

async function findItemsDiacriticInsensitive(userQuery: string): Promise<IDocument[]> {
  // 1. Transform the user's query into a regex pattern
  const regexPattern = diacriticInsensitiveTransform(userQuery, slovakCzechDiacriticMap);

  // 2. Create a RegExp instance for MongoDB
  // The 'i' flag ensures case-insensitive search
  const searchRegex = new RegExp(regexPattern, 'i');

  console.log(`Search regex for "${userQuery}": ${searchRegex}`);

  // 3. Execute the query in MongoDB
  // You can use $or to search across multiple fields
  const results = await MyDocument.find({
    $or: [
      { name: searchRegex },
      { description: searchRegex }
    ]
  }).exec();

  return results;
}

// Example usage:
// (Assumes you are connected to MongoDB and have some data)
// findItemsDiacriticInsensitive("kava")
//   .then(docs => console.log("Found documents:", docs.map(d => d.name)))
//   .catch(console.error);

// If your database has "Káva" or "Kávoň", a query for "kava" will find them.
```

-----

## Development

To develop and test the package locally:

1.  **Clone the repository:**
    ```bash
    git clone your-repo-url
    cd diacritic-search-ts
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Compile:**
    ```bash
    npm run build
    ```
    This command will compile TypeScript files from `src/` to `dist/`.
4.  **Run example/tests:**
    ```bash
    npm test
    ```
    This command will execute `example.ts` using `ts-node`.

-----

## License

This project is licensed under the ISC License. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for more details.

-----