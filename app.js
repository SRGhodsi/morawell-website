/* Morawell Decision DNA — independent static concept. No network requests or persistence. */
'use strict';

const PRESETS = Object.freeze({
  growth: { ops: 45, maintenance: 15, reserve: 15, innovation: 25 },
  balanced: { ops: 30, maintenance: 25, reserve: 25, innovation: 20 },
  resilience: { ops: 25, maintenance: 30, reserve: 35, innovation: 10 }
});
const FIELDS = [
  { key:'ops', name:'Operations', icon:'▤' },
  { key:'maintenance', name:'Reliability', icon:'⛭' },
  { key:'reserve', name:'Liquidity', icon:'◉' },
  { key:'innovation', name:'Innovation', icon:'✦' }
];
// Twenty fictional perspectives, grouped by function. Each visit shows three
// different functions, sampled without replacement and fixed for that run.
// Some quotes reflect simulated parameters. Others are qualitative leads that
// the simplified model does NOT claim to quantify.
const STORY_BANK = [
  {id:'fin-1',group:'finance',role:'Finance director',node:'reserve',quote:r=>`“Customer receipts can take about ${r.receiptDelay} ${r.receiptDelay===1?'month':'months'} after delivery.”`,detail:'The model includes a configurable receipts delay. It is a fictional assumption.'},
  {id:'fin-2',group:'finance',role:'Controller',node:'reserve',quote:r=>`“Our opening cash balance is around ${money(r.initialCash)}k before the new allocation.”`,detail:'The opening balance appears in the cash-flow model as an illustrative starting value.'},
  {id:'fin-3',group:'finance',role:'Treasury lead',node:'reserve',quote:()=>`“Emergency funding is possible, but approval could take longer than expected.”`,detail:'Approval timing is a qualitative concern; the model does not estimate approval probability.'},
  {id:'fin-4',group:'finance',role:'Accountant',node:'reserve',quote:()=>`“Supplier payments often fall due before customer invoices are settled.”`,detail:'Delayed receipts are modeled; actual supplier schedules are not modeled separately.'},
  {id:'ops-1',group:'operations',role:'Operations lead',node:'maintenance',quote:()=>`“At peak workload, recovery takes longer than it does on an ordinary day.”`,detail:'An interruption is modeled, but workload-dependent recovery time is not separately estimated.'},
  {id:'ops-2',group:'operations',role:'Maintenance manager',node:'maintenance',quote:r=>`“A major failure could require about ${money(r.recoveryBase)}k before prevention measures take effect.”`,detail:'The recovery-cost baseline is a fictional model parameter, not a real maintenance estimate.'},
  {id:'ops-3',group:'operations',role:'Quality lead',node:'maintenance',quote:()=>`“Pushing output higher may also create rework and quality pressure.”`,detail:'Quality-related rework is not quantified in this simple model.'},
  {id:'ops-4',group:'operations',role:'Site manager',node:'ops',quote:(r,a)=>`“Our modeled early capacity for this plan is about ${money( r.capacityBase+r.opsFactor*a.ops )} deliveries per month.”`,detail:'Early capacity is computed from the chosen allocation and scenario assumptions.'},
  {id:'mkt-1',group:'market',role:'Market lead',node:'innovation',quote:r=>`“Late-period demand could reach ${r.baseDemand+r.lateIncrease} units a month.”`,detail:'This figure matches the assumed baseline late-period demand in the model.'},
  {id:'mkt-2',group:'market',role:'Sales director',node:'innovation',quote:r=>`“A surge could add another ${r.surgeExtra} units of demand per month.”`,detail:'The demand-surge scenario adds this amount to the assumed late-period demand.'},
  {id:'mkt-3',group:'market',role:'Key accounts lead',node:'innovation',quote:()=>`“A few large customers may value delivery reliability more than a discount.”`,detail:'Customer preference differences are not quantified in the current demonstration.'},
  {id:'mkt-4',group:'market',role:'Customer service lead',node:'ops',quote:()=>`“Late deliveries can damage repeat business even when reported sales rise.”`,detail:'Longer-term customer retention effects are not included in the six-month model.'},
  {id:'buy-1',group:'procurement',role:'Procurement lead',node:'reserve',quote:()=>`“Suppliers may demand earlier payment when demand accelerates.”`,detail:'The model uses a simplified monthly operating outflow, not supplier-level terms.'},
  {id:'buy-2',group:'procurement',role:'Supply-chain lead',node:'ops',quote:()=>`“Two important inputs arrive close to the delivery deadline.”`,detail:'This dependency suggests another scenario to test, but is not in the current model.'},
  {id:'buy-3',group:'procurement',role:'Purchasing manager',node:'reserve',quote:r=>`“Expedited purchasing could push costs above our assumed ${r.unitCost}k per unit.”`,detail:'The unit cost is modeled as constant; expedited purchasing is not yet included.'},
  {id:'buy-4',group:'procurement',role:'Inventory lead',node:'reserve',quote:()=>`“More safety stock could protect delivery, but it ties up working capital.”`,detail:'Inventory buffers and their financing costs are not explicitly represented.'},
  {id:'ppl-1',group:'people',role:'HR lead',node:'ops',quote:()=>`“Extra shifts help during a surge, but fatigue may increase disruption exposure.”`,detail:'Staffing and fatigue feedbacks are not directly modeled in this demo.'},
  {id:'ppl-2',group:'people',role:'Team supervisor',node:'ops',quote:()=>`“New operators need time before they reach normal productivity.”`,detail:'Training lead time is a possible model extension, not a measured input.'},
  {id:'ppl-3',group:'people',role:'Training manager',node:'maintenance',quote:()=>`“Starting training earlier may reduce the disruption during a new rollout.”`,detail:'Training effects are not quantified by the current equations.'},
  {id:'ppl-4',group:'people',role:'People & operations analyst',node:'innovation',quote:()=>`“Operations and finance disagree on how quickly we can expand.”`,detail:'Disagreement between experts should be recorded, not silently averaged.'}
];

function seededRandom(seed){
  let a=seed>>>0;
  return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
function randomSeed(){
  if(typeof crypto!=='undefined' && typeof crypto.getRandomValues==='function'){
    const values=new Uint32Array(1);crypto.getRandomValues(values);return values[0];
  }
  return Math.floor(Math.random()*4294967296)>>>0;
}
function createRun(seed=randomSeed()){
  const rnd=seededRandom(seed);
  const pick=arr=>arr[Math.floor(rnd()*arr.length)];
  const shuffle=arr=>{for(let i=arr.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;};
  const groups=shuffle([...new Set(STORY_BANK.map(s=>s.group))]);
  const selected=shuffle(groups.slice(0,3).map(g=>pick(STORY_BANK.filter(s=>s.group===g))));
  return {
    seed:seed>>>0,
    storyIds:selected.map(s=>s.id),
    initialCash:pick([1800,2000,2200,2400]),
    baseDemand:pick([95,100,105,110]),
    lateIncrease:pick([10,15,20,25]),
    surgeExtra:pick([15,20,25]),
    unitPrice:pick([9,10,11]),
    unitCost:pick([5,6,7]),
    fixedCost:pick([85,100,115]),
    capacityBase:pick([66,70,74]),
    opsFactor:pick([.85,.95,1.05]),
    innovationFactor:pick([.65,.75,.85]),
    retentionBase:pick([.36,.40,.44]),
    maintenanceFactor:pick([.012,.014,.016]),
    recoveryBase:pick([130,150,170]),
    recoveryFactor:pick([2.5,3,3.5]),
    opsSpend:pick([6,7,8]),
    maintenanceSpend:pick([5,6,7]),
    innovationSpend:pick([8,9,10]),
    creditLimit:pick([450,550,650]),
    creditFee:pick([25,35,45]),
    receiptDelay:pick([1,2,3])
  };
}
function selectedStories(){return state.run.storyIds.map(id=>STORY_BANK.find(s=>s.id===id));}

const SCENARIOS = {
  steady:{label:'Steady market',short:'A predictable market with no imposed disruption.'},
  demand:{label:'Demand surge',short:'Late-period demand increases faster than some capacities.'},
  disruption:{label:'Operational disruption',short:'An interruption in month 3 reduces delivery and triggers recovery costs.'}
};
const DETAILS = {
  continuity:{name:'Operational Continuity',known:'The simulated share of potential deliveries actually completed in this scenario.',method:'Delivered units ÷ total scenario demand. Capacity, demand and disruption severity all matter.',limit:'This is modeled fulfillment, not a real-world equipment reliability estimate.'},
  cash:{name:'Liquidity Pressure',known:'The lowest projected cash balance before external financing.',method:'Initial cash minus allocation spending; then monthly operating cash outflows and delayed customer receipts.',limit:'A negative balance indicates a funding requirement. Continuation assumes financing can be arranged; borrowing cost is excluded.'},
  growth:{name:'Growth Readiness',known:'How much late-period customer demand this policy fulfills.',method:'Delivered units ÷ demand in months 4–6. Innovation benefits are assumed to start in month 4.',limit:'Assumed capacity response is illustrative; investment does not automatically translate into capacity.'},
  downside:{name:'Downside Exposure',known:'Operating contribution lost from the imposed disruption, relative to the same allocation with no disruption.',method:'Difference in modeled six-month operating contribution, excluding upfront investment as an expense.',limit:'No event probability or validated loss distribution is available in this demo.'},
  flexibility:{name:'Strategic Flexibility',known:'Not estimated yet.',method:'Would require contractual lock-in, liquidity access, lead times and the real cost of changing resource use.',limit:'We deliberately avoid manufacturing a flexibility score from allocation percentages.'},
  evidence:{name:'Evidence Strength',known:'Illustrative model assumptions, with no independent validation.',method:'The UI displays the exact sources and rules used. Human comments are fictional in this demo.',limit:'Do not interpret scenario frequency as real-world likelihood.'}
};

const app = document.querySelector('#app');
const requestedCase=new URLSearchParams(window.location.search).get('case');
const initialSeed=requestedCase && /^\d{1,10}$/.test(requestedCase) && Number(requestedCase)<=4294967295 ? Number(requestedCase):undefined;
const firstRun=createRun(initialSeed);
const state = {
  step: 0, heroChoice:'balanced', theme:'ivory', initial:{...PRESETS.balanced}, final:{...PRESETS.balanced},
  revealed:[], scenario:'disruption', delay:firstRun.receiptDelay, action:'keep', reason:'tradeoffs', modal:null,
  run:firstRun
};
const money = n => new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Math.round(n));
const pct = n => `${Math.round(n)}%`;
const total = a => FIELDS.reduce((n,f)=>n+a[f.key],0);
const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
const valid = a => total(a)===100;

// Currency is thousands of hypothetical units. The 100 allocation units are NOT currency.
// Rules are deliberately simple and declared in README.md; no calibrated probabilities.
function simulate(a,scenario='disruption',delay=state.delay,contingency=false){
  const r=state.run;
  const demand = scenario==='demand'
    ? [r.baseDemand,r.baseDemand,r.baseDemand+Math.round(r.surgeExtra/2),...Array(3).fill(r.baseDemand+r.lateIncrease+r.surgeExtra)]
    : [r.baseDemand,r.baseDemand,r.baseDemand,...Array(3).fill(r.baseDemand+r.lateIncrease)];
  const initialCash=r.initialCash;
  const initialSpend=r.opsSpend*a.ops+r.maintenanceSpend*a.maintenance+r.innovationSpend*a.innovation;
  const fee=contingency?r.creditFee:0;
  const creditLimit=contingency?r.creditLimit:0;
  const capacityEarly=r.capacityBase+r.opsFactor*a.ops;
  const capacityLate=capacityEarly+r.innovationFactor*a.innovation;
  const retention=clamp(r.retentionBase+r.maintenanceFactor*a.maintenance,.35,.95);
  const recovery=Math.max(30,r.recoveryBase-r.recoveryFactor*a.maintenance);
  const delivered=[], cash=[initialCash-initialSpend-fee];
  let contribution= -fee;
  for(let month=0;month<6;month++){
    let qty=Math.min(demand[month],month<3?capacityEarly:capacityLate);
    if(scenario==='disruption' && month===2)qty*=retention;
    delivered.push(qty);
    const recoveryCost=(scenario==='disruption'&&month===2)?recovery:0;
    const outflow=r.fixedCost+r.unitCost*qty+recoveryCost;
    const inflow=month-delay>=0 ? r.unitPrice*delivered[month-delay] : 0;
    cash.push(cash[cash.length-1]-outflow+inflow);
    contribution+=(r.unitPrice-r.unitCost)*qty-r.fixedCost-recoveryCost;
  }
  const minCash=Math.min(...cash);
  const sold=delivered.reduce((x,y)=>x+y,0);
  const lateDelivered=delivered.slice(3).reduce((x,y)=>x+y,0);
  const lateDemand=demand.slice(3).reduce((x,y)=>x+y,0);
  const demandTotal=demand.reduce((x,y)=>x+y,0);
  const gap=Math.max(0,-minCash);
  return {delivered, cash, minCash, sold, demandTotal, fulfillment:100*sold/demandTotal,
    growth:100*lateDelivered/lateDemand, contribution, gap, creditLimit,
    uncovered:Math.max(0,gap-creditLimit), initialSpend, capacityEarly, capacityLate, retention,
    recovery};
}
function stress(a,contingency=false){
  const cases=[];
  Object.keys(SCENARIOS).forEach(s=>[1,2,3].forEach(d=>{
    const x=simulate(a,s,d,contingency);
    cases.push({scenario:s,delay:d,unfunded:x.uncovered>0,gap:x.gap});
  }));
  return cases;
}
function riskLoss(a){return Math.max(0,simulate(a,'steady',state.delay,false).contribution-simulate(a,'disruption',state.delay,false).contribution);}
function selectedAllocation(){return state.step>=4&&state.action==='rebalance'?state.final:state.initial;}
function modelFor(a=selectedAllocation()){return simulate(a,state.scenario,state.delay,state.step>=4&&state.action==='contingency');}

function layout(content,opts={}){
  const step=state.step;
  const progress=step===0?'':`<div class="progress-wrap"><span class="progress-label">STEP ${step} / 5</span><div class="progress-bars" aria-label="Step ${step} of 5">${[1,2,3,4,5].map(i=>`<i class="${i<=step?'on':''}"></i>`).join('')}</div><span class="progress-label" style="min-width:unset;text-align:right">${Math.round(step/5*100)}%</span></div>`;
  return `${progress}${content}`;
}
function networkSvg(a=state.initial,mode=state.scenario,step=state.step){
  const nodeData=[
    {key:'ops',name:'OPERATIONS',x:160,y:120,col:'#668cb1'},
    {key:'maintenance',name:'RELIABILITY',x:550,y:113,col:'#6d9d7a'},
    {key:'reserve',name:'LIQUIDITY',x:160,y:353,col:'#c69a62'},
    {key:'innovation',name:'INNOVATION',x:550,y:353,col:'#9f84b0'}
  ];
  const model=simulate(a,mode,state.delay,step>=4&&state.action==='contingency');
  const alert = step>=3 && model.minCash<0;
  const events = step>=2;
  return `<div class="visual-frame"><svg viewBox="0 0 710 470" role="img" aria-label="Interactive organizational resource network, reflecting allocations and scenario conditions">
    <defs>
      <radialGradient id="centerFill"><stop offset="0%" stop-color="#f3ddbc"/><stop offset="100%" stop-color="#d8b186"/></radialGradient>
      <radialGradient id="backgroundHalo"><stop offset="0%" stop-color="#ead1b4" stop-opacity=".55"/><stop offset="100%" stop-color="#f3eadf" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="710" height="470" fill="transparent"/><circle cx="355" cy="235" r="220" fill="url(#backgroundHalo)"/>
    ${[90,145,200].map(r=>`<circle cx="355" cy="235" r="${r}" fill="none" stroke="#bda68c" stroke-opacity=".12" stroke-width="1" stroke-dasharray="3 12"/>`).join('')}
    ${nodeData.map(n=>`<g><path d="M355 235 Q${(355+n.x)/2 + (n.x<355?-28:28)} ${(235+n.y)/2} ${n.x} ${n.y}" fill="none" stroke="${n.col}" stroke-width="${(1.5+a[n.key]/11).toFixed(1)}" stroke-opacity=".55" stroke-linecap="round"/><circle cx="${(355+n.x)/2}" cy="${(235+n.y)/2}" r="3" fill="${n.col}" opacity=".9"/></g>`).join('')}
    <circle cx="355" cy="235" r="87" fill="#bd9665" opacity=".045"/><circle cx="355" cy="235" r="71" fill="url(#centerFill)" stroke="#b88858" stroke-width="2"/><circle cx="355" cy="235" r="59" fill="none" stroke="#efcfaa" stroke-opacity=".27" stroke-dasharray="2 7"/>
    <text x="355" y="225" fill="#3c3028" font-size="24" text-anchor="middle" font-weight="780">HUMAN</text><text x="355" y="250" fill="#47372c" font-size="20" text-anchor="middle" font-weight="760">DECISION</text>
    <text x="355" y="275" fill="#795e4c" font-size="11" text-anchor="middle">100 resource units</text>
    ${nodeData.map(n=>{
      const radius=35+a[n.key]*.28, warn=(step===2&&selectedStories().some((story,i)=>state.revealed.includes(i)&&story.node===n.key))||(step>=3&&mode==='disruption'&&n.key==='maintenance')||(alert&&n.key==='reserve');
      return `<g><circle cx="${n.x}" cy="${n.y}" r="${(radius+10).toFixed(1)}" fill="${n.col}" fill-opacity=".045" stroke="${n.col}" stroke-opacity=".17" stroke-dasharray="3 7"/><circle cx="${n.x}" cy="${n.y}" r="${radius}" fill="#fffaf1" stroke="${warn?'#c69a62':n.col}" stroke-width="2.2"/><text x="${n.x}" y="${n.y-1}" text-anchor="middle" fill="#3f3028" font-weight="790" font-size="24">${a[n.key]}</text><text x="${n.x}" y="${n.y+17}" text-anchor="middle" fill="${n.col}" font-size="10">UNITS</text><text x="${n.x}" y="${n.y+radius+23}" text-anchor="middle" font-size="12" letter-spacing="1.5" fill="#594737" font-weight="730">${n.name}</text>${warn?`<circle cx="${n.x+radius-2}" cy="${n.y-radius+2}" r="12" fill="#c69a62"/><text x="${n.x+radius-2}" y="${n.y-radius+7}" text-anchor="middle" font-size="16" font-weight="800" fill="#293238">!</text>`:''}</g>`;
    }).join('')}
    <text x="355" y="38" text-anchor="middle" fill="#70563e" letter-spacing="3.4" font-size="12" font-weight="750">DECISION ECOSYSTEM</text>
    <text x="355" y="446" text-anchor="middle" fill="#8b7661" font-size="11">Resource allocation · not modeled outcomes</text>
    </svg><div class="visual-caption"><span><span class="tiny-pulse"></span>LIVE RESOURCE MAP</span><strong>${step>=3?SCENARIOS[mode].label:'Human intelligence first'}</strong></div></div>`;
}
function nav(nextLabel='Continue',disabled=false){return `<div class="step-nav"><button class="button button-secondary" data-action="back" type="button">← Back</button><button class="button button-primary" data-action="next" type="button" ${disabled?'disabled':''}>${nextLabel} <span aria-hidden="true">→</span></button></div>`;}
function allocationEditor(a,which){
  return `<div class="allocation-editor" data-editor="${which}">${FIELDS.map(f=>`<div class="allocation-row"><div class="allocation-meta"><label for="range-${which}-${f.key}">${f.name}</label><output id="out-${which}-${f.key}">${a[f.key]} units</output></div><input class="range" id="range-${which}-${f.key}" type="range" min="0" max="70" step="5" value="${a[f.key]}" data-alloc="${which}" data-key="${f.key}" /></div>`).join('')}
  <div class="budget-row ${valid(a)?'':'over'}"><span class="small-muted">Resource budget</span><strong data-total="${which}">${total(a)} / 100</strong><button class="mini-button" type="button" data-action="balance" data-which="${which}" ${a.reserve+(100-total(a))<0||a.reserve+(100-total(a))>70||valid(a)?'disabled':''}>Balance reserve</button></div></div>`;
}
const HERO_CHOICES = {
  growth:{title:'Accelerate growth',sub:'Expand the operating footprint',eyebrow:'GROWTH FOCUS',color:'#56baff'},
  balanced:{title:'Balance priorities',sub:'Coordinate capacity and reliability',eyebrow:'BALANCED OPERATIONS',color:'#ffc76a'},
  resilience:{title:'Protect continuity',sub:'Build a more resilient operation',eyebrow:'CONTINUITY FOCUS',color:'#55e2b9'}
};
const THEME_CHOICES = [
  {id:'blue',name:'A · Modern Blue',note:'Technology & trust',swatches:['#07192c','#0a4c93','#35aaff','#dcefff'],meta:'#071727'},
  {id:'teal',name:'B · Emerald Teal',note:'Growth & balance',swatches:['#092b2a','#028f88','#42dac7','#d6f5ee'],meta:'#061f25'},
  {id:'warm',name:'C · Warm Sky',note:'People & progress',swatches:['#312735','#e87843','#ffc47b','#fff0d9'],meta:'#231c2b'},
  {id:'light',name:'D · Clean Light',note:'Clarity & simplicity',swatches:['#0c3262','#318ee7','#aed8ff','#edf6ff'],meta:'#f5f9ff'},
  {id:'indigo',name:'E · Midnight Indigo',note:'Bold & visionary',swatches:['#18152d','#5546a8','#b4a5ff','#f1eaff'],meta:'#151329'},
  {id:'copper',name:'F · Graphite Copper',note:'Industrial & premium',swatches:['#171b20','#505962','#d99560','#ffdec2'],meta:'#171b20'},
  {id:'forest',name:'G · Forest Sage',note:'Grounded & resilient',swatches:['#142820','#2d654d','#afcf79','#e2f0cf'],meta:'#0d241c'},
  {id:'ivory',name:'H · Soft Ivory',note:'Warm & approachable',swatches:['#fcf8f0','#efdfcb','#b85f41','#533b30'],meta:'#fcf8f0'},
  {id:'lavender',name:'I · Nordic Lavender',note:'Calm & creative',swatches:['#f5f3fc','#c6bceb','#6555ad','#2f2657'],meta:'#f5f3fc'}
];
function factoryScene(choice=state.heroChoice){
  const chosen=HERO_CHOICES[choice];
  // Three separate illustrations share the same viewpoint and executive.
  // Visible changes are illustrative strategic priorities, not model outcomes.
  return `<div class="factory-stage factory-${choice}" aria-label="Executive overlooking a three-dimensional facility: ${chosen.title.toLowerCase()}">
    <img class="factory-photo" src="./ceo-factory-${choice}.webp" alt="A manager overlooking an isometric manufacturing site, illustrated for ${chosen.title.toLowerCase()}" />
    <div class="factory-tint"></div>
    <div class="factory-status"><span class="status-dot"></span>${chosen.eyebrow}</div>
    <div class="factory-focus-caption"><strong>${chosen.title}</strong><span>${chosen.sub}</span></div>
    <span class="factory-notice">Illustrative state · not a forecast</span>
  </div>`;
}
function colorGallery(){
  return `<div class="palette-section"><div class="palette-title"><strong>Choose the look</strong><span>Nine live color directions</span></div><div class="palette-grid">${THEME_CHOICES.map(t=>`<button type="button" class="palette-card ${state.theme===t.id?'active':''}" data-theme-select="${t.id}" aria-pressed="${state.theme===t.id}"><span class="palette-mini theme-mini-${t.id}"><span class="mini-sky"></span><span class="mini-slab"></span><span class="mini-glow"></span></span><span class="palette-copy"><b>${t.name}</b><small>${t.note}</small></span><span class="palette-swatches">${t.swatches.map(c=>`<i style="background:${c}"></i>`).join('')}</span></button>`).join('')}</div></div>`;
}
function applyTheme(theme){
  if(!THEME_CHOICES.some(t=>t.id===theme))return;
  state.theme=theme;
  document.documentElement.dataset.theme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',THEME_CHOICES.find(t=>t.id===theme).meta);
  document.getElementById('theme-more')?.setAttribute('aria-label',`Color palettes, selected: ${THEME_CHOICES.find(t=>t.id===theme).name.split(' · ')[1]}`);
  document.querySelectorAll('a[data-theme-link]').forEach(a=>{a.href='./'+a.dataset.themeLink+'?theme='+encodeURIComponent(theme);});
  document.querySelectorAll('[data-theme-select]').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.themeSelect===theme);
    if(btn.classList.contains('palette-card'))btn.setAttribute('aria-pressed',String(btn.dataset.themeSelect===theme));
    if(btn.classList.contains('quick-color')||btn.classList.contains('theme-menu-option'))btn.setAttribute('aria-pressed',String(btn.dataset.themeSelect===theme));
  });
}
function renderIntro(){
  const desktopCards=Object.entries(HERO_CHOICES).map(([id,c])=>
    `<button type="button" class="ref-hotspot ref-hotspot-${id} ${state.heroChoice===id?'is-chosen':''}" data-action="hero-preset" data-preset="${id}" aria-pressed="${state.heroChoice===id}" aria-label="${id==='growth'?'Growth focus':id==='balanced'?'Operational balance':'Resilience focus'}: select this allocation"></button>`
  ).join('');
  const mobileCards=Object.entries(HERO_CHOICES).map(([id,c])=>{
    const a=PRESETS[id];
    return `<button type="button" class="mobile-glass-card mobile-${id} ${state.heroChoice===id?'is-chosen':''}" data-action="hero-preset" data-preset="${id}" aria-pressed="${state.heroChoice===id}">
      <span class="mobile-card-head"><b>${id==='growth'?'Growth Focus':id==='balanced'?'Operational Balance':'Resilience Focus'}</b><span aria-hidden="true">${state.heroChoice===id?'●':'○'}</span></span>
      <img src="./facility-${id}.webp" alt="${id==='growth'?'Expanded capacity':id==='balanced'?'Coordinated operations':'Resilience buffers'} facility" loading="lazy">
      <span class="mobile-card-data"><span>Operations <b>${a.ops}%</b></span><span>Reliability <b>${a.maintenance}%</b></span><span>Liquidity <b>${a.reserve}%</b></span></span>
    </button>`;
  }).join('');
  return `<section class="hero-reference" aria-label="Morawell Decision DNA interactive introduction">
    <div class="hero-reference-desktop">
      <img class="hero-reference-image" src="./approved-hero.png" width="1648" height="928" alt="An executive considering three translucent factory scenarios across an office window. Morawell Decision DNA — Your Decisions Shape the Future." />
      <a class="ref-link ref-home" href="#" id="hero-brand" aria-label="Morawell home"></a>
      <a class="ref-link ref-services" href="./services.html" aria-label="Our services"></a>
      <a class="ref-link ref-contact" href="./contact.html" aria-label="Contact Morawell"></a>
      <div class="ref-choices" role="group" aria-label="Choose a strategy for the Decision DNA experience">${desktopCards}</div>
      <button type="button" class="ref-start" data-action="begin" aria-label="Try the Experience"></button>
    </div>
    <div class="hero-reference-mobile">
      <div class="mobile-hero-copy"><div class="eyebrow">MORAWELL · DECISION DNA</div><h1>Your Decisions<br><span>Shape the Future.</span></h1><p>Explore the trade-offs.</p></div>
      <div class="mobile-hero-office" role="img" aria-label="A manager looking out at the future of the organization"><span>Choose your direction</span></div>
      <div class="mobile-choices" role="group" aria-label="Three allocation strategies">${mobileCards}</div>
      <button class="hero-start mobile-start" data-action="begin" type="button">Try the Experience <span aria-hidden="true">→</span></button>
    </div>
  </section>`;
}
function renderStep1(){
  return `<section><div class="eyebrow">01 / YOUR FIRST JUDGMENT</div><h1 class="page-title">You have <span class="accent">100 units.</span><br>Where do they go?</h1><div class="work-grid"><div class="panel"><span class="story-tag">THE SITUATION</span><p class="lead">Demand may grow. Capacity is limited. Your team needs a decision today.</p><div class="case-facts"><span>Opening cash <b>${money(state.run.initialCash)}k</b></span><span>Monthly demand <b>${state.run.baseDemand}</b></span><span>Unit price <b>${state.run.unitPrice}k</b></span></div><p class="tiny">Fictional case #${state.run.seed}. Figures change with each new visit.</p><div class="group-title">Start with a strategy</div><div class="preset-row"><button class="preset" data-action="preset" data-preset="growth">Growth focus</button><button class="preset" data-action="preset" data-preset="balanced">Balanced</button><button class="preset" data-action="preset" data-preset="resilience">Continuity focus</button></div><div class="group-title">Or make it your own</div>${allocationEditor(state.initial,'initial')}<p class="tiny">Planning units — not money, capacity or a forecast.</p>${nav('Meet your team',!valid(state.initial))}</div><div class="visual-column">${networkSvg(state.initial,'steady',1)}<p class="micro-note">Move a slider. Each node and connection reflects the resources you assign.</p></div></div></section>`;
}
function renderStep2(){
  const stories=selectedStories();
  return `<section><div class="eyebrow">02 / COLLECTIVE HUMAN KNOWLEDGE</div><h1 class="page-title">Your team sees <span class="accent">another side.</span></h1><div class="work-grid"><div class="panel"><p class="lead">Three perspectives, chosen from twenty. Tap to hear each one.</p><div class="knowledge-grid">${stories.map((s,i)=>`<button class="knowledge-card ${state.revealed.includes(i)?'active':''}" data-action="reveal" data-index="${i}" type="button" aria-pressed="${state.revealed.includes(i)}"><span class="role">${['◉','◇','✦'][i]} ${s.role}</span><span class="quote">${s.quote(state.run,state.initial)}</span><span class="reveal">${state.revealed.includes(i)?'✓ Revealed':'Tap to reveal →'}</span></button>`).join('')}</div>${state.revealed.length?`<div class="insight-line">${stories[state.revealed[state.revealed.length-1]].detail}</div>`:''}<p class="small-muted">${state.revealed.length} of 3 perspectives explored · Fictional examples; some insights are not modeled.</p>${nav('Explore what may happen',state.revealed.length<3)}</div><div class="visual-column">${networkSvg(state.initial,'steady',2)}<p class="micro-note">Human experience raises questions — it does not automatically decide for you.</p></div></div></section>`;
}
function metricCards(a){
  const m=modelFor(a);
  const specs=[
    {key:'continuity',icon:'◌',name:'Operational continuity',value:pct(m.fulfillment),sub:'Scenario demand fulfilled'},
    {key:'cash',icon:'◉',name:'Liquidity pressure',value:money(m.minCash),sub:'Min. cash · hypothetical k units'},
    {key:'growth',icon:'↗',name:'Growth readiness',value:pct(m.growth),sub:'Late-period demand fulfilled'},
    {key:'downside',icon:'⌁',name:'Downside exposure',value:money(riskLoss(a)),sub:'Lost operating contribution · k'},
    {key:'flexibility',icon:'◇',name:'Strategic flexibility',value:'Not modeled',sub:'Requires change-cost evidence'},
    {key:'evidence',icon:'⊙',name:'Evidence strength',value:'Illustrative',sub:'Unvalidated assumptions'}
  ];
  return `<div class="metric-grid">${specs.map(s=>`<button class="metric-card" data-action="detail" data-key="${s.key}" type="button"><span class="icon" aria-hidden="true">${s.icon}</span><span class="metric-name">${s.name} <span class="inline-info">ⓘ</span></span><span class="value">${s.value}</span><span class="sub">${s.sub}</span></button>`).join('')}</div>`;
}
function cashChart(a,b=null){
  const aValues=simulate(a,state.scenario,state.delay,false).cash;
  const bValues=b?simulate(b,state.scenario,state.delay,state.action==='contingency').cash:null;
  const all=[...aValues,...(bValues||[]),0],lo=Math.min(...all)-160,hi=Math.max(...all)+120;
  const X=i=>34+i*(608/6),Y=v=>235-(v-lo)/(hi-lo)*204;
  const line=vs=>vs.map((v,i)=>`${i===0?'M':'L'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
  return `<div class="chart-card"><div class="chart-head"><strong>Cash over 6 months</strong><span>Before external funding · hypothetical k units</span></div><svg viewBox="0 0 670 270" role="img" aria-label="Cash balance across six months under selected assumptions">${[0,1,2,3].map(i=>{const v=lo+(hi-lo)*(i/3);return `<line x1="30" y1="${Y(v)}" x2="645" y2="${Y(v)}" stroke="#b6a18b" stroke-opacity=".2" stroke-dasharray="3 6"/><text x="27" y="${Y(v)-5}" text-anchor="end" fill="#846f5b" font-size="10">${money(v)}</text>`;}).join('')}
  <line x1="30" x2="645" y1="${Y(0)}" y2="${Y(0)}" stroke="#b65c54" stroke-opacity=".65" stroke-width="1.4" stroke-dasharray="8 6"/><path d="${line(aValues)}" fill="none" stroke="#b97750" stroke-width="3.7" stroke-linejoin="round" stroke-linecap="round"/>${bValues?`<path d="${line(bValues)}" fill="none" stroke="#73997d" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/>`:''}${aValues.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="3.6" fill="#b97750"/>`).join('')}${bValues?bValues.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="3.3" fill="#73997d"/>`).join(''):''}${Array.from({length:7},(_,i)=>`<text x="${X(i)}" y="260" fill="#846f5b" font-size="11" text-anchor="middle">${i===0?'Start':`M${i}`}</text>`).join('')}</svg><div class="chart-legend"><span><i class="legend-dot" style="background:#b97750"></i>${b?'Initial strategy':'Your strategy'}</span>${b?'<span><i class="legend-dot" style="background:#73997d"></i>Final strategy</span>':''}<span><i class="legend-dot" style="background:#b65c54"></i>Zero cash</span></div></div>`;
}
function scenarioControls(){return `<div class="group-title">Explore possible futures</div><div class="tab-row">${Object.entries(SCENARIOS).map(([key,val])=>`<button type="button" class="tab ${state.scenario===key?'active':''}" data-action="scenario" data-scenario="${key}" aria-pressed="${state.scenario===key}">${val.label}</button>`).join('')}</div><div class="scenario-text">${SCENARIOS[state.scenario].short}</div><div class="group-title">Customer payment delay</div><div class="tab-row">${[1,2,3].map(d=>`<button type="button" class="tab ${state.delay===d?'active':''}" data-action="delay" data-delay="${d}" aria-pressed="${state.delay===d}">${d} ${d===1?'month':'months'}</button>`).join('')}</div>`;}
function renderStep3(){const a=state.initial,model=modelFor(a),cases=stress(a);return `<section><div class="eyebrow">03 / MODEL THE CONSEQUENCES</div><h1 class="page-title">No single <span class="accent">perfect path.</span></h1><div class="work-grid"><div class="panel"><p class="lead">Keep your strategy. Change the future. Look for turning points.</p>${scenarioControls()}<div class="group-title">Decision Snapshot <span class="small-muted">· Tap to inspect</span></div>${metricCards(a)}<div class="insight-line">${model.minCash<0?'This set of assumptions creates a funding gap. Would you accept it, mitigate it, or revise your policy?':'This scenario has no funding gap before financing. Other assumptions can produce a different result.'}</div><p class="tiny">Case #${state.run.seed} · Across nine hypothetical combinations, ${cases.filter(c=>c.unfunded).length}/9 require additional funding. This is NOT a probability.</p>${nav('Make the final call')}</div><div class="visual-column">${networkSvg(a,state.scenario,3)}${cashChart(a)}<details class="details"><summary>What does this simplified model assume?</summary><p>Six months; capped delivery capacity; innovation effects begin in month 4; month-3 operational shock when selected; fixed and variable costs; and receipts delayed 1–3 months. Parameters are generated at the start of this case: cash ${money(state.run.initialCash)}k; monthly demand ${state.run.baseDemand} initially, then ${state.run.baseDemand+state.run.lateIncrease}; sales price ${state.run.unitPrice}k/unit; variable cost ${state.run.unitCost}k/unit; monthly fixed cost ${state.run.fixedCost}k. Details and parameter ranges are disclosed in the project README. Negative cash means extra finance would be required to continue the simulated plan.</p></details></div></div></section>`;}
function renderStep4(){
  const chosen=state.action==='rebalance'?state.final:state.initial;
  const m=simulate(chosen,state.scenario,state.delay,state.action==='contingency');
  return `<section><div class="eyebrow">04 / YOUR CHOICE</div><h1 class="page-title">You decide what <span class="accent">risk to carry.</span></h1><div class="work-grid"><div class="panel"><p class="lead">What will you do with the information?</p><div class="choice-area choices"><label class="choice"><input type="radio" name="risk-action" value="keep" data-field="action" ${state.action==='keep'?'checked':''}><span><span class="choice-title">Keep my strategy</span><span class="choice-desc">Accept its possible upside and exposure.</span></span></label><label class="choice"><input type="radio" name="risk-action" value="contingency" data-field="action" ${state.action==='contingency'?'checked':''}><span><span class="choice-title">Add a contingency</span><span class="choice-desc">Explore a hypothetical financing backstop.</span></span></label><label class="choice"><input type="radio" name="risk-action" value="rebalance" data-field="action" ${state.action==='rebalance'?'checked':''}><span><span class="choice-title">Reallocate resources</span><span class="choice-desc">Adjust your policy after hearing your team.</span></span></label></div>
  ${state.action==='rebalance'?`<div class="group-title">Revised allocation</div>${allocationEditor(state.final,'final')}`:''}
  ${state.action==='contingency'?`<div class="scenario-text">Illustrative credit line: up to ${money(state.run.creditLimit)}k, with a ${money(state.run.creditFee)}k upfront fee. Approval, interest and repayments are not modeled. This is not guaranteed funding.</div>`:''}
  <div class="group-title">What matters most in your choice?</div><div class="choices"><label class="choice"><input type="radio" name="reason" value="opportunity" data-field="reason" ${state.reason==='opportunity'?'checked':''}><span class="choice-title">Preserve the opportunity</span></label><label class="choice"><input type="radio" name="reason" value="continuity" data-field="reason" ${state.reason==='continuity'?'checked':''}><span class="choice-title">Protect continuity</span></label><label class="choice"><input type="radio" name="reason" value="tradeoffs" data-field="reason" ${state.reason==='tradeoffs'?'checked':''}><span class="choice-title">Balance the trade-offs</span></label></div>
  <div class="insight-line">${m.minCash<0?`Modeled funding gap: ${money(m.gap)}k before external financing${state.action==='contingency'?`; remaining uncovered: ${money(m.uncovered)}k`:''}.`:'No funding gap in the selected scenario, under these assumptions.'}</div>${nav('See your Decision DNA',state.action==='rebalance'&&!valid(state.final))}</div><div class="visual-column">${networkSvg(chosen,state.scenario,4)}${cashChart(state.initial,state.action==='rebalance'?state.final:null)}<p class="micro-note">A negative cash balance represents a financing requirement, not a probability. The decision remains yours.</p></div></div></section>`;
}
function profileResult(){
  const a=state.action==='rebalance'?state.final:state.initial;
  const delta=FIELDS.reduce((sum,f)=>sum+Math.abs(state.initial[f.key]-a[f.key]),0)/2;
  if(state.action==='rebalance'&&delta>=15){
    return {name:'Adaptive Strategist',symbol:'◇',match:Math.round(Math.min(98,70+delta*.9)),strength:'You reconsidered your allocation after gaining more context.',trade:'Repeated changes can carry transition costs and delays.',method:`Reallocation of ${delta} out of 100 units met the predefined 15-unit adaptation threshold.`};
  }
  if(state.action==='contingency'){
    return {name:'Resilient Opportunity Builder',symbol:'✦',match:Math.round(Math.min(98,75+Math.max(0,20-Math.abs(a.reserve-20))*.8)),strength:'You kept the opportunity open while exploring a safety mechanism.',trade:'Contingencies may be costly, unavailable or insufficient.',method:'Selected a conditional financing backstop; match is a rule-based illustration.'};
  }
  const refs=[
    {name:'Visionary Explorer',symbol:'↗',target:PRESETS.growth,strength:'You leave room for growth and future capabilities.',trade:'Expansion can place cash and operational resilience under pressure.'},
    {name:'Strategic Balancer',symbol:'◎',target:PRESETS.balanced,strength:'You consider several competing needs together.',trade:'Spreading resources can dilute focused investments.'},
    {name:'Continuity Architect',symbol:'◈',target:PRESETS.resilience,strength:'You put continuity and liquidity in a strong position.',trade:'A defensive posture can defer valuable growth.'}
  ];
  const ranked=refs.map(r=>({...r,match:Math.round(100-FIELDS.reduce((v,f)=>v+Math.abs(a[f.key]-r.target[f.key]),0)/2)})).sort((x,y)=>y.match-x.match);
  return {...ranked[0],method:'Match = 100 − ½ × sum of absolute allocation differences from a published example pattern.'};
}
function renderStep5(){
  const a=state.initial,b=state.action==='rebalance'?state.final:state.initial,cont=state.action==='contingency';
  const x=simulate(a,state.scenario,state.delay,false),y=simulate(b,state.scenario,state.delay,cont);
  const profile=profileResult(),stressA=stress(a),stressB=stress(b,cont);
  return `<section><div class="eyebrow">05 / YOUR DECISION DNA</div><h1 class="page-title">Your experience <span class="accent">is your strength.</span></h1><div class="report-grid"><div class="profile-card"><span class="eyebrow">OBSERVED DECISION STYLE</span><span class="profile-icon">${profile.symbol}</span><h2>${profile.name}</h2><div class="profile-match"><svg viewBox="0 0 160 86"><path d="M17 78 A63 63 0 0 1 143 78" fill="none" stroke="#456c76" stroke-width="13" stroke-linecap="round"/><path d="M17 78 A63 63 0 0 1 143 78" fill="none" stroke="#78e3c3" stroke-width="13" stroke-linecap="round" pathLength="100" stroke-dasharray="${profile.match} 100" /></svg><span class="score">${profile.match}%</span></div><div class="match-label">PATTERN MATCH</div><p class="tiny" style="margin-top:14px">Based only on choices in this short exercise. Not a percentile, ability score, or clinical personality test.</p></div>
  <div><div class="result-insight"><strong class="highlight">✦ YOUR STRENGTH</strong><p>${profile.strength}</p></div><div class="result-insight"><strong style="color:var(--amber)">◇ YOUR TRADE-OFF</strong><p>${profile.trade}</p></div><div class="impact"><h3>Different futures. Your call.</h3><table class="compare-table"><thead><tr><th>Selected scenario</th><th>Initial</th><th>Final</th></tr></thead><tbody><tr><td>Minimum cash (k)</td><td>${money(x.minCash)}</td><td>${money(y.minCash)}</td></tr><tr><td>Delivered units</td><td>${money(x.sold)}</td><td>${money(y.sold)}</td></tr><tr><td>Funding-gap cases *</td><td>${stressA.filter(c=>c.unfunded).length}/9</td><td>${stressB.filter(c=>c.unfunded).length}/9</td></tr></tbody></table><p class="tiny">* Nine hypothetical combinations (3 futures × 3 payment delays). Their frequency is not the probability of a real event.</p><details class="details"><summary>How was my match calculated?</summary><p>${profile.method} No manager population was used. Labels are descriptive metaphors, not validated psychological categories.</p></details></div></div></div>
  ${cashChart(a,state.action==='rebalance'?b:null)}
  <div class="banner final-next"><div><div class="eyebrow">DISCOVER MORAWELL</div><strong>See further. Decide for yourself.</strong><p class="small-muted" style="margin:5px 0">Explore how human experience, risk insights and simulation work together.</p></div><button class="button button-primary" data-action="services">Explore Our Services <span aria-hidden="true">→</span></button></div>
  <div class="step-nav final-nav"><button class="button button-secondary" data-action="home">← Back to Home</button></div></section>`;
}
function renderModal(){if(!state.modal)return '';
 const d=DETAILS[state.modal];return `<div class="detail-modal" data-action="dismiss" role="presentation"><div class="modal-inner" role="dialog" aria-modal="true" aria-label="${d.name} details" tabindex="-1"><div class="modal-top"><h2 style="margin:0;font-size:24px">${d.name}</h2><button class="close-btn" data-action="close" aria-label="Close details">×</button></div><div class="explain-title">What it means</div><p>${d.known}</p><div class="explain-title">How the demo calculates it</div><p>${d.method}</p><div class="explain-title">What remains unknown</div><p>${d.limit}</p><button class="button button-secondary" data-action="close">Close</button></div></div>`;
}
function render(){document.body.classList.toggle('on-intro',state.step===0);let html='';switch(state.step){case 0:html=renderIntro();break;case 1:html=renderStep1();break;case 2:html=renderStep2();break;case 3:html=renderStep3();break;case 4:html=renderStep4();break;case 5:html=renderStep5();break;default:html=renderIntro();}app.innerHTML=layout(html)+renderModal();}
function navigate(n){state.step=clamp(n,0,5);state.modal=null;render();window.scrollTo({top:0,behavior:'instant'});app.focus({preventScroll:true});}
function restart(){state.run=createRun();state.step=0;state.heroChoice='balanced';state.initial={...PRESETS.balanced};state.final={...PRESETS.balanced};state.revealed=[];state.scenario='disruption';state.delay=state.run.receiptDelay;state.action='keep';state.reason='tradeoffs';state.modal=null;navigate(0);}
function updateAllocation(which,key,val){
  const a=state[which];a[key]=clamp(val,0,70);
  const out=document.getElementById(`out-${which}-${key}`);if(out)out.textContent=`${a[key]} units`;
  const editor=document.querySelector(`[data-editor="${which}"]`);
  if(editor){const budget=editor.querySelector('.budget-row');const text=editor.querySelector(`[data-total="${which}"]`);if(budget)budget.classList.toggle('over',!valid(a));if(text)text.textContent=`${total(a)} / 100`;const balance=editor.querySelector('[data-action="balance"]');if(balance)balance.disabled=valid(a)||a.reserve+(100-total(a))<0||a.reserve+(100-total(a))>70;}
  const next=document.querySelector('[data-action="next"]');if(next)next.disabled=state.step===1?!valid(state.initial):state.step===4&&state.action==='rebalance'?!valid(state.final):false;
  const visual=document.querySelector('.visual-column .visual-frame');if(visual){visual.outerHTML=networkSvg(which==='final'?state.final:state.initial,state.step>=3?state.scenario:'steady',state.step);}
}
app.addEventListener('input',e=>{
  const t=e.target;if(t.matches('input[data-alloc]'))updateAllocation(t.dataset.alloc,t.dataset.key,Number(t.value));
});
app.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('input[data-alloc]')){render();return;}
  if(t.dataset.field==='action'){state.action=t.value;if(state.action==='rebalance'&&JSON.stringify(state.final)===JSON.stringify(PRESETS.balanced))state.final={...state.initial};render();}
  if(t.dataset.field==='reason'){state.reason=t.value;render();}
});
app.addEventListener('click',e=>{
  const node=e.target.closest('[data-action]');if(!node)return;
  const action=node.dataset.action;
  if(action==='begin'){navigate(1);return;}
  if(action==='about'){document.querySelector('#how')?.scrollIntoView({behavior:'smooth',block:'center'});return;}
  if(action==='next'){
    if(state.step===1&&!valid(state.initial))return;
    if(state.step===2&&state.revealed.length<3)return;
    if(state.step===4&&state.action==='rebalance'&&!valid(state.final))return;
    navigate(state.step+1);return;
  }
  if(action==='back'){navigate(state.step-1);return;}
  if(action==='reset'){restart();return;}
  if(action==='services'){window.location.assign('./services.html');return;}
  if(action==='home'){restart();return;}
  if(action==='preset'){state.initial={...PRESETS[node.dataset.preset]};state.final={...state.initial};render();return;}
  if(action==='hero-preset'){state.heroChoice=node.dataset.preset;state.initial={...PRESETS[state.heroChoice]};state.final={...state.initial};render();return;}
  if(action==='balance'){const which=node.dataset.which;state[which].reserve+=100-total(state[which]);render();return;}
  if(action==='reveal'){const i=Number(node.dataset.index);if(!state.revealed.includes(i))state.revealed.push(i);render();return;}
  if(action==='scenario'){state.scenario=node.dataset.scenario;render();return;}
  if(action==='delay'){state.delay=Number(node.dataset.delay);render();return;}
  if(action==='detail'){state.modal=node.dataset.key;render();document.querySelector('.modal-inner')?.focus();return;}
  if(action==='close'||action==='dismiss'){if(action==='dismiss'&&e.target!==node)return;state.modal=null;render();return;}
});
function closeThemeMenu(){const popup=document.getElementById('theme-popup');const more=document.getElementById('theme-more');if(popup)popup.hidden=true;if(more)more.setAttribute('aria-expanded','false');}
const menu=document.getElementById('theme-menu-list');
if(menu){
  menu.innerHTML=THEME_CHOICES.map(t=>`<button type="button" class="theme-menu-option" data-theme-select="${t.id}" aria-pressed="${state.theme===t.id}"><span class="theme-menu-swatch" style="background:linear-gradient(135deg,${t.swatches[0]},${t.swatches[2]})"></span><span>${t.name.split(' · ')[1]}</span></button>`).join('');
}
document.getElementById('theme-more')?.addEventListener('click',()=>{
 const popup=document.getElementById('theme-popup');
 if(!popup)return;
 popup.hidden=!popup.hidden;
 document.getElementById('theme-more')?.setAttribute('aria-expanded',String(!popup.hidden));
});
document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-theme-select]');
  if(btn){applyTheme(btn.dataset.themeSelect);closeThemeMenu();return;}
  if(document.getElementById('theme-control') && !e.target.closest('#theme-control'))closeThemeMenu();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeThemeMenu();if(state.modal){state.modal=null;render();}}});
document.getElementById('how-link')?.addEventListener('click',e=>{e.preventDefault();if(state.step!==0)navigate(0);document.getElementById('how')?.scrollIntoView({behavior:'smooth',block:'center'});});
document.getElementById('reset-top').addEventListener('click',restart);
document.getElementById('brand-link').addEventListener('click',e=>{e.preventDefault();restart();});
const incomingTheme=new URLSearchParams(window.location.search).get('theme');
// Soft Ivory is fixed; legacy theme query parameters are deliberately ignored.
render();
applyTheme(state.theme);
