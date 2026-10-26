(()=>{'use strict';
const weapons=[['Bash','bash','BASH'],['Pistol','pistol','PISTOL'],['Shotgun','shotgun','SHOTGUN'],['SMG','smg','SUBMACHINE GUN'],['Rifle','rifle','RIFLE'],['Sniper','sniper','SNIPER RIFLE'],['MG','mg','MACHINE GUN'],['Bazooka','bazooka','ROCKET LAUNCHER']];
const $=s=>document.querySelector(s);let players=[];
const norm=s=>String(s||'').toLowerCase().replace(/<[^>]*>/g,m=>m.slice(1,-1)).replace(/[^a-z0-9.]/g,'');
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const num=x=>Number(x||0).toLocaleString('es-BO');
const asset=k=>'assets/weapons/'+k+'.webp?v=19';
function card(w,value,selected=false){return `<button type="button" class="mb18-card" data-mb18-weapon="${w[0]}" aria-pressed="${selected}"><img src="${asset(w[1])}" alt="${w[2]}" loading="lazy"><strong>${w[2]}</strong>${value!==null?`<small>${num(value)} kills</small>`:''}</button>`}
function selected(){return $('#weaponSelect')?.value||'Bash'}
function renderGeneral(){const section=$('#panel-armas');if(!section)return;let box=$('#mb18-weapons');if(!box){box=document.createElement('div');box.id='mb18-weapons';section.insertBefore(box,section.firstChild)}const current=selected();box.innerHTML='<h3>🔫 Arsenal de MOHAA · 8 categorías</h3><div class="mb18-grid">'+weapons.map(w=>card(w,players.length?players.reduce((acc,p)=>acc+Number(p.weapons?.[w[0]]||0),0):null,current===w[0])).join('')+'</div><p class="mb18-note">Selecciona una categoría para actualizar el ranking real de eliminaciones. Las imágenes son ilustrativas y no alteran las cifras.</p>';}
function playerName(){const title=$('#playerModal.active #modalBody .profile-header h2');return title?.textContent?.replace(/[✔✓✅]/g,'').trim()||null}
function renderProfile(){const body=$('#playerModal.active #modalBody');if(!body)return;const n=playerName();if(!n)return;const p=players.find(p=>norm(p.name)===norm(n));let box=body.querySelector('.mb18-player-weapons');if(!p){if(box)box.remove();return}if(box?.dataset.player===norm(n))return;if(!box){box=document.createElement('section');box.className='mb18-player-weapons';body.appendChild(box)}box.dataset.player=norm(n);box.innerHTML='<h3>🔫 Arsenal personal · '+escapeHTML(p.name)+'</h3><div class="mb18-grid">'+weapons.map(w=>card(w,Number(p.weapons?.[w[0]]||0))).join('')+'</div>';box.querySelectorAll('.mb18-card').forEach(b=>{b.disabled=true;b.removeAttribute('aria-pressed')});}
let pending=false;function update(){pending=false;renderGeneral();renderProfile()};function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}
function start(){document.addEventListener('click',e=>{const card=e.target.closest('#mb18-weapons [data-mb18-weapon]');if(!card)return;const select=$('#weaponSelect');if(select){select.value=card.dataset.mb18Weapon;select.dispatchEvent(new Event('change',{bubbles:true}))}schedule()});$('#weaponSelect')?.addEventListener('change',schedule);
new MutationObserver(()=>{if($('#playerModal.active #modalBody')&&!$('#playerModal.active #modalBody .mb18-player-weapons'))schedule()}).observe(document.body,{childList:true,subtree:true});
fetch('stats.json?weapons_v18='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(d=>{players=Array.isArray(d.players)?d.players:[];schedule()}).catch(e=>console.warn('V18: No se pudieron cargar las estadisticas de armas:',e));schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
