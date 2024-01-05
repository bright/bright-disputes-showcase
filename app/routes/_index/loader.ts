import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getActiveAccount } from "~/services/account";
import { query } from "~/services/api";
import type { Dispute } from "~/types";

export async function loader({request}: LoaderFunctionArgs) {
  const account = await getActiveAccount(request);
  const disputesPayload = await query<{ ok: Dispute[] }>(account?.pubKey || '', 'getAllDisputes');
  const juryPayload = await query<{ ok: string[] }>(account?.pubKey || '', 'getJuriesPool');

  return json({
    disputes: disputesPayload.ok,
    jury: juryPayload.ok,
  });
}
