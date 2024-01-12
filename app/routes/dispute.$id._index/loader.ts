import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getActiveAccount } from "~/services/account";
import { query } from "~/services/api";
import type { Dispute } from "~/types";
import { dataSession, accountSession } from "~/sessions";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const account = await getActiveAccount(request);
  const disputePayload = await query<{ ok: { ok: Dispute } }>(account?.pubKey || '', 'getDispute', params.id);
  const juryPayload = await query<{ ok: string[] }>(account?.pubKey || '', 'getJuriesPool');
  const dataStorage = await dataSession.getSession(request.headers.get("Cookie"));

  return json({
    dispute: disputePayload.ok.ok,
    jury: juryPayload.ok,
    dataKeys: Object.keys(dataStorage.data)
  });
}
