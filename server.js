const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data.json');
const HISTORY_FILE = path.join(__dirname, 'history.json');

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(HISTORY_FILE));
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

app.post('/data', (req, res) => {
  const { stepCount, voltage, battery, ledStatus } = req.body;

  const data = loadData();
  data.stepCount = stepCount;
  data.voltage = voltage;
  data.battery = battery;
  data.ledStatus = ledStatus;

  // Total step count tracking
  if (!data.stepCountTotal) data.stepCountTotal = 0;
  data.stepCountTotal += stepCount;

  saveData(data);

  // Append to history for graph
  const history = loadHistory();
  history.push({ time: Date.now(), stepCount });
  if (history.length > 144) history.shift(); // keep last 12 hours (if every 5min)
  saveHistory(history);

  res.sendStatus(200);
});

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

app.get('/status', (req, res) => {
  const data = loadData();
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
