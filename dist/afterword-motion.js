/** Reveal each closing-section column once as it enters the viewport. */
export function mountAfterwordMotion(root){
 if(!root)return ()=>{};
 const targets=[...root.querySelectorAll('.cv-reading,.cv-comparison,.ce-reading,.ce-visual,.cd-reading,.cd-participation,.cd-wishes,.cd-contribute,.pi-intro,.pi-main')].filter(el=>!el.parentElement.closest('.aw-reveal'));
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return ()=>{};
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('aw-in');observer.unobserve(entry.target);}});
 },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
 targets.forEach(el=>{el.classList.add('aw-reveal');observer.observe(el);});
 return ()=>{observer.disconnect();targets.forEach(el=>el.classList.remove('aw-reveal','aw-in'));};
}
