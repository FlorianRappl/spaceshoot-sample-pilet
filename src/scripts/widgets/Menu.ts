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
    const { host } = this.game;
    const m = host.querySelector<HTMLElement>('#menuscreen');
    return m.style.display === 'block';
  }

  open() {
    if (!this.isOpen()) {
      const game = this.game;
      const { host } = game;
      const m = host.querySelector<HTMLElement>('#menuscreen');
      const im = host.querySelector<HTMLElement>('#inactive');

      game.running = game.running && game.multiplayer;
      m.style.display = 'block';
      im.style.display = 'block';
      this.select('menu-main');
      m.focus();

      host.querySelector<HTMLAudioElement>('#music').volume = game.running ? 0.3 : 1;
    }
  }

  close() {
    if (this.isOpen()) {
      const game = this.game;
      const { host } = game;
      const m = host.querySelector<HTMLElement>('#menuscreen');
      const im = host.querySelector<HTMLElement>('#inactive');

      game.running = true;
      m.style.display = 'none';
      im.style.display = 'none';
      game.c.canvas.focus();

      host.querySelector<HTMLAudioElement>('#music').volume = 0.3;
    }
  }

  select(id: string) {
    const { host } = this.game;
    const m = host.querySelector<HTMLElement>('#menuscreen');
    const items = [].slice.call(m.getElementsByTagName('ul'));

    for (const item of items) {
      item.style.display = item.id === id ? 'block' : 'none';
    }
  }

  disableMultiplayer() {
    const { host } = this.game;
    const mpjoin = host.querySelector<HTMLElement>('#menu-mpjoin');
    const mphost = host.querySelector<HTMLElement>('#menu-mphost');
    mpjoin.className = 'menuitem disabled';
    mphost.className = 'menuitem disabled';
    mpjoin.onclick = null;
    mphost.onclick = null;
  }

  enableMultiplayer() {
    const { host } = this.game;
    const mpjoin = host.querySelector<HTMLElement>('#menu-mpjoin');
    const mphost = host.querySelector<HTMLElement>('#menu-mphost');
    mpjoin.className = 'menuitem';
    mphost.className = 'menuitem';
    mpjoin.onclick = () => {
      this.select('menu-join');
      this.game.network.requestList();
    };
    mphost.onclick = () => this.select('menu-host');
  }

  switch(on: string, off: string) {
    const { host } = this.game;

    host.querySelector<HTMLElement>(`#${on}`).onclick = () => {
      host.querySelector<HTMLElement>(`#${on}`).className = 'menuitem picked';
      host.querySelector<HTMLElement>(`#${off}`).className = 'menuitem';
    };

    host.querySelector<HTMLElement>(`#${off}`).onclick = () => {
      host.querySelector<HTMLElement>(`#${off}`).className = 'menuitem picked';
      host.querySelector<HTMLElement>(`#${on}`).className = 'menuitem';
    };
  }

  init() {
    const { host } = this.game;

    host.querySelector<HTMLElement>('#menu-sp').onclick = () => {
      this.game.startSingle();
      this.toggle();
    };

    host.querySelector<HTMLElement>('#menu-setname').onclick = () => {
      this.select('menu-user');
    };

    host.querySelector<HTMLElement>('#menu-setscr').onclick = () => {
      host.querySelector<HTMLInputElement>('#menu-server-ip').value = this.game.settings.server;
      this.select('menu-scr');
    };

    host.querySelector<HTMLElement>('#menu-leave').onclick = () => {
      this.game.reset();
      gameMenuHelper(this.game, false);
    };

    host.querySelector<HTMLElement>('#menu-hostadvanced').onclick = () => {
      this.select('menu-host-adv');
    };

    host.querySelector<HTMLElement>('#menu-hostadvprevious').onclick = () => {
      this.select('menu-host');
    };

    host.querySelector<HTMLElement>('#menu-lookkeys').onclick = () => {
      this.select('menu-keys');
    };

    host.querySelector<HTMLElement>('#menu-scores').onclick = () => {
      const el = host.querySelector<HTMLElement>('#menu-current-scores-list');
      const entries = this.game.score.getRanking();
      el.innerHTML = `<p>${entries.join('</p><p>')}</p>`;
      this.select('menu-currentscores');
    };

    host.querySelector<HTMLElement>('#menu-highscores').onclick = () => {
      const el = host.querySelector<HTMLElement>('#menu-scores-list');
      const entries = this.game.score.getHighscores();
      el.innerHTML = `<p>${entries.join('</p><p>')}</p>`;
      this.select('menu-scores');
    };

    host.querySelector<HTMLElement>('#menu-esc').onclick = () => {
      this.toggle();
    };

    host.querySelector<HTMLElement>('#menu-usersave').onclick = () => {
      const game = this.game;
      const { settings, network } = game;
      settings.playerName = host.querySelector<HTMLInputElement>('#menu-player-name').value;
      const primaryColor = hexToRgb(host.querySelector<HTMLInputElement>('#menu-primary-color').value);
      const secondaryColor = hexToRgb(host.querySelector<HTMLInputElement>('#menu-secondary-color').value);
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

    host.querySelector<HTMLElement>('#menu-hostmatch').onclick = () => {
      const g = this.game;
      g.network.host({
        name: host.querySelector<HTMLInputElement>('#menu-game-name').value,
        password: host.querySelector<HTMLInputElement>('#menu-game-password').value,
        friendly: host.querySelector<HTMLElement>('#menu-friendly-on').className === 'menuitem picked',
        maxplayers: parseInt(host.querySelector<HTMLInputElement>('#menu-game-maxplayers').value),
        maxbots: parseInt(host.querySelector<HTMLInputElement>('#menu-game-maxbots').value),
        negative: host.querySelector<HTMLElement>('#menu-negative-on').className === 'menuitem picked',
        upgrades: host.querySelector<HTMLElement>('#menu-upgrades-on').className === 'menuitem picked',
        width: g.c.canvas.width,
        height: g.c.canvas.height,
      });
      this.toggle();
    };

    host.querySelector<HTMLElement>('#menu-scrsave').onclick = () => {
      const { settings, network } = this.game;
      settings.playSounds =
        host.querySelector<HTMLElement>('#menu-wosounds').className === 'menuitem picked' ? false : true;
      const srv = host.querySelector<HTMLInputElement>('#menu-server-ip').value;

      if (srv !== settings.server) {
        settings.server = srv;
        network.connect();
      }

      settings.save();
      this.select('menu-main');
    };

    host.querySelector<HTMLElement>('#menu-hostprevious').onclick = host.querySelector<HTMLElement>(
      '#menu-joinprevious',
    ).onclick = host.querySelector<HTMLElement>('#menu-userprevious').onclick = host.querySelector<HTMLElement>(
      '#menu-keysprevious',
    ).onclick = host.querySelector<HTMLElement>('#menu-scrprevious').onclick = host.querySelector<HTMLElement>(
      '#menu-currentscoresprevious',
    ).onclick = host.querySelector<HTMLElement>('#menu-scoresprevious').onclick = () => {
      this.select('menu-main');
    };
    host.querySelector<HTMLElement>(this.game.settings.playSounds ? '#menu-withsounds' : '#menu-wosounds').className =
      'menuitem picked';
    host.querySelector<HTMLInputElement>('#menu-player-name').value = this.game.settings.playerName;
    host.querySelector<HTMLInputElement>('#menu-primary-color').value = rgbToHex(this.game.settings.playerColors[0]);
    host.querySelector<HTMLInputElement>('#menu-secondary-color').value = rgbToHex(this.game.settings.playerColors[1]);
  }
}
