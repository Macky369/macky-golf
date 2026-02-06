function setPointA() {
  // 画面の入力箱から「400」などの数字を読み取る（検索には飛びません！）
  const inputVal = document.getElementById('hole-total').value;
  totalDistance = parseInt(inputVal) || 0;

  requestWakeLock(); // スリープ防止
  if (navigator.vibrate) navigator.vibrate(50); // ブルッ！
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pointA = position.coords;
        // 「計測中...」などの表示に切り替えると分かりやすいです
      },
      (error) => alert("GPSをオンにしてください"),
      { enableHighAccuracy: true }
    );
  }
}