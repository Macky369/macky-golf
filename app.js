let pointA = null;
let watchId = null;
let wakeLock = null;
let totalDistance = 0; // ホールの総距離

// スリープ防止
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (err) {}
}

// 計測開始ボタン
function setPointA() {
  // 現場でサッと入力（例：400）
  const input = prompt("ホールの総距離（ヤード）を入力してください", "400");
  if (input === null) return; 
  totalDistance = parseInt(input);

  requestWakeLock();
  if (navigator.vibrate) navigator.vibrate(50);
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pointA = position.coords;
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
        const distYards = Math.floor(distMetres * 1.09361);
        const remainingYards = totalDistance - distYards;

        // 画面表示の更新（IDはHTML側と合わせてください）
        // 飛距離（上段）
        document.getElementById('distance-display').innerText = distYards.toString().padStart(3, '0');
        // 残り距離（もしHTMLに'remaining-display'があれば表示）
        const remainingEl = document.getElementById('remaining-display');
        if (remainingEl) {
            remainingEl.innerText = remainingYards > 0 ? remainingYards : 0;
        }
      }
    },
    (error) => console.log(error),
    { enableHighAccuracy: true }
  );
}

// 距離計算アルゴリズム（水平距離）
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
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
  totalDistance = 0;
  if (watchId) navigator.geolocation.clearWatch(watchId);
  document.getElementById('distance-display').innerText = "000";
  const remainingEl = document.getElementById('remaining-display');
  if (remainingEl) remainingEl.innerText = "---";
  if (wakeLock) { wakeLock.release(); wakeLock = null; }
}