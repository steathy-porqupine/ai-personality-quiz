class QuizApp {
  constructor() {
    this.currentStage = 1;
    this.currentQuestion = 0;
    this.answers = { stage1: [], stage2: [], additional: [] };
    this.personalityResults = null;
    this.toolResults = null;
    this.quizData = null;
    this.name = '';
    this.email = '';
    this.demographics = {};
    this.validationFeedback = { stage1: null, stage2: null };
    this.additionalQuestionsShown = 0;
    
    this.init();
  }

  async init() {
    await this.loadQuizData();
    this.bindEvents();
    this.showSection('intro');
  }

  async loadQuizData() {
    try {
      const response = await fetch('/.netlify/functions/quiz-data');
      this.quizData = await response.json();
    } catch (error) {
      console.error('Failed to load quiz data:', error);
      this.showError('Failed to load quiz. Please refresh the page.');
    }
  }

  bindEvents() {
    // Start button
    document.getElementById('start-btn').addEventListener('click', () => this.startQuiz());
    
    // Navigation buttons
    document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
    document.getElementById('stop-submit').addEventListener('click', () => this.stopAndSubmit());
    
    // Validation buttons
    document.getElementById('felt-yes').addEventListener('click', () => this.handleValidation('yes'));
    document.getElementById('felt-kindof').addEventListener('click', () => this.handleValidation('kindof'));
    document.getElementById('felt-no').addEventListener('click', () => this.handleValidation('no'));
    
    // Submit buttons
    document.getElementById('submit-final').addEventListener('click', () => this.submitFinal());
    document.getElementById('send-btn').addEventListener('click', () => this.sendResults());
    
    // Option selection
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('option') || e.target.closest('.option')) {
        const optionElement = e.target.classList.contains('option') ? e.target : e.target.closest('.option');
        this.selectOption(optionElement);
      }
    });
  }

  startQuiz() {
    const nameInput = document.getElementById('name');
    this.name = nameInput.value.trim();
    
    if (!this.name) {
      this.showError('Please enter your name to continue.');
      return;
    }
    
    // Collect demographics
    this.demographics = {
      age: document.getElementById('age').value,
      location: document.getElementById('location').value,
      experience: document.getElementById('experience').value
    };
    
    this.showSection('quiz');
    this.loadQuestion();
  }

  loadQuestion() {
    console.log('Loading question - Stage:', this.currentStage, 'Question:', this.currentQuestion);
    const questions = this.currentStage === 1 ? this.quizData.stage1Questions : this.quizData.stage2Questions;
    console.log('Questions available:', questions ? questions.length : 'null');
    const question = questions[this.currentQuestion];
    
    if (!question) {
      console.log('No question found, ending stage');
      this.endStage();
      return;
    }
    
    // Update progress
    document.getElementById('stage-num').textContent = this.currentStage;
    document.getElementById('q-num').textContent = this.currentQuestion + 1;
    
    // Update question title
    document.getElementById('question-title').textContent = question.question;
    
    // Update options
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option';
      optionElement.dataset.value = option.value;
      optionElement.innerHTML = `
        <div class="option-content">
          <div class="option-letter">${option.value}</div>
          <div class="option-text">${option.text}</div>
        </div>
      `;
      optionsContainer.appendChild(optionElement);
    });
    
    // Update navigation
const nextBtn = document.getElementById('next-btn');
const stopBtn = document.getElementById('stop-submit');

    if (this.currentStage === 1 && this.currentQuestion === questions.length - 1) {
      nextBtn.textContent = 'See Results';
      stopBtn.style.display = 'inline-block';
    } else if (this.currentStage === 2 && this.currentQuestion === questions.length - 1) {
      nextBtn.textContent = 'See Results';
      stopBtn.style.display = 'none';
    } else {
      nextBtn.textContent = 'Next';
      stopBtn.style.display = this.currentStage === 1 ? 'inline-block' : 'none';
    }
    
    // Check if already answered
    const currentAnswers = this.currentStage === 1 ? this.answers.stage1 : this.answers.stage2;
    if (currentAnswers[this.currentQuestion]) {
      const selectedOption = document.querySelector(`[data-value="${currentAnswers[this.currentQuestion]}"]`);
      if (selectedOption) {
        selectedOption.classList.add('selected');
      }
    }
  }

  selectOption(element) {
    const questionIndex = element.dataset.question;
    
    if (questionIndex !== undefined) {
      // This is an additional question
      // Remove previous selection for this specific question
      document.querySelectorAll(`[data-question="${questionIndex}"]`).forEach(opt => opt.classList.remove('selected'));
      
      // Add selection to clicked option
      element.classList.add('selected');
      
      // Store answer
      this.answers.additional[questionIndex] = element.dataset.value;
    } else {
      // This is a regular quiz question
      // Remove previous selection
      document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
      
      // Add selection to clicked option
      element.classList.add('selected');
      
      // Store answer
      const currentAnswers = this.currentStage === 1 ? this.answers.stage1 : this.answers.stage2;
      currentAnswers[this.currentQuestion] = element.dataset.value;
      
      // Enable next button
      const nextBtn = document.getElementById('next-btn');
      if (nextBtn) {
        nextBtn.disabled = false;
      }
    }
  }

  nextQuestion() {
    const questions = this.currentStage === 1 ? this.quizData.stage1Questions : this.quizData.stage2Questions;
    
    // Check if current question is answered
    const currentAnswers = this.currentStage === 1 ? this.answers.stage1 : this.answers.stage2;
    if (!currentAnswers[this.currentQuestion]) {
      this.showError('Please select an answer before continuing.');
      return;
    }
    
    this.currentQuestion++;
    
    if (this.currentQuestion >= questions.length) {
      this.endStage();
    } else {
      this.loadQuestion();
    }
  }

  async endStage() {
    if (this.currentStage === 1) {
      // Show personality results
      await this.calculateAndShowPersonalityResults();
    } else {
      // Show tool results
      await this.calculateAndShowToolResults();
    }
  }

  async calculateAndShowPersonalityResults() {
    try {
      const response = await fetch('/.netlify/functions/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name || 'Anonymous',
          email: this.email || 'temp@example.com',
          stage1Answers: this.answers.stage1,
          stage2Answers: null,
          validationFeedback: this.validationFeedback,
          demographics: this.demographics
        })
      });
      
      const data = await response.json();
      console.log('Calculation response:', data);
      
      if (data.success && data.personalityResults) {
        this.personalityResults = data.personalityResults;
        this.showPersonalityResults();
        this.showSection('confirm');
      } else {
        console.error('Invalid response:', data);
        this.showError('Failed to calculate results. Please try again.');
      }
    } catch (error) {
      console.error('Failed to calculate results:', error);
      this.showError('Failed to calculate results. Please try again.');
    }
  }

  async calculateAndShowToolResults() {
    try {
      const response = await fetch('/.netlify/functions/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          stage1Answers: this.answers.stage1,
          stage2Answers: this.answers.stage2,
          validationFeedback: this.validationFeedback,
          demographics: this.demographics
        })
      });
      
      const data = await response.json();
      this.toolResults = data.toolResults;
      
      this.showToolResults();
      this.showSection('confirm');
    } catch (error) {
      console.error('Failed to calculate results:', error);
      this.showError('Failed to calculate results. Please try again.');
    }
  }

  showPersonalityResults() {
    const title = document.getElementById('result-title');
    title.innerHTML = `
      <h2>🎯 Stage 1 Complete: Your Top AI Companion</h2>
      <div class="results-preview">
        <div class="top-match">
          <h3>${this.personalityResults.top3[0].name}</h3>
          <p class="match-percentage">${this.personalityResults.top3[0].percentage}% Match</p>
          <p class="match-description">${this.personalityResults.top3[0].description}</p>
        </div>
      </div>
      
      <div style="background: #f7fafc; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="color: #667eea; margin-bottom: 0.75rem;">🛠️ Want Tool Recommendations Too?</h3>
        <p style="color: #4a5568; margin-bottom: 0.5rem;">Stage 2 helps us match you with specific AI tools for:</p>
        <ul style="color: #718096; margin-left: 1.5rem; margin-bottom: 0;">
          <li>Video creation & editing</li>
          <li>Image design & graphics</li>
          <li>Audio & voice generation</li>
          <li>Research & writing</li>
          <li>Coding & development</li>
        </ul>
      </div>
      
      <p class="validation-question">Does this match feel right?</p>
    `;
    
    // Update button text for clarity
    document.getElementById('felt-yes').innerHTML = '✅ Yes — Continue to Stage 2';
    document.getElementById('felt-kindof').innerHTML = '🤔 Kind of — Refine Match';
    document.getElementById('felt-no').innerHTML = '❌ No — Restart Quiz';
    
    // Add separator and "End Quiz" button
    const confirmSection = document.getElementById('confirm');
    const confirmActions = confirmSection.querySelector('.confirm-actions');
    
    // Check if end-quiz button already exists
    if (!document.getElementById('end-quiz-separator')) {
      const separator = document.createElement('div');
      separator.id = 'end-quiz-separator';
      separator.style.cssText = 'border-top: 2px solid #e2e8f0; margin: 1.5rem 0; padding-top: 1rem; text-align: center;';
      separator.innerHTML = '<p style="color: #718096; font-size: 0.9rem; margin-bottom: 0.75rem;">Or skip Stage 2:</p>';
      
      const endQuizBtn = document.createElement('button');
      endQuizBtn.id = 'end-quiz-btn';
      endQuizBtn.className = 'primary';
      endQuizBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
      endQuizBtn.innerHTML = '✉️ End Quiz & Email Results';
      endQuizBtn.addEventListener('click', () => this.endQuizAndEmail());
      
      separator.appendChild(endQuizBtn);
      confirmActions.appendChild(separator);
    }
  }

  showToolResults() {
    const title = document.getElementById('result-title');
    title.innerHTML = `
      <h2>🎯 Stage 2 Complete: Your AI Tool Stack</h2>
      <div class="results-preview">
        <div class="top-match">
          <h3>${this.toolResults.top3[0].name}</h3>
          <p class="match-percentage">${this.toolResults.top3[0].percentage}% Match</p>
          <p class="match-description">${this.toolResults.top3[0].description}</p>
        </div>
      </div>
      <p class="validation-question">Do these tool recommendations feel right for you?</p>
    `;
    
    // Update button text for Stage 2 completion
    document.getElementById('felt-yes').innerHTML = '✅ Yes — Get My Results';
    document.getElementById('felt-kindof').innerHTML = '🤔 Kind of — Refine Tools';
    document.getElementById('felt-no').innerHTML = '❌ No — Restart Quiz';
    
    // Remove the "End Quiz" button if it exists (not needed for Stage 2)
    const endQuizSeparator = document.getElementById('end-quiz-separator');
    if (endQuizSeparator) {
      endQuizSeparator.remove();
    }
  }

  handleValidation(response) {
    if (this.currentStage === 1) {
      this.validationFeedback.stage1 = response;
      
      if (response === 'yes') {
        this.moveToStage2();
      } else if (response === 'kindof') {
        this.showMoreQuestions();
      } else {
        // "No" means restart/feedback
        this.showRestartOptions();
      }
    } else {
      this.validationFeedback.stage2 = response;
      
      if (response === 'yes') {
        this.showSubmitForm();
      } else if (response === 'kindof') {
        this.showMoreQuestions();
      } else {
        this.showRestartOptions();
      }
    }
  }

  endQuizAndEmail() {
    // User wants to end after Stage 1 and get results emailed
    this.validationFeedback.stage1 = 'completed';
    this.showSubmitForm();
  }

  moveToStage2() {
    console.log('Moving to stage 2...');
    this.currentStage = 2;
    this.currentQuestion = 0;
    this.showSection('quiz');
    this.loadQuestion();
  }

  showMoreQuestions() {
    this.loadAdditionalQuestions();
    this.showSection('more-questions');
  }

  loadAdditionalQuestions() {
    const container = document.getElementById('additional-questions-container');
    container.innerHTML = '';
    
    // Show 2-3 additional questions
    const questionsToShow = Math.min(3, this.quizData.additionalQuestions.length - this.additionalQuestionsShown);
    
    for (let i = 0; i < questionsToShow; i++) {
      const questionIndex = this.additionalQuestionsShown + i;
      const question = this.quizData.additionalQuestions[questionIndex];
      
      const questionDiv = document.createElement('div');
      questionDiv.className = 'additional-question';
      questionDiv.innerHTML = `
        <div style="background: #edf2f7; padding: 0.75rem 1rem; border-radius: 8px; text-align: center; font-weight: 600; color: #4a5568; margin-bottom: 1.5rem;">
          Refinement Question ${i + 1} of ${questionsToShow}
        </div>
        <h2 style="font-size: 1.5rem; margin-bottom: 2rem; text-align: left; color: #2d3748;">${question.question}</h2>
        <div class="options" style="margin-bottom: 2rem;">
          ${question.options.map(option => `
            <div class="option" data-question="${questionIndex}" data-value="${option.value}">
              <div class="option-content">
                <div class="option-letter">${option.value}</div>
                <div class="option-text">${option.text}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      container.appendChild(questionDiv);
    }
    
    this.additionalQuestionsShown += questionsToShow;
  }

  showRestartOptions() {
    const moreQuestions = document.querySelector('#more-questions');
    moreQuestions.innerHTML = `
      <h2>We'd love your feedback!</h2>
      <p>Help us improve the quiz by telling us what didn't feel right.</p>
      <label for="feedback-text">What would make this better?</label>
      <textarea id="feedback-text" rows="4" placeholder="Your feedback helps us improve..."></textarea>
      <div class="nav">
        <button id="restart-quiz" class="secondary">Start Over</button>
        <button id="submit-feedback" class="primary">Submit Feedback & Continue</button>
      </div>
    `;
    
    // Bind new events
    document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
    document.getElementById('submit-feedback').addEventListener('click', () => this.submitFeedback());
    
    this.showSection('more-questions');
  }

  restartQuiz() {
    this.currentStage = 1;
    this.currentQuestion = 0;
    this.answers = { stage1: [], stage2: [] };
    this.personalityResults = null;
    this.toolResults = null;
    this.validationFeedback = { stage1: null, stage2: null };
    this.showSection('quiz');
    this.loadQuestion();
  }

  submitFeedback() {
    const feedbackText = document.getElementById('feedback-text').value;
    
    if (this.currentStage === 1) {
      this.validationFeedback.stage1 = {
        response: 'no',
        feedback: feedbackText
      };
      this.moveToStage2();
    } else {
      this.validationFeedback.stage2 = {
        response: 'no',
        feedback: feedbackText
      };
      this.showSubmitForm();
    }
  }

  async stopAndSubmit() {
    if (this.currentStage === 1 && this.answers.stage1.length > 0) {
      await this.calculateAndShowPersonalityResults();
      this.showSection('confirm');
    } else {
      this.showSubmitForm();
    }
  }

  async submitFinal() {
    // Collect additional answers
    const additionalAnswers = {};
    Object.keys(this.answers.additional).forEach(key => {
      if (this.answers.additional[key]) {
        additionalAnswers[key] = this.answers.additional[key];
      }
    });
    
    if (this.currentStage === 1) {
      this.validationFeedback.stage1 = {
        response: 'kindof',
        additionalAnswers: additionalAnswers
      };
      this.moveToStage2();
    } else {
      this.validationFeedback.stage2 = {
        response: 'kindof',
        additionalAnswers: additionalAnswers
      };
      this.showSubmitForm();
    }
  }

  showSubmitForm() {
    const submitForm = document.getElementById('submit-form');
    submitForm.innerHTML = `
      <h2>View Your Results</h2>
      <p>Get your complete AI personality and tool recommendations!</p>
      
      <div style="background: #f7fafc; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
        <h3 style="color: #667eea; margin-bottom: 0.75rem;">📧 Want results emailed to you? (Optional)</h3>
        <label for="email">Email Address</label>
        <input id="email" type="email" placeholder="you@example.com (optional)">
        <p class="muted" style="margin-top: 0.5rem;">📧 <em>Tip: Check your spam/junk folder if you don't receive the email within a few minutes.</em></p>
      </div>
      
      <label for="comments">Any final comments (optional)</label>
      <textarea id="comments" rows="3" placeholder="Share your thoughts about the quiz..."></textarea>
      
      <div class="nav" style="flex-direction: column; gap: 0.75rem;">
        <button id="show-results-btn" class="primary" style="max-width: none;">📊 Show My Results</button>
        <button id="send-btn" class="secondary" style="max-width: none;">✉️ Email Results & Finish</button>
      </div>
      <div id="submit-status" class="status"></div>
    `;
    
    // Bind buttons
    document.getElementById('show-results-btn').addEventListener('click', () => this.showResultsInline());
    document.getElementById('send-btn').addEventListener('click', () => this.sendResults());
    
    this.showSection('submit-form');
  }

  showResultsInline() {
    const statusDiv = document.getElementById('submit-status');
    const showBtn = document.getElementById('show-results-btn');
    
    showBtn.disabled = true;
    showBtn.textContent = 'Showing Results...';
    
    // Show complete results on page
    statusDiv.innerHTML = `
      <div class="success" style="margin-top: 2rem;">
        <h3>🎉 Your Complete Results</h3>
        <p>Here's your personalized AI companion and tool recommendations!</p>
      </div>
    `;
    
    this.showCompleteResults(this.personalityResults, this.toolResults);
    
    // Update button
    showBtn.textContent = '✓ Results Shown';
    showBtn.style.backgroundColor = '#48bb78';
    
    // Scroll to results
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async sendResults() {
    const emailInput = document.getElementById('email');
    const commentsInput = document.getElementById('comments');
    
    this.email = emailInput.value.trim();
    
    if (!this.email) {
      this.showError('Please enter your email address to send results.');
      return;
    }
    
    const submitBtn = document.getElementById('send-btn');
    const statusDiv = document.getElementById('submit-status');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusDiv.innerHTML = '<div class="loading">Sending your results...</div>';
    
    try {
      const response = await fetch('/.netlify/functions/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          stage1Answers: this.answers.stage1,
          stage2Answers: this.answers.stage2.length > 0 ? this.answers.stage2 : null,
          validationFeedback: {
            ...this.validationFeedback,
            comments: commentsInput.value.trim()
          },
          demographics: this.demographics
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        submitBtn.textContent = 'Sent! ✓';
        submitBtn.style.backgroundColor = '#4CAF50';
        
        statusDiv.innerHTML = `
          <div class="success">
            <h3>✅ Results sent successfully!</h3>
            <p>Check your email for your personalized AI companion and tool recommendations.</p>
            <p><strong>📧 Pro tip:</strong> If you don't see the email in your inbox, please check your spam/junk folder.</p>
            <p>Thank you for taking the quiz!</p>
          </div>
        `;
        
        // Show complete results on page
        this.showCompleteResults(data.personalityResults, data.toolResults);
      } else {
        throw new Error(data.error || 'Failed to send results');
      }
    } catch (error) {
      console.error('Error sending results:', error);
      statusDiv.innerHTML = `
        <div class="error">
          <h3>❌ Failed to send results</h3>
          <p>Please try again or contact support if the problem persists.</p>
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Results & Finish';
    }
  }

  showCompleteResults(personalityResults, toolResults) {
    const resultsHTML = `
      <div class="complete-results">
        <h2 style="text-align: center; margin-bottom: 1.5rem;">🎯 Your AI Match Dashboard</h2>
        
        <div style="text-align: center; margin-bottom: 2rem;">
          <button onclick="window.print()" class="secondary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
            🖨️ Print Results
          </button>
        </div>
        
        <div class="results-section">
          <h3>🤖 Top 3 AI Companions</h3>
          ${personalityResults.top3.map((companion, index) => `
            <div class="result-item">
              <h4>${index + 1}. ${companion.name} – ${companion.percentage}% Match</h4>
              <p class="traits"><strong>Traits:</strong> ${companion.traits.join(', ')}</p>
              <p class="description">${companion.description}</p>
              <p class="suggested-uses"><strong>Best for:</strong> ${companion.suggestedUses.join(', ')}</p>
            </div>
          `).join('')}
          
          <div class="wildcard">
            <h4>🎲 Wildcard Pick: ${personalityResults.wildcard.name}</h4>
            <p class="description">${personalityResults.wildcard.description}</p>
          </div>
        </div>
        
        ${toolResults ? `
          <div class="results-section">
            <h3>🛠️ Your Personalized AI Tool Stack</h3>
            ${toolResults.top3.map((tool, index) => `
              <div class="result-item">
                <h4>${index + 1}. ${tool.name} – ${tool.percentage}% Match</h4>
                <p class="category"><strong>Category:</strong> ${tool.category}</p>
                <p class="description">${tool.description}</p>
              </div>
            `).join('')}
            
            <div class="wildcard">
              <h4>🎲 Wildcard Pick: ${toolResults.wildcard.name}</h4>
              <p class="description">${toolResults.wildcard.description}</p>
            </div>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 2rem; padding: 1.5rem; background: #f7fafc; border-radius: 12px;">
          <p style="color: #4a5568; margin-bottom: 0.5rem;">💡 <strong>Pro Tip:</strong></p>
          <p style="color: #718096; font-size: 0.95rem;">Save these results by taking a screenshot or using the print button above!</p>
        </div>
      </div>
    `;
    
    document.getElementById('submit-status').innerHTML += resultsHTML;
  }

  showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
      section.classList.add('hidden');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.remove('hidden');
  }

  showError(message) {
    // Create or update error display
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = 'error-message';
      errorDiv.className = 'error-message';
      document.querySelector('main').insertBefore(errorDiv, document.querySelector('main').firstChild);
    }
    
    errorDiv.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-text">${message}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv && errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new QuizApp();
});