import { IMessage } from '@src/types';
import { useCallback } from 'react';
import sanitize from 'sanitize-html';

const Messages = () => {
  const getMessages = useCallback(() => {
    const messages: IMessage[] = [];

    document.querySelectorAll('article [data-message-id]').forEach(rawArticle => {
      const article = rawArticle.cloneNode(true) as Element;
      const messageType = article.getAttribute('data-message-author-role') === 'user' ? 'sent' : 'received';

      const preSpans = article.querySelectorAll('pre span:not(code span)');
      preSpans.forEach((span: Element) => span.remove());

      let textSanitized = sanitize(article.innerHTML, {
        allowedTags: ['p', 'h3', 'ol', 'ul', 'li', 'code', 'span', 'strong', 'img', 'pre'],
        allowedAttributes: {
          span: ['class'],
          code: ['class'],
          pre: ['class'],
        },
      });

      if (messageType === 'sent') {
        textSanitized = textSanitized.split('\n').join('<br />');
      }

      messages.push({
        type: messageType,
        text: textSanitized,
      });
    });

    return messages;
  }, []);

  return (
    <div className="flex-1 flex flex-col p-4">
      {getMessages().map(({ text, type }, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: text }} message-type={type} className="message" />
      ))}
    </div>
  );
};

export default Messages;
