import { lazy, Suspense, useEffect, useRef, useState } from 'react';
const HeroVisual = lazy(() => import('./HeroVisual'));
const Monogram = lazy(() => import('./Monogram'));
export function Sculpture({ variant = 'hero' }: { variant?: 'hero' | 'process' | 'contact' }) {
  const host = useRef<HTMLDivElement>(null); const [ready, setReady] = useState(false);
  useEffect(() => { const el = host.current; if (!el) return; const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setReady(true); observer.disconnect(); } }, { rootMargin: '150px' }); observer.observe(el); return () => observer.disconnect(); }, []);
  return <div ref={host} className={`sculpture-slot slot-${variant}`}>{ready && <Suspense fallback={<span className="sculpture-fallback" aria-hidden="true">LC·</span>}><Monogram variant={variant}/></Suspense>}</div>;
}
const chapters = [
 { name: 'A ideia', title: <>Toda ideia<br/>começa com<br/><em>uma faísca.</em></>, text: 'Sou Liandro Chaves. Desenvolvedor full stack, curioso por natureza. Transformo possibilidades em experiências digitais.' },
 { name: 'A construção', title: <>O invisível<br/>ganha<br/><em>identidade.</em></>, text: 'Interface, lógica e dados. Cada detalhe tem um papel. Cada escolha aproxima o código de quem vai usar.' },
 { name: 'O sistema', title: <>Tudo se conecta.<br/>E ganha<br/><em>propósito.</em></>, text: 'Sistemas que organizam rotinas, aproximam pessoas e dão espaço para novas ideias. Conheça o que já construí.' },
];
export function CinematicHero(){
 const hero = useRef<HTMLElement>(null);
 const [chapter, setChapter] = useState(0);
 const [paused, setPaused] = useState(false);
 useEffect(()=>{
  const el=hero.current;if(!el)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const update=()=>{if(frame||media.matches)return;frame=requestAnimationFrame(()=>{
   frame=0;const distance=Math.max(1,el.offsetHeight-innerHeight);
   const progress=Math.max(0,Math.min(1,-el.getBoundingClientRect().top/distance));
   el.dataset.sceneProgress=String(progress);
   el.style.setProperty('--hero-progress',String(progress));
   setChapter(Math.min(2,Math.floor(progress*3)));
  })};
  const preference=()=>{if(media.matches){cancelAnimationFrame(frame);frame=0;el.dataset.sceneProgress='0';setChapter(0)}else update()};
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);media.addEventListener('change',preference);update();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);media.removeEventListener('change',preference)};
 },[]);
 function selectChapter(index:number){
  const el=hero.current;if(!el)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.dataset.sceneProgress=String(index/2);setChapter(index);return;}
  const distance=Math.max(1,el.offsetHeight-innerHeight);
  window.scrollTo({top:scrollY+el.getBoundingClientRect().top+distance*(index===0?0:index===1?.5:1),behavior:'smooth'});
 }
 return <section ref={hero} className="cinematic-hero signature-journey" aria-label="Da ideia ao sistema" data-scene-progress="0" data-scene-paused={paused}>
  <div className="signature-stage">
   <div className="signature-atmosphere" aria-hidden="true"/><div className="signature-floor" aria-hidden="true"/>
   <div className="orb-fallback signature-fallback" aria-hidden="true"><i/><i/><i/><b>LC</b></div>
   <Suspense fallback={null}><HeroVisual kind="backdrop"/></Suspense>
   <div className="signature-topline"><span><i/> LIANDRO CHAVES / DESENVOLVEDOR FULL STACK</span><span>CEARÁ, BRASIL ↗</span></div>
   <div className="signature-copy" data-chapter={chapter}><span className="eyebrow">0{chapter+1} / {chapters[chapter].name.toUpperCase()}</span><h1>{chapters[chapter].title}</h1><p>{chapters[chapter].text}</p><a className="pill primary magnetic" href="#projetos">Explore meus projetos <span>↗</span></a></div>
   <div className="signature-caption" aria-hidden="true"><span>LC / ESTUDO DE UMA IDEIA</span><span>{['MATÉRIA EM MOVIMENTO','DA LÓGICA À FORMA','INTERFACE / LÓGICA / DADOS'][chapter]}</span></div>
   <div className="signature-bottom"><a href="#sobre" className="hero-signature"><img src="/images/liandro-smile.webp" width="44" height="44" alt="Liandro Chaves, desenvolvedor full stack" fetchPriority="high"/><span><strong>Liandro Chaves</strong><small>Curiosidade que vira construção.</small></span></a><div className="chapter-controls" role="group" aria-label="Etapas da experiência">{chapters.map((item,index)=><button key={item.name} onClick={()=>selectChapter(index)} aria-pressed={chapter===index} aria-label={`Explorar fase ${item.name}`}><span>0{index+1}</span>{item.name}</button>)}</div><button className="scene-pause" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?'Retomar movimento ↗':'Pausar movimento Ⅱ'}</button></div>
   <a className="signature-scroll" href="#projetos">ROLE PARA TRANSFORMAR <span>↓</span><span className="sr-only"> ou vá direto aos projetos</span></a>
  </div>
 </section>
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
