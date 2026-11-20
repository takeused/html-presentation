'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const slides=$$('.slide'),rail=$$('.rail button'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let current=-1;
Chart.defaults.font.family='NanumSquare, sans-serif';Chart.defaults.color='#88828f';Chart.defaults.font.size=14;Chart.defaults.animation.duration=reduce.matches?0:850;
const pink='#e81768',wine='#920951',ink='#292a33',pale='#dcd8e0';
const charts={};
const base={responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false},tooltip:{backgroundColor:ink,padding:12,titleFont:{family:'NanumSquare'},bodyFont:{family:'NanumSquare'}}},scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{size:12}}},y:{beginAtZero:true,grid:{color:'#f0edf2'},border:{display:false},ticks:{font:{size:12}}}}};
function makeFinance(mode='segments'){
 const configs={segments:{labels:['자동차','에너지','서비스·기타'],datasets:[{label:'Q2 2025',data:[16.661,2.789,3.046],backgroundColor:pale,borderRadius:3},{label:'Q2 2026',data:[20.516,3.139,4.581],backgroundColor:[ink,wine,pink],borderRadius:3}]},profit:{labels:['GAAP 영업이익'],datasets:[{label:'Q2 2025',data:[.923],backgroundColor:pale,borderRadius:3},{label:'Q2 2026',data:[.398],backgroundColor:pink,borderRadius:3}]},cash:{labels:['설비투자','잉여현금흐름'],datasets:[{label:'Q2 2025',data:[2.394,.146],backgroundColor:pale,borderRadius:3},{label:'Q2 2026',data:[5.789,-1.092],backgroundColor:pink,borderRadius:3}]}};
 const options=structuredClone(base);options.plugins.legend={display:true,position:'bottom',align:'start',labels:{boxWidth:9,boxHeight:9,padding:20,font:{size:12}}};options.plugins.tooltip.callbacks={label:ctx=>`${ctx.dataset.label}: $${ctx.raw.toFixed(3)}B`};options.scales.y.ticks.callback=v=>'$'+v;options.datasets={bar:{maxBarThickness:44}};options.scales.x.ticks.display=mode!=='segments';options.onClick=(event,elements,chart)=>window.financeDetails?.chartClick(event,elements,chart);
 if(charts.finance){charts.finance.data=configs[mode];charts.finance.options=options;charts.finance.update('none');replayChart(charts.finance,true)}else charts.finance=new Chart($('#financeChart'),{type:'bar',data:configs[mode],options});
}
function ensureCharts(n){if(n===2&&!charts.finance)makeFinance();if(n===3&&!charts.annualRevenue)makeAnnual();if(n===4&&!charts.delivery){let o=structuredClone(base);o.scales.y.suggestedMax=55;o.plugins.tooltip.callbacks={label:ctx=>`${Math.round(ctx.raw*10000).toLocaleString('ko-KR')}대`};charts.delivery=new Chart($('#deliveryChart'),{type:'line',data:{labels:['Q4 ’25','Q1 ’26','Q2 ’26','Q3 ’26'],datasets:[{label:'인도량',data:[41.8227,35.8023,48.0126,48.6532],borderColor:pink,backgroundColor:'#e8176810',fill:true,tension:.25,pointBackgroundColor:['#fff','#fff','#fff',pink],pointBorderColor:pink,pointRadius:5,pointHoverRadius:8,borderWidth:2.5}]},options:o});let e=structuredClone(base);e.scales.y.suggestedMax=16;e.plugins.tooltip.callbacks={label:ctx=>`${ctx.raw} GWh`};charts.storage=new Chart($('#storageChart'),{type:'bar',data:{labels:['Q4 ’25','Q1 ’26','Q2 ’26','Q3 ’26'],datasets:[{label:'배치량',data:[14.2,8.8,13.5,13.7],backgroundColor:[pale,pale,wine,pink],borderRadius:3,maxBarThickness:55}]},options:e});}}
const numberFrames=new WeakMap();
function countText(el,value){const decimals=+(el.dataset.decimals||0);return (el.dataset.countSign||'')+value.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})}
function finishCount(el){const frame=numberFrames.get(el);if(frame)cancelAnimationFrame(frame);numberFrames.delete(el);el.textContent=countText(el,+el.dataset.count);el.dataset.countProgress='1';delete el.dataset.running}
function count(el,force=false){if(window.deckEditor?.active||el.closest("[data-text-override]"))return;if(reduce.matches){finishCount(el);return}if(el.dataset.running&&!force)return;const old=numberFrames.get(el);if(old)cancelAnimationFrame(old);const value=+el.dataset.count;el.dataset.running='true';el.dataset.countProgress='0';el.textContent=countText(el,0);const started=performance.now();function frame(now){const progress=Math.min((now-started)/1100,1);el.dataset.countProgress=progress.toFixed(3);el.textContent=countText(el,value*(1-(1-progress)**3));if(progress<1)numberFrames.set(el,requestAnimationFrame(frame));else finishCount(el)}numberFrames.set(el,requestAnimationFrame(frame))}
function go(n,hash=true){
 n=Math.max(0,Math.min(slides.length-1,n));if(n===current)return;
 current=n;
 slides.forEach((slide,i)=>{slide.hidden=i!==n;slide.classList.toggle('active',i===n);slide.setAttribute('aria-hidden',i!==n)});
 rail.forEach((button,i)=>{if(i===n)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current')});
 $('#currentPage').textContent=String(n+1).padStart(2,'0');$('#currentTitle').textContent=slides[n].dataset.title;
 $('#prev').disabled=n===0;$('#next').disabled=n===slides.length-1;$('#progress').style.width=`${(n+1)/slides.length*100}%`;
 if(hash)history.replaceState(null,'',`#${n+1}`);
 ensureCharts(n);refreshReactiveNumbers(slides[n]);
 Object.values(charts).forEach(chart=>{if(chart.canvas.closest('.slide')===slides[n]){chart.resize();chart.stop();chart.update('none')}});
 document.body.classList.toggle('video-mode',n===1);
 window.scrollTo({top:0,behavior:'instant'});
 $('#live').textContent=`${n+1} / ${slides.length}장. ${slides[n].dataset.title}`;
 syncVideoSlide(n===1);
 window.brandFilm?.setActive(slides[n].classList.contains('brand-film-slide'));
}
$$('[data-go]').forEach(button=>button.addEventListener('click',()=>go(+button.dataset.go)));
$('#prev').onclick=()=>go(current-1);$('#next').onclick=()=>go(current+1);
document.addEventListener('keydown',event=>{
 if(event.target.closest('[contenteditable="true"]'))return;
 if($$('dialog[open]').length)return;
 if(current===1&&['Enter',' '].includes(event.key)&&!event.target.closest('button,a,input,select,textarea')){event.preventDefault();if(!event.repeat)togglePromoVideo();return}
 if(event.target.closest('button,a,input,select,textarea')&&[' ','Enter'].includes(event.key))return;
 if(['ArrowRight','PageDown'].includes(event.key)){event.preventDefault();go(current+1)}
 if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();go(current-1)}
 if(event.key==='Home')go(0);if(event.key==='End')go(slides.length-1);
});
// The motion slide is the only slide that plays media automatically.
const promoVideo=$('#promoVideo'),videoStage=$('#videoStage');
let videoSeekActive=false;
function mediaTime(seconds){seconds=Math.max(0,Math.floor(seconds||0));return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')}
function updateVideoControls(){
 const duration=Number.isFinite(promoVideo.duration)?promoVideo.duration:15;
 $('#videoSeek').max=String(duration);if(!videoSeekActive)$('#videoSeek').value=String(promoVideo.currentTime||0);
 $('#videoTime').textContent=mediaTime(promoVideo.currentTime)+' / '+mediaTime(duration);
 $('#videoToggle').textContent=promoVideo.ended?'↻ 다시 재생':promoVideo.paused?'▶ 재생':'Ⅱ 일시정지';
 $('#videoToggle').setAttribute('aria-label',promoVideo.ended?'영상 다시 재생':promoVideo.paused?'영상 재생':'영상 일시정지');
 const full=!!document.fullscreenElement;
 $('#videoFullscreen').innerHTML=full?'전체화면 해제 <b aria-hidden="true">⛶</b>':'전체화면 <b aria-hidden="true">⛶</b>';
 $('#videoFullscreen').setAttribute('aria-label',full?'영상 전체화면 해제':'영상 전체화면');
}
function playPromoVideo(restart=false){
 if(current!==1||window.deckEditor?.active)return;
 if(restart||promoVideo.ended)promoVideo.currentTime=0;
 promoVideo.muted=true;
 const play=promoVideo.play();if(play)play.catch(()=>{if(current===1)$('#videoPlayFallback').hidden=false});
}
function requestVideoFullscreen(){
 if(document.fullscreenElement)return;
 if(navigator.userActivation&&!navigator.userActivation.isActive)return;
 if(videoStage.requestFullscreen)videoStage.requestFullscreen().catch(()=>{});
}
function syncVideoSlide(active){
 promoVideo.autoplay=active;
 if(active&&!window.deckEditor?.active){
  $('#videoPlayFallback').hidden=true;playPromoVideo(true);videoStage.focus({preventScroll:true});
 }else{
  promoVideo.pause();$('#videoPlayFallback').hidden=true;
  if(document.fullscreenElement===videoStage)document.exitFullscreen().catch(()=>{});
 }
 updateVideoControls();
}
function togglePromoVideo(){if(promoVideo.paused||promoVideo.ended)playPromoVideo();else promoVideo.pause()}
$('#videoToggle').addEventListener('click',togglePromoVideo);
$('#videoRestart').addEventListener('click',()=>playPromoVideo(true));
$('#videoPlayFallback').addEventListener('click',()=>playPromoVideo());
promoVideo.addEventListener('click',togglePromoVideo);
promoVideo.addEventListener('play',()=>{if(current!==1){promoVideo.pause();return}$('#videoPlayFallback').hidden=true;updateVideoControls()});
for(const event of ['pause','ended','loadedmetadata','timeupdate','durationchange'])promoVideo.addEventListener(event,updateVideoControls);
$('#videoSeek').addEventListener('input',event=>{videoSeekActive=true;promoVideo.currentTime=+event.target.value;updateVideoControls()});
$('#videoSeek').addEventListener('change',()=>{videoSeekActive=false;updateVideoControls()});
$('#videoSeek').addEventListener('keydown',event=>event.stopPropagation());
$('#videoFullscreen').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else requestVideoFullscreen()});
document.addEventListener('fullscreenchange',updateVideoControls);
document.addEventListener('visibilitychange',()=>{if(document.hidden)promoVideo.pause()});

window.addEventListener('hashchange',()=>go((parseInt(location.hash.slice(1),10)||1)-1,false));
function intent(selector,fn){$$(selector).forEach(b=>{b.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')fn(b)});b.addEventListener('focus',()=>fn(b));b.addEventListener('click',()=>fn(b))})}
function selectWithin(selector,b){$$(selector).forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b)})}
const financeInsights={segments:['사업별 매출','자동차 매출 비중 72.7%','서비스·기타 매출은 45.81억 달러로 전년 동기보다 50.4% 늘었습니다. 충전·정비 등 기존 차량 기반 사업도 커지고 있습니다.'],profit:['GAAP 영업이익','영업이익 전년 동기 대비 −56.9%','영업이익은 9.23억 달러에서 3.98억 달러로 감소했습니다. 영업비용은 47.3% 늘었고, 영업이익률은 4.1%에서 1.4%로 낮아졌습니다.'],cash:['설비투자와 현금흐름','설비투자 확대와 잉여현금흐름 적자','설비투자는 57.89억 달러로 늘었습니다. 영업현금흐름 46.97억 달러에서 설비투자를 뺀 잉여현금흐름은 −10.92억 달러입니다.']};
const roads=[['C','Cybercab 생산과 Robotaxi 서비스 확대','텍사스에서 Cybercab 생산을 시작했습니다. 실제 Robotaxi 운행 확대와 차량 생산 확대는 각각의 진행 상황을 확인해야 합니다.','서비스 지역의 허가 조건, 운행 범위와 유료 이용 실적'],['S','Semi의 생산 개시를 준비하는 단계','네바다 신공장은 시운전 단계로 공개됐습니다. 회사는 올해 생산 개시 계획을 유지했으며, 생산 속도와 고객 공급의 확대가 다음 과제입니다.','공장 시운전 완료와 실제 생산·고객 공급 진척'],['E','Megapack 생산 기반과 제품 확대','상하이 공장의 생산을 확대하고 있습니다. 회사는 텍사스 신공장에서 올해 Megapack 3와 Megablock 생산을 시작할 계획을 제시했습니다.','텍사스 생산 개시와 신규 제품의 현장 배치'],['O','Optimus 초기 생산라인 구축','프리몬트의 초기 생산라인 설치와 텍사스 공장 건설을 진행하고 있습니다. 초기 생산 로봇은 훈련 데이터 수집과 기능 개발에 활용할 계획입니다.','초기 생산과 학습·기능 개발 진척, 외부 공급 여부']];
let selectedRoad=0,roadSheetOpener=null,roadFocusReturning=false,roadHoverReady=true;
const roadSheet=$('#roadSheet');
const roadDetails=[
 {status:'생산 시작 · 서비스 확대',intro:'차량을 만드는 단계와 실제 유료 운행을 늘리는 단계를 나누어 살펴봅니다.',facts:['텍사스에서 Cybercab 생산을 시작했고, 생산 차량의 공도 시험과 사내 탑승을 진행했습니다.','Robotaxi는 운행 지역 확대를 추진하며, 도시별 시험·허가·운영 준비를 진행하고 있습니다.'],checks:['Cybercab의 실제 생산 확대와 차량 투입','지역별 허가 조건, 운행 범위와 운영 방식','유료 이용과 누적 주행 실적'],note:'Cybercab 생산 개시가 모든 지역의 Robotaxi 상용화를 의미하지는 않습니다. 지역별 서비스 조건을 함께 확인해야 합니다.',pages:'pp. 6, 9–10'},
 {status:'공장 시운전 · 생산 개시 준비',intro:'공장을 준비하는 단계에서 실제 차량 생산과 고객 공급으로 이어지는 흐름을 살펴봅니다.',facts:['네바다의 새 Semi 공장은 시운전 단계로 공개됐습니다.','회사는 2026년 생산 개시 계획을 유지했습니다.'],checks:['시운전 완료 이후의 실제 생산 진척','고객 인도와 공급 확대의 공식 발표','배터리와 생산라인의 안정화'],note:'시운전은 양산 준비 과정입니다. 공장 준비, 생산 개시, 고객 공급 확대를 서로 구분해 봐야 합니다.',pages:'pp. 6–7, 10'},
 {status:'생산 기반 확대 · 신제품 준비',intro:'기존 공장의 생산 확대와 새 공장의 신제품 생산을 함께 살펴봅니다.',facts:['상하이 Megafactory는 생산을 확대하고 있습니다.','텍사스 새 공장에서 Megapack 3와 Megablock의 생산을 2026년에 시작할 계획입니다.'],checks:['텍사스 공장의 생산 개시와 가동 진척','실제 현장 배치와 매출로 이어지는 흐름','신제품 공급과 고객 프로젝트 진행'],note:'공장의 생산능력, 실제 생산량, 고객 현장 배치량은 서로 다른 지표입니다. 설비 확장만으로 사업 성과를 판단하지 않습니다.',pages:'pp. 6, 10'},
 {status:'초기 생산라인 설치 · 기능 개발',intro:'초기 로봇을 만들고 학습시키는 단계에서 활용 범위가 넓어지는 과정을 살펴봅니다.',facts:['프리몬트의 초기 생산라인 설치와 텍사스의 공장 건설을 진행하고 있습니다.','초기 물량은 Optimus Academy의 훈련 데이터 수집과 기능 개발에 활용할 계획입니다.'],checks:['초기 생산 진척과 수행 가능한 작업','훈련 데이터 수집과 기능 개선','외부 고객 공급과 상용화의 공식 발표'],note:'초기 내부 활용과 외부 고객 대상 판매는 구분해야 합니다. 생산라인 구축이 곧바로 상용화 완료를 뜻하지는 않습니다.',pages:'pp. 6, 10'}
];
function selectRoad(i){if(i===selectedRoad)return;selectedRoad=i;selectWithin('[data-road]',$(`[data-road="${i}"]`));const d=roads[i];$('.road-index').textContent=d[0];$('#roadTitle').textContent=d[1];$('#roadText').textContent=d[2];$('#roadNext').textContent=d[3];$('.road-detail').classList.remove('pulse');if(!reduce.matches)requestAnimationFrame(()=>$('.road-detail').classList.add('pulse'))}
function renderRoadSheet(i){selectRoad(i);const d=roadDetails[i];selectWithin('[data-sheet-road]',$(`[data-sheet-road="${i}"]`));$('#roadSheetLetter').textContent=roads[i][0];$('#roadSheetTitle').textContent=roads[i][1];$('#roadSheetStatus').textContent=d.status;$('#roadSheetIntro').textContent=d.intro;$('#roadSheetNote').textContent=d.note;$('#roadSheetPages').textContent=d.pages;for(const [id,items] of [['#roadSheetFacts',d.facts],['#roadSheetChecks',d.checks]]){$(id).replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li}))}$$('[data-road]').forEach(b=>b.setAttribute('aria-expanded',String(roadSheet.open&&+b.dataset.road===i)));$('#roadDetailOpen').setAttribute('aria-expanded',String(roadSheet.open));$('.road-sheet-scroll').scrollTop=0}
function openRoadSheet(i,opener){roadSheetOpener=opener;renderRoadSheet(i);roadSheet.classList.remove('is-closing');roadSheet.showModal();$('.road-sheet-scroll').scrollTop=0;document.documentElement.classList.add('road-sheet-open');$('#roadDetailOpen').setAttribute('aria-expanded','true');$(`[data-road="${i}"]`).setAttribute('aria-expanded','true')}
async function closeRoadSheet(){if(!roadSheet.open||roadSheet.classList.contains('is-closing'))return;roadSheet.classList.add('is-closing');if(!reduce.matches)await Promise.allSettled(roadSheet.getAnimations().map(animation=>animation.finished));roadFocusReturning=true;roadHoverReady=false;roadSheet.close();roadSheet.classList.remove('is-closing');document.documentElement.classList.remove('road-sheet-open');$$('[data-road],#roadDetailOpen').forEach(b=>b.setAttribute('aria-expanded','false'));if(roadSheetOpener?.isConnected)roadSheetOpener.focus({preventScroll:true});queueMicrotask(()=>roadFocusReturning=false)}
$$('[data-road]').forEach(button=>{button.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&!roadSheet.open&&!roadFocusReturning&&roadHoverReady)selectRoad(+button.dataset.road)});button.addEventListener('pointermove',event=>{if(event.pointerType!=='touch'&&!roadSheet.open&&!roadFocusReturning){roadHoverReady=true;selectRoad(+button.dataset.road)}});button.addEventListener('focus',()=>{if(!roadSheet.open&&!roadFocusReturning)selectRoad(+button.dataset.road)});button.addEventListener('click',()=>openRoadSheet(+button.dataset.road,button))});
$('#roadDetailOpen').addEventListener('click',event=>openRoadSheet(selectedRoad,event.currentTarget));
$$('[data-sheet-road]').forEach(button=>button.addEventListener('click',()=>renderRoadSheet(+button.dataset.sheetRoad)));
$('#roadSheetClose').addEventListener('click',closeRoadSheet);
roadSheet.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const items=[...roadSheet.querySelectorAll('button:not([disabled]),a[href]')],first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}else if(!roadSheet.contains(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus()}});
roadSheet.addEventListener('cancel',event=>{event.preventDefault();closeRoadSheet()});
roadSheet.addEventListener('click',event=>{if(event.target!==roadSheet)return;const r=roadSheet.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeRoadSheet()});

const trims=[['기본 구성 · 예약','도로 주행을 위한 기본 구성','이인승 구성에 능동 공력장치와 멀티모드 흡입 시스템을 결합합니다. 테슬라가 공개한 제품 설명 기준입니다.','예약 접수와 고객 인도는 구분해야 합니다. 확인한 공식 페이지에는 확정 인도 일정이 명시돼 있지 않습니다.'],['확장 옵션 · 한정 제공','가속 추력을 더한 Thrust','이인승 구성에 후방 냉가스 추력기를 결합합니다. 테슬라는 이 옵션의 가속 성능을 아래와 같이 설명합니다.','이 수치는 테슬라의 주장입니다. 옵션의 최종 사양과 지역별 제공 조건을 확인해야 합니다.'],['확장 옵션 · 초청형','비행 기능을 설명하는 Rocket','일인승 구성과 차량 둘레의 냉가스 추력기로 전진·상승·회전 운동을 지원한다고 설명합니다.','공도 사용 미승인. 일부 지역에서는 제공하지 않으며, 지역별 법적 요건을 따릅니다. 한국 판매·승인을 의미하지 않습니다.']];
function acceleration(){if(charts.acceleration){charts.acceleration.resize();return}let o=structuredClone(base);o.indexAxis='y';o.plugins.tooltip={enabled:false};o.plugins.legend={display:false};o.scales={x:{min:0,max:1.5,ticks:{stepSize:.5,callback:v=>v+'초',font:{size:11}},grid:{color:'#eee9ee'},border:{display:false}},y:{grid:{display:false},border:{display:false},ticks:{display:false}}};const bound={id:'bound',afterDraw(c){let {ctx,scales:{x,y}}=c;ctx.save();ctx.strokeStyle=pink;ctx.lineWidth=2;ctx.setLineDash([3,3]);let a=x.getPixelForValue(1);ctx.beginPath();ctx.moveTo(a,c.chartArea.top);ctx.lineTo(a,c.chartArea.bottom);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=wine;ctx.font='bold 14px NanumSquare';ctx.textAlign='center';ctx.fillText('0–60mph <1초',x.getPixelForValue(.5),y.getPixelForValue(0)+4);ctx.restore()}};charts.acceleration=new Chart($('#accelerationChart'),{type:'bar',data:{labels:['Thrust'],datasets:[{data:[[0,1]],backgroundColor:'#e8176827',barThickness:22}]},options:o,plugins:[bound]})}
let selectedTrim=0;const trimNames=['Performance','Thrust','Rocket'];const trimVisualCaptions=['기본 구성 · 외관 참고','Thrust · 후방 냉가스 추력기','Rocket · 비행 이미지 (AI 편집)'];
function selectTrim(value,animate=true){const i=Math.max(0,Math.min(2,Number(value))),changed=i!==selectedTrim;selectedTrim=i;const lever=$('#trimLever');lever.value=String(i);lever.setAttribute('aria-valuetext',trimNames[i]);lever.style.setProperty('--lever-fill',`${i*50}%`);selectWithin('[data-trim]',$(`[data-trim="${i}"]`));$$('[data-trim-image]').forEach(image=>image.hidden=+image.dataset.trimImage!==i);$('#trimVisual').dataset.activeTrim=String(i);$('#trimVisual').setAttribute('aria-label',trimNames[i]+(i===2?' 관련 AI 편집 이미지':' 관련 공식 이미지'));$('#trimVisualTag').textContent=trimNames[i];$('#trimVisualCaption').textContent=trimVisualCaptions[i];$('#trimVisualSource').textContent=i===2?'TESLA IMAGE · AI 편집 이미지':'TESLA OFFICIAL IMAGE · 구성 설명용 공식 이미지';if(!changed)return;const d=trims[i];$('#trimName').textContent=trimNames[i];$('#trimLabel').textContent=d[0];$('#trimTitle').textContent=d[1];$('#trimText').textContent=d[2];$('#trimNote').textContent=d[3];$('#trimChartArea').hidden=i!==1;if(i===1){acceleration();replayChart(charts.acceleration,true)}if(animate&&!reduce.matches){$('#trimDetails').classList.remove('pulse');requestAnimationFrame(()=>$('#trimDetails').classList.add('pulse'))}}
$$('[data-trim]').forEach(button=>button.addEventListener('click',()=>selectTrim(button.dataset.trim)));
$('#trimLever').addEventListener('input',event=>selectTrim(event.target.value));
$('#trimLever').addEventListener('keydown',event=>{let next=selectedTrim;if(['ArrowUp','ArrowRight'].includes(event.key))next++;else if(['ArrowDown','ArrowLeft'].includes(event.key))next--;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else if(event.key===' '){event.preventDefault();event.stopPropagation();return}else return;event.preventDefault();event.stopPropagation();selectTrim(next)});
const techs=[['공력장치를 조절해 주행 조건에 대응','차량이 받는 공기 흐름을 조절하는 기술입니다. 테슬라는 능동 날개를 통해 접지력과 코너링 성능을 높인다고 설명합니다.'],['하부 공기를 빼내 접지력을 높이는 원리','팬과 지면 밀폐 구조가 차량 아래 공기를 배출해 다운포스를 만듭니다. 그림의 아래 방향 화살표는 이 힘을 표현합니다.'],['냉가스를 분사해 추가 추력을 제공','Thrust는 후방 추력기로 가속을, Rocket은 차량 둘레의 추력기로 상승·회전 등을 지원한다고 설명합니다. Rocket은 공도 사용 미승인입니다.']];
let selectedTech=1,techModalOpener=null,techFocusReturning=false,techHoverReady=true;
const techModal=$('#techModal');
const techDetails=[
 {letter:'A',title:'능동 공력장치',english:'ACTIVE AERO',intro:'능동 날개와 공력장치를 조절해 차량이 받는 공기의 힘을 바꾸는 기술입니다.',steps:[['공력장치 조절','능동 날개 등 공력장치의 상태를 바꿉니다.'],['공기 흐름 변화','차량 주변을 흐르는 공기의 흐름이 달라집니다.'],['주행 특성 조율','다운포스와 공기저항 사이의 균형을 조절합니다.']],effect:'다운포스는 차량을 지면 쪽으로 누르는 힘입니다. 접지력을 높여 코너링에 도움을 주는 방향과 공기저항을 줄이는 방향을 주행 목적에 맞춰 조율합니다.',application:'테슬라는 능동 날개와 트랙 모드에서의 고다운포스·저항 감소 설정을 설명합니다. 하부의 공기를 빼내는 흡입 시스템과는 작동 방식이 다릅니다.',note:'핵심 구분: 능동 공력장치는 공기의 흐름을 바꾸고, 흡입 시스템은 차량 아래의 공기를 배출합니다.'},
 {letter:'S',title:'멀티모드 흡입 시스템',english:'MULTI-MODE SUCTION SYSTEM',intro:'팬과 지면 밀폐 구조로 차량 아래의 공기를 빼내 다운포스를 만드는 기술입니다.',steps:[['팬으로 공기 배출','차량 하부의 공기를 팬으로 빼냅니다.'],['하부 압력차 형성','지면 밀폐 구조와 함께 압력차를 형성합니다.'],['아래 방향 힘 생성','압력차로 차량을 지면 쪽으로 누르는 힘을 만듭니다.']],effect:'차량을 아래로 누르는 힘은 타이어의 접지력을 확보하는 데 도움을 줍니다. 테슬라는 주행풍에만 의존하지 않고 정지 상태에서도 다운포스를 만들 수 있다고 설명합니다.',application:'능동 공력장치가 날개와 공기 흐름을 조절한다면, 흡입 시스템은 팬과 밀폐 구조를 사용합니다. 왼쪽 그림은 이 원리를 쉽게 표현한 개념도입니다.',note:'그림과 단계 설명은 원리 이해용입니다. 실제 부품의 위치나 최종 설계를 그대로 나타내지는 않습니다.'},
 {letter:'T',title:'냉가스 추력기',english:'COLD-GAS THRUSTERS',intro:'냉가스를 분사할 때 생기는 반작용을 이용해 차량에 추가적인 힘을 주는 기술입니다.',steps:[['냉가스 분사','추력기가 냉가스를 분사합니다.'],['추가 추력 발생','가스가 나가는 반대 방향으로 힘을 얻습니다.'],['가속·자세 제어','추력기의 위치와 분사 방향에 따라 움직임을 돕습니다.']],effect:'테슬라는 정밀하게 제어되는 냉가스 추력기로 추가 가속과 자세 제어를 지원한다고 설명합니다. 다운포스를 만드는 공력장치·흡입 시스템과 역할을 구분해야 합니다.',application:'Thrust는 차량 후방의 추력기로 가속을 돕습니다. Rocket은 차량 둘레의 추력기로 전진·상승과 회전 운동을 지원하는 구성으로 설명됩니다.',note:'Rocket은 공도 사용 미승인이고 일부 지역에서는 제공되지 않습니다. 제조사의 기술 설명과 실제 판매·승인을 구분해야 합니다.'}
];
function selectTech(i){if(i===selectedTech)return;selectedTech=i;selectWithin('[data-tech]',$(`[data-tech="${i}"]`));const d=techs[i];$('#techTitle').textContent=d[0];$('#techText').textContent=d[1];$('.tech-explain').classList.remove('pulse');if(!reduce.matches)requestAnimationFrame(()=>$('.tech-explain').classList.add('pulse'))}
function renderTechModal(i){selectTech(i);const d=techDetails[i];selectWithin('[data-modal-tech]',$(`[data-modal-tech="${i}"]`));$('#techModalLetter').textContent=d.letter;$('#techModalTitle').textContent=d.title;$('#techModalEnglish').textContent=d.english;$('#techModalIntro').textContent=d.intro;$('#techModalEffect').textContent=d.effect;$('#techModalApplication').textContent=d.application;$('#techModalNote').textContent=d.note;$('#techModalFlow').replaceChildren(...d.steps.map(([title,text])=>{const li=document.createElement('li'),strong=document.createElement('strong'),p=document.createElement('p');strong.textContent=title;p.textContent=text;li.append(strong,p);return li}));$$('[data-tech]').forEach(b=>b.setAttribute('aria-expanded',String(techModal.open&&+b.dataset.tech===i)));$('.tech-modal-scroll').scrollTop=0}
function openTechModal(i,opener){techModalOpener=opener;renderTechModal(i);techModal.classList.remove('is-closing');techModal.showModal();$('.tech-modal-scroll').scrollTop=0;document.documentElement.classList.add('tech-modal-open');$(`[data-tech="${i}"]`).setAttribute('aria-expanded','true')}
async function closeTechModal(){if(!techModal.open||techModal.classList.contains('is-closing'))return;techModal.classList.add('is-closing');if(!reduce.matches)await Promise.allSettled(techModal.getAnimations().map(a=>a.finished));techFocusReturning=true;techHoverReady=false;techModal.close();techModal.classList.remove('is-closing');document.documentElement.classList.remove('tech-modal-open');$$('[data-tech]').forEach(b=>b.setAttribute('aria-expanded','false'));if(techModalOpener?.isConnected)techModalOpener.focus({preventScroll:true});queueMicrotask(()=>techFocusReturning=false)}
$$('[data-tech]').forEach(button=>{button.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&!techModal.open&&!techFocusReturning&&techHoverReady)selectTech(+button.dataset.tech)});button.addEventListener('pointermove',event=>{if(event.pointerType!=='touch'&&!techModal.open&&!techFocusReturning){techHoverReady=true;selectTech(+button.dataset.tech)}});button.addEventListener('focus',()=>{if(!techModal.open&&!techFocusReturning)selectTech(+button.dataset.tech)});button.addEventListener('click',()=>openTechModal(+button.dataset.tech,button))});
$$('[data-modal-tech]').forEach(button=>button.addEventListener('click',()=>renderTechModal(+button.dataset.modalTech)));
$('#techModalClose').addEventListener('click',closeTechModal);
techModal.addEventListener('cancel',event=>{event.preventDefault();closeTechModal()});
techModal.addEventListener('click',event=>{if(event.target!==techModal)return;const r=techModal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeTechModal()});
techModal.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const items=[...techModal.querySelectorAll('button:not([disabled]),a[href]')],first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}else if(!techModal.contains(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus()}});

$('#closingSources').onclick=()=>{$('#sources').showModal()};$('#sourceClose').onclick=()=>$('#sources').close();$('#sources').addEventListener('click',e=>{if(e.target===$('#sources')){let r=$('#sources').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#sources').close()}});$('#fullscreen').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch{}};
reduce.addEventListener('change',()=>{Chart.defaults.animation.duration=reduce.matches?0:850;if(reduce.matches)$$('[data-count]').forEach(finishCount);Object.values(charts).forEach(c=>{c.stop();c.options.animation=reduce.matches?false:{duration:1100};c.canvas.dataset.filling='false';c.canvas.dataset.fillProgress='1';c.update('none')})});

const annualData=[{"year":2023,"revenue":96773,"production":1845985,"grossProfit":17660,"operatingIncome":8891,"netIncome":14997,"operatingMargin":9.2,"operatingCashFlow":13256,"capex":8899,"freeCashFlow":4357,"cashInvestments":29094},{"year":2024,"revenue":97690,"production":1773443,"grossProfit":17450,"operatingIncome":7076,"netIncome":7091,"operatingMargin":7.2,"operatingCashFlow":14923,"capex":11342,"freeCashFlow":3581,"cashInvestments":36563},{"year":2025,"revenue":94827,"production":1654667,"grossProfit":17094,"operatingIncome":4355,"netIncome":3794,"operatingMargin":4.6,"operatingCashFlow":14747,"capex":8527,"freeCashFlow":6220,"cashInvestments":44059}];
let annualSelected=2,annualFinanceMode='profit';
const annualFinanceGroups={profit:{title:'수익성',keys:['grossProfit','operatingIncome','netIncome'],labels:['매출총이익','영업이익','순이익 (GAAP)'],max:20},cash:{title:'현금흐름',keys:['operatingCashFlow','capex','freeCashFlow'],labels:['영업현금흐름','설비투자','잉여현금흐름'],max:18}};
const annualFinancialLabels={id:'annualFinancialLabels',afterDatasetsDraw(chart){const {ctx}=chart;ctx.save();ctx.font='bold 15px NanumSquare';ctx.fillStyle=wine;ctx.textAlign='left';ctx.textBaseline='middle';chart.getDatasetMeta(0).data.forEach((bar,i)=>ctx.fillText(chart.data.datasets[0].data[i].toFixed(3),bar.x+8,bar.y));ctx.restore()}};
function updateAnnualFinancial(){
 const d=annualData[annualSelected],g=annualFinanceGroups[annualFinanceMode],values=g.keys.map(k=>d[k]/1000);
 $('#annualFinancialTitle').textContent=d.year+'년 '+g.title;
 $('#annualLinkedYear').textContent=d.year+'년 실적 선택';
 $('#annualFinancialChart').setAttribute('aria-label',d.year+'년 '+g.labels.map((label,i)=>label+' '+d[g.keys[i]].toLocaleString('ko-KR')+'백만 달러').join(', '));
 $('#annualFinancialSummaryLabel').textContent=annualFinanceMode==='profit'?'GAAP 영업이익률':'기말 현금·현금성자산·투자자산';
 $('#annualFinancialSummaryValue').innerHTML=annualFinanceMode==='profit'?d.operatingMargin.toFixed(1)+'<small>%</small>':(d.cashInvestments/1000).toFixed(3)+'<small>십억 달러</small>';
 $('#annualFinancialNote').textContent=annualFinanceMode==='profit'?(d.year===2023?'2023년 순이익에는 이연법인세자산 평가충당금 환입에 따른 세금 효과가 반영됐습니다.':'순이익은 보통주주 귀속 GAAP 기준입니다.'):'FCF = 영업현금흐름 − 설비투자. 설비투자는 에너지 시스템 구입을 포함한 지출 규모입니다.';
 $('#annualYearNote').textContent=[
  '2023년 영업이익률은 9.2%입니다. 순이익은 세금 효과의 영향을 받아 영업이익보다 큽니다.',
  '2024년 매출은 전년 대비 0.9% 증가했고, 영업이익률은 7.2%로 낮아졌습니다.',
  '2025년 매출과 차량 생산량은 전년보다 감소했습니다. 영업이익률은 4.6%입니다.'
 ][annualSelected];
 if(charts.annualFinancial){const c=charts.annualFinancial;c.data.labels=g.labels;c.data.datasets[0].data=values;c.options.scales.x.max=g.max;replayChart(c,true)}else{
  const o=structuredClone(base);o.indexAxis='y';o.layout={padding:{right:62}};o.scales={x:{beginAtZero:true,max:g.max,ticks:{stepSize:5,font:{size:12}},grid:{color:'#f0edf2'},border:{display:false}},y:{ticks:{font:{size:14},color:ink},grid:{display:false},border:{display:false}}};o.plugins.tooltip.callbacks={label:ctx=>ctx.label+': '+(ctx.raw*1000).toLocaleString('ko-KR')+'백만 달러'};
  charts.annualFinancial=new Chart($('#annualFinancialChart'),{type:'bar',data:{labels:g.labels,datasets:[{data:values,backgroundColor:pink,borderColor:wine,borderWidth:1,barThickness:23}]},options:o,plugins:[annualFinancialLabels]});
 }
 refreshReactiveNumbers($('.annual-financial-area'),true);
}
$$('[data-annual-finance]').forEach(button=>button.addEventListener('click',()=>{if(annualFinanceMode===button.dataset.annualFinance)return;annualFinanceMode=button.dataset.annualFinance;selectWithin('[data-annual-finance]',button);updateAnnualFinancial()}));
const annualLabels={id:'annualLabels',afterDatasetsDraw(c){const {ctx}=c;ctx.save();ctx.textAlign='center';ctx.textBaseline='bottom';ctx.font='bold 14px NanumSquare';c.getDatasetMeta(0).data.forEach((bar,i)=>{ctx.fillStyle=i===annualSelected?wine:'#88828f';const value=c.canvas.id==='annualRevenueChart'?c.data.datasets[0].data[i].toFixed(3):c.data.datasets[0].data[i].toLocaleString('en-US');ctx.fillText(value,bar.x,bar.y-8)});ctx.restore()}};
function makeAnnual(){let r=structuredClone(base);r.layout={padding:{top:20}};r.scales.y.max=110;r.scales.y.ticks.callback=v=>'$'+v;r.plugins.tooltip.callbacks={label:c=>`연결 매출: ${annualData[c.dataIndex].revenue.toLocaleString('ko-KR')}백만 달러`};r.datasets={bar:{maxBarThickness:66}};charts.annualRevenue=new Chart($('#annualRevenueChart'),{type:'bar',data:{labels:annualData.map(d=>d.year+'년'),datasets:[{label:'연간 매출',data:annualData.map(d=>d.revenue/1000),backgroundColor:annualData.map((_,i)=>i===annualSelected?pink:pale),borderRadius:3}]},options:r,plugins:[annualLabels]});let p=structuredClone(base);p.layout={padding:{top:20}};p.scales.y.max=2200000;p.scales.y.ticks.callback=v=>(v/10000).toLocaleString('ko-KR');p.plugins.tooltip.callbacks={label:c=>`차량 생산량: ${c.raw.toLocaleString('ko-KR')}대`};p.datasets={bar:{maxBarThickness:66}};charts.annualProduction=new Chart($('#annualProductionChart'),{type:'bar',data:{labels:annualData.map(d=>d.year+'년'),datasets:[{label:'연간 생산량',data:annualData.map(d=>d.production),backgroundColor:annualData.map((_,i)=>i===annualSelected?wine:pale),borderRadius:3}]},options:p,plugins:[annualLabels]});updateAnnualFinancial()}
function replayAnnualSelection(chart,index){
 if(!chart)return;
 const canvas=chart.canvas;
 // Finish an interrupted selection and apply highlight colors without moving bars.
 chart.stop();chart.update('none');
 canvas.dataset.replayIndex=String(index);
 if(reduce.matches){chart.options.animation=false;canvas.dataset.fillProgress='1';canvas.dataset.filling='false';return}
 canvas.dataset.filling='true';canvas.dataset.fillProgress='0';
 canvas.dataset.replayCount=String(+(canvas.dataset.replayCount||0)+1);
 const started=performance.now();
 chart.options.animation={duration:0,onProgress:()=>{canvas.dataset.fillProgress=Math.min(1,(performance.now()-started)/1100).toFixed(3)},onComplete:()=>{canvas.dataset.fillProgress='1';canvas.dataset.filling='false'}};
 chart.options.transitions.annualSelection={animation:{duration:0},animations:{y:{type:'number',duration:context=>context.dataIndex===index?1100:0,easing:'easeOutCubic',from:context=>context.dataIndex===index?context.chart.scales.y.getBasePixel():undefined}}};
 chart.update('annualSelection');
}
function annualChange(value,prev){let pct=(value/prev-1)*100;return '전년 대비 '+(pct>=0?'+':'−')+Math.abs(pct).toFixed(1)+'%'}
intent('[data-year]',b=>{let i=+b.dataset.year;if(i===annualSelected)return;annualSelected=i;selectWithin('[data-year]',b);let d=annualData[i],prev=annualData[i-1];$('#annualYearLabel').textContent=d.year+'년 연결 매출';$('#annualProductionLabel').textContent=d.year+'년 차량 생산량';$('#annualRevenueValue').innerHTML=(d.revenue/100).toLocaleString('ko-KR',{minimumFractionDigits:2,maximumFractionDigits:2})+'<small>억 달러</small>';$('#annualProductionValue').innerHTML=d.production.toLocaleString('ko-KR')+'<small>대</small>';$('#annualRevenueChange').textContent=prev?annualChange(d.revenue,prev.revenue):'비교 기간의 시작 연도';$('#annualProductionChange').textContent=prev?annualChange(d.production,prev.production):'비교 기간의 시작 연도';refreshReactiveNumbers($('.annual-slide'),true);updateAnnualFinancial();if(charts.annualRevenue){charts.annualRevenue.data.datasets[0].backgroundColor=annualData.map((_,j)=>j===i?pink:pale);charts.annualProduction.data.datasets[0].backgroundColor=annualData.map((_,j)=>j===i?wine:pale);replayAnnualSelection(charts.annualRevenue,i);replayAnnualSelection(charts.annualProduction,i)}});

const reactiveNumbers='.big-stat,.op-head strong,.annual-metric strong,.growth,.delta,#financeInsightTitle,.caution strong,#annualRevenueChange,#annualProductionChange,#annualFinancialSummaryValue';
function prepareReactiveNumber(target){if(target.hasAttribute("data-text-override")){target.classList.remove("replay-number");target.removeAttribute("aria-label");return []}if(!target.querySelector('[data-count]')){const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement.closest('small'))continue;const match=node.textContent.match(/([+−-]?)(\d[\d,]*(?:\.\d+)?)/);if(!match)continue;const number=document.createElement('span');number.dataset.count=match[2].replaceAll(',','');number.dataset.decimals=(match[2].split('.')[1]||'').length;if(match[1])number.dataset.countSign=match[1];number.textContent=match[0];const before=node.textContent.slice(0,match.index),after=node.textContent.slice(match.index+match[0].length);node.replaceWith(document.createTextNode(before),number,document.createTextNode(after));break}}const counters=[...target.querySelectorAll('[data-count]')];if(counters.length){target.classList.add('replay-number');target.tabIndex=0;const label=target.cloneNode(true);label.querySelectorAll('[data-count]').forEach(el=>el.textContent=countText(el,+el.dataset.count));target.setAttribute('aria-label',label.textContent);counters.forEach(el=>el.setAttribute('aria-hidden','true'))}else{target.classList.remove('replay-number');target.removeAttribute('tabindex');target.removeAttribute('aria-label')}return counters}
function refreshReactiveNumbers(root,animate=false){root.querySelectorAll(reactiveNumbers).forEach(target=>prepareReactiveNumber(target).forEach(el=>{if(animate)count(el,true)}))}
function replayChart(chart,force=false){if(!chart)return;const canvas=chart.canvas;if(reduce.matches){chart.stop();chart.options.animation=false;canvas.dataset.fillProgress='1';canvas.dataset.filling='false';chart.update('none');return}if(canvas.dataset.filling==='true'&&!force)return;chart.stop();canvas.dataset.filling='true';canvas.dataset.fillProgress='0';canvas.dataset.replayCount=String(+(canvas.dataset.replayCount||0)+1);chart.options.animation={duration:1100,easing:'easeOutCubic',onProgress:animation=>{canvas.dataset.fillProgress=(animation.currentStep/Math.max(1,animation.numSteps)).toFixed(3)},onComplete:()=>{canvas.dataset.fillProgress='1';canvas.dataset.filling='false'}};chart.reset();chart.update()}
function replayOnIntent(target,replay){target.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')replay()});target.addEventListener('focus',replay);target.addEventListener('click',replay);target.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();replay()}})}
$$(reactiveNumbers).forEach(target=>{prepareReactiveNumber(target);replayOnIntent(target,()=>prepareReactiveNumber(target).forEach(el=>count(el)))});
$$('canvas').forEach(canvas=>{canvas.classList.add('replay-chart');canvas.tabIndex=0;canvas.setAttribute('aria-description','마우스를 올리거나 Enter 키를 눌러 채워지는 효과를 다시 볼 수 있습니다.');replayOnIntent(canvas,()=>replayChart(Chart.getChart(canvas)))});


// Slides display all content immediately; clicks remain available to controls.
$('#startPresentation').addEventListener('click',()=>go(1));
window.deckPresentation={editModeChanged(active){
 window.brandFilm?.editModeChanged(active);
 if(active){promoVideo.pause();if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});$$('[data-count]').forEach(finishCount);Object.values(charts).forEach(chart=>{chart.stop();chart.update('none')})}
 else if(current===1)syncVideoSlide(true);
 else refreshReactiveNumbers(slides[current]);
}};

go((parseInt(location.hash.slice(1),10)||1)-1,false);
document.fonts.ready.then(()=>Object.values(charts).forEach(chart=>chart.update('none')));
