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
   <div class="mb8-card"><div class="mb8-hd"><b>🕘 Actividad y comunidad</b><button data-mbtab="sabados">Explorar →</button></div><div class="mb8-log"><div class="entry"><div><strong>Servidor MOHAA Bolivia</strong><br><span>190.181.28.38:12203</span></div><span class="mb8-badge">=MB=</span></div><div class="entry"><div><strong>Escolta al Tanque</strong><br><span>Resultados y estadísticas reales</span></div><span class="mb8-badge">SÁBADOS</span></div><div class="entry"><div><strong>Historial de duelos</strong><br><span>Compara enfrentamientos</span></div><span class="mb8-badge">VS</span></div><div class="entry"><div><strong>Logros y premios</strong><br><span>Consulta el progreso</span></div><span class="mb8-badge">🏅</span></div></div><p class="mb8-note">Cada pestaña conserva sus datos originales; esta capa mejora solo la presentación.</p></div></div>
   <div class="mb8-bottom"><div class="mb8-card"><div class="mb8-hd"><b>🪖 Sábados por equipos</b><button data-mbtab="sabados">Ver torneo →</button></div><div class="mb8-sat"><div class="mb8-sat-image" aria-label="Tanque de escolta"></div><div><h3>Escolta al Tanque</h3><p>Consulta clasificaciones, rendimiento por equipos, resultados y récords históricos del evento competitivo de los sábados.</p><button class="home-btn primary" data-mbtab="sabados">Ver clasificación de Escolta</button></div></div></div>
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
