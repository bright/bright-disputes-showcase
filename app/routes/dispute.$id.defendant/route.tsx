import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { action } from "~/routes/dispute.$id.defendant/action";
import { MetaFunction } from "@remix-run/node";
export { action } from './action';

export const meta: MetaFunction = () => {
  return [{title: `confirm defendant`}];
};
export default function ConfirmDefendant() {
  const { state,  } = useNavigation();
  const isProcessing = state === 'submitting';
  const actionData = useActionData<typeof action>();

  return (
    <div className={'flex items-center justify-center h-[calc(100vh_-_130px)]'}>
      <div className="p-4 backdrop-blur-3xl bg-raisin-black/50 rounded-lg grid gap-4 w-[450px] mb-[200px]">
        <Form method="post" className={'flex flex-col gap-4'}>
          <div>
            <div>Link to description</div>
            <input name="link" type="url"
                   className={'bg-transparent min-h-100 relative w-full cursor-default border-b text-primary py-1.5 pl-3 pr-10 text-left border-b-primary focus:outline-none sm:text-sm sm:leading-6'}/>
            {actionData?.errors?.link ? (
              <em>{actionData?.errors.link}</em>
            ) : null}
          </div>

          <button disabled={isProcessing} type="submit" className={'text-raisin-black bg-primary/90 py-2 px-4 hover:bg-primary'}>{isProcessing ? 'Processing...' : 'Confirm defendant'}</button>
        </Form>
      </div>
    </div>
  )
}
