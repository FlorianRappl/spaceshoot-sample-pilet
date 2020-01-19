import { InfoText } from '../widgets';
import { gameMenuHelper } from '../helpers';
import { LOGIC_TIME, secondaryColors } from '../constants';
import { IGame, INetworkMatch, GameHostData } from '../types';

export class Sockets {
  private time = 0;
  private socket: WebSocket;
  private connected = false;

  constructor(private game: IGame) {}

  setup() {
    const game = this.game;

    if (this.connect()) {
      const { width, height } = game;
      game.infoTexts.push(
        new InfoText(
          game,
          width / 2,
          height / 2,
          100,
          `Connecting to ${this.game.settings.server}...`,
          secondaryColors[0],
        ),
      );
      game.draw();
      setTimeout(() => {
        game.menu.toggle();
        game.infoTexts.splice(0, 1);
        game.infoTexts.push(
          new InfoText(game, width / 2, height / 2 - 20, 100, 'Game loaded successfully.', secondaryColors[0]),
        );
        game.infoTexts.push(
          new InfoText(game, width / 2, height / 2 + 20, 100, 'Press ESC for the main menu.', secondaryColors[0]),
        );
        game.draw();
      }, 400);
    } else {
      game.startSingle();
    }
  }

  connect() {
    if (this.game.settings.server && typeof WebSocket !== 'undefined') {
      if (this.socket) {
        this.socket.close();
      }

      document.getElementById('wsconnect').hidden = false;
      this.time = new Date().getTime();
      this.socket = new WebSocket(`ws://${this.game.settings.server}`);
      this.socket.onopen = () => this.open();
      this.socket.onclose = () => this.close();
      this.socket.onerror = e => this.error(e.toString());
      this.socket.onmessage = e => this.receive(e);
      this.connected = false;
      return true;
    }

    document.getElementById('wsconnect').hidden = true;
    return false;
  }

  open() {
    this.connected = true;
    document.getElementById('wsconnect').hidden = true;
    this.game.menu.enableMultiplayer();
  }

  close() {
    if (this.game.multiplayer) {
      this.game.multiplayer = false;
      this.error('The connection has been closed.');
      this.game.running = false;
      gameMenuHelper(false);
    }

    if (this.connected) {
      this.game.menu.disableMultiplayer();
      this.game.menu.select('menu-main');
    }

    this.connect();
  }

  //Requesting the list of open games
  requestList() {
    const el = document.getElementById('menu-join-list');
    el.innerHTML = '';
    el.className = 'menu-list progressindicator';
    this.send({
      cmd: 'list',
    });
  }

  setList(list: Array<INetworkMatch>) {
    if (document.getElementById('menu-join').style.display !== 'block') {
      return;
    }

    const el = document.getElementById('menu-join-list');

    for (let i = 0, n = list.length; i < n; i++) {
      const t = document.createElement('p');
      t.className = 'pointer';
      t.innerHTML = `<span class="player" title="${list[i].created}">${list[i].name}</span> ${list[i].players} / ${
        list[i].maxplayers
      }<span class="points">${list[i].password ? '*' : ''}</span>`;
      t.setAttribute('data-pwd', list[i].password);
      t.setAttribute('data-id', list[i].id);
      t.onclick = () => {
        const id = parseInt(t.getAttribute('data-id'));
        const reqpwd = t.getAttribute('data-pwd') === 'true';
        const join = () => {
          let pwd = '';
          const input = document.querySelector<HTMLInputElement>('#gamepwd');

          if (input) {
            pwd = input.value;
          }

          this.join(id, pwd);
          this.game.menu.toggle();
        };

        if (reqpwd) {
          this.game.dialog.open('Password required', '<input type="password" id="gamepwd" value="" />', join);
        } else {
          join();
        }
      };
      el.appendChild(t);
    }
    el.className = 'menu-list';
    setTimeout(this.requestList, 1000);
  }

  join(gameId: number, gamePwd: string) {
    this.send({
      cmd: 'join',
      id: gameId,
      password: gamePwd,
      player: this.game.settings.playerName,
      primaryColor: this.game.settings.playerColors[0],
      secondaryColor: this.game.settings.playerColors[1],
    });
  }

  host(obj: GameHostData) {
    this.send({
      ...obj,
      cmd: 'host',
      player: this.game.settings.playerName,
      primaryColor: this.game.settings.playerColors[0],
      secondaryColor: this.game.settings.playerColors[1],
    });
  }

  leave() {
    this.send({ cmd: 'leave' });
  }

  measureTime() {
    const oldtime = this.time;
    this.time = new Date().getTime();
    return this.time - oldtime - LOGIC_TIME;
  }

  error(e: string) {
    this.game.dialog.open('Error', `The following error occured: ${e}`, () => this.game.menu.open());
  }

  send<T extends { cmd: string }>(obj: T) {
    if (this.connected) {
      this.socket.send(JSON.stringify(obj));
    }
  }

  receive(e: MessageEvent) {
    const obj = JSON.parse(e.data);

    switch (obj.cmd) {
      case 'next':
        this.game.continueMulti(obj);
        break;
      case 'chat':
        this.game.chat.append(obj);
        break;
      case 'info':
        this.game.infoTexts.push(InfoText.from(this.game, obj.info));
        break;
      case 'list':
        this.setList(obj.list);
        break;
      case 'current':
        this.game.startMulti(obj);
        break;
      case 'error':
        this.error(obj.error);
        break;
      case 'console':
        console.log(obj.msg);
        break;
    }
  }

  update() {
    this.send({
      cmd: 'update',
      player: this.game.settings.playerName,
      primaryColor: this.game.settings.playerColors[0],
      secondaryColor: this.game.settings.playerColors[1],
    });
  }
}
