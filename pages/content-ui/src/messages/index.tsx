import { getMessages } from '@src/utils/getMessages';

const Messages = () => {
  return (
    <div className="flex-1 flex flex-col p-4">
      {getMessages(true).map(({ text, type }, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: text }} message-type={type} className="message" />
      ))}
    </div>
  );
};

export default Messages;
