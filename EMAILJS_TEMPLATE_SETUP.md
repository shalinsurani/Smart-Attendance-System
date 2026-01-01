# 📧 EmailJS Template Setup Guide

## ✅ What I Just Fixed

Changed the EmailJS integration from dynamic imports to direct imports and added proper initialization. This should fix the "Inaccessible Content" error.

## 🔍 Verify Your EmailJS Setup

### Step 1: Check EmailJS Dashboard

1. Go to: https://dashboard.emailjs.com/
2. Log in with your account
3. Verify these settings:

### Step 2: Email Service

1. Click **"Email Services"** in left sidebar
2. You should see your connected service (Gmail, etc.)
3. **Service ID** should be: `service_fyvi50a`
4. Make sure the service is **Active** (green checkmark)

### Step 3: Email Template

1. Click **"Email Templates"** in left sidebar
2. Find your template with ID: `template_ajg3gzz`
3. Click **"Edit"** on the template
4. **IMPORTANT**: Make sure your template has these exact variable names:

```
Subject: Password Reset OTP - VisionAttend

Hello {{user_name}},

Your OTP for password reset is: {{otp}}

This OTP will expire in {{expires_in}} minutes.

If you didn't request this, please ignore this email.

Best regards,
VisionAttend Team
```

### Step 4: Template Variables

Make sure these variables are in your template:
- `{{to_email}}` - In the "To Email" field (not in body)
- `{{user_name}}` - In the email body
- `{{otp}}` - In the email body
- `{{expires_in}}` - In the email body

### Step 5: Template Settings

1. In the template editor, check the **"To Email"** field
2. It should contain: `{{to_email}}`
3. **NOT** a hardcoded email address

### Step 6: Public Key

1. Go to **"Account"** → **"General"**
2. Find **"Public Key"**
3. Should be: `TCNLLP-DLDPb2OkvL`
4. Make sure it's not blocked or restricted

## 🚀 Test After Setup

1. **Restart your dev server**:
   ```bash
   # Press Ctrl+C
   npm run dev
   ```

2. **Clear browser cache**: Ctrl+Shift+R

3. **Try forgot password again**

4. **Check console** - you should see:
   ```
   📧 Attempting to send email via EmailJS...
   Service ID: service_fyvi50a
   Template ID: template_ajg3gzz
   ✅ OTP email sent successfully to user@example.com
   ```

5. **Check your email inbox** (and spam folder!)

## 🔧 Common Issues

### Issue 1: "Inaccessible Content"
**Cause**: Dynamic import issue or CORS
**Fix**: Already fixed with direct import

### Issue 2: "Invalid Template"
**Cause**: Template variables don't match
**Fix**: Update template to use exact variable names above

### Issue 3: "Service Not Found"
**Cause**: Service ID is wrong or service is inactive
**Fix**: Check service ID in dashboard

### Issue 4: "Public Key Invalid"
**Cause**: Public key is wrong or blocked
**Fix**: Verify public key in Account settings

### Issue 5: Email Not Received
**Possible causes**:
- Check spam folder
- Email service not connected properly
- Daily limit reached (200 emails/month on free tier)
- Template "To Email" field not set to `{{to_email}}`

## 📊 Expected Console Output

### Success:
```
📝 Storing OTP for: user@example.com
✅ OTP stored successfully with ID: abc123
========================================
OTP EMAIL (Development Mode)
========================================
OTP: 123456
========================================
📧 Attempting to send email via EmailJS...
Service ID: service_fyvi50a
Template ID: template_ajg3gzz
✅ OTP email sent successfully to user@example.com
EmailJS Response: {status: 200, text: 'OK'}
```

### Failure:
```
❌ EmailJS Error: [error details]
Error status: 400
Error text: [specific error]
⚠️ EmailJS failed, but OTP is available in console above
```

## 🎯 Checklist

- [ ] EmailJS service is active
- [ ] Service ID matches: `service_fyvi50a`
- [ ] Template ID matches: `template_ajg3gzz`
- [ ] Template has all required variables
- [ ] Template "To Email" field is `{{to_email}}`
- [ ] Public key matches: `TCNLLP-DLDPb2OkvL`
- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] Tested forgot password

## 📧 Template Example

Here's exactly what your EmailJS template should look like:

**Template Settings:**
- **To Email**: `{{to_email}}`
- **From Name**: VisionAttend
- **From Email**: your-email@gmail.com (or your connected email)
- **Subject**: Password Reset OTP - VisionAttend

**Template Content:**
```
Hello {{user_name}},

Your OTP for password reset is: {{otp}}

This OTP will expire in {{expires_in}} minutes.

If you didn't request this, please ignore this email.

Best regards,
VisionAttend Team
```

---

**After verifying these settings, restart your dev server and test again!** 🚀
