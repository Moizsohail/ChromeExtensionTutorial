import {
  ChromeMessage,
  ChromeMessageExecute,
  MessageResponse,
  MessageTypes,
} from "../types";
import { say } from "cowsay";
const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: MessageResponse
) => {
  switch (message.type) {
    case MessageTypes.execute:
      const { text } = message as ChromeMessageExecute;
      const newText = say({
        text: text,
        e: "oO",
        T: "U ",
      });
      const images = document.querySelectorAll("img");

      [...images].forEach((node) => {
        const p = document.createElement("p");
        p.innerHTML = newText;
        p.style.whiteSpace = "pre";
        node.replaceWith(p);
      });
      chrome.storage.sync.set({ mooText: text });
      break;
    case MessageTypes.shortcutExecute:
      chrome.storage.sync.get("mooText").then((obj) => {
        const text = Object.values(obj)[0];
        const newText = say({
          text: text,
          e: "oO",
          T: "U ",
        });
        const images = document.querySelectorAll("img");

        [...images].forEach((node) => {
          const p = document.createElement("p");
          p.innerHTML = newText;
          p.style.whiteSpace = "pre";
          node.replaceWith(p);
        });
      });
      break;
  }
};

const main = () => {
  console.log("[content.ts] Running");

  chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
};

main();
