import {formatDateTime} from "~/utils/formatDateTime";
import {Dispute} from "~/types";

interface StatusProps {
  dispute: Dispute
}
export const Status = ({ dispute }: StatusProps) => {
  return <>
    <div>{dispute?.disputeRound
      ? dispute?.disputeRound.state.replace(/([a-z])([A-Z])/g, '$1 $2')
      : '-'
    }</div>
    {dispute?.disputeRound?.stateDeadline && <div className={'text-xs'}>
      (deadline: {formatDateTime(dispute.disputeRound.stateDeadline)})
    </div>}
  </>
};
