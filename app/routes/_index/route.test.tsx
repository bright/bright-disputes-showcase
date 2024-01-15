import { json } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import Index from './route';
import { test, expect } from 'vitest';
import { newDispute, runningDispute } from "~/mocks/disputes";
import AppContextProvider from "~/context";
import React from "react";

test('Renders empty list', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Index,
      loader() {
        return json({ disputes: [], jury: [] });
      },
    },
  ]);

  render(<AppContextProvider account={{ pubKey: newDispute.defendant, seed: '' }} accounts={[]}>
    <RemixStub />
  </AppContextProvider>);

  await waitFor(() => screen.findByText('No disputes yet'));
});

test('Renders proper actions', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Index,
      loader() {
        return json({ disputes: [newDispute, runningDispute], jury: [] });
      },
    },
  ]);

  render(<AppContextProvider account={{ pubKey: newDispute.defendant, seed: '' }} accounts={[]}>
    <RemixStub />
  </AppContextProvider>);

  const deleteButtons = await screen.findAllByText('Delete');
  expect(deleteButtons).toHaveLength(1);

  const showButtons = await screen.findAllByText('Show');
  expect(showButtons).toHaveLength(2);
});
