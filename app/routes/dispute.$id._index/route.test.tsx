import { json } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';
import { render, screen } from '@testing-library/react';
import DisputeDetails from './route';
import { expect, test } from 'vitest';
import { newDispute } from "~/mocks/disputes";
import React from "react";
import AppContextProvider from "~/context";

test('Dispute details route renders proper actions', async () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: DisputeDetails,
      loader() {
        return json({ dispute: newDispute, jury: [], dataKeys: [] });
      },
    },
  ]);

  render(<AppContextProvider account={{ pubKey: newDispute.defendant, seed: '' }} accounts={[]}>
    <RemixStub />
  </AppContextProvider>);

  const processButton = await screen.findByText('Process dispute round') as HTMLButtonElement;
  const confirmDefendantButton = await screen.findByText('Confirm as defendant') as HTMLButtonElement;
  const confirmJudgeButton = await screen.findByText('Confirm judge participation') as HTMLButtonElement;
  const confirmJurorButton = await screen.findByText('Confirm juror participation') as HTMLButtonElement;
  const voteOwnerButton = await screen.findByText('Vote for owner') as HTMLButtonElement;
  const voteDefendantButton = await screen.findByText('Vote for defendant') as HTMLButtonElement;

  expect(processButton.disabled).toBeTruthy();
  expect(confirmDefendantButton.disabled).toBeFalsy();
  expect(confirmJudgeButton.disabled).toBeTruthy();
  expect(confirmJurorButton.disabled).toBeTruthy();
  expect(voteOwnerButton.disabled).toBeTruthy();
  expect(voteDefendantButton.disabled).toBeTruthy();
});
