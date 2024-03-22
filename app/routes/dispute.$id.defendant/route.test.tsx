import { createRemixStub } from '@remix-run/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ConfirmDefendant from './route';
import { test } from 'vitest';
import AppContextProvider from "~/context";
import { newDispute } from "~/mocks/disputes";
import { json } from "@remix-run/node";

const errorMsg = 'Link is required';

test('Displays error messages', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: ConfirmDefendant,
      action: () => {
        return json({errors: {link: errorMsg}});
      }
    },
  ]);

  render(<AppContextProvider account={{pubKey: newDispute.defendant, seed: ''}} accounts={[]}>
    <RemixStub/>
  </AppContextProvider>);

  fireEvent.click(screen.getByText('Confirm defendant'));

  await waitFor(() => screen.findByText(errorMsg));
});
