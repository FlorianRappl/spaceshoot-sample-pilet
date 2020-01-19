export function gameMenuHelper(running: boolean) {
  document.getElementById('menu-leave').hidden = !running;
  document.getElementById('menu-empty').hidden = !running;
  document.getElementById('menu-scores').hidden = !running;
  document.getElementById('menu-mphost').hidden = running;
  document.getElementById('menu-mpjoin').hidden = running;
  document.getElementById('menu-sp').hidden = running;
}
