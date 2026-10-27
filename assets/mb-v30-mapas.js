(()=>{'use strict';
const $=s=>document.querySelector(s);
const make=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
let catalog={},queued=false;
const key=id=>String(id||'').trim().toLowerCase();
function source(entry){const el=make(entry.sourcePage?'a':'span','mb30-source',entry.sourceLabel||'Ilustración creada para MOHAA Bolivia');if(entry.sourcePage){el.href=entry.sourcePage;el.target='_blank';el.rel='noopener noreferrer';el.setAttribute('aria-label','Fuente de la imagen de '+entry.name);}return el;}
function photo(entry){const img=make('img','pv-map-thumb');img.src=entry.image;img.alt=(entry.type==='capture'?'Imagen real del juego: ':'Ilustración inspirada en el nombre: ')+entry.name;img.loading='lazy';img.decoding='async';img.width=entry.width||720;img.height=entry.height||450;return img;}
function enhance(){queued=false;const select=$('#mapSelect'),grid=$('.pv-map-grid');if(!select||!grid)return;const names=new Map([...select.options].map(o=>[o.textContent.trim(),o.value]));
 grid.querySelectorAll('.pv-map-card').forEach(card=>{const name=card.querySelector('strong')?.textContent.trim(),id=names.get(name),entry=catalog[key(id)];if(!entry||card.dataset.mb30Map===id)return;card.dataset.mb30Map=id;
  const art=card.querySelector('.pv-map-art');if(art){art.replaceChildren(photo(entry),make('span','pv-map-kind',entry.type==='capture'?'Captura':'Ilustración'));}
  const wrapper=make('div','mb30-map-entry '+(entry.type==='capture'?'mb30-capture':'mb30-generated'));card.before(wrapper);wrapper.append(card,source(entry));
 });
 const detail=$('#mapResult'),selected=catalog[key(select.value)];if(detail&&selected&&!detail.querySelector('.mb30-map-detail')){const figure=make('figure','mb30-map-detail '+(selected.type==='capture'?'mb30-capture':'mb30-generated'));figure.append(photo(selected));const caption=make('figcaption');caption.append(make('strong','',selected.name),make('span','',selected.type==='capture'?'Captura o pantalla de carga del juego':'Ilustración creada a partir del nombre del mapa'),source(selected));figure.append(caption);detail.prepend(figure);}
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(enhance);}}
async function start(){const root=$('#panel-mapas');if(!root)return;try{const response=await fetch('assets/mapas/catalogo.json?v=30');if(!response.ok)throw Error('HTTP '+response.status);const data=await response.json();catalog=data.maps||{};root.dataset.mb30Catalog='ready';const note=root.querySelector('.pv-map-disclaimer');if(note)note.textContent='Capturas y pantallas de carga reales del juego. Las imágenes creadas se identifican con la etiqueta «Ilustración». Cada captura incluye su fuente.';enhance();new MutationObserver(schedule).observe(root.querySelector('.pv-map-grid'),{childList:true,subtree:true});new MutationObserver(schedule).observe($('#mapResult'),{childList:true});$('#mapSelect').addEventListener('change',schedule);}catch(error){console.warn('No se pudo cargar el catálogo de imágenes de mapas:',error);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
