// site/site.js — a2a-vector.ai page script (copy buttons, the form, the statement tiles); external because the CSP allows scripts from 'self' only.
(function(){
  document.querySelectorAll('.copy').forEach(function(b){b.addEventListener('click',function(){navigator.clipboard&&navigator.clipboard.writeText(b.getAttribute('data-copy')).then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy';},1500);});});});
  var f=document.getElementById('cf'),s=document.getElementById('cf-status');
  if(f){f.addEventListener('submit',function(e){e.preventDefault();s.textContent='';var d=new FormData(f);fetch(f.action,{method:'POST',body:d,headers:{'Accept':'application/json'}}).then(function(r){if(r.ok){f.innerHTML='<p class="form-sent">Sent. A person answers.</p>';}else{s.textContent='Not sent. Try again.';}}).catch(function(){s.textContent='Not sent. Try again.';});});}
})();

// the four tiles read the statement of record (https://gsc-radar.ai/statement.json); the typed figure stays if a fact is absent or the fetch fails
(function(){
  var MAP={makers:"makers.label",markets:"markets.value",banners:"retail_banners.label",gtins:"gtins.label"};
  var els=document.querySelectorAll("[data-stmt]"); if(!els.length) return;
  fetch("https://gsc-radar.ai/statement.json",{headers:{accept:"application/json"}}).then(function(r){return r.json();}).then(function(s){
    els.forEach(function(x){var p=(MAP[x.getAttribute("data-stmt")]||x.getAttribute("data-stmt")).split("."),v=s;for(var i=0;i<p.length&&v!=null;i++)v=v[p[i]];
      if(v!=null&&typeof v!=="object") x.textContent=typeof v==="number"?v.toLocaleString("en-US"):String(v);});
  }).catch(function(){});
})();
