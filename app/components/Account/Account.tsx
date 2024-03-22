import {Identicon} from '@polkadot/react-identicon';
import type {Account as TAccount} from '~/types';
import getShortKey from "~/utils/getShortKey";

interface AccountProps {
  account?: TAccount,
  address?: string,
  size?: number,
  onClick?: (payload: string | TAccount) => void,
}
export const Account = ({ account, size, address, onClick: onClickProp }: AccountProps) => {
  if (!account && !address) return null;

  const label = account
    ? `${account.seed} [${getShortKey(account.pubKey)}]`
    : `${getShortKey(address)}`;

  const onClick = () => {
    if (!onClickProp) return;

    const payload = address || account;

    if (payload) {
      onClickProp(payload);
    }
  }

  return (
    <span className={`inline-flex items-center bg-red h-[30px] ${onClickProp ? 'cursor-pointer' : ''}`} onClick={() => onClick()}>
      <Identicon value={account ? account.pubKey : address} size={size || 24} theme='polkadot'/>
      <span className='ml-3 block truncate'>{label}</span>
    </span>
  )
}
