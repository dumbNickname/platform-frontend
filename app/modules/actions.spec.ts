import { expect } from "chai";
import { forEach, values } from "lodash";
import { allActions } from "./actions";

const ALLOWED_DUPLICATES: { [type: string]: boolean } = {
  "@@router/CALL_HISTORY_METHOD": true,
};

describe("modules", () => {
  describe("all actions", () => {
    it("should have unique types", () => {
      const typeMap: { [key: string]: boolean } = {};

      forEach(allActions, (actionCreator: any, creatorName: string) => {
        const action = actionCreator();
        const type: string = action.type;

        // we have aliases for displaying generic modals
        if (type === "GENERIC_MODAL_SHOW") {
          return;
        }

        !ALLOWED_DUPLICATES[type] &&
          expect(
            typeMap[action.type],
            `Duplicate action type ${action.type} created by creator ${creatorName}`,
          ).to.be.undefined;

        typeMap[type] = true;
      });
    });

    it("should not have undefined types", () => {
      forEach(allActions, (actionCreator: any, creatorName: string) => {
        const action = actionCreator();
        const type: string = action.type;
        expect(type, `Action type of creator ${creatorName} is undefined`).to.not.be.undefined;
      });
    });

    it("should not have values apart from payload and type", () => {
      forEach(allActions, (actionCreator: any, creatorName: string) => {
        const action = actionCreator();
        const testAction = {
          ...action,
          type: "something",
          payload: {},
        };
        expect(
          values(testAction).length,
          `Action type of creator ${creatorName} has to many properties`,
        ).to.not.be.greaterThan(2);
      });
    });
  });
});
