# UniShare 🎓

> **Your campus, one big shared shelf.**  
> Rent cameras, calculators, laptops, and share rides exclusively with verified students on your university campus in Bangladesh.

---

## 📁 Project Directory Structure

```text
unishare/
├── index.html                   # Clean, semantic Landing Page (entry point)
├── pages/                       # Complete Student Authentication & Verification Flow
│   ├── register.html            # Step 1: Create Account & student email validation
│   ├── confirm-email.html       # Step 2: 6-digit confirmation code verification
│   ├── verify-student.html      # Step 3: Student ID, department & photo uploads
│   ├── verify-pending.html      # Step 4: Review pending administrative status
│   ├── verify-approved.html     # Step 4: Verification approved welcome & features
│   ├── verify-rejected.html     # Step 4: Verification rejected & resubmission guidance
│   ├── login.html               # Main student login with item showcase
│   ├── login-2fa.html           # Two-Factor Authentication 6-digit login OTP
│   ├── forgot-password.html     # Password recovery link request
│   └── reset-password.html      # Set new password with live criteria checks
├── assets/
│   ├── css/
│   │   ├── variables.css        # Design tokens & color variables
│   │   ├── base.css             # Resets, global typography & button styles
│   │   ├── style.css            # Master stylesheet importing all components
│   │   └── components/          # Modular component stylesheets
│   │       ├── navbar.css       # Navigation bar & logo
│   │       ├── hero.css         # Hero banner & portrait
│   │       ├── share.css        # Item rental & ride grids
│   │       ├── how.css          # 3-step verification process
│   │       ├── auth.css         # Auth suite, OTP inputs, dropzones & animations
│   │       ├── footer.css       # Final CTA & footer
│   │       └── responsive.css   # Tablet & mobile responsive rules
│   ├── js/
│   │   ├── main.js              # Landing page client scripts & smooth scroll
│   │   └── auth.js              # OTP auto-focus, drag & drop uploads, validation & toast
│   └── images/
│       ├── hero-student.jpg     # Hero banner photograph
│       ├── items/               # Campus items (chargers, earphones, etc.)
│       └── rides/               # Ride sharing images (rickshaw, car)
├── AGENTS.md                    # Guidelines for Antigravity & team developers
├── .gitignore                   # Ignore unnecessary OS/build artifacts
└── Readme.md                    # Project documentation & onboarding guide
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/xnocode/unishare.git
cd unishare
```

### 2. Run Locally
You can open `index.html` directly in your browser or run a simple local HTTP server:

```bash
# Using Python 3:
python3 -m http.server 3000

# Or using VS Code:
# Right-click index.html and select "Open with Live Server"
```
Then visit: `http://localhost:3000`

---

## 👥 Team Collaboration Workflow

1. **Pull latest changes:**
   ```bash
   git checkout main && git pull origin main
   ```
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: descriptive message of your changes"
   git push -u origin feature/your-feature-name
   ```
4. **Open a Pull Request:**
   - Go to GitHub and open a Pull Request into `main`.
   - Include `Closes #<issue_number>` to auto-update the team Kanban board!

---

## 🤖 Working with Antigravity

- Every team member using Antigravity will automatically inherit the coding conventions and design tokens defined in [`AGENTS.md`](./AGENTS.md).
- To plan new features: type `/plan` or `/grill-me`.
