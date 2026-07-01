# MATH.LAB — Interactive Mathematics

A final-year project: a small static website that turns four math topics —
Trigonometry, Shapes, Integration, and Differentiation — into things you can
drag, slide, and watch respond, instead of just reading about them.

No build tools, no frameworks, no installs required. It's plain HTML, CSS,
and JavaScript, so it runs anywhere a browser runs, including straight off
GitHub Pages.

## Project structure

```
mathsite/
├── index.html                  → Home page
├── css/
│   └── style.css               → All styling (shared across every page)
├── js/
│   ├── nav.js                  → Mobile menu toggle (shared)
│   ├── hero.js                 → Homepage animated polygon → circle
│   ├── tabs.js                 → Intro / working-area tab switcher (shared)
│   ├── trig.js                 → Trigonometry page logic
│   ├── shapes.js                → Shapes page logic
│   ├── integration.js          → Integration page logic
│   └── differentiation.js      → Differentiation page logic
└── pages/
    ├── trigonometry.html
    ├── shapes.html
    ├── integration.html
    └── differentiation.html
```

## Running it on your own computer first

You don't need anything installed — just open `index.html` directly in a
browser to preview it. (On Windows: double-click the file, or right-click →
Open with → your browser.)

If you want it to behave exactly like it will online (some browsers are
picky about opening files directly), you can instead run a tiny local
server from this folder:

- **If you have Python installed:** open a terminal in this folder and run
  `python -m http.server 8000`, then visit `http://localhost:8000` in your
  browser.
- **If you have VS Code:** install the "Live Server" extension, right-click
  `index.html`, and choose "Open with Live Server."

---

## Step-by-step: pushing this to a new GitHub repo and going live

This assumes you've genuinely never used Git or GitHub before. Follow it in
order — every step matters.

### 1. Create a GitHub account (skip if you already have one)

Go to [github.com](https://github.com) and sign up. Remember your username —
you'll need it later.

### 2. Install Git on your computer

Download it from [git-scm.com/downloads](https://git-scm.com/downloads) and
install it with all the default options. After installing, open **Command
Prompt** (or **Git Bash**, which the installer adds to your Start menu) and
check it worked:

```bash
git --version
```

You should see something like `git version 2.4x.x`. If you see an error,
restart your computer and try again — Windows sometimes needs a restart for
the `PATH` to update.

### 3. Tell Git who you are (one-time setup)

```bash
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

Use the same email you signed up to GitHub with.

### 4. Create a new, empty repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** something like `math-lab` (no spaces)
3. Set it to **Public** (GitHub Pages' free tier needs a public repo, unless
   you're on a paid plan)
4. **Do not** check "Add a README" or add a `.gitignore` — leave the repo
   completely empty. This project already has its own files.
5. Click **Create repository**

GitHub will show you a page with some commands. Keep that tab open — you'll
copy the repository URL from it (it looks like
`https://github.com/your-username/math-lab.git`).

### 5. Open a terminal in your project folder

- **Windows:** open the `mathsite` folder in File Explorer, then right-click
  inside it and choose **"Open in Terminal"** (or **"Git Bash Here"** if you
  see that option).
- Confirm you're in the right place:

```bash
dir
```

You should see `index.html`, `css`, `js`, and `pages` listed.

### 6. Turn this folder into a Git repository and push it

Run these commands one at a time, in order:

```bash
git init
git add .
git commit -m "Initial commit: MATH.LAB interactive site"
git branch -M main
git remote add origin https://github.com/your-username/math-lab.git
git push -u origin main
```

Replace `your-username/math-lab.git` with the actual URL from Step 4. The
first push may ask you to log in — a browser window will pop up asking you
to authorize Git; follow the prompts.

If it worked, refresh your GitHub repo page in the browser — you should see
all your files there.

### 7. Turn on GitHub Pages (this is what makes it "live" online)

1. On your repository page, click **Settings** (top right of the repo, not
   your account settings).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose **main** and folder **/ (root)**, then click
   **Save**.
5. Wait about 1–2 minutes. Refresh the page — GitHub will show a green box
   with your live URL, something like:

   ```
   https://your-username.github.io/math-lab/
   ```

Open that link — your site is now live and shareable with anyone, including
your project evaluators.

### 8. Making changes later

Whenever you edit a file and want to update the live site:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

GitHub Pages automatically rebuilds within a minute or two of every push —
no extra steps needed.

---

## Notes for your project report

- All visuals (unit circle, polygons, area shading, tangent lines) are drawn
  live on HTML `<canvas>` elements with plain JavaScript — no external
  charting library, which keeps the whole thing dependency-free and easy to
  explain in a viva.
- Integration is approximated numerically using **Simpson's rule**; the
  derivative is approximated using the **central difference formula**
  — both are standard, easily-citable numerical methods worth mentioning in
  your report's methodology section.
- The site is fully static (no backend, no database), which is exactly what
  GitHub Pages is built to host for free.
