## 2024-07-25 - Reliable `aria-live` Announcements

**Learning:** Conditionally rendering an `aria-live` region can cause screen readers to miss announcements. To ensure reliability, the element with the `aria-live` attribute should be persistently rendered in the DOM, with only its content changing dynamically.

**Action:** When implementing announcements or status updates for screen readers, I will always ensure the `aria-live` container element is rendered unconditionally, and only update its child content.

## 2025-05-15 - Improving Interactive Badge Accessibility

**Learning:** Using a `div` or `span` for interactive elements like slippage selection prevents keyboard users and screen readers from interacting with them correctly.

**Action:** I will use `<button>` elements styled with `badgeVariants` and `aria-pressed` for toggleable selection groups to ensure full accessibility and consistent styling.

## 2025-12-29 - Layout Stability and Persistence for a11y

**Learning:** Combining persistent `aria-live` regions with `min-h` and `opacity` transitions solves both accessibility (reliable announcements) and UX (eliminating layout shift/CLS) issues simultaneously.

**Action:** Prefer persistent containers with `min-h` and opacity transitions over conditional rendering for status messages and live announcements.

## 2025-05-20 - Enhanced Blockchain Transaction Feedback

**Learning:** Providing immediate, actionable feedback after a blockchain transaction significantly reduces user anxiety. A plain "Transaction submitted" message is insufficient.

**Action:** Always include a truncated transaction ID as a link to the relevant block explorer and a `CopyButton` for one-click utility. Use monospaced fonts for IDs to improve readability.

## 2026-03-22 - Global UI/UX Standardization (Ivory Foundation)

**Learning:** Decentralized financial infrastructure requires institutional-grade legibility and high-trust visual cues. Dark-mode defaults in functional workspaces can increase fatigue and reduce trust for professional users.

**Action:** Always enforce a bright "Ivory" foundation (#FDFBF7) and pure white surface layer (#FFFFFF) for operational zones. Reserve dark brand colors strictly for entry zones (Sidebar/Header). Use high-contrast dark typography (#333333) for all critical financial data to ensure WCAG AAA compliance.
