import { SoundManager } from './SoundManager';
import { ImageManager } from './ImageManager';
import { IGame } from '../types';

const sounds = {
  explosion: require('../../assets/sounds/explosion.wav'),
  laser: require('../../assets/sounds/laser.wav'),
  bomb: require('../../assets/sounds/bomb.wav'),
  hit: require('../../assets/sounds/hit.wav'),
  powerup: require('../../assets/sounds/powerup.wav'),
};
const sprites = {
  background: require('../../assets/stars.jpg'),
  asteroid: require('../../assets/img/asteroid.png'),
  explosion1: require('../../assets/img/explosion1.png'),
  explosion2: require('../../assets/img/explosion2.png'),
  explosion3: require('../../assets/img/explosion3.png'),
  explosion4: require('../../assets/img/explosion4.png'),
  explosion5: require('../../assets/img/explosion5.png'),
  health: require('../../assets/img/health.png'),
  ammo: require('../../assets/img/ammo.png'),
  agile: require('../../assets/img/agile.png'),
  aim: require('../../assets/img/aim.png'),
  plasma: require('../../assets/img/plasma.png'),
  multiple: require('../../assets/img/multiple.png'),
  bomb: require('../../assets/img/bomb.png'),
  shield: require('../../assets/img/shield.png'),
  detonator: require('../../assets/img/detonator.png'),
  speedlogo: require('../../assets/img/speedlogo.png'),
  bomblogo: require('../../assets/img/bomblogo.png'),
  shieldlogo: require('../../assets/img/shieldlogo.png'),
  networklogo: require('../../assets/img/networklogo.png'),
  healthlogo: require('../../assets/img/healthlogo.png'),
  userslogo: require('../../assets/img/userslogo.png'),
  flame: require('../../assets/img/flame.png'),
};

export type SoundNames = keyof typeof sounds;
export type SpriteNames = keyof typeof sprites;

export class ResourceManager {
  soundEffects: SoundManager<SoundNames>;
  spriteSheets: ImageManager<SpriteNames>;

  constructor() {
    this.soundEffects = new SoundManager(sounds);
    this.spriteSheets = new ImageManager(sprites);
  }

  private ready(game: IGame) {
    const c = game.c;
    const total = this.soundEffects.count + this.spriteSheets.count;
    const loaded = this.soundEffects.loaded + this.spriteSheets.loaded;
    game.progress(total, loaded);
  }

  load(game: IGame) {
    this.soundEffects.callback = () => this.ready(game);
    this.spriteSheets.callback = () => this.ready(game);
    this.ready(game);
  }
}
