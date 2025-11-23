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

// Initialize the application
function init() {
    renderPromptTypes();
    attachEventListeners();
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
