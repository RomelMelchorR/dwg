const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./src/db');

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('plan'), (req, res) => {
  res.json({ file: req.file.filename });
});

app.post('/api/zones', async (req, res) => {
  const { planId, zones } = req.body;
  try {
    const [result] = await db.query(
      'REPLACE INTO plan_zones (plan_id, zones_json) VALUES (?, ?)',
      [planId, JSON.stringify(zones)]
    );
    res.json({ id: result.insertId || planId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

app.get('/api/zones/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const [rows] = await db.query('SELECT zones_json FROM plan_zones WHERE plan_id = ?', [planId]);
    const zones = rows.length ? JSON.parse(rows[0].zones_json) : [];
    res.json({ zones });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
