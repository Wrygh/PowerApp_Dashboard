setInterval(async () => {
  try {
    const response = await fetch('/status');
    const data = await response.json();

    document.getElementById("stepCount").textContent = data.stepCount || 0;
    document.getElementById("dailyStepCount").textContent = data.stepCount || 0;
    document.getElementById("voltage").textContent = data.voltage + " V";
    document.getElementById("batteryCircle").textContent = data.battery + "%";
    document.getElementById("batteryCircle").style.background =
      `conic-gradient(#00aaff 0% ${data.battery}%, #333 ${data.battery}% 100%)`;

    const ledStatusDiv = document.getElementById("ledStatus");
    ledStatusDiv.innerHTML = "";
    for (let i = 1; i <= 6; i++) {
      const ledKey = "LED" + i;
      const state = data.ledStatus && data.ledStatus[ledKey] ? data.ledStatus[ledKey] : "--";
      const div = document.createElement("div");
      div.textContent = `${ledKey}: ${state}`;
      ledStatusDiv.appendChild(div);
    }

    const now = new Date();
    const time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
    stepChart.data.labels.push(time);
    stepChart.data.datasets[0].data.push(data.stepCount);
    if (stepChart.data.labels.length > 20) {
      stepChart.data.labels.shift();
      stepChart.data.datasets[0].data.shift();
    }
    stepChart.update();
  } catch (e) {
    console.error("Failed to fetch data", e);
  }
}, 1000);

const stepChart = new Chart(document.getElementById('stepChart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Step Count',
      data: [],
      borderColor: '#00aaff',
      backgroundColor: 'transparent',
      borderWidth: 2,
      tension: 0.2
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#fff' },
        grid: { color: '#444' }
      },
      x: {
        ticks: { color: '#fff' },
        grid: { color: '#444' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#00aaff' }
      }
    }
  }
});
