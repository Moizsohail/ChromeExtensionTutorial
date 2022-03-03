import { ChromeMessage, MessageResponse, MessageTypes } from "../types";
const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: MessageResponse
) => {
  switch (message.type) {
    case MessageTypes.execute:
      console.log("Executed");
      break;
  }
};

const main = () => {
  console.log("[content.ts] Running");

  chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
};

main();
