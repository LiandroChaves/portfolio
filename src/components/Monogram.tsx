import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** A small, font-free LC sculpture. Decorative; the HTML fallback is always present. */
export default function Monogram({ variant = 'hero' }: { variant?: 'hero' | 'process' | 'contact' }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 50);
    camera.position.z = 8.5;
    const group = new THREE.Group(); scene.add(group);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b7def, metalness: .55, roughness: .28 });
    const l = new THREE.Shape();
    l.moveTo(-1.75, 1); l.lineTo(-1.18, 1); l.lineTo(-1.18, -.5); l.lineTo(-.35, -.5); l.lineTo(-.35, -1); l.lineTo(-1.75, -1); l.closePath();
    const c = new THREE.Shape();
    const cx = .8, outer = 1.08, inner = .52;
    // Open right side of C; outer and inner arcs create a continuous solid contour.
    c.absarc(cx, 0, outer, Math.PI / 4, Math.PI * 1.75, false);
    c.absarc(cx, 0, inner, Math.PI * 1.75, Math.PI / 4, true); c.closePath();
    const settings = { depth: .36, bevelEnabled: true, bevelThickness: .09, bevelSize: .07, bevelSegments: 3, steps: 1, curveSegments: 32 };
    const left = new THREE.Mesh(new THREE.ExtrudeGeometry(l, settings), material);
    const right = new THREE.Mesh(new THREE.ExtrudeGeometry(c, settings), material);
    group.add(left, right); group.rotation.set(-.18, -.35, -.12);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xb5acff, metalness: .4, roughness: .35, transparent: true, opacity: .35 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.45, .012, 6, 120), ringMaterial);
    ring.rotation.x = .65; group.add(ring);
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const key = new THREE.DirectionalLight(0xffffff, 4); key.position.set(2, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0x8c7dff, 5); rim.position.set(-4, 1, -2); scene.add(rim);
    el.appendChild(renderer.domElement); el.classList.add('webgl-ready');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0, y: 0 }; let visible = false, frame = 0, lost = false;
    let rotationX = -.18, rotationY = -.35;
    const render = (time = 0) => {
      frame = 0;
      if (!visible || document.hidden || lost) return;
      const calm = motion.matches;
      rotationX += ((calm ? -.18 : -.18 + pointer.y * .16) - rotationX) * .07;
      rotationY += ((calm ? -.35 : -.35 + pointer.x * .45 + Math.sin(time * .0003) * .2) - rotationY) * .07;
      group.rotation.set(rotationX, rotationY, calm ? -.12 : -.12 + Math.sin(time * .0004) * .06);
      group.position.y = calm ? 0 : Math.sin(time * .001) * .1;
      const separation = variant === 'process' && !calm ? (Math.sin(time * .0007) + 1) * .12 : 0;
      left.position.x = -separation; right.position.x = separation;
      renderer.render(scene, camera);
      if (!calm) frame = requestAnimationFrame(render);
    };
    const start = () => { cancelAnimationFrame(frame); frame = 0; if (visible && !document.hidden && !lost) frame = requestAnimationFrame(render); };
    const resize = new ResizeObserver(() => { const { width, height } = el.getBoundingClientRect(); if (!width || !height) return; renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); start(); }); resize.observe(el);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }); observer.observe(el);
    const move = (event: PointerEvent) => { if (event.pointerType !== 'mouse') return; pointer.x = event.clientX / innerWidth * 2 - 1; pointer.y = event.clientY / innerHeight * 2 - 1; };
    const theme = new MutationObserver(() => { material.color.set(document.documentElement.dataset.theme === 'dark' ? 0xb5acff : 0x7160d6); start(); }); theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); el.classList.remove('webgl-ready'); };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('visibilitychange', start); motion.addEventListener('change', start);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); theme.disconnect(); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', start); motion.removeEventListener('change', start); renderer.domElement.removeEventListener('webglcontextlost', contextLost); left.geometry.dispose(); right.geometry.dispose(); ring.geometry.dispose(); material.dispose(); ringMaterial.dispose(); renderer.dispose(); renderer.domElement.remove(); el.classList.remove('webgl-ready'); };
  }, [variant]);
  return <div ref={host} className={`sculpture sculpture-${variant}`} aria-hidden="true"><span className="sculpture-fallback">LC<span>·</span></span></div>;
}
