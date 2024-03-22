import type { ActionFunctionArgs} from "@remix-run/node";
import { json , redirect } from "@remix-run/node";
import { dataSession } from "~/sessions";
import { getActiveAccount } from "~/services/account";
import { run } from "~/services/cli";

export async function action({request, params}: ActionFunctionArgs) {
  const session = await dataSession.getSession(request.headers.get("Cookie"));
  const account = await getActiveAccount(request);
  const formData = await request.formData();
  const { link} = Object.fromEntries(formData);

  // validation
  const errors: { link?: string } = {};

  if (!link) {
    errors.link = "The field is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  // run the CLI command
  const result = run('confirm-defendant' as string, account?.seed as string, params.id as string, link as string);

  session.flash('feedback', result);

  return redirect(`/dispute/${params.id}`, {
    headers: {
      "Set-Cookie": await dataSession.commitSession(session),
    },
  })
}
