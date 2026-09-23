# FundedNext Chrome Extension

A lightweight Chrome extension that surfaces your FundedNext prop-firm account **health** at a glance. One click on the extension icon opens a compact dashboard (light or dark) showing only the metrics that decide whether an account survives and passes — then tucks everything else behind a **Details** tap. Works across your CFD, Futures, and Competition accounts.

**This is a UX/functional MVP with realistic mock data** shaped exactly like the real FundedNext API objectives. No authentication or live API calls yet.

## Why these metrics

FundedNext accounts live or die by hard rules. The **first impression is deliberately minimal** — it answers the two questions a trader asks every session and nothing else:

1. **Am I about to breach?** — Daily Loss and Max Loss shown as color-coded bars (green → amber → red by % of buffer consumed). Breaching kills the account.
2. **Am I on track to pass / get paid?** — Profit Target progress.

Plus the account (name · size · status) and balance/P&L. Secondary data — equity, floating P&L, min trading days, consistency, payout eligibility, the funded Risk Card, competition leaderboard, and trading-cycle dates — lives under **Details**, collapsed by default so the first screen never overwhelms.

## Light & dark

The popup follows your OS light/dark setting by default, and a toggle in the header overrides it (remembered via `localStorage`).

## Quick Start

```bash
npm install
npm run build
```

## Load into Chrome

1. Run `npm run build` to generate the `dist/` folder
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer Mode** (toggle in top-right)
4. Click **Load unpacked** and select the `dist` folder
5. Pin the **FundedNext** extension in your toolbar
6. Click the FundedNext icon

## Test the Extension

- **First impression** — account chip, balance + P&L, Daily/Max loss safety bars, and Profit Target. That's it.
- **Theme toggle** — the sun/moon button in the header flips light ↔ dark; your choice is remembered.
- **Switch accounts** — click the account chip to open the selector, grouped by CFD / Futures / Competitions with a health dot each.
- **Details** — tap "Details" to reveal equity, floating P&L, min days, consistency, payout eligibility, funded Risk Card, competition leaderboard, and cycle dates.
- **Refresh** — the header refresh icon nudges equity/balance and recomputes buffers to simulate live data; the timestamp resets to "Updated just now".
- **Open Dashboard** — opens `fundednext.com/dashboard` in a new tab (the only action that opens a tab).

## Development

```bash
npm run dev      # local dev server (localhost:5173) to preview the popup UI
npm run build    # production build to dist/
```

## Project Structure

```
src/
  components/
    Header.tsx          - Logo + theme toggle + refresh
    ThemeToggle.tsx     - Light/dark switch (persists to localStorage)
    AccountSelector.tsx - Account chip + switcher grouped by kind, status pill
    AccountSummary.tsx  - Balance hero + P&L
    DrawdownSafety.tsx  - Daily/Max loss safety bars (green/amber/red)
    ProgressBar.tsx     - Profit target / min days / inactive days bars
    DetailsSection.tsx  - Collapsible secondary data (equity, consistency, risk card, ...)
    MetricCard.tsx      - Compact labelled metric (consistency, payout date)
    RiskCardRow.tsx     - Funded-only risk verdicts (quick strike / risk / news)
    LeaderboardRow.tsx  - Competition-only rank + percentile
    UpdatedLabel.tsx    - "Updated X ago"
    DashboardButton.tsx - Link to full dashboard
    EmptyStates.tsx     - Loading / error / no-account states

  lib/
    accountHealth.ts    - getHealth() (bar colors) + portfolio summary
    theme.ts            - Light/dark resolution + persistence
    format.ts           - currency / percent / size formatting

  services/
    mockAccountService.ts  - Mock data service (the only file to swap for a real API)

  data/
    mockAccounts.ts     - 6 realistic accounts across CFD / Futures / Competition

  types/
    account.ts          - Account model, mirrors the API objectives schema

  constants.ts          - Dashboard URL + health thresholds
  App.tsx               - Orchestrates the dashboard
  main.tsx              - Entry point (applies theme before render)
  styles/globals.css    - Light + dark theme tokens
```

## Connecting a Real API

The mock service maps 1:1 to real FundedNext API calls, so wiring live data is a drop-in:

| File | Change |
|------|--------|
| **`src/services/mockAccountService.ts`** | Replace `fetchAccounts()` → `get_customer_portfolio_rollup` / `get_accounts_v2`, `fetchAccount(id)` → `get_account_overview` (+ `get_risk_card` for funded), `refreshAccount()` → re-poll `get_account_overview`. Keep the signatures. |
| **`src/types/account.ts`** | Already mirrors the API `objectives{target_value, current_value, status}` shape — extend only if the API adds fields. |
| **`src/constants.ts`** | Dashboard URL + health thresholds. |
| **`manifest.json`** | Add the API domain to `host_permissions`. |

No component changes are needed — the UI reads only from the `Account` type.

## Technical Limitations (MVP)

- Mock data only — no authentication or live API calls.
- No background service worker — data refreshes only while the popup is open.
- Account selection is not persisted across popup closes.
- Placeholder "FN" icon, not the official logo.
- Futures trailing drawdown is modeled as a simple buffer; the real trailing rule is more nuanced.
