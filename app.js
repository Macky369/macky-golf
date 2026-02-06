function setPointA() {
  // 画面上の「TOTAL YDS」から数字を取得
  const inputVal = document.getElementById('hole-total').value;
  totalDistance = parseInt(inputVal) || 0;

  // 以下、GPS計測開始の処理（前と同じ）
  requestWakeLock();
  if (navigator.vibrate) navigator.vibrate(50);
  /* ...略... */
}