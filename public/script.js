<script>
  const batteryGauge = document.getElementById("batteryGauge");
  const batteryText = document.getElementById("batteryText");

  const ctx = document.getElementById('stepChart').getContext('2d');
  const stepChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 10 }, (_, i) => `T-${9 - i}`),
      datasets: [{
        label: 'Steps',
        data: Array(10).fill(0),
        borderColor: '#00bfff',
        backgroundColor: 'rgba(0,191,255,0.1)',
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#fff' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#fff' },
          grid: { color: '#333' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#fff' },
          grid: { color: '#333' }
        }
      }
    }
  });

  async function updateData() {
    try {
      const res = await fetch('/status');
      const data = await res.json();

      const stepCount = data.stepCount || 0;
      const todaySteps = data.todaySteps || stepCount;
      const battery = data.battery || 0;
      const voltage = data.voltage || 0;
      const ledStatus = data.ledStatus || {};

      document.getElementById("stepCount").textContent = stepCount;
      document.getElementById("todaySteps").textContent = todaySteps;
      document.getElementById("voltage").textContent = voltage + " V";
      batteryText.textContent = battery + "%";
      batteryGauge.style.background = `conic-gradient(#00bfff ${battery}%, #111 0%)`;

      // ✅ Properly display each LED status
      let statusText = '';
      for (let i = 1; i <= 6; i++) {
        const state = ledStatus[`LED${i}`] || '--';
        statusText += `LED${i}: ${state}<br>`;
      }
      document.getElementById("ledStatus").innerHTML = statusText;

      stepChart.data.datasets[0].data.push(stepCount);
      stepChart.data.datasets[0].data.shift();
      stepChart.update();

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  updateData();
  setInterval(updateData, 1000); // Update every second
</script>
