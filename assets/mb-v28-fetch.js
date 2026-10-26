(()=>{'use strict';
// V28: stats.json se descarga UNA sola vez por visita y se comparte entre todos los scripts
// (antes lo bajaban 3 scripts por separado, sin cache). Se renueva cada 4 minutos como maximo.
if(window.__mb28Fetch)return;window.__mb28Fetch=true;
const orig=window.fetch.bind(window);const TTL=4*60*1000;let cache=null;
const esStats=u=>{try{const url=new URL(typeof u==='string'?u:(u&&u.url)||'',location.href);return url.origin===location.origin&&/\/stats\.json$/.test(url.pathname);}catch(e){return false;}};
window.fetch=function(input,init){
  if(!esStats(input)||(init&&init.method&&init.method.toUpperCase()!=='GET'))return orig(input,init);
  const ahora=Date.now();
  if(!cache||ahora-cache.t>TTL){
    const p=orig('stats.json?v28='+ahora,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.text();});
    cache={t:ahora,p};p.catch(()=>{if(cache&&cache.p===p)cache=null;});
  }
  return cache.p.then(txt=>new Response(txt,{status:200,headers:{'Content-Type':'application/json'}}));
};
})();
