import { Explosion } from './Explosion';
import { collisionC2C, pbc, d2g } from '../helpers';
import { InfoText } from '../widgets';
import { sprites } from '../managers';
import { IGame, IAsteroid } from '../types';

export class Asteroid implements IAsteroid {
  explosion = 1;
  image = sprites.get('asteroid');

  constructor(
    private game: IGame,
    public size: number,
    public life: number,
    public angle: number,
    public rotation: number,
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
  ) {}

  static from(game: IGame, asteroid: Asteroid) {
    return new Asteroid(
      game,
      asteroid.size,
      asteroid.life,
      asteroid.angle,
      asteroid.rotation,
      asteroid.x,
      asteroid.y,
      asteroid.vx,
      asteroid.vy,
    );
  }

  static generate(game: IGame) {
    const { width, height } = game;
    const size = Math.random() * 50 + 25;
    const life = 10;
    const angle = 0;
    const rotation = Math.random() * 6 - 3;
    let x = 0;
    let y = 0;

    if (Math.random() < 0.5) {
      x = Math.random() * width;
      y = Math.random() < 0.5 ? -size / 2 : height + size / 2;
    } else {
      x = Math.random() < 0.5 ? -size / 2 : width + size / 2;
      y = Math.random() * height;
    }

    const vx = Math.random() * 6 - 3;
    const vy = Math.random() * 6 - 3;

    return new Asteroid(game, size, life, angle, rotation, x, y, vx, vy);
  }

  logic() {
    const game = this.game;
    const { ships, drones, infoTexts, explosions, c } = game;
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.rotation;
    const damage = ~~this.size;

    for (const s of ships) {
      if (collisionC2C(this.x, this.y, this.size, s.x, s.y, s.size)) {
        s.points -= 50;
        infoTexts.push(new InfoText(game, this.x, this.y, 50, '-' + damage, s.secondaryColor));
        s.hitByAsteroid += 1;
        s.hit(damage);
        return false;
      }
    }

    for (const d of drones) {
      if (collisionC2C(this.x, this.y, this.size, d.x, d.y, d.size)) {
        infoTexts.push(new InfoText(game, this.x, this.y, 50, '-' + damage, d.secondaryColor));
        d.life -= damage;

        if (d.life <= 0) {
          explosions.push(Explosion.from(game, d));
          drones.splice(drones.indexOf(d), 1);
        }

        return false;
      }
    }

    pbc(this, c);
    return true;
  }

  update(arg: Asteroid) {
    this.size = arg.size;
    this.angle = arg.angle;
    this.x = arg.x;
    this.y = arg.y;
  }

  draw() {
    const { c } = this.game;
    const s2 = this.size / 2;
    c.save();
    c.translate(this.x, this.y);
    c.rotate(d2g(this.angle));
    c.drawImage(this.image, 0, 0, this.image.width, this.image.height, -s2, -s2, this.size, this.size);
    c.restore();
  }
}
