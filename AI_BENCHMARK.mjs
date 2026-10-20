// Optional public production benchmark. Node22+. Usage: node AI_BENCHMARK.mjs 1 (or2/3).
// Makes10 real API calls perbatch; consumes finite free allowance. No credentials needed.
// Independent expected semantics below; writes all outcomes, including failures. Not run by builds.
import {writeFile} from 'node:fs/promises';
const origin='https://qadam-astana.pages.dev';
const batch=Number(process.argv[2]||1);if(![1,2,3].includes(batch))throw Error('Expected batch1/2/3');
const cases=batch===1?[
 ['ru','покушать',['food'],[],'any',false],
 ['kk','тамақ ішкім келеді',['food'],[],'any',false],
 ['en','a park without coffee',['park'],['cafe'],'any',false],
 ['ru','кофе и парк',['cafe','park'],[],'all',false],
 ['en','a museum or a park',['museum','park'],[],'any',false],
 ['ru','Я проголодался, хочу поесть по дороге',['food'],[],'any',false],
 ['kk','Кофе емес, мұражайға барғым келеді',['museum'],['cafe'],'any',false],
 ['en','a cafe with Wi-Fi',['cafe'],[],'any',false,'no-data'],
 ['ru','футбол',[],[],'any',true,'not-supported'],
 ['en','a park instead of a cafe',['park'],['cafe'],'any',false],
]:batch===2?[
 ['ru','парк, без кафе',['park'],['cafe'],'any',false],
 ['kk','саябақ және мұражай',['park','museum'],[],'all',false],
 ['en','Coffee first and then a park, please',['cafe','park'],[],'all',false],
 ['ru','музей или библиотека',['museum','library'],[],'any',false],
 ['kk','Қарным ашты, тамақтанғым келеді',['food'],[],'any',false],
 ['en','Not a cafe. I want to visit a library',['library'],['cafe'],'any',false],
 ['ru','Хочу тихое кафе с розетками',['cafe'],[],'any',false,'no-data'],
 ['ru','Музей, только в помещении',['museum'],[],'any',true,'use-controls'],
 ['kk','Кафеге барғым келмейді',[],['cafe'],'any',false],
 ['ru','футбол. Уточнение: вместо этого хочу в парк',['park'],[],'any',false],
]:[
 ['ru','Давай заглянем в библиотеку почитать',['library'],[],'any',false],
 ['kk','Кітап оқуға кітапханаға барғым келеді',['library'],[],'any',false],
 ['en','An art gallery and coffee',['art','cafe'],[],'all',false],
 ['ru','Пообедать или выпить кофе',['food','cafe'],[],'any',false],
 ['kk','Мұражай немесе саябақ',['museum','park'],[],'any',false],
 ['en','Take me to a viewpoint, no museums',['viewpoint'],['museum'],'any',false],
 ['ru','Место для детей, на детскую площадку',['playground'],[],'any',false],
 ['en',"I'd like somewhere cheap to eat",['food'],[],'any',false,'no-data'],
 ['ru','Хочу сходить по магазинам',[],[],'any',true,'not-supported'],
 ['kk','Саябаққа барғым келеді, бірақ кофеханаға емес',['park'],['cafe'],'any',false],
];
const beganAt=new Date().toISOString();
const health=await(await fetch(origin+'/api/plan',{signal:AbortSignal.timeout(10000)})).json();
if(!health.reserveConfigured)throw Error('Waiting for reserve binding deployment');
if(health.hedgeAfterMs!==1500)throw Error('Waiting for final 1.5-second hedge deployment');
const clientBundle=(await(await fetch(origin+'/',{signal:AbortSignal.timeout(10000)})).text()).match(/src="(\/assets\/index-[^"]+\.js)"/u)?.[1];
const results=[];const same=(a,b)=>Array.isArray(a)&&JSON.stringify([...a].sort())===JSON.stringify([...b].sort());
for(const [language,query,desired,excluded,mode,clarification,unsupportedReason] of cases){
 let result={language,query};const began=performance.now();
 try{
  const time=await(await fetch(origin+'/api/time',{signal:AbortSignal.timeout(8000)})).json();
  const request={query,language,origin:{lat:51.12828,lon:71.43055,label:'Public landmark Bayterek'},minutes:90,interests:[],indoor:false,knownHoursOnly:false,accessible:false,departureMode:'now',now:new Date(time.serverNowMs).toISOString()};
  const response=await fetch(origin+'/api/intent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request),signal:AbortSignal.timeout(25000)});
  const j=await response.json(),r=j.resolution,c=r?.contract;
  const passed=!!c&&same(c.desiredCategories,desired)&&same(c.excludedCategories,excluded)&&c.includeMode===mode&&c.needsClarification===clarification
   &&(unsupportedReason?c.unsupported?.some(x=>x.reason===unsupportedReason&&query.toLowerCase().includes(x.text.toLowerCase())):c.unsupported?.length===0);
  result={...result,http:response.status,ms:Math.round(performance.now()-began),resolution:r,passed:passed&&['gemini','cloudflare'].includes(r?.mode)};
 }catch(e){result={...result,ms:Math.round(performance.now()-began),error:e.name,passed:false};}
 results.push(result);console.log(JSON.stringify(result));
 const report={beganAt,at:new Date().toISOString(),origin,batch,health,clientBundle,scope:'Real current public HTTP API requests, synthetic public queries, no cache or injected model contracts, all outcomes retained. Small finite sample is not an uptime SLA.',passed:results.filter(x=>x.passed).length,total:results.length,results};
 await writeFile(new URL(`./production-batch${batch}.json`,import.meta.url),JSON.stringify(report,null,2)+'\n');
}
