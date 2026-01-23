# Hudson Stingers Robotics - Team 4295 Website

Official website for Hudson Stingers Robotics, FRC Team 4295 from Hudson High School.

## Tech Stack

- **Static Site Generator**: [Eleventy (11ty)](https://www.11ty.dev/) v3.1.2
- **Templating**: Nunjucks (.njk)
- **Styling**: Tailwind CSS v4.1.17
- **JavaScript**: FullCalendar, Form Validation
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions (automated)

## Prerequisites

- Node.js 18.x or higher
- npm (comes with Node.js)
- Git

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JuanBarron2001/FRC_4295_Website_Template.git
   cd FRC_4295_Website_Template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file (optional)**
   ```bash
   cp .env.example .env
   ```
   Add your AWS Lambda URL if using form submissions.

4. **Start development server**
   ```bash
   npm start
   ```
   Site will be available at `http://localhost:8080`

## Build Commands

| Command | Description |
|---------|-------------|
| `npm start` | Clean `_site/` and start development server with live reload |
| `npm run build` | Clean `_site/` and build production site |
| `npm run clean` | Remove `_site/` directory |

## Project Structure

```
FRC_4295_Website_Template/
├── _data/                  # JSON data files
│   ├── events.json        # Calendar events
│   └── members.json       # Team roster
├── _includes/             # Reusable components
│   ├── layouts/           # Page layouts
│   │   └── base.njk      # Base HTML template
│   ├── head/              # Head sections for each page
│   ├── header.njk         # Site header/navigation
│   ├── footer.njk         # Site footer
│   └── form.njk           # Contact form component
├── _site/                 # Generated site (git-ignored)
├── aws-lambda/            # Serverless form handlers
├── css/                   # Stylesheets
├── entries/               # Blog posts (Markdown)
├── examples/              # Content templates
├── images/                # Image assets
│   ├── banner/           # Team banners
│   ├── gallery/          # Photo gallery
│   ├── icon/             # Favicons
│   └── logos/            # Sponsor/partner logos
├── js/                    # JavaScript files
│   ├── calendar.js       # Calendar functionality
│   └── form_handler.mjs  # Form validation
├── .eleventy.js           # Eleventy configuration
├── tailwind.config.js     # Tailwind configuration
├── package.json           # Dependencies & scripts
└── README.md              # This file
```

## Content Management

### Adding Blog Posts

1. Create a new Markdown file in `entries/` folder:
   ```bash
   entries/YYYYMMDD.md
   ```

2. Use this template:
   ```markdown
   ---
   title: "Your Blog Post Title"
   date: 2026-01-23
   author: "Your Name"
   team: "Marketing"
   icon: "fa-robot"
   tags: blog
   ---

   Your blog content here using **Markdown** formatting!
   ```

3. Available Font Awesome icons:
   - `fa-rocket` - Launches, kickoff
   - `fa-lightbulb` - Ideas, brainstorming
   - `fa-hammer` - Building
   - `fa-trophy` - Competitions, awards
   - `fa-robot` - General robotics
   - `fa-code` - Programming
   - `fa-wrench` - Mechanical work

4. The blog will automatically appear on `/blog/` sorted by date (newest first)

### Updating Team Members

Edit `_data/members.json`:

```json
{
  "name": "Student Name",
  "roles": ["Co-Captain", "Tech Lead"],
  "subteams": ["Leadership", "Tech"],
  "specialty": "Co-Captain, Tech Lead",
  "isLead": true,
  "isCoCaptain": false
}
```

**Role Options**: Co-Captain, Tech Lead, Drive Lead, Safety Lead, Marketing Lead
**Subteams**: Leadership, Tech, Drive, Safety, Marketing

### Updating Calendar Events

Edit `_data/events.json`:

```json
{
  "title": "Event Name",
  "date": "2026-01-23",
  "endDate": null,
  "time": "5:00 PM - 7:00 PM",
  "location": "Hudson High School - Robotics Lab",
  "type": "meeting",
  "description": "Event description",
  "icon": "fa-wrench",
  "canceled": false
}
```

**Event Types**: `meeting`, `competition`, `outreach`, `fundraiser`, `social`

### Updating Gallery Images

1. Add images to `images/gallery/`
2. Recommended format: WebP or JPG
3. Update the gallery page to reference new images

## Customization

### Brand Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  tech: '#822008',        // Primary maroon
  maroon: { /* shades */ },
  gray: { /* shades */ }
}
```

### Navigation Menu

Edit `_includes/header.njk` to add/remove menu items.

### Custom 404 Page

The custom 404 error page is located at `404.html` with robotics-themed messaging.

## Deployment

### Automatic Deployment (Recommended)

GitHub Actions automatically builds and deploys when you push to `main` branch:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. GitHub Actions will:
   - Install dependencies
   - Build the site with `npm run build`
   - Deploy to GitHub Pages

3. Site will be live at: `https://yourusername.github.io/repo-name/`

### Manual Build

If you need to build manually:

```bash
npm run build
```

The generated site will be in `_site/` directory.

## Environment Variables

Create a `.env` file for sensitive data:

```env
LAMBDA_URL=https://your-api-gateway-url.amazonaws.com/prod/contact
```

**Note**: Never commit `.env` to version control. Use GitHub Secrets for deployment.

## Common Tasks

### Change Team Name/Info
- Edit header text in `_includes/header.njk`
- Update meta tags in `_includes/head/*_head.njk`

### Update Sponsor Logos
- Add logo images to `images/logos/`
- Update sponsors page content

### Modify Footer
- Edit `_includes/footer.njk`

### Add New Page
1. Create `pagename.html` in root
2. Add front matter:
   ```yaml
   ---
   layout: layouts/base.njk
   title: Page Title
   head: default
   ---
   ```
3. Add link in header navigation

## Troubleshooting

**Build fails**: Delete `node_modules/` and `package-lock.json`, then run `npm install`

**Dev server not updating**: Hard refresh browser (Ctrl+F5) or restart dev server

**404 on GitHub Pages**: Check repository settings → Pages → Source is set to `gh-pages` branch

## Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [FullCalendar Docs](https://fullcalendar.io/docs)
- [FIRST Robotics Competition](https://www.firstinspires.org/robotics/frc)

## Contributing

1. Create a feature branch: `git checkout -b feature-name`
2. Make your changes
3. Test locally with `npm start`
4. Commit: `git commit -m "Description"`
5. Push: `git push origin feature-name`
6. Create Pull Request on GitHub

## License

ISC

## Maintainers

Hudson Stingers Robotics - Team 4295

---

**Need help?** Contact the team's marketing lead or check the examples folder for templates.