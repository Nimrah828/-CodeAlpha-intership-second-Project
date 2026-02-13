  // Calculator state
        let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let shouldResetScreen = false;
        let soundEnabled = true;
        let scientificMode = false;

        // DOM elements
        const display = document.getElementById('display');
        const history = document.getElementById('history');
        const scientificPanel = document.getElementById('scientificPanel');
        const loading = document.getElementById('loading');

        // Audio context for sound effects
        let audioContext = null;

        function initAudio() {
            if (!audioContext && soundEnabled) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }

        function playSound(frequency = 440, duration = 100) {
            if (!soundEnabled || !audioContext) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        }

        // Initialize particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Update display
        function updateDisplay() {
            display.textContent = currentInput;
            if (display.textContent.length > 12) {
                display.style.fontSize = '1.8em';
            } else {
                display.style.fontSize = '2.5em';
            }
        }

        // Update history
        function updateHistory() {
            if (previousInput && operation) {
                history.textContent = `${previousInput} ${operation}`;
            } else {
                history.textContent = '';
            }
        }

        // Handle number input
        function appendNumber(num) {
            initAudio();
            playSound(300, 50);
            
            if (shouldResetScreen) {
                currentInput = '0';
                shouldResetScreen = false;
            }
            
            if (currentInput === '0') {
                currentInput = num;
            } else {
                currentInput += num;
            }
            
            updateDisplay();
        }

        // Handle decimal point
        function appendDecimal() {
            initAudio();
            playSound(350, 50);
            
            if (shouldResetScreen) {
                currentInput = '0';
                shouldResetScreen = false;
            }
            
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
            
            updateDisplay();
        }

        // Handle operator input
        function appendOperator(op) {
            initAudio();
            playSound(400, 50);
            
            if (operation !== null && !shouldResetScreen) {
                calculate();
            }
            
            previousInput = currentInput;
            operation = op;
            shouldResetScreen = true;
            updateHistory();
        }

        // Handle scientific functions
        function appendFunction(func) {
            initAudio();
            playSound(450, 50);
            
            const value = parseFloat(currentInput);
            let result;
            
            switch(func) {
                case 'sin':
                    result = Math.sin(value * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(value * Math.PI / 180);
                    break;
                case 'tan':
                    result = Math.tan(value * Math.PI / 180);
                    break;
                case 'log':
                    result = Math.log10(value);
                    break;
                case 'ln':
                    result = Math.log(value);
                    break;
                case 'sqrt':
                    result = Math.sqrt(value);
                    break;
            }
            
            currentInput = result.toString();
            updateDisplay();
            shouldResetScreen = true;
        }

        // Calculate result
        function calculate() {
            initAudio();
            playSound(500, 100);
            
            if (operation === null || shouldResetScreen) return;
            
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            let result;
            
            switch(operation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        displayError('Cannot divide by zero');
                        return;
                    }
                    result = prev / current;
                    break;
                case '%':
                    result = prev % current;
                    break;
                case '^':
                    result = Math.pow(prev, current);
                    break;
                default:
                    return;
            }
            
            currentInput = result.toString();
            operation = null;
            shouldResetScreen = true;
            updateDisplay();
            updateHistory();
            
            // Play success sound
            setTimeout(() => playSound(600, 150), 100);
        }

        // Clear all
        function clearAll() {
            initAudio();
            playSound(250, 100);
            
            currentInput = '0';
            previousInput = '';
            operation = null;
            shouldResetScreen = false;
            updateDisplay();
            updateHistory();
            display.classList.remove('error');
        }

        // Delete last digit
        function deleteLast() {
            initAudio();
            playSound(275, 50);
            
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        // Display error
        function displayError(message) {
            display.textContent = message;
            display.classList.add('error');
            currentInput = '0';
            operation = null;
            shouldResetScreen = true;
            playSound(200, 300);
            
            setTimeout(() => {
                display.classList.remove('error');
                updateDisplay();
            }, 2000);
        }

        // Scientific functions
        function factorial() {
            initAudio();
            playSound(475, 50);
            
            const num = parseInt(currentInput);
            if (num < 0 || num > 170) {
                displayError('Invalid input');
                return;
            }
            
            let result = 1;
            for (let i = 2; i <= num; i++) {
                result *= i;
            }
            
            currentInput = result.toString();
            updateDisplay();
            shouldResetScreen = true;
        }

        function reciprocal() {
            initAudio();
            playSound(425, 50);
            
            const num = parseFloat(currentInput);
            if (num === 0) {
                displayError('Cannot divide by zero');
                return;
            }
            
            currentInput = (1 / num).toString();
            updateDisplay();
            shouldResetScreen = true;
        }

        // Toggle scientific mode
        function toggleScientific() {
            scientificMode = !scientificMode;
            scientificPanel.classList.toggle('show');
            playSound(550, 50);
        }

        // Toggle sound
        function toggleSound() {
            soundEnabled = !soundEnabled;
            document.getElementById('soundToggle').textContent = soundEnabled ? '🔊' : '🔇';
            if (soundEnabled) {
                initAudio();
                playSound(600, 100);
            }
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            
            // Numbers
            if (e.key >= '0' && e.key <= '9') {
                appendNumber(e.key);
            }
            // Operators
            else if (e.key === '+') {
                appendOperator('+');
            }
            else if (e.key === '-') {
                appendOperator('-');
            }
            else if (e.key === '*') {
                appendOperator('*');
            }
            else if (e.key === '/') {
                appendOperator('/');
            }
            else if (e.key === '%') {
                appendOperator('%');
            }
            // Decimal
            else if (e.key === '.') {
                appendDecimal();
            }
            // Enter/Equals
            else if (e.key === 'Enter' || e.key === '=') {
                calculate();
            }
            // Escape/Clear
            else if (e.key === 'Escape') {
                clearAll();
            }
            // Backspace/Delete
            else if (e.key === 'Backspace') {
                deleteLast();
            }
            // Scientific functions
            else if (e.key === 's' || e.key === 'S') {
                appendFunction('sin');
            }
            else if (e.key === 'c' || e.key === 'C') {
                appendFunction('cos');
            }
            else if (e.key === 't' || e.key === 'T') {
                appendFunction('tan');
            }
            else if (e.key === 'l' || e.key === 'L') {
                appendFunction('log');
            }
            else if (e.key === 'n' || e.key === 'N') {
                appendFunction('ln');
            }
            else if (e.key === 'r' || e.key === 'R') {
                appendFunction('sqrt');
            }
            else if (e.key === '!') {
                factorial();
            }
            else if (e.key === '^') {
                appendOperator('^');
            }
        });

        // Initialize
        createParticles();
        updateDisplay();

        // Add some initial animation
        setTimeout(() => {
            document.querySelector('.calculator-container').style.animation = 'pulse 2s ease infinite';
        }, 1000);

        // Pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
        `;
        document.head.appendChild(style);
