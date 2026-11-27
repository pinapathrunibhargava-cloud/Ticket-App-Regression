# Flaky Test Policy

## 1. Purpose

This policy defines how flaky tests are identified, tracked, assigned, and fixed to maintain reliable automated regression testing.

## 2. Definition

A flaky test is a test that produces inconsistent results under the same application code and testing environment without an intentional change.

For example, a test may fail on its first attempt but pass when automatically retried.

## 3. Detection

- CI executes tests with a maximum of one retry.
- Playwright uses `--fail-on-flaky-tests` to ensure retry-passing tests are still reported as failures.
- QA engineers review the HTML report, traces, videos, and application logs.
- Each flaky test must be recorded with its test ID, failure details, CI run link, suspected cause, and assigned owner.

## 4. Quarantine Process

- A repeatedly unstable test may be temporarily quarantined with QA approval.
- The test must be tagged with `@quarantined`.
- Every quarantined test must have a documented reason, assigned owner, tracking issue, and review date.
- Quarantined tests must continue running separately as non-blocking diagnostic tests.
- Quarantine must never become a permanent way to ignore failures.

## 5. Ownership and Responsibilities

- **Test Author:** Investigates failures and provides initial fixes.
- **Module Owner:** Checks application-related causes.
- **QA Owner:** Tracks flaky tests, reviews reports, and monitors resolution.

Every flaky test must have one clearly assigned owner.

## 6. Resolution SLA

| Action | Target Time |
|---|---|
| Initial investigation | Within 1 business day |
| Fix or mitigation | Within 3 business days |
| Quarantine review and resolution | Within 5 business days |

Unresolved issues must be escalated to the QA lead.

## 7. Exit Criteria

A quarantined test can return to the main regression suite after:

- The root cause has been identified and fixed.
- It passes 10 consecutive executions without failures.
- The fix is reviewed and approved.

## 8. Policy Rules

- Do not increase retries simply to hide failures.
- Do not permanently disable unstable tests.
- Prefer reliable locators, proper waits, and independent test data.
- Preserve failure reports and debugging artifacts.
- Track every flaky test until it is resolved.

## 9. Conclusion

This policy helps maintain a reliable CI quality gate by ensuring that flaky tests are visible, assigned, investigated, and resolved rather than silently ignored.