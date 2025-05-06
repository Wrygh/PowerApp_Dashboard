const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// Helpers
function loadData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ✅ POST: ESP32 sends sensor data (step count, voltage, battery, etc.)
app.post('/data', (req, res) => {
  const { stepCount, voltage, battery, ledStatus } = req.body;
  const data = loadData();
  data.stepCount = stepCount;
  data.voltage = voltage;
  data.battery = battery;
  data.ledStatus = ledStatus || data.ledStatus || {};
  saveData(data);
  res.sendStatus(200);
});

// ✅ POST: MIT App sends LED control command
app.post('/command', (req, res) => {
  const { command } = req.body;

  if (typeof command !== 'number' || command < 1 || command > 12) {
    return res.status(400).json({ error: 'Invalid command' });
  }

  const ledNum = Math.floor((command + 1) / 2);
  const ledState = command % 2 === 1 ? 'ON' : 'OFF';

  const data = loadData();
  if (!data.ledStatus) data.ledStatus = {};
  data.ledStatus[`LED${ledNum}`] = ledState;

  saveData(data);
  res.sendStatus(200);
});

// ✅ GET: Frontend fetches dashboard data
app.get('/status', (req, res) => {
  const data = loadData();
  res.json(data);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


