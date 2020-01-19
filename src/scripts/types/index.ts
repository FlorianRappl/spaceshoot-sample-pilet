export interface ISettings {
  playerColors: [string, string];
  server: string;
  playerName: string;
  playSounds: boolean;
  init(): void;
  save(): void;
}

export interface IMenu {
  toggle(): void;
  enableMultiplayer(): void;
  disableMultiplayer(): void;
  select(type: string): void;
  open(): void;
  init(): void;
}

export interface IDialog {
  init(): void;
  open(title: string, text: string, cb?: () => void): void;
}

export interface IChat {
  readonly shown: boolean;
  init(): void;
  toggle(): void;
  logic(): void;
  append(obj: any): void;
  clear(): void;
}

export interface IGauges {
  update(): void;
  init(): void;
  draw(): void;
}

export interface IScore {
  readonly isShown: boolean;
  show(): void;
  update(): void;
  getRanking(): Array<string>;
  getHighscores(): Array<string>;
}

export interface GameHostData {
  name: string;
  password: string;
  friendly: boolean;
  maxplayers: number;
  maxbots: number;
  negative: boolean;
  upgrades: boolean;
  width: number;
  height: number;
}

export interface INetwork {
  connect(): void;
  setup(): void;
  leave(): void;
  send<T extends { cmd: string }>(obj: T): void;
  measureTime(): number;
  requestList(): void;
  update(): void;
  host(data: GameHostData): void;
}

export interface IRankedPlayer {
  color: string;
  name: string;
  points: number;
}

export interface IDrawable {
  readonly x: number;
  readonly y: number;
  logic(): boolean;
  draw(): void;
}

export interface IObject extends IDrawable {
  readonly size: number;
}

export interface ILifeObject extends IObject {
  life: number;
  readonly vx?: number;
  readonly vy?: number;
  readonly explosion: number;
}

export interface IAsteroid extends ILifeObject {}

export interface IBomb extends ILifeObject {
  readonly wait: number;
}

export interface IShipObject extends ILifeObject {
  primaryColor: string;
  secondaryColor: string;
}

export interface IExplosion extends IObject {}

export interface IPack extends IObject {}

export interface IParticle extends IObject {}

export interface IDrone extends IShipObject {
  life: number;
}

export interface IShip extends IShipObject {
  points: number;
  hitByAsteroid: number;
  hitAsteroids: number;
  shotAsteroids: number;
  hitShips: number;
  hitDrones: number;
  hitByDrone: number;
  shotDrones: number;
  ammo: number;
  bombs: number;
  boost: number;
  shield: number;
  decay: number;
  hit(damage: number): void;
  name: string;
}

export interface IInfo extends IDrawable {}

export interface INetworkMatch {
  id: string;
  password: string;
  maxplayers: string;
  players: string;
  name: string;
  created: string;

}

export interface IGame {
  readonly isDead: boolean;
  readonly width: number;
  readonly level: number;
  readonly height: number;
  readonly myship: IShip;
  readonly menu: IMenu;
  readonly dialog: IDialog;
  readonly chat: IChat;
  readonly network: INetwork;
  readonly gauge: IGauges;
  readonly score: IScore;
  readonly c: CanvasRenderingContext2D;
  readonly host: HTMLDivElement;
  readonly settings: ISettings;
  readonly ships: Array<IShip>;
  readonly drones: Array<IDrone>;
  readonly explosions: Array<IExplosion>;
  readonly asteroids: Array<IAsteroid>;
  readonly bombs: Array<IBomb>;
  readonly particles: Array<IParticle>;
  readonly infoTexts: Array<IInfo>;
  running: boolean;
  multiplayer: boolean;
  intro: false | IInfo;
  getShip(id: string): IShip;
  progress(total: number, loaded: number): void;
  draw(): void;
  logic(): void;
  reset(): void;
  startSingle(): void;
  startMulti(obj: any): void;
  continueMulti(obj: any): void;
}
