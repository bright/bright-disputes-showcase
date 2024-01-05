import { Form, Link, useLoaderData, useNavigation, useParams } from "@remix-run/react";
import { Account } from "~/components/Account";
import { useAccountChange } from "~/hooks/useAccountChange";
import { useAppContext } from "~/context";
import { getTip } from "~/utils/getTip";
import type { loader } from "./loader";
import type { Dispute } from "~/types";
import type { MetaFunction } from "@remix-run/node";
import { formatDateTime } from "~/utils/formatDateTime";

const btnClasses = 'text-raisin-black bg-primary/90 p-4 hover:bg-primary disabled:bg-primary/30';

export { action } from './action';
export { loader } from './loader';
export const meta: MetaFunction = ({ params }) => {
  return [{title: `dispute #${params.id}`}];
};
export default function DisputeDetails() {
  const params = useParams();
  const { account } = useAppContext();
  const { dispute, jury } = useLoaderData<typeof loader>();
  const { state, formData} = useNavigation();
  const onAccountClick = useAccountChange();
  const processRoundEnable = [
    account?.pubKey === dispute?.owner && dispute.state === 'Running' && dispute.disputeRound?.state !== 'CountingTheVotes',
    account?.pubKey === dispute?.judge && dispute.disputeRound?.state === 'CountingTheVotes',
  ].some(Boolean);
  const processRoundProcessing = state === 'submitting' && formData?.get('_action') === 'process-dispute-round';
  const confirmDefendantEnable = account?.pubKey === dispute?.defendant && dispute.state === 'Created';
  const confirmJurorEnable = dispute?.juries.includes(account?.pubKey || '') && dispute.disputeRound?.state === 'PickingJuriesAndJudge';
  const confirmJurorProcessing = state === 'submitting' && formData?.get('_action') === 'confirm-juror-participation';
  const confirmJudgeEnable = account?.pubKey === dispute?.judge && dispute.disputeRound?.state === 'PickingJuriesAndJudge';
  const confirmJudgeProcessing = state === 'submitting' && formData?.get('_action') === 'confirm-judge-participation';
  const voteProcessing = state === 'submitting' && formData?.get('_action') === 'vote';
  const tip = getTip(dispute);

  const Status = ({ dispute }: { dispute: Dispute }) => {
    return <>
      <div>{dispute?.disputeRound
        ? dispute?.disputeRound.state.replace(/([a-z])([A-Z])/g, '$1 $2')
        : '-'
      }</div>
      <div className={'text-xs'}>
        (deadline: {dispute?.disputeRound?.stateDeadline
        ? formatDateTime(dispute.disputeRound.stateDeadline)
        : ''})
      </div>
    </>
  }

  return (
    <div className="p-4 backdrop-blur-3xl bg-raisin-black/50 rounded-lg grid gap-4">
      <div className={'flex items-center justify-between w-full'}>
        <div>
          Available jury count <span
          className={'inline-block bg-primary/60 text-raisin-black px-2 py-1 ml-2'}>{jury.length}</span>
          </div>

          <Form method="post" className={'flex gap-4'}>
            <button disabled={!processRoundEnable} type="submit"
                    name="_action" value="process-dispute-round"
                    className={btnClasses}>
              {processRoundProcessing ? 'Processing...' : 'Process dispute round'}
            </button>

            <Link to={`/dispute/${params.id}/defendant/`}>
              <button disabled={!confirmDefendantEnable} type="button"
                      className={btnClasses}>
                Confirm as defendant
              </button>
            </Link>

            <button disabled={!confirmJudgeEnable} type="submit" name="_action"
                    value="confirm-judge-participation"
                    className={btnClasses}>
              {confirmJudgeProcessing ? 'Processing...' : 'Confirm judge participation'}
            </button>

            <button disabled={!confirmJurorEnable} type="submit" name="_action"
                    value="confirm-juror-participation"
                    className={btnClasses}>
              {confirmJurorProcessing ? 'Processing...' : 'Confirm juror participation'}
            </button>
          </Form>
        </div>

      <div className={'flex gap-4 justify-between border-b border-b-primary pb-2'}>
        <div>ID: {dispute?.id}</div>
        <div>Escrow: {dispute?.escrow}</div>
        <div>Deposit: {dispute?.deposit}</div>
      </div>

      <div className={'grid grid-cols-2 gap-4'}>
        <div className={'grid grid-cols-2'}>
          <div>
            <Form method="post">
              <input name="vote" value="1" type="hidden"/>
              <button disabled={dispute?.disputeRound?.state !== 'Voting' || !dispute?.juries.includes(account?.pubKey || '')}
                      type="submit" name="_action" value="vote"
                      className={btnClasses}>{voteProcessing ? 'Processing...' : 'Vote for owner'}
              </button>
            </Form>
          </div>

          <div className={'flex flex-col gap-1'}>
            <div className={'text-end text-xs uppercase'}>Owner</div>
            <div className={'text-end'}><Account address={dispute?.owner}
                                                 onClick={() => onAccountClick(dispute?.owner)}/></div>
          </div>
        </div>
        <div className={'grid grid-cols-2'}>
          <div className={'flex flex-col gap-1'}>
            <div className={'text-xs uppercase'}>Defendant</div>
            <div><Account address={dispute?.defendant} onClick={() => onAccountClick(dispute?.defendant)}/></div>
          </div>

          <div className={'flex justify-end'}>
            <Form method="post">
              <input name="vote" value="0" type="hidden"/>
              <button disabled={dispute?.disputeRound?.state !== 'Voting' || !dispute?.juries.includes(account?.pubKey || '')}
                      type="submit" name="_action" value="vote"
                      className={btnClasses}>{voteProcessing ? 'Processing...' : 'Vote for defendant'}
              </button>
            </Form>
          </div>
        </div>
      </div>

      <div className={'grid grid-cols-2 gap-4 pb-4 border-b border-b-primary'}>
        <div className={'flex flex-col gap-1'}>
          <div className={'text-end text-xs uppercase'}>Owner link</div>
          <div className={'text-end'}>{dispute?.ownerLink ?
            <a href={dispute?.ownerLink}>{dispute?.ownerLink}</a> : '-'}</div>
        </div>

        <div className={'flex flex-col gap-1'}>
          <div className={'text-xs uppercase'}>Defendant link</div>
          <div>{dispute?.defendantLink ? <a href={dispute?.defendantLink}>{dispute?.defendantLink}</a> : '-'}</div>
        </div>
      </div>

      <div className={'text-center border-b border-b-primary pb-4 uppercase'}>
        {tip}
      </div>

      <div className={'grid grid-cols-2 gap-4'}>
        <div className={'flex flex-col gap-6'}>
          <div className={'flex flex-col'}>
            <div className={'text-end text-xs mb-1 uppercase underline'}>State</div>
            <div className={'text-end lowercase'}>{dispute?.state}</div>
          </div>
          <div className={'flex flex-col'}>
            <div className={'text-end text-xs mb-1 uppercase underline'}>Round state</div>
            <div className={'text-end lowercase'}>
              <Status dispute={dispute} />
            </div>
          </div>
          <div className={'flex flex-col'}>
            <div className={'text-end text-xs mb-1 uppercase underline'}>Dispute round counter</div>
            <div
              className={'text-end lowercase'}>{dispute?.disputeRoundCounter ? dispute?.disputeRoundCounter : '-'}</div>
          </div>
          <div className={'flex flex-col'}>
            <div className={'text-end text-xs mb-1 uppercase underline'}>Dispute result</div>
            <div className={'text-end lowercase'}>{dispute?.disputeResult ? dispute?.disputeResult : '-'}</div>
          </div>
          <div className={'flex flex-col'}>
            <div className={'text-end text-xs mb-1 uppercase underline'}>Voted</div>
            <div className={'text-end flex flex-col gap-3 py-1'}>
              {dispute?.votes?.length ? dispute?.votes.map(({ juror}) =>
                <div key={juror} className={'flex items-center justify-end'}>
                  <Account address={juror} onClick={() => onAccountClick(juror)}/>
                </div>
              ) : '-'}
            </div>
          </div>
        </div>

        <div className={'flex flex-col gap-6'}>
          <div className={'flex flex-col gap-1'}>
            <div className={'text-xs uppercase mb-1 underline'}>Judge</div>
            <div className={'py-1'}>{dispute?.judge ?
              <Account address={dispute?.judge} onClick={() => onAccountClick(dispute?.judge || '')}/> : '-'}</div>
          </div>
          <div className={'flex flex-col gap-1'}>
            <div className={'text-xs uppercase mb-1 underline'}>Juries</div>
            <div className={'flex flex-col gap-3 py-1'}>
              {dispute?.juries.length ? dispute?.juries.map(member => <div className={'flex content-center gap-2'} key={member}>
                <Account address={member} onClick={() => onAccountClick(member)}/>
                {dispute.votes?.map(o => o.juror).includes(member) ? '(voted)' : ''}
              </div>) : '-'}
            </div>
          </div>
          <div className={'flex flex-col gap-1'}>
            <div className={'text-xs uppercase mb-1 underline'}>Banned</div>
            <div>{dispute?.banned.length ? dispute?.banned.map(member =>
              <div key={member}>
                <Account address={member} onClick={() => onAccountClick(member)}/>
              </div>
            ) : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
