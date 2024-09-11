export interface IMessage {
  type: 'sent' | 'received';
  text: string;
}
