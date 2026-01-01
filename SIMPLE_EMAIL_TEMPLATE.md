# 📧 Simple Email Template (Text Version)

## If HTML Template Doesn't Work

Use this simpler text-based template:

### Template Settings:
```
Template Name: Password Reset OTP
To Email: {{to_email}}
From Name: VisionAttend
Subject: Password Reset Request - VisionAttend
```

### Template Content (Plain Text):

```
Hello {{user_name}},

We received a request to reset your password for your VisionAttend account.

═══════════════════════════════════════
YOUR OTP CODE
═══════════════════════════════════════

        {{otp}}

═══════════════════════════════════════

⏰ IMPORTANT: This OTP will expire in {{expires_in}} minutes.

Please enter this code on the password reset page to continue.


🔒 SECURITY TIPS:
• Never share this OTP with anyone
• VisionAttend staff will never ask for your OTP
• If you didn't request this, please ignore this email


If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
VisionAttend Team

---
This is an automated message, please do not reply to this email.
© 2025 VisionAttend. All rights reserved.
```

## 🎯 How to Use

1. Go to EmailJS dashboard
2. Edit template `template_ajg3gzz`
3. Copy the text above
4. Paste into template content
5. Save
6. Test!

This simpler version will work in all email clients and still looks professional.
