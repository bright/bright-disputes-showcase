import { execSync } from "child_process";

export const run = (method: string, caller: string, ...args: string[]) => {
  const cmd = `cd ../cli; bash ../scripts/cli.sh "target/release/bright_disputes_cli ${method} ${caller} ${args.join(' ')}"`;
  const shownCmd = `$ bright_disputes_cli ${method} ${caller} ${args.join(' ')}`
  let payload;

  try {
    payload = execSync(cmd).toString();
  } catch(err) {
    return {
      status: false,
      cmd: shownCmd,
      payload: err?.toString(),
    }
  }

  return {
    status: true,
    cmd: shownCmd,
    payload,
  };
}
