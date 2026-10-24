import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const state=vi.hoisted(()=>({ fail:false, dispose:vi.fn(), render:vi.fn() }));
vi.mock('three',async importOriginal=>{
 const actual=await importOriginal<typeof import('three')>();
 return {...actual,WebGLRenderer:class{
  domElement=document.createElement('canvas');capabilities={getMaxAnisotropy:()=>4};outputColorSpace='';
  constructor(){if(state.fail)throw Error('WebGL unavailable')}
  setPixelRatio(){}setClearColor(){}setSize(){}render=state.render;dispose=state.dispose;
 },TextureLoader:class{load(_src:string,success:(texture:InstanceType<typeof actual.Texture>)=>void){queueMicrotask(()=>success(new actual.Texture()))}}};
});
import HeroVisual from '../src/components/HeroVisual';
let frames:Map<number,FrameRequestCallback>;let id=0;
beforeEach(()=>{state.fail=false;state.dispose.mockClear();state.render.mockClear();frames=new Map();id=0;
 vi.stubGlobal('ResizeObserver',class{observe(){}disconnect(){}});
 vi.stubGlobal('requestAnimationFrame',(fn:FrameRequestCallback)=>{frames.set(++id,fn);return id});vi.stubGlobal('cancelAnimationFrame',(key:number)=>frames.delete(key));
 vi.stubGlobal('IntersectionObserver',class{constructor(private callback:(entries:{isIntersecting:boolean}[])=>void){}observe(){this.callback([{isIntersecting:true}])}disconnect(){}unobserve(){}});
});
afterEach(()=>{cleanup();vi.unstubAllGlobals()});
function frame(){const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(100))}
it('leaves the HTML portrait visible when WebGL is unavailable',()=>{state.fail=true;const {container}=render(<div className="portrait-frame"><img alt="portrait"/><HeroVisual kind="portrait"/></div>);expect(container.querySelector('canvas')).toBeNull();expect(container.querySelector('.portrait-rendered')).toBeNull()});
it('shows the 3D portrait only after loading, then restores the fallback on context loss',async()=>{const {container,unmount}=render(<div className="portrait-frame"><img alt="portrait"/><HeroVisual kind="portrait"/></div>);expect(container.querySelector('.portrait-rendered')).toBeNull();await act(async()=>{await Promise.resolve();frame()});expect(container.querySelector('.portrait-rendered')).not.toBeNull();expect(state.render).toHaveBeenCalledOnce();act(()=>{container.querySelector('canvas')!.dispatchEvent(new Event('webglcontextlost',{cancelable:true}))});expect(container.querySelector('.portrait-rendered')).toBeNull();unmount();expect(state.dispose).toHaveBeenCalledOnce();expect(frames.size).toBe(0)});
it('renders one static backdrop under reduced motion and releases the renderer',()=>{const {unmount}=render(<HeroVisual kind="backdrop"/>);act(frame);expect(state.render).toHaveBeenCalledOnce();expect(frames.size).toBe(0);unmount();expect(state.dispose).toHaveBeenCalledOnce()});

it('resumes rendering after WebGL context recovery',()=>{
 const {container}=render(<HeroVisual kind="backdrop"/>);
 act(frame);
 const canvas=container.querySelector('canvas')!;
 act(()=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
 expect(container.querySelector('.scene-ready')).toBeNull();
 act(()=>canvas.dispatchEvent(new Event('webglcontextrestored')));
 act(frame);
 expect(state.render).toHaveBeenCalledTimes(2);
 expect(container.querySelector('.scene-ready')).not.toBeNull();
});
it('pauses the animation loop when requested while preserving the scene',async()=>{
 vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener(){},removeEventListener(){}}));
 const {container}=render(<section className="cinematic-hero" data-scene-paused="true"><HeroVisual kind="backdrop"/></section>);
 act(frame);
 expect(state.render).toHaveBeenCalledOnce();expect(frames.size).toBe(0);
 await act(async()=>{container.querySelector('section')!.dataset.scenePaused='false';await Promise.resolve()});
 act(frame);
 expect(state.render).toHaveBeenCalledTimes(2);expect(frames.size).toBe(1);
});
