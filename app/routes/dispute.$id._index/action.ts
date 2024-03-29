import type { ActionFunctionArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getActiveAccount } from "~/services/account";
import { dataSession } from "~/sessions";
import { run } from "~/services/cli";

export async function action({request, params}: ActionFunctionArgs) {
  const account = await getActiveAccount(request);
  const session = await dataSession.getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const {_action, vote} = Object.fromEntries(formData) as Record<string, string>;
  const args = [];

  // Voting and counting actions need to be signed with a key.
  if (['vote', 'count-the-votes'].includes(_action)) {
    const key = session.get(`voting-key_${params.id}_${account?.pubKey}`);

    args.push(vote as string, key);
  }

  // run the CLI command
  const result = run(_action as string, account?.seed as string, params.id as string, ...args);

  // Confirmation actions generate keys used for signing future actions,
  // for demonstration purposes we can store them in the session.
  if (['confirm-juror-participation', 'confirm-judge-participation'].includes(_action) && !!result.payload) {
    const keys = [...result.payload.matchAll(/\[[\w\s,]+\]/g)].map(i => i[0])
      .map(rawKey => JSON.parse(rawKey).join(','));

    session.set(`voting-key_${params.id}_${account?.pubKey}`, keys[1]);
  }

  session.flash('feedback', result);

  return redirect(`/dispute/${params.id}`, {
    headers: {
      "Set-Cookie": await dataSession.commitSession(session),
    },
  })
}
