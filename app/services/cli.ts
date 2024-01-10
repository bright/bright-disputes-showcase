import { execSync } from "child_process";
import { CLI_BASE_DIR, CLI_DIR } from "~/config";

export const run = (method: string, caller: string, ...args: string[]) => {
  const cmd = `cd ${CLI_BASE_DIR}; ${CLI_DIR} ${method} ${caller} ${args.join(' ')}`;
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
