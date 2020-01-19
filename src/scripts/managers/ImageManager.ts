export class ImageManager<T extends string> {
  private images: Record<string, HTMLImageElement>;
  public loaded = 0;
  public count = 0;
  public callback: () => void;

  constructor(images: Record<string, string>) {
    const imageNames = Object.keys(images);
    this.images = imageNames.reduce((prev, curr) => {
      const t = document.createElement('img');
      t.onload = this.reportLoaded;
      t.src = images[name];
      prev[curr] = t;
      return prev;
    }, {});
    this.count = imageNames.length;
  }

  private reportLoaded = () => {
    this.loaded++;
    this.callback && this.callback();
  };

  get(name: T) {
    return this.images[name];
  }
}
