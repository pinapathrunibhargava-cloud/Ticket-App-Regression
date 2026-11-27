import { test as base, expect } from '@playwright/test';
import { TicketPage } from '../pages/ticket-page';

type TicketFixtures = {
  ticketPage: TicketPage;
};

export const test = base.extend<TicketFixtures>({
  ticketPage: async ({ page }, use) => {
    const ticketPage = new TicketPage(page);

    await use(ticketPage);
  },
});

export { expect };