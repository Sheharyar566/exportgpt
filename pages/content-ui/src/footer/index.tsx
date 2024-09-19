import parse, { Node, NodeType } from 'node-html-parser';
import { Document, Font, Image, Link, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ReactElement, useState } from 'react';
import { getMessages } from '@src/utils/getMessages';
import { getImage } from '@src/utils/getImage';

Font.registerHyphenationCallback(word => [word]);

const baseStyles = StyleSheet.create({
  body: {
    backgroundColor: '#212121',
    color: 'white',
    padding: 20 * 0.75,
  },
  text: {
    fontSize: 16 * 0.75,
    lineHeight: 1.25,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16 * 0.75,
    fontWeight: 'bold',
  },
  h3: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24 * 0.75,
    fontWeight: 'bold',
    marginTop: 8 * 0.75,
  },
  hr: {
    height: 1,
    backgroundColor: '#999999',
    marginVertical: 40 / 0.75,
  },
  message: {
    marginVertical: 18 * 0.75,
    display: 'flex',
    flexDirection: 'column',
    gap: 8 * 0.75,
  },
  sentMessage: {
    backgroundColor: '#2f2f2f',
    borderRadius: 12 * 0.75,
    paddingHorizontal: 20 * 0.75,
    paddingVertical: 10 * 0.75,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  codeBlock: {
    backgroundColor: '#0d0d0d',
    padding: 16 * 0.75,
    borderRadius: 8 * 0.75,
    overflow: 'hidden',
  },
  link: {
    textDecoration: 'underline',
    color: '#0099ff',
    textDecorationColor: '#0099ff',
  },
  image: {
    maxWidth: 1024,
    maxHeight: 1024,
  },
  inlineCode: {
    backgroundColor: '#424242',
    paddingVertical: 0,
    paddingHorizontal: 8 * 0.75,
    borderRadius: 4 * 0.75,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10 * 0.75,
    paddingLeft: 16 * 0.75,
  },
  listItem: {},
});

const Footer = () => {
  const [doc, setDoc] = useState<ReactElement>();

  const exportToPdf = async () => {
    const messages = getMessages(false);
    let elements: JSX.Element[] = [];

    for (const message of messages) {
      message.content = parse(message.text, {
        lowerCaseTagName: true,
        blockTextElements: {},
      });

      elements.push(
        <View key={message.id} style={[baseStyles.message, message.type === 'sent' ? baseStyles.sentMessage : {}]}>
          {await generateitem(message.content!, [], 0)}
        </View>,
      );
    }

    const myDocument = (
      <Document>
        <Page size="A4" style={baseStyles.body}>
          <View>{elements.map(item => item)}</View>
        </Page>
      </Document>
    );

    setDoc(myDocument);
  };

  const getChildren = async (node: Node, parents: string[], index: number) => {
    const items = [];

    for (const [i, childNode] of node.childNodes.entries()) {
      items.push(await generateitem(childNode, node.rawTagName ? [...parents, node.rawTagName] : parents, index));
    }

    return items;
  };

  const generateitem = async (node: Node, parents: string[], index: number): Promise<JSX.Element | string> => {
    const isBlockElement = ['pre', 'ol', 'ul', null].includes(node.rawTagName);

    let styles = {};

    if (node.rawTagName === 'code') {
      if (parents.includes('pre')) {
        styles = baseStyles.codeBlock;
      } else {
        styles = baseStyles.inlineCode;
      }
    } else if (node.rawTagName === 'h3') {
      styles = baseStyles.h3;
    } else if (node.rawTagName === 'ul' || node.rawTagName === 'ol') {
      styles = baseStyles.list;
    } else if (node.rawTagName === 'strong') {
      styles = baseStyles.bold;
    }

    if (
      node.rawTagName === null
      // (node.childNodes.length === 1 && node.childNodes[0].nodeType !== NodeType.TEXT_NODE)
    ) {
      return <>{await getChildren(node, parents, index)}</>;
    } else if (node.rawTagName === 'hr') {
      return <View style={baseStyles.hr} />;
    } else if (node.rawTagName === 'br') {
      return <Text style={baseStyles.text}>{'\n'}</Text>;
    } else if (node.rawTagName === 'a') {
      const link = (node as Node & { attributes: { href: string } }).attributes.href;

      return (
        <Link href={link} style={baseStyles.link}>
          {await getChildren(node, parents, index)}
        </Link>
      );
    } else if (node.rawTagName === 'img') {
      const src = (node as Node & { attributes: { src: string } }).attributes.src;

      const resizedImage = await getImage(src);
      return <Image src={resizedImage} style={baseStyles.image} />;
    } else if (isBlockElement) {
      return <View style={styles}>{await getChildren(node, parents, index)}</View>;
    } else {
      const isText = node.nodeType === NodeType.TEXT_NODE;
      const isInsidePre = parents.includes('pre');
      const spaceCount = isText && isInsidePre ? (node.textContent.match(/^\s+/)?.[0].length ?? 0) * 5 : 0;

      return (
        <Text style={[baseStyles.text, styles, { textIndent: spaceCount }]}>
          {node.rawTagName === 'li' && (parents.includes('ul') ? `\u2022 ` : `${index + 1}. `)}
          {node.nodeType !== NodeType.TEXT_NODE ? await getChildren(node, parents, index) : node.textContent}
        </Text>
      );
    }
  };

  return (
    <div className="sticky bottom-0 flex flex-row justify-end items-center h-14 backdrop-blur-md p-4 bg-gray-700/50">
      <button onClick={exportToPdf}>Export</button>
      {doc && (
        <PDFDownloadLink document={doc} fileName="chatgpt-export.pdf">
          Download
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default Footer;
