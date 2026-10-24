/** Deterministic, font-free sampling of the LC signature and its three-layer system. */
export function signaturePoint(index: number, count: number) {
  const t = index / Math.max(1, count - 1);
  const u = (index * .61803398875) % 1;
  const v = (index * .41421356237) % 1;
  const angle = t * Math.PI * 18;
  const radius = 2.3 + u * 1.8;
  const scatter: [number, number, number] = [Math.cos(angle) * radius, (v - .5) * 5, Math.sin(angle) * radius];
  let x: number, y: number;
  if (t < .28) { x = -1.9 + u * .48; y = -1.2 + v * 2.4; }
  else if (t < .44) { x = -1.9 + u * 1.35; y = -1.2 + v * .48; }
  else {
    const a = Math.PI * .27 + ((t - .44) / .56) * Math.PI * 1.46;
    const r = .7 + u * .48;
    x = .8 + Math.cos(a) * r;
    y = Math.sin(a) * r;
  }
  const signature: [number, number, number] = [x, y, (u - .5) * .45];
  const layer = index % 3;
  const gridX = Math.floor(u * 24) / 23;
  const gridY = Math.floor(v * 16) / 15;
  const system: [number, number, number] = [(gridX - .5) * 3.8 + (layer - 1) * .45, (gridY - .5) * 2.4, (layer - 1) * 1.2];
  return { scatter, signature, system };
}

export function chapterProgress(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  return { formation: Math.min(1, p / .32), expansion: Math.max(0, (p - .68) / .32) };
}
