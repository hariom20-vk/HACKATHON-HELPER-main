# OTP Authentication Backend Documentation

## Overview
This documentation covers the OTP-based authentication backend for the Hackathon Helper application.

## API Endpoints

### 1. Send OTP Endpoint
**POST** `/api/auth/send-otp`

Sends an OTP to the user's email address.

#### Request
```json
{
  "email": "user@example.com"
}
```

#### Response
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "demoOtp": "123456"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Invalid email address"
}
```

#### Usage Example
```typescript
const response = await fetch("/api/auth/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com" })
});
const data = await response.json();
console.log(`OTP: ${data.demoOtp}`); // Development only
```

---

### 2. Verify OTP Endpoint
**POST** `/api/auth/verify-otp`

Verifies the OTP and creates a session for the user.

#### Request
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Response
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "sessionToken": "base64-encoded-token",
  "email": "user@example.com"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Invalid OTP. Please try again."
}
```

#### Features
- Session token returned in response body
- HTTP-only secure cookie set (sessionToken)
- OTP expires after 10 minutes
- OTP is automatically deleted after verification

#### Usage Example
```typescript
const response = await fetch("/api/auth/verify-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    email: "user@example.com",
    otp: "123456"
  })
});
const data = await response.json();
if (data.success) {
  // User is authenticated
  // Session token is in HTTP-only cookie
  window.location.href = "/dashboard";
}
```

---

### 3. Logout Endpoint
**POST** `/api/auth/logout`

Clears the user's session and logs them out.

#### Request
```json
{}
```

#### Response
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Usage Example
```typescript
const response = await fetch("/api/auth/logout", {
  method: "POST",
  headers: { "Content-Type": "application/json" }
});
const data = await response.json();
if (data.success) {
  window.location.href = "/login";
}
```

---

## Configuration

### Environment Variables
Add these to `.env.local`:

```bash
# OTP Settings
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# Email Service (for production)
# RESEND_API_KEY=your-resend-api-key
# SENDGRID_API_KEY=your-sendgrid-api-key
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password

# Session
SESSION_EXPIRY_HOURS=24
NODE_ENV=development
```

---

## Implementation Details

### OTP Storage
- **Current**: In-memory Map (for development)
- **Production**: Use Redis, Supabase, or MongoDB

### Session Management
- **Current**: In-memory Map (for development)
- **Production**: Use JWT, database sessions, or Redis

### Email Sending
- **Current**: Console logging only (development)
- **Production Options**:
  - **Resend**: Recommended (fastest setup)
  - **SendGrid**: Enterprise-grade
  - **Nodemailer**: Self-hosted SMTP
  - **Supabase Auth**: Built-in OTP support

---

## Sending Emails in Production

### Option 1: Using Resend (Recommended)
```bash
npm install resend
```

Update `app/api/auth/send-otp/route.ts`:
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// In the try block:
await resend.emails.send({
  from: "noreply@hackathon.app",
  to: email,
  subject: "Your Hackathon Helper OTP",
  html: `
    <h1>Your OTP: ${otp}</h1>
    <p>This OTP will expire in 10 minutes.</p>
  `,
});
```

### Option 2: Using SendGrid
```bash
npm install @sendgrid/mail
```

Update `app/api/auth/send-otp/route.ts`:
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

### Option 3: Using Nodemailer
```bash
npm install nodemailer
```

Update `app/api/auth/send-otp/route.ts`:
```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: "Your Hackathon Helper OTP",
  html: `<h1>Your OTP: ${otp}</h1>`,
});
```

---

## Database Integration

### Using Supabase
```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Store OTP
await supabase
  .from("otps")
  .insert([{ email, otp, expires_at: expiresAt }]);

// Verify OTP
const { data } = await supabase
  .from("otps")
  .select("*")
  .eq("email", email)
  .eq("otp", otp)
  .single();
```

### Using MongoDB
```typescript
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("hackathon");

// Store OTP
await db.collection("otps").insertOne({
  email,
  otp,
  expiresAt: new Date(expiresAt),
  createdAt: new Date(),
});

// Verify OTP
const stored = await db.collection("otps").findOne({ email, otp });
```

---

## Testing

### Test with cURL
```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP (replace with actual OTP from response)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json"
```

### Test with Postman
1. Create new collection "Hackathon Helper Auth"
2. Add POST request to `http://localhost:3000/api/auth/send-otp`
3. Set body to `{"email":"test@example.com"}`
4. Send and copy the `demoOtp` from response
5. Add POST request to verify OTP with the copied OTP code
6. Verify success response

---

## Security Considerations

### Current Development Setup
⚠️ **NOT for production**:
- OTP stored in-memory (lost on restart)
- Demo OTP exposed in API response
- No rate limiting
- No HTTPS enforcement

### Production Checklist
✅ **Before deploying**:
- [ ] Use database for OTP storage
- [ ] Remove `demoOtp` from API response
- [ ] Implement rate limiting
- [ ] Use real email service
- [ ] Enable HTTPS only
- [ ] Add CORS protection
- [ ] Implement request signing
- [ ] Add IP whitelisting
- [ ] Monitor suspicious activities
- [ ] Use secure random OTP generation
- [ ] Hash OTPs in database
- [ ] Log authentication attempts

---

## Debugging

### Common Issues

**"OTP not found"**
- OTP expired (expires after 10 minutes)
- Incorrect email used
- Solution: Request new OTP

**"Invalid OTP format"**
- OTP is not 6 digits
- OTP contains letters
- Solution: Enter exactly 6 digits

**"Failed to send OTP"**
- Email service not configured
- Network error
- Solution: Check logs, verify email provider

### Enable Debug Logging
Add to your code:
```typescript
console.log(`📧 OTP sent to ${email}: ${otp}`);
console.log(`✅ OTP verified for ${email}`);
```

---

## File Structure
```
app/
├── api/
│   └── auth/
│       ├── send-otp/
│       │   └── route.ts
│       ├── verify-otp/
│       │   └── route.ts
│       └── logout/
│           └── route.ts
├── login/
│   └── page.tsx (updated with API calls)
├── dashboard/
│   └── page.tsx
├── layout.tsx
└── globals.css

lib/
├── supabaseClient.js
└── auth.ts (optional - auth utilities)

.env.local (updated)
```

---

## Next Steps

1. **Add Email Service**: Integrate Resend, SendGrid, or Nodemailer
2. **Add Database**: Store sessions and OTPs in Supabase/MongoDB
3. **Add Rate Limiting**: Prevent brute force attacks
4. **Add Middleware**: Protect dashboard routes
5. **Add 2FA**: Additional security layer
6. **Add Social Login**: Google, GitHub integration

---

## Support
For issues or questions, check the logs in:
- Browser Console (F12)
- Terminal where `npm run dev` is running
- Network tab in DevTools (F12 → Network)

