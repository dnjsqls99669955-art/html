/* 코스도 발행본 저장소 — 정적 파일(HTML·sw.js·아이콘)을 그대로 내보내되, HTML 과 sw.js 는 캐시에 남지 않게 한다.
   (Cloudflare 가 주소에 .html 이 없는 요청을 가장자리 캐시에 오래 붙들어 두어, 새로 올린 발행본이 폰에 늦게 보이던 문제) */
export default {
  async fetch(req, env){
    let r=await env.ASSETS.fetch(req);
    const ct=r.headers.get('content-type')||'';
    const path=new URL(req.url).pathname;
    if(r.status===200 && (/text\/html/i.test(ct) || path==='/sw.js' || path==='/manifest.json')){
      const h=new Headers(r.headers);
      h.set('cache-control', 'no-cache, must-revalidate');
      h.set('cdn-cache-control', 'no-store');
      if(path==='/sw.js') h.set('service-worker-allowed', '/');
      return new Response(r.body, {status:r.status, statusText:r.statusText, headers:h});
    }
    return r;
  }
};
