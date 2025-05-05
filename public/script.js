async function fetchStatus() {
  try {
    const res = await fetch('/status');
    const data = await res.json();
    document.getElementById('stepCount').textContent = data.stepCount;
    document.getElementById('voltage').textContent = data.voltage + ' V';
    document.getElementById('battery').textContent = data.battery;

    const ledList = document.getElementById('ledStatusList');
    ledList.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
      const li = document.createElement('li');
      const status = data.ledStatus?.[`LED${i}`] || 'OFF';
      li.textContent = `LED${i}: ${status}`;
      li.style.color = status === 'ON' ? '#00e676' : '#888';
      ledList.appendChild(li);
    }
  } catch (err) {
    console.error('Failed to fetch status:', err);
  }
}

fetchStatus();
setInterval(fetchStatus, 2000);
