import { expect } from "chai";
import {
  IModuleExtender,
  ExtensionManager
} from "../../Extensions/ExtensionManager";

describe("ExtentionManager", () => {
  let extensionManager: ExtensionManager;
  let testModuleExtender: TestModuleExtender;
  beforeEach(() => {
    testModuleExtender = new TestModuleExtender();
    extensionManager = new ExtensionManager(testModuleExtender);
  });

  describe("Constructor", () => {
    it("Populates the given IModuleExtenders", () => {
      let moduleExtensionArrayLength;
      extensionManager.Init = function() {
        moduleExtensionArrayLength = this._extenders.length;
      };
      extensionManager.Init();
      expect(moduleExtensionArrayLength).to.equal(1);
    });
  });

  describe("Init", () => {
    it("Calls Init on the given IModuleExtenders", () => {
      extensionManager.Init();
      expect(testModuleExtender.InitHasBeenRun).to.equal(true);
    });
  });
});

class TestModuleExtender implements IModuleExtender {
  public InitHasBeenRun: boolean = false;
  Init() {
    this.InitHasBeenRun = true;
  }
}
