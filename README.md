# Atara - Minimalist Fasting Tracker

Atara is a minimalist, open-source intermittent fasting tracker. We believe in simplicity, privacy, and full control over your health data.

## Features
- **Fast Tracking:** Log your fasting windows with an intuitive interface.
- **Progress Stats:** Visualize your fasting history.
- **AI-Powered Insights:** Personalized analysis for your fasting journey.
- **Privacy-First:** Your data stays yours.

## License
This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE).

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm / pnpm / yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/builtbygeo/atarafast.git
   cd atarafast
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Copy the example file and set your variables:
   ```bash
   cp .env.example .env
   ```
   Ensure `NEXT_PUBLIC_ENABLE_PREMIUM=false` is set. This disables paid features, as the core application is free for everyone.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Contributing
We welcome community contributions! Please check our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to open Pull Requests or report issues.
