const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();
global.sseClients = [];

// ── CORS — allow local + Vercel frontend ─────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/subscribers',   require('./routes/subscribers'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin',         require('./routes/admin'));

// ── SSE ───────────────────────────────────────────────────────────
app.get('/api/sse/notifications', (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.flushHeaders();

  const client = { id: Date.now(), res };
  global.sseClients.push(client);
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  req.on('close', () => {
    global.sseClients = global.sseClients.filter(c => c.id !== client.id);
  });
});

// ── Health check ──────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// ── MongoDB ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdmin();
  })
  .catch(err => console.error('MongoDB error:', err));

async function seedAdmin() {
  const User   = require('./models/User');
  const bcrypt = require('bcryptjs');
  const exists = await User.findOne({ role: 'admin' });
  if (!exists) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
    await User.create({
      name:  'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@prpeptides.com',
      password: hash,
      role: 'admin',
    });
    console.log('Admin seeded');
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`PR Peptides Server running on port ${PORT}`));