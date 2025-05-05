const stepData = [];
const labels = [];

const stepCtx = document.getElementById('stepChart').getContext('2d');
const batteryCanvas = document.getElementById('batteryGauge');
const batteryCtx = batteryCanvas.getContext('2d');

// Setup Step Chart
const stepChart = new Chart(stepCtx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Steps',
      data: stepData,
      borderColor: '#00aaff',
      backgroundColor: 'rgba(0, 170, 255, 0.2)',
      borderWidth: 2,
      tension: 0.3,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#00aaff'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      x: {
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#ffffff' }
      }
    }
  }
});

// Draw battery gauge as circular arc
function drawBatteryGauge(percentage) {
  const size = batteryCanvas.width;
  const center = size / 2;
  const radius = center - 10;

  batteryCtx.clearRect(0, 0, size, size);

  // Background circle
  batteryCtx.beginPath();
  batteryCtx.arc(center, center, radius, 0, 2 * Math.PI);
  batteryCtx.strokeStyle = '#222';
  batteryCtx.lineWidth = 10;
  batteryCtx.stroke();

  // Foreground arc
  batteryCtx.beginPath();
  batteryCtx.arc(center, center, radius, -0.5 * Math.PI, (percentage / 100) * 2 * Math.PI - 0.5 * Math.PI);
  batteryCtx.strokeStyle = '#00aaff';
  batteryCtx.lineWidth = 10;
  batteryCtx.stroke();

  // Text
  batteryCtx.fillStyle = '#ffffff';
  batteryCtx.font = '16px Segoe UI';
  batteryCtx.textAlign = 'center';
  batteryCtx.fillText(percentage + '%', center, center + 6);
}

// LED text mapping
function ledTextMap(data) {
  const leds = [];
  for (let i = 1; i <= 6; i++) {
    const state = data.ledStatus?.[`LED${i}`] || '--';
    leds.push(`LED ${i}: ${state}`);
  }
  return leds;
}

// Fetch data
async function fetchData() {
  try {
    const response = await fetch('/status');
    const data = await response.json();

    document.getElementById("stepCount").textContent = data.stepCount ?? '--';
    document.getElementById("stepCountTotal").textContent = data.stepCount ?? '--'; // same value for demo
    document.getElementById("voltage").textContent = (data.voltage ?? '--') + " V";
    document.getElementById("battery").textContent = (data.battery ?? '--') + "%";

    drawBatteryGauge(data.battery ?? 0);

    const ledLines = ledTextMap(data);
    document.getElementById("ledStatus").innerHTML = ledLines.map(s => `<div>${s}</div>`).join('');

    // Push to chart
    const now = new Date();
    const timeLabel = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    if (labels.length > 20) {
      labels.shift();
      stepData.shift();
    }
    labels.push(timeLabel);
    stepData.push(data.stepCount ?? 0);
    stepChart.update();

  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

// Initial draw
drawBatteryGauge(0);

// Poll every second
setInterval(fetchData, 1000);
