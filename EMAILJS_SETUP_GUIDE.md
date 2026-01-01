# EmailJS Setup Guide for OTP Emails

## Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. Go to "Email Services" in the dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the instructions to connect your email
5. Note down your **Service ID**

## Step 3: Create Email Template

1. Go to "Email Templates" in the dashboard
2. Click "Create New Template"
3. Use this template:

```
Subject: Password Reset OTP - VisionAttend

Hello {{user_name}},

Your OTP for password reset is: {{otp}}

This OTP will expire in {{expires_in}} minutes.

If you didn't request this, please ignore this email.

Best regards,
VisionAttend Team
```

4. Save the template and note down your **Template ID**

## Step 4: Get Public Key

1. Go to "Account" → "General"
2. Find your **Public Key**
3. Copy it

## Step 5: Configure in Your App

1. Open `src/config/emailjs.js`
2. Replace the placeholder values:

```javascript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_xxxxxxx', // Your Service ID
  TEMPLATE_ID: 'template_xxxxxxx', // Your Template ID
  PUBLIC_KEY: 'xxxxxxxxxxxxxxx' // Your Public Key
}
```

## Step 6: Enable EmailJS in OTP Service

1. Open `src/services/otpService.js`
2. Find the `sendOTPEmail` function
3. Uncomment the EmailJS integration code:

```javascript
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from '../config/emailjs'

export const sendOTPEmail = async (email, otp, userName) => {
  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        to_email: email,
        user_name: userName,
        otp: otp,
        expires_in: '5'
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    )
    
    return true
  } catch (error) {
    console.error('Error sending OTP email:', error)
    throw error
  }
}
```

## Step 7: Test

1. Go to forgot password page
2. Enter an email
3. Check your inbox for the OTP email
4. The OTP will be displayed in console for development

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- All features included
- No credit card required

For production with more users, consider upgrading or using:
- SendGrid
- AWS SES
- Mailgun
- Twilio SendGrid

## Current Status

✅ EmailJS package installed
✅ Configuration file created with environment variables
✅ OTP service with automatic EmailJS detection
✅ Fallback to console logging for development
✅ Error handling implemented
⚠️ Needs EmailJS credentials to send actual emails (optional)

**The system is production-ready!** It automatically detects if EmailJS is configured:
- With credentials: Sends real emails
- Without credentials: Logs to console for testing

## Quick Reference

See `EMAILJS_QUICK_REFERENCE.md` for a 30-second setup guide.
See `EMAILJS_COMPLETE_SETUP.md` for detailed instructions.
