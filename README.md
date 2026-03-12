# ChainBoard — Frontend

Next.js 16 frontend for ChainBoard, a Web3 portfolio dashboard and savings vault on the Ethereum Sepolia testnet. Users connect their MetaMask wallet, authenticate via Sign-In with Ethereum (SIWE), and interact with their on-chain assets through a clean, responsive interface.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Pages](#pages)
- [Key Hooks](#key-hooks)
- [Smart Contract](#smart-contract)

---

## Features

- **Wallet Authentication** — SIWE flow: connect MetaMask → request nonce from backend → sign message → verify signature → receive HTTP-only JWT cookie
- **Protected Routes** — Next.js middleware guards `/portfolio`, `/vault`, and `/activity`; redirects to login if no JWT cookie
- **Portfolio Dashboard** — Live ETH + ERC-20 token balances (USDC, EURC, LINK) with USD valuations via CryptoCompare, auto-refreshed every 10 seconds
- **Savings Vault** — Deposit and withdraw ETH to/from the Solidity smart contract with real-time transaction lifecycle tracking (signing → pending → confirmed)
- **Activity Log** — Transaction history with filtering by type (All / Deposits / Withdrawals) and pagination
- **Risk Indicators** — Concentration warning when any single asset exceeds 70% of the portfolio; liquidity warning when vault exceeds 50%
- **Force Logout** — Automatically logs the user out on wallet disconnect or account switch in MetaMask
- **Responsive Design** — Collapsible sidebar on desktop, hamburger menu on mobile

---

## Tech Stack

| Technology           | Version | Purpose                                                                                   |
| -------------------- | ------- | ----------------------------------------------------------------------------------------- |
| Next.js (App Router) | 16      | React framework with SSR, middleware, and routing                                         |
| React                | 19      | UI library                                                                                |
| TypeScript           | 5       | Type safety                                                                               |
| wagmi                | 3       | Ethereum wallet hooks (`useAccount`, `useBalance`, `useReadContract`, `useWriteContract`) |
| viem                 | 2       | Low-level Ethereum utilities (`formatEther`, `parseEther`, `verifyMessage`)               |
| TanStack React Query | 5       | Server state caching (token prices, activity history)                                     |
| Redux Toolkit        | 2       | Global client state (auth, vault balances)                                                |
| Tailwind CSS         | 4       | Utility-first styling                                                                     |
| Zod                  | 4       | Runtime schema validation for forms                                                       |
| react-hook-form      | 7       | Form state management                                                                     |
| Lucide React         | —       | Icon library                                                                              |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout — Geist font, providers
│   ├── page.tsx                 # Auth page (wallet connect + SIWE login)
│   ├── providers.tsx            # Redux + wagmi + React Query providers
│   ├── globals.css              # Global styles and CSS variables
│   └── (protected)/
│       ├── layout.tsx           # Protected layout — sidebar, navbar, force-logout watcher
│       ├── portfolio/
│       │   └── page.tsx         # Portfolio page
│       ├── vault/
│       │   └── page.tsx         # Vault page
│       └── activity/
│           └── page.tsx         # Activity page
│
├── components/
│   ├── activity/
│   │   ├── ActivityFilters.tsx  # Type filter + page size selector
│   │   ├── ActivityTable.tsx    # Transaction rows with Etherscan links
│   │   └── Pagination.tsx       # Page controls
│   ├── layout/
│   │   ├── Navbar.tsx           # Top navbar with wallet address + disconnect
│   │   └── Sidebar.tsx          # Navigation sidebar
│   ├── portfolio/
│   │   ├── Alert.tsx            # Warning / info alert banner
│   │   ├── PortfolioSummary.tsx # Total portfolio, wallet ETH, vault ETH stat cards
│   │   ├── RiskIndicatorSection.tsx # Concentration + liquidity risk alerts
│   │   ├── StatCards.tsx        # Individual stat card component
│   │   ├── TokenCard.tsx        # Single ERC-20 token card
│   │   └── TokensSection.tsx    # ERC-20 token grid with loading skeletons
│   ├── vault/
│   │   ├── DepositCards.tsx     # Deposit ETH form with USD preview
│   │   ├── VaultStat.tsx        # Vault TVL / user balance stat card
│   │   └── WithdrawCard.tsx     # Withdraw ETH form with USD preview
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Loader.tsx
│       ├── SectionLabel.tsx
│       ├── StatusBadge.tsx
│       ├── Table.tsx
│       └── Toast.tsx
│
├── constants/
│   ├── constants.ts             # Shared constants (refetch interval, status delays)
│   ├── contract.ts              # Vault contract address + ABI
│   ├── erc20Abi.ts              # ERC-20 balanceOf ABI (as const for viem)
│   ├── erc20Tokens.ts           # ERC-20 token list with addresses and decimals
│   └── tokens.ts                # TOKENS array (USDC, EURC, LINK) on Sepolia
│
├── hooks/
│   ├── useActivity.ts           # TanStack Query — fetch activity history from backend
│   ├── useEthPrice.ts           # Fetch ETH/USD price (legacy, prefer useTokenPrices)
│   ├── useTokenBalances.ts      # wagmi multicall — ERC-20 balances for connected wallet
│   ├── useTokenPrices.ts        # TanStack Query — live USD prices for ETH + all tokens (10s refresh)
│   └── useVault.ts              # Vault reads + deposit/withdraw write flow + activity invalidation
│
├── lib/
│   └── wagmi.tsx                # wagmi config (Sepolia, Alchemy RPC) + QueryClient
│
├── services/
│   ├── activityService.ts       # fetch activity history / log new activity
│   ├── authService.ts           # nonce, verify, me, logout API calls
│   ├── ethPriceService.ts       # CryptoCompare ETH price fetch
│   └── tokenPricesService.ts    # CryptoCompare multi-token price fetch (ETH, USDC, EURC, LINK)
│
├── store/
│   ├── index.tsx                # Redux store
│   └── slices/
│       ├── authSlice.ts         # address, loading state
│       └── vaultSlice.ts        # userBalance, totalDeposits, walletBalance
│
├── types/
│   └── index.ts                 # Shared TypeScript types
│
├── utils/
│   ├── riskCalculator.ts        # Pure TS — concentration + liquidity risk logic
│   └── utils.ts                 # cn(), formatToUSD(), formatToPercentage()
│
└── middleware.ts                 # JWT cookie guard — redirects unauthenticated users
```

---

## Environment Variables

Create a `.env` file in the `chainboard-frontend` directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://eth-sepolia.g.alchemy.com/v2
NEXT_PUBLIC_ALCHEMY_RPC_KEY=your-alchemy-api-key
NEXT_PUBLIC_CRYPTOCOMPARE_URL=https://min-api.cryptocompare.com/data/pricemulti
NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY=your-cryptocompare-api-key
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MetaMask browser extension
- Sepolia testnet ETH (from a [Sepolia faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia))
- Backend server running on `http://localhost:8000` (see `chainboard-backend/README.md`)

### Install and run

```bash
cd chainboard-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm start
```

---

## Pages

| Route        | Description                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `/`          | Wallet connect + SIWE login. Redirects to `/portfolio` if already authenticated.                 |
| `/portfolio` | Portfolio summary (total value, wallet ETH, vault ETH), ERC-20 token cards, and risk indicators. |
| `/vault`     | Deposit and withdraw ETH. Shows vault TVL, user balance, and live USD previews.                  |
| `/activity`  | Filterable transaction history with pagination and Etherscan links.                              |

---

## Key Hooks

### `useTokenPrices`

Fetches live USD prices for ETH, USDC, EURC, and LINK from CryptoCompare every 10 seconds via TanStack Query. Returns a `getPrice(symbol)` helper used across portfolio, vault, and activity pages.

```ts
const { getPrice, isLoading } = useTokenPrices();
const ethPrice = getPrice("ETH"); // number
```

### `useTokenBalances`

Uses wagmi `useReadContracts` to multicall ERC-20 `balanceOf` for the connected wallet across all tokens in `TOKENS`. Returns formatted balance values with loading state.

### `useVault`

Handles all vault interactions — reads (`getUserBalance`, `totalDeposits`, wallet balance), writes (`deposit`, `withdraw`), and transaction lifecycle tracking. On success, invalidates the `["activity", address]` TanStack Query cache and syncs balances to Redux.

### `useActivity`

Fetches transaction history from the backend with TanStack Query (`staleTime: 30s`). Query key includes the wallet address so each user gets isolated cache.

---

## Smart Contract

The savings vault is deployed on **Sepolia** at:

```
0x371BA051916A28b2fEf5210b31147Ff0aA0cEc7b
```

| Function                   | Description                        |
| -------------------------- | ---------------------------------- |
| `deposit()`                | Deposit ETH (payable)              |
| `withdraw(uint256 amount)` | Withdraw ETH from vault            |
| `getUserBalance(address)`  | Read a user's deposited balance    |
| `totalDeposits()`          | Read total ETH locked in the vault |

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
