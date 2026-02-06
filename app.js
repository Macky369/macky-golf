let pointA = null;
let watchId = null;
let wakeLock = null;

// 画面をスリープさせない機能（時短・実戦用）
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (err) {
    console.log(`${err.name}, ${err.message}`);
  }
}

function setPointA() {
  requestWakeLock(); // 計測開始時にスリープ防止を起動
  if (navigator.vibrate) navigator.vibrate(50);
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pointA = position.coords;
        alert("地点A（ティーグラウンド）を記録！歩き出してください。");
        startTracking();
      },
      (error) => alert("GPSをオンにしてください"),
      { enableHighAccuracy: true }
    );
  }
}

function startTracking() {
  if (watchId) navigator.geolocation.clearWatch(watchId);
  
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (pointA) {
        const distMetres = calculateDistance(
          pointA.latitude, pointA.longitude,
          position.coords.latitude, position.coords.longitude
        );
        const distYards = distMetres * 1.09361; // メートルをヤードに変換
        document.getElementById('distance-display').innerText = 
          Math.floor(distYards).toString().padStart(3, '0');
      }
    },
    (error) => console.log(error),
    { enableHighAccuracy: true }
  );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // 地球の半径(m)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function resetMeasurement() {
  if (navigator.vibrate) navigator.vibrate([40, 40, 40]);
  pointA = null;
  if (watchId) navigator.geolocation.clearWatch(watchId);
  document.getElementById('distance-display').innerText = "000";
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}