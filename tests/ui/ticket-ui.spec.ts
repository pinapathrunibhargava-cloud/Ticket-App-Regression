import { test, expect } from '../../fixtures/ticket-fixture';

test.describe('Ticket App - UI Regression Suite', () => {

  test('TC01 - Employee Dashboard Verification @smoke', async ({ ticketPage, page }) => {
    await ticketPage.openApplication();
    await ticketPage.switchPersona('alice.employee');

    await expect(page.getByText('My Support Tickets')).toBeVisible();

    await expect(
      page.getByText(/Tracking \d+ tickets filed under Alice Walker/)
    ).toBeVisible();
  });

  test('TC02 - Support Staff Dashboard Verification @smoke', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();

  // Create a ticket as Charlie
  await ticketPage.switchPersona('charlie.employee');

  const ticketTitle = `TC02 Support Dashboard ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');

  await ticketPage.createTicket(
    ticketTitle,
    'Testing support staff dashboard visibility.'
  );

  // Return to the ticket queue
  await page.getByRole('button', {
    name: '← Back to Ticket Queue',
  }).click();

  // Switch to Support Staff
  await ticketPage.switchPersona('bob.support');

  // Verify support dashboard
  await expect(
    page.getByText('All Support Tickets Queue')
  ).toBeVisible();

  // Verify Charlie's ticket appears
  await expect(
    page.getByText(ticketTitle)
  ).toBeVisible();
});

  // test('TC05 - Employee Cannot Access Support Staff Status Controls', async ({ ticketPage, page }) => {
  //   await ticketPage.openApplication();
  //   await ticketPage.switchPersona('alice.employee');

  //   await ticketPage.openTicketById(75);

  //   await expect(page.getByText('Open').first()).toBeVisible();

  //   await expect(
  //     page.getByRole('button', { name: /update status/i })
  //   ).toHaveCount(0);
  // });

  test('TC06 - Create Ticket with Valid Details @smoke', async ({ ticketPage, page }) => {
    await ticketPage.openApplication();
    await ticketPage.switchPersona('alice.employee');

    await ticketPage.openCreateTicketForm('topbar');

    await ticketPage.createTicket(
      'Laptop battery draining quickly',
      'Laptop battery drains completely within one hour of normal usage.'
    );

    await expect(
      page.getByRole('heading', {
        name: 'Laptop battery draining quickly',
      })
    ).toBeVisible();
  });

  test('TC07 - Create Ticket Without Title', async ({ ticketPage, page }) => {
    await ticketPage.openApplication();
    await ticketPage.switchPersona('alice.employee');

    await ticketPage.openCreateTicketForm('table');

    await ticketPage.descriptionInput.fill(
      'My laptop is not charging when I plug it in.'
    );

    await ticketPage.submitButton.click();

    await expect(
      page.getByText('Title cannot be empty.')
    ).toBeVisible();
  });

  test('TC11 - Ticket Title Boundary Testing', async ({ ticketPage, page }) => {
    await ticketPage.openApplication();
    await ticketPage.switchPersona('alice.employee');

    // Exactly 100 characters: valid boundary
    await ticketPage.openCreateTicketForm('table');

    const validTitle = 'A'.repeat(100);

    await ticketPage.createTicket(
      validTitle,
      'Testing the maximum permitted ticket title length.'
    );

    await expect(
      page.getByRole('heading', { name: validTitle })
    ).toBeVisible();

    // 101 characters: invalid boundary
    await ticketPage.openApplication();
    await ticketPage.switchPersona('alice.employee');
    await ticketPage.openCreateTicketForm('table');

    const invalidTitle = 'B'.repeat(101);

    await ticketPage.titleInput.fill(invalidTitle);

    await ticketPage.descriptionInput.fill(
      'Testing rejection of a title exceeding 100 characters.'
    );

    await ticketPage.submitButton.click();

    await expect(
      page.getByText(
        'Title must not exceed 100 characters (currently 101).'
      )
    ).toBeVisible();
  });

  test('TC17 - Employee Cannot Access Another Employee Ticket', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();

  // Alice creates a ticket
  await ticketPage.switchPersona('alice.employee');

  const title = `TC17 Access Test ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');

  await ticketPage.createTicket(
    title,
    'Testing unauthorized access by another employee.'
  );

  // Charlie attempts to access Alice's ticket
  await ticketPage.switchPersona('charlie.employee');

  const response = await page.request.get(
    'http://localhost:8080/api/tickets',
    {
      headers: {
        'X-User-Id': 'charlie.employee',
        'X-User-Role': 'EMPLOYEE',
      },
    }
  );

  expect(response.ok()).toBeTruthy();

  const tickets = await response.json();

  expect(
    tickets.some((ticket: { title: string }) => ticket.title === title)
  ).toBeFalsy();
});

  test('TC22 - Open to In Progress Status Transition @smoke', async ({ ticketPage, page }) => {
    await ticketPage.openApplication();
    await ticketPage.switchPersona('bob.support');

    const openTicketRow = page.getByRole('row').filter({
      has: page.getByText('Open', { exact: true }),
    }).first();

    await expect(openTicketRow).toBeVisible();

    await openTicketRow.getByRole('button').click();

    const advanceButton = page.getByRole('button', {
      name: 'Advance to "In Progress" ➔',
    });

    await expect(advanceButton).toBeVisible();
    await advanceButton.click();

    await expect(
      page.getByText('In Progress').first()
    ).toBeVisible();
  });

// TC12 - Verify Edit Ticket Form
test('TC12 - Verify Edit Ticket Form', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC12 Edit Form ${Date.now()}`;
  const description = 'Testing the ticket edit form functionality.';

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(title, description);

  await ticketPage.openEditTicketForm();

  await expect(
    page.getByRole('heading', { name: /Edit Ticket #\d+/ })
  ).toBeVisible();

  await expect(ticketPage.titleInput).toHaveValue(title);
  await expect(ticketPage.categoryDropdown).toBeVisible();
  await expect(ticketPage.priorityDropdown).toBeVisible();
  await expect(ticketPage.descriptionInput).toHaveValue(description);
});


// TC13 - Verify Available Ticket Categories
test('TC13 - Verify Available Ticket Categories', async ({ ticketPage }) => {
    await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC13 Categories ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing available ticket categories.'
  );

  await ticketPage.openEditTicketForm();

  const categories =
    await ticketPage.categoryDropdown.locator('option').allTextContents();

  expect(categories).toEqual(
    expect.arrayContaining([
      'Hardware',
      'Software',
      'Network',
      'Access',
      'Other',
    ])
  );
});


// TC14 - Verify Available Priority Options
test('TC14 - Verify Available Priority Options', async ({ ticketPage }) => {
    await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC14 Priorities ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing available ticket priority options.'
  );

  await ticketPage.openEditTicketForm();

  const priorities =
    await ticketPage.priorityDropdown.locator('option').allTextContents();

  expect(priorities).toEqual(
    expect.arrayContaining([
      'Low',
      'Medium',
      'High',
    ])
  );
});


// TC15 - Cancel Ticket Editing
test('TC15 - Cancel Ticket Editing', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC15 Cancel Edit ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing cancellation of ticket editing.'
  );

  await ticketPage.openEditTicketForm();

  await ticketPage.titleInput.fill('Temporary unsaved title');

  await ticketPage.cancelButton.click();

  await expect(
    page.getByRole('heading', { name: title })
  ).toBeVisible();
});


// TC16 - Navigate Back to Ticket Queue
test('TC16 - Navigate Back to Ticket Queue', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC16 Navigation ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing navigation back to the ticket queue.'
  );

  await page.getByRole('button', {
    name: '← Back to Ticket Queue',
  }).click();

  await expect(
    page.getByText('My Support Tickets')
  ).toBeVisible();
});

});

test('TC25 - Invalid Status Transitions', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const uniqueTitle = `TC25 Regression Ticket ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');

  await ticketPage.createTicket(
    uniqueTitle,
    'Testing invalid ticket status transitions.'
  );

  // Return to the ticket queue
  await page.getByRole('button', {
    name: '← Back to Ticket Queue',
  }).click();

  // Switch to support staff
  await ticketPage.switchPersona('bob.support');

  const ticketRow = page.getByRole('row').filter({
    has: page.getByRole('cell', {
      name: uniqueTitle,
      exact: true,
    }),
  });

  await expect(ticketRow).toHaveCount(1);

  await ticketRow.getByRole('button', {
    name: 'View ➔',
  }).click();

  // Capture the valid status update request
  const statusRequestPromise = page.waitForRequest(request =>
    request.method() === 'PATCH' &&
    request.url().endsWith('/status')
  );

  await page.getByRole('button', {
    name: 'Advance to "In Progress" ➔',
  }).click();

  const statusRequest = await statusRequestPromise;

  await expect(
    page.getByText('In Progress').first()
  ).toBeVisible();

  // Attempt invalid transition: IN_PROGRESS → CLOSED
  const requestHeaders = statusRequest.headers();

  const authHeaders = {
    'X-User-Id': requestHeaders['x-user-id'],
    'X-User-Role': requestHeaders['x-user-role'],
    'Content-Type': 'application/json',
  };

  const response = await page.request.patch(
    statusRequest.url(),
    {
      headers: authHeaders,
      data: { status: 'CLOSED' },
    }
  );

  expect(response.status()).toBe(400);
});


test('TC28 - Employee Cannot Comment on Another Employee Ticket', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();

  // Step 1: Alice creates a ticket through the UI
  await ticketPage.switchPersona('alice.employee');

  const ticketTitle = `TC28 Authorization Test ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');

  await ticketPage.createTicket(
    ticketTitle,
    'Testing unauthorized comment access between employees.'
  );

  // Step 2: Retrieve the newly created ticket ID
  const ticketResponse = await page.request.get(
    'http://localhost:8080/api/tickets',
    {
      headers: {
        'X-User-Id': 'alice.employee',
        'X-User-Role': 'EMPLOYEE',
      },
    }
  );

  expect(ticketResponse.status()).toBe(200);

  const tickets = await ticketResponse.json();

  const aliceTicket = tickets.find(
    (ticket: { title: string; id: number }) =>
      ticket.title === ticketTitle
  );

  expect(aliceTicket).toBeTruthy();

  // Step 3: Charlie attempts to comment on Alice's ticket
  const response = await page.request.post(
    `http://localhost:8080/api/tickets/${aliceTicket.id}/comments`,
    {
      headers: {
        'X-User-Id': 'charlie.employee',
        'X-User-Role': 'EMPLOYEE',
      },
      data: {
        content: 'Testing unauthorized comment access.',
      },
    }
  );

  // Step 4: Backend must reject unauthorized access
  expect(response.status()).toBe(403);
});



// TC03 - Employee Can View Own Ticket Details
test('TC03 - Employee Can View Own Ticket Details', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC03 View Ticket ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing employee access to their own ticket details.'
  );

  await expect(
    page.getByRole('heading', { name: title })
  ).toBeVisible();

  await expect(page.getByText('ISSUE DESCRIPTION')).toBeVisible();
});


// TC04 - Verify Ticket Properties
test('TC04 - Verify Ticket Properties', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC04 Properties ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing ticket property information.'
  );

  await expect(page.getByText('TICKET PROPERTIES')).toBeVisible();
  await expect(page.getByText('Requester', { exact: true })).toBeVisible();
  await expect(page.getByText('Category', { exact: true })).toBeVisible();
  await expect(page.getByText('Priority', { exact: true })).toBeVisible();
  await expect(page.getByText('Status', { exact: true })).toBeVisible();
});


// TC05 - Employee Cannot Access Support Staff Status Controls
test('TC05 - Employee Cannot Access Support Staff Status Controls', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC05 Status Access ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing employee restrictions on ticket status updates.'
  );

  await expect(page.getByText('Open').first()).toBeVisible();

  await expect(
    page.getByRole('button', { name: /update status/i })
  ).toHaveCount(0);
});


// TC08 - Verify Comment Section
test('TC08 - Verify Comment Section', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC08 Comments ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing the ticket discussion and activity section.'
  );

  await expect(page.getByText(/Discussion & Activity/)).toBeVisible();
  await expect(ticketPage.commentInput).toBeVisible();
  await expect(ticketPage.postCommentButton).toBeVisible();
});


// TC09 - Employee Can Add Comment
test('TC09 - Employee Can Add Comment', async ({ ticketPage, page }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC09 Comment ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing employee comment functionality.'
  );

  const comment = `Regression test comment ${Date.now()}`;

  await ticketPage.addComment(comment);

  await expect(page.getByText(comment)).toBeVisible();
});


// TC10 - Empty Comment Cannot Be Submitted
test('TC10 - Empty Comment Cannot Be Submitted', async ({ ticketPage }) => {
  await ticketPage.openApplication();
  await ticketPage.switchPersona('alice.employee');

  const title = `TC10 Empty Comment ${Date.now()}`;

  await ticketPage.openCreateTicketForm('table');
  await ticketPage.createTicket(
    title,
    'Testing empty comment validation.'
  );

  await expect(ticketPage.commentInput).toBeEmpty();
  await expect(ticketPage.postCommentButton).toBeDisabled();
});

