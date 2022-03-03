import { MessageTypes } from "./types";

export const sendMessage = (
  messageType: MessageTypes,
  payload?: object | null,
  callback?: any
) => {
  if (!payload) payload = {};
  chrome.windows.getCurrent((w) => {
    chrome.tabs &&
      chrome.tabs.query({ active: true, windowId: w.id }, (tabs) => {
        if (tabs.length === 0) {
          return;
        }
        chrome.tabs.sendMessage(
          tabs[0].id as number,
          { type: messageType, ...payload },
          callback
        );
      });
  });
};
