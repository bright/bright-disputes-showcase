import type { Account } from "~/types";
import disputeConfig from "~/../../cli/.bright_disputes_config.json";
export { default as abi } from "./../../contract/target/ink/bright_disputes.json";

export const CONTRACT_ADDRESS = disputeConfig.contract_address;

export const NODE_ADDRESS = disputeConfig.node_address;

export const PREDEFINED_ACCOUNTS: Record<string, Account> = {
  OWNER: {
    seed: process.env.OWNER,
    pubKey: process.env.OWNER_PUBKEY,
  },
  DEFENDANT: {
    seed: process.env.DEFENDANT,
    pubKey: process.env.DEFENDANT_PUBKEY,
  },
  JUROR_1: {
    seed: process.env.JUROR_1,
    pubKey: process.env.JUROR_1_PUBKEY,
  },
  JUROR_2: {
    seed: process.env.JUROR_2,
    pubKey: process.env.JUROR_2_PUBKEY,
  },
  JUROR_3: {
    seed: process.env.JUROR_3,
    pubKey: process.env.JUROR_3_PUBKEY,
  },
  JUROR_4: {
    seed: process.env.JUROR_4,
    pubKey: process.env.JUROR_4_PUBKEY,
  },
  JUROR_5: {
    seed: process.env.JUROR_5,
    pubKey: process.env.JUROR_5_PUBKEY,
  },
  JUROR_6: {
    seed: process.env.JUROR_6,
    pubKey: process.env.JUROR_6_PUBKEY,
  },
  JUROR_7: {
    seed: process.env.JUROR_7,
    pubKey: process.env.JUROR_7_PUBKEY,
  },
};
