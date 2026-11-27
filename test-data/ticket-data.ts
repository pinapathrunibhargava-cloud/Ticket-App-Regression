import { faker } from '@faker-js/faker';

export const personas = {
  employee: {
    userId: 'alice.employee',
    role: 'EMPLOYEE',
  },

  secondEmployee: {
    userId: 'charlie.employee',
    role: 'EMPLOYEE',
  },

  support: {
    userId: 'bob.support',
    role: 'SUPPORT_STAFF',
  },
};

export function generateTicketData() {
  return {
    title: `QA Test Ticket ${faker.string.alphanumeric(8)}`,
    description: `Synthetic test description: ${faker.lorem.sentence()}`,
    category: faker.helpers.arrayElement([
      'Hardware',
      'Software',
      'Network',
      'Access',
      'Other',
    ]),
    priority: faker.helpers.arrayElement([
      'Low',
      'Medium',
      'High',
    ]),
  };
}

export function generateCommentData() {
  return {
    content: `Synthetic QA comment: ${faker.lorem.sentence()}`,
  };
}