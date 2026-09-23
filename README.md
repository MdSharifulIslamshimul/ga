# FundedNext Chrome Extension

A lightweight Chrome extension that surfaces your FundedNext prop-firm account **health** at a glance. One click on the extension icon opens a compact dark dashboard showing the metrics that actually decide whether an account survives and passes — breach buffers, profit-target progress, and compliance — across all your CFD, Futures, and Competition accounts.

**This is a UX/functional MVP with realistic mock data** shaped exactly like the real FundedNext API objectives. No authentication or live API calls yet.

## Why these metrics

FundedNext accounts live or die by hard rules. The dashboard is organized around the two questions a trader asks every session:

1. **Am I about to breach?** — Daily Loss and Max Loss shown as **risk gauges** (green → amber → red by % of buffer consumed, using live equity). Breaching kills the account.
2. **Am I on track to pass / get paid?** — Profit Target progress, Min Trading Days, payout eligibility, and consistency/risk-card compliance that silently affect payouts.

A **portfolio strip** on top flags how many accounts are near-breach or breached so you can jump straight to the one that needs attention.

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

- **Portfolio strip** — the bar under the logo shows total accounts + near-breach/breached counts. Click it to expand a health-sorted list and jump to any account.
- **Switch accounts** — click the account row to open the selector, grouped by CFD / Futures / Competitions with a health dot each.
- **Per-kind objectives** — CFD shows Daily/Max loss gauges, profit target, min days, consistency, and (funded) a Risk Card; Futures shows trailing max loss, consistency $, and max inactive days; Competitions show loss gauges, min days, and leaderboard rank.
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
    Header.tsx          - Logo + refresh
    PortfolioStrip.tsx  - Cross-account counts + health-sorted list
    AccountSelector.tsx - Account switcher grouped by kind, with health dots
    AccountSummary.tsx  - Balance hero + equity / floating P&L / initial
    RiskGauge.tsx       - Loss-buffer gauge (green/amber/red by % consumed)
    ProgressBar.tsx     - Profit target / min days / inactive days bars
    ObjectivesList.tsx  - Renders the correct objective set per account kind
    MetricCard.tsx      - Compact labelled metric (consistency, payout date)
    RiskCardRow.tsx     - Funded-only risk verdicts (quick strike / risk / news)
    LeaderboardRow.tsx  - Competition-only rank + percentile
    StatusBadge.tsx     - Active / Paused / Breached / Passed + reason
    CycleFooter.tsx     - Trading-cycle dates + "Updated X ago"
    DashboardButton.tsx - Link to full dashboard
    EmptyStates.tsx     - Loading / error / no-account states

  lib/
    accountHealth.ts    - getHealth() + portfolio summary (gauge colors + alerts)
    format.ts           - currency / percent / size formatting

  services/
    mockAccountService.ts  - Mock data service (the only file to swap for a real API)

  data/
    mockAccounts.ts     - 6 realistic accounts across CFD / Futures / Competition

  types/
    account.ts          - Account model, mirrors the API objectives schema

  constants.ts          - Dashboard URL + health thresholds
  App.tsx               - Orchestrates strip + account dashboard
  main.tsx              - Entry point
  styles/globals.css    - FundedNext dark theme tokens
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
