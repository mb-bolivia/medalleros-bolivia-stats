try{
(()=>{'use strict';
// V28: stats.json se descarga UNA sola vez por visita y se comparte entre todos los scripts.
// V51: - los logros vienen compactos (achCompact) y aca se vuelven a armar igual que antes;
//      - se pide con la version de los datos (MB_DATA_VER) para que el navegador lo guarde
//        en cache hasta la proxima publicacion, en vez de bajarlo entero cada vez.
if(window.__mb28Fetch)return;window.__mb28Fetch=true;
const orig=window.fetch.bind(window);const TTL=4*60*1000;let cache=null;
const esStats=u=>{try{const url=new URL(typeof u==='string'?u:(u&&u.url)||'',location.href);return url.origin===location.origin&&/\/stats\.json$/.test(url.pathname);}catch(e){return false;}};
function rearmar(d){
  if(!d||!d.achCompact||!Array.isArray(d.achCatalog)||!Array.isArray(d.players))return d;
  const C=d.achCatalog;
  for(const p of d.players){const A=p&&p.achievements;if(!Array.isArray(A))continue;
    for(let j=0;j<A.length;j++){const x=A[j];if(!Array.isArray(x))continue;const c=C[x[0]];
      A[j]={id:c[0],tier:c[1],icon:c[2],name:c[3],desc:c[4],unlocked:!!x[1],current:x[2],target:c[5],unit:c[6]};}}
  delete d.achCompact;delete d.achCatalog;return d;
}
window.fetch=function(input,init){
  if(!esStats(input)||(init&&init.method&&init.method.toUpperCase()!=='GET'))return orig(input,init);
  const ahora=Date.now();
  if(!cache||ahora-cache.t>TTL){
    // primera descarga de la visita: con la version (puede salir de la cache);
    // las renovaciones cada 4 min: siempre frescas, como antes.
    const ver=cache?null:window.MB_DATA_VER;
    const url=ver?'stats.json?v='+encodeURIComponent(ver):'stats.json?v28='+ahora;
    const p=orig(url,ver?{}:{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.text();})
      .then(txt=>{try{const d=JSON.parse(txt);if(d&&d.achCompact)return JSON.stringify(rearmar(d));}catch(e){}return txt;});
    cache={t:ahora,p};p.catch(()=>{if(cache&&cache.p===p)cache=null;});
  }
  return cache.p.then(txt=>new Response(txt,{status:200,headers:{'Content-Type':'application/json'}}));
};
})();

}catch(e){console.error("mb-todo: mb-v28-fetch.js",e)}
try{
(function(){'use strict';
 const q=s=>document.querySelector(s), qa=s=>Array.from(document.querySelectorAll(s));
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const femaleNames=['sandy','sandra','valeria','maria','sofia','princess','lady','queen','karol','camila','ana','luna'];
 const maleAvatars=['assets/portrait-1.webp','assets/portrait-2.webp','assets/portrait-3.webp','assets/avatar-m4.svg','assets/avatar-m5.svg','assets/avatar-m6.svg'];
 const femaleAvatars=['assets/portrait-sandy.webp','assets/avatar-f2.svg'];
 function isFemale(name){const n=(name||'').toLowerCase(); return femaleNames.some(x=>n.includes(x));}
 function hash(s){s=String(s||''); let h=0; for(let i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i), h|=0; return Math.abs(h); }
 const fixedPortraits={'francotirador':'assets/perfil-01.webp','caparz0':'assets/perfil-02.webp','st3':'assets/perfil-03.webp','mlsmsg.lucho':'assets/perfil-04.webp','bard0k':'assets/perfil-05.webp','hooligan':'assets/perfil-06.webp','homer':'assets/perfil-07.webp','sandy':'assets/perfil-08.webp','nico':'assets/perfil-09.webp','moh-rugrats.ar':'assets/perfil-10.webp'};
 
 // Retratos exclusivos por identidad verificada, independientemente del puesto.
 fixedPortraits["omixlito"]="assets/verificado-11.webp";
 fixedPortraits["maverick"]="assets/verificado-12.webp";
 fixedPortraits["soldadoryan"]="assets/verificado-13.webp";
 fixedPortraits["sntobol"]="assets/verificado-14.webp";
 fixedPortraits["rev2099"]="assets/verificado-15.webp";
 fixedPortraits["darius"]="assets/verificado-16.webp";
 fixedPortraits["joseluelrey"]="assets/verificado-17.webp";
 fixedPortraits["bolchory"]="assets/verificado-18.webp";
 fixedPortraits["litoelnab"]="assets/verificado-19.webp";
 fixedPortraits["gral.macarthur"]="assets/verificado-20.webp";
 fixedPortraits["mr.sipi"]="assets/verificado-21.webp";
 fixedPortraits["mchete"]="assets/verificado-22.webp";
 fixedPortraits["mbelchacal"]="assets/verificado-23.webp";
 fixedPortraits["mbaxisaliado"]="assets/verificado-24.webp";
 fixedPortraits["mbcuervo"]="assets/verificado-25.webp";
 fixedPortraits["papinumber"]="assets/verificado-26.webp";
 fixedPortraits["mapache"]="assets/verificado-27.webp";
 fixedPortraits["slipknot"]="assets/verificado-28.webp";
 fixedPortraits["thefuhrer"]="assets/verificado-29.webp";
 fixedPortraits["kechi"]="assets/verificado-30.webp";
 function normalizeNick(name){return String(name||'').toLowerCase().replace(/<[^>]*>/g,m=>m.slice(1,-1)).replace(/[^a-z0-9.]/g,'');}
 function avatarFor(name){const nick=normalizeNick(name);if(fixedPortraits[nick])return fixedPortraits[nick];const arr=maleAvatars;return arr[hash(nick)%arr.length];}
 function openTab(tab){const b=q('.tab-btn[data-tab="'+tab+'"]'); if(b) b.click();}
 function readPlayers(){
   const ranking=q('#tbl-ranking'); if(!ranking) return [];
   return qa('#tbl-ranking tbody tr').map((tr,i)=>{const td=tr.querySelectorAll('td'); if(td.length<10) return null; const pl=td[1].querySelector('[data-player]'); return {name:pl?.dataset.player||td[1].textContent.trim(), rank:i+1, wins:td[2].textContent.trim(), kd:td[5].textContent.trim(), win:td[6].textContent.trim(), time:td[9].textContent.trim()};}).filter(Boolean);
 }
 function buildHome(){
   const panel=q('#panel-inicio'), ranking=q('#tbl-ranking'); if(!panel||!ranking||panel.querySelector('.mb8-home')) return;
   const players=readPlayers(); const top=players.slice(0,3); const medals=[top[1],top[0],top[2]].filter(Boolean), order=['second','first','third'];
   const statBoxes=qa('#panel-inicio .stat-box .count-up'); const nums=statBoxes.map(n=>n.dataset.target||n.textContent.trim());
   const home=document.createElement('div'); home.className='mb8-home';
   home.innerHTML=`<div class="mb8-banner"><div class="mb8-banner-text"><div class="sup">🇧🇴 =MB= Medalleros Bolivia Revival</div><h1>Centro competitivo de estadísticas</h1><p>Rankings · Jugadores · Mapas · Torneos</p><div class="subline">Medal of Honor: Allied Assault</div></div></div>
   <div class="mb8-kpis">${[[nums[0]||'—','Jugadores','👥','registrados'],[nums[3]||'—','Mapas','🗺️','jugados'],[nums[2]||'—','Kills','☠️','totales'],[nums[4]||'—','Logros','🏅','disponibles'],[nums[1]||'—','Verificados','✅','por admin']].map(([n,l,ic,t])=>`<div class="mb8-kpi"><div class="ic">${ic}</div><div><div class="n">${esc(Number(String(n).replace(/[^\d]/g,'')||n).toLocaleString('es-BO'))}</div><div class="lab">${l}</div><div class="tiny">${t}</div></div></div>`).join('')}</div>
   <div class="mb8-grid"><div class="mb8-card"><div class="mb8-hd"><b>🏆 Top 3 del ranking</b><button data-mbtab="ranking">Ver ranking completo →</button></div><div class="mb8-podium">${medals.map((p,i)=>`<div class="mb8-medal ${order[i]} player-link" data-player="${esc(p.name)}"><div class="mb8-face" style="background-image:url('${avatarFor(p.name)}')"></div><div class="rank">#${p.rank}</div><strong>${esc(p.name)}</strong><span>Victorias ${esc(p.wins)} · K/D ${esc(p.kd)}</span></div>`).join('')}</div></div>
   <div class="mb8-card"><div class="mb8-hd"><b>📊 Ranking general</b><button data-mbtab="ranking">Ver todos los jugadores →</button></div><div class="mb8-rank-wrap"><table class="mb8-rank-table"><thead><tr><th>#</th><th>Jugador</th><th>Victorias</th><th>K/D</th><th>Win%</th></tr></thead><tbody>${players.slice(0,10).map(p=>`<tr><td>${p.rank}</td><td><div class="pl"><span class="mb8-mini-face" style="background-image:url('${avatarFor(p.name)}')"></span><span class="player-link" data-player="${esc(p.name)}">${esc(p.name)}</span></div></td><td>${esc(p.wins)}</td><td>${esc(p.kd)}</td><td>${esc(p.win)}</td></tr>`).join('')}</tbody></table></div></div>
   <div class="mb8-card"><div class="mb8-hd"><b>🕘 Actividad y comunidad</b><button data-mbtab="sabados">Explorar →</button></div><div class="mb8-log"><div class="entry"><div><strong>Servidor MOHAA Bolivia</strong><br><span>190.181.28.38:12203</span></div><span class="mb8-badge">=MB=</span></div><div class="entry"><div><strong>Duelo por Equipos (TDM)</strong><br><span>Allies vs Axis todos los sábados</span></div><span class="mb8-badge">SÁBADOS</span></div><div class="entry"><div><strong>Historial de duelos</strong><br><span>Compara enfrentamientos</span></div><span class="mb8-badge">VS</span></div><div class="entry"><div><strong>Logros y premios</strong><br><span>Consulta el progreso</span></div><span class="mb8-badge">🏅</span></div></div><p class="mb8-note">Cada pestaña conserva sus datos originales; esta capa mejora solo la presentación.</p></div></div>
   <div class="mb8-bottom"><div class="mb8-card"><div class="mb8-hd"><b>🪖 Sábados por equipos</b><button data-mbtab="sabados">Ver torneo →</button></div><div class="mb8-sat"><div class="mb8-sat-image" aria-label="Duelo por Equipos"></div><div><h3>Duelo por Equipos (TDM)</h3><p>Los sábados se juega Allies vs Axis por equipos: jornadas, marcador Aliados vs Eje y ranking de jugadores.</p><button class="home-btn primary" data-mbtab="sabados">Ver Sábados por Equipos</button></div></div></div>
   <div class="mb8-card"><div class="mb8-hd"><b>🔫 Estadísticas por armas</b><button data-mbtab="armas">Ver armas →</button></div><div class="mb8-bars"><div class="mb8-donut"></div><div class="mb8-weapon-lines"><div class="line"><span>Ranking por arma</span><strong>Disponible</strong></div><div class="line"><span>Kills de cada arma</span><strong>Disponible</strong></div><div class="line"><span>Jugador destacado</span><strong>Disponible</strong></div><div class="line"><span>Comparación histórica</span><strong>Disponible</strong></div></div></div><p class="mb8-note">El gráfico circular es decorativo. Los datos reales se consultan en la pestaña Armas.</p></div>
   <div class="mb8-card"><div class="mb8-hd"><b>📈 Rendimiento competitivo</b><button data-mbtab="ranking">Ver ranking →</button></div><div class="mb8-chart"><svg viewBox="0 0 300 180" role="img" aria-label="Ilustración de un gráfico de progreso, no datos reales"><g stroke="#2a3a49" stroke-width="1"><path d="M20 20V151H291M20 54H291M20 87H291M20 120H291"/></g><polyline points="20,143 59,128 98,135 137,98 176,110 215,77 254,84 291,39" fill="none" stroke="#e7bc67" stroke-width="3"/><g fill="#e7bc67"><circle cx="20" cy="143" r="4"/><circle cx="98" cy="135" r="4"/><circle cx="176" cy="110" r="4"/><circle cx="291" cy="39" r="4"/></g></svg></div><p class="mb8-note">Visual de progreso ilustrativo. El K/D real se mantiene en el ranking y en cada perfil.</p></div></div>`;
   const old=document.createElement('div'); old.hidden=true; old.id='mb8-old-home'; while(panel.firstChild) old.appendChild(panel.firstChild); panel.appendChild(home); panel.appendChild(old);
   home.addEventListener('click',e=>{const t=e.target.closest('[data-mbtab]'); if(t) openTab(t.dataset.mbtab);});
 }
 function enhanceMenu(){ const nav=q('nav.tabs'); if(nav) nav.classList.add('mb8-nav-ready'); }
 function enhancePlayersLinks(){ qa('.player-link[data-player], .player-link').forEach(el=>{ const name=el.dataset.player||el.textContent.trim(); if(!name) return; if(el.querySelector('.mb8-mini-face')) return; if(el.closest('.mb8-rank-table')) return; }); }
 function enhanceProfileModal(){
   const overlay=q('#playerModal'),body=q('#modalBody');if(!overlay||!body||!overlay.classList.contains('active'))return;
   const header=body.querySelector('.profile-header');if(!header||header.dataset.mb9done)return;
   header.dataset.mb9done='1';
   const title=header.querySelector('h2');const name=title?.childNodes[0]?.textContent?.trim()||title?.textContent?.trim()||'';
   const rank=header.querySelector('.rank-badge');const info=title?.parentElement;
   const portrait=document.createElement('div');portrait.className='mb8-profile-portrait';portrait.style.backgroundImage=`url('${avatarFor(name)}')`;
   const main=document.createElement('div');main.className='mb8-head-main';
   const right=document.createElement('div');right.className='mb8-head-side';
   const subtitle=info?.querySelector('.modal-sub');
   right.innerHTML='<div class="mb8-status-card"><div class="label">Identidad competitiva</div><div class="value">'+esc(name)+'</div></div><div class="mb8-status-card"><div class="label">Información del jugador</div><div class="value">'+esc(subtitle?.textContent.trim()||'Estadísticas históricas')+'</div></div>';
   if(rank)main.append(rank);
   if(info)main.append(info);
   header.replaceChildren(portrait,main,right);
   buildPanels(body,header);
 }
 function buildPanels(body,header){
   if(body.querySelector('.mb9-profile-tabs'))return;
   const tabs=document.createElement('nav');tabs.className='mb9-profile-tabs';tabs.setAttribute('aria-label','Secciones del jugador');
   const chips=body.querySelector('.profile-chips');
   const all=[...body.children];let activeKey='Resumen';
   const map=[['Resumen',/medallas de combate|^medallas/i],['Actividad',/actividad por hora|progreso semanal/i],['Armas',/kills por arma|zonas de impacto/i],['Rivales',/a qui[eé]n mata m[aá]s|qui[eé]n lo mata m[aá]s/i],['Mapas',/rendimiento por mapa/i],['Sábados',/s[aá]bados por equipos|escolta al tanque/i],['Logros',/logros|pr[oó]ximos logros/i]];
   const groups=new Map();map.forEach(([k])=>{const p=document.createElement('div');p.className='mb9-panel';p.dataset.section=k;groups.set(k,p)});
   let current='Resumen';
   for(const el of all){
     if(el===header||el===chips)continue;
     if(el.classList.contains('modal-section-title')){
       const t=el.textContent.trim();const matched=map.find(([k,re])=>re.test(t));if(matched)current=matched[0];
     }
     if(el.classList.contains('modal-cols')){
       const t=el.textContent.trim();const matched=map.find(([k,re])=>re.test(t));if(matched)current=matched[0];
     }
     groups.get(current).append(el);
   }
   const order=map.map(x=>x[0]);
   for(const key of order){
     const panel=groups.get(key);if(!panel.children.length)continue;
     panel.classList.toggle('active',key==='Resumen');
     const b=document.createElement('button');b.type='button';b.textContent=key;b.classList.toggle('active',key==='Resumen');
     b.addEventListener('click',()=>{tabs.querySelectorAll('button').forEach(x=>x.classList.remove('active'));body.querySelectorAll('.mb9-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');panel.classList.add('active');const container=body.closest(".modal");if(container)container.scrollTop=0;});
     tabs.append(b);body.append(panel);
   }
   if(chips)chips.after(tabs);else header.after(tabs);
 }
 function watchModal(){
   const overlay=q('#playerModal'),body=q('#modalBody');if(!overlay||!body)return;
   let busy=false;
   const observer=new MutationObserver(()=>{if(busy)return;busy=true;try{enhanceProfileModal()}finally{busy=false}});
   observer.observe(body,{childList:true});
   const classObserver=new MutationObserver(()=>{if(overlay.classList.contains('active'))enhanceProfileModal()});classObserver.observe(overlay,{attributes:true,attributeFilter:['class']});
   enhanceProfileModal();
 }
 function decorateRanking(){
   document.querySelectorAll('#tbl-ranking tbody tr').forEach(tr=>{
     const td=tr.querySelectorAll('td');if(td.length<2)return;
     const target=td[1],link=target.querySelector('[data-player]');
     const nick=link?.dataset.player||target.textContent.trim();
     if(!nick || target.querySelector('.mb10-avatar'))return;
     const img=document.createElement('img');img.className='mb10-avatar';img.src=avatarFor(nick);img.alt='Retrato de '+nick;img.loading='lazy';
     target.insertBefore(img,target.firstChild);
   });
 }
 function init(){ enhanceMenu(); buildHome(); decorateRanking(); watchModal(); }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

}catch(e){console.error("mb-todo: mb-v12.js",e)}
try{
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
}catch(e){console.error("mb-todo: mb-v13-fix.js",e)}
try{
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
const photo=name=>{const custom=Object.entries(window.MB_ADMIN_PUBLIC?.imagenes?.jugadores||{}).find(([n])=>norm(n)===norm(name));return custom?.[1]?.src||(ready&&verified.has(norm(name))?portraitMap.get(norm(name)):null);};
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

}catch(e){console.error("mb-todo: mb-v14-verified.js",e)}
try{
(()=>{'use strict';
const byId=id=>document.getElementById(id),norm=s=>String(s||'').trim().toLocaleLowerCase();
const escapeHTML=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const tabs=[['ranking','🏆','Ranking general'],['mapas','🗺️','Mapas'],['armas','🔫','Armas'],['duelospriv','🤺','Duelos privados'],['sabados','🪖','Sábados por equipos'],['torneo','🎖️','Clasificación'],['agenda','📅','Agenda'],['ganadores','👑','Campeones'],['logros-premios','🏅','Logros'],['guia','📖','Guía'],['admin','🔒','Administración']];
let players=[],loaded=false,current='',onlyVerified=false;
function openTab(id){const tab=document.querySelector('.tab-btn[data-tab="'+id+'"]');if(tab){tab.click();document.querySelector('nav.tabs')?.scrollIntoView({behavior:'smooth',block:'start'});return true;}return false;}
function openPlayer(name){if(typeof window.openPlayerModal==='function'){window.openPlayerModal(name);return true;}const el=Array.from(document.querySelectorAll('[data-player]')).find(x=>norm(x.dataset.player)===norm(name));if(el){el.click();return true;}openTab('ranking');return false;}
function getHost(){return document.querySelector('#panel-inicio .mb8-home')||document.querySelector('#panel-inicio .v5-home')||byId('panel-inicio');}
function render(){const host=getHost();if(!host||host.querySelector('#mb15-hub'))return;
const wrap=document.createElement('section');wrap.id='mb15-hub';wrap.className='mb15-hub';wrap.innerHTML=`<div class="mb15-top"><div><div class="mb15-eyebrow">🇧🇴 MEDALLEROS BOLIVIA · CENTRO DE OPERACIONES</div><h2>Explora tu comunidad</h2><p>Busca jugadores, abre sus perfiles o consulta estadísticas y torneos.</p></div><div class="mb15-updated" id="mb15-updated" aria-live="polite">Cargando estadísticas...</div></div><div class="mb15-find"><label for="mb15-query">Buscar jugador por nickname</label><div class="mb15-find-row"><input id="mb15-query" type="search" autocomplete="off" placeholder="Ej. Mr.Sipi, Francotirador, SANDY" aria-controls="mb15-results"><button id="mb15-search" type="button">Buscar</button><button id="mb15-clear" type="button" title="Limpiar búsqueda">Limpiar</button></div><label class="mb15-check"><input id="mb15-verified" type="checkbox"> Solo jugadores verificados</label><div class="mb15-results" id="mb15-results" aria-live="polite"></div></div><div class="mb15-title">Accesos rápidos <span>Selecciona una sección</span></div><div class="mb15-shortcuts">${tabs.map(([id,icon,name])=>`<button type="button" data-mb15-tab="${id}"><span aria-hidden="true">${icon}</span><b>${name}</b><small>Explorar →</small></button>`).join('')}</div>`;
const first=host.querySelector('.mb8-banner,.v5-hero');if(first)first.insertAdjacentElement('afterend',wrap);else host.prepend(wrap);
wrap.addEventListener('click',e=>{const go=e.target.closest('[data-mb15-tab]');if(go){openTab(go.dataset.mb15Tab);return;}const p=e.target.closest('[data-mb15-player]');if(p){openPlayer(p.dataset.mb15Player);return;}if(e.target.closest('#mb15-clear')){byId('mb15-query').value='';current='';draw();byId('mb15-query').focus();return;}if(e.target.closest('#mb15-search')){current=byId('mb15-query').value;draw();}});
byId('mb15-query').addEventListener('input',e=>{current=e.target.value;draw();});byId('mb15-verified').addEventListener('change',e=>{onlyVerified=e.target.checked;draw();});draw();}
function draw(){const out=byId('mb15-results');if(!out)return;const phrase=norm(current);if(!phrase){out.innerHTML='<span class="mb15-hint">Escribe un nombre para ver coincidencias y abrir su perfil.</span>';return;}if(!loaded){out.innerHTML='<span class="mb15-hint">Cargando datos de jugadores...</span>';return;}const list=players.filter(p=>(!onlyVerified||p.verified===true)&&norm(p.name).includes(phrase)).slice(0,12);out.innerHTML=list.length?list.map(p=>`<button type="button" class="mb15-result" data-mb15-player="${escapeHTML(p.name)}"><span>${escapeHTML(p.name)} ${p.verified===true?'✔':''}</span><small>${p.matchesPlayed??'—'} partidas · ${p.wins??'—'} victorias</small></button>`).join(''):'<span class="mb15-hint">Sin coincidencias para este filtro.</span>';}
async function fetchPlayers(){try{const r=await fetch('stats.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const d=await r.json();if(!Array.isArray(d.players))throw Error('stats.json no incluye players');players=d.players;loaded=true;const el=byId('mb15-updated');if(el)el.textContent=players.length+' jugadores · '+players.filter(p=>p.verified===true).length+' verificados';draw();}catch(e){const el=byId('mb15-updated');if(el)el.textContent='No se pudieron cargar los jugadores';console.warn('MB V15',e);draw();}}
function init(){render();fetchPlayers();let n=0;const observer=new MutationObserver(()=>{if(!byId('mb15-hub')&&++n<30)render();});observer.observe(byId('panel-inicio')||document.body,{childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

}catch(e){console.error("mb-todo: mb-v15-home.js",e)}
try{
(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={Bash:'Culata / Bash',Bazooka:'Lanzacohetes',MG:'Ametralladora',Pistol:'Pistola',Rifle:'Rifle',SMG:'Subfusil',Shotgun:'Escopeta',Sniper:'Francotirador'};
const files={Bash:'bash',Bazooka:'bazooka',MG:'mg',Pistol:'pistol',Rifle:'rifle',SMG:'smg',Shotgun:'shotgun',Sniper:'sniper'};
const keys=Object.keys(names);const currentImages={Bash:'culata',Bazooka:'lanzacohetes',MG:'ametralladora',Pistol:'pistola',Rifle:'rifle',SMG:'subfusil',Shotgun:'escopeta',Sniper:'francotirador'};const W=k=>'assets/perfiles-armas/'+currentImages[k]+'.webp';let data=null, chosen='SMG';
const norm=s=>String(s||'').toLowerCase().replace(/<[^>]*>/g,m=>m.slice(1,-1)).replace(/[^a-z0-9.]/g,'');
function tab(id){const button=$(`.tab-btn[data-tab="${id}"]`);if(button){button.click();return true}return false}
function player(n){const link=$$('.player-link[data-player], [data-player]').find(e=>norm(e.dataset.player)===norm(n) && !e.closest('.mb17-studio'));if(link){link.click();return true}return false}
function weaponKey(s){const t=String(s||'').toLowerCase();return keys.find(k=>t===k.toLowerCase()||t.includes(k.toLowerCase()))||null}
function sum(p,k){const ob=p?.weapons||{};return Number(ob[k]||0)||0}
function totals(){return keys.map(k=>({k,value:(data?.players||[]).reduce((n,p)=>n+sum(p,k),0)})).sort((a,b)=>b.value-a.value)}
function selectWeapon(k){chosen=k;const s=$('#weaponSelect');if(s){const opt=[...s.options].find(o=>o.value===k);if(opt){s.value=k;s.dispatchEvent(new Event('change',{bubbles:true}))}}render();tab('armas')}
function bars(rows,action,max=8){const top=rows.slice(0,max),hi=Math.max(1,...top.map(x=>x.value));return '<div class="mb17-bars">'+top.map(x=>`<button class="mb17-bar" data-action="${action}" data-key="${esc(x.k)}"><span>${esc(x.label||names[x.k]||x.k)} · <b>${x.value.toLocaleString('es-BO')}</b></span><span class="track"><i style="width:${(100*x.value/hi).toFixed(2)}%"></i></span></button>`).join('')+'</div>'}
function gallery(){return '<div class="mb17-categories">'+keys.map(k=>`<button class="mb17-weapon" data-weapon="${k}" aria-pressed="${k===chosen}"><img src="${W(k)}" loading="lazy" alt="${names[k]}"><strong>${names[k]}</strong></button>`).join('')+'</div>'}
function render(){const area=$('#mb17-arsenal');if(!area)return;area.innerHTML='<h3>🔫 Arsenal · Estadísticas reales</h3>'+gallery()+'<div class="mb17-charts"><div class="mb17-chart"><b>Eliminaciones por tipo de arma</b>'+bars(totals(),'weapon')+'</div><div class="mb17-chart"><b>Jugadores destacados: '+names[chosen]+'</b>'+bars((data?.players||[]).map(p=>({k:p.name,label:p.name,value:sum(p,chosen)})).sort((a,b)=>b.value-a.value),'player',7)+'</div></div><div class="mb17-details">Las cifras provienen de stats.json. Selecciona un arma o jugador para abrir su información.</div>'}
function initWeapons(){return;const root=$('#panel-armas');if(!root)return;const box=document.createElement('section');box.id='mb17-arsenal';box.className='mb17-studio';root.insertBefore(box,root.firstChild);render(); const s=$('#weaponSelect');if(s){s.addEventListener('change',()=>{const k=weaponKey(s.value);if(k){chosen=k;render()}})}}
function initHome(){const root=$('#panel-inicio .mb8-home')||$('#panel-inicio');if(!root)return;const old=$$('.mb8-bottom .mb8-card');if(false&&old[0]){const hd=old[0].querySelector('.mb8-hd b');if(hd)hd.textContent='🏆 Clasificación del torneo';const pic=old[0].querySelector('.mb8-sat-image');if(pic){pic.style.backgroundImage="linear-gradient(0deg,#05132044,#05132044),url('assets/battlefield-hero.webp')";pic.setAttribute('role','img');pic.setAttribute('aria-label','Clasificación del torneo MOHAA')};const h=old[0].querySelector('h3');if(h)h.textContent='Clasificación del torneo';const p=old[0].querySelector('p');if(p)p.textContent='Resultados, equipos y posiciones reales. Consulta la tabla actualizada del torneo.';old[0].querySelectorAll('[data-mbtab]').forEach(e=>e.dataset.mbtab='torneo');old[0].addEventListener('click',e=>{if(!e.target.closest('button'))tab('torneo')});old[0].classList.add('mb17-card')}
if(old[1]){const b=old[1];const body=b.querySelector('.mb8-bars');if(body)body.outerHTML='<div class="mb17-chart" id="mb17-home-weapons"></div>';const note=b.querySelector('.mb8-note');if(note)note.textContent='Datos calculados a partir de las estadísticas publicadas.'}
if(old[2]){const body=old[2].querySelector('.mb8-chart');if(body)body.outerHTML='<div class="mb17-chart" id="mb17-home-performance"></div>';const note=old[2].querySelector('.mb8-note');if(note)note.textContent='Clasificación actual; pulsa un jugador para abrir su perfil.'}
const w=$('#mb17-home-weapons');if(w)w.innerHTML='<b>Armas más utilizadas (kills)</b>'+bars(totals(),'weapon',5);const p=$('#mb17-home-performance');if(p)p.innerHTML='<b>Rendimiento competitivo por victorias</b>'+bars((data?.players||[]).map(x=>({k:x.name,label:x.name,value:Number(x.wins||x.victories||0)})).sort((a,b)=>b.value-a.value),'player',6);
}
function initMaps(){const root=$('#panel-mapas');if(!root||$('#mb17-map-list'))return;const maps=Array.isArray(data?.maps)?data.maps:[];const labels=maps.slice(0,60).map(m=>typeof m==='string'?m:(m.name||m.map||m.id||'')).filter(Boolean);if(!labels.length)return;const box=document.createElement('div');box.className='mb17-studio';box.id='mb17-map-list';box.innerHTML='<h3>🗺️ Explorar mapas</h3><p class="mb17-status">Miniaturas temáticas ilustrativas. No representan capturas exactas de cada escenario.</p><div class="mb17-maps">'+labels.map(n=>`<button class="mb17-map-card" data-map="${esc(n)}"><img loading="lazy" src="assets/battlefield-hero.webp" alt="Escenario bélico ilustrativo"><strong>${esc(n)}</strong></button>`).join('')+'</div>';root.insertBefore(box,root.firstChild)}
function enhanceProfile(){return;const modal=$('#playerModal');if(!modal?.classList.contains('active'))return;const body=$('#modalBody');if(!body||body.querySelector('#mb17-profile-arsenal'))return;const title=body.querySelector('.profile-header h2');if(!title)return;const n=title.textContent.replace(/[✔✓✅]/g,'').trim();const person=(data?.players||[]).find(p=>norm(p.name)===norm(n));if(!person)return;const box=document.createElement('section');box.className='mb17-studio';box.id='mb17-profile-arsenal';box.innerHTML='<h3>🔫 Arsenal personal · '+esc(person.name)+'</h3><div class="mb17-categories">'+keys.map(k=>`<button class="mb17-weapon" data-weapon="${k}"><img loading="lazy" src="${W(k)}" alt="${names[k]}"><strong>${names[k]} · ${sum(person,k).toLocaleString('es-BO')}</strong></button>`).join('')+'</div><p class="mb17-details">Clic en un arma para consultar el ranking general. Datos tomados del registro personal.</p>';const tabs=body.querySelector('.mb9-tabs, .mb-profile-tabs, .mb9-profile-tabs, .mb9-subnav');if(tabs)tabs.after(box);else{const h=body.querySelector('.profile-header');h.after(box)}}
function actions(e){const w=e.target.closest('[data-weapon]');if(w){selectWeapon(w.dataset.weapon);return}const act=e.target.closest('[data-action]');if(act){act.dataset.action==='weapon'?selectWeapon(act.dataset.key):player(act.dataset.key);return}const m=e.target.closest('[data-map]');if(m){const select=$('#mapSelect');if(select){const found=[...select.options].find(o=>o.value===m.dataset.map||o.textContent.trim()===m.dataset.map);if(found){select.value=found.value;select.dispatchEvent(new Event('change',{bubbles:true}))}}tab('mapas');rootMapHighlight(m.dataset.map)}}
function rootMapHighlight(n){$$('#panel-mapas [data-map]').forEach(x=>x.style.borderColor=x.dataset.map===n?'#edc470':'')}
function anchors(){ $$('.player-link,[data-player],.mb8-medal,.mb8-kpi,.mb8-card button,.tab-btn').forEach(x=>x.classList.add('mb17-clickable'));$$('.mb8-kpi').forEach((x,i)=>{if(!x.dataset.mb17){x.dataset.mb17='1';x.classList.add('mb17-card');x.addEventListener('click',()=>tab(['ranking','mapas','ranking','logros-premios','ranking'][i]||'ranking'))}})}
function testNarrator(){if($('#mb17-narrator'))return;const root=$('#panel-inicio');if(!root)return;const box=document.createElement('div');box.id='mb17-narrator';box.className='mb17-studio';box.innerHTML='<h3>🎙️ Diagnóstico del narrador</h3><button type="button" id="mb17-voice-test">Probar voz en este navegador</button><span id="mb17-voice-status" class="mb17-status" role="status"></span><p class="mb17-details">La prueba requiere un clic y comprueba la voz local. Los anuncios en vivo también dependen del proceso del servidor y de su conexión.</p>';root.appendChild(box);$('#mb17-voice-test').onclick=()=>{const s=$('#mb17-voice-status');if(!('speechSynthesis' in window)){s.textContent=' El navegador no admite síntesis de voz';return}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance('Medalleros Bolivia. Prueba de narrador correcta.');u.lang='es-ES';u.onstart=()=>s.textContent=' Reproduciendo voz';u.onend=()=>s.textContent=' Prueba finalizada';u.onerror=()=>s.textContent=' Error en voz del navegador';speechSynthesis.speak(u)}catch(e){s.textContent=' Error: '+e.message}}}
let queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhanceProfile();anchors()})}
async function main(){try{const r=await fetch('stats.json',{cache:'no-store'});if(r.ok)data=await r.json()}catch(e){console.warn('V17 sin estadísticas disponibles:',e)}initWeapons();initMaps();initHome();queue();document.addEventListener('click',actions);new MutationObserver(queue).observe(document.body,{subtree:true,childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',main);else main();
})();

}catch(e){console.error("mb-todo: mb-v17.js",e)}
try{
/* =MB= EN VIVO en la portada (V20).
   Reutiliza el panel EN VIVO original de la pagina (#liveWrap: mapa, kills, clasificacion,
   Gun Game, Escolta, lo ultimo) y lo coloca dentro de la tarjeta "Actividad y comunidad",
   reemplazando los 4 accesos fijos. No modifica datos historicos. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ajustarEdad(){
  // El narrador sube cada 90 s - 3 min y GitHub Pages tarda en publicar: 3 min era muy poco.
  try{ if(typeof window.LIVE_MAX_EDAD_MS==='number' && window.LIVE_MAX_EDAD_MS<8*60*1000){ window.LIVE_MAX_EDAD_MS=8*60*1000; if(typeof window.pollOnlineNow==='function') window.pollOnlineNow(); } }catch(e){}
}
function montar(){
  const log=$('#panel-inicio .mb8-log'), wrap=document.getElementById('liveWrap');
  if(!log||!wrap) return;
  const card=log.closest('.mb8-card');
  let vacio=document.getElementById('mb-live-empty');
  if(wrap.parentElement!==log){
    if(!vacio){vacio=document.createElement('div');vacio.id='mb-live-empty';}
    log.replaceChildren(vacio,wrap);   // quita los 4 accesos fijos sin utilidad
  }
  if(card){
    const b=card.querySelector('.mb8-hd b'); if(b&&!b.dataset.mbLive){b.textContent='🔴 En vivo · Actividad del servidor';b.dataset.mbLive='1';}
    const btn=card.querySelector('.mb8-hd button'); if(btn) btn.remove();
    const nota=card.querySelector('.mb8-note'); if(nota&&!nota.dataset.mbLive){nota.textContent='Se actualiza solo cada 15 segundos con lo que pasa en el servidor.';nota.dataset.mbLive='1';}
  }
}
function estadoVacio(){
  const wrap=document.getElementById('liveWrap'), vacio=document.getElementById('mb-live-empty'); if(!wrap||!vacio) return;
  const hayVivo=wrap.style.display!=='none'&&wrap.innerHTML.trim()!=='';
  if(hayVivo){vacio.style.display='none';return;}
  const d=window.liveUltimo; let msg='Esperando datos del servidor…';
  if(d&&d.modo==='sin_jugadores') msg='Servidor encendido, sin jugadores humanos conectados ahora. Apenas entre alguien aparece aquí.';
  else if(d&&d.modo==='apagado') msg='Servidor apagado en este momento.';
  else if(d) msg='Sin partida en vivo ahora. Se actualiza automáticamente.';
  vacio.className='mb-live-empty';vacio.style.display='block';vacio.innerHTML='<span class="mb-live-pill stale">● SIN PARTIDA EN VIVO</span><p>'+esc(msg)+'</p>';
}
function ciclo(){montar();estadoVacio();}
function init(){ajustarEdad();ciclo();setInterval(ciclo,2000);setInterval(ajustarEdad,15000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

}catch(e){console.error("mb-todo: mb-live-home.js",e)}
try{
/* =MB= Portada interactiva (V22)
   - Todo lo de la portada lleva a su seccion al hacer clic.
   - Tarjeta "Torneo clasificatorio" con datos reales (ya no menciona Escolta al Tanque).
   No modifica datos historicos. */
(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STATS_URL='stats.json',LIVE_URL='https://mb-bolivia.github.io/mb-live/live.json';
const ALIAS={'torneo-clasificacion':'torneo','clasificacion':'torneo','logros':'logros-premios','campeones':'ganadores'};
let stats=null,live=null;

/* ---------- navegacion ---------- */
function irTab(id){
  id=ALIAS[id]||id;
  const b=document.querySelector('.tab-btn[data-tab="'+id+'"]');
  if(!b) return false;
  b.click();
  try{document.querySelector('nav.tabs')?.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){}
  return true;
}
function irMapa(nombre){
  const sel=$('#mapSelect'); if(!sel) return false;
  const n=String(nombre||'').trim().toLowerCase().replace(/[^a-z0-9]/g,'');
  const op=[...sel.options].find(o=>o.value.toLowerCase().replace(/[^a-z0-9]/g,'').endsWith(n)||o.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g,'')===n);
  if(!op) return false;
  sel.value=op.value; sel.dispatchEvent(new Event('change',{bubbles:true}));
  return irTab('mapas');
}
document.addEventListener('click',e=>{
  // 1) cualquier boton con data-mbtab (corrige ids viejos como torneo-clasificacion)
  const t=e.target.closest('[data-mbtab]');
  if(t&&irTab(t.dataset.mbtab)){e.preventDefault();e.stopImmediatePropagation();return;}
  // 2) encabezado completo de las tarjetas (no solo el boton "Ver ... ->")
  const hd=e.target.closest('.mb8-hd');
  if(hd&&!e.target.closest('button,a')){const b=hd.querySelector('[data-mbtab]');if(b&&irTab(b.dataset.mbtab)){e.stopImmediatePropagation();return;}}
  // 3) palabras del banner
  // 4) nombre de mapa dentro del panel EN VIVO
  const m=e.target.closest('#liveWrap .lv-sub b, #liveWrap .mbh-mapa');
  if(m&&irMapa(m.textContent)){e.stopImmediatePropagation();return;}
},true);

/* ---------- banner: Rankings · Jugadores · Mapas · Torneos ---------- */
function banner(){
  const p=$('.mb8-banner-text p'); if(!p||p.dataset.mbh) return;
  if(!/Rankings/i.test(p.textContent)) return;
  p.dataset.mbh='1';
  p.innerHTML=[['Rankings','ranking'],['Jugadores','ranking'],['Mapas','mapas'],['Torneos','torneo']]
    .map(([t,id])=>'<button type="button" class="mbh-chip" data-mbtab="'+id+'">'+t+'</button>').join(' · ');
}

/* ---------- panel EN VIVO: mapa clickeable ---------- */
function vivo(){
  $$('#liveWrap .lv-row .lv-name').forEach(n=>{
    if(n.dataset.mbh||n.querySelector('.player-link')||/🤖/.test(n.textContent)) return;
    n.dataset.mbh='1';n.classList.add('mbh-mapa');n.title='Ver este mapa';
  });
  $$('#liveWrap .lv-sub b').forEach(b=>{b.style.cursor='pointer';b.title='Ver este mapa';});
}

/* ---------- tarjeta Torneo clasificatorio ---------- */
function diaJuego(){const d=new Date(Date.now()-9*3600*1000);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function fmt(f){if(!f)return '';const [y,m,d]=String(f).split('-');return (+d)+' '+MES[(+m||1)-1];}
function jug(n,extra){return '<span class="player-link mbh-jug" data-player="'+esc(n)+'">'+esc(n)+'</span>'+(extra||'');}
function vivoFresco(){const t=Date.parse(live?.generatedAt||'');return Number.isFinite(t)&&Date.now()-t<8*60*1000&&live.modo==='ffa'&&live.ffa?.clasificacion;}
function filasHoy(){
  if(vivoFresco()){
    const c=live.ffa.clasificacion;
    return {prov:true,filas:(c.lista||[]).slice(0,5).map(x=>({n:x.n,w:x.w,ok:(c.top||[]).includes(x.n),ya:x.ya,ver:x.ver}))};
  }
  const mapa=stats?.torneoClasificacion||{};const hoy=diaJuego();
  const lista=Array.isArray(mapa[hoy])?mapa[hoy]:[];
  return {prov:false,filas:lista.slice(0,5).map((x,i)=>({n:x.name,w:x.wins??x.kills,ok:i<3,ver:true}))};
}
function clasificadosSemana(){
  const mapa=stats?.torneoClasificacion||{};const ini=stats?.torneoFechaInicio,fin=stats?.torneoFechaFin;const set=new Map();
  Object.keys(mapa).sort().forEach(f=>{if(ini&&f<ini)return;if(fin&&f>fin)return;(mapa[f]||[]).forEach(x=>{if(x&&x.name&&!set.has(x.name))set.set(x.name,f);});});
  return [...set.keys()];
}
function proximo(){const hoy=diaJuego();return (stats?.torneoAgenda||[]).find(a=>a.inicio>hoy)||null;}
function contenido(){
  if(!stats) return '<div class="mbh-muted">Cargando torneo…</div>';
  const activo=stats.torneoActivo!==false&&!stats.torneoTerminado;
  const pausado=!!stats.torneoPausado;
  let h='';
  if(stats.torneoTerminado||!activo){
    const p=proximo();
    h+='<div class="mbh-estado"><span class="mbh-badge off">TORNEO TERMINADO</span></div><p class="mbh-muted">El torneo terminó, pronto se armará otro.'+(p?' Próximo: <b>'+fmt(p.inicio)+' – '+fmt(p.fin)+'</b> · Gran Final el <b>'+fmt(p.final)+'</b>.':'')+'</p>';
  }else{
    h+='<div class="mbh-estado"><span class="mbh-badge'+(pausado?' pause':'')+'">'+(pausado?'PAUSADO':'EN CURSO')+'</span><span class="mbh-fechas">📅 '+fmt(stats.torneoFechaInicio)+' – '+fmt(stats.torneoFechaFin)+'</span></div>';
    h+='<div class="mbh-final">🏆 <b>Gran Final</b> · '+fmt(stats.torneoFechaFinal)+' · 21:00 · Gun Game</div>';
    const hoy=filasHoy();
    h+='<div class="mbh-sub">⚔️ Partidas ganadas hoy'+(hoy.prov?' <small>· en vivo, provisional</small>':'')+'</div>';
    h+=hoy.filas.length?hoy.filas.map((x,i)=>'<div class="mbh-row"><span class="mbh-pos">'+(i+1)+'</span><span class="mbh-name">'+jug(x.n,x.ok?' <span class="mbh-chip2 ok">clasificaría</span>':(x.ya?' <span class="mbh-chip2">ya clasificó</span>':(x.ver===false?' <span class="mbh-chip2">sin verificar</span>':'')))+'</span><span class="mbh-val">'+esc(x.w)+' <small>partidas</small></span></div>').join(''):'<div class="mbh-muted">Nadie ha ganado una partida todavía hoy.</div>';
    const cl=clasificadosSemana();
    h+='<div class="mbh-sub">✅ Clasificados esta semana <small>('+cl.length+')</small></div>';
    h+=cl.length?'<div class="mbh-chips">'+cl.map(n=>jug(n)).join('')+'</div>':'<div class="mbh-muted">Aún no hay clasificados esta semana.</div>';
  }
  h+='<div class="mbh-btns"><button type="button" class="home-btn primary mbh-btn" data-mbtab="torneo">Ver clasificación del torneo</button><button type="button" class="home-btn mbh-btn" data-mbtab="agenda">📅 Agenda</button><button type="button" class="home-btn mbh-btn" data-mbtab="ganadores">👑 Ganadores</button></div>';
  return h;
}
function tarjetaTorneo(){
  const card=$$('.mb8-bottom .mb8-card')[0]; if(!card) return;
  const html=contenido();
  if(card.dataset.mbh==='1'&&card._mbhHtml===html) return;
  card.dataset.mbh='1';card._mbhHtml=html;
  card.classList.remove('mb17-card');
  card.innerHTML='<div class="mb8-hd"><b>🎖️ Torneo clasificatorio</b><button type="button" data-mbtab="torneo" class="mb17-clickable">Ver torneo →</button></div><div class="mbh-torneo">'+html+'</div>';
}


/* ---------- Verificacion de tu nick: primero en la Guia y copia en la portada ---------- */
function esVerif(c){return /Verificaci[oó]n de tu nick/i.test(c.querySelector('.modal-section-title')?.textContent||'');}
function verificacion(){
  const panel=document.getElementById('panel-guia');
  const orig=panel&&[...panel.querySelectorAll(':scope > .guide-card')].find(esVerif);
  if(!orig) return;
  if(panel.firstElementChild!==orig) panel.insertBefore(orig,panel.firstElementChild);
  const home=$('.mb8-home'); if(!home||home.querySelector('#mbh-verif-home')) return;
  const banner=home.querySelector('.mb8-banner'); if(!banner) return;
  const copy=orig.cloneNode(true);
  copy.id='mbh-verif-home';copy.classList.add('mbh-verif');
  copy.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
  const fila=copy.querySelector('a.home-btn')?.parentElement;
  if(fila){const b=document.createElement('button');b.type='button';b.className='home-btn';b.dataset.mbtab='guia';b.textContent='📖 Ver Guía del jugador →';fila.appendChild(b);}
  banner.after(copy);
}

/* ---------- datos ---------- */
async function cargarStats(){try{const r=await fetch(STATS_URL+'?t='+Date.now(),{cache:'no-store'});if(r.ok)stats=await r.json();}catch(e){}tarjetaTorneo();}
async function cargarLive(){try{const r=await fetch(LIVE_URL+'?t='+Date.now(),{cache:'no-store'});if(r.ok)live=await r.json();}catch(e){}tarjetaTorneo();}
function ciclo(){banner();vivo();tarjetaTorneo();verificacion();}
function init(){ciclo();cargarStats();cargarLive();setInterval(ciclo,2000);setInterval(cargarStats,120000);setInterval(cargarLive,20000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

}catch(e){console.error("mb-todo: mb-home-interactivo.js",e)}
try{
(()=>{'use strict';
const weapons=[['Bash','bash','BASH'],['Pistol','pistol','PISTOL'],['Shotgun','shotgun','SHOTGUN'],['SMG','smg','SUBMACHINE GUN'],['Rifle','rifle','RIFLE'],['Sniper','sniper','SNIPER RIFLE'],['MG','mg','MACHINE GUN'],['Bazooka','bazooka','ROCKET LAUNCHER']];
const $=s=>document.querySelector(s);let players=[];
const norm=s=>String(s||'').toLowerCase().replace(/<[^>]*>/g,m=>m.slice(1,-1)).replace(/[^a-z0-9.]/g,'');
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const num=x=>Number(x||0).toLocaleString('es-BO');
const imageFiles={"bash":"culata","pistol":"pistola","shotgun":"escopeta","smg":"subfusil","rifle":"rifle","sniper":"francotirador","mg":"ametralladora","bazooka":"lanzacohetes"};
const asset=k=>'assets/perfiles-armas/'+imageFiles[k]+'.webp?v=34';
function card(w,value,selected=false){return `<button type="button" class="mb18-card" data-mb18-weapon="${w[0]}" aria-pressed="${selected}"><img src="${asset(w[1])}" alt="${w[2]}" loading="lazy"><strong>${w[2]}</strong>${value!==null?`<small>${num(value)} kills</small>`:''}</button>`}
function selected(){return $('#weaponSelect')?.value||'Bash'}
function renderGeneral(){const section=$('#panel-armas');if(!section)return;let box=$('#mb18-weapons');if(!box){box=document.createElement('div');box.id='mb18-weapons';section.insertBefore(box,section.firstChild)}const current=selected();box.innerHTML='<h3>🔫 Arsenal de MOHAA · 8 categorías</h3><div class="mb18-grid">'+weapons.map(w=>card(w,players.length?players.reduce((acc,p)=>acc+Number(p.weapons?.[w[0]]||0),0):null,current===w[0])).join('')+'</div><p class="mb18-note">Selecciona una categoría para actualizar el ranking real de eliminaciones. Las imágenes son ilustrativas y no alteran las cifras.</p>';}
function playerName(){const title=$('#playerModal.active #modalBody .profile-header h2');return title?.closest('.profile-header')?.dataset.mb32Name||title?.childNodes[0]?.textContent?.trim()||null}
function renderProfile(){const body=$('#playerModal.active #modalBody');if(!body)return;const n=playerName();if(!n)return;const p=players.find(p=>norm(p.name)===norm(n));const armas=body.querySelector('.mb9-panel[data-section="Armas"]');if(!armas)return;let box=body.querySelector('.mb18-player-weapons');if(!p){if(box)box.remove();return}if(box?.dataset.mb18Player===norm(n))return;if(!box){box=document.createElement('section');box.className='mb18-player-weapons';armas.appendChild(box)}box.dataset.mb18Player=norm(n);box.innerHTML='<h3>🔫 Arsenal personal · '+escapeHTML(p.name)+'</h3><div class="mb18-grid">'+weapons.map(w=>card(w,Number(p.weapons?.[w[0]]||0))).join('')+'</div>';box.querySelectorAll('.mb18-card').forEach(b=>{b.disabled=true;b.removeAttribute('aria-pressed')});}
let pending=false;function update(){pending=false;renderGeneral();renderProfile()};function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}
function start(){document.addEventListener('click',e=>{const card=e.target.closest('#mb18-weapons [data-mb18-weapon]');if(!card)return;const select=$('#weaponSelect');if(select){select.value=card.dataset.mb18Weapon;select.dispatchEvent(new Event('change',{bubbles:true}))}schedule()});$('#weaponSelect')?.addEventListener('change',schedule);
new MutationObserver(()=>{if($('#playerModal.active #modalBody')&&!$('#playerModal.active #modalBody .mb18-player-weapons'))schedule()}).observe(document.body,{childList:true,subtree:true});
fetch('stats.json?weapons_v18='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(d=>{players=Array.isArray(d.players)?d.players:[];schedule()}).catch(e=>console.warn('V18: No se pudieron cargar las estadisticas de armas:',e));schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

}catch(e){console.error("mb-todo: mb-v18-weapons.js",e)}
try{
(()=>{'use strict';
// V28: portada mas limpia. Solo oculta/compacta cosas; no toca datos ni la logica de las demas pestañas.
const txt=el=>(el&&el.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
let pend=false;
function aplicar(){pend=false;
  // Rendimiento competitivo (repetia el Ranking general)
  document.querySelectorAll('.mb8-card').forEach(c=>{const hd=c.querySelector('.mb8-hd');if(hd&&/RENDIMIENTO COMPETITIVO/.test(txt(hd))&&!c.classList.contains('mb28-oculto'))c.classList.add('mb28-oculto');});
  // KPI "Logros disponibles"
  document.querySelectorAll('.mb8-kpi').forEach(k=>{const l=k.querySelector('.lab');if(l&&/LOGROS/.test(txt(l))&&!k.classList.contains('mb28-oculto'))k.classList.add('mb28-oculto');});
  // Nota del EN VIVO
  document.querySelectorAll('p.mb8-note').forEach(p=>{if(/Se actualiza solo cada/.test(p.textContent)){p.textContent=p.textContent.replace('Se actualiza solo cada','Se actualiza cada');}
    if(/cada 15 segundos/.test(p.textContent)&&!p.classList.contains('mb28-nota-vivo'))p.classList.add('mb28-nota-vivo');});
  // Verificacion compacta
  const v=document.getElementById('mbh-verif-home');
  if(v&&!v.querySelector('.mb28-toggle')){
    v.classList.add('mb28-verif');
    const r=document.createElement('p');r.className='mb28-resumen';
    r.textContent='Verifica tu nick con el admin: es obligatorio para los torneos y tienes 15 días desde tu primera partida.';
    const b=document.createElement('button');b.type='button';b.className='mb28-toggle';b.textContent='¿Cómo funciona? ▾';
    b.onclick=()=>{const ab=v.classList.toggle('mb28-abierto');b.textContent=ab?'Cerrar ▴':'¿Cómo funciona? ▾';};
    const wa=v.querySelector('a.home-btn.verify');
    if(wa)wa.after(b);else v.appendChild(b);
    v.appendChild(r);
  }
  // Enlace al Admin en el pie (el boton del menu queda oculto)
  const adm=document.querySelector('.tab-btn[data-tab="admin"]');
  const cont=document.querySelector('.page-container')||document.body;
  if(adm&&!document.querySelector('.mb28-pie')){
    const pie=document.createElement('div');pie.className='mb28-pie';
    const bt=document.createElement('button');bt.type='button';bt.textContent='🔐 Administración';
    bt.onclick=()=>{adm.click();window.scrollTo({top:0,behavior:'smooth'});};
    pie.appendChild(bt);cont.appendChild(pie);
  }
}
const cola=()=>{if(!pend){pend=true;requestAnimationFrame(aplicar);}};
function init(){aplicar();new MutationObserver(cola).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

}catch(e){console.error("mb-todo: mb-v28-limpieza.js",e)}
try{
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clean=s=>String(s||'').replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>Number(n||0).toLocaleString('es-BO');
function element(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;}
function portrait(name,cls=''){const img=element('img',cls);img.src='assets/avatar-m1.svg';img.alt='Retrato de '+name;img.dataset.mbPortraitPlayer=name;img.loading='lazy';return img;}
function playerLink(name){const el=element('span','player-link',name);el.dataset.player=name;el.tabIndex=0;el.setAttribute('role','button');el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});return el;}
function button(label,action){const b=element('button','pv-button',label);b.type='button';b.onclick=action;return b;}
function heading(id,title,description){const root=$('#panel-'+id);if(!root)return;const header=element('header','pv-heading');header.innerHTML='<div class="pv-eyebrow">MOHAA · Bolivia</div><h2>'+title+'</h2><p>'+description+'</p>';root.prepend(header);}
function accordion(node,title,open=false){const details=element('details','pv-accordion');details.open=open;const summary=element('summary','',clean(title));node.before(details);details.append(summary,node);return details;}
function toggleColumns(target,container){const b=button('Más estadísticas',()=>{const expanded=target.classList.toggle('pv-expanded');b.textContent=expanded?'Vista resumida':'Más estadísticas';b.setAttribute('aria-pressed',String(expanded));});b.setAttribute('aria-pressed','false');container.append(b);}
function navigation(){
  $('#closeModal')?.setAttribute('aria-label','Cerrar perfil del jugador');
  const container=$('.page-container');const top=element('header','pv-top');top.innerHTML='<div class="pv-brand"><img class="pv-brand-logo" src="assets/logo-mb-revival.webp?v=39" alt="Medalleros Bolivia Revival" width="1000" height="389" fetchpriority="high"></div><div class="pv-owner"><span class="pv-preview">Comunidad boliviana</span><span class="pv-owner-signature">Página y servidor por Mr.Sipi</span></div>';container.prepend(top);
  const nav=$('nav.tabs');nav.setAttribute('aria-label','Secciones de la página');const more=element('details','pv-more');more.innerHTML='<summary>Más ▾</summary><div class="pv-more-menu"></div>';const menu=more.lastElementChild;
  $$('.tab-btn').forEach(b=>{b.textContent=({ranking:'Ranking',torneo:'Torneos',guia:'Guía del jugador'})[b.dataset.tab]||clean(b.textContent);if(b.dataset.tab==='admin')return;if(!['inicio','ranking','duelospriv','torneo','guia'].includes(b.dataset.tab))menu.append(b);b.addEventListener('click',()=>{more.open=false;more.querySelector('summary').style.color=menu.querySelector('.active')?'#e7bc64':'';});});nav.append(more);const guide=nav.querySelector('[data-tab=guia]');const tournaments=nav.querySelector('[data-tab=torneo]');if(guide&&tournaments)tournaments.after(guide);
  document.addEventListener('click',e=>{if(!more.contains(e.target))more.open=false;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')more.open=false;});
  const foot=element('footer','pv-foot','MOHAA Bolivia · Estadísticas, torneos y comunidad.');const signature=element('span','pv-signature','Página y servidor por Mr.Sipi');foot.append(signature);container.append(foot);
}
function ranking(){const table=$('#tbl-ranking');toggleColumns(table,$('#panel-ranking .toolbar'));$('#search').setAttribute('aria-label','Buscar jugador');}
function enhanceDuel(){
  const result=$('#duelResult'),card=result?.querySelector('.duel-card');if(!card||card.classList.contains('pv-duel'))return;
  const values=[...card.querySelectorAll('.duel-stat-grid .val')].map(x=>Number(x.textContent));if(values.length!==3)return;
  const a=$('#duelPlayerA').value,b=$('#duelPlayerB').value,[ak,total,bk]=values;const winner=card.querySelector('.duel-winner');
  card.classList.add('pv-duel');card.querySelector('.duel-header')?.remove();card.querySelector('.duel-stat-grid')?.remove();
  const stage=element('div','pv-duel-stage');function fighter(name){const box=element('div','pv-fighter'),body=element('div');body.append(playerLink(name),element('small','','Abrir perfil del jugador'));box.append(portrait(name),body);return box;}
  const center=element('div','pv-duel-center');center.innerHTML='<small>Eliminaciones entre ambos</small><div class="pv-score"><b>'+number(ak)+'</b><span>—</span>'+number(bk)+'</div><div class="pv-balance"><i style="width:'+(total?100*ak/total:50)+'%"></i></div><div class="pv-percent"><span>'+(total?Math.round(100*ak/total):0)+'%</span><span>'+(total?Math.round(100*bk/total):0)+'%</span></div>';
  stage.append(fighter(a),center,fighter(b));card.prepend(stage);
  const notes=element('div','pv-duel-notes');notes.innerHTML='<div><strong>'+number(ak)+'</strong><small>Eliminaciones de '+esc(a)+'</small></div><div><strong>'+number(total)+'</strong><small>Encuentros con los filtros elegidos</small></div><div><strong>'+number(bk)+'</strong><small>Eliminaciones de '+esc(b)+'</small></div>';if(winner)winner.before(notes);else card.append(notes);
}
function duels(){const intro=$('#panel-duelos>.pv-heading+div');if(intro)intro.textContent='Selecciona dos jugadores. Los filtros de mapa y fecha se aplican al historial de ambos.';enhanceDuel();new MutationObserver(enhanceDuel).observe($('#duelResult'),{childList:true});}
const weaponNames={Bash:'Culata',Pistol:'Pistola',Shotgun:'Escopeta',SMG:'Subfusil',Rifle:'Rifle',Sniper:'Francotirador',MG:'Ametralladora',Bazooka:'Lanzacohetes'};
function weapons(players){
  const select=$('#weaponSelect');const label=$('label[for="weaponSelect"]');if(label)label.textContent='Categoría de arma';[...select.options].forEach(o=>o.textContent=weaponNames[o.value]||o.textContent);
  const feature=element('section','pv-feature');$('#panel-armas .table-scroll').before(feature);
  function render(){const key=select.value;const ordered=players.filter(p=>Number(p.weapons?.[key])>0).sort((a,b)=>Number(b.weapons[key])-Number(a.weapons[key]));feature.replaceChildren();if(!ordered.length){feature.append(element('p','','No hay eliminaciones registradas para esta categoría.'));return;}const p=ordered[0],body=element('div');body.append(element('p','','Líder con '+weaponNames[key]),element('h3'));body.lastChild.append(playerLink(p.name));const value=element('div','pv-feature-number');value.innerHTML=number(p.weapons[key])+'<small>Eliminaciones · bots y humanos</small>';const artwork=element('img','mb34-selected-weapon');artwork.src='assets/perfiles-armas/'+({"Bash":"culata","Pistol":"pistola","Shotgun":"escopeta","SMG":"subfusil","Rifle":"rifle","Sniper":"francotirador","MG":"ametralladora","Bazooka":"lanzacohetes"})[key]+'.webp?v=34';artwork.alt=weaponNames[key];feature.append(artwork,portrait(p.name),body,value);}
  select.addEventListener('change',render);render();
  function labels(){const root=$('#panel-armas'),header=root.querySelector('.pv-heading');if(header&&root.firstElementChild!==header)root.prepend(header);const title=$('#mb18-weapons h3');if(title&&title.textContent!=='Elige tu categoría')title.textContent='Elige tu categoría';$$('#mb18-weapons [data-mb18-weapon]').forEach(c=>{const label=c.querySelector('strong'),name=weaponNames[c.dataset.mb18Weapon];if(label&&name&&label.textContent!==name)label.textContent=name;const small=c.querySelector('small');if(small&&small.textContent.includes('kills'))small.textContent=small.textContent.replace('kills','eliminaciones');});$$('#tbl-armas .player-link[data-player]').forEach(p=>{if(!p.querySelector('img'))p.prepend(portrait(p.dataset.player,'pv-table-photo'));});}
  labels();new MutationObserver(labels).observe($('#panel-armas'),{subtree:true,childList:true});
}
function mapArtwork(value){
  const name=String(value).toLowerCase();
  if(/snow|winter|blizzard|verschneit|schlitt|christmas|weihnacht/.test(name))return ['nieve','Nieve'];
  if(/harbor|harbour|port|ship|dock|river|aqu[ae]duct|dieppe|oil_rig|bizerte|amsterdam/.test(name))return ['puerto','Puerto y agua'];
  if(/desert|dust|africa|alamein|bazaar|arab|arzew|malta|bizer|tunis/.test(name))return ['desierto','Desierto'];
  if(/forest|wood|pine|valley|hill|park|camp|invasi[oó]n|battlefield/.test(name))return ['bosque','Bosque'];
  if(/village|dorf|town|yvette|vigne|castle|castello|gatehouse|campagne|rural|1944|caskami/.test(name))return ['pueblo','Pueblo'];
  return ['ciudad','Ciudad'];
}
function maps(){
  const root=$('#panel-mapas'),select=$('#mapSelect'),toolbar=root.querySelector('.toolbar');const search=element('input');search.placeholder='Buscar mapa…';search.setAttribute('aria-label','Buscar mapa');toolbar.prepend(search);
  const grid=element('div','pv-map-grid'),more=button('Ver más mapas',()=>{limit+=16;render();});let limit=16;const disclaimer=element('p','pv-map-disclaimer','Las miniaturas son ilustraciones ambientales; no son capturas exactas de cada mapa.');root.querySelector('#mapResult').before(disclaimer,grid,more);
  function render(){const options=[...select.options].filter(o=>o.textContent.toLowerCase().includes(search.value.toLowerCase())&&(!window.mb58MapFilter||window.mb58MapFilter(o.value)));grid.replaceChildren();options.slice(0,limit).forEach(o=>{const card=element('button','pv-map-card');card.type='button';card.setAttribute('aria-pressed',String(select.value===o.value));const art=element('div','pv-map-art'),[kind,label]=mapArtwork(o.value);const img=element('img','pv-map-thumb');img.src='assets/arte/mapa-'+kind+'-v1.webp';img.alt='Ilustración ambiental: '+label+'. No es una captura de '+o.textContent;img.loading='lazy';img.decoding='async';img.width=720;img.height=450;art.append(img,element('span','pv-map-kind',label+' · Ilustración'));card.append(art,element('strong','',o.textContent),element('small','','Ver estadísticas del mapa'));card.onclick=()=>{select.value=o.value;select.dispatchEvent(new Event('change',{bubbles:true}));};grid.append(card);});if(!options.length)grid.append(element('p','pv-map-empty','No se encontraron mapas.'));more.hidden=options.length<=limit;}
  search.oninput=()=>{limit=16;render();};select.addEventListener('change',render);render();
}
function guide(){const root=$('#panel-guia');const steps=element('div','pv-steps');[['Instala MOHAA','Sigue las instrucciones y enlaces originales de instalación.'],['Conecta al servidor','Entra al servidor comunitario con la dirección indicada en Inicio.'],['Verifica tu nick','Consulta el proceso de verificación para participar en torneos.']].forEach((s,i)=>{const step=element('div','pv-step');step.innerHTML='<b>'+(i+1)+'</b><h3>'+s[0]+'</h3><p>'+s[1]+'</p>';steps.append(step);});root.querySelector('.pv-heading').after(steps);let install;[...root.children].filter(n=>n.classList.contains('guide-card')).forEach(card=>{const title=card.querySelector('.modal-section-title');const isInstall=/instalación/i.test(title?.textContent||'');const details=accordion(card,title?.textContent||'Información del jugador',isInstall);if(isInstall)install=details;if(title)title.hidden=true;});if(install)steps.after(install);}
function achievements(){const root=$('#panel-logros-premios'),input=element('input','pv-ach-search');input.placeholder='Buscar logro…';input.setAttribute('aria-label','Buscar logro por nombre o descripción');root.querySelector('.ach-legend').before(input);const cards=[...root.querySelectorAll('.ach-card')];cards.forEach(c=>{const icon=c.querySelector('.ach-icon');if(icon){icon.replaceChildren(element('span','pv-medal',icon.textContent.trim()||'🏅'));}});input.oninput=()=>cards.forEach(c=>c.classList.toggle('pv-search-hidden',!c.textContent.toLowerCase().includes(input.value.toLowerCase())));}
function saturdays(){const root=$('#panel-sabados'),banner=element('div','pv-sat-banner');banner.innerHTML='<h3>Duelo por Equipos (TDM)</h3><p>Aliados contra Eje todos los sábados: jornadas, marcador por equipos y ranking de jugadores.</p>';root.querySelector('.pv-heading').after(banner);const toolbar=element('div','toolbar');banner.after(toolbar);toggleColumns(root,toolbar);root.querySelectorAll('.player-link[data-player]').forEach(p=>{if(!p.querySelector('img'))p.prepend(portrait(p.dataset.player,'pv-table-photo'));});const intro=[...root.children].find(n=>n.tagName==='DIV'&&!n.className&&n.textContent.includes('Todos los sábados'));if(intro)accordion(intro,'Cómo se juega Duelo por Equipos');
  // Cada jornada mantiene sus tablas y sus datos; se agrupa sólo el historial.
  const rules=root.querySelector(':scope>.torneo-intro');if(rules)accordion(rules,'Cómo se juega Duelo por Equipos');[...root.querySelectorAll(':scope > details')].forEach(d=>d.classList.add('pv-accordion'));
}
function tournament(data){const root=$('#panel-torneo'),rules=root.querySelector('.prize-banner');if(rules)accordion(rules,'Cómo clasificar · Reglas del torneo');
  const hero=element('div','pv-tournament-hero');const status=data.torneoTerminado?'Torneo finalizado':data.torneoPausado?'Torneo en pausa':data.torneoActivo?'Torneo activo':'Calendario del torneo';hero.innerHTML='<span class="pv-status">'+status+'</span><h3>Gran final · Gun Game / Battle Royale</h3><p>Consulta la fecha, los clasificados y los resultados de la edición actual.</p>';
  root.querySelector('.pv-heading').after(hero);const phases=element('div','pv-phases');phases.innerHTML='<span>1 · Clasificación</span><span>2 · Final</span><span>3 · Campeón</span>';hero.after(phases);
  const calendar=[...root.querySelectorAll(':scope>.torneo-day-card')].find(c=>/Calendario del Torneo/i.test(c.textContent));if(calendar)accordion(calendar,'Calendario de la edición');const list=root.querySelector('.torneo-days-list');if(list){const cards=[...list.children];cards.slice(1).forEach(c=>accordion(c,c.querySelector('.torneo-day-title')?.textContent||'Resultados del día'));}
}
function agenda(){const root=$('#panel-agenda'),months=[...root.querySelectorAll('.cal-month')];if(!months.length)return;const intro=root.querySelector('.prize-banner,.torneo-intro,.guide-card');if(intro)accordion(intro,'Cómo funciona el calendario');const parent=months[0].parentElement;parent.classList.add('pv-calendars');let index=0;const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/La_Paz',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const match=months.findIndex(m=>[...m.querySelectorAll('.cal-cell[title]')].some(c=>c.title.startsWith(today.slice(0,7))));if(match>=0)index=match;
  const controls=element('div','pv-calendar-controls'),label=element('strong');label.setAttribute('aria-live','polite');const previous=button('← Anterior',()=>{index--;render();}),next=button('Siguiente →',()=>{index++;render();});controls.append(previous,label,next);parent.before(controls);
  function render(){months.forEach((m,i)=>m.hidden=i!==index);label.textContent=months[index].querySelector('.cal-month-title')?.textContent||'Calendario';previous.disabled=index===0;next.disabled=index===months.length-1;}
  render();const list=element('div','pv-event-list');const events=[...root.querySelectorAll('.cal-cell.cal-final[title]')].filter(c=>c.title>=today).slice(0,4);if(events.length){const first=events[0],hero=element('div','pv-tournament-hero');hero.innerHTML='<span class="pv-status">Próximo evento</span><h3>Gran final · Gun Game / Battle Royale</h3><p>'+esc(new Date(first.title+'T12:00:00-04:00').toLocaleDateString('es-BO',{weekday:'long',day:'numeric',month:'long',timeZone:'America/La_Paz'}))+' · Hora de Bolivia</p>';const detail=button('Ver horario y detalles',()=>first.click());detail.style.marginTop='16px';hero.append(detail);root.querySelector('.pv-heading').after(hero);list.append(element('h3','pv-section','Próximas finales'));events.forEach(c=>{const row=element('button','pv-event');row.type='button';const date=new Date(c.title+'T12:00:00-04:00').toLocaleDateString('es-BO',{day:'numeric',month:'long',year:'numeric',timeZone:'America/La_Paz'});row.innerHTML='<strong>'+esc(date)+'</strong><span>Final del torneo<small>Ver detalle y horario · Hora de Bolivia</small></span>';row.onclick=()=>c.click();list.append(row);});parent.after(list);}
}
function winners(){const root=$('#panel-ganadores');const ongoing=root.querySelector(':scope>.torneo-day-card');if(ongoing){const host=$('#panel-torneo');host.querySelector('.pv-heading').after(ongoing);}
  const rows=[...root.querySelectorAll('.ganador-item')];rows.forEach(row=>{const name=row.querySelector('.ganador-nombre')?.textContent;if(name){row.querySelector('.ganador-medal')?.replaceWith(portrait(name,'pv-winner-photo'));}});const latest=rows[0];if(!latest)return;const name=latest.querySelector('.ganador-nombre').textContent;const hero=element('div','pv-champion'),body=element('div');body.append(element('span','pv-status','Último campeón'),element('h3'));body.lastChild.append(playerLink(name));body.append(element('p','',latest.querySelector('.ganador-torneo')?.textContent),element('p','',latest.querySelector('.ganador-fecha')?.textContent));hero.append(portrait(name),body);root.querySelector('.pv-heading').after(hero);root.querySelector('.ganadores-list').before(element('h3','pv-section','Historial de ganadores'));}
async function init(){
  navigation();
  [['ranking','Ranking general','La clasificación por victorias. Abre un jugador para consultar su perfil completo.'],['armas','Ranking por arma','Selecciona una categoría y descubre sus mejores jugadores.'],['mapas','Explorar mapas','Busca un escenario y consulta sus estadísticas reales.'],['duelos','Cara a cara','Todo el historial de enfrentamientos entre dos jugadores.'],['duelospriv','Duelos privados','Resultados del server de Duelos 1 vs 1: duelo del día, ranking de duelistas e historial.'],['guia','Empieza a jugar','Instalación, conexión y reglas de la comunidad.'],['logros-premios','Logros del servidor','Explora los niveles y los requisitos para conseguir cada logro.'],['sabados','Sábados por equipos','Duelo por Equipos (TDM Allies vs Axis): jornadas y ranking.'],['torneo','Torneo MOHAA','Clasificados, resultados y reglas de la edición actual.'],['agenda','Agenda de torneos','Consulta las fechas y abre cada evento para ver sus detalles.'],['ganadores','Campeones del servidor','Los ganadores y premios de cada edición.']].forEach(args=>heading(...args));
  ranking();duels();maps();guide();achievements();saturdays();agenda();
  try{const response=await fetch('stats.json');if(!response.ok)throw new Error('No se pudieron cargar los datos');const data=await response.json();weapons(data.players||[]);tournament(data);winners();}catch(error){console.error('No se pudo completar el diseño:',error);}
  // Enlaces directos para revisar una pestaña sin cambiar el contenido publicado.
  function hashTab(){const tab=location.hash.slice(1);if(tab)$('.tab-btn[data-tab="'+CSS.escape(tab)+'"]')?.click();}
  hashTab();window.addEventListener('hashchange',hashTab);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

}catch(e){console.error("mb-todo: mb-v29-redesign.js",e)}
try{
(()=>{'use strict';
const $=s=>document.querySelector(s);
const make=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
let catalog={},queued=false,dialog=null,dialogTitle=null,previousOverflow='';
const key=id=>String(id||'').trim().toLowerCase();
function openMap(){if(!dialog)return;const select=$('#mapSelect'),entry=catalog[key(select.value)];dialogTitle.textContent=entry?.name||select.selectedOptions[0]?.textContent||'Estadísticas del mapa';if(!dialog.open){previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();dialog.querySelector('.mb31-dialog-body').scrollTop=0;}}
function setupDialog(root){dialog=make('dialog','mb31-map-modal');dialog.id='mapStatsDialog';dialog.setAttribute('aria-labelledby','mapStatsDialogTitle');const header=make('header','mb31-dialog-header');dialogTitle=make('h2','','Estadísticas del mapa');dialogTitle.id='mapStatsDialogTitle';const close=make('button','mb31-dialog-close','✕');close.type='button';close.setAttribute('aria-label','Cerrar estadísticas del mapa');close.autofocus=true;close.onclick=()=>dialog.close();header.append(dialogTitle,close);const body=make('div','mb31-dialog-body');body.append($('#mapResult'));dialog.append(header,body);root.append(dialog);dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;});dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});root.addEventListener('click',event=>{if(event.target.closest('.pv-map-card'))openMap();});document.addEventListener('click',event=>{if(event.target.closest('.tab-btn')&&dialog.open)dialog.close();});}
function photo(entry){const img=make('img','pv-map-thumb');img.src=entry.image;img.alt=(entry.type==='capture'?'Imagen real del juego: ':'Ilustración inspirada en el nombre: ')+entry.name;img.loading='lazy';img.decoding='async';img.width=entry.width||720;img.height=entry.height||450;return img;}
function enhance(){queued=false;const select=$('#mapSelect'),grid=$('.pv-map-grid');if(!select||!grid)return;const names=new Map([...select.options].map(o=>[o.textContent.trim(),o.value]));
 grid.querySelectorAll('.pv-map-card').forEach(card=>{const name=card.querySelector('strong')?.textContent.trim(),id=names.get(name),entry=catalog[key(id)];if(!entry||card.dataset.mb30Map===id)return;card.dataset.mb30Map=id;
  const art=card.querySelector('.pv-map-art');if(art){art.replaceChildren(photo(entry),make('span','pv-map-kind',entry.type==='capture'?'Captura':'Ilustración'));}
  const wrapper=make('div','mb30-map-entry '+(entry.type==='capture'?'mb30-capture':'mb30-generated'));card.before(wrapper);wrapper.append(card);card.setAttribute('aria-haspopup','dialog');card.setAttribute('aria-controls','mapStatsDialog');
 });
 const detail=$('#mapResult'),selected=catalog[key(select.value)];if(detail&&selected&&!detail.querySelector('.mb30-map-detail')){const figure=make('figure','mb30-map-detail '+(selected.type==='capture'?'mb30-capture':'mb30-generated'));figure.append(photo(selected));const caption=make('figcaption');caption.append(make('strong','',selected.name),make('span','',selected.type==='capture'?'Captura o pantalla de carga del juego':'Ilustración creada a partir del nombre del mapa'));figure.append(caption);detail.prepend(figure);}
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(enhance);}}
async function start(){const root=$('#panel-mapas');if(!root)return;try{const response=await fetch('assets/mapas/catalogo.json?v=55');if(!response.ok)throw Error('HTTP '+response.status);const data=await response.json();catalog=data.maps||{};for(const [id,img] of Object.entries(window.MB_ADMIN_PUBLIC?.imagenes?.mapas||{})){catalog[key(id)]={...(catalog[key(id)]||{name:id}),image:img.src,type:img.tipo};}setupDialog(root);root.dataset.mb30Catalog='ready';const note=root.querySelector('.pv-map-disclaimer');if(note)note.textContent='Selecciona un mapa para abrir su imagen y estadísticas. Las imágenes creadas se identifican con la etiqueta «Ilustración».';enhance();new MutationObserver(schedule).observe(root.querySelector('.pv-map-grid'),{childList:true,subtree:true});new MutationObserver(schedule).observe($('#mapResult'),{childList:true});$('#mapSelect').addEventListener('change',()=>{schedule();openMap();});}catch(error){console.warn('No se pudo cargar el catálogo de imágenes de mapas:',error);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

}catch(e){console.error("mb-todo: mb-v30-mapas.js",e)}
try{
(()=>{'use strict';
const $=s=>document.querySelector(s),num=n=>Number(n||0).toLocaleString('es-BO');
const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
const norm=s=>String(s||'').toLowerCase().replace(/<[^>]*>/g,m=>m.slice(1,-1)).replace(/[^a-z0-9.]/g,'');
const weaponSpecs=[['Bash','culata','Culata'],['Pistol','pistola','Pistola'],['Shotgun','escopeta','Escopeta'],['SMG','subfusil','Subfusil'],['Rifle','rifle','Rifle'],['Sniper','francotirador','Francotirador'],['MG','ametralladora','Ametralladora'],['Bazooka','lanzacohetes','Lanzacohetes']];
const zones={'head':'Cabeza','upper torso':'Torso superior','lower torso':'Torso inferior','middle torso':'Torso medio','neck':'Cuello','pelvis':'Pelvis','upper right arm':'Brazo derecho','upper left arm':'Brazo izquierdo','lower right arm':'Antebrazo derecho','lower left arm':'Antebrazo izquierdo','right hand':'Mano derecha','left hand':'Mano izquierda','upper right leg':'Muslo derecho','upper left leg':'Muslo izquierdo','lower right leg':'Pierna derecha','lower left leg':'Pierna izquierda','right foot':'Pie derecho','left foot':'Pie izquierdo'};
let players=new Map(),pendingName='',scheduled=false;
document.addEventListener('click',event=>{const target=event.target.closest('.player-link[data-player]');if(target)pendingName=target.dataset.player;},true);
function metrics(items,cls='mb32-metrics'){const grid=make('div',cls);for(const [label,value,note] of items){const card=make('div','mb32-metric');card.append(make('span','mb32-label',label),make('strong','',String(value)));if(note)card.append(make('small','',note));grid.append(card);}return grid;}
function details(node,label){const wrap=make('details','mb32-details');wrap.append(make('summary','',label));node.before(wrap);wrap.append(node);return wrap;}
function intro(panel,title,description){const h=make('header','mb32-section-heading');h.append(make('h3','',title),make('p','',description));panel.prepend(h);return h;}
function summary(panel,p){if(!panel||panel.dataset.mb32)return;panel.dataset.mb32='ready';const first=panel.querySelector(':scope>.stat-grid');if(first)details(first,'Estadísticas completas · humanos y bots');const title=[...panel.querySelectorAll(':scope>.modal-section-title')].find(t=>/medallas/i.test(t.textContent));const medalGrid=title?.nextElementSibling;if(medalGrid?.classList.contains('stat-grid')){const wrap=details(medalGrid,'Medallas de combate · humanos y bots');title.remove();}
 const lead=intro(panel,'Tu rendimiento','El resumen competitivo cuenta los enfrentamientos contra jugadores humanos.');const primary=metrics([['Eliminaciones',num(p.kills),'contra humanos'],['K/D',p.kd??'0','eliminaciones / muertes'],['Victorias',num(p.wins),'mapas ganados'],['Porcentaje de victorias',(p.winRate??0)+'%','sobre partidas jugadas']]);lead.after(primary);
 const best=weaponSpecs.slice().sort((a,b)=>Number(p.weapons?.[b[0]]||0)-Number(p.weapons?.[a[0]]||0))[0];const highlights=metrics([['Mejor racha',num(p.bestStreak),'incluye humanos y bots'],['Arma más utilizada',Number(p.weapons?.[best[0]]||0)>0?best[2]:'Sin datos','según eliminaciones totales'],['Logros',num(p.achievementsUnlocked)+' / '+(p.achievements?.length||0),'desbloqueados']],'mb32-highlights');primary.after(highlights);
}
function activity(panel,p){if(!panel||panel.dataset.mb32)return;panel.dataset.mb32='ready';const blocks=make('div','mb32-activity-panels');let current=null;for(const node of [...panel.children]){if(node.classList.contains('modal-section-title')){if(/semanal/i.test(node.textContent))node.textContent='Progreso semanal · eliminaciones por día';else if(/actividad por hora/i.test(node.textContent))node.textContent='Actividad por hora';current=make('section','mb32-surface');blocks.append(current);}if(current)current.append(node);else blocks.append(node);}if((p.weeklyKillHistory||[]).every(d=>!Number(d.kills))&&current)current.append(make('p','mb32-note','Sin eliminaciones registradas en este periodo.'));panel.append(blocks);const lead=intro(panel,'Tu actividad','Horas de juego y evolución de las eliminaciones registradas.');lead.after(metrics([['Sesiones',num(p.sessions)],['Días con actividad',num(p.activeDaysCount)],['Hora más frecuente',p.favoriteHour||'Sin datos']],'mb32-highlights'));}
function weapons(panel,p,body){if(!panel)return;const box=body.querySelector('.mb18-player-weapons');if(!box)return;if(box.parentElement!==panel)panel.prepend(box);if(box.dataset.mb32)return;box.dataset.mb32='ready';box.classList.add('mb32-arsenal');const rows=weaponSpecs.map(w=>({key:w[0],file:w[1],label:w[2],kills:Number(p.weapons?.[w[0]]||0)})).sort((a,b)=>b.kills-a.kills);const total=rows.reduce((s,r)=>s+r.kills,0);box.replaceChildren();const lead=make('header','mb32-section-heading');lead.append(make('h3','','Tu arsenal'),make('p','',num(total)+' eliminaciones registradas con armas · humanos y bots.'));box.append(lead);const grid=make('div','mb32-weapons-grid');rows.forEach((r,i)=>{const card=make('article','mb32-weapon-card'+(i===0&&r.kills?' mb32-favorite':''));card.dataset.weapon=r.key;card.dataset.kills=r.kills;const img=make('img');img.src='assets/perfiles-armas/'+r.file+'.webp';img.alt=r.label+' · ilustración de categoría';img.loading='lazy';img.width=720;img.height=450;const percent=total?100*r.kills/total:0;const track=make('div','mb32-track'),bar=make('i');bar.style.width=percent+'%';track.append(bar);card.append(img,make('h4','',r.label),make('strong','mb32-weapon-value',num(r.kills)),make('small','','eliminaciones'),track,make('span','mb32-share',percent.toLocaleString('es-BO',{maximumFractionDigits:1})+'% del arsenal'));if(i===0&&r.kills)card.prepend(make('span','mb32-favorite-label','Más utilizada'));grid.append(card);});box.append(grid);
 panel.querySelectorAll(':scope>.modal-cols').forEach(n=>n.remove());if(!panel.querySelector('.mb32-impact')){const impact=make('section','mb32-impact mb32-surface');impact.append(make('h3','','Zonas de impacto'),make('p','mb32-note','Distribución de impactos registrados, incluidos humanos y bots.'));const data=p.bodypartsList||[],sum=data.reduce((n,b)=>n+Number(b.kills||0),0),list=make('div','mb32-impact-grid');for(const z of data){const row=make('div','mb32-impact-row'),line=make('div');line.append(make('span','',zones[z.bodypart]||z.bodypart),make('strong','',num(z.kills)));const track=make('div','mb32-track'),bar=make('i');bar.style.width=(sum?100*Number(z.kills||0)/sum:0)+'%';track.append(bar);row.append(line,track);list.append(row);}if(!data.length)list.append(make('p','mb32-note','Todavía no hay impactos registrados.'));impact.append(list);panel.append(impact);}
}
function rivalList(rows,valueKey,empty){const list=make('div','mb32-rival-list');if(!rows.length){list.append(make('p','mb32-note',empty));return list;}rows.forEach((r,i)=>{const available=players.has(norm(r.name));const button=make(available?'button':'div','mb32-rival-row'+(available?' player-link':''));if(available){button.type='button';button.dataset.player=r.name;}else button.setAttribute('aria-disabled','true');const img=make('img');img.src='assets/avatar-m1.svg';img.dataset.mbPortraitPlayer=r.name;img.alt='Retrato de '+r.name;img.loading='lazy';const count=make('strong','',num(r[valueKey])),name=make('span','mb32-rival-name',r.name);if(!available)name.append(make('small','mb32-unavailable','Sin perfil'));button.append(make('span','mb32-rival-rank',String(i+1)),img,name,count);list.append(button);});return list;}
function rivals(panel,p){if(!panel||panel.dataset.mb32)return;panel.dataset.mb32='ready';panel.replaceChildren();intro(panel,'Tus enfrentamientos','Consulta tus rivales habituales o abre su perfil para conocerlos mejor.');const grid=make('div','mb32-rivals-grid');for(const [label,rows,field] of [['A quién eliminas más',p.victimsList||[],'kills'],['Quién te elimina más',p.killedByList||[],'deaths']]){const section=make('section','mb32-surface');section.append(make('h3','',label),make('p','mb32-note','Eliminaciones registradas en el historial'),rivalList(rows.slice(0,8),field,'Aún no hay enfrentamientos registrados.'));if(rows.length>8){const extra=make('details','mb32-details');extra.append(make('summary','','Ver los '+(rows.length-8)+' restantes'),rivalList(rows.slice(8),field,''));section.append(extra);}grid.append(section);}panel.append(grid);}
function achievements(panel,p){if(!panel||panel.dataset.mb32)return;panel.dataset.mb32='ready';const total=p.achievements?.length||0,unlocked=Number(p.achievementsUnlocked||0);const progress=make('section','mb32-achievement-progress');progress.append(make('span','mb32-label','Tu colección'),make('strong','',num(unlocked)+' de '+total+' logros'),make('p','mb32-note','Consulta los desbloqueados y los que todavía puedes conseguir.'));const track=make('div','mb32-track'),bar=make('i');bar.style.width=(total?Math.min(100,100*unlocked/total):0)+'%';track.append(bar);progress.append(track);panel.prepend(progress);}
function update(){scheduled=false;const overlay=$('#playerModal'),body=$('#modalBody');if(!overlay?.classList.contains('active')||!body)return;const header=body.querySelector('.profile-header');if(!header?.dataset.mb9done)return;const title=header.querySelector('h2');const p=players.get(norm(header.dataset.mb32Name||pendingName))||players.get(norm(title?.childNodes[0]?.textContent));if(!p)return;
 overlay.dataset.mb32='ready';if(!header.dataset.mb32Name){header.dataset.mb32Name=p.name;const badges=[...title.querySelectorAll('.verified-badge,.tier-master-badge')];title.replaceChildren(document.createTextNode(p.name+' '),...badges);const portrait=header.querySelector('.mb8-profile-portrait');if(portrait)portrait.dataset.mbPortraitPlayer=p.name;}
 const panels=new Map([...body.querySelectorAll('.mb9-panel')].map(n=>[n.dataset.section,n]));summary(panels.get('Resumen'),p);activity(panels.get('Actividad'),p);weapons(panels.get('Armas'),p,body);rivals(panels.get('Rivales'),p);achievements(panels.get('Logros'),p);
 for(const name of ['Mapas','Sábados']){const panel=panels.get(name);if(panel&&!panel.dataset.mb32){panel.dataset.mb32='ready';intro(panel,name==='Mapas'?'Rendimiento por escenario':'Juego por equipos',name==='Mapas'?'Eliminaciones, muertes y relación K/D de cada mapa.':'Tu historial en el Duelo por Equipos de los sábados.');}}
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
async function start(){try{const r=await fetch('stats.json');if(!r.ok)throw Error('HTTP '+r.status);const d=await r.json();players=new Map((d.players||[]).map(p=>[norm(p.name),p]));const body=$('#modalBody'),overlay=$('#playerModal');if(!body||!overlay)return;new MutationObserver(schedule).observe(body,{childList:true,subtree:true});new MutationObserver(schedule).observe(overlay,{attributes:true,attributeFilter:['class']});schedule();const requested=new URL(location.href).searchParams.get('jugador');if(requested){const link=[...document.querySelectorAll('#tbl-ranking .player-link[data-player]')].find(n=>n.dataset.player===requested);if(link){document.querySelector('.tab-btn[data-tab="ranking"]')?.click();link.click();}}}catch(error){console.warn('No se pudo preparar el nuevo perfil:',error);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

}catch(e){console.error("mb-todo: mb-v32-perfiles.js",e)}
try{
(()=>{'use strict';
const $=s=>document.querySelector(s),make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const number=n=>Number(n||0).toLocaleString('es-BO'),decimal=n=>Number(n).toLocaleString('es-BO',{maximumFractionDigits:2});
const date=d=>d?d.slice(8,10)+'/'+d.slice(5,7)+'/'+d.slice(0,4):'';
let data,players=new Map(),scheduled=false;
function records(){const host=$('#panel-inicio');if(!host||$('#mb40-records')||!data.communityRecords)return;const section=make('section','mb40-records');section.id='mb40-records';section.append(make('h3','','Récords de la comunidad'),make('p','mb40-note','Marcas históricas entre los jugadores publicados. Los empates comparten el récord.'));
const grid=make('div','mb40-record-grid');for(const r of data.communityRecords){const card=make('article','mb40-record-card');card.dataset.record=r.id;card.append(make('span','mb40-label',r.title),make('strong','mb40-record-value',r.value?number(r.value):'—'),make('span','mb40-note',r.unit));const names=make('div','mb40-holders');for(const name of r.holders||[]){const b=make('button','player-link');b.type='button';b.dataset.player=name;const img=make('img');img.src='assets/avatar-m1.svg';img.dataset.mbPortraitPlayer=name;img.alt='';img.loading='lazy';b.append(img,make('span','',name));names.append(b);}if(!r.holders?.length)names.append(make('span','mb40-note','Aún sin marca registrada'));card.append(names,make('small','mb40-scope',r.scope));grid.append(card);}section.append(grid);const anchor=$('#mb15-hub');if(anchor)anchor.after(section);else host.append(section);
const rank=$('#panel-ranking .pv-heading');if(rank&&!$('#mb40-rank-note')){const note=make('p','mb40-note');note.id='mb40-rank-note';note.textContent=data.rankChangeMeta?.available?'Variación de posición desde el '+date(data.rankChangeMeta.referenceDate)+', con el mismo criterio de victorias y eliminaciones.':'Las flechas de posición aparecerán cuando haya 7 días de registros comparables. El orden sigue siendo por victorias y eliminaciones contra humanos.';rank.after(note);}
}
function recent(panel,p){if(!panel||panel.querySelector('.mb40-recent')||!p.recentPerformance)return;const section=make('section','mb40-recent');section.append(make('h3','','Rendimiento reciente'));const tabs=make('div','mb40-periods'),content=make('div','mb40-period-content');tabs.setAttribute('aria-label','Periodo del rendimiento');const buttons=[];function draw(days){const period=p.recentPerformance.periods[days],current=period.current,previous=period.previous;buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.days)===days)));content.replaceChildren();content.append(make('p','mb40-date',date(current.from)+' — '+date(current.to)+' · incluye hoy en curso'));const grid=make('div','mb40-recent-grid');for(const [key,label]of [['kills','Eliminaciones'],['deaths','Muertes'],['kd','K/D'],['wins','Victorias']]){const card=make('div','mb40-recent-metric');card.dataset.metric=key;const value=!current.available?'—':key==='kd'?(current.kd===null?'—':decimal(current.kd)):number(current[key]);card.append(make('span','mb40-label',label),make('strong','',value));if(!current.available)card.append(make('small','mb40-note','Historial insuficiente para este periodo'));else if(key==='kd'&&current.kd===null)card.append(make('small','mb40-note','Sin muertes registradas'));if(current.available&&previous.available){const old=key==='kd'?(previous.kd===null?'—':decimal(previous.kd)):number(previous[key]);card.append(make('small','mb40-note','Periodo anterior: '+old));const change=period.change?.[key];if(change!==null&&change!==undefined){const line=make('small','mb40-change',change===0?'Sin cambio':(change>0?'+':'')+decimal(change)+' respecto al anterior');if(change!==0)line.dataset.direction=((key==='deaths'?change<0:change>0)?'up':'down');card.append(line);}}else if(current.available)card.append(make('small','mb40-note','Sin periodo anterior comparable'));grid.append(card);}content.append(grid);if(previous.available)content.append(make('p','mb40-note','Comparación: '+date(previous.from)+' — '+date(previous.to)));}
for(const days of [7,30]){const b=make('button','',days+' días');b.type='button';b.dataset.days=days;b.onclick=()=>draw(days);buttons.push(b);tabs.append(b);}section.append(tabs,content,make('p','mb40-method','Combate contra humanos con fecha registrada. Días de calendario de Bolivia; puede haber diferencias con los acumulados históricos.'));const lead=panel.querySelector('.mb32-section-heading');if(lead)lead.after(section);else panel.prepend(section);draw(7);
}
function weekly(panel,p){if(!panel||panel.dataset.mb40Weekly||!p.weeklyKillHistory)return;const block=[...panel.querySelectorAll('.mb32-activity-panels .mb32-surface')].find(e=>/Progreso semanal/i.test(e.querySelector('.modal-section-title')?.textContent||''));if(!block)return;panel.dataset.mb40Weekly='ready';block.replaceChildren(make('h3','','Progreso semanal · eliminaciones por día de juego'));const graph=make('div','mb40-week');const max=Math.max(1,...p.weeklyKillHistory.map(d=>d.kills||0));for(const d of p.weeklyKillHistory){const column=make('div','mb40-week-column'),bar=make('div','mb40-week-bar');const available=d.available!==false&&d.kills!==null;bar.style.height=(available?Math.max(3,100*d.kills/max):3)+'%';if(!available)bar.dataset.missing='true';column.title=date(d.date)+(available?' · '+number(d.kills)+' eliminaciones':' · Sin referencia diaria');const track=make('div','mb40-week-track');track.append(bar);column.append(make('strong','',available?number(d.kills):'—'),track,make('span','',d.date.slice(8)+'/'+d.date.slice(5,7)));graph.append(column);}block.append(graph,make('p','mb40-note','Día de juego: 09:00 a 09:00 de Bolivia. «—» indica que falta una referencia diaria; no significa cero. El día actual está en curso.'));
}
function rules(){if(!data.competitiveRules)return;for(const id of ['ranking','guia']){const root=$('#panel-'+id);if(!root||root.querySelector('.mb42-rules'))continue;const box=make('details','mb42-rules'),summary=make('summary','','Cómo se cuentan las victorias');box.append(summary);const since=data.competitiveRules.effectiveAt;box.append(make('p','', 'Para mapas iniciados desde el '+date(since.slice(0,10))+' a las '+since.slice(11,16)+' · hora de Bolivia.'));
const list=make('ul');for(const text of ['En FFA gana quien consigue más eliminaciones contra humanos. Las bajas a bots no deciden ni bloquean al ganador.','Debe terminar el mapa y haber al menos dos humanos que coincidan conectados y participen en combate. Una partida en curso o un apagado a mitad no concede victoria.','Si varios jugadores empatan en la mayor cantidad de bajas humanas, comparten la victoria. Sin bajas humanas no hay ganador FFA.','Gun Game mantiene su regla: gana quien completa el recorrido de armas, con competencia humana.','El ranking competitivo se ordena por victorias contra humanos y usa las bajas humanas como desempate.'])list.append(make('li','',text));box.append(list);const heading=root.querySelector('.pv-heading');if(heading)heading.after(box);else root.prepend(box);}}
function update(){scheduled=false;if(!data)return;records();rules();const body=$('#playerModal.active #modalBody'),header=body?.querySelector('.profile-header');if(!body||!header?.dataset.mb32Name)return;const p=players.get(header.dataset.mb32Name);if(!p)return;const panel=body.querySelector('.mb9-panel[data-section="Actividad"]');if(panel?.dataset.mb32){recent(panel,p);weekly(panel,p);}}
function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
async function start(){try{const r=await fetch('stats.json');if(!r.ok)throw Error('HTTP '+r.status);data=await r.json();players=new Map((data.players||[]).map(p=>[p.name,p]));new MutationObserver(queue).observe(document.body,{subtree:true,childList:true});queue();}catch(e){console.warn('No se pudieron cargar las estadísticas recientes:',e);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

}catch(e){console.error("mb-todo: mb-v40-estadisticas.js",e)}
try{
(()=>{'use strict';
const $=s=>document.querySelector(s),make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;},num=n=>Number(n||0).toLocaleString('es-BO'),date=d=>d?d.slice(8,10)+'/'+d.slice(5,7)+'/'+d.slice(0,4):'Sin datos';
let data,mode='competitive',tableBody,period,title,podium,historyTable,toolbar,empty,homePodium;
function rows(){return data.competitiveRanking?.players||[];}
function photo(name,cls){const img=make('img',cls);img.src='assets/avatar-m1.svg';img.dataset.mbPortraitPlayer=name;img.alt='Retrato de '+name;img.loading='lazy';return img;}
function medals(host){host.replaceChildren();const players=rows().slice(0,3);for(const i of [1,0,2]){const p=players[i];if(!p)continue;const card=make('div','mb8-medal player-link '+['first','second','third'][i]);card.dataset.player=p.name;card.tabIndex=0;card.setAttribute('role','button');card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}};const face=make('div','mb8-face');face.dataset.mbPortraitPlayer=p.name;card.append(face,make('div','rank','#'+p.rank),make('strong','',p.name),make('span','',num(p.wins)+' victorias'+(mode==='competitive'?' competitivas':'')));host.append(card);}}
function filter(){if(!tableBody)return;const query=($('#search')?.value||'').toLocaleLowerCase();let visible=0;for(const row of tableBody.children){row.hidden=!row.dataset.name.includes(query);if(!row.hidden)visible++;}empty.hidden=visible>0;}
function showRanking(){mode='competitive';document.body.dataset.mb45Mode=mode;try{sessionStorage.removeItem('mb45-ranking-mode');}catch{}historyTable.hidden=true;$('#mb45-competitive-table').hidden=false;if(toolbar)for(const b of toolbar.querySelectorAll('button'))b.hidden=true;
title.textContent='Competitivo · Registros del '+date(data.competitiveRanking.from)+' al '+date(data.competitiveRanking.through);period.textContent='El ranking competitivo se ordena por victorias en los mapas. Cada mapa lo gana quien consigue más eliminaciones contra otros jugadores humanos. Los bots no cuentan para decidir la victoria. A igual número de victorias, el desempate usa las eliminaciones humanas acumuladas.';
$('#mb45-coverage').textContent='A igual número de victorias, se desempata por eliminaciones contra jugadores humanos.';
medals(podium);if(homePodium){medals(homePodium);const h=homePodium.closest('.mb8-card')?.querySelector('.mb8-hd b');if(h)h.textContent='🏆 Top 3 · Competitivo';}
}
function profilePosition(){const header=$('#playerModal.active .profile-header'),name=header?.dataset.mb32Name;if(!name||header.dataset.mb46Rank)return;const p=rows().find(p=>p.name===name),panel=$('#playerModal.active .mb9-panel[data-section="Resumen"]');if(!p||!panel?.dataset.mb32)return;header.dataset.mb46Rank='ready';const badge=header.querySelector('.rank-badge');if(badge){badge.textContent='#'+p.rank;badge.title='Puesto en el ranking competitivo';}panel.prepend(make('p','mb46-profile-note','Puesto competitivo #'+p.rank+' · '+num(p.wins)+' victorias competitivas.'));}
async function start(){try{const r=await fetch('stats.json');if(!r.ok)throw Error('HTTP '+r.status);data=await r.json();if(!data.competitiveRanking?.available)return;const root=$('#panel-ranking'),table=$('#tbl-ranking');if(!root||!table)return;historyTable=table.closest('.table-scroll');toolbar=root.querySelector('.toolbar');root.classList.add('mb45-rankings');const h=root.querySelector('.pv-heading h2');if(h)h.textContent='Ranking de jugadores';const desc=root.querySelector('.pv-heading p');if(desc)desc.textContent='Clasificación por victorias competitivas contra jugadores humanos.';const old=[...root.children].find(e=>e.textContent.includes('Este ranking se ordena por'));if(old)old.hidden=true;
const note=make('div','mb45-period');title=make('strong');period=make('p');note.append(title,period);podium=make('div','mb45-podium');podium.setAttribute('aria-label','Podio del ranking competitivo');toolbar.before(note,podium);
const container=make('div','table-scroll mb45-competitive-table');container.id='mb45-competitive-table';const t=make('table');t.id='tbl-competitivo';const thead=make('thead'),tr=make('tr');for(const label of ['#','Jugador','Victorias'])tr.append(make('th','',label));thead.append(tr);tableBody=make('tbody');for(const p of data.competitiveRanking.players){const row=make('tr');row.dataset.name=p.name.toLocaleLowerCase();const cell=make('td'),b=make('button','player-link');b.type='button';b.dataset.player=p.name;b.append(photo(p.name,'mb45-table-photo'),make('span','',p.name));cell.append(b);row.append(make('td','',String(p.rank)),cell,make('td','',num(p.wins)));tableBody.append(row);}t.append(thead,tableBody);container.append(t);historyTable.after(container);empty=make('p','mb40-note','No hay jugadores con ese nombre.');empty.hidden=true;container.append(empty);const coverage=make('p','mb45-coverage');coverage.id='mb45-coverage';container.after(coverage);$('#search')?.addEventListener('input',filter);
homePodium=$('#panel-inicio .mb8-podium');const homeTable=$('#panel-inicio .mb8-rank-table');if(homeTable){const card=homeTable.closest('.mb8-card'),label=card.querySelector('.mb8-hd b'),button=card.querySelector('[data-mbtab="ranking"]');if(label)label.textContent='📊 Ranking competitivo';if(button)button.textContent='Ver ranking completo →';const head=homeTable.querySelector('thead tr');head.replaceChildren(...['#','Jugador','Victorias'].map(t=>make('th','',t)));const body=homeTable.querySelector('tbody');body.replaceChildren();for(const p of rows().slice(0,10)){const row=make('tr'),cell=make('td'),link=make('button','player-link');link.type='button';link.dataset.player=p.name;link.append(photo(p.name,'mb45-table-photo'),make('span','',p.name));cell.append(link);row.append(make('td','',String(p.rank)),cell,make('td','',num(p.wins)));body.append(row);}}showRanking();filter();new MutationObserver(()=>requestAnimationFrame(profilePosition)).observe($('#modalBody'),{childList:true,subtree:true});profilePosition();
}catch(e){console.warn('No se pudo mostrar la clasificación competitiva:',e);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

}catch(e){console.error("mb-todo: mb-v45-rankings.js",e)}
try{
(()=>{'use strict';function filter(root){const name=root.querySelector('[data-mb49-search]').value.toLocaleLowerCase().trim(),level=root.querySelector('[data-mb49-level]').value,category=root.querySelector('[data-mb49-category]').value;let count=0;root.querySelectorAll('.mb49-player').forEach(p=>{p.hidden=!(p.dataset.name.includes(name)&&(level==='all'||p.dataset.level===level)&&(category==='all'||p.dataset.categories.split(' ').includes(category)));if(!p.hidden)count++;});root.querySelector('.mb49-count').textContent=count+' jugadores';root.querySelector('.mb49-empty').hidden=count>0;}
document.addEventListener('input',e=>{const root=e.target.closest('.mb49-detector');if(root&&e.target.matches('[data-mb49-search]'))filter(root);});document.addEventListener('change',e=>{const root=e.target.closest('.mb49-detector');if(root&&e.target.matches('select'))filter(root);});
function plain(node){const copy=node.cloneNode(true);copy.querySelectorAll('p,summary,h4,pre,small,strong').forEach(e=>e.append(document.createTextNode('\n')));return copy.textContent;}
document.addEventListener('click',e=>{if(!e.target.closest('[data-mb49-export]'))return;const root=e.target.closest('.mb49-detector'),players=[...root.querySelectorAll('.mb49-player:not([hidden])')];const report='INFORME PRIVADO DE REVISIÓN — MOHAA BOOT\n'+new Date().toLocaleString('es-BO')+'\nIndicios, no confirmación de trampas.\n\n'+plain(root.querySelector('.mb49-coverage'))+'\n\n'+players.map(plain).join('\n\n--------------------\n\n');const url=URL.createObjectURL(new Blob([report],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='revision-privada-jugadores.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});})();

}catch(e){console.error("mb-todo: mb-v49-detector.js",e)}
try{
(()=>{'use strict';
const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;},nf=n=>Number(n||0).toLocaleString('es-BO');let players=new Map(),queued=false;
function insignia(p,cls){const i=make('img',cls);i.src='assets/rangos-eb/'+p.id+'.svg';i.alt='';i.setAttribute('aria-hidden','true');i.width=20;i.height=40;return i;}
function decorate(link,p){if(link.dataset.mb52===p.id||link.closest('.mb52-profile'))return;
 if(link.classList.contains('mb8-medal')){const strong=link.querySelector('strong');if(!strong)return;const line=make('div','mb52-podium-grade');line.append(insignia(p,'mb52-mini'),make('span','',p.name));strong.after(line);link.dataset.mb52=p.id;return;}
 let name=[...link.children].find(e=>e.children.length===0&&e.textContent.trim()===p.player&&!e.classList.contains('mb52-info'));
 if(!name){const node=[...link.childNodes].find(n=>n.nodeType===3&&n.textContent.trim()===p.player);if(node){name=make('span','',node.textContent.trim());node.replaceWith(name);}}
 if(!name)return;const text=make('span','mb52-info'),label=make('small','mb52-grade-label',p.name);name.before(text);text.append(name,label);text.before(insignia(p,'mb52-mini'));link.dataset.mb52=p.id;link.title=p.name+' · '+nf(p.points)+' puntos de grado';}
function profile(){const header=document.querySelector('#playerModal.active .profile-header[data-mb32-name]');if(!header||header.dataset.mb52Profile)return;const p=players.get(header.dataset.mb32Name),host=header.querySelector('.mb8-head-main');if(!p||!host)return;
 const card=make('section','mb52-profile');card.setAttribute('aria-label','Grado militar y progreso');const img=insignia(p,'mb52-large');img.width=57;img.height=120;const info=make('div','mb52-profile-info');info.append(make('small','mb52-eyebrow','Grado del Ejército de Bolivia'),make('strong','mb52-profile-grade',p.name),make('span','mb52-points',nf(p.points)+' puntos · '+nf(p.competitiveWins)+' victorias competitivas'));
 if(p.next){info.append(make('span','mb52-next','Próximo: '+p.next.name+' · '+nf(p.next.points)+' puntos'+(p.next.wins?' y '+nf(p.next.wins)+' victorias':'')));const track=make('div','mb52-progress'),bar=make('i');bar.style.width=p.progress+'%';track.append(bar);info.append(track,make('small','mb52-remaining','Faltan '+nf(p.next.pointsRemaining)+' puntos'+(p.next.wins?' y '+nf(p.next.winsRemaining)+' victorias adicionales':'')+'.'));}else info.append(make('small','mb52-remaining','Grado máximo del ciclo. El premio requiere verificar quién llegó primero.'));
 card.append(img,info);host.append(card);header.dataset.mb52Profile=p.player;}
function scan(){queued=false;document.querySelectorAll('.player-link[data-player],button[data-player],a[data-player]').forEach(e=>{if(e.dataset.mb52)return;const p=players.get(e.dataset.player);if(p)decorate(e,p);});profile();}
function queue(){if(!queued){queued=true;requestAnimationFrame(scan);}}
async function init(){try{const r=await fetch('stats.json');if(!r.ok)return;const data=await r.json();if(!data.militaryRanks?.available)return;players=new Map(data.militaryRanks.players.map(p=>[p.player,p]));new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});queue();}catch(e){console.warn('Grados militares: datos no disponibles',e);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();

}catch(e){console.error("mb-todo: mb-v52-rangos.js",e)}
try{
(()=>{'use strict';const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};async function start(){const heading=document.querySelector('#panel-duelospriv>.pv-heading');if(heading&&!heading.querySelector('.mb56-duel-mark')){heading.classList.add('mb56-duel-heading');const emblem=make('img','mb56-duel-mark');emblem.src='assets/emblemas/duelos.svg';emblem.alt='';emblem.width=94;emblem.height=94;heading.append(emblem);}
try{const r=await fetch('stats.json');if(!r.ok)return;const data=await r.json(),ranks=data.militaryRanks;if(!ranks?.available||!ranks.prize?.amountBs)return;const title=[...document.querySelectorAll('#panel-guia .rule-title')].find(e=>/Premio al primero/.test(e.textContent));if(!title||title.parentElement.querySelector('.mb56-prize-callout'))return;const box=make('div','mb56-prize-callout'),image=make('img');image.src='assets/rangos-eb/'+ranks.catalog.at(-1).id+'.svg';image.width=36;image.height=76;image.alt='';const text=make('div');text.append(make('strong','',Number(ranks.prize.amountBs).toLocaleString('es-BO')+' Bs en efectivo'),make('span','','Premio único al primer '+ranks.catalog.at(-1).name));box.append(image,text);title.after(box);}catch(e){console.warn('No se pudo cargar el destacado del premio:',e);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();})();

}catch(e){console.error("mb-todo: mb-v56-visuales.js",e)}
try{
(()=>{'use strict';function apply(){const c=window.MB_ADMIN_PUBLIC?.contenido||{};if(c.firma)document.querySelectorAll('.pv-owner-signature,.pv-signature').forEach(el=>el.textContent=c.firma);const home=document.querySelector('#panel-inicio .mb8-home'),notice=document.querySelector('#panel-inicio .adm-public-content');if(home&&notice){notice.style.gridColumn='1/-1';home.prepend(notice);}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();})();

}catch(e){console.error("mb-todo: mb-v57-admin-content.js",e)}
try{
(()=>{'use strict';
const $=s=>document.querySelector(s),make=(tag,text,parent,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;if(parent)parent.append(e);return e;},nf=n=>Number(n||0).toLocaleString('es-BO'),date=d=>d?d.slice(8,10)+'/'+d.slice(5,7)+'/'+d.slice(0,4):'Por confirmar';
let data,more,selected='',queued=false;
const weapons={Bash:'Culata',Pistol:'Pistola',Shotgun:'Escopeta',SMG:'Subfusil',Rifle:'Rifle',Sniper:'Francotirador',MG:'Ametralladora',Bazooka:'Lanzacohetes'};
function button(parent,text,fn){const b=make('button',text,parent,'mb58-button');b.type='button';b.onclick=fn;return b;}
function box(root,id,title){const s=make('section',undefined,undefined,'mb58-box');s.id=id;make('h3',title,s);const h=root.querySelector('.pv-heading');if(h)h.after(s);else root.prepend(s);return s;}
function goto(tab){[...document.querySelectorAll('[data-tab]')].find(e=>e.dataset.tab===tab)?.click();location.hash=tab;}
function chooser(root,label,onchange){const controls=make('div',undefined,root,'mb58-controls'),l=make('label',label,controls),input=make('input',undefined,l);input.placeholder='Escribí tu nombre exacto';input.setAttribute('list','mb58-players');input.value=selected;button(controls,'Consultar',()=>{if(!data.players.some(p=>p.name===input.value)){input.setCustomValidity('Elegí un jugador de la lista');input.reportValidity();return;}input.setCustomValidity('');selected=input.value;document.querySelectorAll('input[list=mb58-players]').forEach(e=>e.value=selected);try{localStorage.setItem('mb58-player',selected);}catch{}onchange(selected);});return controls;}
function metrics(root,entries){const grid=make('div',undefined,root,'mb58-metrics');for(const [label,value] of entries){const c=make('article',undefined,grid);make('span',label,c);make('strong',value===null?'—':nf(value),c);}}
function recent(root,name){const p=more.progress[name];root.replaceChildren();if(!p){make('p','Elegí un jugador para ver su avance.',root);return;}make('h3','Últimos 7 días · '+name,root);make('p',date(more.from)+' — '+date(more.to)+' · incluye hoy en curso',root,'mb58-note');metrics(root,[['Bajas humanas registradas',p.kills],['Victorias competitivas FFA',p.wins],['Aporte de FFA a los puntos',p.points]]);make('p','El aporte mostrado corresponde a FFA. El grado total también puede incluir TDM y duelos. «—» indica cobertura insuficiente.',root,'mb58-note');if(root.id!=='mb58-profile')button(root,'Abrir perfil',()=>{const b=make('button');b.className='player-link';b.dataset.player=name;document.body.append(b);b.click();b.remove();});}
function home(){const host=$('#panel-inicio .mb8-home');if(!host)return;const s=box(host,'mb58-home','Tu comunidad, hoy');const next=data.torneoAgenda.find(e=>e.final>=more.to);make('p',next?'Clasificación del '+date(next.inicio)+' al '+date(next.fin)+' · final '+date(next.final)+' a las '+(more.tournament.horaInicioFinal||'21:00').slice(0,5)+' · hora de Bolivia.':'Consultá la agenda para la próxima edición.',s);make('strong',(more.tournament.premioBs??20)+' Bs en efectivo para el campeón de las nuevas ediciones.',s,'mb58-prize');const actions=make('div',undefined,s,'mb58-controls');button(actions,'Mi clasificación',()=>goto('torneo'));button(actions,'Próximo torneo',()=>goto('agenda'));const personal=make('div');chooser(s,'Mi jugador',n=>recent(personal,n));s.append(personal);recent(personal,selected);const hero=host.querySelector('.mb8-hero')||host.firstElementChild;if(hero!==s)hero.after(s);
 const live=$('#panel-inicio .mb8-log')?.closest('.mb8-card');if(live){live.id='mb58-live';s.after(live);}
 const news=$('#mbNovedades');if(news){const details=make('details',undefined,undefined,'mb58-box');make('summary','Novedades y funciones del servidor',details);news.before(details);details.append(news);}
}
function ranking(){const root=$('#panel-ranking'),s=box(root,'mb58-find','Encontrarme en el ranking'),out=make('div',undefined,s);chooser(s,'Mi jugador',name=>{const list=data.competitiveRanking.players,i=list.findIndex(p=>p.name===name);out.replaceChildren();if(i<0){make('p','Este jugador todavía no aparece en el ranking competitivo.',out);return;}const p=list[i],previous=list[i-1];make('strong','#'+p.rank+' · '+name+' · '+nf(p.wins)+' victorias',out);if(previous){const d=previous.wins-p.wins;make('p',d>0?'Te faltan '+nf(d)+' victorias para igualar a '+previous.name+'. El empate se resuelve por bajas humanas acumuladas.':'Tenés las mismas victorias que '+previous.name+'. El orden actual se decide por bajas humanas acumuladas.',out);make('p','Con '+nf(d+1)+' victoria(s) adicional(es), superarías sus victorias actuales si ese jugador no suma más.',out,'mb58-note');}else make('p','Estás en el primer puesto competitivo.',out);const rows=[...document.querySelectorAll('#tbl-competitivo tbody tr')];rows.forEach(r=>r.classList.toggle('mb58-selected-row',r.querySelector('[data-player]')?.dataset.player===name));const search=$('#search');if(search){search.value=name;search.dispatchEvent(new Event('input',{bubbles:true}));}});}
function tournament(){const s=box($('#panel-torneo'),'mb58-classification','Consultá tu clasificación'),out=make('div',undefined,s);chooser(s,'Jugador',name=>{out.replaceChildren();const from=data.torneoFechaInicio,to=data.torneoFechaFin;const days=Object.entries(data.torneoClasificacion||{}).filter(([d])=>d>=from&&d<=to).filter(([,ps])=>ps.some(p=>p.name===name));let title,reason;if(data.torneoTerminado){title='Torneo finalizado';reason='Consultá Ganadores y la agenda de nuevas ediciones.';}else if(days.length){title='Clasificado';reason='Clasificaste el '+days.map(([d])=>date(d)).join(', ')+'.';}else if((more.tournament.invitadosFinal||[]).includes(name)){title='Invitado a la final';reason='Tu acceso está autorizado por la organización.';}else if(more.to<from){title='Clasificación todavía no iniciada';reason='La próxima edición comienza el '+date(from)+'.';}else{const p=data.players.find(p=>p.name===name),played=Object.entries(p?.humanKillsByGameDay||{}).some(([d,n])=>d>=from&&d<=to&&n>0);title=played?'Pendiente de clasificación':'Sin participación humana registrada en esta edición';reason='Todavía no figurás entre los clasificados. Se cuentan victorias de mapas contra humanos y los cupos de cada día.';}make('strong',title,out,'mb58-state');make('p',reason,out);if(data.torneoPausado)make('p','La organización tiene el torneo en pausa.',out);make('small','Datos actualizados al '+date(String(data.generatedAt).slice(0,10))+'. Los resultados pueden tardar en publicarse.',out);});}
function achievements(){const s=box($('#panel-logros-premios'),'mb58-goals','Tus próximos cinco logros'),out=make('div',undefined,s,'mb58-list');function draw(name){out.replaceChildren();const p=data.players.find(p=>p.name===name);if(!p){make('p','Seleccioná tu jugador para ver cuánto te falta.',out);return;}const entries=p.achievements.map(a=>{if(!Array.isArray(a))return a;const [id,tier,icon,title,desc,target,unit]=data.achCatalog[a[0]];return {id,tier,icon,name:title,desc,target,unit,unlocked:!!a[1],current:a[2]};});const pending=entries.filter(a=>!a.unlocked&&Number(a.target)>0&&Number.isFinite(a.current)).sort((a,b)=>b.current/b.target-a.current/a.target).slice(0,5);for(const a of pending){const c=make('article',undefined,out,'mb58-goal');make('strong',a.icon+' '+a.name,c);make('p',a.desc,c);const progress=make('progress',undefined,c);progress.max=a.target;progress.value=Math.max(0,a.current);make('small',nf(a.current)+' / '+nf(a.target)+' · faltan '+nf(Math.max(0,a.target-a.current))+(a.unit?' '+a.unit:''),c);}if(!pending.length)make('p','No quedan logros pendientes con progreso numérico medible. Revisá las condiciones de los demás logros en el catálogo.',out);make('p','Ordenados por porcentaje de avance. Los logros de condición especial no se estiman.',out,'mb58-note');}chooser(s,'Jugador',draw);draw(selected);}
function maps(){const root=$('#panel-mapas'),bar=root.querySelector('.toolbar');const filters=make('div',undefined,bar,'mb58-controls');function select(label,opts){const l=make('label',label,filters),s=make('select',undefined,l);for(const [v,t]of opts){const o=make('option',t,s);o.value=v;}return s;}const mode=select('Rotación',[['all','Todas'],['ffa','FFA · semana'],['tdm','TDM · sábados'],['inactive','Fuera de ambas rotaciones']]),played=select('Partidas',[['all','Con y sin estadísticas'],['yes','Con partidas registradas'],['no','Sin partidas registradas']]);const stats=new Map(data.mapStats.map(m=>[m.map.toLowerCase(),m]));window.mb58MapFilter=id=>{const k=id.toLowerCase(),m=more.maps[k],has=(stats.get(k)?.timesPlayed||0)>0;return (mode.value==='all'||(mode.value==='inactive'?m?.ffa===false&&m?.tdm===false:m?.[mode.value]===true))&&(played.value==='all'||(played.value==='yes'?has:!has));};const search=bar.querySelector('input');for(const s of [mode,played])s.onchange=()=>search?.dispatchEvent(new Event('input',{bubbles:true}));make('p','Rotación indica los mapas configurados, no garantiza que estén en juego ahora. Tener estadísticas no significa seguir activo.',root,'mb58-note');const detail=$('#mapResult');function info(){const id=$('#mapSelect').value.toLowerCase(),m=more.maps[id];if(detail.querySelector('#mb58-map-state')?.dataset.map===id)return;detail.querySelector('#mb58-map-state')?.remove();const p=make('p',undefined,undefined,'mb58-state');p.id='mb58-map-state';p.dataset.map=id;const status=v=>v===true?'Sí':v===false?'No':'Sin confirmar';p.textContent='En rotación FFA: '+status(m?.ffa)+' · TDM: '+status(m?.tdm)+' | Instalado FFA: '+status(m?.installedFFA)+' · TDM: '+status(m?.installedTDM);detail.prepend(p);}new MutationObserver(info).observe(detail,{childList:true});info();}
function weaponsView(){const root=$('#panel-armas'),s=box(root,'mb58-weapons','Rendimiento reciente por arma');make('p','El ranking acumulado de abajo se conserva. Esta vista compara bajas fechadas de FFA en los registros disponibles.',s);const controls=make('div',undefined,s,'mb58-controls');const period=make('select',undefined,make('label','Periodo',controls));for(const n of [7,30]){const o=make('option','Últimos '+n+' días',period);o.value=n;}const target=make('select',undefined,make('label','Rivales',controls));for(const [v,t] of [['humanos','Solo humanos'],['bots','Solo bots'],['total','Humanos y bots']]){const o=make('option',t,target);o.value=v;}const out=make('div',undefined,s,'mb58-table');function draw(){const weapon=$('#weaponSelect').value;out.replaceChildren();make('h4',weapons[weapon]||weapon,out);const list=Object.entries(more.weapons.periods[period.value]?.[weapon]||{}).map(([name,r])=>({name,k:target.value==='total'?r.humanos+r.bots:r[target.value]})).filter(p=>p.k>0).sort((a,b)=>b.k-a.k||a.name.localeCompare(b.name));if(!list.length){make('p','No hay bajas registradas con esta combinación de filtros.',out);return;}const table=make('table',undefined,out,'mb58-recent-table'),tr=make('tr',undefined,make('thead',undefined,table));['#','Jugador','Eliminaciones'].forEach(t=>make('th',t,tr));const body=make('tbody',undefined,table);for(const [i,p]of list.entries()){const row=make('tr',undefined,body);make('td',i+1,row);const b=make('button',p.name,make('td',undefined,row),'player-link');b.dataset.player=p.name;make('td',nf(p.k),row);}make('p','Hasta '+date(more.to)+' · FFA, según logs conservados. No es el total histórico de todos los modos.',out,'mb58-note');}period.onchange=target.onchange=draw;$('#weaponSelect').addEventListener('change',draw);draw();function labels(){const th=$('#tbl-armas thead tr')?.lastElementChild;if(th){const text='ELIMINACIONES · '+(weapons[$('#weaponSelect').value]||'ARMA').toUpperCase();if(th.textContent!==text)th.textContent=text;}}$('#weaponSelect').addEventListener('change',labels);labels();}
function calendar(){const s=box($('#panel-agenda'),'mb58-calendar','Llevá la final a tu calendario');make('p','El archivo usa la hora de Bolivia y se puede importar en Google Calendar, Outlook o el calendario de tu celular.',s);for(const e of data.torneoAgenda.filter(e=>e.final>=more.to)){button(s,'Agregar final del '+date(e.final),()=>{const time=more.tournament.horaInicioFinal||'21:00:00';const start=new Date(e.final+'T'+(time.length===5?time+':00':time)+'-04:00').toISOString().replace(/[-:]/g,'').replace(/\.\d+Z/,'Z');const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+Z/,'Z');const txt=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Medalleros Bolivia//Torneos//ES','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:mb-final-'+e.final+'@medalleros-bolivia','DTSTAMP:'+stamp,'DTSTART:'+start,'SUMMARY:Gran Final Gun Game / Battle Royale - Medalleros Bolivia','DESCRIPTION:Hora de Bolivia. Revisa la web por cambios de horario.','URL:https://mb-bolivia.github.io/medalleros-bolivia-stats/#torneo','END:VEVENT','END:VCALENDAR',''].join('\r\n');download(new Blob([txt],{type:'text/calendar;charset=utf-8'}),'final-mb-'+e.final+'.ics');});}}
function download(blob,name){const url=URL.createObjectURL(blob),a=make('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
async function shareWinner(g,row){const canvas=make('canvas');canvas.width=1080;canvas.height=1080;const ctx=canvas.getContext('2d'),bg=ctx.createLinearGradient(0,0,1080,1080);bg.addColorStop(0,'#07121d');bg.addColorStop(1,'#243b4c');ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1080);ctx.strokeStyle='#e2b33c';ctx.lineWidth=6;ctx.strokeRect(30,30,1020,1020);ctx.textAlign='center';ctx.fillStyle='#e2b33c';ctx.font='bold 35px sans-serif';ctx.fillText('MEDALLEROS BOLIVIA REVIVAL',540,110);ctx.font='bold 65px sans-serif';ctx.fillText('CAMPEÓN DEL TORNEO',540,210);const portrait=row.querySelector('img');if(portrait){try{const img=new Image();img.src=portrait.src;await img.decode();const scale=Math.min(400/img.width,400/img.height);ctx.drawImage(img,540-img.width*scale/2,260,img.width*scale,img.height*scale);}catch{}}ctx.fillStyle='#ffffff';let size=70;do{ctx.font='bold '+size+'px sans-serif';size-=2;}while(ctx.measureText(g.ganador).width>920&&size>24);ctx.fillText(g.ganador,540,750);ctx.font='30px sans-serif';ctx.fillText(date(g.fecha),540,815);ctx.fillStyle='#e2b33c';ctx.fillText(g.premio||'Premio por definir',540,875,920);ctx.font='24px sans-serif';ctx.fillText(g.estadoPremio==='entregado'?'Premio entregado':g.estadoPremio==='pendiente'?'Premio pendiente de entrega':'',540,925);ctx.fillStyle='#ffffff';ctx.font='22px sans-serif';ctx.fillText('Página y servidor por Mr.Sipi',540,990);const dialog=make('dialog',undefined,document.body,'mb58-dialog');make('h3','Tarjeta del campeón',dialog);const image=make('img',undefined,dialog,'mb58-share-preview');image.src=canvas.toDataURL('image/png');image.alt='Tarjeta de '+g.ganador;button(dialog,'Descargar para WhatsApp',()=>canvas.toBlob(b=>{if(b)download(b,'campeon-'+g.fecha+'.png');}));button(dialog,'Cerrar',()=>dialog.close());dialog.onclose=()=>dialog.remove();dialog.showModal();}
function winners(){const root=$('#panel-ganadores'),rows=[...root.querySelectorAll('.ganador-item')];for(const row of rows){const name=row.querySelector('[data-player]')?.dataset.player||row.querySelector('.ganador-nombre')?.textContent.trim(),day=row.querySelector('.ganador-fecha')?.textContent.trim(),g=data.torneoGanadores.find(g=>g.ganador===name&&g.fecha===day);if(!g)continue;button(row,'Crear tarjeta para compartir',()=>shareWinner(g,row));const final=data.torneoFinalesHistoricas?.[g.fecha];if(final){const d=make('details',undefined,row);make('summary','Ver resultado de la final',d);const pairs=Object.entries(final.conteo||{}).sort((a,b)=>b[1]-a[1]);if(pairs.length)for(const [n,w]of pairs)make('p',n+' · '+nf(w)+' mapas ganados',d);else make('p','Campeón confirmado: '+g.ganador+'. No hay desglose de mapas disponible.',d);}}const latest=data.torneoGanadores[0],hero=root.querySelector('.pv-champion');if(latest&&hero){const s=make('div',undefined,hero);make('strong',latest.premio||'Premio por definir',s,'mb58-prize');make('p',latest.estadoPremio==='entregado'?'Premio entregado'+(latest.fechaEntrega?' · '+date(latest.fechaEntrega):''):latest.estadoPremio==='pendiente'?'Pendiente de entrega':'Entrega sin registrar',s);}}
function guide(){const root=$('#panel-guia'),s=box(root,'mb58-faq','Encontrá una respuesta');const controls=make('div',undefined,s,'mb58-controls');const all=[...root.querySelectorAll('.pv-accordion')];for(const [label,pattern] of [['¿Cómo clasifico?',/Cómo clasificar/],['¿Cómo subo de grado?',/Grados/],['¿Cuál es el premio?',/Premio del torneo/],['¿Cómo instalo el juego?',/Instalación/]])button(controls,label,()=>{const d=all.find(d=>pattern.test(d.querySelector('summary')?.textContent));if(d){d.hidden=false;d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});}});const l=make('label','Buscar en la guía',controls),input=make('input',undefined,l);input.type='search';input.placeholder='Premios, mapas, verificación…';input.oninput=()=>{const q=input.value.toLocaleLowerCase();all.forEach(d=>{d.hidden=!!q&&!d.textContent.toLocaleLowerCase().includes(q);if(q&&!d.hidden)d.open=true;});};}
function profiles(){const header=$('#playerModal.active .profile-header[data-mb32-name]'),host=$('#playerModal.active .mb9-panel[data-section="Resumen"]');if(!header||!host||!host.dataset.mb32||host.querySelector('#mb58-profile'))return;host.dataset.mb58=header.dataset.mb32Name;const s=make('section',undefined,undefined,'mb58-box');s.id='mb58-profile';recent(s,header.dataset.mb32Name);host.prepend(s);}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;profiles();});}
async function init(){try{const r=await fetch('stats.json');if(!r.ok)return;data=await r.json();more=data.mejoras;if(!more)return;try{selected=localStorage.getItem('mb58-player')||'';}catch{}const list=make('datalist',undefined,document.body);list.id='mb58-players';data.players.forEach(p=>{const o=make('option',undefined,list);o.value=p.name;});home();ranking();tournament();achievements();maps();weaponsView();calendar();winners();guide();new MutationObserver(queue).observe($('#modalBody'),{childList:true,subtree:true});profiles();}catch(e){console.error('No se pudieron cargar las mejoras de navegación:',e);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();

}catch(e){console.error("mb-todo: mb-v58-mejoras.js",e)}
