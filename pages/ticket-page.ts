import { Page, Locator, expect } from '@playwright/test';

export class TicketPage {
  readonly page: Page;
  readonly personaSelector: Locator;
  readonly createTicketTopButton: Locator;
  readonly createTicketTableButton: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly editTicketContentButton: Locator;

    readonly categoryDropdown: Locator;
    readonly priorityDropdown: Locator;
    readonly saveChangesButton: Locator;
    readonly cancelButton: Locator;

    readonly commentInput: Locator;
    readonly postCommentButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.personaSelector = page.getByLabel('Switch Persona');

    this.createTicketTopButton = page.locator('#topbar-create-ticket-btn');
    this.createTicketTableButton = page.locator('#table-create-ticket-btn');
    this.editTicketContentButton = page.getByRole('button', {
  name: 'Edit Ticket Content',
});

this.categoryDropdown = page.getByLabel('Category *');

this.priorityDropdown = page.getByLabel('Urgency / Priority *');

this.saveChangesButton = page.getByRole('button', {
  name: 'Save Changes',
});

this.cancelButton = page.getByRole('button', {
  name: 'Cancel',
});

this.commentInput = page.getByPlaceholder(
  'Provide additional details, diagnostic output, or resolution steps...'
);

this.postCommentButton = page.getByRole('button', {
  name: 'Post Comment',
});

    this.titleInput = page.getByRole('textbox', {
      name: 'Issue Summary / Title *',
    });

    this.descriptionInput = page.getByRole('textbox', {
      name: 'Detailed Description *',
    });

    this.submitButton = page.getByRole('button', {
      name: 'Submit Support Ticket',
    });
  }

  async openApplication() {
    await this.page.goto('/');
  }

  async switchPersona(userId: string) {
    await this.personaSelector.selectOption(userId);
  }

  async openCreateTicketForm(location: 'topbar' | 'table' = 'topbar') {
    if (location === 'topbar') {
      await this.createTicketTopButton.click();
    } else {
      await this.createTicketTableButton.click();
    }
  }

  async createTicket(title: string, description: string) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.submitButton.click();
  }

 async openTicketById(ticketId: number) {
  const ticketRow = this.page.getByRole('row').filter({
    has: this.page.getByRole('cell', {
      name: `#${ticketId}`,
      exact: true,
    }),
  });

  await expect(ticketRow).toHaveCount(1);

  await ticketRow.getByRole('button', {
    name: 'View ➔',
  }).click();
}
async openEditTicketForm() {
  await this.editTicketContentButton.click();
}

async updateTicketDetails(
  title: string,
  category: string,
  priority: string,
  description: string
) {
  await this.titleInput.fill(title);
  await this.categoryDropdown.selectOption({ label: category });
  await this.priorityDropdown.selectOption({ label: priority });
  await this.descriptionInput.fill(description);

  await this.saveChangesButton.click();
}

async addComment(comment: string) {
  await this.commentInput.fill(comment);
  await this.postCommentButton.click();
}
async openTicketByTitle(title: string) {
  const ticketRow = this.page.getByRole('row').filter({
    has: this.page.getByRole('cell', {
      name: title,
      exact: true,
    }),
  });

  await expect(ticketRow).toHaveCount(1);

  await ticketRow.getByRole('button', {
    name: 'View ➔',
  }).click();
}
}