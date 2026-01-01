// EmailJS Configuration
// Sign up at https://www.emailjs.com/ to get your credentials

export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
}

// Check if EmailJS is configured
export const isEmailJSConfigured = () => {
  return (
    EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
    EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
  )
}

// Instructions to set up EmailJS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an email service (Gmail, Outlook, etc.)
// 3. Create an email template with these variables:
//    - {{to_email}} - Recipient email
//    - {{user_name}} - User's name
//    - {{otp}} - The OTP code
//    - {{expires_in}} - Expiration time
// 4. Get your Service ID, Template ID, and Public Key
// 5. Replace the values above with your actual credentials

// Example template:
/*
Hello {{user_name}},

Your OTP for password reset is: {{otp}}

This OTP will expire in {{expires_in}} minutes.

If you didn't request this, please ignore this email.

Best regards,
VisionAttend Team
*/
