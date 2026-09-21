# FundedNext Chrome Extension

A lightweight Chrome extension that shows your FundedNext account health at a glance. Click the extension icon to instantly see balance, P&L, drawdown limits, and account status in a compact popup.

**This is a UX/functional MVP with mock data.** No real API integration yet.

## Quick Start

```bash
npm install
npm run build
```

## Load into Chrome

1. Run `npm run build` to generate the `dist/` folder
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer Mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the `dist` folder from this project
6. Pin the **FundedNext** extension in your toolbar
7. Click the FundedNext icon

## Test the Extension

- **View account** — Click the extension icon. You should see the Stellar 2-Step $100K account dashboard.
- **Switch accounts** — Click the account name at the top to open the selector. Pick any of the 3 mock accounts.
- **Refresh** — Click the refresh icon in the header. Balance and P&L will shift slightly to simulate live data.
- **Open Dashboard** — Click "Open Full Dashboard" at the bottom. It opens `fundednext.com/dashboard` in a new tab.

## Development

```bash
npm run dev
```

Opens a local dev server. You can preview the popup UI in a browser at `localhost:5173`.

## Project Structure

```
src/
  components/       # React UI components
    Header.tsx          - Logo and refresh button
    AccountSelector.tsx - Account switcher dropdown
    AccountSummary.tsx  - Balance and P&L display
    MetricCard.tsx      - Drawdown metric cards
    StatusBadge.tsx     - Account status indicator
    Timestamp.tsx       - "Updated X ago" display
    DashboardButton.tsx - Link to full dashboard
    EmptyStates.tsx     - Loading, error, empty states

  services/
    mockAccountService.ts  - Mock data fetching (replace with real API later)

  data/
    mockAccounts.ts    - Static mock account data

  types/
    account.ts         - TypeScript interfaces

  constants.ts         - Dashboard URL and config
  App.tsx             - Main application
  main.tsx            - Entry point
  styles/
    globals.css        - Global styles and CSS variables
```

## Connecting a Real API

When the FundedNext API is available, replace the mock service:

1. **`src/services/mockAccountService.ts`** — Replace `fetchAccounts()` and `refreshAccount()` with real API calls. The function signatures stay the same.
2. **`src/constants.ts`** — Update the dashboard URL if needed.
3. **`src/types/account.ts`** — Extend the `Account` interface to match the API response.
4. **`manifest.json`** — Add the API domain to `permissions` and/or `host_permissions`.

No UI changes needed. The service layer is fully decoupled from the components.
