// AI Video Prompt Builder - Main Application Logic

// Data structure for prompt types and their phrases
const promptData = {
    "Fire Poi": [
        "spinning fire poi",
        "flowing fire trails",
        "circular fire patterns",
        "poi dancer silhouette",
        "ember sparks flying",
        "fire poi choreography",
        "double poi spinning",
        "fire circle motion",
        "glowing fire arcs",
        "night fire performance"
    ],
    "Bigfoot": [
        "bigfoot in misty forest",
        "sasquatch footprints",
        "cryptid in shadows",
        "tall hairy creature",
        "bigfoot walking away",
        "mysterious forest encounter",
        "blurry bigfoot footage",
        "sasquatch among trees",
        "cryptozoology documentary style",
        "bigfoot howling"
    ],
    "Trippy Visuals": [
        "kaleidoscope patterns",
        "psychedelic colors",
        "fractal geometry",
        "morphing shapes",
        "rainbow color trails",
        "liquid light effects",
        "geometric mandala",
        "swirling vortex",
        "neon glow effects",
        "surreal dreamscape",
        "color bleeding",
        "prismatic refraction",
        "infinite tunnel",
        "warping reality"
    ]
};

// State management
let selectedPromptTypes = new Set();
let selectedPhrases = new Set();
let lastCategorizedData = null;

// Initialize the application
function init() {
    renderPromptTypes();
    attachEventListeners();
    attachAnalyzerListeners();
}

// Render prompt types checkboxes
function renderPromptTypes() {
    const container = document.getElementById('promptTypesList');
    container.innerHTML = '';

    Object.keys(promptData).forEach(promptType => {
        const checkId = `type-${promptType.replace(/\s+/g, '-')}`;
        const phraseCount = promptData[promptType].length;

        const checkDiv = document.createElement('div');
        checkDiv.className = 'form-check';
        checkDiv.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${promptType}" id="${checkId}">
            <label class="form-check-label" for="${checkId}">
                ${promptType}
                <span class="badge bg-secondary ms-1">${phraseCount}</span>
            </label>
        `;

        container.appendChild(checkDiv);
    });
}

// Render phrases for selected prompt types
function renderPhrases() {
    const container = document.getElementById('phrasesContainer');

    if (selectedPromptTypes.size === 0) {
        container.innerHTML = '<p class="text-muted">Select one or more Prompt Types to see available phrases</p>';
        return;
    }

    container.innerHTML = '';

    selectedPromptTypes.forEach(promptType => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'phrase-group';

        const heading = document.createElement('h6');
        heading.textContent = promptType;
        groupDiv.appendChild(heading);

        const phrases = promptData[promptType];
        phrases.forEach(phrase => {
            const checkId = `phrase-${phrase.replace(/\s+/g, '-')}`;
            const checkDiv = document.createElement('div');
            checkDiv.className = 'form-check';
            checkDiv.innerHTML = `
                <input class="form-check-input phrase-checkbox"
                       type="checkbox"
                       value="${phrase}"
                       id="${checkId}"
                       ${selectedPhrases.has(phrase) ? 'checked' : ''}>
                <label class="form-check-label" for="${checkId}">
                    ${phrase}
                </label>
            `;
            groupDiv.appendChild(checkDiv);
        });

        container.appendChild(groupDiv);
    });

    attachPhraseListeners();
}

// Update the generated prompt text
function updateGeneratedPrompt() {
    const textarea = document.getElementById('generatedPrompt');
    const copyBtn = document.getElementById('copyBtn');
    const phraseCount = document.getElementById('phraseCount');

    if (selectedPhrases.size === 0) {
        textarea.value = '';
        copyBtn.disabled = true;
        phraseCount.textContent = '0';
        return;
    }

    // Join selected phrases with commas
    const promptText = Array.from(selectedPhrases).join(', ');
    textarea.value = promptText;
    copyBtn.disabled = false;
    phraseCount.textContent = selectedPhrases.size;
}

// Attach event listeners to prompt type checkboxes
function attachEventListeners() {
    const container = document.getElementById('promptTypesList');
    container.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const promptType = e.target.value;

            if (e.target.checked) {
                selectedPromptTypes.add(promptType);
            } else {
                selectedPromptTypes.delete(promptType);
                // Remove all phrases from this type
                promptData[promptType].forEach(phrase => {
                    selectedPhrases.delete(phrase);
                });
            }

            renderPhrases();
            updateGeneratedPrompt();
        }
    });

    // Copy button
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.addEventListener('click', copyToClipboard);
}

// Attach event listeners to phrase checkboxes
function attachPhraseListeners() {
    const phraseCheckboxes = document.querySelectorAll('.phrase-checkbox');
    phraseCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const phrase = e.target.value;

            if (e.target.checked) {
                selectedPhrases.add(phrase);
            } else {
                selectedPhrases.delete(phrase);
            }

            updateGeneratedPrompt();
        });
    });
}

// Copy to clipboard functionality
async function copyToClipboard() {
    const textarea = document.getElementById('generatedPrompt');
    const feedback = document.getElementById('copyFeedback');

    try {
        await navigator.clipboard.writeText(textarea.value);

        // Show feedback
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        textarea.select();
        document.execCommand('copy');

        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000);
    }
}

// Attach event listeners for the analyzer section
function attachAnalyzerListeners() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearAnalyzerBtn = document.getElementById('clearAnalyzerBtn');
    const addToLibraryBtn = document.getElementById('addToLibraryBtn');
    const promptInput = document.getElementById('promptInput');

    analyzeBtn.addEventListener('click', analyzePrompt);
    clearAnalyzerBtn.addEventListener('click', clearAnalyzer);
    addToLibraryBtn.addEventListener('click', addCategoriesToLibrary);

    // Show clear button when there's input
    promptInput.addEventListener('input', () => {
        clearAnalyzerBtn.style.display = promptInput.value.trim() ? 'block' : 'none';
    });
}

// Analyze the prompt and display categorized results
function analyzePrompt() {
    const promptInput = document.getElementById('promptInput');
    const promptText = promptInput.value.trim();

    if (!promptText) {
        alert('Please enter a prompt to analyze');
        return;
    }

    // Use the categorizer to analyze the prompt
    lastCategorizedData = categorizePrompt(promptText);

    // Display the results
    displayCategorizedResults(lastCategorizedData);

    // Show the "Add to Library" button
    document.getElementById('addToLibraryBtn').style.display = 'inline-block';
}

// Display categorized results in the UI
function displayCategorizedResults(data) {
    const container = document.getElementById('categorizedResults');
    container.innerHTML = '';

    if (Object.keys(data.categories).length === 0) {
        container.innerHTML = '<p class="text-muted">No phrases could be categorized. Try a different prompt.</p>';
        return;
    }

    // Create a summary header
    const summary = document.createElement('div');
    summary.className = 'alert alert-info mb-3';
    summary.innerHTML = `
        <strong>Analysis Complete!</strong><br>
        Found <strong>${data.totalPhrases}</strong> phrases across <strong>${Object.keys(data.categories).length}</strong> categories
    `;
    container.appendChild(summary);

    // Display each category
    Object.entries(data.categories).forEach(([category, phrases]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-result mb-3';

        const categoryHeader = document.createElement('h6');
        categoryHeader.className = 'fw-bold text-primary mb-2';
        categoryHeader.innerHTML = `${category} <span class="badge bg-primary">${phrases.length}</span>`;
        categoryDiv.appendChild(categoryHeader);

        const phraseList = document.createElement('ul');
        phraseList.className = 'list-unstyled ms-3';

        phrases.forEach(phraseObj => {
            const li = document.createElement('li');
            li.className = 'mb-1';

            // Show confidence indicator
            const confidenceClass = phraseObj.confidence > 15 ? 'success' :
                                   phraseObj.confidence > 8 ? 'warning' : 'secondary';

            li.innerHTML = `
                <span class="badge bg-${confidenceClass} me-2" style="width: 40px;">
                    ${Math.round(phraseObj.confidence)}
                </span>
                <small>${phraseObj.phrase}</small>
            `;
            phraseList.appendChild(li);
        });

        categoryDiv.appendChild(phraseList);
        container.appendChild(categoryDiv);
    });
}

// Clear the analyzer
function clearAnalyzer() {
    document.getElementById('promptInput').value = '';
    document.getElementById('categorizedResults').innerHTML = '<p class="text-muted text-center mt-5">Paste a prompt and click "Analyze & Categorize" to see results</p>';
    document.getElementById('clearAnalyzerBtn').style.display = 'none';
    document.getElementById('addToLibraryBtn').style.display = 'none';
    lastCategorizedData = null;
}

// Add categorized phrases to the library
function addCategoriesToLibrary() {
    if (!lastCategorizedData) {
        return;
    }

    // Convert to promptData format
    const newCategories = exportToPromptData(lastCategorizedData);

    // Merge with existing promptData
    Object.entries(newCategories).forEach(([category, phrases]) => {
        if (promptData[category]) {
            // Category exists, merge phrases (avoiding duplicates)
            const existingPhrases = new Set(promptData[category]);
            phrases.forEach(phrase => existingPhrases.add(phrase));
            promptData[category] = Array.from(existingPhrases);
        } else {
            // New category, add it
            promptData[category] = phrases;
        }
    });

    // Re-render the prompt types
    renderPromptTypes();

    // Show success message
    const container = document.getElementById('categorizedResults');
    const successMsg = document.createElement('div');
    successMsg.className = 'alert alert-success mt-3';
    successMsg.innerHTML = `
        <strong>Success!</strong> Categories have been added to your library.
        Check the "Prompt Types" section to use them.
    `;
    container.insertBefore(successMsg, container.firstChild);

    // Hide the add button
    document.getElementById('addToLibraryBtn').style.display = 'none';

    // Scroll to the prompt types section
    setTimeout(() => {
        document.getElementById('promptTypesList').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 500);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
