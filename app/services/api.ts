import { BN, BN_ONE } from "@polkadot/util";
import { abi, CONTRACT_ADDRESS, NODE_ADDRESS } from "~/config";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import type { WeightV2 } from "@polkadot/types/interfaces";

const refTime = new BN(100_000_000_000);
const proofSize = new BN(100_000_000_000);
const wsProvider = new WsProvider(NODE_ADDRESS);
const promise = new ApiPromise({provider: wsProvider});
const API = await promise.isReady;

export const query = async <T, >(callerKey: string, method: string, ...params: unknown[]) => {
  const contract = new ContractPromise(API, abi, CONTRACT_ADDRESS);
  let payload;

  try {
    payload = await contract.query[method](callerKey, {
      gasLimit: API?.registry.createType('WeightV2', { refTime, proofSize }) as WeightV2,
    }, ...params);
  } catch (e) {
      throw new Error('Error');
  }

  const { result, output} = payload;

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
        gasLimit: API?.registry.createType('WeightV2', { refTime, proofSize }) as WeightV2,
      }, ...params)
      .signAndSend(accountKeyring, ({ status, events  }) => {
        if (status.isInBlock || status.isFinalized) {
          const failedEvents = events
            .filter(({ event }) =>
              API.events.system.ExtrinsicFailed.is(event)
            );

          failedEvents.forEach(({ event: { data: [error, info] } }) => {
              console.log(error.toString());
            });

          resolve(!failedEvents.length);
        }
      });
    }
  )
}
