import React from 'react';
import Editor from './Editor';

function App() {
  // Change this ID to collaborate on a completely separate document
  const defaultDocumentId = "workspace-doc-demo";

  return (
    <div>
      <header className="app-header">
        <h1>✍️ Google Docs Workspace</h1>
        <p>Changes synchronize automatically across clients in real-time.</p>
      </header>
      <Editor documentId={defaultDocumentId} />
    </div>
  );
}

export default App;