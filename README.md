# Clean Next.js Unsaved Form Changes Demo

A clean, minimalist Next.js application that protects users from losing unsaved form data using native browser prompts.

---

## Features

- **Only Name & Email Fields**: Minimalist white card with only `Full Name` and `Email Address`.
- **Browser Back Button Protection**: Intercepts browser Back navigation via History API (`popstate`) and prompts native confirmation before leaving.
- **Browser Refresh / Tab Close**: Uses native `beforeunload` to trigger standard browser confirmation dialog.
- **In-App Links Protection**: Prompts when clicking links while changes are unsaved.
- **Deep Equivalence Check**: Reverting typed input back to empty automatically resets the status to Clean without false warnings.
- **Safe Reset**: Prompts confirmation before discarding changes.

---

## How to Run

```bash
# Start development server
npm run dev

# Run automated tests
npm test

# Build for production
npm run build
```
