# Deployment Instructions for VA-08 Voting Tool

Follow these steps in order to deploy your voting tool to Vercel with automatic deployments from GitHub.

---

## Prerequisites

You'll need accounts for:
- GitHub (you already have this)
- Vercel (free tier - sign up with GitHub)
- Umami Cloud (free tier - for analytics)
- TinyURL or short.io (free - for short link)

---

## Step 1: Create GitHub Repository

### 1.1 Initialize Git Repository Locally

Open Terminal and run:

```bash
cd /Users/alex/Desktop/Claude/vote08
git init
git add .
git commit -m "Initial commit: VA-08 voting tool"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `vote08`
3. Description: "Nonpartisan voting resource for Virginia's 8th Congressional District"
4. Make it **Public** (so it's accessible and trustworthy)
5. **Do NOT** initialize with README, .gitignore, or license (we already have files)
6. Click "Create repository"

### 1.3 Push to GitHub

Copy the commands from GitHub's "push an existing repository" section. It will look like:

```bash
git remote add origin https://github.com/AlexanderCordova/vote08.git
git branch -M main
git push -u origin main
```

Run those commands in your Terminal.

**✓ Checkpoint:** Visit your GitHub repo URL. You should see all your files.

---

## Step 2: Deploy to Vercel (One-Time Setup)

### 2.1 Sign Up for Vercel

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Sign in with your GitHub account
4. Authorize Vercel to access your repositories

### 2.2 Import Your Project

1. After signing in, you'll see the Vercel dashboard
2. Click "Add New..." → "Project"
3. Find and select the `vote08` repository from the list
4. Click "Import"

### 2.3 Configure Project Settings

On the import screen:

- **Project Name**: `vote08` (or leave default)
- **Framework Preset**: Leave as "Other" or "Static HTML"
- **Root Directory**: `.` (default, don't change)
- **Build Command**: Leave empty (it's a static site)
- **Output Directory**: `.` (default, don't change)
- **Install Command**: Leave empty

Click "Deploy"

### 2.4 Wait for Deployment

Vercel will:
- Clone your repository
- Deploy your files
- Give you a live URL

This takes about 30-60 seconds.

### 2.5 Get Your Live URL

Once deployed, you'll see:
- **Production URL**: Something like `vote08.vercel.app` or `vote08-alexs-projects.vercel.app`
- Click "Visit" to see your live site

**✓ Checkpoint:** Your site is now live! Test it at your Vercel URL.

---

## Step 3: Set Up Custom Domain (Optional)

If you want a cleaner Vercel URL:

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Under "Production Domains", you can:
   - Add a custom domain (if you buy one)
   - Or use the default `vote08.vercel.app` (if it's available)

If `vote08.vercel.app` is taken, Vercel assigns `vote08-username.vercel.app`. This is fine.

---

## Step 4: Create Short Link & QR Code

### 4.1 Create Short Link

**Option A: TinyURL (No account needed)**
1. Go to https://tinyurl.com/
2. Paste your Vercel URL (e.g., `https://vote08.vercel.app`)
3. Click "Make TinyURL"
4. Copy your short link (e.g., `tinyurl.com/va08vote`)

**Option B: Short.io (Account needed, more features)**
1. Sign up at https://short.io/ (free tier: 1,000 links/month)
2. Create a new short link
3. Paste your Vercel URL
4. Customize the slug (e.g., `go.short.io/va08`)
5. Copy your short link

**Save this short link** - you'll need it for the next steps.

### 4.2 Generate QR Code

1. Go to https://www.qr-code-generator.com/
2. Select "URL" type
3. Paste your **short link** (not your Vercel URL - use the short link for easier scanning)
4. Customize (optional):
   - Frame: "No frame" or simple frame
   - Shape: Square or rounded (your preference)
   - Color: Consider using your brand colors (#1B2A4A navy)
5. Click "Download" → PNG format
6. Download at least 1000x1000px resolution

**Save the QR code as:**
```
/Users/alex/Desktop/Claude/vote08/assets/qr-code.png
```

### 4.3 Update Site with Short Link

1. Open `/Users/alex/Desktop/Claude/vote08/index.html` in a text editor
2. Find line 141 (the QR placeholder section)
3. Replace the placeholder content with:

```html
<div class="qr-placeholder" id="qrCode">
    <img src="assets/qr-code.png" alt="QR code for vote08 tool" style="max-width: 200px; border-radius: 8px;">
    <p class="short-link" id="shortLink">tinyurl.com/va08vote</p>
</div>
```

(Replace `tinyurl.com/va08vote` with your actual short link)

4. Save the file
5. Push to GitHub:

```bash
cd /Users/alex/Desktop/Claude/vote08
git add .
git commit -m "Add QR code and update short link"
git push
```

Vercel will automatically redeploy in about 30 seconds.

**✓ Checkpoint:** Visit your site and verify the QR code and short link appear correctly.

---

## Step 5: Set Up Analytics (Umami Cloud)

### 5.1 Create Umami Account

1. Go to https://cloud.umami.is/signup
2. Sign up for a free account
3. Verify your email

### 5.2 Add Your Website

1. Log in to Umami dashboard
2. Click "Add website"
3. Name: `VA-08 Voting Tool`
4. Domain: Your Vercel URL (e.g., `vote08.vercel.app`)
5. Timezone: `America/New_York` (Eastern Time)
6. Click "Save"

### 5.3 Get Your Website ID

1. After creating the website, click on it
2. Go to "Settings" → "Tracking code"
3. You'll see code that looks like:

```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="YOUR-UNIQUE-ID-HERE"></script>
```

4. **Copy the ID** (it's a long string like `abc123def-456-789-ghi-jklmno`)

### 5.4 Add Analytics to Your Site

1. Open `/Users/alex/Desktop/Claude/vote08/index.html`
2. Find line 21 (the commented-out Umami script):

```html
<!-- Umami Analytics (will be configured after deployment) -->
<!-- <script defer src="https://cloud.umami.is/script.js" data-website-id="YOUR_WEBSITE_ID"></script> -->
```

3. Uncomment it and replace `YOUR_WEBSITE_ID` with your actual ID:

```html
<!-- Umami Analytics -->
<script defer src="https://cloud.umami.is/script.js" data-website-id="abc123def-456-789-ghi-jklmno"></script>
```

4. Save and push to GitHub:

```bash
cd /Users/alex/Desktop/Claude/vote08
git add index.html
git commit -m "Enable Umami analytics"
git push
```

Vercel will auto-deploy.

### 5.5 Verify Analytics

1. Visit your live site
2. Click around (try the action buttons)
3. Go back to Umami dashboard
4. You should see your visit appear within a few seconds

**✓ Checkpoint:** Analytics are working! You can now track page views and button clicks.

---

## Step 6: Verify Everything Works

Test these features on your live site:

### ✓ Essential Features
- [ ] Page loads correctly
- [ ] Countdown timer shows correct days remaining
- [ ] Map loads and displays markers
- [ ] Click a map marker - popup appears
- [ ] Click a location in the list - map pans to it
- [ ] All action buttons work (open Vote.org, VA portal, etc.)
- [ ] QR code displays
- [ ] Short link is correct

### ✓ Interactive Features
- [ ] Click "I'll be away" path - modal opens
- [ ] Click "I'll be at address" path - modal opens
- [ ] Generate "I'm voting" card - image appears
- [ ] Download card - PNG file downloads
- [ ] Copy link button - copies URL to clipboard
- [ ] Copy toolkit message - copies text to clipboard

### ✓ Mobile Testing
- [ ] Open site on your phone
- [ ] All text is readable
- [ ] Buttons are tappable (not too small)
- [ ] Map works on mobile
- [ ] No horizontal scrolling

### ✓ Analytics
- [ ] Visit Umami dashboard
- [ ] Confirm page views are being tracked
- [ ] Click an action button, check if event appears in Umami

---

## Step 7: How to Make Updates Later

### Editing Location Data

1. Open `/Users/alex/Desktop/Claude/vote08/locations.json`
2. Edit addresses, hours, or coordinates
3. Save the file
4. Push to GitHub:

```bash
cd /Users/alex/Desktop/Claude/vote08
git add locations.json
git commit -m "Update voting location hours"
git push
```

Vercel will auto-deploy in 30 seconds. **That's it.**

### Editing Page Content

1. Open the relevant file:
   - `index.html` for content and structure
   - `styles.css` for colors and design
   - `script.js` for interactive features
2. Make your changes
3. Save and push:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Vercel auto-deploys. No manual steps needed.

---

## Step 8: Sharing the Tool

### Where to Share

**Social Media:**
- Post the short link on Instagram, Twitter, Facebook
- Use the generated "I'm voting" card as the image
- Include UTM parameters to track sources:
  - Instagram: `tinyurl.com/va08vote?utm_source=instagram`
  - Twitter: `tinyurl.com/va08vote?utm_source=twitter`
  - Campaign account: `tinyurl.com/va08vote?utm_source=campaign_ig`

**Organizations:**
- Share the toolkit message (in the Share section of the site)
- Provide the QR code for printed materials
- Encourage other student orgs to share

**In Person:**
- Print QR codes on flyers, business cards, canvassing materials
- Include on literature for door-to-door outreach
- Display at campus events

---

## Quick Reference: URLs & Credentials

**Live Site:**
- Vercel URL: `https://vote08.vercel.app` (or your actual URL)
- Short link: `tinyurl.com/va08vote` (or your actual short link)

**Dashboards:**
- Vercel: https://vercel.com/dashboard
- Umami Analytics: https://cloud.umami.is/
- GitHub Repo: https://github.com/AlexanderCordova/vote08

**Updating Content:**
```bash
cd /Users/alex/Desktop/Claude/vote08
# Edit files...
git add .
git commit -m "Description of changes"
git push
# Vercel auto-deploys!
```

---

## Troubleshooting

**Site not updating after push?**
- Check Vercel dashboard for deployment status
- Look for build errors in deployment logs
- Wait 60 seconds and hard refresh (Cmd+Shift+R)

**Map not loading?**
- Check browser console for errors (right-click → Inspect → Console)
- Verify locations.json is valid JSON (use jsonlint.com)
- Check internet connection (map tiles load from external source)

**Analytics not tracking?**
- Verify script tag has correct website ID
- Check browser isn't blocking scripts (disable ad blockers for testing)
- Visit Umami dashboard → Settings → Check that domain is correct

**QR code not displaying?**
- Verify file path is correct: `assets/qr-code.png`
- Check file was committed to git: `git status`
- Clear browser cache and hard refresh

---

## Support Resources

**Official Voting Info:**
- Virginia Dept. of Elections: https://www.elections.virginia.gov/
- Alexandria: https://www.alexandriava.gov/Elections
- Fairfax: https://www.fairfaxcounty.gov/elections/
- Arlington: https://vote.arlingtonva.gov/

**Technical Resources:**
- Vercel Docs: https://vercel.com/docs
- MapLibre GL JS Docs: https://maplibre.org/maplibre-gl-js/docs/
- Umami Docs: https://umami.is/docs

**Need Help?**
- Check GitHub Issues for the project
- Review official documentation for each service
- Test in incognito mode to rule out browser extensions

---

**Congratulations!** Your VA-08 voting tool is live and ready to help voters. 🗳️

Remember to monitor analytics weekly to see which channels are driving traffic, and update location data if anything changes before Election Day.
