import { SoundManager } from './SoundManager';
import { ImageManager } from './ImageManager';
import { IGame } from '../types';

import explosion from '../../assets/sounds/explosion.wav';
import laser from '../../assets/sounds/laser.wav';
import bombSound from '../../assets/sounds/bomb.wav';
import hit from '../../assets/sounds/hit.wav';
import powerup from '../../assets/sounds/powerup.wav';
import background from '../../assets/stars.jpg';
import asteroid from '../../assets/img/asteroid.png';
import explosion1 from '../../assets/img/explosion1.png';
import explosion2 from '../../assets/img/explosion2.png';
import explosion3 from '../../assets/img/explosion3.png';
import explosion4 from '../../assets/img/explosion4.png';
import explosion5 from '../../assets/img/explosion5.png';
import health from '../../assets/img/health.png';
import ammo from '../../assets/img/ammo.png';
import agile from '../../assets/img/agile.png';
import aim from '../../assets/img/aim.png';
import plasma from '../../assets/img/plasma.png';
import multiple from '../../assets/img/multiple.png';
import bombImage from '../../assets/img/bomb.png';
import shield from '../../assets/img/shield.png';
import detonator from '../../assets/img/detonator.png';
import speedlogo from '../../assets/img/speedlogo.png';
import bomblogo from '../../assets/img/bomblogo.png';
import shieldlogo from '../../assets/img/shieldlogo.png';
import networklogo from '../../assets/img/networklogo.png';
import healthlogo from '../../assets/img/healthlogo.png';
import userslogo from '../../assets/img/userslogo.png';
import flame from '../../assets/img/flame.png';

const sounds = {
  explosion,
  laser,
  bomb: bombSound,
  hit,
  powerup,
};
const sprites = {
  background,
  asteroid,
  explosion1,
  explosion2,
  explosion3,
  explosion4,
  explosion5,
  health,
  ammo,
  agile,
  aim,
  plasma,
  multiple,
  bomb: bombImage,
  shield,
  detonator,
  speedlogo,
  bomblogo,
  shieldlogo,
  networklogo,
  healthlogo,
  userslogo,
  flame,
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
