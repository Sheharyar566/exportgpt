import { IMessage } from '@src/types';
import sanitize from 'sanitize-html';

export const getMessages = (replaceLineBreaks: boolean = false) => {
  const messages: IMessage[] = [];

  document.querySelectorAll('article [data-message-id]').forEach(rawArticle => {
    const article = rawArticle.parentElement?.cloneNode(true) as Element;

    if (!article) return;

    const messageType = rawArticle.getAttribute('data-message-author-role') === 'user' ? 'sent' : 'received';
    const id = rawArticle.getAttribute('data-message-id');

    if (!id) {
      throw new Error('Invalid value provided');
    }

    const preSpans = article.querySelectorAll('pre span:not(code span)');
    preSpans.forEach((span: Element) => span.remove());

    let textSanitized = sanitize(article.outerHTML, {
      allowedTags: ['p', 'h3', 'ol', 'ul', 'li', 'code', 'span', 'strong', 'img', 'pre', 'br', 'a', 'hr'],
      allowedAttributes: {
        span: ['class'],
        code: ['class'],
        pre: ['class'],
        img: ['src', 'width', 'height'],
        a: ['href'],
      },
    });

    if (messageType === 'sent' && replaceLineBreaks) {
      textSanitized = textSanitized.split('\n').join('<br>');
    }

    messages.push({
      id,
      type: messageType,
      text: textSanitized,
    });
  });

  return messages;
};
