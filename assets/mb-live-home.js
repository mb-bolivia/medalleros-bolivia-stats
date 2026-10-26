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
