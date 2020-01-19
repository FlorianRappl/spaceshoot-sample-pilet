import { MAX_BOMBS, MAX_LIFE, MAX_SPEED, MAX_SHIELDS } from '../constants';
import { sprites } from '../managers';
import { IGauges, IGame } from '../types';

export class Gauges implements IGauges {
  private speed: Gauge;
  private health: Gauge;
  private bombs: Gauge;
  private shield: Gauge;
  private network: Gauge;
  private users: Gauge;

  constructor(private game: IGame) {
    const offset = game.c.canvas.width / 8;
    this.speed = new Gauge(game, offset, 670, MAX_SPEED, sprites.get('speedlogo'));
    this.health = new Gauge(game, offset + 110, 670, MAX_LIFE, sprites.get('healthlogo'), true);
    this.bombs = new Gauge(game, offset + 240, 670, MAX_BOMBS, sprites.get('bomblogo'));
    this.shield = new Gauge(game, offset + 350, 670, MAX_SHIELDS, sprites.get('shieldlogo'));
    this.network = new Gauge(game, offset, 100, 100, sprites.get('networklogo'), undefined, false);
    this.users = new Gauge(game, offset + 110, 100, 40, sprites.get('userslogo'), undefined, false);
  }

  update() {
    const ship = this.game.myship;

    this.speed.value = ship.boost;
    this.bombs.value = ship.bombs;
    this.shield.value = ship.shield;
    this.health.value = ship.life;

    if (this.game.multiplayer) {
      this.network.value = this.game.network.measureTime();
      this.users.value = this.game.ships.length;
    }
  }

  draw() {
    this.speed.draw();
    this.bombs.draw();
    this.shield.draw();
    this.health.draw();

    if (this.game.multiplayer) {
      this.network.draw();
      this.users.draw();
    }
  }
}

export class Gauge {
  value = 0;

  private min = 0;

  constructor(
    private game: IGame,
    private x: number,
    private y: number,
    private max: number,
    private image: HTMLImageElement,
    private inverse = false,
    private showMax = true,
  ) {}

  draw() {
    const { c } = this.game;

    if (this.value < this.min) {
      this.value = this.min;
    }

    const norm = Math.floor(this.value * 10) / 10;
    c.save();
    c.globalAlpha = 0.75;
    c.translate(this.x, this.y);
    c.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, -12, 24, 24);
    c.translate(30, 0);
    c.textAlign = 'left';
    c.font = '16px Orbitron';
    c.fillStyle = 'rgba(255, 255, 255, 0.8)';
    c.fillRect(0, -16, 2, 32);
    let value = 0;

    if (this.inverse) {
      if (this.value === this.min) {
        value = 60;
      } else if (this.value <= (this.max - this.min) * 0.2 + this.min) {
        value = 120;
      } else if (this.value <= (this.max - this.min) * 0.4 + this.min) {
        value = 180;
      }
    } else {
      if (this.value === this.max * 1.0) {
        value = 60;
      } else if (this.value >= this.max * 0.8) {
        value = 120;
      } else if (this.value >= this.max * 0.6) {
        value = 180;
      }
    }

    if (value > 0) {
      c.fillStyle = `rgba(255, ${value}, 0, 0.8)`;
    }

    c.fillText(norm + (this.showMax ? ` / ${this.max}` : ''), 10, 6);
    c.restore();
  }
}
