# 📧 EmailJS Quick Reference

## ⚡ 30-Second Setup

1. **Sign up**: https://www.emailjs.com/
2. **Add Gmail service** → Copy Service ID
3. **Create template** → Copy Template ID
4. **Get Public Key** from Account settings
5. **Add to `.env`**:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxx
   VITE_EMAILJS_PUBLIC_KEY=your_key
   ```
6. **Restart dev server**: `npm run dev`

## 📧 Email Template

```
Subject: Password Reset OTP - VisionAttend

Hello {{user_name}},

Your OTP for password reset is: {{otp}}

This OTP will expire in {{expires_in}} minutes.

If you didn't request this, please ignore this email.

Best regards,
VisionAttend Team
```

## ✅ How to Test

### Without EmailJS (Development)
- OTP shows in browser console (F12)
- No configuration needed

### With EmailJS (Production)
- Real emails sent to users
- Check inbox/spam folder

## 🔍 Status Check

Open browser console and look for:
- ✅ `"OTP email sent successfully"` = EmailJS working
- ⚠️ `"Development Mode"` = Using console logging

## 📊 Free Tier

- 200 emails/month
- No credit card needed
- Perfect for testing

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| No email received | Check spam folder |
| "Development Mode" | Add credentials to `.env` |
| Errors in console | Verify all 3 credentials are correct |
| Still not working | Restart dev server |

## 📁 Files Modified

- `src/config/emailjs.js` - Configuration with env variables
- `src/services/otpService.js` - Auto-detection of EmailJS
- `.env.example` - Template for credentials
- `.env` - Your actual credentials (create this)

## 🎯 Current Features

✅ Automatic EmailJS detection
✅ Fallback to console logging
✅ Environment variable configuration
✅ Error handling
✅ 5-minute OTP expiration
✅ Automatic cleanup of old OTPs

---

**Full guide**: See `EMAILJS_COMPLETE_SETUP.md`
