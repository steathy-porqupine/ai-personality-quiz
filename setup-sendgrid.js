#!/usr/bin/env node

/**
 * SendGrid Setup Guide
 * Instructions for setting up SendGrid email service
 */

console.log('🚀 SendGrid Email Service Setup Guide\n');
console.log('=' * 50);

console.log('\n📋 STEP 1: Create SendGrid Account');
console.log('1. Go to: https://signup.sendgrid.com/');
console.log('2. Sign up with your email');
console.log('3. Verify your email address');
console.log('4. Complete the account setup');

console.log('\n🔑 STEP 2: Get API Key');
console.log('1. Go to: https://app.sendgrid.com/settings/api_keys');
console.log('2. Click "Create API Key"');
console.log('3. Name it: "AI Personality Quiz"');
console.log('4. Select "Restricted Access"');
console.log('5. Under "Mail Send", select "Full Access"');
console.log('6. Click "Create & View"');
console.log('7. Copy the API key (starts with SG.)');

console.log('\n⚙️  STEP 3: Add to Environment Variables');
console.log('1. Go to your Netlify dashboard');
console.log('2. Navigate to: Site settings → Environment variables');
console.log('3. Add new variable:');
console.log('   Key: SENDGRID_API_KEY');
console.log('   Value: [Your API key from step 2]');
console.log('4. Save the changes');

console.log('\n📧 STEP 4: Set Sender Email');
console.log('1. In SendGrid dashboard, go to: Settings → Sender Authentication');
console.log('2. Click "Verify a Single Sender"');
console.log('3. Add your email: neuron.academy25@gmail.com');
console.log('4. Fill in the required information');
console.log('5. Check your email and click the verification link');

console.log('\n✅ STEP 5: Test the Integration');
console.log('1. The quiz will automatically use SendGrid once configured');
console.log('2. SendGrid allows sending to ANY email address');
console.log('3. No domain verification required for basic usage');

console.log('\n🎯 BENEFITS:');
console.log('✅ 100 emails/day FREE forever');
console.log('✅ Send to ANY email address');
console.log('✅ No domain verification needed');
console.log('✅ High deliverability rates');
console.log('✅ Easy integration with Netlify');

console.log('\n📞 Need Help?');
console.log('- SendGrid Docs: https://docs.sendgrid.com/');
console.log('- Support: https://support.sendgrid.com/');

console.log('\n' + '=' * 50);
console.log('🎉 Once you complete these steps, your quiz will send emails to anyone!');
