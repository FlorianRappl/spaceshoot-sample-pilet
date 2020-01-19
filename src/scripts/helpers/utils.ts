//Sets focus to the canvas
export function handlefocus(c: CanvasRenderingContext2D) {
  return (e: Event) => {
    if (e.type === 'mouseover') {
      c.canvas.focus();
      return false;
    }

    return true;
  };
}

//Converts hex to rgb
export function hexToRgb(str: string) {
  const v: Array<number> = [];

  for (let i = 0; i < 3; i++) {
    v.push(parseInt(str.substring(i * 2, i * 2 + 2), 16));
  }

  return v.join(',');
}

//Converts rgb to hex
export function rgbToHex(str: string) {
  const v = str.split(',');

  for (let i = 0; i < 3; i++) {
    v[i] = parseInt(v[i]).toString(16);
  }

  return v.join('');
}
