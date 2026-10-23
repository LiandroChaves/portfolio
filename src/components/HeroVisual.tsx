import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PORTRAIT = '/images/liandro-smile.webp';
/** Two independent scenes: a full hero backdrop and an undistorted portrait on a 3D plane. */
export default function HeroVisual({ kind }: { kind: 'backdrop' | 'portrait' }) {
 const host = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const element = host.current; if (!element) return; const el: HTMLDivElement = element;
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(kind === 'portrait' ? 34 : 42, 1, .1, 80);
  camera.position.z = kind === 'portrait' ? 7.8 : 12;
  const group = new THREE.Group(); scene.add(group);
  const geometries: THREE.BufferGeometry[] = []; const materials: THREE.Material[] = []; const textures: THREE.Texture[] = [];
  const geometry = <T extends THREE.BufferGeometry>(g:T) => { geometries.push(g); return g; };
  const material = <T extends THREE.Material>(m:T) => { materials.push(m); return m; };
  const metal = material(new THREE.MeshStandardMaterial({ color: 0x8f7bea, metalness: .65, roughness: .23 }));
  const glow = material(new THREE.MeshBasicMaterial({ color: 0xa99aff, transparent: true, opacity: .5 }));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x4e3e87, 2.2));
  const light = new THREE.DirectionalLight(0xffffff, 5); light.position.set(3, 5, 6); scene.add(light);
  const violet = new THREE.PointLight(0x8e65ff, 35, 25); violet.position.set(-4, -1, 4); scene.add(violet);
  const ribbons: THREE.Mesh[] = []; let photoGroup: THREE.Group | undefined;
  let dust: THREE.Points | undefined;
  let active = true, visible = false, frame = 0, lost = false, textureReady = kind === 'backdrop';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const pointer = new THREE.Vector2(); const smooth = new THREE.Vector2();
  let scroll = 0, clock = 0, previous = 0;
  const parent = el.closest('.cinematic-hero') as HTMLElement | null;
  if (kind === 'portrait') {
   photoGroup = new THREE.Group(); group.add(photoGroup);
   const w = 3, h = 4, radius = .15, shape = new THREE.Shape();
   shape.moveTo(-w/2+radius,-h/2);shape.lineTo(w/2-radius,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+radius);shape.lineTo(w/2,h/2-radius);shape.quadraticCurveTo(w/2,h/2,w/2-radius,h/2);shape.lineTo(-w/2+radius,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-radius);shape.lineTo(-w/2,-h/2+radius);shape.quadraticCurveTo(-w/2,-h/2,-w/2+radius,-h/2);
   const panel = geometry(new THREE.ShapeGeometry(shape, 16));
   const positions=panel.getAttribute('position');const uvs=new Float32Array(positions.count*2);
   for(let i=0;i<positions.count;i++){uvs[i*2]=(positions.getX(i)+w/2)/w;uvs[i*2+1]=(positions.getY(i)+h/2)/h;}
   panel.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
   const face = material(new THREE.MeshBasicMaterial({ toneMapped: false }));
   photoGroup.add(new THREE.Mesh(panel,face));
   const backing = new THREE.Mesh(panel,metal);backing.position.z=-.07;backing.scale.set(1.035,1.025,1);photoGroup.add(backing);
   new THREE.TextureLoader().load(PORTRAIT, texture=>{
    if(!active){texture.dispose();return;}textures.push(texture);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);face.map=texture;face.needsUpdate=true;textureReady=true;start();
   },undefined,()=>{ /* HTML portrait remains visible when the texture cannot load. */ });
   const halo=new THREE.Mesh(geometry(new THREE.TorusGeometry(2.05,.018,8,150)),glow);halo.rotation.set(.2,.5,.1);halo.position.z=-.35;group.add(halo);ribbons.push(halo);
   const orbit=new THREE.Mesh(geometry(new THREE.TorusGeometry(2.3,.012,8,150)),glow);orbit.rotation.set(-.4,-.6,.3);orbit.position.z=-.5;group.add(orbit);ribbons.push(orbit);
  } else {
   for(let i=0;i<3;i++){
    const ring=new THREE.Mesh(geometry(new THREE.TorusGeometry(2.5+i*.33,.06+i*.035,12,160)),i===1?glow:metal);
    ring.rotation.set(.65+i*.35,.3+i*.5,i*.8);ring.position.set(-3.2,1.5,-1-i*.5);group.add(ring);ribbons.push(ring);
   }
   const knot=new THREE.Mesh(geometry(new THREE.TorusKnotGeometry(1.3,.15,120,12,2,3)),metal);knot.position.set(3.9,2,-2);group.add(knot);ribbons.push(knot);
   const count=innerWidth<700?100:260;const coords=new Float32Array(count*3);
   // Deterministic low-discrepancy particle field; no large textures or post-processing.
   for(let i=0;i<count;i++){coords[i*3]=((i*.61803398875)%1-.5)*16;coords[i*3+1]=((i*.41421356237)%1-.5)*12;coords[i*3+2]=((i*.73205080757)%1-.5)*6;}
   const dustGeo=geometry(new THREE.BufferGeometry());dustGeo.setAttribute('position',new THREE.BufferAttribute(coords,3));
   const dustMaterial=material(new THREE.PointsMaterial({color:0x9071ee,size:.025,transparent:true,opacity:.65,depthWrite:false}));
   dust=new THREE.Points(dustGeo,dustMaterial);group.add(dust);
   const arcPoints=Array.from({length:100},(_,i)=>{const t=i/99*Math.PI*2;return new THREE.Vector3(Math.cos(t)*6,Math.sin(t)*2.3,Math.sin(t*2)*.8)});
   const arc=new THREE.Mesh(geometry(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arcPoints,true),150,.008,5,true)),glow);arc.rotation.z=-.4;group.add(arc);ribbons.push(arc);
  }
  el.appendChild(renderer.domElement);
  function draw(time:number){
   frame=0;if(!active||!visible||document.hidden||lost||!textureReady)return;
   const dt=previous?Math.min((time-previous)/1000,.05):0;previous=time;if(!motion.matches)clock+=dt;
   const target=motion.matches?new THREE.Vector2():pointer;smooth.lerp(target,1-Math.exp(-dt*6));
   if(photoGroup){photoGroup.rotation.set(-smooth.y*.08,smooth.x*.13,motion.matches?0:Math.sin(clock*.55)*.012);photoGroup.position.y=motion.matches?0:Math.sin(clock*.8)*.025;}
   else {group.rotation.set(smooth.y*.05,smooth.x*.08,motion.matches?0:scroll*.12);group.position.y=motion.matches?0:scroll*.8;}
   ribbons.forEach((mesh,i)=>{if(!motion.matches){mesh.rotation.z+=dt*(i%2===0?.09:-.07);if(kind==='backdrop')mesh.rotation.y+=dt*.04;}});
   if(dust&&!motion.matches){dust.rotation.y=clock*.025;dust.position.x=smooth.x*.2;}
   light.position.x=3+smooth.x*2;
   renderer.render(scene,camera);
   el.classList.add('scene-ready');if(kind==='portrait')el.parentElement?.classList.add('portrait-rendered');
   if(!motion.matches)frame=requestAnimationFrame(draw);
  }
  function start(){cancelAnimationFrame(frame);frame=0;previous=0;if(active&&visible&&!document.hidden&&!lost&&textureReady)frame=requestAnimationFrame(draw);}
  const resize=()=>{const {width,height}=el.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;if(kind==='portrait'){const fitHeight=Math.max(4.8,3.65/camera.aspect);camera.position.z=(fitHeight/2)/Math.tan(THREE.MathUtils.degToRad(camera.fov/2));}camera.updateProjectionMatrix();start();};
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(el);resize();
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start();});observer.observe(el);
  const move=(e:PointerEvent)=>{if(motion.matches||!finePointer.matches||e.pointerType!=='mouse')return;const rect=(parent??el).getBoundingClientRect();pointer.set(THREE.MathUtils.clamp((e.clientX-rect.left)/rect.width*2-1,-1,1),THREE.MathUtils.clamp((e.clientY-rect.top)/rect.height*2-1,-1,1));};
  const leave=()=>pointer.set(0,0);
  const onScroll=()=>{const rect=parent?.getBoundingClientRect();scroll=rect?THREE.MathUtils.clamp(-rect.top/rect.height,0,1):0;};
  const theme=()=>{const dark=document.documentElement.dataset.theme==='dark';metal.color.set(dark?0xb7a6ff:0x7a60cf);glow.color.set(dark?0xbbaaff:0x8065cc);start();};
  const themeObserver=new MutationObserver(theme);themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});theme();
  const contextLost=(e:Event)=>{e.preventDefault();lost=true;cancelAnimationFrame(frame);el.classList.remove('scene-ready');if(kind==='portrait')el.parentElement?.classList.remove('portrait-rendered');};
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  const preference=()=>{pointer.set(0,0);smooth.set(0,0);start();};
  (parent??el).addEventListener('pointermove',move,{passive:true});(parent??el).addEventListener('pointerleave',leave);window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('visibilitychange',start);motion.addEventListener('change',preference);
  return()=>{active=false;cancelAnimationFrame(frame);sizeObserver.disconnect();observer.disconnect();themeObserver.disconnect();(parent??el).removeEventListener('pointermove',move);(parent??el).removeEventListener('pointerleave',leave);window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',start);motion.removeEventListener('change',preference);renderer.domElement.removeEventListener('webglcontextlost',contextLost);el.parentElement?.classList.remove('portrait-rendered');geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
 },[kind]);
 return <div ref={host} className={`hero-webgl hero-webgl-${kind}`} aria-hidden="true"/>;
}
