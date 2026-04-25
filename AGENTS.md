# CONXIAN MASTER MANIFEST (UX/UI ALIGNMENT DIRECTIVE)

**IDENTITY:** cxn-arch-guardian
**TARGET:** Global UI/UX Standardization across Conxian Protocol, Conxius Wallet, and Gateway.
**ETHOS:** Sovereign Earthy, BTC-native, Institutional-Grade (Morgan Stanley / BlackRock logic applied to decentralized infrastructure). High-trust, high-legibility.

## 1. MANDATORY UI ARCHITECTURE (THE BRIGHT FOUNDATION)

Purge all heavy, default dark-mode backgrounds from main operational views. The UI must feel spacious, bright, and low-fatigue.

*   **Base Canvas (60%)**: Enforce an "Ivory" or warm off-white foundation (#FDFBF7 / #F9F8F6) for all primary application backgrounds and operational zones.
*   **Surface Layers (30%)**: Use pure white (#FFFFFF) for data cards, modals, and internal sections. Rely on structural spacing and `border-accent/20` micro-borders rather than heavy drop shadows to create depth.
*   **Brand & Interaction (10%)**: Reserve deep brand colors (dark earth tones, deep greens/blues, or high-contrast blacks) strictly for typography, crisp iconography, active-state toggles, and primary CTA buttons.

## 2. STRUCTURAL BLOCKING & LAYOUT RULES

*   **Hero / Entry Zones**: Top navigation bars, footers, and initial marketing "Hero" banners may utilize full-width dark brand colors (e.g., bg-primary-dark) to establish immediate brand presence.
*   **Operational Zones**: The moment the user scrolls or enters a functional workspace (Yield tracking, Treasury Oracle, Protocol Dashboards, Data Tables, Readiness Dashboards), the background MUST snap to the bright Ivory/White foundation.
*   **Data Legibility**: Financial data, yields, and analytics must use stark, high-contrast dark typography (text-text / #333333) against the light background. Operational labels should use bold, uppercase styling with tracking (tracking-widest) for an institutional feel.

## 3. EXECUTION & ENFORCEMENT PROTOCOL

*   **Audit**: Regularly identify and purge overused dark background variables or design-token drift.
*   **Palette**: Strictly apply the 60-30-10 Ivory-led palette (#FDFBF7 base, #FFFFFF surface).
*   **Contrast**: Ensure all text contrast ratios meet strict institutional accessibility standards (WCAG AAA for financial data, ~12:1 ratio). Primary text should be #333333, secondary text should be #4D4D4D.
*   **Typography**: Use `tabular-nums` for all financial figures and ensure primary headers use `uppercase tracking-widest`.
*   **Components**: Use canonical UI components (Button, Input, Card, Badge, Table, StatusIndicator, ReadinessDashboard) and standard `border-accent/20` styling to maintain theme consistency.

## 4. AGENT SPECIFIC CHECKS

- Run `pnpm test` before every submission.
- Ensure all new pages wrap content in `bg-background min-h-screen`.
- Use `StatusIndicator` for health states (operational/degraded/error).
- Ensure `EnvStatus` is visible on the Dashboard.
