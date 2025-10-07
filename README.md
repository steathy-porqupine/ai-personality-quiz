# AI Personality Matching Quiz

An interactive quiz that matches users to their ideal AI companions and recommends personalized AI tools based on their personality and goals.

## Features

- **Two-Stage Quiz**: Personality assessment followed by tool recommendations
- **Interactive UI**: Mobile-responsive design with smooth animations
- **Email Results**: Automatic email delivery of personalized recommendations
- **Data Collection**: Backend storage of survey results for analysis
- **Validation Flow**: User feedback system to improve recommendations
- **Modern Design**: Clean, accessible interface optimized for all devices

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project files**
   ```bash
   # If you have git:
   git clone <repository-url>
   cd ai-personality-quiz
   
   # Or download and extract the files to a folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your email configuration
   nano .env
   ```

4. **Configure email settings** (optional but recommended)
   
   Edit the `.env` file:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3000
   ```
   
   **For Gmail users:**
   - Enable 2-factor authentication
   - Generate an App Password (not your regular password)
   - Use the App Password in `EMAIL_PASS`

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000` to take the quiz!

## Configuration

### Email Setup

The quiz can send results via email. Supported services:

- **Gmail**: Use App Passwords (recommended)
- **Outlook/Hotmail**: Use App Passwords
- **Custom SMTP**: Modify the transporter configuration in `server.js`

### Database

The quiz uses SQLite by default, which creates a local database file (`quiz_results.db`). No additional setup required.

For production, you can modify `server.js` to use PostgreSQL, MySQL, or MongoDB.

## Project Structure

```
├── index.html          # Main quiz interface
├── app.js              # Frontend JavaScript logic
├── styles.css          # Responsive CSS styles
├── server.js           # Backend API server
├── package.json        # Dependencies and scripts
├── quiz_results.db     # SQLite database (created automatically)
├── .env               # Environment variables (create from .env.example)
└── README.md          # This file
```

## API Endpoints

### `GET /`
Serves the main quiz interface.

### `GET /api/quiz-data`
Returns the quiz questions and options for both stages.

### `POST /api/submit-quiz`
Submits quiz results and sends email notifications.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "stage1Answers": ["A", "B", "C", "D", "E"],
  "stage2Answers": ["A", "B", "C", "D", "E"],
  "validationFeedback": {
    "stage1": "yes",
    "stage2": "kindof",
    "comments": "Great quiz!"
  }
}
```

## Quiz Flow

1. **Introduction**: User enters name and starts quiz
2. **Stage 1 - Personality**: 5 questions to determine AI companion matches
3. **Validation**: User confirms if personality feels right
4. **Stage 2 - Tools**: 5 questions about goals and tool preferences
5. **Final Validation**: User confirms tool recommendations
6. **Results**: Email delivery and on-screen display of results

## Customization

### Adding Questions

Edit the questions in `server.js` in the `/api/quiz-data` endpoint:

```javascript
stage1Questions: [
  {
    id: 1,
    question: "Your new question here?",
    options: [
      { value: 'A', text: 'Option A text' },
      { value: 'B', text: 'Option B text' }
    ]
  }
]
```

### Modifying Scoring

Update the scoring logic in `server.js`:

```javascript
function getScoringForAnswer(questionKey, answer) {
  const scoring = {
    question1: {
      'A': { 'Claude': 3, 'ChatGPT': 2 },
      'B': { 'ChatGPT': 3, 'Claude': 1 }
    }
  };
  return scoring[questionKey]?.[answer] || {};
}
```

### Styling

Modify `styles.css` to match your brand colors and design preferences.

## Deployment

### Local Network Access

To make the quiz accessible on your local network:

1. Find your computer's IP address
2. Start the server with:
   ```bash
   npm start
   ```
3. Access from other devices: `http://YOUR_IP_ADDRESS:3000`

### Production Deployment

For production deployment:

1. **Environment Setup**
   ```bash
   export NODE_ENV=production
   export PORT=80
   ```

2. **Process Manager** (recommended)
   ```bash
   npm install -g pm2
   pm2 start server.js --name "ai-quiz"
   pm2 startup
   pm2 save
   ```

3. **Reverse Proxy** (nginx example)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Troubleshooting

### Email Not Sending

1. Check your email credentials in `.env`
2. Verify App Password (not regular password for Gmail)
3. Check server logs for error messages
4. Test with a simple SMTP configuration

### Database Issues

1. Ensure write permissions in the project directory
2. Check if `quiz_results.db` is created
3. For production, consider using a proper database service

### Port Already in Use

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify for your projects.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs for error messages
3. Create an issue with detailed information about your setup

---

**Built with ❤️ for the AI community**