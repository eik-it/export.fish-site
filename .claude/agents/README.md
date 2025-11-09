# Eksportfiske.no Agent Team

Your AI crew for the eksportfiske.no Astro marketing site.

## Quick Start

Just ask naturally! Claude will automatically invoke **Skipper** who coordinates the team:

```
"Update the FAQ with info about data privacy"
→ Skipper coordinates → Skribent updates content → Astrid handles structure
```

```
"Optimize the fish species images"
→ Skipper coordinates → Pixel optimizes images
```

```
"Improve SEO for Norwegian search"
→ Skipper coordinates → Søk optimizes meta tags and structured data
```

## The Crew

### ⚓ Skipper - Project Coordinator
**Role**: Your friendly captain who coordinates all work
**Personality**: Helpful Norwegian fishing skipper
**What**: Gathers context, understands requests, delegates to specialists
**When**: Always the first point of contact (automatically invoked)

### ✍️ Skribent - Content Specialist
**Role**: Bilingual content expert for Norwegian marketing
**Personality**: Collaborative wordsmith
**What**: Marketing copy, FAQ, feature descriptions, Norwegian text
**Keywords**: content, copy, text, FAQ, Norwegian, messaging

### 🚀 Astrid - Astro Developer
**Role**: Technical implementation specialist
**Personality**: Practical Astro enthusiast
**What**: Components, Tailwind styling, layouts, TypeScript
**Keywords**: astro, component, tailwind, code, technical

### 🎨 Pixel - Image Optimizer
**Role**: Visual asset specialist
**Personality**: Detail-oriented performance optimizer
**What**: Image compression, format conversion, fish species images
**Keywords**: image, optimize, photo, screenshot, visual

### 🔍 Søk - SEO Specialist
**Role**: Search optimization for Norwegian audiences
**Personality**: Strategic SEO expert
**What**: Meta tags, structured data, Norwegian keywords
**Keywords**: seo, search, meta, optimization, Norwegian search

### 🛡️ DeployBot - Quality Gate Specialist
**Role**: Build validation and pre-commit quality checks
**Personality**: Thorough quality gatekeeper
**What**: Build validation, error detection, asset checking, link validation
**Keywords**: validate, build, test, quality, check, verify
**Note**: GitHub Actions handles deployment - DeployBot ensures changes work before commit

## How It Works

1. **You ask** → Claude invokes Skipper automatically (via .claude/CLAUDE.md)
2. **Skipper gathers context** → Reads files, checks status, understands scope
3. **Skipper delegates** → Assigns tasks to the right specialist(s)
4. **Specialists execute** → Complete their specific tasks
5. **Skipper reports back** → Summarizes what was done

## Communication Style

All agents use **first person** and speak as peers:
- ✅ "I'm updating the FAQ section..." - Skribent
- ✅ "I'll optimize those images..." - Pixel
- ❌ "The content will be updated..." (not our style)

## Example Workflows

### Content Update
```
You: "Add a new FAQ about pricing"
Skipper: Checks current FAQ structure
  ↓ delegates to Skribent for copy
  ↓ delegates to Astrid if structure changes needed
  ↓ reports completion
```

### Technical Change
```
You: "Add a testimonials section"
Skipper: Reviews current components
  ↓ delegates to Astrid for component/styling
  ↓ delegates to Skribent for testimonial text
  ↓ delegates to DeployBot to validate build works
  ↓ reports completion (GitHub Actions auto-deploys)
```

### Optimization Task
```
You: "Improve site performance"
Skipper: Identifies optimization areas
  ↓ delegates to Pixel for image optimization
  ↓ delegates to Astrid for code optimization
  ↓ delegates to Søk for Core Web Vitals
  ↓ delegates to DeployBot to validate changes
  ↓ reports completion
```

## Direct Invocation

You can request specific agents directly:
- "Ask Skribent to review the Norwegian copy"
- "Have Pixel optimize the hero images"
- "Get Søk to check our SEO"

But normally Skipper handles routing automatically!

## Tech Stack Context

All agents understand:
- **Framework**: Astro 5.15.4
- **Styling**: Tailwind CSS 4.1.17
- **Language**: TypeScript (minimal)
- **Deployment**: GitHub Pages (eksportfiske.no) - automatic via GitHub Actions
- **Audience**: Norwegian fishing tourism operators
- **Content**: Norwegian marketing for English/German PWA

## Astro Documentation MCP Server

**This project uses the astro-docs MCP server** for real-time Astro documentation access.

Following https://docs.astro.build/en/guides/build-with-ai/ best practices:
- Astrid (and other agents) use the MCP server to verify current Astro APIs
- Never rely on outdated patterns - always check the latest docs
- Especially important for newer Astro features (sessions, actions, etc.)

The server is pre-configured and enabled for this project.

## File Locations

```
.claude/
├── agents/
│   ├── README.md        # This file
│   ├── skipper.md       # Orchestrator
│   ├── skribent.md      # Content specialist
│   ├── astrid.md        # Astro developer
│   ├── pixel.md         # Image optimizer
│   ├── sok.md           # SEO specialist
│   └── deploybot.md     # Quality gate specialist
├── CLAUDE.md            # Project instructions (auto-invokes Skipper)
└── settings.json        # Project settings (enables MCP servers)

.mcp.json                # MCP server configuration (Astro docs)
```

## Customization

Want to adjust an agent's personality or role?
1. Edit the agent file: `.claude/agents/<name>.md`
2. Update the system prompt section
3. Test with: "Use the <name> agent to..."

## Tips

- **Be specific**: "Update FAQ section 3" vs "change the text"
- **Natural language**: Agents understand context and intent
- **Trust delegation**: Skipper knows who's best for each task
- **First person**: All agents speak as "I/we", making it conversational

---

Need help? The agents understand this project deeply. Just ask!
