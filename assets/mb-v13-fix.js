(()=>{'use strict';
const pics={"Francotirador": "assets/perfil-01.webp", "CaPaRz0": "assets/perfil-02.webp", "ST3": "assets/perfil-03.webp", "<MLS>Msg.Lucho": "assets/perfil-04.webp", "Bard0k": "assets/perfil-05.webp", "Hooligan": "assets/perfil-06.webp", "Homer": "assets/perfil-07.webp", "SANDY": "assets/perfil-08.webp", "Nico": "assets/perfil-09.webp", "MOH-Rugrats.ar": "assets/perfil-10.webp", "OMIXLITO": "assets/verificado-11.webp", "Maverick": "assets/verificado-12.webp", "Soldado Ryan": "assets/verificado-13.webp", "S@nto_Bol": "assets/verificado-14.webp", "REV2099": "assets/verificado-15.webp", "DARIUS": "assets/verificado-16.webp", "JOSELU EL REY": "assets/verificado-17.webp", "=BoL= Chory": "assets/verificado-18.webp", "litoelnab": "assets/verificado-19.webp", "Gral. MacArthur": "assets/verificado-20.webp", "Mr.Sipi": "assets/verificado-21.webp", "M@chete": "assets/verificado-22.webp", "=MB= El_Chacal": "assets/verificado-23.webp", "MB_Axis_Aliado": "assets/verificado-24.webp", "-MB-cuervo": "assets/verificado-25.webp", "PAPI NUMBER": "assets/verificado-26.webp", "MAPACHE": "assets/verificado-27.webp", "Slipknot+": "assets/verificado-28.webp", "^:::The-Fuhrer:::^": "assets/verificado-29.webp", "Kechi": "assets/verificado-30.webp"};
const clean=s=>String(s||'').toLowerCase().replace(/<[^>]*>/g,m=>m.slice(1,-1)).replace(/[^a-z0-9.]/g,'');
const map=new Map(Object.entries(pics).map(([n,p])=>[clean(n),p]));
const get=n=>map.get(clean(n));
const apply=(el,path)=>{if(!el||!path)return;if(el.dataset.mb13image===path)return;el.style.setProperty('background-image',`url("${path}")`,'important');el.style.setProperty('background-size','cover','important');el.style.setProperty('background-position','center','important');el.dataset.mb13image=path;};
let scheduled=false;
function refresh(){scheduled=false;
 document.querySelectorAll('.mb8-medal[data-player]').forEach(el=>apply(el.querySelector('.mb8-face'),get(el.dataset.player)));
 document.querySelectorAll('.mb8-rank-table tr').forEach(tr=>{let n=tr.querySelector('.player-link[data-player]');if(n)apply(tr.querySelector('.mb8-mini-face'),get(n.dataset.player));});
 document.querySelectorAll('.mb10-avatar').forEach(el=>{const owner=el.closest('[data-player]');const name=owner?.dataset.player||el.alt.replace(/^Retrato de\s*/i,'');const path=get(name);if(path&&el.getAttribute('src')!==path)el.setAttribute('src',path);});
 const overlay=document.querySelector('#playerModal');if(!overlay)return;
 const header=overlay.querySelector('.profile-header');if(!header)return;
 const h=header.querySelector('h2');const n=h?.textContent?.replace(/[✔✓✅]/g,'').trim();const path=get(n);
 if(path) apply(header.querySelector('.mb8-profile-portrait, .mb9-profile-portrait, .mb10-profile-portrait'),path);
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(refresh);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{refresh();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});});
else {refresh();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});}
})();