import { accountSession } from "~/sessions";
import { PREDEFINED_ACCOUNTS } from "~/config";

export const getActiveAccount = async (request: Request) => {
  const session = await accountSession.getSession(request.headers.get("Cookie"));
  const userPubKey = session.get('userPubKey');

  if (!userPubKey) return PREDEFINED_ACCOUNTS['OWNER'];

  return Object.values(PREDEFINED_ACCOUNTS).find(({ pubKey }) => pubKey === userPubKey);
}
