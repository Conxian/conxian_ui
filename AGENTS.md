# CONXIAN MASTER MANIFEST (UX/UI ALIGNMENT DIRECTIVE)

**IDENTITY:** cxn-arch-guardian
**TARGET:** Global UI/UX Standardization across Conxian Protocol, Conxius Wallet, and Gateway.
**ETHOS:** Sovereign Earthy, BTC-native, Institutional-Grade (Morgan Stanley / BlackRock logic applied to decentralized infrastructure). High-trust, high-legibility.

## 1. MANDATORY UI ARCHITECTURE (THE BRIGHT FOUNDATION)

Purge all heavy, default dark-mode backgrounds from main operational views. The UI must feel spacious, bright, and low-fatigue.

*   **Base Canvas (60%)**: Enforce an "Ivory" or warm off-white foundation (`#FDFBF7` / `--color-background`) for all primary application backgrounds and operational zones.
*   **Surface Layers (30%)**: Use pure white (`#FFFFFF` / `--color-background-paper`) or very subtle contrasting light tones (`#F9F8F6` / `--color-neutral-light`) for data cards, modals, and internal sections. Rely on structural spacing and `border-accent/20` micro-borders rather than heavy drop shadows to create depth.
*   **Brand & Interaction (10%)**: Reserve deep brand colors (`#1A2623` / `--color-ink-deep` or `#333333` / `--color-ink`) strictly for typography, crisp iconography, active-state toggles, and primary CTA buttons.

## 2. STRUCTURAL BLOCKING & LAYOUT RULES

*   **Hero / Entry Zones**: Top navigation bars, footers, and initial marketing "Hero" banners may utilize full-width dark brand colors (e.g., bg-ink-deep) to establish immediate brand presence.
*   **Operational Zones**: The moment the user scrolls or enters a functional workspace (Yield tracking, Treasury Oracle, Protocol Dashboards, Data Tables, Readiness Dashboards), the background MUST snap to the bright Ivory/White foundation.
*   **Data Legibility**: Financial data, yields, and analytics must use stark, high-contrast dark typography (#333333) against the light background. Operational labels should use bold, uppercase styling with tracking (tracking-widest) for an institutional feel.

## 3. EXECUTION & ENFORCEMENT PROTOCOL

*   **Audit**: Regularly identify and purge overused dark background variables or design-token drift. Enforce the "Bright Foundation" for all operational views.
*   **Palette**: Strictly apply the 60-30-10 Ivory-led palette (#FDFBF7 base, #FFFFFF surface).
    *   **Base (60%)**: `#FDFBF7` (`--color-background`)
    *   **Surface (30%)**: `#FFFFFF` (`--color-background-paper`) or `#F9F8F6` (`--color-neutral-light`)
    *   **Brand (10%)**: `#333333` (`--color-ink`) or `#1A2623` (`--color-ink-deep`)
*   **Contrast**: Ensure all text contrast ratios meet strict institutional accessibility standards (WCAG AAA for financial data, ~12:1 ratio). Primary text should be #333333, secondary text should be #4D4D4D.
*   **Typography**: Use `tabular-nums` for all financial figures and ensure primary headers and operational labels use `uppercase tracking-widest`. All body copy and labels must use `font-black` or `font-bold` for high legibility.
*   **Components**: Use canonical UI components (Button, Input, Card, Badge, Table, StatusIndicator, ReadinessDashboard) and standard `border-accent/20` styling to maintain theme consistency. Buttons must use `rounded-sm` and `uppercase tracking-[0.2em]`.

## 4. AGENT SPECIFIC CHECKS

- Run `pnpm test` before every submission.
- Ensure all operational pages wrap content in `<div className="flex flex-col min-h-screen bg-background terminal-text">`.
- Operational content must be within `<main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">`.
- Use `StatusIndicator` for health states (operational/degraded/error).
- Ensure `EnvStatus` is visible on the Dashboard.
- All numerical data MUST use `tabular-nums`.
- All operational labels and headers MUST use `uppercase tracking-widest` or `tracking-[0.2em]`.
