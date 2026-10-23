import { useEffect, useRef, type CSSProperties } from 'react';

/** Scroll-linked storytelling with an equivalent static composition for reduced motion. */
export default function ScrollStory() {
 const host=useRef<HTMLElement>(null);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const update=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const r=el.getBoundingClientRect();const p=reduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.75-r.top)/(r.height*.65)));el.style.setProperty('--story-progress',String(p));el.querySelectorAll<HTMLElement>('.story-word').forEach((word,i)=>word.style.setProperty('--word-progress',String(reduced.matches?1:Math.max(0,Math.min(1,p*6-i)))));})};
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);reduced.addEventListener('change',update);update();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);reduced.removeEventListener('change',update)};
 },[]);
 return <section ref={host} className="scroll-story" aria-label="Da ideia à experiência"><div className="story-sticky"><span className="eyebrow">ENTRE UMA IDEIA E O MUNDO REAL.</span><h2>{['Entender.','Imaginar.','Construir.','Conectar.'].map((word,i)=><span key={word} className="story-word" style={{'--word-index':i} as CSSProperties}>{word}</span>)}</h2><div className="story-bottom"><span>É AQUI QUE EU ENTRO.</span><p>Transformo problemas em sistemas.<br/>E sistemas em experiências.</p></div><div className="story-orbits" aria-hidden="true"><i/><i/><i/><b>✳</b></div></div></section>
}
