import type { Dispute } from "~/types";

export const newDispute: Dispute = {
  "id": 1,
  "state": "Created",
  "owner": "5FTyuyEQQZs8tCcPTUFqotkm2SYfDnpefn9FitRgmTHnFDBD",
  "ownerLink": "https://foo.com/",
  "escrow": 1,
  "deposit": 1,
  "defendant": "5HpJbr84AqocNWyq4WNAQLNLSNNoXVmqAhvrk8Tq7YX23j6p",
  "defendantLink": null,
  "disputeResult": null,
  "disputeRound": null,
  "disputeRoundCounter": 0,
  "judge": null,
  "juries": [],
  "banned": [],
  "votes": []
}

export const runningDispute: Dispute = {
  "id": 2,
  "state": "Running",
  "owner": "5FTyuyEQQZs8tCcPTUFqotkm2SYfDnpefn9FitRgmTHnFDBD",
  "ownerLink": "https://bar.pl/",
  "escrow": 1,
  "deposit": 2,
  "defendant": "5HpJbr84AqocNWyq4WNAQLNLSNNoXVmqAhvrk8Tq7YX23j6p",
  "defendantLink": "http://baz.com",
  "disputeResult": null,
  "disputeRound": {
    "state": "AssignJuriesAndJudge",
    "numberOfJuries": 3,
    "stateDeadline": 1704019241000
  },
  "disputeRoundCounter": 0,
  "judge": null,
  "juries": [],
  "banned": [],
  "votes": []
}
