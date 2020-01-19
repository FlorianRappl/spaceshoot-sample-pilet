import { PACK_TIME, MAX_SHIELDS, SHIELD_DECAY_TIME, MAX_BOMBS, MAX_AMMO, MAX_LIFE } from '../constants';
import { InfoText } from '../widgets';
import { sprites } from '../managers';
import { collisionC2Q, d2g } from '../helpers';
import { IGame, IPack, IShip } from '../types';

export class Pack implements IPack {
  public size = 16;
  private angle = 0;
  private time = PACK_TIME;

  constructor(
    private game: IGame,
    public x: number,
    public y: number,
    private image: HTMLImageElement,
    private callback: (ship: IShip) => string,
  ) {}

  static from(game: IGame, pack: Pack) {
    return new Pack(game, pack.x, pack.y, pack.image, pack.callback);
  }

  static generateShield(game: IGame) {
    const x = Math.random() * game.width;
    const y = Math.random() * game.height;

    return new Pack(game, x, y, sprites.get('shield'), ship => {
      ship.points += 15;
      ship.shield = MAX_SHIELDS;
      ship.decay = SHIELD_DECAY_TIME;
      return '+DEF';
    });
  }

  static generateHealth(game: IGame) {
    const x = Math.random() * game.width;
    const y = Math.random() * game.height;

    return new Pack(game, x, y, sprites.get('health'), ship => {
      ship.points += 20;
      const init = ship.life;
      ship.life += 30;

      if (ship.life > MAX_LIFE) {
        ship.life = MAX_LIFE;
        return '+' + (ship.life - init) + 'HP';
      }

      return '+30HP';
    });
  }

  static generateAmmo(game: IGame) {
    const x = Math.random() * game.width;
    const y = Math.random() * game.height;

    return new Pack(game, x, y, sprites.get('ammo'), ship => {
      ship.points += 15;
      const init = ship.ammo;
      ship.ammo += 20;

      if (ship.ammo > MAX_AMMO) {
        ship.ammo = MAX_AMMO;
        return '+' + (ship.ammo - init) + 'AM';
      }

      return '+20AM';
    });
  }

  static generateBomb(game: IGame) {
    const x = Math.random() * game.width;
    const y = Math.random() * game.height;

    return new Pack(game, x, y, sprites.get('bomb'), ship => {
      ship.points += 25;
      const init = ship.bombs;
      ship.bombs += 2;

      if (ship.bombs > MAX_BOMBS) {
        ship.bombs = MAX_BOMBS;
        return '+' + (ship.bombs - init) + 'BO';
      }

      return '+2BO';
    });
  }

  update(arg: Pack & { type: any }) {
    this.x = arg.x;
    this.y = arg.y;
    this.angle = arg.angle;
    this.time = arg.time;
    this.image = sprites.get(arg.type);
  }

  draw() {
    const { c, settings } = this.game;
    const s2 = this.size / 2;
    c.save();
    c.translate(this.x, this.y);
    c.fillStyle = `rgba(${settings.playerColors[1]}, 0.8)`;
    c.fillRect(-s2, s2 + 3, (this.size * this.time) / PACK_TIME, 2);
    c.rotate(d2g(this.angle));
    c.drawImage(this.image, 0, 0, this.image.width, this.image.height, -s2, -s2, this.size, this.size);
    c.restore();
  }

  logic() {
    const { ships, infoTexts } = this.game;
    this.angle += 7;

    for (let i = ships.length; i--; ) {
      const s = ships[i];

      if (collisionC2Q(s.x, s.y, s.size, this.x, this.y, this.size, this.size)) {
        const text = this.callback(s);
        infoTexts.push(new InfoText(this.game, this.x, this.y, 50, text, s.secondaryColor));
        return false;
      }
    }

    return !!this.time--;
  }
}
