# AtaraFast – Open Source Core

**Master Your Metabolism**  
AI-powered fasting timer, progress tracker and electrolyte insights.

This is the **open-source core** (AGPL-3.0) of the AtaraFast app.

The full Pro version with advanced AI features lives at → **[https://app.atarafast.com](https://app.atarafast.com)**

## ✨ What's included

- Fasting timer with streak counter
- Calendar of past & future fasts
- Weekly activity graphs & stats
- Basic electrolyte & minerals tracker
- Journal & notes
- Onboarding flow
- Fully responsive PWA (works offline)
- Modern UI with Shadcn components

## 🚀 Pro features (hosted version only)

- Advanced AI metabolism insights
- Custom protocol builder
- Premium electrolyte recommendations
- Stripe subscriptions & user accounts

## How to self-host

```bash
git clone https://github.com/builtbygeo/atarafast.git
cd atarafast
npm install
cp .env.example .env.local   # add your own keys
npm run dev
