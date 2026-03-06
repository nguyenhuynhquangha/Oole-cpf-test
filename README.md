# CPF Automation Suite

This repository contains a Playwright-based end-to-end testing framework for the CPF (Central Provident Fund) web application. It includes test scripts, utility helpers, and configuration files required to run the automated tests.

## 🚀 Features

- Playwright test runner configured via `playwright.config.ts`
- Page object model used for maintainable test code (e.g. `pages/login.page.ts`)
- Utility methods for interacting with Google Sheets (`utils/googleSheet.ts`)
- A collection of spec files under `tests/` for different flows (CPF, Google Sheets, login)

## 📁 Repository Structure

```
package.json                 # project dependencies and scripts
playwright.config.ts         # Playwright configuration file
config/env.ts                # environment-specific variables
service-account.json         # credentials for Google services
pages/                       # page objects
tests/                       # Playwright spec files
utils/                       # helper utilities
``` 

## ⚙️ Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn

## 🛠️ Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cpf
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Optional: configure environment variables in `config/env.ts` if needed.
4. Ensure `service-account.json` is present for Google Sheets authentication.

## 🧪 Running Tests

### Run all tests

```bash
npx playwright test
```

### Run a specific spec

```bash
npx playwright test tests/cpf-test.spec.ts
```

### Generate HTML report

```bash
npx playwright show-report
```

Reports are output to `playwright-report/` by default.

## 📦 Contributing

1. Fork the repository
2. Create a new branch
3. Add tests or make enhancements
4. Submit a pull request with a detailed description

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

Feel free to adjust the content above based on the actual project details.
