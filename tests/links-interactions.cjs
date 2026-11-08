// node tests/links-interactions.cjs
// Execute the actual inline script with controlled browser APIs. These are
// contract checks, not a substitute for testing a native phone share sheet.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('links/index.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function load({language='en-US',stored=null,share,clipboard='ok',storage=true}={}){
 const elements={};
 for(const m of html.matchAll(/\bid="([^"]+)"/g)) elements[m[1]]={textContent:'',attrs:{},events:{},classList:{values:new Set(),add(v){this.values.add(v)},remove(v){this.values.delete(v)}},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,v){this.events[k]=v},focus(){this.focused=true},select(){this.selected=true}};
 const translated=[...html.matchAll(/data-i18n="([^"]+)"/g)].map(m=>({key:m[1],textContent:'',getAttribute(){return this.key}}));
 const document={documentElement:{lang:'en'},getElementById:id=>elements[id],querySelectorAll:()=>translated};
 const writes=[];
 const navigator={language,languages:[language],share};
 if(clipboard!=='absent')navigator.clipboard={async writeText(v){if(clipboard==='denied')throw new Error('denied');writes.push(v)}};
 const localStorage={getItem(){if(!storage)throw new Error('denied');return stored},setItem(k,v){if(!storage)throw new Error('denied');stored=v}};
 vm.runInNewContext(script,{document,navigator,localStorage});
 return {elements,translated,document,writes,get stored(){return stored},click(id){return elements[id].events.click()}};
}
(async()=>{
 let checks=0;
 for(const [language,expected] of [['tr-TR','tr'],['TR','tr'],['en-US','en'],['de-DE','en']]){const a=load({language});assert.equal(a.document.documentElement.lang,expected);assert.ok(a.translated.every(e=>e.textContent));assert.ok(a.elements.qrImg.alt&&a.elements.copyFallback.attrs["aria-label"]);checks++}
 let a=load({language:'tr-TR'});await a.click('langEn');assert.equal(a.stored,'en');assert.equal(load({language:'tr-TR',stored:a.stored}).document.documentElement.lang,'en');assert.equal(a.elements.langEn.attrs['aria-pressed'],'true');checks++;
 a=load({language:'tr-TR',storage:false});assert.equal(a.document.documentElement.lang,'tr');await a.click('langEn');assert.equal(a.document.documentElement.lang,'en');checks++;
 a=load();await a.click('copyLink');assert.deepEqual(a.writes,['https://www.serdarbalci.com/links/']);assert.equal(a.elements.copyStatus.textContent,'Link copied to clipboard.');checks++;
 a=load();await a.click('shareLink');assert.deepEqual(a.writes,['https://www.serdarbalci.com/links/']);assert.equal(a.elements.shareStatus.textContent,'Link copied to clipboard.');checks++;
 let payload; a=load({share:async p=>{payload=p}});await a.click('shareLink');assert.equal(payload.url,'https://www.serdarbalci.com/links/');assert.equal(payload.title,'Serdar Balcı, MD');assert.equal(a.writes.length,0);checks++;
 a=load({share:async()=>{throw {name:'AbortError'}}});await a.click('shareLink');assert.equal(a.writes.length,0);assert.equal(a.elements.shareStatus.textContent,'');checks++;
 a=load({share:async()=>{throw new Error('share unavailable')}});await a.click('shareLink');assert.equal(a.writes.length,1);checks++;
 for(const clipboard of ['absent','denied']){a=load({language:'tr-TR',clipboard});await a.click('copyLink');assert.equal(a.elements.copyStatus.textContent,'Aşağıdaki adresi kopyalayın:');assert.ok(a.elements.copyFallback.focused&&a.elements.copyFallback.selected);assert.ok(a.elements.copyFallback.classList.values.has('visible'));checks++}
 console.log(`PASS: ${checks} interaction contracts (controlled APIs)`);
})().catch(e=>{console.error(e);process.exitCode=1});
