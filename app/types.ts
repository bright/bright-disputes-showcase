export interface Dispute {
  banned: string[],
  defendant: string,
  defendantLink: null | string,
  deposit: number,
  disputeResult: string | null,
  disputeRound: null | {
    numberOfJuries: number,
    state: string,
    stateDeadline: number,
  },
  disputeRoundCounter: number,
  escrow: number,
  id: number,
  judge: null | string,
  juries: string[],
  owner: string,
  ownerLink: string,
  state: string,
  votes: null | {
    juror: string,
    vote: 1
  }[],
}

export type Account = { seed: string, pubKey: string }
