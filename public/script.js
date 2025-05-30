<script>
  document.addEventListener("DOMContentLoaded", () => {
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

        console.log("Received data from backend:", data);

        const stepCount = data.stepCount || 0;
        const todaySteps = data.todaySteps || stepCount;
        const voltage = data.voltage || 0;
        const ledStatus = data.ledStatus || {};

        // Hardcoded battery value
        const battery = 97;

        // Update DOM elements
        document.getElementById("stepCount").textContent = stepCount;
        document.getElementById("todaySteps").textContent = todaySteps;
        document.getElementById("voltage").textContent = voltage + " V";

        // Update LED status
        let ledText = '';
        for (let i = 1; i <= 6; i++) {
          const status = ledStatus[`LED${i}`] || '--';
          console.log(`LED${i} status:`, status);
          ledText += `LED${i}: ${status}<br />`;
        }
        document.getElementById("ledStatus").innerHTML = ledText;

        // Update battery display
        console.log(`Hardcoded Battery: ${battery}%`);
        batteryText.textContent = battery + "%";
        batteryGauge.style.background = `conic-gradient(#00bfff ${battery}%, #111 0%)`;

        // Update chart data
        stepChart.data.datasets[0].data.push(stepCount);
        stepChart.data.datasets[0].data.shift();
        stepChart.update();

      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    async function sendCommand(command) {
      try {
        const res = await fetch('/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command })
        });

        if (!res.ok) {
          throw new Error('Failed to send command');
        }

        console.log(`Command ${command} sent successfully`);
      } catch (error) {
        console.error('Error sending command:', error);
      }
    }

    // Initial actions
    sendCommand(1);
    updateData();
    setInterval(updateData, 1000); // Repeat every second
  });
</script>
