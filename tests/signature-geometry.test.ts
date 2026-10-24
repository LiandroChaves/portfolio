import { describe, expect, it } from 'vitest';
import { chapterProgress, signaturePoint } from '../src/components/signatureGeometry';
import { createSignatureScene } from '../src/components/SignatureScene';
import * as THREE from 'three';

describe('LC transformation geometry', () => {
 it('keeps sampled targets finite and inside the scene on both quality levels', () => {
  for (const count of [1, 1600, 3600]) for (let i=0;i<count;i++) {
   const p=signaturePoint(i,count);
   for(const values of Object.values(p))for(const value of values){expect(Number.isFinite(value)).toBe(true);expect(Math.abs(value)).toBeLessThan(4.2)}
  }
 });
 it('holds a complete signature between formation and system expansion', () => {
  expect(chapterProgress(-1)).toEqual({formation:0,expansion:0});
  expect(chapterProgress(.5)).toEqual({formation:1,expansion:0});
  expect(chapterProgress(2).formation).toBe(1);
  expect(chapterProgress(2).expansion).toBeCloseTo(1);
 });
 it('uses matching attributes and reveals the system only at the final stage', () => {
  const scene=createSignatureScene(true);
  const points=scene.root.children.find(child=>child instanceof THREE.Points) as THREE.Points<THREE.BufferGeometry,THREE.ShaderMaterial>;
  expect(points.geometry.getAttribute('position').count).toBe(1600);
  expect(points.geometry.getAttribute('aSignature').count).toBe(1600);
  expect(points.geometry.getAttribute('aSystem').count).toBe(1600);
  scene.update(.5,0,new THREE.Vector2(),true,1);
  expect(points.material.uniforms.uFormation.value).toBe(1);
  expect(points.material.uniforms.uExpansion.value).toBe(0);
  scene.update(1,0,new THREE.Vector2(),true,1);
  expect(points.material.uniforms.uExpansion.value).toBeCloseTo(1);
  expect(scene.root.position.y).toBe(0);
  scene.dispose();
 });
});
