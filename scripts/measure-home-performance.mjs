// Cold-cache lab comparison, not field CWV or Lighthouse TBT.
import fs from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core')
const out=process.env.MOTION_TEST_OUTPUT||'/tmp/mywebsite-motion-performance'
await fs.mkdir(out,{recursive:true})
const rows=[]
const runs=Number(process.env.PERF_RUNS||3)
for(let run=1;run<=runs;run++) for(const label of (run%2?['baseline','candidate']:['candidate','baseline'])) {
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
 try {
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})
  const page=await context.newPage(),cdp=await context.newCDPSession(page)
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true})
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750})
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4})
  await page.addInitScript(()=>{
   window.__lab={lcp:0,cls:0,tbt:0,paints:[]}
   for(const type of ['largest-contentful-paint','layout-shift','longtask']) new PerformanceObserver(list=>{
    for(const e of list.getEntries()) {
     if(type==='largest-contentful-paint'){window.__lab.lcp=e.startTime;window.__lab.paints.push({time:e.startTime,load:e.loadTime,size:e.size,url:e.url,element:e.element?.outerHTML.slice(0,400)})}
     if(type==='layout-shift'&&!e.hadRecentInput)window.__lab.cls+=e.value
     if(type==='longtask')window.__lab.tbt+=Math.max(0,e.duration-50)
    }
   }).observe({type,buffered:true})
  })
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.goto(label==='baseline'?(process.env.BASELINE_URL||'http://127.0.0.1:3020'):(process.env.CANDIDATE_URL||'http://127.0.0.1:3022'),{waitUntil:'load',timeout:120000})
  await page.waitForTimeout(5000)
  const load=await page.evaluate(()=>({...window.__lab,scripts:performance.getEntriesByType('resource').filter(r=>r.initiatorType==='script').reduce((s,r)=>s+r.encodedBodySize,0),resources:performance.getEntriesByType('resource').filter(r=>['img','css','link'].includes(r.initiatorType)).map(r=>({url:r.name,start:r.startTime,end:r.responseEnd,size:r.encodedBodySize}))}))
  rows.push({label,run,load,errors});console.log(JSON.stringify({label,run,lcp:load.lcp,cls:load.cls,tbt:load.tbt,last:load.paints.at(-1)}))
  await fs.writeFile(`${out}/performance-paired.json`,JSON.stringify({config:{cpu:4,latency:150,downloadBps:200000,viewport:'390x844',cache:'cold',note:'Local lab; long-task excess is not Lighthouse TBT; not field CWV'},rows},null,2))
 }finally{await browser.close()}
}
