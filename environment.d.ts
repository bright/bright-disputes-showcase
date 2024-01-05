declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLI_BASE_DIR: string
      CLI_DIR: string
      CONTRACT_ADDRESS: string
      NODE_ADDRESS: string
      OWNER: string
      OWNER_PUBKEY: string
      DEFENDANT: string
      DEFENDANT_PUBKEY: string
      JUROR_1: string
      JUROR_1_PUBKEY: string
      JUROR_2: string
      JUROR_2_PUBKEY: string
      JUROR_3: string
      JUROR_3_PUBKEY: string
      JUROR_4: string
      JUROR_4_PUBKEY: string
      JUROR_5: string
      JUROR_5_PUBKEY: string
      JUROR_6: string
      JUROR_6_PUBKEY: string
      JUROR_7: string
      JUROR_7_PUBKEY: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
