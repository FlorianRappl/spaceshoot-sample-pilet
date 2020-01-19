import { Particle } from './Particle';
import { d2g, pbc } from '../helpers';
import {
  primaryColors,
  secondaryColors,
  maxDroneLife,
  rotatePerCycle,
  maxBombRadius,
  droneCooldown,
} from '../constants';
import { IGame, IDrone } from '../types';

export class Drone implements IDrone {
  size = 10;
  cooldown = 0;
  explosion = 3;
  primaryColor = primaryColors[1];
  secondaryColor = secondaryColors[1];

  constructor(
    private game: IGame,
    public x: number,
    public y: number,
    public speed: number,
    public life: number,
    public damage: number,
    public angle: number,
  ) {}

  static generate(game: IGame) {
    const { width, height } = game;
    let alpha = 0;
    let x = 0;
    let y = 0;

    if (Math.random() < 0.5) {
      x = Math.random() * width;
      y = Math.random() < 0.5 ? -3 : height + 3;
      alpha = y > 0 ? 0 : 180;
    } else {
      x = Math.random() < 0.5 ? -3 : width + 3;
      y = Math.random() * height;
      alpha = x > 0 ? 270 : 90;
    }

    return new Drone(game, x, y, 3, maxDroneLife, 6, alpha);
  }

  draw() {
    const { c } = this.game;
    const s2 = this.size / 2;
    c.save();
    c.translate(this.x, this.y);
    const gradient = c.createLinearGradient(0, -s2, 0, s2);
    gradient.addColorStop(0, 'rgb(255, 30, 0)');
    gradient.addColorStop(this.life / maxDroneLife, 'rgb(255, 140, 0)');
    gradient.addColorStop(this.life / maxDroneLife, 'rgba(255, 140, 0, 0)');
    c.strokeStyle = 'rgba(255, 255, 255, 1)';
    c.fillStyle = gradient;
    c.rotate(d2g(this.angle));
    c.beginPath();
    c.moveTo(0, -s2);
    c.lineTo(s2, s2);
    c.lineTo(-s2, s2);
    c.closePath();
    c.stroke();
    c.fill();
    c.restore();
  }

  logic() {
    const game = this.game;
    const { asteroids, particles, ships } = game;
    const tol = d2g(rotatePerCycle);
    const tol2 = 2 * tol;
    const bomb2 = maxBombRadius / 2;
    const ta = d2g(this.angle);

    for (let i = asteroids.length; i--; ) {
      const a = asteroids[i];
      const t1 = a.x - this.x;
      const t2 = a.y - this.y;
      const d = Math.sqrt(t1 * t1 + t2 * t2);
      const beta = Math.acos((Math.sin(ta) * t1 + Math.cos(ta) * t2) / d);

      if (this.cooldown === 0 && beta < tol2 && d < bomb2) {
        this.cooldown = droneCooldown;
        particles.push(
          new Particle(
            game,
            this.x,
            this.y,
            (3 + this.speed) * Math.sin(ta),
            -(3 + this.speed) * Math.cos(ta),
            this as any,
          ),
        );
        break;
      }
    }

    if (ships.length === 1) {
      const f = this.x > ships[0].x ? 1 : -1;
      const t1 = this.x - ships[0].x;
      const t2 = this.y - ships[0].y;
      const d = Math.sqrt(t1 * t1 + t2 * t2);
      const beta = Math.acos((Math.sin(ta) * f * t1 + Math.cos(ta) * t2) / d);

      if (beta > tol) {
        this.angle = this.angle + f * rotatePerCycle;
      } else if (this.cooldown === 0 && d < maxBombRadius) {
        this.cooldown = droneCooldown;
        particles.push(
          new Particle(
            game,
            this.x,
            this.y,
            (3 + this.speed) * Math.sin(ta),
            -(3 + this.speed) * Math.cos(ta),
            this as any,
          ),
        );
      }
    } else {
      const coin = Math.random();

      if (coin < 0.1) {
        this.angle -= rotatePerCycle;
      } else if (coin < 0.2) {
        this.angle += rotatePerCycle;
      }
    }

    if (this.cooldown) {
      --this.cooldown;
    }

    this.y -= this.speed * Math.cos(d2g(this.angle));
    this.x += this.speed * Math.sin(d2g(this.angle));
    pbc(this, game.c);
    return true;
  }
}
