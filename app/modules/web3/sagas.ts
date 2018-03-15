import { delay, Task } from "redux-saga";
import { all, call, cancel, fork, put, take } from "redux-saga/effects";
import { LIGHT_WALLET_PASSWORD_CACHE_TIME } from "../../config/constants";
import { symbols } from "../../di/symbols";
import { ILogger } from "../../lib/dependencies/Logger";
import { ObjectStorage } from "../../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { LightWallet, LightWalletWrongPassword } from "../../lib/web3/LightWallet";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { injectableFn } from "../../middlewares/redux-injectify";
import { actions, TAction } from "../actions";
import { forkAndInject } from "../sagas";
import { WalletType } from "./types";

let lockWalletTask: Task | undefined;
export const autoLockLightWallet = injectableFn(
  function*(web3Manager: Web3Manager, logger: ILogger): Iterator<any> {
    logger.info(`Resetting light wallet password in ${LIGHT_WALLET_PASSWORD_CACHE_TIME} ms`);
    yield call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME);

    if (web3Manager.personalWallet) {
      logger.info("Resetting light wallet password now");
      yield put(actions.web3.walletLocked());
      (web3Manager.personalWallet as LightWallet).password = undefined;
    }
  },
  [symbols.web3Manager, symbols.logger],
);
export function* autoLockLightWalletWatcher(): Iterator<any> {
  while (true) {
    const action: TAction = yield take(["NEW_PERSONAL_WALLET_PLUGGED", "WEB3_WALLET_UNLOCKED"]);

    if (lockWalletTask) {
      yield cancel(lockWalletTask);
    }
    if (
      action.type === "NEW_PERSONAL_WALLET_PLUGGED" &&
      action.payload.walletMetadata.walletType !== WalletType.LIGHT
    ) {
      continue;
    }
    lockWalletTask = yield* forkAndInject(autoLockLightWallet);
  }
}
export function* cancelLocking(): Iterator<any> {
  while (true) {
    yield take(["PERSONAL_WALLET_DISCONNECTED", "WEB3_WALLET_LOCKED"]);

    if (lockWalletTask) {
      yield cancel(lockWalletTask);
    }
  }
}

export const unlockWallet = injectableFn(
  function*(web3Manager: Web3Manager, password: string): Iterator<any> {
    const lightWallet = web3Manager.personalWallet as LightWallet;

    const isPasswordCorrect = yield lightWallet.testPassword(password);
    if (!isPasswordCorrect) {
      throw new LightWalletWrongPassword();
    }

    lightWallet.password = password;
    yield put(actions.web3.walletUnlocked());
  },
  [symbols.web3Manager],
);

export const loadPreviousWallet = injectableFn(
  function*(walletStorage: ObjectStorage<TWalletMetadata>): Iterator<any> {
    const storageData = walletStorage.get();
    if (storageData) {
      yield put(actions.web3.loadPreviousWallet(storageData));
    }
  },
  [symbols.walletMetadataStorage],
);

export const web3Sagas = function*(): Iterator<any> {
  yield all([fork(autoLockLightWalletWatcher), fork(cancelLocking)]);
};