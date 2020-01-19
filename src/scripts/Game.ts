import { sounds, sprites } from './managers';
import { LOGIC_TIME, DOC_TITLE, secondaryColors } from './constants';
import { handlefocus, gameMenuHelper } from './helpers';
import { Sockets, Keyboard, Settings, Drone, Explosion, Asteroid, Bomb, Ship, Pack, Particle } from './objects';
import { Chat, Gauges, Score, Menu, Dialog, InfoText, IntroText } from './widgets';
import { IGame, IShip, IInfo, ISettings, IChat, IScore, IDialog, IGauges, IMenu, INetwork } from './types';

export class Game implements IGame {
  private mouseover: (e: Event) => {};

  //Current game time
  private ticks = -1;

  //GameMode (SinglePlayer w/o Network, Multiplayer)
  multiplayer = false;

  //If the game is currently running
  running = false;

  //Current game level
  level = 0;

  //The game's intro
  intro: false | IInfo = false;

  //If the player is already dead
  isDead = false;

  //The Canvas Context to draw on
  c: CanvasRenderingContext2D;

  //All particles (ammo) that should be drawn
  particles = [];

  //All bombs that should be drawn
  bombs = [];

  //All asteroids that should be drawn
  asteroids = [];

  //All packs that should be drawn
  packs = [];

  //All explosions that should be drawn
  explosions = [];

  //All infotexts that should be drawn
  infoTexts = [];

  //All drones that should be drawn
  drones = [];

  //All living ships (self + opponents)
  ships = [];
  myship: IShip;

  //The drawing loop
  loop: any = false;

  host: HTMLDivElement;
  dialog: IDialog;
  gauge: IGauges;
  menu: IMenu;
  network: INetwork;
  keyboard: Keyboard;
  chat: IChat;
  settings: ISettings;
  score: IScore;

  constructor() {
    this.dialog = new Dialog();
    this.gauge = new Gauges(this);
    this.menu = new Menu(this);
    this.network = new Sockets(this);
    this.keyboard = new Keyboard(this);
    this.chat = new Chat(this);
    this.settings = new Settings(this);
    this.score = new Score(this);
  }

  get width() {
    return this.c.canvas.width;
  }

  get height() {
    return this.c.canvas.width;
  }

  init(host: HTMLDivElement) {
    this.host = host;
    this.c = document.querySelector('canvas').getContext('2d');
    this.dialog.init();
    this.chat.init();
    this.menu.init();
  }

  getShip(id: string) {
    for (const ship of this.ships) {
      if (ship.id === id) {
        return ship;
      }
    }
  }

  reset() {
    if (this.multiplayer) {
      this.network.leave();
      this.multiplayer = false;
    }

    this.chat.clear();
    clearInterval(this.loop);
    this.loop = false;
    this.intro = false;
    this.running = false;
    this.ticks = -1;
    this.level = 0;
    this.isDead = false;
    this.particles.splice(0, this.particles.length);
    this.bombs.splice(0, this.bombs.length);
    this.asteroids.splice(0, this.asteroids.length);
    this.packs.splice(0, this.packs.length);
    this.explosions.splice(0, this.explosions.length);
    this.infoTexts.splice(0, this.infoTexts.length);
    this.drones.splice(0, this.drones.length);
    this.ships.splice(0, this.ships.length);
    this.myship = null;

    if (this.score.isShown) {
      this.score.show();
    }
  }

  resume() {
    const c = this.c;
    c.font = '10px Orbitron';
    this.mouseover = handlefocus(c);
    document.body.addEventListener('keydown', this.keyboard.press, false);
    document.body.addEventListener('keyup', this.keyboard.release, false);
    document.body.addEventListener('mouseover', this.mouseover, false);
    document.body.setAttribute('tabindex', '0');
    document.body.focus();
  }

  pause() {
    document.body.removeEventListener('keydown', this.keyboard.press, false);
    document.body.removeEventListener('keyup', this.keyboard.release, false);
    document.body.removeEventListener('mouseover', this.mouseover, false);
  }

  startSingle() {
    const { c, settings, keyboard } = this;
    this.reset();
    gameMenuHelper(true);
    document.title = `Singleplayer - ${DOC_TITLE}`;
    //Produces the Intro
    this.intro = new IntroText(
      this,
      c.canvas.width / 8,
      c.canvas.height / 2,
      (c.canvas.width * 3) / 4,
      c.canvas.height / 4,
      35,
      [
        'The evil Dr. Guru has modified his feared neutrino beam to create gravitational waves which are attracting various kinds of asteroids to earth.',
        'You have been chosen to fight for the survival of all beings on our beloved planet. NASA has built a special spaceship, which gives you the chance to battle it out.',
        "You have to be very careful. Among all the incoming asteroids there are also computer controlled drones, which will fight you. They have been built by Dr. Guru as well! Dr. Guru stole NASA's weapon technology, so you better try not to be hit by them.",
        'The NASA will send up various packages of support from time to time! You should note that your ship has only limited ammo and armor.',
        "Good Luck and never forget: Earth's future is in your hands!",
      ],
    );
    this.myship = new Ship(this, 1, settings.playerColors, keyboard);
    this.ships.push(this.myship);
    this.running = true;
    this.loop = setInterval(() => this.singleLoop(), LOGIC_TIME);
  }

  progress(total: number, loaded: number) {
    const { width, height, network, infoTexts } = this;
    infoTexts.splice(0, 1);

    if (loaded === total) {
      network.setup();
    } else {
      infoTexts.push(
        new InfoText(this, width / 2, height / 2, 100, `Loading ${~~((100 * loaded) / total)}%`, secondaryColors[0]),
      );
    }

    this.draw();
  }

  startMulti(data: any) {
    this.reset();
    gameMenuHelper(true);
    this.multiplayer = true;
    document.title = `Multiplayer - ${DOC_TITLE}`;

    for (const ship of data.ships) {
      this.ships.push(Ship.from(this, ship));
    }

    this.myship = this.ships[this.ships.length - 1];

    for (const asteroid of data.asteroids) {
      this.asteroids.push(Asteroid.from(this, asteroid));
    }

    for (const particle of data.particles) {
      this.particles.push(Particle.from(this, particle));
    }

    for (const pack of data.packs) {
      this.packs.push(Pack.from(this, pack));
    }

    for (const bomb of data.bombs) {
      this.bombs.push(Bomb.from(this, bomb));
    }

    this.running = true;
    this.loop = true;
  }

  singleLoop() {
    if (this.running) {
      this.logic();
      this.showStatistic();
      this.items();
      this.draw();
    }
  }

  continueMulti(data: any) {
    if (!this.loop || !this.multiplayer) {
      return;
    }

    let length = this.explosions.length;

    for (let i = length; i--; ) {
      if (!this.explosions[i].logic()) {
        this.explosions.splice(i, 1);
      }
    }

    length = this.infoTexts.length;

    for (let i = length; i--; ) {
      if (!this.infoTexts[i].logic()) {
        this.infoTexts.splice(i, 1);
      }
    }

    for (let i = data.info.length; i--; ) {
      this.infoTexts.push(InfoText.from(this, data.info[i]));
    }

    for (let i = data.explosions.length; i--; ) {
      this.explosions.push(Explosion.from(this, data.explosions[i]));
    }

    length = this.ships.length;

    for (let i = length; i--; ) {
      if (!data.ships[i] || data.ships[i].remove) {
        this.ships.splice(i, 1);
      } else {
        this.ships[i].update(data.ships[i]);
      }
    }

    for (let j = length, n = data.ships.length; j < n; j++) {
      this.ships.push(Ship.from(this, data.ships[j]));
    }

    length = this.asteroids.length;

    for (let i = length; i--; ) {
      if (!data.asteroids[i] || data.asteroids[i].remove) {
        this.asteroids.splice(i, 1);
      } else {
        this.asteroids[i].update(data.asteroids[i]);
      }
    }

    for (let j = length, n = data.asteroids.length; j < n; j++) {
      this.asteroids.push(Asteroid.from(this, data.asteroids[j]));
    }

    length = this.particles.length;

    for (let i = length; i--; ) {
      if (!data.particles[i] || data.particles[i].remove) {
        if (this.particles[i].lifetime > 1) {
          sounds.play('hit');
        }

        this.particles.splice(i, 1);
      } else {
        this.particles[i].update(data.particles[i]);
      }
    }

    for (let j = length, n = data.particles.length; j < n; j++) {
      this.particles.push(Particle.from(this, data.particles[j]));
    }

    length = this.packs.length;

    for (let i = length; i--; ) {
      if (!data.packs[i] || data.packs[i].remove) {
        if (this.packs[i].time > 1) {
          sounds.play('powerup');
        }

        this.packs.splice(i, 1);
      } else {
        this.packs[i].update(data.packs[i]);
      }
    }

    for (let j = length, n = data.packs.length; j < n; j++) {
      this.packs.push(Pack.from(this, data.packs[j]));
    }

    length = this.bombs.length;

    for (let i = length; i--; ) {
      if (!data.bombs[i] || data.bombs[i].remove) {
        this.bombs.splice(i, 1);
      } else {
        this.bombs[i].update(data.bombs[i]);
      }
    }

    for (let j = length, n = data.bombs.length; j < n; j++) {
      this.bombs.push(Bomb.from(this, data.bombs[j]));
    }

    this.gauge.update();
    this.chat.logic();
    this.showStatistic();
    this.draw();
  }

  showStatistic() {
    if (this.score.isShown || this.isDead) {
      const details = this.score.getRanking();
      document.querySelector('#scores').innerHTML = `<li>${details.join('</li><li>')}</li>`;
    }
  }

  draw() {
    const c = this.c;
    const w = c.canvas.width;
    const h = c.canvas.height;
    const winh = window.innerHeight || document.body.clientHeight;
    const winw = window.innerWidth || document.body.clientWidth;
    const background = sprites.get('background');

    c.clearRect(0, 0, w, h);
    c.save();

    if (this.myship) {
      if (winw < w) {
        const dx = (1 - winw / w) * (w / 2 - this.myship.x);
        c.translate(dx, 0);
      }

      if (winh < h) {
        const dy = (1 - winh / h) * (h / 2 - this.myship.y);
        c.translate(0, dy);
      }
    }

    for (let i = 0; i < 3; i++) {
      c.drawImage(background, i * 512, 0);
      c.drawImage(background, i * 512, 512);
    }

    for (let i = this.packs.length; i--; ) {
      this.packs[i].draw();
    }

    for (let i = this.explosions.length; i--; ) {
      this.explosions[i].draw();
    }

    for (let i = this.drones.length; i--; ) {
      this.drones[i].draw();
    }

    for (let i = this.ships.length; i--; ) {
      this.ships[i].draw();
    }

    for (let i = this.bombs.length; i--; ) {
      this.bombs[i].draw();
    }

    for (let i = this.particles.length; i--; ) {
      this.particles[i].draw();
    }

    for (let i = this.asteroids.length; i--; ) {
      this.asteroids[i].draw();
    }

    c.restore();

    for (let i = this.infoTexts.length; i--; ) {
      this.infoTexts[i].draw();
    }

    if (this.intro) {
      this.intro.draw();
    }

    if (this.running) {
      this.gauge.draw();
    }
  }

  logic() {
    if (this.intro) {
      if (this.intro.logic()) {
        return;
      }

      this.intro = false;
    }

    for (let i = this.explosions.length; i--; ) {
      if (!this.explosions[i].logic()) {
        this.explosions.splice(i, 1);
      }
    }

    for (let i = this.infoTexts.length; i--; ) {
      if (!this.infoTexts[i].logic()) {
        this.infoTexts.splice(i, 1);
      }
    }

    for (let i = this.ships.length; i--; ) {
      this.ships[i].logic();
    }

    for (let i = this.packs.length; i--; )
      if (!this.packs[i].logic()) {
        if (this.packs[i].time > 1) {
          sounds.play('powerup');
        }

        this.packs.splice(i, 1);
      }

    for (let i = this.particles.length; i--; )
      if (!this.particles[i].logic()) {
        if (this.particles[i].lifetime > 1) {
          sounds.play('hit');
        }

        this.particles.splice(i, 1);
      }

    for (let i = this.bombs.length; i--; ) {
      if (!this.bombs[i].logic()) {
        this.bombs.splice(i, 1);
      }
    }

    for (let i = this.asteroids.length; i--; ) {
      if (!this.asteroids[i].logic()) {
        this.explosions.push(Explosion.from(this, this.asteroids[i]));
      }
    }

    for (let i = this.drones.length; i--; ) {
      if (!this.drones[i].logic()) {
        this.drones.splice(i, 1);
      }
    }

    for (let i = this.ships.length; i--; )
      if (this.ships[i].life <= 0) {
        const c = this.c;
        const ship = this.ships[i];
        this.isDead = true;
        this.infoTexts.push(
          new InfoText(this, c.canvas.width / 2, c.canvas.height / 2, 100, "You're dead Jonny!", ship.secondaryColor),
        );
        this.explosions.push(Explosion.from(this, ship));
        this.score.update();
        this.score.show();
      }

    ++this.ticks;
  }

  items() {
    if (this.isDead || this.ticks === -1) {
      return;
    }

    const { c } = this;

    if (this.ticks % 200 === 0) {
      this.level++;
      this.ships[0].points += 5 * this.level;
      this.infoTexts.push(
        new InfoText(
          this,
          c.canvas.width / 2,
          c.canvas.height / 2,
          100,
          `Level ${this.level}`,
          this.ships[0].secondaryColor,
        ),
      );

      if (this.level % 15 === 0) {
        this.intro = new IntroText(this, 200, c.canvas.height / 2, 600, 210, 35, [
          `Watch out! Dr.Guru just launched an armada of ${this.level} drones to fight you.`,
          'They can also help you destroying various asteroids, since he made some serious programming mistakes.',
          `Until now you are doing quite well. NASA has calculated that you are currently at ${this.ships[0].points} points. You shot ${this.ships[0].shotAsteroids} asteroids.`,
          'Good Luck!',
        ]);

        for (let i = this.level; i--; ) {
          this.drones.push(Drone.generate(this));
        }

        ++this.ticks;
        return;
      }
    }

    const gt = this.ticks * this.level;

    if (gt % 100 === 0) {
      this.asteroids.push(Asteroid.generate(this));
    }

    if (gt % 500 === 0) {
      this.drones.push(Drone.generate(this));
    }

    if (this.ticks % 50 === 0) {
      const coin = Math.random();

      if (coin < 0.1) {
        this.packs.push(Pack.generateHealth(this));
      } else if (coin < 0.2) {
        this.packs.push(Pack.generateAmmo(this));
      } else {
        const trick = 0.01 * (this.level < 35 ? this.level : 35);

        if (coin < 0.25 + trick) {
          this.packs.push(Pack.generateBomb(this));
        } else if (coin < 0.25 + trick + trick) {
          this.packs.push(Pack.generateShield(this));
        }
      }
    }
  }
}
