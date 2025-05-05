let stepChart;
let stepHistory = [];

function initStepChart() {
  const ctx = document.getElementById('stepChart').getContext('2d');
  stepChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Step Count',
        data: [],
        borderColor: '#0077cc',
        backgroundColor: 'rgba(0, 119, 204, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#cccccc',
            precision: 0,
            stepSize: 1
          }
        },
        x: {
          ticks: {
            color: '#cccccc'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#cccccc'
          }
        }
      }
    }
  });
}

function updateStepChart(stepCount) {
  const now = new Date();
  const label = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (stepChart.data.labels.length > 24) {
    stepChart.data.labels.shift();
    stepChart.data.datasets[0].data.shift();
  }

  stepChart.data.labels.push(label);
  stepChart.data.datasets[0].data.push(stepCount);
  stepChart.update();
}

function updateBatteryGauge(ctx, value) {
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Battery'],
      datasets: [{
        data: [value, 100 - value],
        backgroundColor: ['#00ccff', '#333333'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        legend: { display: false }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStepChart();
  const batteryCanvas = document.getElementById('batteryGauge');
  updateBatteryGauge(batteryCanvas.getContext('2d'), 0);

  setInterval(async () => {
    try {
      const response = await fetch('/status');
      const data = await response.json();

      document.getElementById("stepCount").textContent = data.stepCount ?? '--';
      document.getElementById("stepCountTotal").textContent = data.stepCount ?? '--';
      document.getElementById("voltage").textContent = data.voltage + " V";
      document.getElementById("battery").textContent = data.battery + "%";
      updateBatteryGauge(batteryCanvas.getContext('2d'), data.battery);

      // LED status
      const statusContainer = document.getElementById('ledStatus');
      statusContainer.innerHTML = '';
      for (let i = 1; i <= 6; i++) {
        const status = data.ledStatus?.[`LED${i}`] || "--";
        const div = document.createElement("div");
        div.textContent = `LED ${i}: ${status}`;
        statusContainer.appendChild(div);
      }

      updateStepChart(data.stepCount);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  }, 1000);
});
