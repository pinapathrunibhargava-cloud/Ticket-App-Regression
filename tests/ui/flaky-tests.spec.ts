import { test, expect } from '@playwright/test';

test('FT01 - Demonstrate timing-related flakiness', async ({ page }) => {
    test.setTimeout(10000);
    page.setDefaultTimeout(5000);

  await page.setContent(`
    <html>
      <body>
        <h1>Ticket Dashboard</h1>

        <script>
          const delay = Math.floor(Math.random() * 200) + 50;

          setTimeout(() => {
            const button = document.createElement('button');
            button.textContent = 'Create Ticket';
            document.body.appendChild(button);
          }, delay);
        </script>
      </body>
    </html>
  `);

const button = page.getByRole('button', {
  name: 'Create Ticket'
});

await expect(button).toBeVisible({ timeout: 1000 });

});