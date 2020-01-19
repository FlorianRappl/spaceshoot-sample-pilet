import { chatMessageDisappearMs } from '../constants';
import { IChat, IGame } from '../types';

export class Chat implements IChat {
  private log: Array<string> = [];
  private display: Array<number> = [];

  shown = false;

  constructor(private game: IGame) {}

  toggle() {
    const { host } = this.game;
    const el = host.querySelector<HTMLInputElement>('#chat-input');
    this.shown = !this.shown;

    if (this.shown) {
      el.style.display = 'block';
      el.focus();
    } else {
      host.focus();
      el.style.display = 'none';
      this.game.c.canvas.focus();
    }
  }

  init() {
    const { host } = this.game;
    const input = host.querySelector<HTMLInputElement>('#chat-input');
    input.onkeypress = e => {
      switch (e.keyCode) {
        case 27: //ESC
          input.value = '';
        case 13: //ENTER
          this.post();
          this.toggle();
          break;
      }
    };
  }

  clear() {
    const { host } = this.game;
    host.querySelector('#chat-output').innerHTML = '';
    host.querySelector<HTMLInputElement>('#chat-input').value = '';
    this.log = [];
    this.display = [];
  }

  post() {
    const { host } = this.game;
    const input = host.querySelector<HTMLInputElement>('#chat-input');

    if (input.value) {
      this.game.network.send({
        cmd: 'chat',
        msg: input.value,
      });
      input.value = '';
    }
  }

  append(obj: any) {
    const { host } = this.game;
    this.log.push(obj);
    this.display.push(chatMessageDisappearMs);
    const div = document.createElement('div');
    div.innerHTML = `<span style="color:rgb(${obj.color})">${obj.from}:</span> ${obj.msg}`;
    host.querySelector('#chat-output').appendChild(div);
  }

  logic() {
    const { host } = this.game;

    for (let i = this.display.length; i--; ) {
      if (!this.display[i]--) {
        const el = host.querySelector('#chat-output');
        el.removeChild(el.children[i]);
        this.display.splice(i, 1);
      }
    }
  }
}
