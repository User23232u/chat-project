export interface IMessage {
  _id: string;
  sender: string;
  // senderPicture: string;
  receiver: string;
  text: string;
  createdAt: Date;
}
