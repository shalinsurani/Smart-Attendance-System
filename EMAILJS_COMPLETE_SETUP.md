# 📧 Complete EmailJS Setup Guide

## Overview

Your OTP system is now **fully implemented** and will automatically use EmailJS when configured. Until then, it logs OTPs to the console for testing.

## Current Status

✅ EmailJS package installed (`@emailjs/browser`)
✅ Configuration system ready (environment variables)
✅ OTP service with automatic EmailJS detection
✅ Fallback to console logging for development
✅ Error handling and logging

## Quick Start (5 Minutes)

### Step 1: Create EmailJS Account

1. Go to **https://www.emailjs.com/**
2. Click **"Sign Up"** (it's free!)
3. Verify your email address

### Step 2: Add Email Service

1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **Gmail** (recommended) or your preferred provider
4. Follow the connection wizard
5. **Copy your Service ID** (looks like `service_xxxxxxx`)

### Step 3: Create Email Template

1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Set **Template Name**: `OTP Password Reset`
4. Use this template content:

```
Subject: Password Reset OTP - VisionAttend

Hello {{user_name}},

Your OTP for password reset is: {{otp}}

This OTP will expire in {{expires_in}} minutes.

If you didn't request this, please ignore this email.

Best regards,
VisionAttend Team
```

5. **Important**: Make sure these variables are in your template:
   - `{{to_email}}` - Recipient email
   - `{{user_name}}` - User's name
   - `{{otp}}` - The OTP code
   - `{{expires_in}}` - Expiration time (5 minutes)

6. Click **"Save"** and **copy your Template ID** (looks like `template_xxxxxxx`)

### Step 4: Get Public Key

1. Go to **"Account"** → **"General"**
2. Find **"Public Key"** section
3. **Copy your Public Key** (looks like a long string)

### Step 5: Configure Your App

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your EmailJS credentials:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. **Replace** the placeholder values with your actual credentials from EmailJS

### Step 6: Restart Your Dev Server

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 7: Test It!

1. Go to the **Forgot Password** page
2. Enter an email address
3. Check your inbox - you should receive the OTP email!
4. The console will also show a success message

## How It Works

The system automatically detects if EmailJS is configured:

- **✅ Configured**: Sends real emails via EmailJS
- **⚠️ Not Configured**: Logs OTP to console for testing

No code changes needed - just add the environment variables!

## Email Template Variables

Your EmailJS template should include these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{to_email}}` | Recipient's email | user@example.com |
| `{{user_name}}` | User's name | John Doe |
| `{{otp}}` | 6-digit OTP code | 123456 |
| `{{expires_in}}` | Minutes until expiration | 5 |

## Troubleshooting

### OTP Not Sending

1. **Check console** - Look for error messages
2. **Verify credentials** - Make sure all three values are correct in `.env`
3. **Restart dev server** - Environment variables need a restart
4. **Check EmailJS dashboard** - Look at the "Logs" section for errors

### Email Not Received

1. **Check spam folder** - Sometimes OTP emails go to spam
2. **Verify email service** - Make sure your EmailJS service is connected
3. **Check template** - Ensure all variables are correctly placed
4. **Test in EmailJS** - Use the "Test" button in EmailJS dashboard

### Console Shows "Development Mode"

This means EmailJS is not configured yet. Add credentials to `.env` file.

## Free Tier Limits

EmailJS free tier includes:
- ✅ **200 emails per month**
- ✅ All features included
- ✅ No credit card required
- ✅ Perfect for testing and small apps

## Production Alternatives

For larger scale production (>200 emails/month), consider:

- **SendGrid** - 100 emails/day free
- **AWS SES** - $0.10 per 1,000 emails
- **Mailgun** - 5,000 emails/month free
- **Twilio SendGrid** - Reliable and scalable

## Security Notes

- ✅ Environment variables keep credentials secure
- ✅ Never commit `.env` file to Git
- ✅ OTPs expire after 5 minutes
- ✅ Old OTPs are automatically deleted
- ✅ One OTP per email at a time

## Example .env File

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# EmailJS Configuration (for OTP emails)
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## Testing Without EmailJS

You can test the OTP system without configuring EmailJS:

1. Go to Forgot Password page
2. Enter any email
3. Check the **browser console** (F12)
4. The OTP will be displayed there
5. Copy and use it to reset password

## Next Steps

1. ✅ **Deploy Firestore Rules** (if not done yet)
   - See `DEPLOY_FIRESTORE_RULES_OTP.md`
   
2. ✅ **Configure EmailJS** (optional but recommended)
   - Follow steps above
   
3. ✅ **Test the system**
   - Try forgot password flow
   - Verify OTP works
   
4. ✅ **Go to production**
   - System is ready!

## Support

- **EmailJS Docs**: https://www.emailjs.com/docs/
- **EmailJS Support**: support@emailjs.com
- **Free Tier**: No credit card needed

---

**That's it!** Your OTP system is production-ready. Configure EmailJS when you're ready to send real emails, or keep using console logging for development. 🚀
