//Maximum amount of ammo that can be carried
export const MAX_AMMO = 50;

//Maximum amount of bombs that can be carried
export const MAX_BOMBS = 5;

//Cooldown between two shots
export const INIT_COOLDOWN = 10

//Cooldown of a drone between two shots
export const DRONE_INIT_COOLDOWN = 30;

//Maximum amount of life (of the ship)
export const MAX_LIFE = 100;

//Maximum amount of life for the drones
export const DRONE_MAX_LIFE = 10;

//Maximum time that a particle (ammo) is alive
export const MAX_PARTICLE_TIME = 120;

//Initial life of an asteroid
export const ASTEROID_LIFE = 10;

//Maximum speed of the sheep
export const MAX_SPEED = 8;

//Maximum health of the shield
export const MAX_SHIELDS = 99;

//Maximum damage per shot
export const DAMAGE_FACTOR = 14;

//Maximum damage per bomb
export const BOMB_DAMAGE_FACTOR = 50;

//Acceleration per round
export const ACCELERATE = 0.1;

//Rotation per round
export const ROTATE = 4;

//Lifetime of a special pack
export const PACK_TIME = 180;

//Life of a bomb before detonating
export const BOMB_LIFE = 10;

//Waittime for the bomb to detonate
export const BOMB_WAIT = 100;

//Minimum damage of the bomb
export const BOMB_RESIDUE = 5;

//The fixed logic time in ms
export const LOGIC_TIME = 40;

//Logic times till shield loses automatically 1 hp
export const SHIELD_DECAY_TIME = 5;

//Maximum radius for a bomb detonation
export const MAX_BOMB_RADIUS = 300;

//Saves the title of the game
export const DOC_TITLE = 'SpaceShoot 1.0.0 silver';

//Time for a chat message to disappear
export const CHAT_WAIT_TIME = 200;

//(Default) Connection string to server
export const CONNECTION = '132.199.99.246:8081';

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
