import { sounds, sprites } from '../managers';
import { IGame, IExplosion, ILifeObject } from '../types';

export class Explosion implements IExplosion {
  private frame = 15;

  constructor(
    private game: IGame,
    public x: number,
    public y: number,
    public size: number,
    private image: CanvasImageSource,
    private vx = 0,
    private vy = 0,
  ) {
    sounds.play('explosion');
  }

  static from(game: IGame, target: ILifeObject) {
    const image = sprites.get(`explosion${target.explosion}` as any);
    return new Explosion(game, target.x, target.y, target.size, image, target.vx, target.vy);
  }

  draw() {
    const { c } = this.game;
    const pos = (15 - this.frame) * 64;
    const s2 = this.size / 2;
    c.save();
    c.translate(this.x, this.y);
    c.drawImage(this.image, pos / 256, pos % 256, 64, 64, -s2, -s2, this.size, this.size);
    c.restore();
  }

  logic() {
    this.x += this.vx;
    this.y += this.vy;
    return !!this.frame--;
  }
}
