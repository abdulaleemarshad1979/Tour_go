import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import placesHandler from './api/places.js';
import itineraryHandler from './api/itinerary.js';
import chatHandler from './api/chat.js';
import suggestHandler from './api/suggest.js';
import geminiHandler from './api/gemini.js';
import groqHandler from './api/groq.js';
import openrouterHandler from './api/openrouter.js';

dotenv.config();

const app = express();
app.use(express.json());
// Allow overriding the port via `--port <n>` CLI arg or `PORT` env var
const cliIndex = process.argv.indexOf('--port');
const cliPort = cliIndex !== -1 ? Number(process.argv[cliIndex + 1]) : NaN;
const envPort = process.env.PORT ? Number(process.env.PORT) : NaN;
const PORT = Number.isFinite(cliPort) && !Number.isNaN(cliPort)
  ? cliPort
  : Number.isFinite(envPort) && !Number.isNaN(envPort)
  ? envPort
  : 3000;

// API Routes
app.get('/api/places', async (req, res) => {
  try {
    await placesHandler(req, res);
  } catch (err: any) {
    console.error('[Gateway] Failed to delegate to places.js handler:', err);
    res.status(500).json({ error: err.message || 'Internal API handler error' });
  }
});

app.get('/api/gemini', async (req, res) => {
  try {
    await geminiHandler(req, res);
  } catch (err: any) {
    console.error('[Gateway] Failed to delegate to gemini.js handler:', err);
    res.status(500).json({ error: err.message || 'Internal API handler error' });
  }
});

app.get('/api/groq', async (req, res) => {
  try {
    await groqHandler(req, res);
  } catch (err: any) {
    console.error('[Gateway] Failed to delegate to groq.js handler:', err);
    res.status(500).json({ error: err.message || 'Internal API handler error' });
  }
});

app.get('/api/openrouter', async (req, res) => {
  try {
    await openrouterHandler(req, res);
  } catch (err: any) {
    console.error('[Gateway] Failed to delegate to openrouter.js handler:', err);
    res.status(500).json({ error: err.message || 'Internal API handler error' });
  }
});

app.post('/api/itinerary', async (req, res) => {
  try {
    await itineraryHandler(req, res);
  } catch (err: any) {
    console.error('[Gateway] Failed to delegate to itinerary.js handler:', err);
    res.status(500).json({ error: err.message || 'Internal API handler error' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    await chatHandler(req, res);
  } catch (err: any) {
    console.error('[Gateway] Failed to delegate to chat.js handler:', err);
    res.status(500).json({ error: err.message || 'Internal API handler error' });
  }
});

app.get('/api/suggest', async (req, res) => {
  try {
    await suggestHandler(req, res);
  } catch (err: any) {
    console.error('[Gateway] Failed to delegate to suggest.js handler:', err);
    res.status(500).json({ error: err.message || 'Internal API handler error' });
  }
});

// Vite Middleware & Production Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 TourGo Server started successfully!`);
    console.log(`   - Local:    http://localhost:${PORT}`);
    console.log(`   - Network:  http://127.0.0.1:${PORT}\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
});
