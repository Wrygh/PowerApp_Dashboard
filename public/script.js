const stepChart = new Chart(document.getElementById('stepChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Steps Over Time',
      data: [],
      backgroundColor: 'rgba(0,170,255,0.1)',
      borderColor: '#00aaff',
      borderWidth: 2,
      pointRadius: 2,
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff"
        }
      },
      x: {
        ticks: {
          color: "#ffffff"
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff"
        }
      }
    }
  }
});

let dataPoints = 0;

async function fetchData() {
  try {
    const response = await fetch('/status');
    const data = await response.json();

    document.getElementById("stepCount").textContent = data.stepCount || "--";
    document.getElementById("voltage").textContent = (data.voltage || "--") + " V";

    // LED Status
    const ledStatuses = data.ledStatus || {};
    let ledHTML = "";
    for (let i = 1; i <= 6; i++) {
      const status = ledStatuses[`LED${i}`] || "--";
      ledHTML += `<p>LED ${i}: ${status}</p>`;
    }
    document.getElementById("ledStatus").innerHTML = ledHTML;

    // Battery Circle
    const batteryValue = data.battery || 0;
    const batteryCircle = document.getElementById("batteryCircle");
    batteryCircle.setAttribute("data-label", `${batteryValue}%`);
    batteryCircle.style.background = `conic-gradient(#00aaff 0% ${batteryValue}%, #222 ${batteryValue}% 100%)`;

    // Update chart
    const currentHour = new Date().getHours();
    if (dataPoints >= 24) {
      stepChart.data.labels.shift();
      stepChart.data.datasets[0].data.shift();
    }

    stepChart.data.labels.push(`${currentHour}:00`);
    stepChart.data.datasets[0].data.push(data.stepCount || 0);
    stepChart.update();
    dataPoints++;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

setInterval(fetchData, 2000); // 2s interval
fetchData();
