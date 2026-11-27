import { test, expect, APIRequestContext } from '@playwright/test';
import {
  personas,
  generateTicketData,
  generateCommentData,
} from '../../test-data/ticket-data';

// API tests should communicate with the Spring Boot backend
test.use({
  baseURL: 'http://localhost:8080',
});

const employeeHeaders = {
  'X-User-Id': personas.employee.userId,
  'X-User-Role': personas.employee.role,
};

const secondEmployeeHeaders = {
  'X-User-Id': personas.secondEmployee.userId,
  'X-User-Role': personas.secondEmployee.role,
};

const supportHeaders = {
  'X-User-Id': personas.support.userId,
  'X-User-Role': personas.support.role,
};

// Reusable ticket creation function
async function createTicket(request: APIRequestContext) {
  const response = await request.post('/api/tickets', {
    headers: employeeHeaders,
    data: generateTicketData(),
  });

  expect(response.status()).toBe(201);

  return await response.json();
}

test.describe('Employee Support Ticket API - Regression Pack', () => {

  // TC01 - Get all tickets
  test('TC01 - Retrieve all employee tickets @smoke', async ({ request }) => {
    const response = await request.get('/api/tickets', {
      headers: employeeHeaders,
    });

    expect(response.status()).toBe(200);
    expect(Array.isArray(await response.json())).toBeTruthy();
  });

  // TC02 - Create ticket
  test('TC02 - Create a new ticket @smoke', async ({ request }) => {
    const response = await request.post('/api/tickets', {
      headers: employeeHeaders,
      data: generateTicketData(),
    });

    expect(response.status()).toBe(201);

    const ticket = await response.json();

    expect(ticket.id).toBeTruthy();
    expect(ticket.title).toBeTruthy();
    expect(ticket.status).toBeTruthy();
  });

  // TC03 - Get ticket by ID
  test('TC03 - Retrieve ticket by ID @smoke', async ({ request }) => {
    const ticket = await createTicket(request);

    const response = await request.get(`/api/tickets/${ticket.id}`, {
      headers: employeeHeaders,
    });

    expect(response.status()).toBe(200);

    const result = await response.json();

    expect(result.id).toBe(ticket.id);
    expect(result.title).toBe(ticket.title);
  });

  // TC04 - Update ticket
  test('TC04 - Update existing ticket details', async ({ request }) => {
    const ticket = await createTicket(request);

    const updatedData = {
      ...generateTicketData(),
      title: 'Updated QA Regression Ticket',
    };

    const response = await request.put(`/api/tickets/${ticket.id}`, {
      headers: employeeHeaders,
      data: updatedData,
    });

    expect(response.status()).toBe(200);

    const result = await response.json();

    expect(result.title).toBe(updatedData.title);
    expect(result.description).toBe(updatedData.description);
  });

  // TC05 - Update ticket status
  test('TC05 - Support staff updates ticket status @smoke', async ({ request }) => {
    const ticket = await createTicket(request);

    const response = await request.patch(
      `/api/tickets/${ticket.id}/status`,
      {
        headers: supportHeaders,
        data: {
          status: 'In Progress',
        },
      }
    );

    expect(response.status()).toBe(200);

    const result = await response.json();

    expect(result.status).toBe('In Progress');
  });

  // TC06 - Get ticket comments
  test('TC06 - Retrieve comments for a ticket', async ({ request }) => {
    const ticket = await createTicket(request);

    const response = await request.get(
      `/api/tickets/${ticket.id}/comments`,
      {
        headers: employeeHeaders,
      }
    );

    expect(response.status()).toBe(200);
    expect(Array.isArray(await response.json())).toBeTruthy();
  });

  // TC07 - Add a comment
// TC07 - Add a comment
test('TC07 - Add a comment to a ticket', async ({ request }) => {
  const ticket = await createTicket(request);

  const commentData = generateCommentData();

  const response = await request.post(
    `/api/tickets/${ticket.id}/comments`,
    {
      headers: employeeHeaders,
      data: commentData,
    }
  );

  expect(response.status()).toBe(201);

  const comment = await response.json();

  expect(comment.id).toBeTruthy();
  expect(comment.content).toBe(commentData.content);
  expect(comment.author).toBe(personas.employee.userId);
  expect(comment.authorRole).toBe('EMPLOYEE');
  expect(comment.ticketId).toBe(ticket.id);
  expect(comment.createdAt).toBeTruthy();
});

  // TC08 - Reject invalid ticket data
  test('TC08 - Reject ticket with empty title', async ({ request }) => {
    const invalidData = {
      ...generateTicketData(),
      title: '',
    };

    const response = await request.post('/api/tickets', {
      headers: employeeHeaders,
      data: invalidData,
    });

    expect(response.status()).toBe(400);
  });

  // TC09 - Reject request without identity headers
  test('TC09 - Reject request without identity headers', async ({ request }) => {
    const response = await request.get('/api/tickets');

    expect(response.status()).toBe(400);

    const error = await response.json();

    expect(error.status).toBe(400);
    expect(error.message).toContain('Missing required demo identity headers');
  });

  // TC10 - Prevent access to another employee's ticket
  test('TC10 - Prevent unauthorized employee ticket access', async ({ request }) => {
    const ticket = await createTicket(request);

    const response = await request.get(`/api/tickets/${ticket.id}`, {
      headers: secondEmployeeHeaders,
    });

    expect(response.status()).toBe(403);
  });

});

// TC11 - Employee cannot update ticket status
test('TC11 - Prevent employee from updating ticket status', async ({ request }) => {
  const ticket = await createTicket(request);

  const response = await request.patch(
    `/api/tickets/${ticket.id}/status`,
    {
      headers: employeeHeaders,
      data: {
        status: 'In Progress',
      },
    }
  );

  expect(response.status()).toBe(403);
});


// TC12 - Support staff cannot create tickets
test('TC12 - Prevent support staff from creating tickets', async ({ request }) => {
  const response = await request.post('/api/tickets', {
    headers: supportHeaders,
    data: generateTicketData(),
  });

  expect(response.status()).toBe(403);
});


// TC13 - Support staff cannot edit ticket details
test('TC13 - Prevent support staff from editing ticket details', async ({ request }) => {
  const ticket = await createTicket(request);

  const updatedData = {
    ...generateTicketData(),
    title: 'Unauthorized Support Update',
  };

  const response = await request.put(
    `/api/tickets/${ticket.id}`,
    {
      headers: supportHeaders,
      data: updatedData,
    }
  );

  expect(response.status()).toBe(403);
});


// TC14 - Reject invalid status transition
test('TC14 - Reject invalid ticket status transition', async ({ request }) => {
  const ticket = await createTicket(request);

  const response = await request.patch(
    `/api/tickets/${ticket.id}/status`,
    {
      headers: supportHeaders,
      data: {
        status: 'Closed',
      },
    }
  );

  expect(response.status()).toBe(400);
});


// TC15 - Reject invalid user identity
test('TC15 - Reject request with invalid user identity', async ({ request }) => {
  const invalidHeaders = {
    'X-User-Id': 'unknown.user',
    'X-User-Role': 'EMPLOYEE',
  };

  const response = await request.get('/api/tickets', {
    headers: invalidHeaders,
  });

  expect(response.status()).toBe(400);
});