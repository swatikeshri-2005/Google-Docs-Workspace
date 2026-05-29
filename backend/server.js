const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

const app = express();
const server = http.createServer(app);

// 1. FIRST: Initialize the WebSocket server properly
const wss = new WebSocket.Server({ noServer: true });

// 2. SECOND: Define what happens when a client connects to the WebSocket server
wss.on('connection', (ws, req) => {
  // setupWSConnection automatically handles syncing rooms based on the URL path
  setupWSConnection(ws, req);
  console.log('New client connected to collaboration session');
});

// 3. THIRD: Handle the HTTP upgrade request and pass it to our defined wss instance
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

app.get('/', (req, res) => {
  res.send('Collaboration backend is live.');
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Backend WebSocket server running on http://localhost:${PORT}`);
});