import type { ActionFunctionArgs} from "@remix-run/node";
import { json , redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";
import { getActiveAccount } from "~/services/account";
import { run } from "~/services/cli";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const account = await getActiveAccount(request);
  const formData = await request.formData();
  const { defendant, link, escrow} = Object.fromEntries(formData);
  const result = run('create-dispute', account?.seed as string,  defendant as string, link as string, escrow as string);

  const errors: { defendant?: string, link?: string, escrow?: string } = {};

  if (!defendant) {
    errors.defendant = "The field is required";
  }

  if (!link) {
    errors.link = "The field is required";
  }

  if (!escrow) {
    errors.escrow = "The field is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  session.flash('feedback', {
    status: result,
  });

  return redirect('/', {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}
