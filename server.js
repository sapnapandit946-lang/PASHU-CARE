require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const SYNC_HISTORY_FILE = path.join(DATA_DIR, 'history-sync.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ── Auth Helpers ──────────────────────────────────────────
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function readUsers() {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch { return []; }
}

function writeUsers(users) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// ── Auth Endpoints ───────────────────────────────────────
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const users = readUsers();
    if (users.find(u => u.email === email.toLowerCase())) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      role: role || 'farmer',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeUsers(users);

    const { passwordHash, ...safeUser } = newUser;
    return res.json({ ok: true, user: safeUser, token: newUser.id });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ error: 'Signup failed.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const users = readUsers();
    const user = users.find(u => u.email === email.toLowerCase().trim());
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const { passwordHash, ...safeUser } = user;
    return res.json({ ok: true, user: safeUser, token: user.id });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

// ── Sync History ─────────────────────────────────────────
function readSyncedHistoryStore() {
  ensureDataDir();
  if (!fs.existsSync(SYNC_HISTORY_FILE)) return { records: [], updatedAt: null };
  try {
    const raw = fs.readFileSync(SYNC_HISTORY_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return { records: Array.isArray(parsed.records) ? parsed.records : [], updatedAt: parsed.updatedAt || null };
  } catch (err) {
    console.error('Failed to read sync history store:', err.message);
    return { records: [], updatedAt: null };
  }
}

function writeSyncedHistoryStore(records) {
  ensureDataDir();
  fs.writeFileSync(SYNC_HISTORY_FILE, JSON.stringify({ updatedAt: new Date().toISOString(), records }, null, 2), 'utf8');
}

app.post('/api/sync/history', (req, res) => {
  try {
    const { deviceId, records } = req.body || {};
    if (!deviceId || !Array.isArray(records)) {
      return res.status(400).json({ error: 'deviceId and records[] are required.' });
    }
    const store = readSyncedHistoryStore();
    const byId = new Map((store.records || []).map(item => [item.id, item]));
    const syncedIds = [];
    for (const incoming of records) {
      if (!incoming || typeof incoming !== 'object') continue;
      const id = String(incoming.id || '').trim();
      if (!id) continue;
      byId.set(id, { ...(byId.get(id) || {}), ...incoming, id, deviceId: String(incoming.deviceId || deviceId), serverSyncedAt: new Date().toISOString() });
      syncedIds.push(id);
    }
    const mergedRecords = Array.from(byId.values()).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 5000);
    writeSyncedHistoryStore(mergedRecords);
    return res.json({ ok: true, syncedCount: syncedIds.length, syncedIds });
  } catch (error) {
    console.error('Sync API Error:', error.message);
    return res.status(500).json({ error: 'Failed to sync history records.' });
  }
});

app.get('/api/sync/history', (req, res) => {
  try {
    const store = readSyncedHistoryStore();
    return res.json({ ok: true, updatedAt: store.updatedAt, count: store.records.length, records: store.records });
  } catch (error) {
    console.error('Sync fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to read synced history.' });
  }
});

// ── Proxy for Gemini API ─────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'I CAN PUT HERE TELL ME LINE ONLY ') {
      return res.status(500).json({ error: "Missing or invalid Gemini API Key in backend .env file." });
    }
    const { systemPrompt, question } = req.body;
    if (!systemPrompt || !question) {
      return res.status(400).json({ error: "Missing systemPrompt or question in request body." });
    }
    const payload = {
      system_instruction: { parts: { text: systemPrompt } },
      contents: [{ parts: [{ text: question }] }]
    };
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response from Gemini API");
    }
    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("Invalid response format from API");
    res.json({ reply: textResponse });
  } catch (error) {
    console.error('Backend Error:', error.message);
    res.status(500).json({ error: "An error occurred while communicating with the AI. Please check server logs." });
  }
});

app.listen(PORT, () => {
  console.log(`\n================================`);
  console.log(`🚀 PASHU CARE Backend Server`);
  console.log(`================================`);
  console.log(`Running on http://localhost:${PORT}`);
  console.log(`Secure API Key loaded from .env`);
  console.log(`Auth endpoints: /api/auth/login, /api/auth/signup`);
  console.log(`Ready for AI Chat requests!`);
});
