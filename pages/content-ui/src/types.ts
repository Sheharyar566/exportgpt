import { HTMLElement } from 'node-html-parser';

export interface IMessage {
  id: string;
  type: 'sent' | 'received';
  text: string;
  content?: HTMLElement;
}
