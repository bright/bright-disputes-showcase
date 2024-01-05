import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { Account } from './types';

interface AppContext {
  account: Account,
  accounts: Account[],
}

const AppContext = createContext<AppContext | null>(null);

export const useAppContext = () => {
  const value = useContext(AppContext);

  if (value === null) {
    throw 'No value provided to the app context';
  }

  return value;
};

const Provider = AppContext.Provider;

interface AppContextProvider {
  children: ReactNode,
  account: Account,
  accounts: Account[]
}
const AppContextProvider = ({ children, account, accounts }: AppContextProvider) => {
  return (
    <Provider value={{ account, accounts }}>
      {children}
    </Provider>
  );
};

export default AppContextProvider;
