import { useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Dropdown } from "~/components/Dropdown";
import { Account } from "~/components/Account";
import { useAppContext } from "~/context";
import type { action } from './action';
import type { MetaFunction } from "@remix-run/node";

export { action } from './action';
export const meta: MetaFunction = () => {
  return [{title: `create dispute`}];
};
export default function CreateDispute() {
  const { accounts } = useAppContext();
  const [defendant, setDefendant] = useState('');
  const { state,  } = useNavigation();
  const isProcessing = state === 'submitting';
  const actionData = useActionData<typeof action>();

  return (
    <div className={'h-screen flex items-center justify-center'}>
      <div className="p-4 backdrop-blur-3xl bg-raisin-black/50 rounded-lg grid gap-4 w-[450px] mb-[200px]">
        <Form method="post" className={'flex flex-col gap-4'}>
          <input name="defendant"
                 value={accounts.find(a => a.pubKey === defendant)?.seed || ''}
                 type="hidden"/>
          <div>
            <div>Defendant</div>
            <Dropdown
              collection={accounts.map((account) => ({
                key: account.pubKey,
                label: account.pubKey
              }))}
              onChange={setDefendant}
              value={defendant}
              getElement={(key?: string) =>
                <Account key={key} account={accounts.find(a => a.pubKey === key)}/>}
            />
            {actionData?.errors?.defendant ? (
              <em>{actionData?.errors.defendant}</em>
            ) : null}
          </div>

          <div>
            <div>Link to description</div>
            <input name="link" type="url"
                   className={'bg-transparent min-h-100 relative w-full cursor-default border-b py-1.5 pl-3 pr-10 text-left text-primary border-b-primary focus:outline-none sm:text-sm sm:leading-6'}/>
            {actionData?.errors?.link ? (
              <em>{actionData?.errors.link}</em>
            ) : null}
          </div>

          <div>
            <div>Escrow</div>
            <input name="escrow"
                   className={'bg-transparent min-h-100 relative w-full cursor-default border-b py-1.5 pl-3 pr-10 text-left text-primary border-b-primary focus:outline-none sm:text-sm sm:leading-6'}/>
            {actionData?.errors?.escrow ? (
              <em>{actionData?.errors.escrow}</em>
            ) : null}
          </div>

          <button disabled={isProcessing} type="submit" className={'text-raisin-black bg-primary/90 py-2 px-4 hover:bg-primary'}>{isProcessing ? 'Processing...' : 'Create dispute'}</button>
        </Form>
      </div>
    </div>
  )
}
