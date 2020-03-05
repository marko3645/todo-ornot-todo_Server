import { expect } from "chai";
import { ConsoleLogUtils, ConsoleColour } from "../../Utils/ConsoleLogUtils";

describe("ConsoleLogUtils", () => {
  describe("LogToConsole function", () => {
    let loggedValue;

    before(() => {
      loggedValue = "";
    });

    beforeEach(() => {
      console.log = (val: string) => (loggedValue = val);
    });

    it("Logs the given text", () => {
      let valueToLog = "Test";
      ConsoleLogUtils.LogToConsole(valueToLog);

      expect(valueToLog).to.equal(loggedValue);
    });

    it("Logs with the given colours", () => {
      let expectedColour = ConsoleColour.FgBlue;
      ConsoleLogUtils.LogToConsole("Test", expectedColour);
      expect(loggedValue).to.contain(expectedColour.toString());
    });

    it("Resets the Console colours, after applying them to text, when given colours", () => {
      ConsoleLogUtils.LogToConsole("Test", ConsoleColour.FgBlue);
      expect(loggedValue).to.contain(ConsoleColour.Reset);
    });

    it("Does not reset console colours if no colours are given", () => {
      ConsoleLogUtils.LogToConsole("Test");
      expect(loggedValue).not.to.contain(ConsoleColour.Reset.toString());
    });
  });
});
