import {
  isRouteErrorResponse, Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData, useRouteError,
} from '@remix-run/react';
import stylesheet from './tailwind.css';
import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import AppContextProvider from './context';
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { dataSession, accountSession } from "~/sessions";
import { PREDEFINED_ACCOUNTS } from "~/config";
import { Header } from "~/components/Header";

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: stylesheet},
];

export async function action({request}: ActionFunctionArgs) {
  const session = await accountSession.getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const {userPubKey, redirectTo} = Object.fromEntries(formData) as Record<string, string>;

  session.set('userPubKey', userPubKey);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await accountSession.commitSession(session),
    },
  })
}

export async function loader({request}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const dataStorage = await dataSession.getSession(cookieHeader);
  const accountStorage = await accountSession.getSession(cookieHeader);
  const feedback = dataStorage.get('feedback') as undefined | {
    status: boolean
    cmd: string
    payload?: string
  };
  const accounts = Object.values(PREDEFINED_ACCOUNTS);
  const userPubKey = accountStorage.get('userPubKey');
  const account = accounts.find(({pubKey}) => pubKey === userPubKey) || accounts[0];

  return json(
    {account, accounts, feedback},
    {
      headers: {
        "Set-Cookie": await dataSession.commitSession(dataStorage),
      },
    }
  );
}

const Msg = ({ status, cmd }: { status: boolean, cmd: string }) => {
  const maxLength = 80;
  const ellipsis = ' (...)';

  return (
    <div className={'font-mono'}>
      <div>{cmd.length > maxLength + ellipsis.length ? `${cmd.substring(0, maxLength)}${ellipsis}` : cmd}</div>
      <div>-- {status ? 'SUCCESS' : 'FAIL'} --</div>
    </div>
  )
}

export default function Main() {
  const {feedback, account, accounts} = useLoaderData<typeof loader>();

  useEffect(() => {
    if (!feedback) return;

    const id = setTimeout(() => {
      toast[feedback.status ? 'success' : 'warn'](<Msg {...feedback} />)
    });

    return () => clearTimeout(id);
  }, [feedback])

  return (
    <html lang='en'>
    <head>
      <meta charSet='utf-8'/>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>
      <Meta/>
      <Links/>
    </head>

    <body
      className={'bg-raisin-black text-primary min-h-screen bg-[url(bg.svg)] bg-left-top bg-[length:90%] bg-no-repeat'}>
    <AppContextProvider account={account} accounts={accounts}>
      <div className="grid grid-rows-[max-content_1fr] gap-3 p-3">
        <Header/>
        <Outlet/>
      </div>
      <ToastContainer position="bottom-left"
                      autoClose={5000}
                      newestOnTop={true}
                      closeOnClick
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="dark"/>
    </AppContextProvider>
    <ScrollRestoration/>
    <Scripts/>
    <LiveReload/>
    </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const errorMsg = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown Error";


  return (
    <html lang='en'>
    <head>
      <meta charSet='utf-8'/>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>
      <Links/>

      <title>{errorMsg}</title>
    </head>

    <body
      className={'bg-raisin-black text-primary min-h-screen bg-[url(bg.svg)] bg-left-top bg-[length:90%] bg-no-repeat'}>
      <div className="grid grid-rows-[max-content_1fr] gap-3 p-3">

        <div className={'h-screen flex items-center justify-center'}>
          <div className="p-4 backdrop-blur-3xl bg-raisin-black/50 rounded-lg grid gap-4 w-[450px] mb-[200px]">
            <div className={'text-5xl text-center font-bold '}>
              {errorMsg}
            </div>
            <div className={'text-center'}>
              Go to: <Link to={'/'} className={'underline'}>Main page</Link>
            </div>
          </div>

        </div>
      </div>
    </body>
    </html>
  );
}
