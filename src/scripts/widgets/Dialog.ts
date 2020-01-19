import { IDialog, IGame } from '../types';

export class Dialog implements IDialog {
  private callback: () => void;

  constructor(private game: IGame) {}

  init() {
    const { host } = this.game;
    host.querySelector<HTMLElement>('#dialog-ok').onclick = () => {
      if (this.callback) {
        this.callback();
      }

      host.querySelector<HTMLElement>('#dialog').style.display = 'none';
      host.querySelector<HTMLElement>('#inactive').style.display = 'none';
      host.querySelector<HTMLElement>('#dialog-message').innerHTML = '';
    };
  }

  open(title: string, text: string, cb?: () => void) {
    const { host } = this.game;
    host.querySelector<HTMLElement>('#dialog').style.display = 'block';
    host.querySelector<HTMLElement>('#inactive').style.display = 'block';
    host.querySelector<HTMLElement>('#dialog-message').innerHTML = `<strong>${title}</strong><p>${text}</p>`;
    this.callback = cb;
  }
}
