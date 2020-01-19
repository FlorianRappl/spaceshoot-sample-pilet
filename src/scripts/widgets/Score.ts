import { IGame, IRankedPlayer, IScore } from '../types';

export interface ScoreDetail {
  player: string;
  points: number;
  level: number;
  date: Date;
}

export class Score implements IScore {
  isShown = false;
  scores: Array<ScoreDetail> = [];

  constructor(private game: IGame) {
    const s = JSON.parse(localStorage.getItem('highscores'));

    if (s) {
      this.scores = s;
    }
  }

  show() {
    const ss = this.game.host.querySelector<HTMLElement>('#scorescreen');
    this.isShown = ss.style.display !== 'block' || this.game.isDead;

    if (this.isShown) {
      ss.style.display = 'block';
    } else {
      ss.style.display = 'none';
    }
  }

  update() {
    const dd = new Date();
    const pts = this.game.myship.points;

    if (pts > this.high().points) {
      this.game.dialog.open(
        'New High Score!',
        `Congratulations, you did it! Your new personal high score is now at ${pts} points.`,
      );
    }

    this.scores.push({ date: dd, points: pts, level: this.game.level, player: this.game.settings.playerName });
    localStorage.setItem('highscores', JSON.stringify(this.scores));
  }

  high() {
    let max = 0;
    let maxItem = { points: 0, player: '', date: new Date(), level: 0 };
    const s = this.scores;

    for (let i = s.length; i--; ) {
      if (s[i].points > max) {
        max = s[i].points;
        maxItem = s[i];
      }
    }

    return maxItem;
  }

  getHighscores() {
    this.scores.sort((a, b) => b.points - a.points);
    return this.scores.map(
      score =>
        `<span class="player">${score.player}</span> (level <span class="level">${score.level}</span>) <span class="points">${score.points}</span> pts`,
    );
  }

  getRanking() {
    const details: Array<string> = [];

    if (this.game.multiplayer) {
      const ranking: Array<IRankedPlayer> = [];

      for (const ship of this.game.ships) {
        ranking.push({ color: ship.primaryColor, name: ship.name, points: ship.points });
      }

      for (let i = 0; i < ranking.length; i++) {
        for (let j = i + 1; j < ranking.length; j++) {
          if (ranking[j].points > ranking[i].points) {
            const t = ranking[j];
            ranking[j] = ranking[i];
            ranking[i] = t;
          }
        }

        details.push(
          `<span class="level" style="color:rgb(${ranking[i].color})">${ranking[i].name}</span> with <span class="">${ranking[i].points}</span> pts`,
        );
      }
    } else {
      const ship = this.game.myship;
      const high = this.high();
      details.push(
        `<span class="level">${this.game.level}</span> current level`,
        `<span class="number">${ship.shotAsteroids}</span> asteroids shot`,
        `<span class="number">${ship.hitAsteroids}</span> asteroids hit`,
        `<span class="number">${ship.hitByAsteroid}</span> hits by asteroids`,
        `<span class="number">${ship.shotDrones}</span> drones shot`,
        `<span class="number">${ship.hitDrones}</span> drones hit`,
        `<span class="number">${ship.hitByDrone}</span> hits by drones`,
        `<span class="points">${ship.points}</span> points in total`,
        `<span class="highscore">${high.points}</span> highscore ( level <span class="highscore">${high.level}</span> )`,
      );
    }

    return details;
  }
}
