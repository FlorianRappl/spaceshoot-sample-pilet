/**
 * Calculate the right value for distance calculations.
 */
export function clamp(value: number, min: number, max: number) {
  if (value > max) {
    return max;
  } else if (value < min) {
    return min;
  } else {
    return value;
  }
}

/**
 * Function to detect collisions for rectangle with rectangle.
 */
export function collisionQ2Q(
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const sleft = sx - sw / 2;
  const dright = dx + dw / 2;

  if (sleft > dright) {
    return false;
  }

  const sright = sx + sw / 2;
  const dleft = dx - dw / 2;

  if (sright < dleft) {
    return false;
  }

  const sup = sy - sh / 2;
  const dbottom = dy + dh / 2;

  if (sup > dbottom) {
    return false;
  }

  const sbottom = sy + sh / 2;
  const dup = dy - dh / 2;

  if (sbottom < dup) {
    return false;
  }

  return true;
}

/**
 * Function to detect collisions for circle with rectangle.
 */
export function collisionC2Q(sx: number, sy: number, sd: number, dx: number, dy: number, dw: number, dh: number) {
  const sradius = sd / 2;
  const closestX = clamp(sx, dx - dw / 2, dx + dw / 2);
  const closestY = clamp(sy, dy - dh / 2, dy + dh / 2);
  const distanceX = sx - closestX;
  const distanceY = sy - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared < sradius * sradius;
}

/**
 * Function to detect collisions for circle with circle.
 */
export function collisionC2C(sx: number, sy: number, sd: number, dx: number, dy: number, dd: number) {
  const sradius = sd / 2;
  const dradius = dd / 2;
  const length = sradius + dradius;
  const distanceX = sx - dx;
  const distanceY = sy - dy;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared < length * length;
}

export interface CollisionObject {
  size: number;
  x: number;
  y: number;
}

/**
 * Periodic boundary conditions.
 */
export function pbc(obj: CollisionObject, c: CanvasRenderingContext2D) {
  const s = obj.size / 2;
  const { height, width } = c.canvas;

  if (obj.y + s < 0) {
    obj.y = height + s;
  } else if (obj.y - s > height) {
    obj.y = -s;
  }

  if (obj.x + s < 0) {
    obj.x = width + s;
  } else if (obj.x - s > width) {
    obj.x = -s;
  }
}

/**
 * Helper to calculate degree -> rad.
 */
export function d2g(angle: number) {
  return (Math.PI / 180) * angle;
}
