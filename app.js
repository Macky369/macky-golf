function startShot() {
  if (navigator.vibrate) navigator.vibrate(50);
  
  // ★改善ポイント：GPSを待たずに、まず画面を「400」にする！
  document.getElementById('remaining').innerText = totalDist;
  document.getElementById('drive').innerText = "000";

  if (!navigator.geolocation) return alert("GPS不可");

  if (watchId) navigator.geolocation.clearWatch(watchId);

  navigator.geolocation.getCurrentPosition(pos => {
    startPos = pos.coords;
    // 位置が確定したら、ここから自動で数字が減り始める
    watchId = navigator.geolocation.watchPosition(update, null, {enableHighAccuracy:true});
  }, (err) => {
    // 万が一エラーが出た時は表示を戻す
    document.getElementById('remaining').innerText = "---";
    alert("GPSの測位に失敗しました");
  }, {enableHighAccuracy:true, timeout:5000}); // 5秒待ってもダメなら教えてくれる
}