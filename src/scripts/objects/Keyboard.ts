import { IGame } from '../types';

export class Keyboard {
  bomb = false;
  shoot = false;
  left = false;
  right = false;
  up = false;
  down = false;

  constructor(private game: IGame) {}

  press = (e: KeyboardEvent) => {
    if (this.manageKeyboard(e.keyCode, true)) {
      e.preventDefault();
    }
  };

  release = (e: KeyboardEvent) => {
    if (this.manageKeyboard(e.keyCode, false)) {
      e.preventDefault();
    }
  };

  private manageKeyboard(key: number, status: boolean) {
    const game = this.game;

    if (game.chat.shown) {
      return false;
    }

    switch (key) {
      case 9: //TAB
        if (status) {
          game.score.show();
        }
        break;
      case 27: //ESC
        if (status) {
          game.menu.toggle();
        }
        break;
      case 17: //CTRL / CMD on MAC
      case 57392: //CTRL on MAC
        this.bomb = status;
        break;
      case 37: //LEFT
        this.left = status;
        break;
      case 38: //UP
        this.up = status;
        break;
      case 39: //RIGHT
        this.right = status;
        break;
      case 40: //DOWN
        this.down = status;
        break;
      case 32: //SPACE
        this.shoot = status;
        break;
      case 13: //Enter
        if (status) {
          if (game.isDead) {
            game.startSingle();
          } else if (game.intro) {
            game.intro = false;
          } else if (game.multiplayer) {
            game.chat.toggle();
          }
        }
        break;
      default:
        //otherwise
        //console.log(key);
        return false; //Not a meaningful key - just return!
    }

    if (game.multiplayer) {
      this.send();
    }

    return true;
  }

  send() {
    this.game.network.send({
      keyboard: this,
      cmd: 'keys',
    });
  }
}
