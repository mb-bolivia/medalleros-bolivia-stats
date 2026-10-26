(()=>{'use strict';
const dir='assets/';
const rows=[
{key:'rifle',title:'Rifle',label:'Fusiles',hint:'Aliados a la izquierda · Eje a la derecha'},
{key:'sniper',title:'Sniper',label:'Francotirador',hint:'Aliados a la izquierda · Eje a la derecha'},
{key:'smg',title:'SMG',label:'Subfusiles',hint:'Aliados a la izquierda · Eje a la derecha'},
{key:'mg',title:'MG',label:'Ametralladoras',hint:'Aliados a la izquierda · Eje a la derecha'},
{key:'rocket',title:'Bazooka',label:'Lanzacohetes',hint:'Aliados a la izquierda · Eje a la derecha'},
{key:'shotgun',title:'Shotgun',label:'Escopeta',hint:'Misma escopeta para Aliados y Eje'}];
const img=k=>dir+'mb16-'+k+'.webp';
const keyFor=v=>{let s=String(v||'').toLowerCase();if(s.includes('shot'))return 'shotgun';if(s.includes('snip'))return 'sniper';if(s.includes('bazooka')||s.includes('rocket'))return 'rocket';if(s.includes('smg')||s.includes('submach'))return 'smg';if(s==='mg'||s.includes('machine')||s.includes('mg '))return 'mg';return 'rifle'};
function makeCard(r){const btn=document.createElement('button');btn.type='button';btn.className='mb16-weapon';btn.dataset.weapon=r.key;btn.innerHTML=`<img loading="lazy" src="${img(r.key)}" alt="${r.label}: Aliados y Eje"><strong>${r.label}</strong><span>${r.hint}</span>`;return btn;}
function installWeapons(){const panel=document.getElementById('panel-armas');if(!panel||panel.querySelector('#mb16-gallery'))return;const gallery=document.createElement('div');gallery.id='mb16-gallery';gallery.innerHTML='<div class="mb16-heading"><b>🔫 Arsenal MOHAA · Aliados vs Eje</b><span>Selecciona una tarjeta para ver el ranking real de eliminaciones</span></div><div class="mb16-selected"><img id="mb16-main-image" alt="Comparación de armas Aliados y Eje" src="'+img('rifle')+'"><div><h3 id="mb16-main-title">Fusiles</h3><p>Imágenes ilustrativas basadas en el menú de selección de MOHAA. La tabla inferior conserva los resultados originales del servidor.</p></div></div><div class="mb16-weapons"></div>';
const grid=gallery.querySelector('.mb16-weapons');rows.forEach(r=>grid.appendChild(makeCard(r)));
const toolbar=panel.querySelector('.toolbar');if(toolbar)toolbar.before(gallery);else panel.prepend(gallery);
const sel=document.getElementById('weaponSelect');const set=k=>{const r=rows.find(x=>x.key===k)||rows[0];gallery.querySelector('#mb16-main-image').src=img(r.key);gallery.querySelector('#mb16-main-title').textContent=r.label;gallery.querySelectorAll('.mb16-weapon').forEach(b=>b.classList.toggle('active',b.dataset.weapon===r.key));};
grid.addEventListener('click',e=>{const btn=e.target.closest('.mb16-weapon');if(!btn)return;const k=btn.dataset.weapon;set(k);if(sel){const opt=[...sel.options].find(o=>keyFor(o.value)===k);if(opt){sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}}});
if(sel){sel.addEventListener('change',()=>set(keyFor(sel.value)));set(keyFor(sel.value));}else set('rifle');}
function installModal(){const modal=document.getElementById('playerModal');const body=document.getElementById('modalBody');if(!modal||!body||!modal.classList.contains('active')||!body.querySelector('.profile-header'))return;
if(body.querySelector('#mb16-profile-section'))return;
const region=document.createElement('section');region.id='mb16-profile-section';region.innerHTML='<button type="button" class="mb16-toggle" aria-expanded="false">🔫 Ver arsenal de Aliados y Eje <span>▾</span></button><div class="mb16-modal-gallery" hidden></div>';
const collection=region.querySelector('.mb16-modal-gallery');rows.forEach(r=>{let item=makeCard(r);item.addEventListener('click',()=>{const panel=document.getElementById('panel-armas');if(panel){const tab=document.querySelector(".tab-btn[data-tab='armas']");if(tab)tab.click();const sel=document.getElementById('weaponSelect');if(sel){let opt=[...sel.options].find(o=>keyFor(o.value)===r.key);if(opt){sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}}modal.classList.remove('active');}});collection.appendChild(item)});
const trigger=region.querySelector('.mb16-toggle');trigger.addEventListener('click',()=>{collection.hidden=!collection.hidden;trigger.setAttribute('aria-expanded',String(!collection.hidden));});const tabs=body.querySelector('.mb9-profile-tabs, .mb10-profile-tabs, .profile-subtabs, .mb9-tabs'); if(tabs)tabs.after(region);else{const header=body.querySelector('.profile-header');header.after(region);}}
let queued=false;function ensure(){queued=false;installWeapons();installModal();}function schedule(){if(queued)return;queued=true;requestAnimationFrame(ensure);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensure();new MutationObserver(schedule).observe(document.getElementById('playerModal')||document.body,{childList:true,subtree:true});});else{ensure();new MutationObserver(schedule).observe(document.getElementById('playerModal')||document.body,{childList:true,subtree:true});}
})();
