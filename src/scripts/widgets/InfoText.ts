import { IGame, IInfo } from '../types';

export class InfoText implements IInfo {
  private total: number;

  constructor(
    private game: IGame,
    public x: number,
    public y: number,
    private time: number,
    private text: string,
    private color: string,
  ) {
    this.total = time;
  }

  static from(game: IGame, info: InfoText) {
    return new InfoText(game, info.x, info.y, info.time, info.text, info.color);
  }

  draw() {
    const { c } = this.game;
    c.save();
    c.translate(this.x, this.y);
    c.textAlign = 'center';
    c.fillStyle = `rgba(${this.color}, ${this.time / this.total})`;
    c.fillText(this.text, 0, 0);
    c.restore();
  }

  logic() {
    return !!this.time--;
  }
}
