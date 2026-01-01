# 📧 EmailJS Visual Setup Guide

## 🎯 The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    OTP Email System                          │
│                                                              │
│  User Requests OTP                                          │
│         ↓                                                    │
│  System Generates 6-digit OTP                               │
│         ↓                                                    │
│  ┌──────────────────────────────────┐                      │
│  │  Is EmailJS Configured?          │                      │
│  └──────────────────────────────────┘                      │
│         ↓                    ↓                              │
│       YES                   NO                              │
│         ↓                    ↓                              │
│  Send Real Email      Log to Console                        │
│  via EmailJS          (Development)                         │
│         ↓                    ↓                              │
│  User Gets Email      User Checks Console                   │
│         ↓                    ↓                              │
│  ────────────────────────────────                          │
│         ↓                                                    │
│  User Enters OTP                                            │
│         ↓                                                    │
│  Password Reset Success! ✅                                 │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Setup Flow

```
Step 1: EmailJS Account
┌─────────────────────────┐
│ https://emailjs.com     │
│ Sign Up (Free)          │
│ Verify Email            │
└─────────────────────────┘
         ↓
Step 2: Add Email Service
┌─────────────────────────┐
│ Choose Gmail/Outlook    │
│ Connect Your Email      │
│ Copy: Service ID        │
└─────────────────────────┘
         ↓
Step 3: Create Template
┌─────────────────────────┐
│ Create New Template     │
│ Add Variables:          │
│ - {{to_email}}          │
│ - {{user_name}}         │
│ - {{otp}}               │
│ - {{expires_in}}        │
│ Copy: Template ID       │
└─────────────────────────┘
         ↓
Step 4: Get Public Key
┌─────────────────────────┐
│ Account → General       │
│ Copy: Public Key        │
└─────────────────────────┘
         ↓
Step 5: Configure App
┌─────────────────────────┐
│ Create .env file        │
│ Add 3 credentials       │
│ Restart dev server      │
└─────────────────────────┘
         ↓
Step 6: Test!
┌─────────────────────────┐
│ Go to Forgot Password   │
│ Enter email             │
│ Check inbox             │
│ Use OTP                 │
└─────────────────────────┘
```

## 📁 File Structure

```
your-project/
│
├── .env                          ← Create this! Add credentials
├── .env.example                  ← Template (already created)
│
├── src/
│   ├── config/
│   │   └── emailjs.js           ← Configuration (✅ Done)
│   │
│   ├── services/
│   │   └── otpService.js        ← OTP logic (✅ Done)
│   │
│   └── pages/
│       └── ForgotPassword.jsx   ← UI (✅ Done)
│
└── Documentation/
    ├── EMAILJS_COMPLETE_SETUP.md      ← Full guide
    ├── EMAILJS_QUICK_REFERENCE.md     ← Quick start
    ├── OTP_TESTING_CHECKLIST.md       ← Testing
    └── EMAILJS_VISUAL_GUIDE.md        ← This file
```

## 🎨 EmailJS Dashboard Navigation

```
EmailJS Dashboard
├── Email Services
│   ├── Add New Service
│   ├── Gmail / Outlook / etc.
│   └── [Copy Service ID] ← You need this!
│
├── Email Templates
│   ├── Create New Template
│   ├── Add template content
│   └── [Copy Template ID] ← You need this!
│
└── Account
    └── General
        └── [Copy Public Key] ← You need this!
```

## 📝 .env File Format

```env
# ┌─────────────────────────────────────────┐
# │  EmailJS Configuration                  │
# │  Replace xxx with your actual values    │
# └─────────────────────────────────────────┘

VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## 📧 Email Template Layout

```
┌────────────────────────────────────────────┐
│ Subject: Password Reset OTP - VisionAttend │
├────────────────────────────────────────────┤
│                                            │
│ Hello {{user_name}},                       │
│                                            │
│ Your OTP for password reset is: {{otp}}   │
│                                            │
│ This OTP will expire in {{expires_in}}    │
│ minutes.                                   │
│                                            │
│ If you didn't request this, please ignore │
│ this email.                                │
│                                            │
│ Best regards,                              │
│ VisionAttend Team                          │
│                                            │
└────────────────────────────────────────────┘
```

## 🔍 Console Messages

### Development Mode (No EmailJS)
```
┌────────────────────────────────────────────┐
│ ========================================   │
│ OTP EMAIL (Development Mode)               │
│ ========================================   │
│ To: user@example.com                       │
│ Subject: Password Reset OTP                │
│                                            │
│ Hello User,                                │
│                                            │
│ Your OTP: 123456                           │
│                                            │
│ Expires in: 5 minutes                      │
│ ========================================   │
│ ⚠️ EmailJS not configured                  │
│ ========================================   │
└────────────────────────────────────────────┘
```

### Production Mode (With EmailJS)
```
┌────────────────────────────────────────────┐
│ ✅ OTP email sent successfully to          │
│    user@example.com                        │
└────────────────────────────────────────────┘
```

## 🎯 Testing Workflow

```
Test 1: Without EmailJS
┌─────────────────────┐
│ 1. Go to Forgot PW  │
│ 2. Enter email      │
│ 3. Open Console F12 │
│ 4. Copy OTP         │
│ 5. Enter OTP        │
│ 6. Reset password   │
└─────────────────────┘
         ↓
    ✅ Success!

Test 2: With EmailJS
┌─────────────────────┐
│ 1. Add credentials  │
│ 2. Restart server   │
│ 3. Go to Forgot PW  │
│ 4. Enter email      │
│ 5. Check inbox      │
│ 6. Copy OTP         │
│ 7. Enter OTP        │
│ 8. Reset password   │
└─────────────────────┘
         ↓
    ✅ Success!
```

## 🔐 Security Flow

```
OTP Generation
┌─────────────────────────────────────┐
│ Random 6-digit code                 │
│ Stored in Firestore                 │
│ Expires in 5 minutes                │
│ One OTP per email                   │
│ Old OTPs auto-deleted               │
└─────────────────────────────────────┘
         ↓
OTP Verification
┌─────────────────────────────────────┐
│ Check if OTP exists                 │
│ Check if not expired                │
│ Check if matches                    │
│ Delete after use                    │
└─────────────────────────────────────┘
         ↓
Password Reset
┌─────────────────────────────────────┐
│ Update user password                │
│ Clean up OTP                        │
│ Success message                     │
└─────────────────────────────────────┘
```

## 📊 Status Indicators

```
┌─────────────────────────────────────────────┐
│ System Status                               │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Package Installed                        │
│    @emailjs/browser@4.4.1                   │
│                                             │
│ ✅ Configuration Ready                      │
│    src/config/emailjs.js                    │
│                                             │
│ ✅ Service Implemented                      │
│    src/services/otpService.js               │
│                                             │
│ ✅ Auto-Detection Working                   │
│    Switches between modes automatically     │
│                                             │
│ ⚠️ EmailJS Credentials                      │
│    Optional - Add to .env for real emails   │
│                                             │
└─────────────────────────────────────────────┘
```

## 🎊 Quick Decision Tree

```
Do you want to test right now?
         │
    ┌────┴────┐
   YES       NO
    │         │
    ↓         ↓
Use Console  Setup EmailJS
Logging      (5 minutes)
    │         │
    ↓         ↓
Works       Works with
immediately  real emails
    │         │
    └────┬────┘
         ↓
    Both work!
    Choose based
    on your needs
```

## 💡 Pro Tips

```
┌─────────────────────────────────────────┐
│ 💡 Tip 1: Start Simple                  │
│    Test with console logging first      │
│    Add EmailJS when ready               │
│                                         │
│ 💡 Tip 2: Check Spam                    │
│    First emails might go to spam        │
│    Mark as "Not Spam"                   │
│                                         │
│ 💡 Tip 3: Free Tier                     │
│    200 emails/month is plenty           │
│    for testing and small apps           │
│                                         │
│ 💡 Tip 4: Environment Variables         │
│    Never commit .env to Git             │
│    Use .env.example as template         │
│                                         │
│ 💡 Tip 5: Restart Server                │
│    After adding credentials             │
│    Restart dev server to load them      │
└─────────────────────────────────────────┘
```

## 🎯 Success Checklist

```
□ Package installed (@emailjs/browser)
□ Configuration file created
□ Service implemented
□ Documentation read
□ .env.example exists
□ Ready to test

Optional (for real emails):
□ EmailJS account created
□ Email service connected
□ Template created
□ Credentials added to .env
□ Dev server restarted
□ Real email received
```

---

**You're all set!** Choose your path and start testing! 🚀
