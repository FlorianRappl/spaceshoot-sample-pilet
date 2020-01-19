import { ResourceManager } from './ResourceManager';

const resources = new ResourceManager();
const sounds = resources.soundEffects;
const sprites = resources.spriteSheets;

export { resources, sounds, sprites };
