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
