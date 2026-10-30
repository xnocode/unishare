# UniShare - Team & AI Development Guidelines

Welcome to **UniShare**! This project is a campus sharing and rental platform built for university students in Bangladesh.

---

## 1. Project Architecture & File Structure

We follow a clean, modular, and component-based file structure:

```text
unishare/
├── index.html                  # Main Landing Page (entry point)
├── assets/
│   ├── css/
│   │   ├── variables.css       # Design tokens (colors, fonts, radii, shadows)
│   │   ├── base.css            # CSS reset, typography, global button styles
│   │   ├── components/         # Modular CSS components
│   │   │   ├── navbar.css      # Top navigation & logo
│   │   │   ├── hero.css        # Hero banner & student portrait
│   │   │   ├── share.css       # Rental items & ride sharing grids
│   │   │   ├── how.css         # "How it works" 3-step section
│   │   │   ├── footer.css      # Final CTA & footer
│   │   │   └── responsive.css  # Media queries & mobile breakpoints
│   │   └── style.css           # Master stylesheet importing all modules
│   ├── js/
│   │   └── main.js             # Client-side scripts & interactions
│   └── images/
│       ├── hero-student.jpg    # Hero banner visual
│       ├── items/              # Shared item images (chargers, calculators, etc.)
│       └── rides/              # Ride share images (rickshaw, car)
├── pages/                      # Additional pages (login, register, dashboard)
├── AGENTS.md                   # Team Antigravity guidelines & rules
└── Readme.md                   # Project documentation & onboarding
```

---

## 2. Design System & Tokens

Always use defined CSS variables from `assets/css/variables.css`:

- **Brand Green:** `var(--brand)` (`#0B5D5E`)
- **Brand Dark:** `var(--brand-dark)` (`#073c3d`)
- **Ink / Text:** `var(--ink)` (`#12201f`)
- **Muted Text:** `var(--muted)` (`#4a5b59`)
- **Tint Background:** `var(--tint)` (`#e6f0ef`)
- **Heading Font:** `var(--font-heading)` (`'Bricolage Grotesque', sans-serif`)
- **Body Font:** `var(--font-body)` (`'DM Sans', system-ui, sans-serif`)

---

## 3. Coding Guidelines for Teammates & Antigravity

- **Modularity:** When adding a new section or page, create a dedicated CSS file in `assets/css/components/` and import it in `style.css`.
- **No Inlined Base64 Images:** Never embed raw base64 images into HTML. Always store binary assets in `assets/images/`.
- **Semantic HTML5:** Use `<nav>`, `<header>`, `<main>`, `<section>`, `<article>`, and `<footer>` tags with proper ARIA accessibility labels.
- **Git Discipline:**
  - Create feature branches: `git checkout -b feature/<feature-name>`.
  - Use conventional commits: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`.
  - Open a Pull Request on GitHub and link the issue (`Closes #<issue-number>`).
