# ✅ OTP System Testing Checklist

## Pre-Testing Setup

- [ ] Firestore rules deployed (see `DEPLOY_FIRESTORE_RULES_OTP.md`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser console open (F12)

## Test 1: Basic OTP Flow (Without EmailJS)

1. [ ] Go to Forgot Password page
2. [ ] Enter a valid email address
3. [ ] Click "Send OTP"
4. [ ] Check browser console - OTP should be displayed
5. [ ] Copy the OTP from console
6. [ ] Enter OTP in the form
7. [ ] Enter new password
8. [ ] Click "Reset Password"
9. [ ] Try logging in with new password

**Expected**: ✅ Password reset successful

## Test 2: OTP Expiration

1. [ ] Request an OTP
2. [ ] Wait 6 minutes
3. [ ] Try to use the OTP
4. [ ] Should see "OTP has expired" message

**Expected**: ✅ Expired OTP rejected

## Test 3: Invalid OTP

1. [ ] Request an OTP
2. [ ] Enter wrong OTP (e.g., 000000)
3. [ ] Should see "Invalid OTP" message

**Expected**: ✅ Invalid OTP rejected

## Test 4: Multiple OTP Requests

1. [ ] Request OTP for email A
2. [ ] Request OTP again for email A
3. [ ] Only the second OTP should work
4. [ ] First OTP should be invalid

**Expected**: ✅ Old OTP automatically deleted

## Test 5: With EmailJS (Optional)

### Setup
- [ ] EmailJS account created
- [ ] Service connected
- [ ] Template created
- [ ] Credentials added to `.env`
- [ ] Dev server restarted

### Testing
1. [ ] Go to Forgot Password page
2. [ ] Enter your real email
3. [ ] Click "Send OTP"
4. [ ] Check console for "✅ OTP email sent successfully"
5. [ ] Check your email inbox (and spam folder)
6. [ ] Use OTP from email to reset password

**Expected**: ✅ Real email received with OTP

## Test 6: Error Handling

1. [ ] Disconnect internet
2. [ ] Try to request OTP
3. [ ] Should see error message
4. [ ] Reconnect internet
5. [ ] Try again - should work

**Expected**: ✅ Graceful error handling

## Test 7: User Not Found

1. [ ] Enter email that doesn't exist in system
2. [ ] Try to request OTP
3. [ ] Should see "User not found" message

**Expected**: ✅ Proper error message

## Console Messages to Look For

### Development Mode (No EmailJS)
```
========================================
OTP EMAIL (Development Mode)
========================================
To: user@example.com
...
OTP: 123456
...
⚠️ EmailJS not configured
========================================
```

### Production Mode (With EmailJS)
```
✅ OTP email sent successfully to user@example.com
```

### Errors
```
❌ Error sending OTP email: [error details]
```

## Firestore Verification

1. [ ] Open Firebase Console
2. [ ] Go to Firestore Database
3. [ ] Check `otps` collection
4. [ ] Should see OTP documents with:
   - email
   - otp
   - expiresAt
   - createdAt
   - verified: false

## Security Checks

- [ ] OTP is 6 digits
- [ ] OTP expires after 5 minutes
- [ ] Old OTPs are deleted when new one is requested
- [ ] OTP is case-sensitive
- [ ] Email is case-insensitive (stored as lowercase)

## Performance Checks

- [ ] OTP generation is instant
- [ ] Email sending doesn't block UI
- [ ] Error messages are clear and helpful
- [ ] Loading states work properly

## Browser Compatibility

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Mobile Testing

- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Email opens on mobile
- [ ] OTP input is easy to use

## Production Readiness

- [ ] All tests pass
- [ ] No console errors
- [ ] EmailJS configured (or console logging acceptable)
- [ ] Firestore rules deployed
- [ ] Error handling works
- [ ] User experience is smooth

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Permission denied" | Deploy Firestore rules |
| OTP not in console | Check browser console (F12) |
| Email not received | Check spam, verify EmailJS setup |
| "Development Mode" message | Add EmailJS credentials to `.env` |
| OTP doesn't work | Check if expired (5 min limit) |

## Success Criteria

✅ Users can request OTP
✅ OTP is delivered (console or email)
✅ OTP verification works
✅ Password reset successful
✅ Expired OTPs rejected
✅ Invalid OTPs rejected
✅ Error messages are clear
✅ No console errors

---

**Status**: Ready for testing! 🚀

**Next Steps**:
1. Run through this checklist
2. Fix any issues found
3. Configure EmailJS for production
4. Deploy to production
