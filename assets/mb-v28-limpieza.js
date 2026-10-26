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
