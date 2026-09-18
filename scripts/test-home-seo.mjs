import fs from 'node:fs/promises';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const base=process.argv[2],label=process.argv[3],out=process.env.MOTION_TEST_OUTPUT || '/tmp/mywebsite-motion-seo';
if(!base||!label) throw Error('BASE LABEL required');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
try {
const rows=[];
for(const lang of ['en','ar']) {
 const context=await browser.newContext({javaScriptEnabled:false}); const page=await context.newPage();
 const response=await page.goto(base+(lang==='ar'?'/?lang=ar':'/'),{waitUntil:'load',timeout:90000});
 const raw=await response.text();await fs.writeFile(`${out}/${label}-${lang}-raw.html`,raw);
 const signature=await page.evaluate(()=>{
  const norm=t=>t.replace(/\s+/g,' ').trim();
  return {
   title:document.title,
   metas:[...document.querySelectorAll('meta[name],meta[property]')].map(e=>[e.getAttribute('name')||e.getAttribute('property'),e.content]).sort(),
   seoLinks:[...document.querySelectorAll('link[rel="canonical"],link[rel="alternate"]')].map(e=>[e.rel,e.hreflang,e.getAttribute('href'),e.type]).sort(),
   headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>[e.tagName,norm(e.textContent)]),
   anchors:[...document.querySelectorAll('a[href]')].map(e=>[e.getAttribute('href'),norm(e.textContent),e.getAttribute('aria-label')]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),
   schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent)),
   copy:[...document.querySelectorAll('main p,main li')].filter(e=>!e.closest('[aria-hidden="true"]')).map(e=>norm(e.textContent)).sort(),
   arabicBlock:document.querySelector('.sr-only-seo')?.textContent.replace(/\s+/g,' ').trim(),
   hiddenInline:[...document.querySelectorAll('main [style]')].filter(e=>e.style.opacity==='0').map(e=>e.tagName)
  };
 });
 rows.push({lang,status:response.status(),signature}); await context.close();
}
await fs.writeFile(`${out}/${label}-seo.json`,JSON.stringify(rows,null,2));
if(label!=='baseline') {
 const before=JSON.parse(await fs.readFile(`${out}/baseline-seo.json`,'utf8'));
 const comparisons=rows.map((r,i)=>({lang:r.lang,status:r.status,differences:Object.keys(r.signature).filter(k=>JSON.stringify(r.signature[k])!==JSON.stringify(before[i].signature[k]))}));
 await fs.writeFile(`${out}/${label}-seo-comparison.json`,JSON.stringify(comparisons,null,2));console.log(JSON.stringify(comparisons,null,2));
 if(comparisons.some(c=>c.differences.length||c.status!==200))process.exitCode=1;
} else console.log(rows.map(r=>({lang:r.lang,status:r.status,headings:r.signature.headings.length,anchors:r.signature.anchors.length,schemas:r.signature.schema.length,hiddenInline:r.signature.hiddenInline.length})));
}finally{await browser.close()}
