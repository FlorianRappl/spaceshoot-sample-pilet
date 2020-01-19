import { IDialog } from '../types';

export class Dialog implements IDialog {
  private callback: () => void;

  init() {
    document.getElementById('dialog-ok').onclick = () => {
      if (this.callback) {
        this.callback();
      }

      document.getElementById('dialog').style.display = 'none';
      document.getElementById('inactive').style.display = 'none';
      document.getElementById('dialog-message').innerHTML = '';
    };
  }

  open(title: string, text: string, cb?: () => void) {
    document.getElementById('dialog').style.display = 'block';
    document.getElementById('inactive').style.display = 'block';
    document.getElementById('dialog-message').innerHTML = `<strong>${title}</strong><p>${text}</p>`;
    this.callback = cb;
  }
}
