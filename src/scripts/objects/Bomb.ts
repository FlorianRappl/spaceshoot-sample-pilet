import { Explosion } from './Explosion';
import { BOMB_WAIT, BOMB_LIFE, MAX_BOMB_RADIUS, BOMB_DAMAGE_FACTOR, BOMB_RESIDUE } from '../constants';
import { InfoText } from '../widgets';
import { collisionC2C } from '../helpers';
import { sprites, sounds } from '../managers';
import { IGame, IBomb, IShip, ILifeObject } from '../types';

export class Bomb implements IBomb {
  private image = sprites.get('detonator');
  wait = BOMB_WAIT;
  radius = 0;
  life = BOMB_LIFE;
  size = 16;
  explosion = 2;
  hitlist: Array<ILifeObject>;

  constructor(private game: IGame, public x: number, public y: number, public owner: IShip) {
    this.hitlist = [this];
    sounds.play('bomb');
  }

  static from(game: IGame, bomb: Bomb) {
    return new Bomb(game, bomb.x, bomb.y, bomb.owner);
  }

  update(arg: Bomb & { owner: string }) {
    this.x = arg.x;
    this.y = arg.y;
    this.owner = this.game.getShip(arg.owner);
    this.radius = arg.radius;
    this.wait = arg.wait;
  }

  draw() {
    const { c } = this.game;
    c.save();
    c.translate(this.x, this.y);

    if (this.wait > 0) {
      const s2 = this.size / 2;
      const ms = Math.sin((20 * Math.PI * (Math.exp(1 - this.wait / BOMB_WAIT) - 1)) / Math.E);
      c.drawImage(this.image, 0, 0, this.image.width, this.image.height, -s2, -s2, this.size, this.size);
      c.fillStyle = ms > 0 ? '#FFFF00' : '#FF0000';
      c.beginPath();
      c.arc(0, -4, 2, 0, 2 * Math.PI, false);
      c.closePath();
      c.fill();
    } else {
      const gradient = c.createRadialGradient(0, 0, 0, 0, 0, this.radius);
      gradient.addColorStop(0, '#4682b4');
      gradient.addColorStop(1, 'rgba(30, 144, 255, 0.2)');
      c.fillStyle = gradient;
      c.strokeStyle = `rgb(${this.owner.secondaryColor})`;
      c.beginPath();
      c.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
      c.closePath();
      c.fill();
      c.stroke();
    }

    c.restore();
  }

  logic() {
    if (this.wait > 0) {
      this.wait--;
    } else {
      this.radius += 5;
      const game = this.game;
      const { asteroids, drones, infoTexts, explosions, bombs, ships } = game;
      const inv = MAX_BOMB_RADIUS - this.radius;
      const damage = BOMB_DAMAGE_FACTOR * ((inv * inv) / MAX_BOMB_RADIUS / MAX_BOMB_RADIUS) + BOMB_RESIDUE;

      for (let i = asteroids.length; i--; ) {
        const a = asteroids[i];
        let found = false;

        for (let j = this.hitlist.length; j--; )
          if (this.hitlist[j] === a) {
            found = true;
            break;
          }

        if (!found && collisionC2C(this.x, this.y, 2 * this.radius, a.x, a.y, a.size)) {
          this.hitlist.push(a);
          this.owner.hitAsteroids += 1;
          this.owner.points += damage;
          a.life -= damage;

          if (a.life <= 0) {
            infoTexts.push(new InfoText(game, a.x, a.y, 50, 'Nice!', this.owner.primaryColor));
            explosions.push(Explosion.from(game, a));
            this.owner.points += 5;
            this.owner.shotAsteroids += 1;
          } else {
            infoTexts.push(new InfoText(game, a.x, a.y, 50, `(${damage}DMG)`, this.owner.primaryColor));
          }
        }
      }

      for (let i = drones.length; i--; ) {
        const d = drones[i];
        let found = false;

        for (let j = this.hitlist.length; j--; )
          if (this.hitlist[j] === d) {
            found = true;
            break;
          }

        if (!found && collisionC2C(this.x, this.y, 2 * this.radius, d.x, d.y, d.size)) {
          this.hitlist.push(d);
          this.owner.hitDrones += 1;
          this.owner.points += damage;
          d.life -= damage;

          if (d.life <= 0) {
            infoTexts.push(new InfoText(game, d.x, d.y, 50, 'Yes!', this.owner.primaryColor));
            explosions.push(Explosion.from(game, d));
            this.owner.points += 15;
            this.owner.shotDrones += 1;
          } else {
            infoTexts.push(new InfoText(game, d.x, d.y, 50, `(${damage}DMG)`, this.owner.primaryColor));
          }
        }
      }

      for (let i = bombs.length; i--; ) {
        const b = bombs[i];
        let found = false;

        if (b.wait === 0) {
          continue;
        }

        for (let j = this.hitlist.length; j--; )
          if (j === 0 || this.hitlist[j] === b) {
            found = true;
            break;
          }

        if (!found && collisionC2C(this.x, this.y, 2 * this.radius, b.x, b.y, b.size)) {
          this.hitlist.push(b);
          b.life -= damage;

          if (b.life <= 0) {
            infoTexts.push(new InfoText(game, b.x, b.y, 50, 'Yeah!', this.owner.primaryColor));
            explosions.push(Explosion.from(game, b));
          } else {
            infoTexts.push(new InfoText(game, b.x, b.y, 50, `(${damage}DMG)`, this.owner.primaryColor));
          }
        }
      }

      for (let i = ships.length; i--; ) {
        const s = ships[i];
        let found = false;

        for (let j = this.hitlist.length; j--; )
          if (this.hitlist[j] === s) {
            found = true;
            break;
          }

        if (!found && collisionC2C(this.x, this.y, 2 * this.radius, s.x, s.y, s.size)) {
          this.hitlist.push(s);
          infoTexts.push(new InfoText(game, s.x, s.y, 50, `(${damage}DMG)`, s.primaryColor));

          if (this.owner !== s) {
            this.owner.hitShips += 1;
            this.owner.points += damage;
          }

          s.hit(damage);
        }
      }

      return this.radius < MAX_BOMB_RADIUS;
    }

    return true;
  }
}
