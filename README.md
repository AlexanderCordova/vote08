# VA-08 How to Vote Tool

A nonpartisan voting resource for Virginia's 8th Congressional District Democratic Primary (August 4, 2026).

## Overview

This tool helps VA-08 voters:
- Find early voting locations with an interactive map
- Check voter registration status
- Request absentee ballots
- Understand key deadlines
- Share voting information with others

**Target Audience:** College students (many away from home for summer) and general VA-08 voters.

**Coverage Area:** Arlington County, City of Alexandria, City of Falls Church, and eastern Fairfax County.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Map**: MapLibre GL JS with OpenFreeMap tiles (no API key required)
- **Analytics**: Umami Cloud (privacy-respecting, no cookies)
- **Hosting**: Vercel with auto-deploy from GitHub

## Project Structure

```
vote08/
├── index.html              # Main page with all sections
├── styles.css              # Complete design system
├── script.js               # Interactive features & map
├── locations.json          # Voting location data (easy to edit)
├── assets/
│   └── ballot-marker.svg   # Custom map marker icon
└── README.md               # This file
```

## Key Features

### 1. Deadline Tracker
- Countdown to Election Day
- Ballot-stub visual design (perforated edge effect)
- All key dates displayed prominently
- Includes info about same-day registration

### 2. Interactive Map
- MapLibre GL JS with custom ballot-box markers
- Click markers to see location details and get directions
- Synced with scrollable location list
- Mobile-responsive

### 3. Voter Path Selection
- Two paths: "away from address" vs. "at address"
- Modal popups with specific guidance for each path
- Direct links to action tools

### 4. Action Buttons
- Check registration (Vote.org)
- Request absentee ballot (Vote.org)
- Register to vote (Virginia Citizen Portal)
- Custom-styled buttons with analytics tracking

### 5. Share Tools
- Generate "I'm voting" social media card (canvas-based)
- QR code placeholder (add after deployment)
- Copy-paste toolkit for organizations

### 6. Privacy-Respecting Analytics
- Umami Cloud integration (ready to configure)
- Tracks page views, referral sources, button clicks
- No cookies, no personal data collection

## Design System

### Color Palette
- **Navy** (`#1B2A4A`): Primary color, authoritative
- **Brass** (`#C9A227`): Accent color, warm and distinctive
- **Warm White** (`#FAF9F6`): Background
- **Charcoal** (`#2B2B2B`): Text

### Typography
- **Headlines**: Roboto Slab (slab serif, structured)
- **Body/UI**: Inter (humanist sans, readable)

### Design Goals
- Professional and trustworthy
- Avoids AI-generated design clichés
- Mobile-first responsive design
- Accessibility: keyboard focus, alt text, reduced motion support

## Data Management

### Editing Location Data

All voting location data is stored in `locations.json`. To update:

1. Open `locations.json` in a text editor
2. Edit the relevant fields:
   - `name`: Location name
   - `address`: Full street address
   - `hours`: Array of hour strings (one per line)
   - `lat`/`lng`: Coordinates (use Google Maps to find)
3. Save and commit to GitHub
4. Vercel will auto-deploy the update

### Verified Data Sources

Location data verified against:
- [elections.virginia.gov](https://www.elections.virginia.gov/)
- [alexandriava.gov/Elections](https://www.alexandriava.gov/Elections)
- [fairfaxcounty.gov/elections](https://www.fairfaxcounty.gov/elections/)
- [vote.arlingtonva.gov](https://vote.arlingtonva.gov/)

Last verification: July 16, 2026

## Local Development

### Running Locally

Since this is a static site, you can open `index.html` directly in a browser, or use a local server:

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js (if you have http-server installed)
npx http-server

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then visit `http://localhost:8000` in your browser.

### Testing

Before deploying updates:
1. Test on multiple screen sizes (mobile, tablet, desktop)
2. Test all buttons and links
3. Verify map loads and markers appear
4. Check countdown timer calculation
5. Test share card generation

## Deployment

### Initial Setup

See **DEPLOYMENT.md** for complete step-by-step instructions on:
1. Creating GitHub repository
2. Connecting to Vercel
3. Setting up Umami analytics
4. Creating short link
5. Generating QR code

### Automatic Updates

After initial setup, every push to the `main` branch automatically deploys to Vercel. No manual steps required.

## Post-Launch Tasks

### 1. Create Short Link
- Use TinyURL or short.io (free tiers)
- Point to your Vercel URL
- Update `script.js` line 477 with the short link

### 2. Generate QR Code
- Use [qr-code-generator.com](https://www.qr-code-generator.com/) (free)
- Input: your short link
- Download as PNG (at least 1000x1000px)
- Save to `assets/qr-code.png`
- Update the QR placeholder in `index.html` if needed

### 3. Set Up Analytics
- Create free Umami Cloud account
- Get your website ID
- Uncomment analytics script in `index.html` and add your ID
- Redeploy

### 4. Test Everything
- Check all links work
- Verify location data is accurate
- Test on mobile devices
- Share with a few people for feedback

## Maintenance

### During Election Season

- **Weekly**: Verify voting location hours haven't changed
- **After July 25**: Check if Fairfax County satellite locations opened as expected
- **Monitor analytics**: Watch which referral sources are working

### After Election Day

Consider adding:
- Archive banner noting the election has passed
- Link to general election information (November 2026)
- Thank you message to users

## License & Credits

### This Tool
Built by students and volunteers as a nonpartisan voter resource. Not affiliated with any campaign or candidate.

### Data Sources
- Voting location data: Virginia Department of Elections and local election offices
- Registration/absentee tools: Vote.org (nonpartisan nonprofit)
- Map data: OpenStreetMap contributors
- Map rendering: MapLibre GL JS
- Tiles: OpenFreeMap

### Privacy
This site uses privacy-respecting analytics to understand reach and improve the tool. No personal data is collected, and no cookies are used for tracking.

## Support

For issues or questions:
- Check official sources first: [elections.virginia.gov](https://www.elections.virginia.gov/)
- For technical issues: Open an issue on GitHub
- For voting questions: Contact your local election office

## Official Resources

- [Virginia Department of Elections](https://www.elections.virginia.gov/)
- [Alexandria Voter Registration](https://www.alexandriava.gov/Elections)
- [Fairfax County Elections](https://www.fairfaxcounty.gov/elections/)
- [Arlington County Voting](https://vote.arlingtonva.gov/)

---

**Last Updated**: July 16, 2026

**Next Review**: Weekly through Election Day
