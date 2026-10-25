(function(){'use strict';
 const q=s=>document.querySelector(s), qa=s=>Array.from(document.querySelectorAll(s));
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const femaleNames=['sandy','sandra','valeria','maria','sofia','princess','lady','queen','karol','camila','ana','luna'];
 const maleAvatars=['assets/avatar-m1.svg','assets/avatar-m2.svg','assets/avatar-m3.svg','assets/avatar-m4.svg','assets/avatar-m5.svg','assets/avatar-m6.svg'];
 const femaleAvatars=['assets/avatar-f1.svg','assets/avatar-f2.svg'];
 function isFemale(name){const n=(name||'').toLowerCase(); return femaleNames.some(x=>n.includes(x));}
 function hash(s){s=String(s||''); let h=0; for(let i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i), h|=0; return Math.abs(h); }
 function avatarFor(name){ const arr=isFemale(name)?femaleAvatars:maleAvatars; return arr[hash(name)%arr.length]; }
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
 function enhanceProfileModal(){ const modal=q('#playerModal'); if(!modal) return; const header=modal.querySelector('.profile-header'); if(!header || header.dataset.mb8done) return; header.dataset.mb8done='1'; const title=header.querySelector('h2'); const name=title?title.textContent.trim():''; const avatar=avatarFor(name);
    // Identify existing main blocks
    const kids=Array.from(header.children); const rank=header.querySelector('.rank-badge'); const firstInfo=kids.find(k=>k!==rank && k.querySelector && k.querySelector('h2')); const rightInfo=kids.reverse().find(k=>k!==rank && k!==firstInfo); // best effort
    const portrait=document.createElement('div'); portrait.className='mb8-profile-portrait'; portrait.style.backgroundImage=`url('${avatar}')`;
    const main=document.createElement('div'); main.className='mb8-head-main';
    if(rank) main.appendChild(rank);
    if(firstInfo && firstInfo!==main) { while(firstInfo.firstChild) main.appendChild(firstInfo.firstChild); firstInfo.remove(); }
    const side=document.createElement('div'); side.className='mb8-head-side';
    const statsHtml = [];
    const subBlocks=Array.from(header.querySelectorAll('.modal-sub'));
    const labels=['Estado','Primera aparición','Última partida','Tiempo de juego'];
    subBlocks.forEach((sb,idx)=>{ const txt=sb.textContent.trim(); if(txt) statsHtml.push(`<div class="mb8-status-card"><div class="label">${labels[idx]||'Dato'}</div><div class="value ${idx===0?'ok':''}">${esc(txt)}</div></div>`); sb.style.display='none'; });
    if(!statsHtml.length) statsHtml.push(`<div class="mb8-status-card"><div class="label">Perfil</div><div class="value">Estadísticas del jugador</div></div>`);
    side.innerHTML=statsHtml.join('');
    header.innerHTML=''; header.appendChild(portrait); header.appendChild(main); header.appendChild(side);
 }
 function watchModal(){ const modal=q('#playerModal'); if(!modal) return; const mo=new MutationObserver(()=>enhanceProfileModal()); mo.observe(modal,{childList:true,subtree:true,attributes:true}); enhanceProfileModal(); }
 function init(){ enhanceMenu(); buildHome(); watchModal(); }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
