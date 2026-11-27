# Ticket App – Automated Regression Suite

## 1. Project Overview

This project contains an automated regression testing suite for the Employee Support Ticket Management System.

The suite uses Playwright with TypeScript to validate the application's UI and REST APIs, including functional workflows, role-based access, validation rules, negative scenarios, and status transitions.

## 2. Technologies Used

- Playwright
- TypeScript
- Node.js
- Faker.js
- Chromium Browser
- REST API Testing

## 3. Project Structure

```text
Ticket-App-Regression/
├── tests/
│   ├── ui/
│   │   └── ticket-ui.spec.ts
│   └── api/
│       └── ticket-api.spec.ts
├── pages/
│   └── ticket-page.ts
├── fixtures/
│   └── ticket-fixture.ts
├── test-data/
│   └── ticket-data.ts
├── playwright-report/
├── playwright.config.ts
├── package.json
└── README.md
```

## 4. Application Setup

The Ticket Management application must be running before executing the regression tests.

| Component | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |

The application uses MySQL as its database.

## 5. Installation

Install project dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## 6. Test Execution Commands

Run the complete regression suite:

```bash
npx playwright test --project=chromium
```

Run UI tests:

```bash
npx playwright test tests/ui/ticket-ui.spec.ts --project=chromium
```

Run API tests:

```bash
npx playwright test tests/api/ticket-api.spec.ts --project=chromium
```

Run smoke tests:

```bash
npx playwright test --grep "@smoke" --project=chromium
```

Generate and open the HTML report:

```bash
npx playwright show-report
```

## 7. Test Coverage Map

### UI Regression Tests – 20 Tests

| Test Area | Coverage |
|---|---|
| Dashboard | Employee and Support Staff dashboards |
| Ticket Details | Ticket visibility and property verification |
| Role-Based Access | Employee restrictions and ticket ownership |
| Ticket Creation | Valid and invalid ticket creation |
| Comments | Comment visibility, submission, and validation |
| Ticket Editing | Edit form, categories, priorities, and cancellation |
| Navigation | Ticket queue navigation |
| Status Management | Valid and invalid status transitions |

### API Regression Tests – 15 Tests

| Test Area | Coverage |
|---|---|
| Ticket Retrieval | Get all tickets and retrieve by ID |
| Ticket Creation | Create tickets with valid data |
| Ticket Updates | Update existing ticket details |
| Status Management | Valid and invalid status updates |
| Comments | Retrieve and add comments |
| Input Validation | Reject empty ticket titles |
| Authentication/Identity | Missing and invalid identity headers |
| Authorization | Prevent unauthorized ticket access |
| Role Restrictions | Employee and Support Staff permissions |

## 8. Test Data Management

Synthetic test data is generated using Faker.js.

The shared test-data file contains:

- Employee personas
- Support Staff persona
- Dynamic ticket data
- Dynamic comment data

This helps reduce hardcoded test data and supports repeatable test execution.

## 9. Regression Execution Results

The regression suite contains:

- UI Tests: 20
- API Tests: 15
- Total Tests: 35

Final Chromium execution:

- Passed: 35
- Failed: 0
- Pass Rate: 100%

The suite was also executed five consecutive times with retries disabled. All 175 test executions passed, with no flaky failures observed.

## 10. Flakiness Assessment

The five-run reliability assessment is documented in the regression flakiness log.

File: `flakiness-log.md`

## 11. Reports

The Playwright HTML report is generated in:

```text
playwright-report/index.html
```

Open the report using:

```bash
npx playwright show-report
```
## Local Flaky Test Reproduction

### Objective
To reproduce intermittent Playwright test failures locally by executing tests repeatedly and detecting flaky retries.

### Command Executed

```bash
npx playwright test tests/ui/flaky-tests.spec.ts --project=chromium --repeat-each=10 --retries=1 --fail-on-flaky-tests --reporter=list
```

### Execution Results

| Metric | Result |
|---|---:|
| Total executions | 10 |
| Passed | 10 |
| Failed | 0 |
| Flaky retries | 0 |

### Conclusion
Successfully executed the flaky test 10 consecutive times locally. All executions passed without requiring retries, indicating stable test behavior after fixing the timing-related synchronization issue.
## 12. Conclusion

The project delivers a 35-test automated regression suite covering critical UI workflows and REST API functionality.

It includes reusable Page Object Model components, fixtures, shared test data, smoke testing, negative scenarios, and a five-run reliability assessment.