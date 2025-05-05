let stepChart;
let stepHistory = [];

function drawBatteryGauge(value) {
  const canvas = document.getElementById('batteryGauge');
  const ctx = canvas.getContext('2d');
  const radius = canvas.width / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background circle
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
  ctx.strokeStyle = '#2f2f2f';
  ctx.lineWidth = 15;
  ctx.stroke();

  // Foreground arc
  const endAngle = (value / 100) * 2 * Math.PI;
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 10, -0.5 * Math.PI, endAngle - 0.5 * Math.PI);
  ctx.strokeStyle = '#58a6ff';
  ctx.lineWidth = 15;
  ctx.stroke();
}

function initStepChart() {
  const ctx = document.getElementById('stepChart').getContext('2d');
  stepChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Step Count',
        data: [],
        borderColor: '#58a6ff',
        backgroundColor: 'rgba(88, 166, 255, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      scales: {
        x: { ticks: { color: '#8b949e' } },
        y: { ticks: { color: '#8b949e' } }
      },
      plugins: {
        legend: {
          labels: { color: '#c9d1d9' }
        }
      }
    }
  });
}

function updateChart(stepCount) {
  const now = new Date();
  const label = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (stepChart.data.labels.length >= 24) {
    stepChart.data.labels.shift();
    stepChart.data.datasets[0].data.shift();
  }

  stepChart.data.labels.push(label);
  stepChart.data.datasets[0].data.push(stepCount);
  stepChart.update();
}

initStepChart();

setInterval(async () => {
  try {
    const response = await fetch('/status');
    const data = await response.json();

    document.getElementById("stepCount").textContent = data.stepCount ?? '--';
    document.getElementById("stepCountTotal").textContent = data.stepCountTotal ?? '--';
    document.getElementById("voltage").textContent = (data.voltage ?? '--') + " V";
    document.getElementById("battery").textContent = (data.battery ?? '--') + "%";
    drawBatteryGauge(data.battery || 0);

    for (let i = 1; i <= 6; i++) {
      document.getElementById(`LED${i}`).textContent = data.ledStatus?.[`LED${i}`] ?? '--';
    }

    updateChart(data.stepCount || 0);
  } catch (e) {
    console.error("Failed to fetch data", e);
  }
}, 3000);
