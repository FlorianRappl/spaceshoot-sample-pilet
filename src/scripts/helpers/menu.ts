import { IGame } from '../types';

export function gameMenuHelper(game: IGame, running: boolean) {
  const { host } = game;
  host.querySelector<HTMLElement>('#menu-leave').hidden = !running;
  host.querySelector<HTMLElement>('#menu-empty').hidden = !running;
  host.querySelector<HTMLElement>('#menu-scores').hidden = !running;
  host.querySelector<HTMLElement>('#menu-mphost').hidden = running;
  host.querySelector<HTMLElement>('#menu-mpjoin').hidden = running;
  host.querySelector<HTMLElement>('#menu-sp').hidden = running;
}
