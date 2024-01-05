import { json } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import Index from './route';
import { test, expect } from 'vitest';
import { newDispute, runningDispute } from "~/mocks/disputes";

test('Renders empty list', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Index,
      loader() {
        return json([]);
      },
    },
  ]);

  render(<RemixStub />);

  await waitFor(() => screen.findByText('No disputes yet'));
});

test('Renders proper actions', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Index,
      loader() {
        return json([newDispute, runningDispute]);
      },
    },
  ]);

  render(<RemixStub />);

  const deleteButtons = await screen.findAllByText('Delete');
  expect(deleteButtons).toHaveLength(1);

  const showButtons = await screen.findAllByText('Show');
  expect(showButtons).toHaveLength(2);
});
