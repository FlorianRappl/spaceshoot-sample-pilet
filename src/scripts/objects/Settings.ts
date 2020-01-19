import { defaultConnection, primaryColors, secondaryColors } from '../constants';
import { IGame, ISettings } from '../types';
import { sounds } from '../managers';

export class Settings implements ISettings {
  playerName = 'Player';
  playerColors: [string, string] = ['127,255,0', '192,255,62'];
  droneColor = 1;
  display = 'stretched';
  server = '';

  get playSounds() {
    return sounds.shouldPlay;
  }

  set playSounds(value: boolean) {
    sounds.shouldPlay = value;
  }

  constructor(private game: IGame) {
    const s = JSON.parse(localStorage.getItem('settings'));

    if (s) {
      this.playerName = s.playerName || 'Player';
      this.playerColors = s.playerColors || [primaryColors[0], secondaryColors[0]];
      this.droneColor = s.droneColor;
      this.display = s.display;
      this.playSounds = !!s.playSounds;
      this.server = s.server || defaultConnection;
    }
  }

  init() {
    if (this.playSounds) {
      const { host } = this.game;
      host.querySelector<HTMLAudioElement>('#music').play();
    }
  }

  save() {
    const { c, myship, host } = this.game;
    c.canvas.className = this.display;
    localStorage.setItem(
      'settings',
      JSON.stringify({
        playerName: this.playerName,
        playerColors: this.playerColors,
        droneColor: this.droneColor,
        display: this.display,
        playSounds: this.playSounds,
        server: this.server,
      }),
    );

    if (this.playSounds) {
      host.querySelector<HTMLAudioElement>('#music').play();
    } else {
      host.querySelector<HTMLAudioElement>('#music').pause();
    }

    if (myship) {
      myship.primaryColor = this.playerColors[0];
      myship.secondaryColor = this.playerColors[1];
    }
  }
}
