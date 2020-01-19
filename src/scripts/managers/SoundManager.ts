export class SoundManager<T extends string> {
  private sounds: Record<string, Array<HTMLAudioElement>>;
  private canPlay = false;

  public count = 0;
  public loaded = 0;
  public shouldPlay = true;
  public callback: () => void;

  constructor(sounds: Record<string, string>) {
    const soundNames = Object.keys(sounds);
    const audio = document.createElement('audio');
    this.count = soundNames.length;
    this.canPlay = audio.canPlayType('audio/wav') !== '';

    this.sounds = soundNames.reduce((prev, curr) => {
      if (this.canPlay) {
        const t = document.createElement('audio');
        t.preload = 'auto';
        t.addEventListener('loadeddata', this.reportLoaded, false);
        t.src = sounds[name];
        prev[curr] = [t];
      } else {
        this.reportLoaded();
      }

      return prev;
    }, {});
  }

  private reportLoaded = () => {
    this.loaded++;
    this.callback && this.callback();
  };

  play(name: T) {
    if (this.shouldPlay && this.canPlay) {
      const t = this.sounds[name];

      if (t) {
        for (let j = t.length; j--; ) {
          if (t[j].duration === 0) {
            return;
          } else if (t[j].ended) {
            t[j].currentTime = 0;
          } else if (t[j].currentTime > 0) {
            break;
          }

          t[j].play();
          return;
        }

        const s = document.createElement('audio');
        s.src = t[0].src;
        t.push(s);
        s.play();
      }
    }
  }
}
