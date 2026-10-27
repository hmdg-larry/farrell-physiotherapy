import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Execute the actual loader with an instrumented DOM; no Google request is sent.
const path = process.argv[2] || 'src/layouts/BaseLayout.astro';
const source = readFileSync(path, 'utf8');
const script = [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(text => /function loadGTM\(/.test(text));
assert.ok(script, `GTM loader must be present in ${path}; build with PUBLIC_GTM_ID=GTM-TEST123`);
const respectsStoredRejection = false;

function run(restored) {
  const injected = [], listeners = new Map(), timers = [];
  const consentDefault = ['consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'}];
  const dataLayer = [consentDefault];
  const window = {dataLayer, __hmdgConsentRestored: restored,
    addEventListener(name, callback) { assert.equal(name, 'hmdg:consent-update'); listeners.set(name, callback); }};
  const document = {
    getElementsByTagName(name) {assert.equal(name, 'script'); return [{parentNode: {insertBefore(script) {injected.push(script);}}}];},
    createElement(name) {assert.equal(name,'script');return {};},
    addEventListener() {throw new Error('GTM must not wait for page interaction');}
  };
  Object.defineProperty(document,'cookie',{set(){throw new Error('Loader must not write cookies');},get(){return '';}});
  vm.runInNewContext(script,{window,document,Date,_gtmId:'GTM-TEST123',setTimeout(...args){timers.push(args);}}, {timeout:1000});
  assert.equal(timers.length,0,'No timer may schedule GTM loading');
  assert.deepEqual(consentDefault[2],{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  assert.equal(dataLayer.length,2,'Only gtm.start is added by the loader');
  assert.equal(dataLayer[1].event,'gtm.js');
  assert.equal(typeof window.hmdgLoadGTM,'function');
  return {injected,window,update(detail){listeners.get('hmdg:consent-update')({detail});}};
}
for (const restored of [undefined,{analytics:true,marketing:false},{analytics:false,marketing:true},{analytics:true,marketing:true}]) {
  const s=run(restored);
  assert.equal(s.injected.length,1,'Request GTM immediately with no click or timer');
  assert.match(s.injected[0].src,/^https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-/);
  assert.equal(s.injected[0].async,true);
  s.window.hmdgLoadGTM();s.update({analytics:true,marketing:true});s.update({analytics:false,marketing:false});
  assert.equal(s.injected.length,1,'Public hook and consent updates must not duplicate GTM');
}
const rejected=run({analytics:false,marketing:false});
assert.equal(rejected.injected.length,respectsStoredRejection?0:1,'Preserve existing stored-rejection behavior');
rejected.window.hmdgLoadGTM();rejected.update({analytics:false,marketing:false});
assert.equal(rejected.injected.length,respectsStoredRejection?0:1);
rejected.update({analytics:true,marketing:false});
assert.equal(rejected.injected.length,1,'A stored rejecter can subsequently grant consent');
console.log(`PASS: ${path}: immediate no-interaction load, consent cases, duplicate protection, no timers or cookie writes`);
