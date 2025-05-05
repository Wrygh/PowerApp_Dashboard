const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

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

// POST from ESP32 (to send real-time sensor data)
app.post('/data', (req, res) => {
  const { stepCount, voltage, battery, ledStatus } = req.body;
  const data = loadData();
  data.stepCount = stepCount;
  data.voltage = voltage;
  data.battery = battery;
  data.ledStatus = ledStatus;
  saveData(data);
  res.sendStatus(200); // Confirm received data
});

// POST from MIT App (to control LED states)
app.post('/command', (req, res) => {
  const { command } = req.body; // Command will have a value 1-12 representing the LED state (on/off)
  const data = loadData();
  
  // Map the LED command to on/off state
  const ledNum = Math.floor((command + 1) / 2); // If command 1-2 -> LED1, command 3-4 -> LED2, etc.
  const ledState = command % 2 === 1 ? 'ON' : 'OFF';

  // Make sure ledStatus exists
  if (!data.ledStatus) data.ledStatus = {};

  // Store LED states in the data object
  data.ledStatus[`LED${ledNum}`] = ledState;
  saveData(data);

  res.sendStatus(200); // Confirm LED command
});

// GET latest data (for ESP32 or MIT App to fetch current status)
app.get('/status', (req, res) => {
  const data = loadData();
  res.json(data);
});

// Serve static files (such as the frontend dashboard)
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
