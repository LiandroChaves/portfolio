import * as THREE from 'three';
import { signaturePoint, chapterProgress } from './signatureGeometry';

/** The same object goes from loose ideas to a signature, then a connected system. */
export function createSignatureScene(compact: boolean) {
  const root = new THREE.Group();
  const count = compact ? 1600 : 3600;
  const geometry = new THREE.BufferGeometry();
  const sources = new Float32Array(count * 3);
  const signatures = new Float32Array(count * 3);
  const systems = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const point = signaturePoint(i, count);
    sources.set(point.scatter, i * 3);
    signatures.set(point.signature, i * 3);
    systems.set(point.system, i * 3);
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(sources, 3));
  geometry.setAttribute('aSignature', new THREE.BufferAttribute(signatures, 3));
  geometry.setAttribute('aSystem', new THREE.BufferAttribute(systems, 3));
  const uniforms = {
    uTime: { value: 0 }, uFormation: { value: .65 }, uExpansion: { value: 0 },
    uCalm: { value: 0 }, uPixelRatio: { value: 1 },
    uPointer: { value: new THREE.Vector2() },
    uColor: { value: new THREE.Color(0xceff70) },
  };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: `
      attribute vec3 aSignature;
      attribute vec3 aSystem;
      uniform float uTime, uFormation, uExpansion, uCalm, uPixelRatio;
      uniform vec2 uPointer;
      varying float vAlpha;
      void main() {
        float formation = smoothstep(0.0, 1.0, uFormation);
        float expansion = smoothstep(0.0, 1.0, uExpansion);
        vec3 p = mix(position, aSignature, formation);
        p = mix(p, aSystem, expansion);
        float freeMotion = (1.0 - formation) * (1.0 - uCalm);
        p.x += sin(uTime * .4 + position.y * 2.0) * .22 * freeMotion;
        p.y += cos(uTime * .3 + position.z) * .18 * freeMotion;
        vec2 delta = p.xy - uPointer * vec2(3.0, 2.0);
        float distanceToPointer = length(delta);
        p.xy += delta / max(distanceToPointer, .1) * exp(-distanceToPointer * 2.5) * .3 * (1.0 - uCalm);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = clamp((18.0 + 8.0 * formation) * uPixelRatio / max(1.0, -mvPosition.z), 1.0, 6.0);
        vAlpha = .45 + .5 * formation;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - .5);
        float alpha = (1.0 - smoothstep(.16, .5, d)) * vAlpha;
        if (alpha < .02) discard;
        gl_FragColor = vec4(uColor, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  root.add(points);

  // A custom, extruded LC silhouette: no font downloads or external models.
  const l = new THREE.Shape();
  l.moveTo(-1.9, 1.2); l.lineTo(-1.42, 1.2); l.lineTo(-1.42, -.72);
  l.lineTo(-.55, -.72); l.lineTo(-.55, -1.2); l.lineTo(-1.9, -1.2); l.closePath();
  const c = new THREE.Shape();
  c.absarc(.8, 0, 1.18, Math.PI * .27, Math.PI * 1.73, false);
  c.absarc(.8, 0, .7, Math.PI * 1.73, Math.PI * .27, true); c.closePath();
  const settings = { depth: .3, bevelEnabled: true, bevelThickness: .07, bevelSize: .05, bevelSegments: 3, curveSegments: 32, steps: 1 };
  const solidMaterial = new THREE.MeshStandardMaterial({ color: 0x9ca78d, metalness: .8, roughness: .22, transparent: true, opacity: 0, depthWrite: false });
  const solids = [l, c].map(shape => new THREE.Mesh(new THREE.ExtrudeGeometry(shape, settings), solidMaterial));
  solids.forEach(mesh => { mesh.position.z = -.16; root.add(mesh); });
  const layerMaterial = new THREE.LineBasicMaterial({ color: 0x9fbd75, transparent: true, opacity: 0 });
  const boxGeometry = new THREE.BoxGeometry(3.85, 2.45, .035);
  const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);
  boxGeometry.dispose();
  const layers = [-1, 0, 1].map(index => {
    const layer = new THREE.LineSegments(edgeGeometry, layerMaterial);
    layer.position.set(index * .45, 0, index * 1.2); root.add(layer); return layer;
  });
  const floorGeometry = new THREE.RingGeometry(2.7, 2.71, 100);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x88a35e, transparent: true, opacity: .25, side: THREE.DoubleSide });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.8; root.add(floor);

  return {
    root,
    update(progress: number, time: number, pointer: THREE.Vector2, calm: boolean, pixelRatio: number) {
      // Start partially formed so the first frame already has a recognizable signature.
      const { formation, expansion } = chapterProgress(.08 + progress * .92);
      uniforms.uFormation.value = formation;
      uniforms.uExpansion.value = expansion;
      uniforms.uTime.value = time;
      uniforms.uPointer.value.copy(pointer);
      uniforms.uCalm.value = calm ? 1 : 0;
      uniforms.uPixelRatio.value = pixelRatio;
      solidMaterial.opacity = Math.max(0, (formation - .55) / .45) * (1 - expansion) * .9;
      layerMaterial.opacity = expansion * .65;
      floorMaterial.opacity = .15 + formation * .15;
      root.rotation.set(-.08 + (calm ? 0 : pointer.y * .08), -.32 + expansion * .5 + (calm ? 0 : pointer.x * .15), 0);
      root.position.y = calm ? 0 : Math.sin(time * .65) * .045;
      layers.forEach((layer, i) => { layer.position.z = (i - 1) * (1.2 + expansion * .25); });
    },
    setTheme(dark: boolean) {
      uniforms.uColor.value.set(dark ? 0xceff70 : 0x456416);
      solidMaterial.color.set(dark ? 0xa9b599 : 0x60734a);
      layerMaterial.color.set(dark ? 0xc0e78b : 0x567431);
    },
    dispose() {
      geometry.dispose(); material.dispose(); solidMaterial.dispose();
      solids.forEach(mesh => mesh.geometry.dispose());
      edgeGeometry.dispose(); layerMaterial.dispose(); floorGeometry.dispose(); floorMaterial.dispose();
    },
  };
}
