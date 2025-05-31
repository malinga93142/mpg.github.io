class FSAHMMCharacterPredictor {
    constructor() {
        // Define character states
        this.states = {
            'VOWEL': 0,
            'CONSONANT': 1,
            'SPACE': 2,
            'DIGIT': 3,
            'PUNCTUATION': 4,
            'START': 5
        };
        
        this.stateNames = Object.keys(this.states);
        this.numStates = this.stateNames.length;
        
        // Initialize transition matrix
        this.initializeTransitionMatrix();
        
        // Initialize emission probabilities
        this.initializeEmissionProbabilities();
        
        // Character classifications
        this.vowels = new Set('aeiouAEIOU');
        this.consonants = new Set('bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ');
        this.digits = new Set('0123456789');
        this.punctuation = new Set('.,!?;:()[]{}"-\'');
        
        // Current state tracking
        this.currentState = this.states.START;
        this.sequenceHistory = [];
        
        this.setupEventListeners();
        this.initializeVisualization();
    }
    
    initializeTransitionMatrix() {
        // Transition probabilities [from_state][to_state]
        this.transitionMatrix = [
            // VOWEL to: [V, C, S, D, P, START]
            [0.2, 0.5, 0.2, 0.05, 0.05, 0.0],
            // CONSONANT to:
            [0.6, 0.2, 0.15, 0.03, 0.02, 0.0],
            // SPACE to:
            [0.3, 0.5, 0.1, 0.05, 0.05, 0.0],
            // DIGIT to:
            [0.1, 0.1, 0.2, 0.5, 0.1, 0.0],
            // PUNCTUATION to:
            [0.2, 0.3, 0.4, 0.05, 0.05, 0.0],
            // START to:
            [0.3, 0.5, 0.1, 0.05, 0.05, 0.0]
        ];
    }
    
    initializeEmissionProbabilities() {
        // Most likely characters for each state
        this.emissionProbs = {
            [this.states.VOWEL]: {
                'a': 0.25, 'e': 0.25, 'i': 0.15, 'o': 0.15, 'u': 0.15, 'A': 0.05
            },
            [this.states.CONSONANT]: {
                't': 0.12, 'n': 0.10, 's': 0.10, 'r': 0.08, 'l': 0.08, 
                'h': 0.07, 'd': 0.07, 'c': 0.06, 'm': 0.06, 'f': 0.05,
                'p': 0.05, 'g': 0.04, 'w': 0.04, 'y': 0.04, 'b': 0.04
            },
            [this.states.SPACE]: {' ': 1.0},
            [this.states.DIGIT]: {
                '1': 0.15, '2': 0.12, '3': 0.11, '0': 0.11, '5': 0.10,
                '4': 0.09, '9': 0.08, '8': 0.08, '7': 0.08, '6': 0.08
            },
            [this.states.PUNCTUATION]: {
                '.': 0.4, ',': 0.25, '!': 0.1, '?': 0.1, ';': 0.05,
                ':': 0.05, '(': 0.025, ')': 0.025
            }
        };
    }
    
    classifyCharacter(char) {
        if (this.vowels.has(char)) return this.states.VOWEL;
        if (this.consonants.has(char)) return this.states.CONSONANT;
        if (char === ' ') return this.states.SPACE;
        if (this.digits.has(char)) return this.states.DIGIT;
        if (this.punctuation.has(char)) return this.states.PUNCTUATION;
        return this.states.CONSONANT; // default
    }
    
    predictNextCharacter(inputText) {
        if (inputText.length === 0) {
            this.currentState = this.states.START;
        } else {
            const lastChar = inputText[inputText.length - 1];
            this.currentState = this.classifyCharacter(lastChar);
        }
        
        // Get transition probabilities from current state
        const transitionProbs = this.transitionMatrix[this.currentState];
        
        // Calculate emission probabilities for each possible next state
        const predictions = [];
        
        for (let nextState = 0; nextState < this.numStates; nextState++) {
            if (nextState === this.states.START) continue; // Skip START state
            
            const transitionProb = transitionProbs[nextState];
            const emissionProbs = this.emissionProbs[nextState];
            
            for (const [char, emissionProb] of Object.entries(emissionProbs)) {
                const totalProb = transitionProb * emissionProb;
                predictions.push({
                    character: char,
                    probability: totalProb,
                    state: this.stateNames[nextState]
                });
            }
        }
        
        // Sort by probability and return top predictions
        predictions.sort((a, b) => b.probability - a.probability);
        return predictions.slice(0, 8);
    }
    
    setupEventListeners() {
        const textInput = document.getElementById('text-input');
        textInput.addEventListener('input', (e) => {
            this.updatePredictions(e.target.value);
        });
        
        // Initialize with empty input
        this.updatePredictions('');
    }
    
    updatePredictions(inputText) {
        const predictions = this.predictNextCharacter(inputText);
        this.displayPredictions(predictions);
        this.displayCurrentState(inputText);
        this.displayTransitions();
        this.updateVisualization();
        this.displayModelStats(inputText, predictions);
    }
    
    displayPredictions(predictions) {
        const container = document.getElementById('predictions');
        container.innerHTML = '';
        
        predictions.forEach((pred, index) => {
            const predDiv = document.createElement('div');
            predDiv.style.display = 'flex';
            predDiv.style.alignItems = 'center';
            predDiv.style.marginBottom = '8px';
            
            const charDisplay = pred.character === ' ' ? '␣' : pred.character;
            const probability = (pred.probability * 100).toFixed(1);
            
            predDiv.innerHTML = `
                <span style="font-family: monospace; font-size: 18px; margin-right: 15px; 
                           background: #f0f0f0; padding: 5px 10px; border-radius: 3px; min-width: 30px; text-align: center;">
                    ${charDisplay}
                </span>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                        <span>${pred.state}</span>
                        <span><strong>${probability}%</strong></span>
                    </div>
                    <div class="probability-bar">
                        <div class="probability-fill" style="width: ${probability}%"></div>
                    </div>
                </div>
            `;
            
            container.appendChild(predDiv);
        });
    }
    
    displayCurrentState(inputText) {
        const container = document.getElementById('current-state');
        const currentStateName = this.stateNames[this.currentState];
        const lastChar = inputText.length > 0 ? inputText[inputText.length - 1] : 'None';
        const displayChar = lastChar === ' ' ? '␣' : lastChar;
        
        container.innerHTML = `
            <p><strong>Last Character:</strong> <code>${displayChar}</code></p>
            <p><strong>Current State:</strong> <span style="color: #2196F3; font-weight: bold;">${currentStateName}</span></p>
            <p><strong>Sequence Length:</strong> ${inputText.length}</p>
        `;
    }
    
    displayTransitions() {
        const container = document.getElementById('transitions');
        const transitions = this.transitionMatrix[this.currentState];
        
        container.innerHTML = '';
        this.stateNames.forEach((stateName, index) => {
            if (index === this.states.START) return;
            
            const prob = (transitions[index] * 100).toFixed(1);
            const transDiv = document.createElement('div');
            transDiv.style.marginBottom = '5px';
            transDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between;">
                    <span>→ ${stateName}</span>
                    <span>${prob}%</span>
                </div>
                <div class="probability-bar" style="height: 10px;">
                    <div class="probability-fill" style="width: ${prob}%; height: 100%;"></div>
                </div>
            `;
            container.appendChild(transDiv);
        });
    }
    
    initializeVisualization() {
        this.canvas = document.getElementById('state-graph');
        this.ctx = this.canvas.getContext('2d');
        this.updateVisualization();
    }
    
    updateVisualization() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw states as circles
        const statePositions = [
            {x: 150, y: 100}, // VOWEL
            {x: 350, y: 100}, // CONSONANT  
            {x: 550, y: 100}, // SPACE
            {x: 250, y: 250}, // DIGIT
            {x: 450, y: 250}, // PUNCTUATION
            {x: 50, y: 180}   // START
        ];
        
        const stateRadius = 35;
        
        // Draw transitions (simplified)
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        this.transitionMatrix.forEach((transitions, fromState) => {
            transitions.forEach((prob, toState) => {
                if (prob > 0.1 && fromState !== toState) { // Only show significant transitions
                    const from = statePositions[fromState];
                    const to = statePositions[toState];
                    
                    ctx.beginPath();
                    ctx.moveTo(from.x, from.y);
                    ctx.lineTo(to.x, to.y);
                    ctx.stroke();
                    
                    // Draw arrow
                    const angle = Math.atan2(to.y - from.y, to.x - from.x);
                    const arrowLength = 15;
                    ctx.beginPath();
                    ctx.moveTo(to.x - stateRadius * Math.cos(angle), to.y - stateRadius * Math.sin(angle));
                    ctx.lineTo(to.x - stateRadius * Math.cos(angle) - arrowLength * Math.cos(angle - 0.3), 
                              to.y - stateRadius * Math.sin(angle) - arrowLength * Math.sin(angle - 0.3));
                    ctx.lineTo(to.x - stateRadius * Math.cos(angle) - arrowLength * Math.cos(angle + 0.3), 
                              to.y - stateRadius * Math.sin(angle) - arrowLength * Math.sin(angle + 0.3));
                    ctx.closePath();
                    ctx.fillStyle = '#999';
                    ctx.fill();
                }
            });
        });
        
        // Draw states
        statePositions.forEach((pos, index) => {
            // Highlight current state
            if (index === this.currentState) {
                ctx.fillStyle = '#2196F3';
                ctx.strokeStyle = '#1976D2';
                ctx.lineWidth = 3;
            } else {
                ctx.fillStyle = '#f0f0f0';
                ctx.strokeStyle = '#999';
                ctx.lineWidth = 2;
            }
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, stateRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            
            // Draw state label
            ctx.fillStyle = index === this.currentState ? 'white' : 'black';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.stateNames[index], pos.x, pos.y);
        });
    }
    
    displayModelStats(inputText, predictions) {
        const container = document.getElementById('model-stats');
        const entropy = this.calculateEntropy(predictions);
        const confidence = predictions.length > 0 ? predictions[0].probability : 0;
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                <div>
                    <strong>Prediction Entropy:</strong><br>
                    ${entropy.toFixed(3)} bits
                </div>
                <div>
                    <strong>Top Prediction Confidence:</strong><br>
                    ${(confidence * 100).toFixed(1)}%
                </div>
                <div>
                    <strong>States Used:</strong><br>
                    ${this.numStates - 1} active states
                </div>
            </div>
        `;
    }
    
    calculateEntropy(predictions) {
        let entropy = 0;
        const total = predictions.reduce((sum, pred) => sum + pred.probability, 0);
        
        predictions.forEach(pred => {
            if (pred.probability > 0) {
                const p = pred.probability / total;
                entropy -= p * Math.log2(p);
            }
        });
        
        return entropy;
    }
}

// Initialize the predictor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FSAHMMCharacterPredictor();
});