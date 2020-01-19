//Maximum amount of ammo that can be carried
export const maxAmmo = 50;

//Maximum amount of bombs that can be carried
export const maxBombs = 5;

//Cooldown between two shots
export const shipCooldown = 10

//Cooldown of a drone between two shots
export const droneCooldown = 30;

//Maximum amount of life (of the ship)
export const maxShipLife = 100;

//Maximum amount of life for the drones
export const maxDroneLife = 10;

//Maximum time that a particle (ammo) is alive
export const maxParticleTimeCycles = 120;

//Initial life of an asteroid
export const asteroidLife = 10;

//Maximum speed of the ship
export const maxVelocity = 8;

//Maximum health of the shield
export const maxShields = 99;

//Maximum damage per shot
export const shotDamageFactor = 14;

//Maximum damage per bomb
export const bombDamageFactor = 50;

//Acceleration per round
export const acceleratePerCycle = 0.1;

//Rotation per round
export const rotatePerCycle = 4;

//Lifetime of a special pack
export const packTimeCycles = 180;

//Life of a bomb before detonating
export const bombLife = 10;

//Waittime for the bomb to detonate
export const bombTimeCycles = 100;

//Minimum damage of the bomb
export const minBombDamage = 5;

//The fixed logic time in ms
export const logicTimeMs = 40;

//Logic times till shield loses automatically 1 hp
export const shieldDecayTimeCycles = 5;

//Maximum radius for a bomb detonation
export const maxBombRadius = 300;

//Time for a chat message to disappear
export const chatMessageDisappearMs = 200;

//(Default) Connection string to server
export const defaultConnection = '132.199.99.246:8081';

//The [predefined] color palette (first colors)
export const primaryColors = [
  '127,255,0',
  '255,102,153',
  '148,0,211',
  '139,69,19',
  '200,102,0',
  '51,102,255',
  '204,0,153',
  '255,255,0',
];

//The [predefined] color palette (second colors)
export const secondaryColors = [
  '192,255,62',
  '255,51,51',
  '138,43,226',
  '160,82,45',
  '255,102,51',
  '102,153,255',
  '153,51,153',
  '255,255,153',
];
