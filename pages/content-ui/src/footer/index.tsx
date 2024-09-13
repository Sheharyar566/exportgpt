import parse, { Node, NodeType } from 'node-html-parser';
import { Document, Font, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ReactElement, useState } from 'react';
import { getMessages } from '@src/utils/getMessages';

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
  h3: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24 * 0.75,
    fontWeight: 'bold',
    marginTop: 8 * 0.75,
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
    const messages = getMessages(false, true);

    for (const message of messages) {
      message.content = parse(message.text, {
        lowerCaseTagName: true,
        blockTextElements: {},
      });
    }

    debugger;
    console.log(generateitem(messages[1].content!, [], 0));

    const myDocument = (
      <Document>
        <Page size="A4" style={baseStyles.body}>
          <View>
            {messages.map(message => (
              <View
                key={message.id}
                style={[baseStyles.message, message.type === 'sent' ? baseStyles.sentMessage : {}]}>
                {generateitem(message.content!, [], 0)}
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    setDoc(myDocument);
  };

  const generateitem = (node: Node, parents: string[], index: number): JSX.Element => {
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
    }

    const getChildren = () =>
      node.childNodes.map((childNode, index) =>
        generateitem(childNode, node.rawTagName ? [...parents, node.rawTagName] : parents, index),
      );

    return node.rawTagName === null ? (
      <>{getChildren()}</>
    ) : isBlockElement ? (
      <View style={styles}>{getChildren()}</View>
    ) : (
      <Text style={[baseStyles.text, styles]}>
        {node.rawTagName === 'li' && `${index + 1}. `}
        {node.nodeType !== NodeType.TEXT_NODE ? getChildren() : node.textContent.replace(/(^\s+|\s+$)/gm, '\u00A0')}
      </Text>
    );
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
