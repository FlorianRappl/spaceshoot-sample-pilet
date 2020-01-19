import { Explosion } from './Explosion';
import { collisionC2C } from '../helpers';
import { InfoText } from '../widgets';
import { sounds } from '../managers';
import { MAX_PARTICLE_TIME, DAMAGE_FACTOR } from '../constants';
import { IGame, IShip, IParticle } from '../types';

export class Particle implements IParticle {
  lifetime = MAX_PARTICLE_TIME;
  size = 6;

  constructor(
    private game: IGame,
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
    public owner: IShip,
  ) {
    if (owner === game.myship) {
      sounds.play('laser');
    }
  }

  static from(game: IGame, particle: Particle) {
    return new Particle(game, particle.x, particle.y, particle.vx, particle.vy, particle.owner);
  }

  update(arg: Particle & { owner: string }) {
    this.x = arg.x;
    this.y = arg.y;
    this.owner = this.game.getShip(arg.owner);
    this.lifetime = arg.lifetime;
    this.size = arg.size;
  }

  draw() {
    const { c } = this.game;
    c.save();
    c.fillStyle = `rgba(${this.owner.primaryColor}, ${this.lifetime / MAX_PARTICLE_TIME})`;
    c.translate(this.x, this.y);
    c.beginPath();
    c.arc(0, 0, this.size / 2, 0, 2 * Math.PI, false);
    c.fill();
    c.restore();
  }

  logic() {
    const game = this.game;
    const { asteroids, infoTexts, explosions, drones, bombs, ships } = game;
    this.x += this.vx;
    this.y += this.vy;
    const damage = (DAMAGE_FACTOR * this.lifetime) / MAX_PARTICLE_TIME;

    for (let i = asteroids.length; i--; ) {
      const a = asteroids[i];

      if (collisionC2C(this.x, this.y, this.size, a.x, a.y, a.size)) {
        this.owner.hitAsteroids += 1;
        this.owner.points += damage;
        a.life -= damage;

        if (a.life <= 0) {
          this.owner.points += 10;
          infoTexts.push(new InfoText(game, a.x, a.y, 50, 'Yeah!', this.owner.primaryColor));
          explosions.push(Explosion.from(game, a));
          this.owner.shotAsteroids += 1;
        } else {
          infoTexts.push(new InfoText(game, a.x, a.y, 50, `(${damage}DMG)`, this.owner.primaryColor));
        }

        return false;
      }
    }

    for (let i = drones.length; i--; ) {
      const d = drones[i];

      if (this.owner !== d && collisionC2C(this.x, this.y, this.size, d.x, d.y, d.size)) {
        this.owner.hitDrones += 1;
        this.owner.points += damage;
        d.life -= damage;

        if (d.life <= 0) {
          this.owner.points += 15;
          infoTexts.push(new InfoText(game, d.x, d.y, 50, 'Cool!', this.owner.primaryColor));
          explosions.push(Explosion.from(game, d));
          this.owner.shotDrones += 1;
        } else {
          infoTexts.push(new InfoText(game, d.x, d.y, 50, `(${damage}DMG)`, this.owner.primaryColor));
        }

        return false;
      }
    }

    for (let i = bombs.length; i--; ) {
      const b = bombs[i];

      if (b.wait === 0) {
        continue;
      }

      if (collisionC2C(this.x, this.y, this.size, b.x, b.y, b.size)) {
        b.life -= damage;
        this.owner.points += 5;

        if (b.life <= 0) {
          infoTexts.push(new InfoText(game, b.x, b.y, 50, 'Woooh!', this.owner.primaryColor));
          explosions.push(Explosion.from(game, b));
        } else {
          infoTexts.push(new InfoText(game, b.x, b.y, 50, `(${damage}DMG)`, this.owner.primaryColor));
        }

        return false;
      }
    }

    for (let i = ships.length; i--; ) {
      const s = ships[i];

      if (this.owner !== s && collisionC2C(this.x, this.y, this.size, s.x, s.y, s.size)) {
        infoTexts.push(new InfoText(game, this.x, this.y, 50, `(${damage}DMG)`, s.primaryColor));
        this.owner.hitShips += 1;
        s.hitByDrone += 1;
        this.owner.points += damage;
        s.hit(damage);
        return false;
      }
    }

    return !!this.lifetime--;
  }
}
