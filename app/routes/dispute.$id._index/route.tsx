import { Form, Link, useLoaderData, useNavigation, useParams } from "@remix-run/react";
import { Account } from "~/components/Account";
import { useAccountChange } from "~/hooks/useAccountChange";
import { useAppContext } from "~/context";
import { getTip } from "~/utils/getTip";
import type { loader } from "./loader";
import type { MetaFunction } from "@remix-run/node";
import { Confirm } from "~/components/icons/Confirm";
import { Vote } from "~/components/icons/Vote";
import { Status } from "~/components/Status";
import { Button } from "~/components/Button";

export { action } from './action';
export { loader } from './loader';
export const meta: MetaFunction = ({ params }) => {
  return [{title: `dispute #${params.id}`}];
};
export default function DisputeDetails() {
  const params = useParams();
  const { account } = useAppContext();
  const { dispute, jury, dataKeys } = useLoaderData<typeof loader>();
  const { state, formData} = useNavigation();
  const onAccountClick = useAccountChange();
  const tip = getTip(dispute);

  // Process dispute round button state
  const processRoundEnable = account?.pubKey === dispute?.owner && dispute.state === 'Running' && dispute.disputeRound?.state !== 'CountingTheVotes';
  const processRoundProcessing = state === 'submitting' && formData?.get('_action') === 'process-dispute-round';

  // Confirm as defendant button state
  const confirmDefendantEnable = account?.pubKey === dispute?.defendant && dispute.state === 'Created';
  const confirmJurorEnable = !dataKeys.includes(`voting-key_${params.id}_${account?.pubKey}`)
    && dispute?.juries.includes(account?.pubKey || '')
    && dispute.disputeRound?.state === 'PickingJuriesAndJudge';

  // Confirm judge participation button state
  const confirmJurorProcessing = state === 'submitting' && formData?.get('_action') === 'confirm-juror-participation';
  const confirmJudgeEnable = !dataKeys.includes(`voting-key_${params.id}_${account?.pubKey}`)
    && account?.pubKey === dispute?.judge
    && dispute.disputeRound?.state === 'PickingJuriesAndJudge';

  // Confirm juror participation button state
  const confirmJudgeProcessing = state === 'submitting' && formData?.get('_action') === 'confirm-judge-participation';
  const countTheVotesEnable = account?.pubKey === dispute?.judge && dispute.disputeRound?.state === 'CountingTheVotes';

  // Count the votes button state
  const countTheVotesProcessing = state === 'submitting' && formData?.get('_action') === 'count-the-votes';
  const voteProcessing = state === 'submitting' && formData?.get('_action') === 'vote';

  return (
    <div className="p-4 backdrop-blur-3xl bg-raisin-black/50 rounded-lg grid gap-4">
      <div className={'flex items-center justify-between w-full'}>
        <div>
          Available jury count <span
          className={'inline-block bg-primary/60 text-raisin-black px-2 py-1 ml-2'}>{jury.length}</span>
          </div>

          <Form method="post" className={'flex gap-4'}>
            <Button disabled={!processRoundEnable} type="submit" name="_action" value="process-dispute-round">
              {processRoundProcessing ? 'Processing...' : 'Process dispute round'}
            </Button>

            <Link to={`/dispute/${params.id}/defendant/`}>
              <Button disabled={!confirmDefendantEnable} type="button">
                Confirm as defendant
              </Button>
            </Link>

            <Button disabled={!confirmJudgeEnable} type="submit" name="_action" value="confirm-judge-participation">
              {confirmJudgeProcessing ? 'Processing...' : 'Confirm judge participation'}
            </Button>

            <Button disabled={!confirmJurorEnable} type="submit" name="_action" value="confirm-juror-participation">
              {confirmJurorProcessing ? 'Processing...' : 'Confirm juror participation'}
            </Button>

            <Button disabled={!countTheVotesEnable} type="submit" name="_action" value="count-the-votes">
              {countTheVotesProcessing ? 'Processing...' : 'Count the votes'}
            </Button>
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
              <Button disabled={dispute?.disputeRound?.state !== 'Voting' || !dispute?.juries.includes(account?.pubKey || '')}
                      type="submit" name="_action" value="vote">{voteProcessing ? 'Processing...' : 'Vote for owner'}
              </Button>
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
              <Button disabled={dispute?.disputeRound?.state !== 'Voting' || !dispute?.juries.includes(account?.pubKey || '')}
                      type="submit" name="_action" value="vote">
                {voteProcessing ? 'Processing...' : 'Vote for defendant'}
              </Button>
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
        </div>

        <div className={'flex flex-col gap-6'}>
          <div className={'flex flex-col gap-1'}>
            <div className={'text-xs uppercase mb-1 underline'}>Judge</div>
            <div className={'py-1 flex flex-row gap-2'}>{dispute?.judge ?
              <Account address={dispute?.judge} onClick={() => onAccountClick(dispute?.judge || '')}/> : '-'}
              {dataKeys.includes(`voting-key_${params.id}_${dispute?.judge}`) ? <span title="Confirmed">
                <Confirm class={'fill-primary'} />
              </span> : ''}
            </div>
          </div>
          <div className={'flex flex-col gap-1'}>
            <div className={'text-xs uppercase mb-1 underline'}>Juries</div>
            <div className={'flex flex-col gap-3 py-1'}>
              {dispute?.juries.length ? dispute?.juries.map(member => <div className={'flex content-center gap-2 items-center'} key={member}>
                <Account address={member} onClick={() => onAccountClick(member)}/>
                {dataKeys.includes(`voting-key_${params.id}_${member}`) ? <span title="Confirmed">
                  <Confirm class={'fill-primary'} />
                </span> : ''}
                {dispute.votes?.map(o => o.juror).includes(member) ? <span title="Voted">
                  <Vote class={'fill-primary'}  />
                </span> : ''}
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
