const { Pool } = require('pg');

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// AI Companion definitions
const aiCompanions = {
  'Claude': {
    name: 'Claude',
    traits: ['Analytical', 'Thorough', 'Detail-oriented'],
    description: 'Perfect for complex analysis, research, and detailed problem-solving',
    suggestedUses: ['Academic research', 'Technical writing', 'Data analysis', 'Code review']
  },
  'ChatGPT': {
    name: 'ChatGPT',
    traits: ['Creative', 'Conversational', 'Versatile'],
    description: 'Great for brainstorming, creative projects, and general conversation',
    suggestedUses: ['Creative writing', 'Brainstorming', 'General questions', 'Content creation']
  },
  'DeepSeek AI': {
    name: 'DeepSeek AI',
    traits: ['Organized', 'Systematic', 'Efficient'],
    description: 'Excellent for project management and structured problem-solving',
    suggestedUses: ['Project planning', 'Task management', 'Systematic analysis', 'Process optimization']
  },
  'Perplexity': {
    name: 'Perplexity',
    traits: ['Research-focused', 'Factual', 'Well-sourced'],
    description: 'Ideal for research and getting accurate, cited information',
    suggestedUses: ['Research papers', 'Fact-checking', 'News analysis', 'Academic writing']
  },
  'Pi AI': {
    name: 'Pi AI',
    traits: ['Empathetic', 'Supportive', 'Conversational'],
    description: 'Best for emotional support and meaningful conversations',
    suggestedUses: ['Personal support', 'Life coaching', 'Therapeutic conversations', 'Mentoring']
  },
  'Copilot': {
    name: 'Copilot',
    traits: ['Efficient', 'Productive', 'Task-focused'],
    description: 'Perfect for coding and productivity tasks',
    suggestedUses: ['Software development', 'Code generation', 'Productivity automation', 'Quick solutions']
  },
  'Mistral': {
    name: 'Mistral',
    traits: ['Technical', 'Precise', 'Open-source focused'],
    description: 'Great for technical projects and open-source development',
    suggestedUses: ['Technical documentation', 'Open-source projects', 'System administration', 'DevOps']
  },
  'Hugging Face': {
    name: 'Hugging Face',
    traits: ['Experimental', 'Innovative', 'Community-driven'],
    description: 'Ideal for AI experimentation and community collaboration',
    suggestedUses: ['AI model experimentation', 'Machine learning projects', 'Community collaboration', 'Research prototyping']
  },
  'Gemini': {
    name: 'Gemini',
    traits: ['Multimodal', 'Balanced', 'Versatile'],
    description: 'Good for mixed-media projects and balanced approaches',
    suggestedUses: ['Multimedia projects', 'Balanced analysis', 'Cross-platform development', 'General assistance']
  },
  'GPT-4.5': {
    name: 'GPT-4.5',
    traits: ['Advanced', 'Creative', 'Comprehensive'],
    description: 'Most advanced for complex creative and analytical tasks',
    suggestedUses: ['Complex creative projects', 'Advanced analysis', 'Multi-step problem solving', 'Professional applications']
  },
  'Llama': {
    name: 'Llama',
    traits: ['Open-source', 'Flexible', 'Community-oriented'],
    description: 'Best for open-source projects and flexible applications',
    suggestedUses: ['Open-source development', 'Custom applications', 'Community projects', 'Flexible solutions']
  },
  'Phi-3': {
    name: 'Phi-3',
    traits: ['Lightweight', 'Efficient', 'Mobile-friendly'],
    description: 'Perfect for mobile and resource-constrained environments',
    suggestedUses: ['Mobile applications', 'Edge computing', 'Lightweight solutions', 'Quick implementations']
  },
  'Phi-4': {
    name: 'Phi-4',
    traits: ['Optimized', 'Fast', 'Efficient'],
    description: 'Great for high-performance and optimized solutions',
    suggestedUses: ['High-performance applications', 'Optimized solutions', 'Fast implementations', 'Efficiency-focused projects']
  },
  'Grok 3': {
    name: 'Grok 3',
    traits: ['Unconventional', 'Direct', 'Independent'],
    description: 'Perfect for unconventional approaches and independent thinking',
    suggestedUses: ['Unconventional solutions', 'Independent projects', 'Direct approaches', 'Alternative perspectives']
  },
  'AlphaFold': {
    name: 'AlphaFold',
    traits: ['Scientific', 'Precise', 'Research-focused'],
    description: 'Ideal for scientific research and precise analysis',
    suggestedUses: ['Scientific research', 'Precise analysis', 'Laboratory work', 'Research methodology']
  }
};

// Tool definitions
const tools = {
  'video': {
    'cinematic': { name: 'Runway ML', description: 'AI-powered cinematic video generation', category: 'Video Creation' },
    'social': { name: 'CapCut', description: 'Quick social media video editing', category: 'Video Creation' },
    'business': { name: 'Synthesia', description: 'AI avatar business videos', category: 'Video Creation' },
    'editing': { name: 'Descript', description: 'Simple video editing with AI', category: 'Video Creation' }
  },
  'image': {
    'professional': { name: 'Canva AI', description: 'Professional graphic design', category: 'Image & Design' },
    'art': { name: 'Midjourney', description: 'Amazing AI art generation', category: 'Image & Design' },
    'editing': { name: 'Remove.bg', description: 'Photo editing and background removal', category: 'Image & Design' },
    'text': { name: 'Adobe Express', description: 'Graphics with perfect text integration', category: 'Image & Design' }
  },
  'audio': {
    'voices': { name: 'ElevenLabs', description: 'Realistic voice generation and cloning', category: 'Audio & Voice' },
    'cleaning': { name: 'Audacity AI', description: 'Audio cleaning and enhancement', category: 'Audio & Voice' },
    'music': { name: 'AIVA', description: 'AI music composition', category: 'Audio & Voice' }
  },
  'research': {
    'facts': { name: 'Perplexity Pro', description: 'Cited research and fact-checking', category: 'Research & Writing' },
    'writing': { name: 'Grammarly AI', description: 'Writing assistance and brainstorming', category: 'Research & Writing' },
    'analysis': { name: 'Claude Pro', description: 'Academic analysis and long documents', category: 'Research & Writing' }
  },
  'coding': {
    'building': { name: 'GitHub Copilot', description: 'Full-stack app development', category: 'Coding & Tech' },
    'debugging': { name: 'Tabnine', description: 'Code debugging and quick fixes', category: 'Coding & Tech' },
    'opensource': { name: 'Replit AI', description: 'Open-source experimentation', category: 'Coding & Tech' }
  }
};

// Calculate personality scores
function calculatePersonalityScores(answers) {
  const scores = {};
  
  // Initialize all companions
  Object.keys(aiCompanions).forEach(companion => {
    scores[companion] = 0;
  });

  // Score each answer (only for the first 5 questions)
  answers.forEach((answer, questionIndex) => {
    if (questionIndex < 5) { // Only process first 5 questions
      const questionKey = `question${questionIndex + 1}`;
      const scoring = getScoringForAnswer(questionKey, answer);
      
      Object.entries(scoring).forEach(([companion, points]) => {
        if (scores[companion] !== undefined) {
          scores[companion] += points;
        }
      });
    }
  });

  // Sort by score and get top 3 + wildcard
  const sorted = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .filter(([_, score]) => score > 0);

  const top3 = sorted.slice(0, 3);
  const wildcard = sorted[3] || sorted[0]; // Use 4th or fallback to 1st

  const maxScore = top3[0] ? top3[0][1] : 1;

  return {
    top3: top3.map(([name, score]) => ({
      name,
      score,
      percentage: Math.round((score / maxScore) * 100),
      ...aiCompanions[name]
    })),
    wildcard: {
      name: wildcard[0],
      score: wildcard[1],
      ...aiCompanions[wildcard[0]]
    }
  };
}

// Get scoring for specific answer
function getScoringForAnswer(questionKey, answer) {
  const scoring = {
    question1: {
      'A': { 'Claude': 3, 'DeepSeek AI': 3, 'Mistral': 2 },
      'B': { 'ChatGPT': 3, 'Pi AI': 3, 'GPT-4.5': 2 },
      'C': { 'Perplexity': 3, 'Gemini': 2, 'Claude': 2 },
      'D': { 'Hugging Face': 3, 'Phi-3': 2, 'Mistral': 1 },
      'E': { 'Copilot': 3, 'Phi-4': 2, 'Gemini': 1 }
    },
    question2: {
      'A': { 'DeepSeek AI': 3, 'Gemini': 3, 'Claude': 2 },
      'B': { 'ChatGPT': 3, 'GPT-4.5': 3, 'Llama': 2 },
      'C': { 'Perplexity': 3, 'Claude': 2, 'Gemini': 1 },
      'D': { 'Pi AI': 3, 'GPT-4.5': 2 },
      'E': { 'Copilot': 3, 'Mistral': 2, 'Hugging Face': 1 }
    },
    question3: {
      'A': { 'Claude': 3, 'Perplexity': 3, 'DeepSeek AI': 2 },
      'B': { 'ChatGPT': 3, 'GPT-4.5': 3, 'Llama': 2 },
      'C': { 'Mistral': 3, 'Hugging Face': 3, 'Phi-3': 2 },
      'D': { 'Pi AI': 3, 'ChatGPT': 2 },
      'E': { 'Copilot': 3, 'Gemini': 2, 'Grok 3': 2 }
    },
    question4: {
      'A': { 'Copilot': 3, 'Phi-4': 2, 'DeepSeek AI': 1 },
      'B': { 'Perplexity': 3, 'Claude': 3, 'Gemini': 2 },
      'C': { 'ChatGPT': 3, 'GPT-4.5': 3, 'Llama': 2 },
      'D': { 'Pi AI': 3, 'GPT-4.5': 2 },
      'E': { 'Grok 3': 3, 'Hugging Face': 2 }
    },
    question5: {
      'A': { 'Claude': 3, 'DeepSeek AI': 3, 'Gemini': 2 },
      'B': { 'Pi AI': 3, 'GPT-4.5': 3, 'ChatGPT': 2 },
      'C': { 'Copilot': 3, 'Gemini': 3, 'Grok 3': 2 },
      'D': { 'Llama': 3, 'ChatGPT': 2, 'GPT-4.5': 2 },
      'E': { 'AlphaFold': 3, 'Mistral': 3, 'Grok 3': 2 }
    },
    // Additional questions for validation feedback
    question6: {
      'A': { 'Claude': 3, 'DeepSeek AI': 2, 'Mistral': 2 },
      'B': { 'ChatGPT': 3, 'Pi AI': 3, 'GPT-4.5': 2 },
      'C': { 'DeepSeek AI': 3, 'Gemini': 2, 'Claude': 1 },
      'D': { 'Hugging Face': 3, 'Llama': 2, 'Phi-3': 2 },
      'E': { 'Copilot': 3, 'Phi-4': 2, 'Gemini': 1 }
    },
    question7: {
      'A': { 'Claude': 3, 'Perplexity': 2, 'DeepSeek AI': 2 },
      'B': { 'Pi AI': 3, 'ChatGPT': 2, 'GPT-4.5': 2 },
      'C': { 'DeepSeek AI': 3, 'Gemini': 2, 'Claude': 1 },
      'D': { 'Hugging Face': 3, 'Llama': 2, 'ChatGPT': 1 },
      'E': { 'Copilot': 3, 'Gemini': 2, 'Phi-4': 1 }
    },
    question8: {
      'A': { 'Claude': 3, 'DeepSeek AI': 3, 'Mistral': 1 },
      'B': { 'Pi AI': 3, 'ChatGPT': 2, 'GPT-4.5': 2 },
      'C': { 'Perplexity': 3, 'Claude': 2, 'Gemini': 1 },
      'D': { 'Hugging Face': 3, 'Llama': 2, 'Phi-3': 2 },
      'E': { 'Copilot': 3, 'Phi-4': 2, 'Gemini': 1 }
    },
    question9: {
      'A': { 'Claude': 3, 'AlphaFold': 2, 'Mistral': 2 },
      'B': { 'Pi AI': 3, 'ChatGPT': 2, 'GPT-4.5': 2 },
      'C': { 'Perplexity': 3, 'Claude': 2, 'DeepSeek AI': 2 },
      'D': { 'Llama': 3, 'ChatGPT': 2, 'Hugging Face': 2 },
      'E': { 'Copilot': 3, 'Phi-4': 2, 'Gemini': 1 }
    },
    question10: {
      'A': { 'Claude': 3, 'DeepSeek AI': 2, 'Mistral': 2 },
      'B': { 'Pi AI': 3, 'GPT-4.5': 2, 'ChatGPT': 2 },
      'C': { 'Perplexity': 3, 'Claude': 2, 'Gemini': 2 },
      'D': { 'Llama': 3, 'ChatGPT': 2, 'GPT-4.5': 2 },
      'E': { 'Copilot': 3, 'Grok 3': 2, 'Gemini': 1 }
    }
  };

  return scoring[questionKey]?.[answer] || {};
}

// Calculate tool recommendations
function calculateToolRecommendations(stage2Answers) {
  const toolScores = {};
  
  // Initialize all tools
  Object.values(tools).forEach(category => {
    Object.values(category).forEach(tool => {
      toolScores[tool.name] = { ...tool, score: 0 };
    });
  });

  // Score based on stage 2 answers (only for the first 5 questions)
  if (stage2Answers) {
    stage2Answers.forEach((answer, questionIndex) => {
      if (questionIndex < 5) { // Only process first 5 questions
        const questionKey = `question${questionIndex + 1}`;
        const toolMapping = getToolMappingForAnswer(questionKey, answer);
        
        Object.entries(toolMapping).forEach(([toolName, points]) => {
          if (toolScores[toolName]) {
            toolScores[toolName].score += points;
          }
        });
      }
    });
  }

  // Sort by score and get top 3 + wildcard
  const sorted = Object.values(toolScores)
    .sort((a, b) => b.score - a.score)
    .filter(tool => tool.score > 0);

  const top3 = sorted.slice(0, 3);
  const wildcard = sorted[3] || sorted[0];

  const maxScore = top3[0] ? top3[0].score : 1;

  return {
    top3: top3.map(tool => ({
      ...tool,
      percentage: Math.round((tool.score / maxScore) * 100)
    })),
    wildcard: {
      ...wildcard,
      percentage: Math.round((wildcard.score / maxScore) * 100)
    }
  };
}

// Get tool mapping for specific answer
function getToolMappingForAnswer(questionKey, answer) {
  const mapping = {
    question1: { // Video Creation
      'A': { 'Runway ML': 3, 'Midjourney': 1 },
      'B': { 'CapCut': 3, 'Canva AI': 1 },
      'C': { 'Synthesia': 3, 'ElevenLabs': 1 },
      'D': { 'Descript': 3, 'Audacity AI': 1 }
    },
    question2: { // Image & Design
      'A': { 'Canva AI': 3, 'Adobe Express': 2 },
      'B': { 'Midjourney': 3, 'Runway ML': 1 },
      'C': { 'Remove.bg': 3, 'Descript': 1 },
      'D': { 'Adobe Express': 3, 'Canva AI': 1 }
    },
    question3: { // Audio & Voice
      'A': { 'ElevenLabs': 3, 'Synthesia': 1 },
      'B': { 'Audacity AI': 3, 'Descript': 1 },
      'C': { 'AIVA': 3, 'Midjourney': 1 }
    },
    question4: { // Research & Writing
      'A': { 'Perplexity Pro': 3, 'Claude Pro': 1 },
      'B': { 'Grammarly AI': 3, 'ChatGPT': 1 },
      'C': { 'Claude Pro': 3, 'Perplexity Pro': 1 }
    },
    question5: { // Coding & Tech
      'A': { 'GitHub Copilot': 3, 'Tabnine': 1 },
      'B': { 'Tabnine': 3, 'GitHub Copilot': 1 },
      'C': { 'Replit AI': 3, 'Hugging Face': 1 }
    }
  };

  return mapping[questionKey]?.[answer] || {};
}

// Generate email content
function generateEmailContent(name, personalityResults, toolResults, demographics) {
  const personalitySection = personalityResults.top3.map((companion, index) => 
    `${index + 1}. ${companion.name} – ${companion.percentage}% Match
   Traits: ${companion.traits.join(', ')}
   Best for: ${companion.suggestedUses.join(', ')}

`).join('');

  const wildcardPersonality = `
Wildcard Pick: ${personalityResults.wildcard.name}
${personalityResults.wildcard.description}

`;

  const toolSection = toolResults ? toolResults.top3.map((tool, index) => 
    `${index + 1}. ${tool.name} – ${tool.percentage}% Match
   Category: ${tool.category}
   Description: ${tool.description}

`).join('') : '';

  const wildcardTool = toolResults ? `
Wildcard Pick: ${toolResults.wildcard.name}
${toolResults.wildcard.description}
` : '';

  const demographicsSection = demographics && Object.keys(demographics).length > 0 ? `
📊 Your Profile
Age: ${demographics.age || 'Not specified'}
Location: ${demographics.location || 'Not specified'}
Experience: ${demographics.experience || 'Not specified'}

` : '';

  return `
Hi ${name},

Thank you for taking the AI Personality Matching Survey! Here are your personalized results:

${demographicsSection}🎯 YOUR AI COMPANION MATCHES
${personalitySection}${wildcardPersonality}${toolSection ? `🛠️ YOUR PERSONALIZED AI TOOL STACK
${toolSection}${wildcardTool}` : ''}

These recommendations are based on your responses and should help you find the AI tools and companions that best match your working style and goals.

Best regards,
The Neuron Academy Team

---
This email was generated from your AI Personality Matching Survey results.
  `.trim();
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, stage1Answers, stage2Answers, validationFeedback, demographics } = JSON.parse(event.body);
    
    // Calculate results
    const personalityResults = calculatePersonalityScores(stage1Answers);
    const toolResults = stage2Answers ? calculateToolRecommendations(stage2Answers) : null;
    
    // Store in database
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO quiz_results 
        (name, email, stage1_answers, stage2_answers, personality_scores, tool_scores, validation_feedback, demographics, submitted_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `, [
        name,
        email,
        JSON.stringify(stage1Answers),
        JSON.stringify(stage2Answers),
        JSON.stringify(personalityResults),
        JSON.stringify(toolResults),
        JSON.stringify(validationFeedback),
        JSON.stringify(demographics)
      ]);
    } finally {
      client.release();
    }
    
    // Send email if provided and email service is configured
    if (email && process.env.RESEND_API_KEY) {
      try {
        const emailContent = generateEmailContent(name, personalityResults, toolResults, demographics);
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'AI Quiz <noreply@your-domain.com>',
            to: [email],
            subject: 'Your AI Personality Matching Results',
            text: emailContent
          })
        });
        
        if (!emailResponse.ok) {
          console.error('Email sending failed:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        personalityResults,
        toolResults,
        message: 'Quiz submitted successfully!'
      })
    };
    
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: false, error: 'Failed to submit quiz' })
    };
  }
};

