# Eksportfiske.no Marketing Site

A modern marketing website for eksportfiske.no - promoting a PWA reporting application designed for Norwegian fishing tourism businesses.

## 🎯 Project Purpose

This site markets a progressive web app (PWA) that helps Norwegian turistfiskebedrifter (fishing tourism operators) efficiently report their catches. While the app serves international tourists in English and German, this marketing site targets Norwegian business owners.

**Target Audience**: Norwegian fishing tourism operators who need to streamline catch reporting and comply with regulations.

**Value Proposition**: Simple, mobile-first reporting solution that saves time and reduces paperwork for fishing businesses.

## 🛠 Tech Stack

- **Framework**: [Astro](https://astro.build) 5.15.4
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 4.x
- **Deployment**: GitHub Pages with custom domain
- **CI/CD**: GitHub Actions (automatic deployment)

### Why Astro?

Astro provides the perfect foundation for a marketing site:
- ⚡ Lightning-fast page loads (important for mobile fishing operators)
- 🌊 Minimal JavaScript by default
- 📱 Built-in optimization for images and assets
- 🎨 Tailwind integration for responsive design

## 🚀 Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server will start at `http://localhost:4321`

### Available Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

### Project Structure

```
/
├── .claude/                 # Claude Code agent configuration
│   ├── agents/             # Specialized AI team members
│   └── skills/             # Project-specific AI capabilities
├── public/                 # Static assets (images, fonts)
├── src/
│   ├── layouts/           # Page layouts
│   ├── pages/             # Routes (file-based routing)
│   └── styles/            # Global styles
├── astro.config.mjs       # Astro + Tailwind configuration
└── package.json           # Dependencies and scripts
```

## 🚢 Deployment

Deployment is **fully automated** via GitHub Actions:

1. Push to `master` branch
2. GitHub Actions builds the site
3. Deploys to GitHub Pages
4. Available at https://eksportfiske.no

### Custom Domain

The site is configured for the custom domain `eksportfiske.no`:
- Domain configured in `astro.config.mjs` (`site: 'https://eksportfiske.no'`)
- DNS points to GitHub Pages
- HTTPS enabled via GitHub

## 🤖 Claude Code Agent Team

This project uses a specialized AI agent team for development, coordinated via Claude Code.

### Team Structure

#### ⚓ **Skipper** (Orchestrator)
Project coordinator who gathers context and delegates tasks to appropriate specialists. Always the first point of contact.

#### ✍️ **Skribent** (Content Specialist)
Handles all Norwegian marketing copy, FAQ updates, and messaging. Bilingual expertise for targeting Norwegian business owners while understanding the multilingual app context.

**Use for**: Content updates, Norwegian text, marketing copy, FAQ sections

#### 🚀 **Astrid** (Astro Developer)
Expert in Astro 5.x components and Tailwind 4.x styling. Uses the astro-docs MCP server for real-time API verification.

**Use for**: Component development, technical implementation, styling, Astro features

#### 🎨 **Pixel** (Image Optimizer)
Optimizes visual assets for web performance - crucial for mobile users on fishing boats.

**Use for**: Image compression, format conversion, fish species images, visual assets

#### 🔍 **Søk** (SEO Specialist)
Optimizes for Norwegian search engines and fishing industry keywords.

**Use for**: Meta tags, structured data, Norwegian keyword optimization, search visibility

#### 🛡️ **DeployBot** (Quality Gate)
Validates builds and runs pre-commit checks to ensure nothing breaks.

**Use for**: Build validation, quality checks, pre-deployment testing

### Working with Agents

All requests go through **Skipper** who coordinates the team:

```bash
# In Claude Code, simply describe what you need:
"Update the FAQ section to add a question about catch limits"
→ Skipper coordinates Skribent (content) + Astrid (technical review)

"Optimize the hero image"
→ Skipper delegates to Pixel

"Improve search ranking for 'turistfiske rapportering'"
→ Skipper brings in Søk
```

### MCP Integration

The project uses the **astro-docs MCP server** for real-time Astro documentation access. This ensures all development follows current best practices and APIs.

## 📝 Content Strategy

**Language**: Norwegian (primary marketing content)
- Target keywords: turistfiske, fangstrapportering, turistfiskebedrifter
- Focus on time savings and regulatory compliance
- Mobile-first messaging (operators on boats)

**Multilingual Context**: While this marketing site is Norwegian, the actual PWA supports:
- Norwegian (operators)
- English (tourists)
- German (tourists)

## 🔧 Configuration

### Astro

Site configuration in `astro.config.mjs`:
- Custom domain: `eksportfiske.no`
- Base path: empty (root deployment)
- Tailwind via Vite plugin

### Tailwind

Tailwind 4.x configured via the `@tailwindcss/vite` plugin in `astro.config.mjs`. No separate config file needed.

## 📄 License

This is a commercial project for eksportfiske.no.

## 🐟 About Eksportfiske.no

Eksportfiske.no provides digital solutions for Norwegian fishing tourism businesses, helping them modernize catch reporting and improve operational efficiency.

---

**Need help?** The Claude Code agent team is ready to assist with any updates, optimizations, or new features.
