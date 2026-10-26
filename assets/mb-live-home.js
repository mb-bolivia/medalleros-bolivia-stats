/* =MB= Actividad y comunidad en vivo. No modifica datos historicos. */
(()=>{'use strict';
const FEED='https://mb-bolivia.github.io/mb-live/live.json';
const MAX_AGE=180000;let last=null,fetchError=false,initialized=false;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
function root(){return $('#panel-inicio .mb8-log')||$('#panel-inicio .mb8-card .mb8-log');}
function fresh(d){const t=Date.parse(d?.generatedAt||'');return Number.isFinite(t)&&Date.now()-t>=-30000&&Date.now()-t<MAX_AGE;}
function label(mode){return ({ffa:'Todos contra Todos',escort:'Escolta al Tanque',gungame:'Gun Game'})[mode]||'Partida del servidor';}
function mapName(d){return d?.ffa?.mapaNombre||d?.gungame?.mapaNombre||d?.escort?.mapaNombre||d?.currentMap||'Sin información';}
function render(){const base=root();if(!base)return;let panel=base.querySelector('#mb-live-home');if(!panel){panel=document.createElement('section');panel.id='mb-live-home';panel.className='mb-live-home';base.prepend(panel);}const d=last;const ok=d&&fresh(d);const names=ok&&Array.isArray(d.onlineNow)?d.onlineNow.map(x=>typeof x==='string'?x:x.name).filter(Boolean):[];
if(ok){const entries=(Array.isArray(d.feed)?d.feed:[]).filter(x=>x&&x.t).slice(0,5);
panel.innerHTML=`<div class="mb-live-heading"><span class="mb-live-pill"><i></i> EN VIVO</span><strong>${esc(label(d.modo))}</strong></div><div class="mb-live-summary"><span>🗺️ ${esc(mapName(d))}</span><span>👥 ${names.length} conectado${names.length===1?'':'s'}</span></div><div class="mb-live-players">${names.length?names.map(n=>`<button type="button" class="mb-live-player player-link" data-player="${esc(n)}" title="Abrir perfil de ${esc(n)}">🪖 ${esc(n)}</button>`).join(''):'<span class="mb-live-muted">Sin jugadores humanos conectados</span>'}</div>${entries.length?`<div class="mb-live-feed"><strong>Actividad reciente</strong>${entries.map(x=>`<div>${esc(x.t)}</div>`).join('')}</div>`:''}<small class="mb-live-stamp">Datos recibidos: ${esc(new Date(d.generatedAt).toLocaleTimeString('es-BO'))} · Actualización automática</small>`;
}else{panel.innerHTML=`<div class="mb-live-heading"><span class="mb-live-pill stale">● SIN DATOS EN VIVO</span></div><div class="mb-live-muted">${fetchError?'No se pudo conectar con la fuente de actividad.':'Esperando datos recientes del servidor.'} Las estadísticas históricas siguen disponibles.</div>`;}}
async function refresh(){try{const r=await fetch(FEED+'?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const d=await r.json();if(!d||!d.generatedAt)throw Error('Formato de datos');last=d;fetchError=false;}catch(e){fetchError=true;}render();}
function init(){if(initialized)return;initialized=true;refresh();setInterval(refresh,25000);setInterval(render,10000);document.addEventListener('click',e=>{const b=e.target.closest('#mb-live-home [data-player]');if(!b)return;const name=b.dataset.player;const other=[...document.querySelectorAll('.player-link[data-player]')].find(x=>!x.closest('#mb-live-home')&&x.dataset.player===name);if(other){other.click();return;}const tab=document.querySelector('.tab-btn[data-tab="ranking"]');if(tab)tab.click();const input=document.querySelector('#playerSearch, #rankingSearch, input[placeholder*="jugador" i]');if(input){input.value=name;input.dispatchEvent(new Event('input',{bubbles:true}));}});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
