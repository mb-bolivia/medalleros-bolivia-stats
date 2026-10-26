(()=>{'use strict';
// Retratos V14: se usa el estado verified REAL de stats.json. La posición no interviene.
const norm=s=>String(s||'').toLowerCase().replace(/<[^>]*>/g,m=>m.slice(1,-1)).replace(/[^a-z0-9.]/g,'');
const portraits={
'Francotirador':'perfil-01.webp','CaPaRz0':'perfil-02.webp','ST3':'perfil-03.webp','<MLS>Msg.Lucho':'perfil-04.webp','Bard0k':'perfil-05.webp','Hooligan':'perfil-06.webp','Homer':'perfil-07.webp','SANDY':'perfil-08.webp','Nico':'perfil-09.webp','MOH-Rugrats.ar':'perfil-10.webp',
'OMIXLITO':'verificado-11.webp','Maverick':'verificado-12.webp','Soldado Ryan':'verificado-13.webp','S@nto_Bol':'verificado-14.webp','REV2099':'verificado-15.webp','DARIUS':'verificado-16.webp','JOSELU EL REY':'verificado-17.webp','=BoL= Chory':'verificado-18.webp','litoelnab':'verificado-19.webp','Gral. MacArthur':'verificado-20.webp','Mr.Sipi':'verificado-21.webp','M@chete':'verificado-22.webp','=MB= El_Chacal':'verificado-23.webp','MB_Axis_Aliado':'verificado-24.webp','-MB-cuervo':'verificado-25.webp','PAPI NUMBER':'verificado-26.webp','MAPACHE':'verificado-27.webp','Slipknot+':'verificado-28.webp','^:::The-Fuhrer:::^':'verificado-29.webp','Kechi':'verificado-30.webp'};
// MB-INDIVIDUAL-START
portraits["Mr.Sipi"]="verificados-personalizados/4d722e53697069.png";
portraits["^:::The-Fuhrer:::^"]="verificados-personalizados/5e3a3a3a5468652d4675687265723a3a3a5e.png";
portraits["=MB= El_Chacal"]="verificados-personalizados/3d4d423d20456c5f43686163616c.png";
// MB-INDIVIDUAL-END
const portraitMap=new Map(Object.entries(portraits).map(([n,f])=>[norm(n),'assets/'+f]));
const generic='assets/avatar-m1.svg';
let verified=new Set(),ready=false,pending=false;
const photo=name=>ready&&verified.has(norm(name))?portraitMap.get(norm(name)):null;
function bg(el,file){if(!el)return;const target=`url("${file||generic}")`;if(el.style.backgroundImage!==target){el.style.setProperty('background-image',target,'important');el.style.setProperty('background-size','cover','important');el.style.setProperty('background-position','center','important');}}
function img(el,file){if(!el)return;const target=file||generic;if(el.getAttribute('src')!==target)el.setAttribute('src',target);}
function update(){pending=false;
 document.querySelectorAll('.mb8-medal[data-player]').forEach(el=>bg(el.querySelector('.mb8-face'),photo(el.dataset.player)));
 document.querySelectorAll('.mb8-rank-table tr').forEach(tr=>{const p=tr.querySelector('.player-link[data-player]');if(p)bg(tr.querySelector('.mb8-mini-face'),photo(p.dataset.player));});
 document.querySelectorAll('.mb10-avatar').forEach(el=>{const parent=el.closest('[data-player]');const name=parent?.dataset.player||el.alt?.replace(/^Retrato de\s*/i,'');if(name)img(el,photo(name));});
 const modal=document.getElementById('playerModal'),head=modal?.querySelector('.profile-header');if(head){const name=head.querySelector('h2')?.textContent?.replace(/[✔✓✅]/g,'').trim();if(name)bg(head.querySelector('.mb8-profile-portrait, .mb9-profile-portrait, .mb10-profile-portrait'),photo(name));}
 // Otros retratos con un nickname explícito en su nodo o contenedor.
 document.querySelectorAll('[data-mb-portrait-player]').forEach(el=>{const n=el.dataset.mbPortraitPlayer;if(el.tagName==='IMG')img(el,photo(n));else bg(el,photo(n));});
}
function queue(){if(!pending){pending=true;requestAnimationFrame(update);}}
async function load(){try{const res=await fetch('stats.json?mb14='+Date.now(),{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const data=await res.json();if(!Array.isArray(data.players))throw Error('players no disponible');verified=new Set(data.players.filter(p=>p.verified===true).map(p=>norm(p.name)));ready=true;queue();}catch(e){console.warn('V14: sin estado verificado, se usan avatares genéricos para evitar fotos no autorizadas:',e);ready=true;verified.clear();queue();}}
function init(){queue();load();new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
