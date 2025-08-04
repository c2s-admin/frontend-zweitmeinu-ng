import { test, expect } from '@playwright/test';

const payload = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  subject: 'Hello',
  message: 'Integration test',
  urgency: 'low',
  preferredContact: 'email',
  consent: true,
};

test('POST /api/contact-messages forwards data to Strapi', async ({ request }) => {
  const response = await request.post('/api/contact-messages', { data: payload });
  expect(response.status()).toBe(201);
  const data = await response.json();
  expect(data.attributes.firstName).toBe(payload.firstName);
  expect(data.attributes).toHaveProperty('submittedAt');
});
