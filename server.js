const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // To handle CORS for frontend requests
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static('public')); // Static files like images

const DATA_FILE = path.join(__dirname, 'data.json');

// Helper: load data
function loadData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Helper: save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST from ESP32 (updates data)
app.post('/data', (req, res) => {
  const { stepCount, voltage, battery, ledStatus } = req.body;
  const data = loadData();
  data.stepCount = stepCount;
  data.voltage = voltage;
  data.battery = battery;
  data.ledStatus = ledStatus;
  saveData(data);
  res.sendStatus(200);
});

// POST from MIT App (LED control)
app.post('/command', (req, res) => {
  const { command } = req.body;
  const data = loadData();
  const ledNum = Math.floor((command + 1) / 2);
  const ledState = command % 2 === 1 ? 'ON' : 'OFF';
  if (!data.ledStatus) data.ledStatus = {};
  data.ledStatus[`LED${ledNum}`] = ledState;
  saveData(data);
  res.sendStatus(200);
});

// GET latest data for frontend (Step count, Voltage, Battery, LED Status)
app.get('/status', (req, res) => {
  const data = loadData();
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

