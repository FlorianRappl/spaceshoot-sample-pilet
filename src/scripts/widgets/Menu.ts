import { hexToRgb, gameMenuHelper, rgbToHex } from '../helpers';
import { IGame, IMenu } from '../types';

export class Menu implements IMenu {
  constructor(private game: IGame) {}

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  isOpen() {
    const m = document.getElementById('menuscreen');
    return m.style.display === 'block';
  }

  open() {
    if (!this.isOpen()) {
      const game = this.game;
      const m = document.getElementById('menuscreen');
      const im = document.getElementById('inactive');

      game.running = game.running && game.multiplayer;
      m.style.display = 'block';
      im.style.display = 'block';
      this.select('menu-main');
      m.focus();

      document.querySelector<HTMLAudioElement>('#music').volume = game.running ? 0.3 : 1;
    }
  }

  close() {
    if (this.isOpen()) {
      const game = this.game;
      const m = document.getElementById('menuscreen');
      const im = document.getElementById('inactive');

      game.running = true;
      m.style.display = 'none';
      im.style.display = 'none';
      game.c.canvas.focus();

      document.querySelector<HTMLAudioElement>('#music').volume = 0.3;
    }
  }

  select(id: string) {
    const m = document.getElementById('menuscreen');
    const items = [].slice.call(m.getElementsByTagName('ul'));

    for (const item of items) {
      item.style.display = item.id === id ? 'block' : 'none';
    }
  }

  disableMultiplayer() {
    const mpjoin = document.getElementById('menu-mpjoin');
    const mphost = document.getElementById('menu-mphost');
    mpjoin.className = 'menuitem disabled';
    mphost.className = 'menuitem disabled';
    mpjoin.onclick = null;
    mphost.onclick = null;
  }

  enableMultiplayer() {
    const mpjoin = document.getElementById('menu-mpjoin');
    const mphost = document.getElementById('menu-mphost');
    mpjoin.className = 'menuitem';
    mphost.className = 'menuitem';
    mpjoin.onclick = () => {
      this.select('menu-join');
      this.game.network.requestList();
    };
    mphost.onclick = () => this.select('menu-host');
  }

  switch(on: string, off: string) {
    document.getElementById(on).onclick = () => {
      document.getElementById(on).className = 'menuitem picked';
      document.getElementById(off).className = 'menuitem';
    };
    document.getElementById(off).onclick = () => {
      document.getElementById(off).className = 'menuitem picked';
      document.getElementById(on).className = 'menuitem';
    };
  }

  init() {
    document.getElementById('menu-sp').onclick = () => {
      this.game.startSingle();
      this.toggle();
    };
    document.getElementById('menu-setname').onclick = () => {
      this.select('menu-user');
    };
    document.getElementById('menu-setscr').onclick = () => {
      document.querySelector<HTMLInputElement>('#menu-server-ip').value = this.game.settings.server;
      this.select('menu-scr');
    };
    document.getElementById('menu-leave').onclick = () => {
      this.game.reset();
      gameMenuHelper(false);
    };
    document.getElementById('menu-hostadvanced').onclick = () => {
      this.select('menu-host-adv');
    };
    document.getElementById('menu-hostadvprevious').onclick = () => {
      this.select('menu-host');
    };
    document.getElementById('menu-lookkeys').onclick = () => {
      this.select('menu-keys');
    };
    document.getElementById('menu-scores').onclick = () => {
      const el = document.getElementById('menu-current-scores-list');
      const entries = this.game.score.getRanking();
      el.innerHTML = `<p>${entries.join('</p><p>')}</p>`;
      this.select('menu-currentscores');
    };
    document.getElementById('menu-highscores').onclick = () => {
      const el = document.getElementById('menu-scores-list');
      const entries = this.game.score.getHighscores();
      el.innerHTML = `<p>${entries.join('</p><p>')}</p>`;
      this.select('menu-scores');
    };
    document.getElementById('menu-esc').onclick = () => {
      this.toggle();
    };
    document.getElementById('menu-usersave').onclick = () => {
      const game = this.game;
      const { settings, network } = game;
      settings.playerName = document.querySelector<HTMLInputElement>('#menu-player-name').value;
      const primaryColor = hexToRgb(document.querySelector<HTMLInputElement>('#menu-primary-color').value);
      const secondaryColor = hexToRgb(document.querySelector<HTMLInputElement>('#menu-secondary-color').value);
      settings.playerColors = [primaryColor, secondaryColor];

      if (game.multiplayer) {
        network.update();
      }

      settings.save();
      this.select('menu-main');
    };
    this.switch('menu-withsounds', 'menu-wosounds');
    this.switch('menu-friendly-on', 'menu-friendly-off');
    this.switch('menu-negative-on', 'menu-negative-off');
    this.switch('menu-upgrades-on', 'menu-upgrades-off');
    document.getElementById('menu-hostmatch').onclick = () => {
      const g = this.game;
      g.network.host({
        name: document.querySelector<HTMLInputElement>('#menu-game-name').value,
        password: document.querySelector<HTMLInputElement>('#menu-game-password').value,
        friendly: document.getElementById('menu-friendly-on').className === 'menuitem picked',
        maxplayers: parseInt(document.querySelector<HTMLInputElement>('#menu-game-maxplayers').value),
        maxbots: parseInt(document.querySelector<HTMLInputElement>('#menu-game-maxbots').value),
        negative: document.getElementById('menu-negative-on').className === 'menuitem picked',
        upgrades: document.getElementById('menu-upgrades-on').className === 'menuitem picked',
        width: g.c.canvas.width,
        height: g.c.canvas.height,
      });
      this.toggle();
    };
    document.getElementById('menu-scrsave').onclick = () => {
      const { settings, network } = this.game;
      settings.playSounds = document.getElementById('menu-wosounds').className === 'menuitem picked' ? false : true;
      const srv = document.querySelector<HTMLInputElement>('#menu-server-ip').value;

      if (srv !== settings.server) {
        settings.server = srv;
        network.connect();
      }

      settings.save();
      this.select('menu-main');
    };
    document.getElementById('menu-hostprevious').onclick = document.getElementById(
      'menu-joinprevious',
    ).onclick = document.getElementById('menu-userprevious').onclick = document.getElementById(
      'menu-keysprevious',
    ).onclick = document.getElementById('menu-scrprevious').onclick = document.getElementById(
      'menu-currentscoresprevious',
    ).onclick = document.getElementById('menu-scoresprevious').onclick = () => {
      this.select('menu-main');
    };
    document.getElementById(this.game.settings.playSounds ? '#menu-withsounds' : '#menu-wosounds').className =
      'menuitem picked';
    document.querySelector<HTMLInputElement>('#menu-player-name').value = this.game.settings.playerName;
    document.querySelector<HTMLInputElement>('#menu-primary-color').value = rgbToHex(
      this.game.settings.playerColors[0],
    );
    document.querySelector<HTMLInputElement>('#menu-secondary-color').value = rgbToHex(
      this.game.settings.playerColors[1],
    );
  }
}
