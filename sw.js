/* 코스도 발행본 알림용 서비스 워커 — 발행본과 같은 주소(/sw.js)에 올린다 (예: html.dnjsqls9695.workers.dev, course-2baf5.web.app).
   · 안드로이드 크롬은 알림을 서비스 워커로만 띄울 수 있다 (진동·소리는 기기 알림 설정을 따른다)
   · 알림을 누르면 열려 있는 발행본 창을 앞으로 가져온다
   · push: 나중에 푸시 서버를 붙이면 그대로 쓴다 (지금은 페이지가 직접 띄운다) */
self.addEventListener('install', e=>{ self.skipWaiting(); });
self.addEventListener('activate', e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('notificationclick', e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||'';
  e.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(cs=>{
    const same=url?cs.find(x=>x.url===url && 'focus' in x):null;   // 알림을 보낸 그 발행본 창
    const c=same||cs.find(x=>'focus' in x); if(c) return c.focus();
    if(self.clients.openWindow) return self.clients.openWindow(url||'/');
  }));
});
self.addEventListener('push', e=>{
  let d={}; try{ d=e.data?e.data.json():{}; }catch(x){ d={body:e.data?e.data.text():''}; }
  e.waitUntil(self.registration.showNotification(d.title||'🚨 응급', {body:d.body||'', tag:d.tag||'mcv-push', vibrate:[300,120,300,120,300], requireInteraction:true, renotify:true}));
});
