import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import stylesheet from './tailwind.css';
import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import AppContextProvider from './context';
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { commitSession, getSession } from "~/sessions";
import { PREDEFINED_ACCOUNTS } from "~/config";
import { Header } from "~/components/Header";

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: stylesheet},
];

export async function action({request}: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const {userPubKey, redirectTo} = Object.fromEntries(formData) as Record<string, string>;

  session.set('userPubKey', userPubKey);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}

export async function loader({request}: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const feedback = session.get('feedback') as undefined | { status: boolean };
  const accounts = Object.values(PREDEFINED_ACCOUNTS);
  const userPubKey = session.get('userPubKey');
  const account = accounts.find(({pubKey}) => pubKey === userPubKey) || accounts[0];

  return json(
    {account, accounts, feedback},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function Main() {
  const {feedback, account, accounts} = useLoaderData<typeof loader>();

  useEffect(() => {
    if (feedback === undefined) return;

    const id = setTimeout(() => {
      feedback.status ? toast.success('Success!') : toast.warning('Failed!')
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
