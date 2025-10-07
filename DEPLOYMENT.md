# 🚀 Deployment Guide - AI Personality Quiz

This guide will help you deploy your AI Personality Quiz to Netlify with Neon PostgreSQL database.

## 📋 Prerequisites

1. **GitHub Account** (for code hosting)
2. **Netlify Account** (for hosting - free tier available)
3. **Neon Account** (for database - free tier available)
4. **Resend Account** (for email - free tier: 3,000 emails/month)

## 🗄️ Step 1: Set Up Neon Database

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub
   - Create a new project

2. **Get Database URL**
   - Copy the connection string from your Neon dashboard
   - It looks like: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`

3. **Run Database Schema**
   - Go to your Neon dashboard → SQL Editor
   - Copy and paste the contents of `database/schema.sql`
   - Execute the SQL to create tables and views

## 🌐 Step 2: Set Up Netlify

1. **Connect GitHub Repository**
   - Push your code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.` (root)
   - Node version: `18`

3. **Set Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   DATABASE_URL=your_neon_database_url
   RESEND_API_KEY=your_resend_api_key
   SITE_URL=https://your-site-name.netlify.app
   ```

## 📧 Step 3: Set Up Email (Resend)

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up and verify your domain
   - Get your API key from the dashboard

2. **Configure Domain (Optional)**
   - Add your domain in Resend dashboard
   - Update the `from` email in `netlify/functions/submit-quiz.js`

## 🔧 Step 4: Configure GitHub Actions (Optional)

1. **Add Netlify Secrets to GitHub**
   - Go to your GitHub repository → Settings → Secrets
   - Add these secrets:
     - `NETLIFY_AUTH_TOKEN`: Get from Netlify → User settings → Applications
     - `NETLIFY_SITE_ID`: Get from Netlify → Site settings → General

2. **Enable GitHub Actions**
   - The `.github/workflows/deploy.yml` file is already configured
   - It will automatically deploy on every push to main branch

## 🎯 Step 5: Customize Your Quiz

1. **Update Branding**
   - Edit `index.html` to change the title and description
   - Update colors in `styles.css`

2. **Modify Questions**
   - Edit questions in `netlify/functions/quiz-data.js`
   - Update scoring logic in `netlify/functions/submit-quiz.js`

3. **Customize Email Template**
   - Modify the `generateEmailContent` function in `submit-quiz.js`

## 🔍 Step 6: Test Your Deployment

1. **Local Testing**
   ```bash
   npm install
   npm run dev
   ```

2. **Production Testing**
   - Take the quiz on your live site
   - Check that emails are being sent
   - Verify data is being stored in Neon

## 📊 Step 7: Monitor Results

1. **Database Analytics**
   - Use the views created in `schema.sql`:
     - `quiz_analytics`: Daily submission statistics
     - `personality_distribution`: Most popular AI companions

2. **Netlify Analytics**
   - Enable Netlify Analytics in your dashboard
   - Monitor traffic and performance

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check your `DATABASE_URL` environment variable
   - Ensure your Neon project is active
   - Verify SSL is enabled

2. **Email Not Sending**
   - Check your `RESEND_API_KEY`
   - Verify your domain is configured in Resend
   - Check Netlify function logs

3. **Build Failures**
   - Ensure Node.js version is 18+
   - Check that all dependencies are in `package.json`
   - Review build logs in Netlify dashboard

### Getting Help:

1. **Netlify Documentation**: [docs.netlify.com](https://docs.netlify.com)
2. **Neon Documentation**: [neon.tech/docs](https://neon.tech/docs)
3. **Resend Documentation**: [resend.com/docs](https://resend.com/docs)

## 💰 Cost Breakdown (Free Tiers)

- **Netlify**: 100GB bandwidth, 300 build minutes/month
- **Neon**: 0.5GB storage, 3GB transfer/month
- **Resend**: 3,000 emails/month
- **GitHub**: Unlimited public repositories

## 🎉 You're Done!

Your AI Personality Quiz is now live and ready for users! The system will:
- ✅ Collect quiz responses
- ✅ Store data in PostgreSQL
- ✅ Send personalized email results
- ✅ Provide analytics and insights

Share your quiz URL and start collecting data from users worldwide!

---

**Need help?** Check the troubleshooting section or create an issue in your GitHub repository.


