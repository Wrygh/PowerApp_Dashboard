const stepGraph = document.getElementById("stepGraph").getContext("2d");

const myChart = new Chart(stepGraph, {
  type: "line",
  data: {
    labels: ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h"],
    datasets: [{
      label: 'Step Count',
      data: [0, 20, 30, 40, 45, 50, 60, 70, 80, 100, 120, 150],
      borderColor: "#00bfff",
      backgroundColor: "rgba(0, 191, 255, 0.3)",
      fill: true,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  }
});

// Simulated real-time data
setInterval(async () => {
  // Example data - Replace with actual API response
  const data = {
    stepCount: Math.floor(Math.random() * 100),
    battery: Math.floor(Math.random() * 100),
    voltage: (Math.random() * 5).toFixed(2),
    ledStatus: "LED 1 ON",
  };

  // Update Step Count
  document.getElementById("stepCount").textContent = data.stepCount;
  document.getElementById("todaySteps").textContent = data.stepCount; // For today
  myChart.data.datasets[0].data.push(data.stepCount);
  myChart.data.datasets[0].data.shift();
  myChart.update();

  // Update Battery Level Gauge
  document.getElementById("battery").textContent = `${data.battery}%`;
  document.getElementById("batteryGauge").style.background = `conic-gradient(#00bfff ${data.battery}% , #1e1e1e 0%)`;

  // Update Voltage
  document.getElementById("voltage").textContent = `${data.voltage} V`;

  // Update LED Status
  document.getElementById("ledStatus").textContent = data.ledStatus;
}, 1000);
