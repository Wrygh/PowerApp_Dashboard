// Initialize chart
const ctx = document.getElementById('stepChart').getContext('2d');
const stepChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array.from({ length: 10 }, (_, i) => `T-${9 - i}`),
    datasets: [{
      label: 'Steps',
      data: Array(10).fill(0),
      backgroundColor: 'rgba(0, 191, 255, 0.2)',
      borderColor: '#00bfff',
      borderWidth: 2,
      tension: 0.3,
      fill: true,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: '#333333'
        }
      },
      x: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: '#333333'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    }
  }
});

// Function to simulate data updates
function simulateData() {
  const stepCount = Math.floor(Math.random() * 1000);
  const todaySteps = Math.floor(Math.random() * 5000);
  const batteryLevel = Math.floor(Math.random() * 100);
  const voltage = (Math.random() * 5).toFixed(2);
  const ledStatus = Math.random() > 0.5 ? 'ON' : 'OFF';

  // Update DOM elements
  document.getElementById('stepCount').textContent = stepCount;
  document.getElementById('todaySteps').textContent = todaySteps;
  document.getElementById('voltage').textContent = `${voltage} V`;
  document.getElementById('ledStatus').textContent = ledStatus;

  // Update battery gauge
  const batteryFill = document.getElementById('batteryFill');
  const batteryText = document.getElementById('batteryText');
  batteryFill.style.background = `conic-gradient(#00bfff ${batteryLevel}%, #1e1e1e 0%)`;
  batteryText.textContent = `${batteryLevel}%`;

  // Update chart
  stepChart.data.datasets[0].data.push(stepCount);
  stepChart.data.datasets[0].data.shift();
  stepChart.update();
}

// Initial data simulation
simulateData();

// Update data every second
setInterval(simulateData, 1000);
