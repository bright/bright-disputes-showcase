import { Dropdown } from '../Dropdown';
import { Account } from '../Account';
import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/root";
import { useAccountChange } from "~/hooks/useAccountChange";

export const AccountSelector = () => {
  const {accounts, account} = useLoaderData<typeof loader>();
  const onAccountChange = useAccountChange();

  return (
    <Dropdown
      collection={accounts
        .map(({ pubKey }) => ({ key: pubKey, label: pubKey }))}
      onChange={onAccountChange}
      value={account?.pubKey}
      getElement={(key?: string) =>
        <Account key={key} account={accounts.find(a => a.pubKey === key)}/>}
    />
  )
}
