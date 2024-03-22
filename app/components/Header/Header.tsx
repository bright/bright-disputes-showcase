import { AccountSelector } from '../AcountSelector'
import { Link } from "@remix-run/react";

export const Header = () => {
  return (<div className="p-4 grid grid-cols-[1fr_400px] backdrop-blur-3xl bg-raisin-black/50 rounded-lg items-center min-h-[62px]">
    <Link to='/'>
      <div className="text-2xl">bright disputes</div>
      <div>showcase</div>
    </Link>
    <div className="flex gap-2 items-center">
      Account <AccountSelector />
    </div>
  </div>)
}
