import { Account } from '~/components/Account';
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { useAppContext } from "~/context";
import type { loader } from "./loader";
import { Button } from "~/components/Button";

export { loader } from './loader';
export { action } from './action';
export const meta: MetaFunction = () => {
  return [{title: 'bright disputes - showcase'}];
};
export default function Index() {
  const { disputes, jury } = useLoaderData<typeof loader>();
  const { state, formData} = useNavigation();
  const isDeleting = state === 'submitting' && formData?.get('_action') === 'removeDispute';
  const isRegistering = state === 'submitting' && formData?.get('_action') === 'register-as-an-active-juror';
  const isUnregistering = state === 'submitting' && formData?.get('_action') === 'unregister-as-an-active-juror';
  const { account } = useAppContext();

  return (
    <div className={`grid grid-cols-1`}>
      <div className="p-4 backdrop-blur-3xl bg-raisin-black/50 rounded-lg grid gap-4">
        <div className="flex items-center justify-between w-full">
          <div>
            Available jury count <span className={'inline-block bg-primary/60 text-raisin-black px-2 py-1 ml-2'}>{jury.length}</span>
          </div>
          <div className="flex justify-end gap-4">
            <Link to="/dispute/create">
              <Button type="button">Create dispute</Button>
            </Link>

            <Form method="post">
              <Button disabled={jury.includes(account.pubKey)} type="submit" name="_action" value={'register-as-an-active-juror'}>
                {isRegistering ? 'Processing...' : 'Register as a Juror'}
              </Button>
            </Form>

            <Form method="post">
              <Button disabled={!jury.includes(account.pubKey)} type="submit" name="_action" value={'unregister-as-an-active-juror'}>
                {isUnregistering ? 'Processing...' : 'Unregister as a Juror'}
              </Button>
            </Form>
          </div>
        </div>

        {disputes?.length ? <div>
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-primary">
                    <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium uppercase">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium uppercase">
                        State
                      </th>
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium uppercase">
                        Owner
                      </th>
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium uppercase">
                        Defendant
                      </th>
                      <th scope="col" className="px-6 py-3 text-end text-xs font-medium uppercase">
                        Action
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    {disputes?.map(({id, state, owner, defendant,}) => <tr key={id}
                                                                           className="hover:bg-primary hover:bg-opacity-10">
                      <td key={id} className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm items-center">
                        {state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Account address={owner}/>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Account address={defendant}/>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium flex gap-2 justify-end">
                        <Link to={`/dispute/${id}`}>
                          <Button>Show</Button>
                        </Link>

                        {state === 'Created' && <Form method="post">
                          <input name="id" value={id || ''} type="hidden"/>
                          <Button type="submit" name="_action" value={'removeDispute'}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </Button>
                        </Form>}
                      </td>
                    </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div> : <div className={'text-center'}>
          No disputes yet
        </div>}

      </div>
    </div>
  );
}
