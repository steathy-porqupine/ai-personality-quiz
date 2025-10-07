# 🚀 Quick Start - AI Personality Quiz

## ⚡ 5-Minute Setup

### 1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-personality-quiz.git
git push -u origin main
```

### 2. **Set Up Neon Database** (2 minutes)
1. Go to [neon.tech](https://neon.tech) → Sign up with GitHub
2. Create new project → Copy connection string
3. Go to SQL Editor → Run `database/schema.sql`

### 3. **Deploy to Netlify** (2 minutes)
1. Go to [netlify.com](https://netlify.com) → "New site from Git"

2. Connect your GitHub repository
3. Set environment variables:
   - `DATABASE_URL`: Your Neon connection string
   - `RESEND_API_KEY`: Get from [resend.com](https://resend.com)

### 4. **Set Up Email** (1 minute)
1. Sign up at [resend.com](https://resend.com)
2. Get API key → Add to Netlify environment variables
3. Optional: Add your domain for custom "from" address

## 🎯 That's It!

Your quiz is now live at `https://your-site-name.netlify.app`

## 📊 What You Get

- ✅ **Interactive Quiz**: Mobile-responsive, beautiful UI
- ✅ **Two Stages**: Personality + Tool recommendations  
- ✅ **Email Results**: Personalized recommendations sent automatically
- ✅ **Data Collection**: All responses stored in PostgreSQL
- ✅ **Analytics**: Built-in views for insights
- ✅ **Free Hosting**: Netlify + Neon + Resend free tiers

## 🔧 Customization

- **Questions**: Edit `netlify/functions/quiz-data.js`
- **Scoring**: Modify `netlify/functions/submit-quiz.js`
- **Styling**: Update `styles.css`
- **Branding**: Change `index.html`

## 📈 Analytics

Check your Neon dashboard for:
- Daily submission counts
- Most popular AI companions
- User demographics
- Completion rates

---

**Need help?** See `DEPLOYMENT.md` for detailed instructions.
