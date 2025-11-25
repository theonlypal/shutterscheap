# Google Analytics 4 Setup Instructions

## What We Added
Google Analytics 4 (GA4) tracking code has been added to all pages of your website:
- ✅ index.html
- ✅ shutters.html
- ✅ blinds.html
- ✅ solar-screens.html
- ✅ gallery.html
- ✅ dashboard.html

## What You Need To Do (5 minutes)

### Step 1: Get Your Google Analytics Measurement ID

1. Go to **https://analytics.google.com**
2. Sign in with your Google account (the one setup for Google Ads/Business Profile)
3. Click **"Admin"** (gear icon in bottom left)
4. Under "Account," make sure your business account is selected
5. Under "Property," click **"+ Create Property"**
6. Enter these details:
   - **Property name:** Shutters Cheap Website
   - **Time zone:** (GMT-08:00) Pacific Time
   - **Currency:** US Dollar
7. Click **"Next"** and fill out business information
8. Click **"Create"** and accept the terms
9. Choose **"Web"** as the platform
10. Set up data stream:
    - **Website URL:** https://shutterscheap.com
    - **Stream name:** Shutters Cheap Website
11. Click **"Create stream"**

### Step 2: Copy Your Measurement ID

After creating the stream, you'll see a **"Measurement ID"** that looks like:
```
G-XXXXXXXXXX
```
(It starts with "G-" followed by 10 characters)

**Copy this entire ID!**

### Step 3: Replace the Placeholder in Your Website Files

You need to replace `G-XXXXXXXXXX` with your real Measurement ID in 6 files.

**Option A - Using Find & Replace (Easiest):**
1. Open VS Code or your code editor
2. Press `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows) to open "Find in Files"
3. In "Find" box, type: `G-XXXXXXXXXX`
4. In "Replace" box, paste your real Measurement ID (e.g., `G-ABC1234567`)
5. Click **"Replace All"**
6. Save all files

**Option B - Manual Edit:**
Edit each file and replace `G-XXXXXXXXXX` in these 2 places:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```
and
```javascript
gtag('config', 'G-XXXXXXXXXX');
```

Files to edit:
- index.html
- shutters.html
- blinds.html
- solar-screens.html
- gallery.html
- dashboard.html

### Step 4: Deploy to Vercel

After replacing the ID in all files:

```bash
git add -A
git commit -m "Add Google Analytics 4 tracking"
git push origin main
npx vercel --prod
```

### Step 5: Test It's Working

1. Visit your live website: https://shutterscheap.com
2. Go back to Google Analytics dashboard
3. Click **"Reports"** → **"Realtime"**
4. You should see yourself as an active user!

## What You'll See in Google Analytics

Once setup, you'll get real analytics including:

### Real-Time Data
- Active users right now
- Page views in last 30 minutes
- Where visitors are coming from

### User Metrics
- Total users (unique visitors)
- New vs returning users
- Average session duration
- Pages per session

### Traffic Sources
- How people found your site (Google, direct, social, ads)
- Which keywords they used
- Which pages they visited

### Behavior
- Most viewed pages
- Bounce rate
- Exit pages
- Time on page

### Demographics
- Age ranges
- Gender
- Interests
- Geographic location

### Conversions
- Form submissions (we can setup)
- Phone clicks
- Button clicks

## Important Notes

✅ **Keeps your existing localStorage dashboard** - Both will work together
✅ **GDPR/CCPA compliant** - Google Analytics respects user privacy settings
✅ **Free forever** - No cost for standard Google Analytics
✅ **Works with Google Ads** - Can track ad performance if you run ads later

## Need Help?

If you need assistance:
1. Check out Google's setup guide: https://support.google.com/analytics/answer/9304153
2. Or let me know and I can help troubleshoot!

## What's Different from localStorage Analytics?

| Feature | localStorage (Current) | Google Analytics 4 |
|---------|----------------------|-------------------|
| Tracks visitors | ❌ Only your browser | ✅ All visitors |
| Cross-device | ❌ No | ✅ Yes |
| Data persistence | ❌ Clears with browser | ✅ Permanent |
| Traffic sources | ❌ No | ✅ Yes (Google, social, direct) |
| Real-time | ❌ No | ✅ Yes |
| Demographics | ❌ No | ✅ Yes (age, location) |
| Conversion tracking | ❌ No | ✅ Yes |
| Historical data | ❌ Limited | ✅ 14 months+ |

Both will work together - keep your localStorage dashboard for quick checks, use Google Analytics for real business insights!
