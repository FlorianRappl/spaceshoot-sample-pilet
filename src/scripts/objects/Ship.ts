import { Keyboard } from './Keyboard';
import { Bomb } from './Bomb';
import { Particle } from './Particle';
import { d2g, pbc } from '../helpers';
import { sprites } from '../managers';
import {
  MAX_LIFE,
  MAX_AMMO,
  MAX_SHIELDS,
  ROTATE,
  ACCELERATE,
  MAX_SPEED,
  INIT_COOLDOWN,
  SHIELD_DECAY_TIME,
} from '../constants';
import { IShip, IGame } from '../types';

export class Ship implements IShip {
  size = 20; //Fixed size of the ship
  explosion = 4; //Explosion to use
  life = MAX_LIFE; //Sets start life to maximum
  boost = 0; //Sets start boost to minimum
  hitByDrone = 0; //Final statistic - how often hit by drone?
  hitDrones = 0; //Final statistic - how often did kill a drone?
  shotDrones = 0; //Final statistic - how often did hit a drone?
  hitByAsteroid = 0; //Final statistic - how often hit by asteroid?
  hitAsteroids = 0; //Final statistic - how often did kill an asteroid?
  shotAsteroids = 0; //Final statistic - how often did hit an asteroid?
  hitShips = 0; //Final statistic - how ofen did hit another ship?
  shotShips = 0; //Final statistic - how ofen did kill another ship?
  points = 0; //Final statistic - how many points?
  respawn = false;
  accelerate = false;
  angle = 0; //Sets start angle to 0
  ammo = MAX_AMMO; //Sets start ammo to maximum
  bombs = 0; //Sets start bombs to 0
  shield = 0; //Sets the starting shield to 0
  decay = 0; //Time to autodecrease the shield
  cooldown = 0; //Sets start cooldown to minimum
  x = 0;
  y = 0;
  primaryColor = '';
  secondaryColor = '';
  name = '';
  uptime = 0;

  constructor(private game: IGame, private id: number, color: [string, string], private control: Keyboard) {
    this.x = game.c.canvas.width / 2; //Centeres start X
    this.y = game.c.canvas.height / 2; //Centeres start Y
    this.primaryColor = color[0]; //Sets the ship's primary color
    this.secondaryColor = color[1]; //Sets the ship's secondary color
  }

  static from(game: IGame, ship: Ship) {
    return new Ship(game, ship.id, [ship.primaryColor, ship.secondaryColor], ship.control);
  }

  update(arg: Ship) {
    this.respawn = arg.respawn;
    this.life = arg.life;
    this.ammo = arg.ammo;
    this.bombs = arg.bombs;
    this.name = arg.name;
    this.primaryColor = arg.primaryColor;
    this.secondaryColor = arg.secondaryColor;
    this.points = arg.points;
    this.shield = arg.shield;
    this.angle = arg.angle;
    this.boost = arg.boost;
    this.id = arg.id;
    this.x = arg.x;
    this.y = arg.y;
    this.accelerate = arg.accelerate;
    this.uptime = arg.uptime;
  }

  hit(dmg: number) {
    if (this.shield > 0) {
      this.shield -= dmg;
      dmg = 0;

      if (this.shield < 0) {
        dmg -= this.shield;
        this.shield = 0;
      }
    }

    this.life -= dmg;
  }

  draw() {
    const { c, myship } = this.game;

    if (this.respawn) {
      return;
    }

    const s2 = this.size / 2;
    const s22 = s2 + 2;
    c.save();
    const gradient = c.createLinearGradient(0, -s22, 0, s22);
    gradient.addColorStop(0, 'rgb(' + this.primaryColor + ')');
    gradient.addColorStop(this.life / MAX_LIFE, 'rgb(' + this.secondaryColor + ')');
    gradient.addColorStop(this.life / MAX_LIFE, 'rgba(' + this.secondaryColor + ', 0.2)');
    c.strokeStyle = this === myship ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
    c.fillStyle = gradient;
    c.translate(this.x, this.y);
    c.rotate(d2g(this.angle));

    if (this.accelerate) {
      const img = sprites.get('flame');
      c.drawImage(img, 0, 0, img.width, img.height, 0 - img.width / 2, s22, img.width, img.height);
    }

    c.beginPath();
    c.moveTo(0, -s22);
    c.lineTo(s2, s22);
    c.lineTo(-s2, s22);
    c.closePath();
    c.stroke();
    c.fill();

    if (this.shield > 0) {
      const gradient = c.createRadialGradient(0, 0, 0, 0, 0, this.size);
      gradient.addColorStop(0, '#4682b4');
      gradient.addColorStop(1, 'rgba(0, 206, 209, ' + (this.shield / (2 * MAX_SHIELDS) + 0.1) + ')');
      c.fillStyle = gradient;
      c.beginPath();
      c.arc(0, 0, this.size, 0, 2 * Math.PI, false);
      c.closePath();
      c.fill();
    }

    if (this.ammo > 0) {
      const gradient = c.createLinearGradient(-10, 0, 10, 0);
      gradient.addColorStop(0, '#4682b4');
      gradient.addColorStop(this.ammo / MAX_AMMO, '#1e90ff');
      gradient.addColorStop(this.ammo / MAX_AMMO, '#FFFFFF');
      c.fillStyle = gradient;
      c.fillRect(-10, 18, 20, 3);
    }

    if (this.game.multiplayer && this === myship) {
      c.strokeStyle = 'rgba(255, 255, 0, 0.7)';
      c.beginPath();
      c.arc(0, 0, 5 * this.size, 0, 2 * Math.PI, false);
      c.closePath();
      c.stroke();
      c.strokeStyle = 'rgba(255, 0, 255, 0.7)';
      c.lineWidth = 3;
      c.beginPath();
      c.arc(0, 0, 5 * this.size, 0, 2 * this.uptime * Math.PI, false);
      c.stroke();
      c.closePath();
    }

    c.restore();
  }

  logic() {
    const game = this.game;

    if (this.control.left) {
      this.angle -= ROTATE;
    }

    if (this.control.right) {
      this.angle += ROTATE;
    }

    const ta = d2g(this.angle);
    const oldspeed = this.boost;

    if (this.control.up) {
      this.boost += ACCELERATE;

      if (this.boost > MAX_SPEED) {
        this.boost = MAX_SPEED;
      }
    }

    if (this.control.down) {
      this.boost -= ACCELERATE;

      if (this.boost < 0) this.boost = 0;
    }

    this.accelerate = oldspeed !== this.boost;
    this.y -= this.boost * Math.cos(ta);
    this.x += this.boost * Math.sin(ta);
    pbc(this, game.c);

    if (this.cooldown > 0) {
      --this.cooldown;
    } else if (this.control.bomb && this.bombs > 0) {
      --this.bombs;
      this.cooldown = INIT_COOLDOWN;
      this.game.bombs.push(new Bomb(game, this.x, this.y, this));
    } else if (this.control.shoot && this.ammo > 0) {
      const v = 4 + this.boost;
      --this.ammo;
      this.cooldown = INIT_COOLDOWN;
      this.game.particles.push(new Particle(game, this.x, this.y, v * Math.sin(ta), -v * Math.cos(ta), this));
    }

    if (this.shield > 0) {
      if (this.decay === 0) {
        this.decay = SHIELD_DECAY_TIME;
        --this.shield;
      } else {
        --this.decay;
      }
    }

    this.game.gauge.update();
    return false;
  }
}
