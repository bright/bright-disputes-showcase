import type { ActionFunctionArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { dataSession } from "~/sessions";
import { getActiveAccount } from "~/services/account";
import { transaction } from "~/services/api";
import { run } from "~/services/cli";

export async function action({request}: ActionFunctionArgs) {
  const session = await dataSession.getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const {_action, id} = Object.fromEntries(formData) as { _action: string, id: string };
  const account = await getActiveAccount(request);

  // Dispute removal is handled with Polkadot API call,
  // other actions are handled with CLI commands
  if (_action === 'removeDispute') {
    try {
      const status = await transaction(account?.seed || '', _action, id);

      session.flash('feedback', {
        status,
        cmd: `API call: ${_action} ${id}`
      });
    } catch (err) {
      session.flash('feedback', {
        status: false,
        cmd: `API call: ${_action} ${id}`
      });
    }
  } else {
    const result = run(_action, account?.seed || '');

    session.flash('feedback', result);
  }

  return redirect('/', {
    headers: {
      "Set-Cookie": await dataSession.commitSession(session),
    },
  })
}
