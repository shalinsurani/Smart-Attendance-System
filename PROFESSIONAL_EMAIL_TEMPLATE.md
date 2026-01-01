# 📧 Professional Email Template for EmailJS

## 🎯 The Issue

The email is being sent but it's empty because the EmailJS template content is not configured properly.

## ✅ How to Fix

### Step 1: Go to EmailJS Dashboard

1. Open: https://dashboard.emailjs.com/
2. Click **"Email Templates"** in left sidebar
3. Find template: **`template_ajg3gzz`**
4. Click **"Edit"**

### Step 2: Configure Template Settings

At the top of the template editor, set these fields:

```
Template Name: Password Reset OTP
To Email: {{to_email}}
From Name: VisionAttend
Subject: Password Reset Request - VisionAttend
Reply To: (your email address)
```

### Step 3: Copy This Professional Template

**Replace the entire template content with this:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                                🔐 Password Reset Request
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hello <strong>{{user_name}}</strong>,
                            </p>
                            
                            <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                                We received a request to reset your password for your VisionAttend account. Use the One-Time Password (OTP) below to complete the process:
                            </p>
                            
                            <!-- OTP Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px; display: inline-block;">
                                            <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
                                                Your OTP Code
                                            </p>
                                            <p style="color: #ffffff; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                {{otp}}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Expiration Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 15px 20px;">
                                        <p style="color: #856404; font-size: 14px; margin: 0;">
                                            ⏰ <strong>Important:</strong> This OTP will expire in <strong>{{expires_in}} minutes</strong>. Please use it promptly.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 4px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                                            <strong>🔒 Security Tips:</strong>
                                        </p>
                                        <ul style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                            <li>Never share this OTP with anyone</li>
                                            <li>VisionAttend staff will never ask for your OTP</li>
                                            <li>If you didn't request this, please ignore this email</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="color: #999999; font-size: 13px; margin: 0 0 10px 0;">
                                Best regards,<br>
                                <strong style="color: #667eea;">VisionAttend Team</strong>
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                                This is an automated message, please do not reply to this email.
                            </p>
                            <p style="color: #cccccc; font-size: 11px; margin: 15px 0 0 0;">
                                © 2025 VisionAttend. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

### Step 4: Save the Template

1. Click **"Save"** button
2. Wait for "Template saved successfully" message

### Step 5: Test Again

1. Go back to your app
2. Refresh the page (Ctrl+R)
3. Try forgot password
4. Check your email - it should look professional now!

## 📧 What the Email Will Look Like

The email will have:

✅ **Professional Header** with gradient background
✅ **Personalized Greeting** with user's name
✅ **Large, Clear OTP** in a highlighted box
✅ **Expiration Warning** with time remaining
✅ **Security Tips** to protect users
✅ **Professional Footer** with branding
✅ **Responsive Design** that works on mobile

## 🎨 Features

- **Modern Design**: Gradient colors and clean layout
- **Mobile Responsive**: Looks great on all devices
- **Clear OTP Display**: Large, easy-to-read code
- **Security Focused**: Includes safety tips
- **Professional Branding**: VisionAttend logo and colors
- **User-Friendly**: Clear instructions and warnings

## 📋 Template Variables Used

The template uses these variables (automatically filled by your code):

- `{{to_email}}` - Recipient's email address
- `{{user_name}}` - User's name
- `{{otp}}` - 6-digit OTP code
- `{{expires_in}}` - Expiration time (5 minutes)

## ✅ Checklist

- [ ] Opened EmailJS dashboard
- [ ] Found template `template_ajg3gzz`
- [ ] Clicked "Edit"
- [ ] Set "To Email" to `{{to_email}}`
- [ ] Set Subject to "Password Reset Request - VisionAttend"
- [ ] Copied the HTML template above
- [ ] Pasted into template content area
- [ ] Clicked "Save"
- [ ] Tested forgot password
- [ ] Received professional email!

---

**Copy the HTML template above into your EmailJS template editor and save!** 🎨
