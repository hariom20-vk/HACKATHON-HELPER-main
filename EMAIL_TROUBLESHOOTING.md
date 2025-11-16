# 🔧 Email Not Sending - Troubleshooting Guide

## Checklist

### 1. ✅ Verify API Key is Set
```bash
# Check .env.local file
cat .env.local | grep RESEND_API_KEY
```

Should show: `RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx`

**Issue:** Key is empty or placeholder?
- Go to https://resend.com/api-keys
- Copy your actual API key
- Update `.env.local`

### 2. ✅ Restart Dev Server After Adding Key
```bash
# Kill current server
# Press Ctrl+C in terminal

# Start fresh
npm run dev
```

**Why?** Environment variables are only loaded on server startup.

### 3. ✅ Check API Key is Valid
Your API key should:
- Start with `re_`
- Be 40+ characters long
- Be from https://resend.com (not another service)

### 4. ✅ Test Email via API
Check the browser console for the actual error:
1. Open http://localhost:3000/login
2. Press F12 to open DevTools
3. Go to Network tab
4. Enter email and click "Send OTP"
5. Click on `send-otp` request
6. Check Response tab for error details

---

## Common Issues & Fixes

### Issue: "RESEND_API_KEY not configured"

**Cause:** Environment variable not loaded

**Fix:**
```bash
# 1. Make sure .env.local has the key
cat .env.local

# 2. Restart dev server
# Press Ctrl+C
npm run dev

# 3. Hard refresh browser
# Ctrl+Shift+R (Chrome/Firefox) or Cmd+Shift+R (Mac)
```

---

### Issue: "Invalid API key"

**Cause:** API key is wrong or expired

**Fix:**
1. Go to https://resend.com/api-keys
2. Delete old key (if any)
3. Create new key
4. Copy entire key (including `re_` prefix)
5. Update `.env.local`:
   ```bash
   RESEND_API_KEY=re_your_new_key_here
   ```
6. Restart server

---

### Issue: Email sent but not received

**Cause:** Email might be in spam, or using test address

**Possible Fixes:**

a) **Check spam folder** ✉️
- Some emails go to spam
- Mark as "Not Spam"

b) **Use Resend test address** 🧪
- In development, use: `delivered@resend.dev`
- This is guaranteed to work
- Great for testing!

c) **Check email format** 📧
- Make sure email looks valid: `user@example.com`
- Some emails might be rejected

---

### Issue: "Failed to send email" but no specific error

**Cause:** Network or service issue

**Fix:**
1. Check terminal for error details:
   ```bash
   # Look for: ❌ Failed to send email with Resend:
   ```
2. Common reasons:
   - Resend service down (rare)
   - Network connectivity issue
   - API quota exceeded (free tier: 100/day)

---

## Debug Steps

### Step 1: Check Terminal Logs
When you click "Send OTP", look for these messages:

✅ **Expected output:**
```
📧 OTP generated for user@example.com: 123456
🔑 RESEND_API_KEY configured: YES
📤 Attempting to send email via Resend...
✅ Email sent successfully to user@example.com: { id: '...', from: '...' }
```

❌ **If you see:**
```
🔑 RESEND_API_KEY configured: NO
```
→ Restart server after adding key to `.env.local`

---

### Step 2: Check Browser Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Send OTP"
4. Find `send-otp` request
5. Click it and check:

**Response tab** should show:
```json
{
  "success": true,
  "message": "OTP sent to user@example.com. Check your email!",
  "demoOtp": "123456"
}
```

If you see error, it will show in the message field.

---

### Step 3: Verify Email Format

Make sure:
- Email has `@` symbol
- Has domain (`.com`, `.io`, etc.)
- No spaces before/after
- Example: ✅ `user@example.com` ❌ `user @example.com`

---

## Manual Testing

### Method 1: Using Test Address (Recommended)

Test with Resend's test address - **always works**:

```
Email: delivered@resend.dev
OTP: any 6 digits (123456)
```

This is perfect for testing without real emails!

---

### Method 2: Using Terminal/cURL

```bash
# Test from terminal
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

Look for response with `demoOtp` value.

---

### Method 3: Check Resend Dashboard

1. Go to https://resend.com/dashboard
2. Login with your account
3. Go to "Emails" section
4. You should see your sent email with status:
   - ✅ Sent
   - ⏳ Queued
   - ❌ Failed (if there's an issue)

---

## Production Tips

### Before Going Live:

1. ✅ **Verify sending from your domain**
   - Don't use `onboarding@resend.dev`
   - Use your company domain
   - Requires DNS setup in Resend

2. ✅ **Add rate limiting**
   - Prevent abuse
   - Example: 1 OTP per email per minute

3. ✅ **Monitor deliverability**
   - Check bounce rates
   - Monitor spam complaints
   - Resend provides analytics

4. ✅ **Handle failures gracefully**
   - Fallback if email fails
   - Show user a manual OTP option
   - Log all attempts

---

## Still Not Working?

### Collect Debug Info:

1. **API Key status:**
   ```bash
   echo "API Key first 10 chars:"
   echo $RESEND_API_KEY | cut -c1-10
   ```

2. **Terminal output:**
   - Copy full error message
   - Share the timestamp

3. **Browser console:**
   - Any errors in F12 console?
   - Network request details?

---

## Support Resources

- **Resend Docs:** https://resend.com/docs
- **Resend Status:** https://status.resend.com
- **Resend Support:** https://resend.com/support
- **GitHub Issues:** Check for similar problems

---

## Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Not configured | Restart server with Ctrl+C then `npm run dev` |
| Invalid key | Get new key from https://resend.com/api-keys |
| Email in spam | Check spam folder, mark as not spam |
| No email received | Use `delivered@resend.dev` for testing |
| API error | Check terminal for error details |
| Still failing | Verify key is correct, restart, hard refresh |

---

## Example Working Flow

```
1. User enters: user@example.com
2. Click "Send OTP"
3. Backend generates: 482957
4. Resend sends email
5. Email arrives in ~2 seconds
6. User enters: 482957
7. Backend verifies
8. User logged in ✅
```

---

Ready to test? 🚀

Go to http://localhost:3000/login and try it!
