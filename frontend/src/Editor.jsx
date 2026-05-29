import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';
import 'quill/dist/quill.snow.css';

const Editor = ({ documentId }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup local Quill container element dynamically
    const editorElement = document.createElement('div');
    containerRef.current.append(editorElement);

    const quill = new Quill(editorElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
    });

    // 2. Setup Yjs ecosystem
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      'ws://localhost:4000', 
      documentId, 
      ydoc
    );
    const ytext = ydoc.getText('quill-content');

    // 3. Link Quill and Yjs together
    const binding = new QuillBinding(ytext, quill, provider.awareness);

    // 4. Create random profile info for cursor tracking
    const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
    const randomName = names[Math.floor(Math.random() * names.length)] + '_' + Math.floor(Math.random() * 100);
    
    provider.awareness.setLocalStateField('user', {
      name: randomName,
      color: '#1a73e8'
    });

    // Cleanup hook on component destruction
    return () => {
      binding.destroy();
      provider.disconnect();
      ydoc.destroy();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [documentId]);

  return (
    <div className="editor-container">
      <div className="room-status">
        Editing Room: <strong>{documentId}</strong>
      </div>
      <div ref={containerRef} />
    </div>
  );
};

export default Editor;