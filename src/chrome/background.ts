import { sendMessage } from "../messaging";
import { MessageTypes } from "../types";

try {
  chrome.commands.onCommand.addListener((command) => {
    if (command === "execute") {
      sendMessage(MessageTypes.shortcutExecute);
    }
  });
  // this is to check if there are any conflicts in your
  // keyboard shorcut. If there are conflicts they won't be set
  //A simple solution in this case will be to select another shortcut
  const checkCommandShortcuts = () => {
    chrome.commands.getAll((commands) => {
      let missingShortcuts = [];

      for (let { name, shortcut } of commands) {
        if (shortcut === "") {
          missingShortcuts.push(name);
        }
      }

      if (missingShortcuts.length > 0) {
        console.log("Shortcuts not set", missingShortcuts);
      }
    });
  };
  chrome.runtime.onInstalled.addListener((reason) => {
    console.log(reason, chrome.runtime.OnInstalledReason.INSTALL);
    if (reason.reason === chrome.runtime.OnInstalledReason.UPDATE) {
      checkCommandShortcuts();
    }
  });
} catch (e) {
  console.error(e);
}
