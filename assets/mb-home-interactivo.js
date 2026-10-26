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

/* ---------- datos ---------- */
async function cargarStats(){try{const r=await fetch(STATS_URL+'?t='+Date.now(),{cache:'no-store'});if(r.ok)stats=await r.json();}catch(e){}tarjetaTorneo();}
async function cargarLive(){try{const r=await fetch(LIVE_URL+'?t='+Date.now(),{cache:'no-store'});if(r.ok)live=await r.json();}catch(e){}tarjetaTorneo();}
function ciclo(){banner();vivo();tarjetaTorneo();}
function init(){ciclo();cargarStats();cargarLive();setInterval(ciclo,2000);setInterval(cargarStats,120000);setInterval(cargarLive,20000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
