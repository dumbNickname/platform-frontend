import { expect } from "chai";
import { spy } from "sinon";
import { UsersApi } from "../../../../app/modules/networking/UsersApi";
import { Storage } from "../../../../app/modules/storage/storage";
import {
  LightWalletCreatedAction,
  tryConnectingWithLightWallet,
} from "../../../../app/modules/wallet-selector/light-wizard/actions";
import { IVault } from "../../../../app/modules/web3/LightWallet";
import { Web3Manager } from "../../../../app/modules/web3/Web3Manager";
import { dummyNetworkId } from "../../../fixtures";
import { createMock } from "../../../testUtils";
import { VaultApi } from "./../../../../app/modules/networking/VaultApi";

describe("Wallet selector > Browser wizard > actions", () => {
  describe("tryConnectingWithLightWallet action", () => {
    it("should create new wallet and store", async () => {
      const dispatchMock = spy();
      const createLightWalletVault: IVault = { walletInstance: "instance", salt: "salt" };

      const lightWalletMock = (): Promise<IVault> => {
        return Promise.resolve(createLightWalletVault);
      };
      const deserializeLightWalletVault: any = () => ({ walletInstance: "instance", salt: "salt" });
      const localStorageMock = {
        setKey: spy(),
        getKey: spy(() => "expectedPhrase"),
      };

      const storage = createMock(Storage, localStorageMock);

      const web3ManagerMock = createMock(Web3Manager, {
        networkId: dummyNetworkId,
        plugPersonalWallet: async () => {},
      });

      const vaultApi = createMock(VaultApi, {
        store: (): Promise<void> => {
          return Promise.resolve();
        },
      });
      const usersApi = createMock(UsersApi, {
        createLightwalletAccount: (): Promise<void> => {
          return Promise.resolve();
        },
      });

      await tryConnectingWithLightWallet("test@test.com", "password")(
        dispatchMock,
        web3ManagerMock,
        lightWalletMock,
        deserializeLightWalletVault,
        storage,
        vaultApi,
        usersApi,
      );
      expect(dispatchMock).to.be.calledWithExactly(
        LightWalletCreatedAction({ lightWalletVault: createLightWalletVault }),
      );
    });
  });
});
