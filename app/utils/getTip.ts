import { Dispute } from "~/types";

export const getTip = (dispute: Dispute) => {
  if (!dispute) return '';

  if (dispute.state === 'Ended') {
    return `Resolved in favor of the ${dispute.disputeResult ? 'owner' : 'defendant'}`;
  }

  if (dispute.disputeRound?.state === 'CountingTheVotes') {
    return "Waiting for the judge to announce the verdict by round processing"
  }

  if (dispute.disputeRound?.state === 'Voting') {
    return 'Waiting for the jury\'s votes, and subsequent processing by the owner for the current round'
  }

  if (dispute.disputeRound?.state === 'PickingJuriesAndJudge') {
    return 'Waiting for confirmation from the judge and jury, and subsequent processing by the owner for the current round'
  }

  if (dispute.state === 'Running') {
    return 'Awaiting the owner\'s processing of the round (requires registered jurors)'
  }

  if (dispute.state === 'Created') {
    return 'Waiting for defendant confirmation'
  }

  return '';
}
