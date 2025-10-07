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

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const quizData = {
    stage1Questions: [
      {
        id: 1,
        question: "How do you handle an unfamiliar task?",
        options: [
          { value: 'A', text: 'I make a to-do list and tackle each step one by one.' },
          { value: 'B', text: 'I call a friend to brainstorm ideas and talk it out.' },
          { value: 'C', text: 'I search online for a detailed guide or tutorial.' },
          { value: 'D', text: 'I just dive in and figure it out as I go.' },
          { value: 'E', text: 'I look for a simple hack or template to get it done quickly.' }
        ]
      },
      {
        id: 2,
        question: "What's your main contribution to a team project?",
        options: [
          { value: 'A', text: 'I make sure everyone stays on schedule and follows the plan.' },
          { value: 'B', text: 'I come up with the big, creative, and out-of-the-box ideas.' },
          { value: 'C', text: 'I\'m the one who checks all the facts and makes sure the details are correct.' },
          { value: 'D', text: 'I listen to everyone\'s concerns and keep the team\'s morale high.' },
          { value: 'E', text: 'I\'m the go-to person for fixing technical problems or tricky software issues.' }
        ]
      },
      {
        id: 3,
        question: "Imagine your ideal weekend. What are you doing?",
        options: [
          { value: 'A', text: 'Cozying up with a complex non-fiction book or a long article.' },
          { value: 'B', text: 'Starting a creative project, like painting, writing, or composing music.' },
          { value: 'C', text: 'Working on a personal project, like building a custom PC or coding a small app.' },
          { value: 'D', text: 'Having a relaxed chat with a close friend over coffee.' },
          { value: 'E', text: 'Exploring a new city, trying a new restaurant, or discovering a new app.' }
        ]
      },
      {
        id: 4,
        question: "What bothers you the most?",
        options: [
          { value: 'A', text: 'When things feel inefficient or take too much time.' },
          { value: 'B', text: 'When someone gives you information that turns out to be wrong.' },
          { value: 'C', text: 'When a project lacks originality or is just "going through the motions."' },
          { value: 'D', text: 'When conversations feel cold, distant, or robotic.' },
          { value: 'E', text: 'When you\'re told there\'s only one way to do something.' }
        ]
      },
      {
        id: 5,
        question: "Your \"superpower\" would be...",
        options: [
          { value: 'A', text: 'The ability to remember every single detail you\'ve ever read.' },
          { value: 'B', text: 'A natural talent for understanding people\'s emotions and feelings.' },
          { value: 'C', text: 'Knowing the answer to any question as soon as you think of it.' },
          { value: 'D', text: 'Being able to instantly create amazing art or visuals from a simple thought.' },
          { value: 'E', text: 'Unwavering accuracy and precision in all things scientific or technical.' }
        ]
      }
    ],
    stage2Questions: [
      {
        id: 1,
        question: "🎬 What kind of video do you want to make?",
        options: [
          { value: 'A', text: 'Cinematic Stories (movies, ads, creative projects)' },
          { value: 'B', text: 'Quick Social Clips (TikTok, Instagram, YouTube Shorts)' },
          { value: 'C', text: 'Business & Training Videos (with an on-screen avatar)' },
          { value: 'D', text: 'Simple Video Edits (cutting, removing words, sound fixes)' }
        ]
      },
      {
        id: 2,
        question: "🖼️ What is your main goal with images?",
        options: [
          { value: 'A', text: 'Creating Professional Graphics (ads, logos, presentations)' },
          { value: 'B', text: 'Generating Amazing Art (fantasy, digital painting, abstract)' },
          { value: 'C', text: 'Editing Photos (removing backgrounds, enhancing quality)' },
          { value: 'D', text: 'Graphics with Perfect Text (posters, memes, titles)' }
        ]
      },
      {
        id: 3,
        question: "🎧 What do you need most for your audio?",
        options: [
          { value: 'A', text: 'Creating Realistic Voices (voiceovers, cloning, dubbing)' },
          { value: 'B', text: 'Cleaning up Sound (removing noise, separating vocals)' },
          { value: 'C', text: 'Composing Music (soundtracks, scores)' }
        ]
      },
      {
        id: 4,
        question: "📚 What's your primary focus?",
        options: [
          { value: 'A', text: 'Getting Cited Facts (research papers, reports, documents)' },
          { value: 'B', text: 'Writing & Brainstorming (stories, emails, creative content)' },
          { value: 'C', text: 'Academic Analysis (long documents, complex subjects)' }
        ]
      },
      {
        id: 5,
        question: "💻 What is your main coding goal?",
        options: [
          { value: 'A', text: 'Building a New App (prototyping, full-stack development)' },
          { value: 'B', text: 'Debugging Code & Planning Projects (getting quick fixes)' },
          { value: 'C', text: 'Working with Open Source (experimenting, building on a community)' }
        ]
      }
    ],
    additionalQuestions: [
      {
        id: 6,
        question: "When working on a project, you prefer to...",
        options: [
          { value: 'A', text: 'Work alone with minimal interruptions' },
          { value: 'B', text: 'Collaborate with others and get regular feedback' },
          { value: 'C', text: 'Follow a structured approach with clear deadlines' },
          { value: 'D', text: 'Experiment freely and explore different approaches' },
          { value: 'E', text: 'Focus on the most efficient path to completion' }
        ]
      },
      {
        id: 7,
        question: "Your ideal learning environment is...",
        options: [
          { value: 'A', text: 'Quiet library or home office with minimal distractions' },
          { value: 'B', text: 'Interactive workshop or group discussion setting' },
          { value: 'C', text: 'Structured classroom with clear curriculum' },
          { value: 'D', text: 'Hands-on lab or creative studio space' },
          { value: 'E', text: 'Anywhere with good internet and the right tools' }
        ]
      },
      {
        id: 8,
        question: "When facing a complex problem, you typically...",
        options: [
          { value: 'A', text: 'Break it down into smaller, manageable pieces' },
          { value: 'B', text: 'Discuss it with others to get different perspectives' },
          { value: 'C', text: 'Research similar problems and proven solutions' },
          { value: 'D', text: 'Try multiple approaches until something works' },
          { value: 'E', text: 'Look for shortcuts or existing tools that can help' }
        ]
      },
      {
        id: 9,
        question: "What motivates you most in your work?",
        options: [
          { value: 'A', text: 'Achieving perfection and high-quality results' },
          { value: 'B', text: 'Helping others and making a positive impact' },
          { value: 'C', text: 'Learning new things and expanding knowledge' },
          { value: 'D', text: 'Creating something unique and innovative' },
          { value: 'E', text: 'Completing tasks efficiently and moving forward' }
        ]
      },
      {
        id: 10,
        question: "Your communication style is best described as...",
        options: [
          { value: 'A', text: 'Detailed and thorough, with comprehensive explanations' },
          { value: 'B', text: 'Warm and encouraging, focused on people\'s feelings' },
          { value: 'C', text: 'Factual and precise, backed by evidence' },
          { value: 'D', text: 'Creative and inspiring, full of ideas and possibilities' },
          { value: 'E', text: 'Direct and efficient, getting straight to the point' }
        ]
      }
    ]
  };

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quizData)
  };
};

