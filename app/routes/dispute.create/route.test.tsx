import { createRemixStub } from '@remix-run/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CreateDispute from './route';
import { test } from 'vitest';
import AppContextProvider from "~/context";
import { newDispute } from "~/mocks/disputes";
import { json } from "@remix-run/node";

const linkErrorMsg = 'Link is required';
const defendantErrorMsg = 'Defendant is required';
const escrowErrorMsg = 'Escrow is required';

test('Displays error messages', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: CreateDispute,
      action: () => {
        return json({errors: {link: linkErrorMsg, defendant: defendantErrorMsg, escrow: escrowErrorMsg}});
      }
    },
  ]);

  render(<AppContextProvider account={{pubKey: newDispute.defendant, seed: ''}} accounts={[]}>
    <RemixStub/>
  </AppContextProvider>);

  fireEvent.click(screen.getByText('Create dispute'))

  await waitFor(() => screen.findByText(linkErrorMsg));
  await waitFor(() => screen.findByText(defendantErrorMsg));
  await waitFor(() => screen.findByText(escrowErrorMsg));
});
