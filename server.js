const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST from ESP32
app.post('/data', (req, res) => {
  const { stepCount, voltage, battery, ledStatus } = req.body;
  const data = loadData();

  data.stepCount = stepCount;
  data.voltage = voltage;
  data.battery = battery;
  data.ledStatus = ledStatus;
  data.timestamp = new Date().toISOString();

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

// GET latest data
app.get('/status', (req, res) => {
  const data = loadData();
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
