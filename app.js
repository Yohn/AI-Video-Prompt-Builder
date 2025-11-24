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

    selectedPromptTypes.forEach((promptType, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'phrase-group mb-3';

        // Create unique ID for this collapse
        const collapseId = `collapse-${promptType.replace(/\s+/g, '-')}`;

        // Create collapsible header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'mb-2';
        headerDiv.innerHTML = `
            <button class="btn btn-sm btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#${collapseId}"
                    aria-expanded="true"
                    aria-controls="${collapseId}">
                <span>${promptType}</span>
                <span class="badge bg-primary">${promptData[promptType].length}</span>
            </button>
        `;
        groupDiv.appendChild(headerDiv);

        // Create collapsible content container
        const collapseDiv = document.createElement('div');
        collapseDiv.className = 'collapse show';
        collapseDiv.id = collapseId;

        // Create horizontal list group for phrases
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group list-group-horizontal-md flex-wrap';

        const phrases = promptData[promptType];
        phrases.forEach(phrase => {
            const checkId = `phrase-${phrase.replace(/\s+/g, '-')}`;
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item p-2';
            listItem.innerHTML = `
                <div class="form-check mb-0">
                    <input class="form-check-input phrase-checkbox"
                           type="checkbox"
                           value="${phrase}"
                           id="${checkId}"
                           ${selectedPhrases.has(phrase) ? 'checked' : ''}>
                    <label class="form-check-label" for="${checkId}">
                        ${phrase}
                    </label>
                </div>
            `;
            listGroup.appendChild(listItem);
        });

        collapseDiv.appendChild(listGroup);
        groupDiv.appendChild(collapseDiv);
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

        phrases.forEach((phraseObj, phraseIndex) => {
            const li = document.createElement('li');
            li.className = 'mb-1 d-flex align-items-center';
            li.dataset.category = category;
            li.dataset.phraseIndex = phraseIndex;

            // Show confidence indicator
            const confidenceClass = phraseObj.confidence > 15 ? 'success' :
                                   phraseObj.confidence > 8 ? 'warning' : 'secondary';

            li.innerHTML = `
                <span class="badge bg-${confidenceClass} me-2" style="width: 40px;">
                    ${Math.round(phraseObj.confidence)}
                </span>
                <small class="phrase-text flex-grow-1" contenteditable="false">${phraseObj.phrase}</small>
                <button class="btn btn-sm btn-outline-primary ms-2 edit-phrase-btn" title="Edit phrase">
                    <small>✏️</small>
                </button>
                <button class="btn btn-sm btn-outline-danger ms-1 remove-phrase-btn" title="Remove phrase">
                    <small>🗑️</small>
                </button>
            `;
            phraseList.appendChild(li);
        });

        categoryDiv.appendChild(phraseList);
        container.appendChild(categoryDiv);
    });

    // Attach event listeners for edit and remove buttons
    attachPhraseEditListeners();
}

// Attach event listeners for phrase editing and removal
function attachPhraseEditListeners() {
    const container = document.getElementById('categorizedResults');

    // Edit button listeners
    container.querySelectorAll('.edit-phrase-btn').forEach(btn => {
        btn.addEventListener('click', handleEditPhrase);
    });

    // Remove button listeners
    container.querySelectorAll('.remove-phrase-btn').forEach(btn => {
        btn.addEventListener('click', handleRemovePhrase);
    });
}

// Handle phrase editing
function handleEditPhrase(e) {
    const btn = e.currentTarget;
    const li = btn.closest('li');
    const phraseText = li.querySelector('.phrase-text');
    const isEditing = phraseText.getAttribute('contenteditable') === 'true';

    if (!isEditing) {
        // Enable editing
        phraseText.setAttribute('contenteditable', 'true');
        phraseText.focus();
        phraseText.style.backgroundColor = '#2a2a2a';
        phraseText.style.padding = '2px 4px';
        phraseText.style.borderRadius = '3px';
        btn.innerHTML = '<small>💾</small>';
        btn.title = 'Save changes';
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-success');

        // Select all text
        const range = document.createRange();
        range.selectNodeContents(phraseText);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        // Save changes
        const newText = phraseText.textContent.trim();
        if (!newText) {
            alert('Phrase cannot be empty');
            return;
        }

        // Update the data
        const category = li.dataset.category;
        const phraseIndex = parseInt(li.dataset.phraseIndex);

        if (lastCategorizedData && lastCategorizedData.categories[category]) {
            lastCategorizedData.categories[category][phraseIndex].phrase = newText;
        }

        // Update UI
        phraseText.setAttribute('contenteditable', 'false');
        phraseText.style.backgroundColor = '';
        phraseText.style.padding = '';
        phraseText.style.borderRadius = '';
        btn.innerHTML = '<small>✏️</small>';
        btn.title = 'Edit phrase';
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-primary');
    }
}

// Handle phrase removal
function handleRemovePhrase(e) {
    const btn = e.currentTarget;
    const li = btn.closest('li');
    const category = li.dataset.category;
    const phraseIndex = parseInt(li.dataset.phraseIndex);
    const phraseText = li.querySelector('.phrase-text').textContent;

    if (!confirm(`Remove "${phraseText}" from ${category}?`)) {
        return;
    }

    // Remove from data
    if (lastCategorizedData && lastCategorizedData.categories[category]) {
        lastCategorizedData.categories[category].splice(phraseIndex, 1);

        // If category is now empty, remove it
        if (lastCategorizedData.categories[category].length === 0) {
            delete lastCategorizedData.categories[category];
        }

        // Update total phrase count
        lastCategorizedData.totalPhrases--;
    }

    // Re-render the results
    displayCategorizedResults(lastCategorizedData);
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
        The modal will close automatically.
    `;
    container.insertBefore(successMsg, container.firstChild);

    // Hide the add button
    document.getElementById('addToLibraryBtn').style.display = 'none';

    // Close the modal after a delay
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('analyzerModal'));
        if (modal) {
            modal.hide();
        }

        // Scroll to the prompt types section after modal is closed
        setTimeout(() => {
            document.getElementById('promptTypesList').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }, 1500);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
