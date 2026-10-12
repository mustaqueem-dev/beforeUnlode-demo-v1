# Next.js Unsaved Form Changes Warning Demo

A clean, production-grade implementation demonstrating how to protect users from accidentally losing unsaved form data in **Next.js App Router**.

---

## 🌟 Highlights & Key Features

- **Native Browser Protection (`beforeunload`)**:
  - Handles **Page Refresh**, **Tab Closing**, and **Window Closing** using the browser's native confirmation dialog.
  - Attached **only** when unsaved changes exist (`dirty` state) and removed when the form becomes pristine or submitted.
- **In-App Client Navigation Guard**:
  - Intercepts in-app links (Header links, Home, Success page, breadcrumbs, custom buttons) before Next.js changes routes.
  - Displays a custom, accessible confirmation dialog (`Stay on Page` vs `Leave Without Saving`).
- **Value Equivalence Engine**:
  - Compares working form input against the saved baseline.
  - If a user modifies a field and later restores the original value, the form automatically returns to **Pristine** without unnecessary warnings.
- **Form Submission Lifecycle**:
  - **Pristine**: Initial clean state matching saved baseline.
  - **Dirty**: Unsaved changes exist; navigation protection is active.
  - **Submitting**: Asynchronous simulation running; buttons disabled.
  - **Submitted**: Baseline updated; dirty state cleared; navigation allowed without warning.
  - **Submission Failure Resilience**: If submission fails (toggleable in UI), inputs are preserved and protection remains active.
- **Safe Form Reset**:
  - If the form is pristine, it resets immediately.
  - If the form is dirty, it asks for confirmation before discarding entered values.
- **Accessible Modal Dialog**:
  - WCAG-compliant with `role="dialog"`, `aria-modal="true"`, focus trapping, Escape key support, and focus restoration.

---

## 📂 Project Structure

```text
├── app/
│   ├── layout.tsx                # App layout with UnsavedChangesProvider and DemoNavigation
│   ├── page.tsx                  # Home page explaining features and launch CTA
│   ├── globals.css               # Tailwind CSS directives
│   ├── demo/
│   │   └── page.tsx              # Form Demo page embedding UnsavedChangesForm
│   └── success/
│       └── page.tsx              # Confirmation page after successful submission
├── components/
│   ├── forms/
│   │   └── UnsavedChangesForm.tsx # Responsive form card, live telemetry, validation, reset
│   ├── navigation/
│   │   └── DemoNavigation.tsx    # Header with route links and active status badge
│   ├── dialogs/
│   │   └── LeaveConfirmationDialog.tsx # Accessible modal for in-app navigation & resets
│   └── ui/
│       └── StatusBadge.tsx       # Status indicator (Pristine, Dirty, Submitting, Submitted)
├── hooks/
│   └── useUnsavedChanges.ts      # Reusable hook & provider managing beforeunload and in-app clicks
├── lib/
│   └── form-utils.ts             # Validation logic, equivalence checks, and simulation
├── tests/
│   ├── form-utils.test.ts        # Unit tests for validation and equivalence
│   ├── LeaveConfirmationDialog.test.tsx # Modal accessibility and interaction tests
│   ├── useUnsavedChanges.test.tsx # Hook tests for beforeunload and in-app interception
│   └── UnsavedChangesForm.test.tsx # Full form lifecycle and submission resilience tests
├── vitest.config.ts              # Vitest test configuration with jsdom
└── vitest.setup.ts               # Testing library jest-dom setup
```

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development Server

Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

Verify compilation and static site generation:

```bash
npm run build
npm start
```

### 4. Running Automated Tests

Run the Vitest test suite:

```bash
npm test
```

---

## 🧪 Testing Manual Browser Scenarios

| Scenario | User Action | Expected Behavior |
| :--- | :--- | :--- |
| **Pristine Form** | Navigate to any link or refresh | Navigates immediately with **no** warning dialog. |
| **Edit Field** | Type in any field (e.g. Full Name) | Status changes to **Dirty**; Header badge updates to **Unsaved Changes**. |
| **Revert Edit** | Delete the typed characters | Status automatically switches back to **Pristine**; protection deactivates. |
| **In-App Link** | Click *Home* or *Success Page* in header | Displays custom accessible modal asking to *Stay* or *Leave*. |
| **Stay on Page** | Click *Stay on Page* in modal | Closes modal and keeps all entered form values intact. |
| **Leave Without Saving** | Click *Leave Without Saving* in modal | Discards dirty state and completes navigation to the selected route. |
| **Page Refresh** | Press `F5` or `Ctrl+R` (`Cmd+R`) while dirty | Browser displays native confirmation prompt (*"Leave site?"*). |
| **Tab / Window Close** | Close tab while dirty | Browser displays native confirmation prompt. |
| **Simulated Failure** | Check *Trigger Server Error* and submit | Displays error alert; preserves user inputs; protection remains active. |
| **Successful Submission** | Submit valid form data | Submits successfully; deactivates guards; redirects to `/success`. |
| **Reset Form** | Click *Reset Form* while dirty | Shows confirmation dialog before clearing form data back to pristine baseline. |

---

## ⚠️ Important Browser & Framework Technical Limitations

1. **Native `beforeunload` Text is Controlled by Browsers**:
   - Modern browsers (Chrome, Firefox, Safari, Edge) do **not** display custom text passed to `event.returnValue`. They show a standardized native string to prevent phishing attacks.
2. **User Gesture Requirement**:
   - Browsers will only show the native `beforeunload` dialog if the user has interacted with the document (typed, clicked, or focused an element).
3. **Hard Browser Process Termination**:
   - Forced browser crashes, killing the browser process via Task Manager, or power loss cannot be intercepted by JavaScript. Sensitive data should be backed up with autosave strategies where required.
4. **Next.js App Router Client Navigation**:
   - Next.js App Router does not provide a built-in `router.beforePopState` or `useBlocker` hook (such as in React Router). Capturing click events on internal navigation links provides a clean, native, and reliable client-side interception mechanism.
