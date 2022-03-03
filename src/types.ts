export enum MessageTypes {
  execute,
  shortcutExecute,
}

export interface ChromeMessageDefault {
  type: MessageTypes;
}
export interface ChromeMessageExecute {
  type: MessageTypes.execute;
  text: string;
}
export type ChromeMessage = ChromeMessageDefault | ChromeMessageExecute;

export type MessageResponse = (response?: any) => void;
