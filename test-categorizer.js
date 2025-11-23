// Test script for the categorization engine
// Run with: node test-categorizer.js

const {
  categorizePrompt,
  extractPhrases,
  categorizePhrase,
  exportToPromptData
} = require('./categorizer.js');

// Test prompts
const testPrompt1 = "Dynamic fire dancer in mid-spin captured from input photo, twirling fire poi with intense motion blur and glowing trails forming insane recursive fractals and intricate mandala patterns in the air, hyper-psychedelic acid-trip background with mandalas materializing from solid areas, liquid chrome features melting into rainbow fractals, neon plasma dripping from swirling patterns, bioluminescent smoke and embers creating explosive light streaks, infinite recursive designs emerging from the fire's path, warped Salvador Dali proportions on the dancer's body, explosive cyan-magenta-yellow color bursts from the spinning flames, holographic HUD elements floating amid the chaos, ethereal mandalas overlaying the motion trails, high gloss metallic reflections on melting forms, 8k cinematic neon lighting, ultra-detailed, surreal dreamscape";

const testPrompt2 = "kaleidoscopic irises, prismatic refraction";

console.log('='.repeat(80));
console.log('CATEGORIZATION ENGINE TEST');
console.log('='.repeat(80));
console.log();

// Test 1: Extract phrases
console.log('TEST 1: Extract Phrases');
console.log('-'.repeat(80));
const phrases1 = extractPhrases(testPrompt1);
console.log(`Extracted ${phrases1.length} phrases from test prompt 1:`);
phrases1.forEach((phrase, i) => {
  console.log(`  ${i + 1}. ${phrase}`);
});
console.log();

// Test 2: Categorize single phrase
console.log('TEST 2: Categorize Single Phrase');
console.log('-'.repeat(80));
const singlePhraseTest = "spinning fire poi";
const result = categorizePhrase(singlePhraseTest);
console.log(`Phrase: "${singlePhraseTest}"`);
console.log(`Category: ${result.category}`);
console.log(`Confidence: ${result.confidence}`);
console.log();

// Test 3: Full categorization
console.log('TEST 3: Full Categorization of Test Prompt 1');
console.log('-'.repeat(80));
const categorized1 = categorizePrompt(testPrompt1);
console.log(`Total phrases: ${categorized1.totalPhrases}`);
console.log(`Categories found: ${Object.keys(categorized1.categories).length}`);
console.log();

Object.entries(categorized1.categories).forEach(([category, phrases]) => {
  console.log(`\n${category} (${phrases.length} phrases):`);
  phrases.forEach(p => {
    console.log(`  - [${p.confidence.toFixed(1)}] ${p.phrase}`);
  });
});
console.log();

// Test 4: Second prompt
console.log('TEST 4: Full Categorization of Test Prompt 2');
console.log('-'.repeat(80));
const categorized2 = categorizePrompt(testPrompt2);
console.log(`Total phrases: ${categorized2.totalPhrases}`);
console.log(`Categories found: ${Object.keys(categorized2.categories).length}`);
console.log();

Object.entries(categorized2.categories).forEach(([category, phrases]) => {
  console.log(`\n${category} (${phrases.length} phrases):`);
  phrases.forEach(p => {
    console.log(`  - [${p.confidence.toFixed(1)}] ${p.phrase}`);
  });
});
console.log();

// Test 5: Export to prompt data format
console.log('TEST 5: Export to Prompt Data Format');
console.log('-'.repeat(80));
const exported = exportToPromptData(categorized1);
console.log('Exported categories:');
Object.entries(exported).forEach(([category, phrases]) => {
  console.log(`  ${category}: ${phrases.length} phrases`);
});
console.log();

console.log('='.repeat(80));
console.log('ALL TESTS COMPLETED');
console.log('='.repeat(80));
