let pointA = null;

function setPointA() {
  if (navigator.vibrate) navigator.vibrate(50); // 0.05秒震える
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pointA = position.coords;
        alert("地点Aを記録しました！移動を開始してください。");
        startTracking();
      },
      (error) => alert("位置情報が取得できませんでした。"),
      { enableHighAccuracy: true }
    );
  }
}

function startTracking() {
  navigator.geolocation.watchPosition(
    (position) => {
      if (pointA) {
        const distance = calculateDistance(
          pointA.latitude, pointA.longitude,
          position.coords.latitude, position.coords.longitude
        );
        document.getElementById('distance-display').innerText = 
          Math.floor(distance).toString().padStart(3, '0');
      }
    },
    (error) => console.log(error),
    { enableHighAccuracy: true }
  );
}

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
  return (R * c) * 1.09361; // ヤード変換
}

function resetMeasurement() {
  if (navigator.vibrate) navigator.vibrate([40, 40, 40]); // 短く3回震える
  pointA = null;
  document.getElementById('distance-display').innerText = "000";
}