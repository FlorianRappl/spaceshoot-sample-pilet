import { IInfo, IGame } from '../types';

export class IntroText implements IInfo {
  private lines: number;
  private linelength: number;
  private currentline = 0;
  private currentindex = 0;
  private text = [''];
  private font = '20px Orbitron';
  private fillcolor = 'rgb(255, 255, 255)';
  private strokecolor = 'rgb(0, 0, 0)';
  private fadetime = 50;

  constructor(
    private game: IGame,
    public x: number,
    public y: number,
    private width: number,
    private height: number,
    private lineheight: number,
    private fulltext: Array<string>,
  ) {
    this.lines = fulltext.length;
    this.linelength = fulltext.length > 0 ? fulltext[0].length : 0;
  }

  draw() {
    const { c } = this.game;
    c.save();
    c.font = this.font;
    c.fillStyle = this.fillcolor;
    c.strokeStyle = this.strokecolor;
    c.lineWidth = 0.3;
    const l = this.text.length;
    let height = this.lineheight * this.text.length;
    let i = 0;

    if (height > this.height) {
      height = this.height;
      i = l - Math.ceil(this.height / this.lineheight);
    }

    c.translate(this.x, this.y - height);

    while (i < l) {
      c.fillText(this.text[i], 0, 0);
      c.translate(0, this.lineheight);
      i++;
    }

    c.translate(this.width, this.lineheight * 3);
    c.textAlign = 'right';
    c.fillStyle = `rgb(${this.game.settings.playerColors[1]})`;
    c.fillText('press [enter] to skip text', 0, 0);
    c.restore();
  }

  logic() {
    if (this.currentindex === this.linelength) {
      this.currentline += 1;
      this.text.push('');
      this.currentindex = 0;

      if (this.currentline < this.lines) {
        this.linelength = this.fulltext[this.currentline].length;
      }
    }

    if (this.currentline === this.lines) {
      return !!--this.fadetime;
    }

    const c = this.game.c;
    const idx = this.text.length - 1;
    const text = this.text[idx];
    const line = this.fulltext[this.currentline];
    const chr = line[this.currentindex];
    const next = line.indexOf(' ', this.currentindex);
    let plus = '';

    if (next > 0) {
      plus = line.substring(this.currentindex, next);
    } else if (next < 0) {
      plus = line.substring(this.currentindex);
    }

    c.save();
    c.font = this.font;

    if (c.measureText(text + plus).width > this.width) {
      this.text.push(chr);
    } else {
      this.text[idx] = text + chr;
    }

    c.restore();
    this.currentindex += 1;
    return true;
  }
}
