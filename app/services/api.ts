import { BN, BN_ONE } from "@polkadot/util";
import { abi, CONTRACT_ADDRESS, NODE_ADDRESS } from "~/config";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import type { WeightV2 } from "@polkadot/types/interfaces";

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOF_SIZE = new BN(1_000_000);

const wsProvider = new WsProvider(NODE_ADDRESS);
const promise = new ApiPromise({provider: wsProvider});
const API = await promise.isReady;

export const query = async <T, >(callerKey: string, method: string, ...params: unknown[]) => {
  const contract = new ContractPromise(API, abi, CONTRACT_ADDRESS);
  const {result, output} = await contract.query[method](callerKey, {
    gasLimit: API?.registry.createType('WeightV2', {
      refTime: MAX_CALL_WEIGHT,
      proofSize: PROOF_SIZE,
    }) as WeightV2,
  }, ...params);

  if (!result.isOk) {
    throw result.asErr;
  }

  return output?.toJSON() as T;
}

export const transaction = async (callerSeed: string, method: string, ...params: unknown[]) => {
  const keyring = new Keyring({type: 'sr25519'});
  const accountKeyring = keyring.addFromUri(callerSeed);
  const contract = new ContractPromise(API, abi, CONTRACT_ADDRESS);

  return new Promise((resolve) => {
    contract.tx[method]({
        value: 0,
        gasLimit: API?.registry.createType('WeightV2', {
          refTime: new BN(5_000_000_000).isub(BN_ONE),
          proofSize: PROOF_SIZE,
        }) as WeightV2,
      }, ...params)
      .signAndSend(accountKeyring, ({ status }) => {
        if (status.type === 'Finalized') {
          resolve(true);
        }
      });
    }
  )
}
