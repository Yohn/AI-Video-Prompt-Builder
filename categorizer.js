// Prompt Categorization Engine
// Automatically parses and categorizes prompt phrases for AI video generation

/**
 * Category definitions with keywords and patterns for classification
 */
const CATEGORY_DEFINITIONS = {
  'Subject & Main Focus': {
    keywords: ['dancer', 'person', 'figure', 'character', 'creature', 'subject', 'portrait', 'face', 'body', 'irises', 'eyes'],
    patterns: [/\w+\s+in\s+/, /captured from/, /\w+\s+performing/],
    weight: 10
  },
  'Action & Movement': {
    keywords: ['spinning', 'twirling', 'dancing', 'moving', 'flowing', 'running', 'jumping', 'walking', 'flying', 'swirling', 'rotating', 'motion'],
    patterns: [/\w+ing\s+(fire|poi|flames)/, /-spin/, /mid-\w+/],
    weight: 9
  },
  'Visual Effects & Modifications': {
    keywords: ['blur', 'glow', 'melting', 'dripping', 'liquid', 'chrome', 'metallic', 'holographic', 'bioluminescent', 'refraction', 'reflection', 'gloss', 'streaks', 'smoke', 'embers'],
    patterns: [/motion blur/, /\w+ melting/, /\w+ dripping/, /HUD elements/],
    weight: 8
  },
  'Patterns & Geometric Elements': {
    keywords: ['fractal', 'fractals', 'mandala', 'mandalas', 'pattern', 'patterns', 'geometric', 'recursive', 'kaleidoscope', 'kaleidoscopic', 'symmetry'],
    patterns: [/recursive \w+/, /\w+ patterns?/, /intricate \w+/],
    weight: 8
  },
  'Colors': {
    keywords: ['cyan', 'magenta', 'yellow', 'rainbow', 'neon', 'color', 'red', 'blue', 'green', 'purple', 'orange', 'prismatic'],
    patterns: [/\w+-\w+-\w+ color/, /color \w+/, /rainbow \w+/],
    weight: 7
  },
  'Lighting': {
    keywords: ['lighting', 'glow', 'glowing', 'light', 'luminescent', 'neon', 'bright', 'dark', 'shadow', 'illuminated', 'cinematic lighting'],
    patterns: [/\d+k.*lighting/, /cinematic.*lighting/, /\w+ light/],
    weight: 7
  },
  'Style & Artistic References': {
    keywords: ['psychedelic', 'surreal', 'dreamscape', 'Salvador Dali', 'proportions', 'warped', 'acid-trip', 'hyper-', 'style', 'artistic'],
    patterns: [/\w+ style/, /Salvador Dali/, /hyper-\w+/],
    weight: 6
  },
  'Background & Environment': {
    keywords: ['background', 'environment', 'scene', 'setting', 'landscape', 'backdrop', 'atmosphere', 'chaos'],
    patterns: [/\w+ background/, /amid the \w+/],
    weight: 5
  },
  'Quality & Technical Specifications': {
    keywords: ['8k', '4k', 'ultra', 'high', 'detailed', 'resolution', 'cinematic', 'professional', 'hd', 'uhd'],
    patterns: [/\d+k/, /ultra-\w+/, /high-\w+/],
    weight: 4
  }
};

/**
 * Extracts individual phrases from a prompt string
 * @param {string} promptText - The full prompt text
 * @returns {Array<string>} Array of extracted phrases
 */
function extractPhrases(promptText) {
  // Split by commas and clean up
  let phrases = promptText.split(',').map(p => p.trim()).filter(p => p.length > 0);

  // Also try to extract phrases that might not be comma-separated
  // Look for descriptive chunks
  const additionalPhrases = [];
  phrases.forEach(phrase => {
    // If a phrase is very long, try to split it further
    if (phrase.length > 100) {
      // Split by conjunctions and prepositions that might separate concepts
      const subPhrases = phrase.split(/\s+(?:with|and|from|amid|in|on|at|forming)\s+/);
      if (subPhrases.length > 1) {
        additionalPhrases.push(...subPhrases.map(p => p.trim()).filter(p => p.length > 5));
      }
    }
  });

  if (additionalPhrases.length > 0) {
    phrases = [...phrases, ...additionalPhrases];
  }

  return phrases;
}

/**
 * Scores a phrase against a category definition
 * @param {string} phrase - The phrase to score
 * @param {Object} categoryDef - The category definition
 * @returns {number} Score (higher = better match)
 */
function scorePhrase(phrase, categoryDef) {
  const lowerPhrase = phrase.toLowerCase();
  let score = 0;

  // Check keywords
  categoryDef.keywords.forEach(keyword => {
    if (lowerPhrase.includes(keyword.toLowerCase())) {
      score += 2;
    }
  });

  // Check patterns
  categoryDef.patterns.forEach(pattern => {
    if (pattern.test(lowerPhrase)) {
      score += 3;
    }
  });

  return score * categoryDef.weight;
}

/**
 * Categorizes a single phrase
 * @param {string} phrase - The phrase to categorize
 * @returns {Object} Object with category and confidence score
 */
function categorizePhrase(phrase) {
  let bestCategory = null;
  let bestScore = 0;

  Object.entries(CATEGORY_DEFINITIONS).forEach(([category, definition]) => {
    const score = scorePhrase(phrase, definition);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });

  // If no category matched well, categorize as "Other"
  if (bestScore < 5) {
    bestCategory = 'Other';
  }

  return {
    phrase,
    category: bestCategory,
    confidence: bestScore
  };
}

/**
 * Categorizes all phrases from a prompt text
 * @param {string} promptText - The full prompt text
 * @returns {Object} Categorized phrases grouped by category
 */
function categorizePrompt(promptText) {
  const phrases = extractPhrases(promptText);
  const categorized = {};
  const results = [];

  // Initialize category buckets
  Object.keys(CATEGORY_DEFINITIONS).forEach(category => {
    categorized[category] = [];
  });
  categorized['Other'] = [];

  // Categorize each phrase
  phrases.forEach(phrase => {
    const result = categorizePhrase(phrase);
    results.push(result);
    categorized[result.category].push({
      phrase: result.phrase,
      confidence: result.confidence
    });
  });

  // Remove empty categories
  Object.keys(categorized).forEach(category => {
    if (categorized[category].length === 0) {
      delete categorized[category];
    }
  });

  return {
    categories: categorized,
    totalPhrases: phrases.length,
    allResults: results
  };
}

/**
 * Exports categorized phrases to the prompt data structure
 * @param {Object} categorizedData - Output from categorizePrompt
 * @returns {Object} Formatted for promptData structure
 */
function exportToPromptData(categorizedData) {
  const exported = {};

  Object.entries(categorizedData.categories).forEach(([category, phrases]) => {
    exported[category] = phrases.map(p => p.phrase);
  });

  return exported;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    categorizePrompt,
    extractPhrases,
    categorizePhrase,
    exportToPromptData,
    CATEGORY_DEFINITIONS
  };
}
