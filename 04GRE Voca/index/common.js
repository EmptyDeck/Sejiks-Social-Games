function vibrate(ms = 15) {
  if (navigator.vibrate) try { navigator.vibrate(ms); } catch(_) {}
}

function goToPage(url) {
  window.location.href = url;
}
