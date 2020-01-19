import { CHAT_WAIT_TIME } from '../constants';
import { IChat, IGame } from '../types';

export class Chat implements IChat {
  private log: Array<string> = [];
  private display: Array<number> = [];

  shown = false;

  constructor(private game: IGame) {}

  toggle() {
    const el = document.querySelector<HTMLInputElement>('#chat-input');
    this.shown = !this.shown;

    if (this.shown) {
      el.style.display = 'block';
      el.focus();
    } else {
      document.body.focus();
      el.style.display = 'none';
      this.game.c.canvas.focus();
    }
  }

  init() {
    const input = document.querySelector<HTMLInputElement>('#chat-input');
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
    document.querySelector('#chat-output').innerHTML = '';
    document.querySelector<HTMLInputElement>('#chat-input').value = '';
    this.log = [];
    this.display = [];
  }

  post() {
    const input = document.querySelector<HTMLInputElement>('#chat-input');

    if (input.value) {
      this.game.network.send({
        cmd: 'chat',
        msg: input.value,
      });
      input.value = '';
    }
  }

  append(obj) {
    this.log.push(obj);
    this.display.push(CHAT_WAIT_TIME);
    const div = document.createElement('div');
    div.innerHTML = `<span style="color:rgb(${obj.color})">${obj.from}:</span> ${obj.msg}`;
    document.querySelector('#chat-output').appendChild(div);
  }

  logic() {
    for (let i = this.display.length; i--; ) {
      if (!this.display[i]--) {
        const el = document.querySelector('#chat-output');
        el.removeChild(el.children[i]);
        this.display.splice(i, 1);
      }
    }
  }
}
