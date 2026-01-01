# 🚨 URGENT: Fix EmailJS Template - "Recipient's Address is Empty"

## ❌ The Error

```
EmailResponseStatus {status: 422, text: "The recipient's address is empty"}
```

This means your EmailJS template is missing the recipient email configuration.

## ✅ How to Fix (2 Minutes)

### Step 1: Go to EmailJS Dashboard

1. Open: https://dashboard.emailjs.com/
2. Log in to your account

### Step 2: Edit Your Template

1. Click **"Email Templates"** in the left sidebar
2. Find template ID: **`template_ajg3gzz`**
3. Click **"Edit"** button

### Step 3: Fix the "To Email" Field

**THIS IS THE CRITICAL PART:**

1. Look for the **"To Email"** field at the top of the template editor
2. It's probably empty or has a hardcoded email
3. **Change it to**: `{{to_email}}`
4. Make sure there are NO spaces, NO quotes, just: `{{to_email}}`

### Step 4: Verify Template Content

Make sure your template body looks like this:

```
Hello {{user_name}},

Your OTP for password reset is: {{otp}}

This OTP will expire in {{expires_in}} minutes.

If you didn't request this, please ignore this email.

Best regards,
VisionAttend Team
```

### Step 5: Save the Template

1. Click **"Save"** button
2. Wait for "Template saved successfully" message

### Step 6: Test Again

1. Go back to your app
2. Refresh the page (Ctrl+R)
3. Try forgot password again
4. **You should receive the email!**

## 📸 Visual Guide

### What the Template Editor Should Look Like:

```
┌─────────────────────────────────────────┐
│ Template Settings                       │
├─────────────────────────────────────────┤
│                                         │
│ Template Name: OTP Password Reset       │
│                                         │
│ To Email: {{to_email}}  ← MUST BE THIS! │
│                                         │
│ From Name: VisionAttend                 │
│                                         │
│ From Email: your-email@gmail.com        │
│                                         │
│ Subject: Password Reset OTP             │
│                                         │
├─────────────────────────────────────────┤
│ Template Content:                       │
│                                         │
│ Hello {{user_name}},                    │
│                                         │
│ Your OTP is: {{otp}}                    │
│                                         │
│ Expires in {{expires_in}} minutes.      │
│                                         │
└─────────────────────────────────────────┘
```

## 🎯 Key Points

### ✅ Correct:
```
To Email: {{to_email}}
```

### ❌ Wrong:
```
To Email: (empty)
To Email: shalinsurani2003@gmail.com
To Email: {{ to_email }}  (spaces inside)
To Email: {to_email}  (single braces)
```

## 🔍 After Fixing

### Console Output (Success):
```
📧 Attempting to send email via EmailJS...
Service ID: service_fyvi50a
Template ID: template_ajg3gzz
✅ OTP email sent successfully to shalinsurani2003@gmail.com
EmailJS Response: {status: 200, text: 'OK'}
```

### You'll Receive Email:
- Check inbox
- Check spam folder
- Should arrive within 30 seconds

## 📋 Complete Template Configuration

Copy this exact configuration:

**Template Settings:**
- **Template Name**: OTP Password Reset
- **To Email**: `{{to_email}}`
- **From Name**: VisionAttend
- **From Email**: (your connected Gmail)
- **Reply To**: (your connected Gmail)
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

## 🚨 Common Mistakes

1. **Leaving "To Email" empty** ← This is your current issue
2. Putting a hardcoded email in "To Email"
3. Adding spaces inside the curly braces
4. Using single braces instead of double
5. Misspelling the variable name

## ✅ Checklist

- [ ] Logged into EmailJS dashboard
- [ ] Found template `template_ajg3gzz`
- [ ] Clicked "Edit"
- [ ] Set "To Email" to `{{to_email}}`
- [ ] Verified no spaces in `{{to_email}}`
- [ ] Added all required variables in body
- [ ] Clicked "Save"
- [ ] Saw "Template saved successfully"
- [ ] Refreshed app page
- [ ] Tested forgot password
- [ ] Received email!

---

**Fix the "To Email" field in EmailJS dashboard and you'll receive emails!** 🚀

The code is working perfectly - it's just a template configuration issue.
