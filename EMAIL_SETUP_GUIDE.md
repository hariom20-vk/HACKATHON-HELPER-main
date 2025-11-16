# 📧 Setting Up Email OTP - Quick Guide

## Option 1: Resend (Recommended - Easiest)

### Step 1: Create Free Account
1. Go to https://resend.com
2. Sign up with your email (takes 2 minutes)
3. Verify your email

### Step 2: Get API Key
1. Go to https://resend.com/api-keys
2. Copy your API key
3. It should look like: `re_xxxxxxxxxxxxxxxxxxxx`

### Step 3: Add to `.env.local`
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

### Step 4: Restart Dev Server
```bash
# Press Ctrl+C to stop current server
npm run dev
```

### Step 5: Test It!
1. Go to http://localhost:3000/login (or http://localhost:3001 if port 3000 is busy)
2. Enter your email
3. Click "Send OTP"
4. **Check your email inbox** - OTP should arrive in seconds!
5. Enter the OTP to login

---

## Option 2: Gmail (Free - Using App Password)

### Step 1: Enable 2FA on Gmail
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go back to Security settings
2. Find "App passwords" (appears after 2FA is enabled)
3. Select "Mail" and "Windows Computer"
4. Google will generate a 16-character password
5. Copy this password

### Step 3: Install Nodemailer
```bash
npm install nodemailer
```

### Step 4: Update Code
Replace the Resend code in `app/api/auth/send-otp/route.ts` with:

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// In the POST function, replace Resend with:
await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: "Your Hackathon Helper OTP",
  html: `<h1>Your OTP: ${otp}</h1><p>Expires in 10 minutes</p>`,
});
```

### Step 5: Add to `.env.local`
```bash
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char app password
```

---

## Option 3: SendGrid

### Step 1: Sign Up
1. Go to https://sendgrid.com
2. Create free account

### Step 2: Create API Key
1. Go to Settings → API Keys
2. Create new API key
3. Copy it

### Step 3: Install Package
```bash
npm install @sendgrid/mail
```

### Step 4: Update Code
Replace Resend with:
```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: email,
  from: "noreply@hackathon.app",
  subject: "Your Hackathon Helper OTP",
  html: `<h1>Your OTP: ${otp}</h1>`,
});
```

### Step 5: Add to `.env.local`
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
```

---

## Troubleshooting

### "OTP not received"
✓ Check spam folder
✓ Wait 5 seconds (sometimes delayed)
✓ Check API key is correct
✓ Check .env.local is saved
✓ Restart dev server

### "RESEND_API_KEY is undefined"
✓ Make sure you added it to `.env.local`
✓ Restart `npm run dev`
✓ Hard refresh browser (Ctrl+Shift+R)

### "Email not sending but no error"
✓ Check server console for error messages
✓ Verify API key is valid
✓ Check email format is correct

### "Getting CORS error"
✓ This shouldn't happen for server-side endpoints
✓ Check browser console for actual error
✓ Look at server terminal for real error

---

## Testing Without Real Email

### Use Console OTP
If you don't want to set up email yet:
1. Don't set `RESEND_API_KEY`
2. Server will log OTP to console
3. Copy OTP from terminal output
4. Paste into login form

### Use Test Email
Many services support test emails:
- **Resend**: Use `delivered@resend.dev` in development
- **SendGrid**: Has sandbox mode
- **Gmail**: Use your own email for testing

---

## Production Deployment

Before deploying to production:

1. ✅ Add real API key to your hosting provider's environment variables
2. ✅ Update `from` email address to your domain
3. ✅ Remove or hide `demoOtp` from API response
4. ✅ Enable HTTPS
5. ✅ Add email rate limiting
6. ✅ Monitor email delivery

---

## File Locations

- **API Route**: `app/api/auth/send-otp/route.ts`
- **Environment**: `.env.local`
- **Login Page**: `app/login/page.tsx`
- **Documentation**: `BACKEND_DOCS.md`

---

## Questions?

Check:
1. Browser console (F12)
2. Server terminal
3. Network tab (F12 → Network → send-otp)
4. `BACKEND_DOCS.md` for detailed info

Good luck! 🚀
