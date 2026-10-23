import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react';
const Monogram = lazy(() => import('./Monogram'));
export function Sculpture({ variant = 'hero' }: { variant?: 'hero' | 'process' | 'contact' }) {
  const host = useRef<HTMLDivElement>(null); const [ready, setReady] = useState(false);
  useEffect(() => { const el = host.current; if (!el) return; const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setReady(true); observer.disconnect(); } }, { rootMargin: '150px' }); observer.observe(el); return () => observer.disconnect(); }, []);
  return <div ref={host} className={`sculpture-slot slot-${variant}`}>{ready && <Suspense fallback={<span className="sculpture-fallback" aria-hidden="true">LC·</span>}><Monogram variant={variant}/></Suspense>}</div>;
}
export function CinematicHero(){
 const hero = useRef<HTMLElement>(null);
 useEffect(()=>{
  const el=hero.current; if(!el)return; const media=matchMedia('(prefers-reduced-motion: reduce)'); let frame=0;
  const scroll=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const y=media.matches?0:Math.min(1,Math.max(0,-el.getBoundingClientRect().top/el.offsetHeight));el.style.setProperty('--hero-progress',String(y));})};
  const move=(e:PointerEvent)=>{if(media.matches||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();el.style.setProperty('--pointer-x',String((e.clientX-r.left)/r.width-.5));el.style.setProperty('--pointer-y',String((e.clientY-r.top)/r.height-.5));};
  const reset=()=>{el.style.setProperty('--pointer-x','0');el.style.setProperty('--pointer-y','0')};
  const preference=()=>{reset();scroll()};
  window.addEventListener('scroll',scroll,{passive:true});el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);media.addEventListener('change',preference);scroll();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);media.removeEventListener('change',preference)};
 },[]);
 return <section ref={hero} className="cinematic-hero"><div className="hero-kicker"><span><i/> DESENVOLVEDOR FULL STACK</span><span>LIMOEIRO DO NORTE, CE ↗</span></div><h1 className="giant-name"><span className="name-line">{'LIANDRO'.split('').map((x,i)=><span key={i} style={{'--i':i} as CSSProperties}>{x}</span>)}</span><span className="name-line outline-name">CHAVES<span className="name-dot">.</span></span></h1><div className="hero-composition"><div className="hero-grid" aria-hidden="true"/><div className="hero-orbit-track" aria-hidden="true"><i/><i/><i/></div><div className="hero-intro"><span className="eyebrow">CURIOSIDADE EM MOVIMENTO.</span><p>Ideias ganham<br/><em>dimensão.</em></p><span className="hero-caption">Interface, lógica e experiência.<br/>Construídas para pessoas reais.</span><a className="pill primary magnetic" href="#projetos">Explore meus projetos <span>↗</span></a></div><div className="portrait-stage"><div className="portrait-halo" aria-hidden="true"/><div className="portrait-frame"><img src="/images/liandro-studio.webp" width="1086" height="1448" alt="Liandro Chaves, desenvolvedor full stack" fetchPriority="high"/><div className="portrait-shine" aria-hidden="true"/></div><span className="floating-code code-a" aria-hidden="true">&lt;ideia /&gt;</span><span className="floating-code code-b" aria-hidden="true">{ } → experiência</span><span className="portrait-tag">PESSOAS ANTES DE PIXELS.</span><span className="portrait-coordinate" aria-hidden="true">LC — 01 / CEARÁ, BR</span></div><Sculpture/><span className="hero-side-note">DESENHAR. DESENVOLVER. TRANSFORMAR.</span></div><div className="hero-baseline"><span>PORTFÓLIO / LIANDRO CHAVES</span><a href="#projetos">ENTRE NO MEU TRABALHO <span>↓</span></a><span>FEITO PARA EXPLORAR.</span></div></section>
}
export function usePageMotion(route:string){
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)'); let frame=0;
  const elements=Array.from(document.querySelectorAll<HTMLElement>('.section-heading, .project-row, .about-copy, .skills > div, .process h2, .step-copy, .contact h2, .case-story > *, .decisions h2'));
  const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target)}}),{threshold:.12});
  if(!media.matches)elements.forEach(el=>{el.classList.add('reveal-block');reveal.observe(el)});
  const progress=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const total=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--page-progress',String(total>0?scrollY/total:0));})};
  const resetAll=()=>{elements.forEach(el=>el.classList.add('is-visible'));document.querySelectorAll<HTMLElement>('.project-visual,.magnetic').forEach(el=>{el.style.removeProperty('transform');el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg')})};
  const move=(e:PointerEvent)=>{if(media.matches||e.pointerType!=='mouse')return;const target=(e.target as Element).closest<HTMLElement>('.project-visual,.magnetic');if(!target)return;const r=target.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;if(target.classList.contains('magnetic'))target.style.transform=`translate(${x*12}px,${y*10}px)`;else{target.style.setProperty('--tilt-x',`${-y*9}deg`);target.style.setProperty('--tilt-y',`${x*11}deg`)}};
  const out=(e:PointerEvent)=>{const target=(e.target as Element).closest<HTMLElement>('.project-visual,.magnetic');if(target&&!target.contains(e.relatedTarget as Node|null)){target.style.removeProperty('transform');target.style.setProperty('--tilt-x','0deg');target.style.setProperty('--tilt-y','0deg')}};
  window.addEventListener('scroll',progress,{passive:true});window.addEventListener('resize',progress);document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerout',out);media.addEventListener('change',resetAll);progress();
  return()=>{cancelAnimationFrame(frame);reveal.disconnect();elements.forEach(el=>el.classList.remove('reveal-block','is-visible'));window.removeEventListener('scroll',progress);window.removeEventListener('resize',progress);document.removeEventListener('pointermove',move);document.removeEventListener('pointerout',out);media.removeEventListener('change',resetAll)};
 },[route]);
}
