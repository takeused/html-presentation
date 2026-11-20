(() => {
 'use strict';
 const source='https://www.sec.gov/Archives/edgar/data/1318605/000162828026049270/tsla-20260630.htm';
 // USD millions. Q2 2026 Form 10-Q, statements of operations and MD&A.
 const businesses=[
  {name:'자동차',now:20516,prior:16661,ytd:36750,scope:'차량 판매, 규제 크레딧, 차량 리스에서 발생한 매출입니다.',change:'차량 인도 증가가 매출 확대에 기여했습니다. 규제 크레딧 매출은 전년 동기보다 줄었습니다.',composition:'차량 판매 200.06억 · 규제 크레딧 1.46억 · 리스 3.64억 달러'},
  {name:'에너지',now:3139,prior:2789,ytd:5547,scope:'에너지 저장장치와 발전 시스템의 판매·리스 매출입니다.',change:'Megapack 배치 증가가 성장을 이끌었습니다. Megapack 평균판매가격 하락과 Powerwall 배치 감소가 일부 상쇄했습니다.',composition:'시스템 판매 29.98억 · 리스 1.41억 달러'},
  {name:'서비스·기타',now:4581,prior:3046,ytd:8326,scope:'중고차 판매, 보증 외 정비·수리, 유료 Supercharging 등을 포함합니다.',change:'중고차 판매량과 평균판매가격, 보증 외 정비·수리, 유료 충전 이용 증가가 매출 확대에 기여했습니다.',composition:'공시에서 이 항목의 개별 서비스별 매출 금액은 따로 구분하지 않았습니다.'}
 ];
 const modes=['segments','profit','cash'];
 let mode='segments',selectedBusiness=0;
 const dialogs=[$('#financeRevenueDrawer'),$('#financeSectorSheet'),$('#financeMetricModal')];
 const openers=new WeakMap(),detailCharts={};
 const eok=v=>(v/100).toLocaleString('ko-KR',{minimumFractionDigits:2,maximumFractionDigits:2})+'억 달러';
 const percent=v=>v.toFixed(1)+'%';
 function show(dialog,opener){
  if(dialog.open)return;
  openers.set(dialog,opener);dialog.classList.remove('is-closing');dialog.showModal();
  document.documentElement.classList.add('finance-detail-open');
  dialog.querySelector('.fin-scroll').scrollTop=0;
  if(dialog.id==='financeRevenueDrawer')$('#financeRevenueTrigger').setAttribute('aria-expanded','true');
 }
 async function close(dialog){
  if(!dialog.open||dialog.classList.contains('is-closing'))return;
  dialog.classList.add('is-closing');
  if(!reduce.matches)await Promise.allSettled(dialog.getAnimations().map(a=>a.finished));
  dialog.close();dialog.classList.remove('is-closing');
  if(!dialogs.some(d=>d.open))document.documentElement.classList.remove('finance-detail-open');
  $('#financeRevenueTrigger').setAttribute('aria-expanded','false');
  const opener=openers.get(dialog);if(opener?.isConnected)opener.focus({preventScroll:true});
 }
 dialogs.forEach(dialog=>{
  dialog.querySelector('[data-fin-close]').addEventListener('click',()=>close(dialog));
  dialog.addEventListener('cancel',event=>{event.preventDefault();close(dialog)});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close(dialog)});
  dialog.addEventListener('close',()=>{if(!dialogs.some(d=>d.open))document.documentElement.classList.remove('finance-detail-open')});
 });
 function draw(id,type,data,options){
  if(detailCharts[id])detailCharts[id].destroy();
  detailCharts[id]=new Chart($('#'+id),{type,data,options});
 }
 function detailOptions(){
  const o=structuredClone(base);o.plugins.tooltip.callbacks={label:c=>`${c.dataset.label||c.label}: $${Array.isArray(c.raw)?Math.abs(c.raw[1]-c.raw[0]).toFixed(3):Number(c.raw).toFixed(3)}B`};
  o.scales.y.ticks.callback=v=>'$'+v+'B';o.datasets={bar:{maxBarThickness:64}};
  return o;
 }
 function openRevenue(opener){
  show($('#financeRevenueDrawer'),opener);
  const o=detailOptions();o.plugins.legend={display:true,position:'bottom',labels:{boxWidth:10,font:{size:12}}};o.scales.x.stacked=true;o.scales.y.stacked=true;
  draw('financeYtdChart','bar',{labels:['2025 상반기','2026 상반기'],datasets:[{label:'1분기',data:[19.335,22.387],backgroundColor:pale,borderRadius:3},{label:'2분기',data:[22.496,28.236],backgroundColor:pink,borderRadius:3}]},o);
 }
 function openBusiness(index,opener){
  selectedBusiness=Math.max(0,Math.min(2,index));const d=businesses[selectedBusiness],dialog=$('#financeSectorSheet');
  dialog.dataset.business=String(selectedBusiness);
  $$('[data-fin-business]').forEach(b=>{const selected=+b.dataset.finBusiness===selectedBusiness;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});
  $('#finSectorTitle').textContent=d.name+' 사업 자세히 보기';$('#finSectorRevenue').textContent=eok(d.now);$('#finSectorYtd').textContent=eok(d.ytd);$('#finSectorShare').textContent=percent(d.now/28236*100);
  $('#finSectorScope').textContent=d.scope;$('#finSectorChange').textContent=d.change;$('#finSectorComposition').textContent=d.composition;
  $('#finSectorGrowth').textContent='전년 동기 대비 +'+percent((d.now/d.prior-1)*100);
  $('#financeBusinessChart').setAttribute('aria-label',`${d.name} 매출: 2025년 2분기 ${eok(d.prior)}, 2026년 2분기 ${eok(d.now)}`);
  if(!dialog.open)show(dialog,opener);
  const o=detailOptions();o.plugins.tooltip.callbacks={label:c=>eok(c.raw*1000)};
  draw('financeBusinessChart','bar',{labels:['Q2 2025','Q2 2026'],datasets:[{label:d.name+' 매출',data:[d.prior/1000,d.now/1000],backgroundColor:[pale,pink],borderRadius:4}]},o);
 }
 function openMetric(opener){
  const cash=mode==='cash',dialog=$('#financeMetricModal');dialog.dataset.metric=cash?'cash':'profit';
  $('#finMetricTitle').textContent=cash?'투자와 현금흐름 자세히 보기':'영업이익 자세히 보기';
  $('#finMetricLead').textContent=cash?'영업에서 창출한 현금보다 설비투자 지출이 컸습니다.':'매출총이익에서 연구개발비와 판매관리비를 빼면 영업이익이 남습니다.';
  $('#finMetricValue').textContent=cash?'−10.92억 달러':'3.98억 달러';
  $('#finMetricValueLabel').textContent=cash?'Q2 2026 잉여현금흐름 (FCF)':'Q2 2026 GAAP 영업이익';
  $('#finMetricCompare').textContent=cash?'영업현금흐름 46.97억 − 설비투자 57.89억 달러':'전년 동기 9.23억 달러 대비 −56.9% · 영업이익률 4.1% → 1.4%';
  $('#finMetricFormula').textContent=cash?'46.97억 − 57.89억 = −10.92억 달러':'47.51억 − 23.71억 − 19.82억 = 3.98억 달러';
  $('#finMetricDetail').textContent=cash?'설비투자에는 AI·운영 인프라, 공장과 생산설비 확장이 포함됩니다. FCF는 영업현금흐름에서 설비투자를 차감한 값입니다.':'매출총이익은 47.51억 달러, 영업비용은 43.53억 달러입니다. 영업비용은 전년 동기보다 47.3% 늘었습니다.';
  $('#finMetricNote').textContent=cash?'1~6월 누적: 영업현금흐름 86.34억 − 설비투자 82.82억 = FCF 3.52억 달러. 분기와 누적의 집계 기간을 구분하세요.':'1~6월 누적 GAAP 영업이익은 13.39억 달러입니다. 영업이익은 이자·세금 등을 반영한 순이익과 구분합니다.';
  $('#finMetricChartTitle').textContent=cash?'현금 창출에서 투자 지출까지':'매출총이익에서 영업이익까지';
  show(dialog,opener);
  const o=detailOptions();o.plugins.tooltip.callbacks={label:c=>`${c.label}: ${eok((cash&&c.dataIndex>0?-1:1)*Math.abs(c.raw[1]-c.raw[0])*1000)}`};
  const labels=cash?['영업현금흐름','설비투자 지출','잉여현금흐름']:['매출총이익','연구개발비','판매관리비','영업이익'];
  const values=cash?[[0,4.697],[-1.092,4.697],[0,-1.092]]:[[0,4.751],[2.380,4.751],[.398,2.380],[0,.398]];
  $('#financeBridgeChart').setAttribute('aria-label',labels.join(', ')+' · '+$('#finMetricFormula').textContent);
  draw('financeBridgeChart','bar',{labels,datasets:[{data:values,backgroundColor:cash?[wine,pale,pink]:[wine,pale,pale,pink],borderRadius:3}]},o);
 }
 function selectMode(value){
  const index=Math.max(0,Math.min(2,Number(value)));mode=modes[index];
  $('#financeLever').value=String(index);$('#financeLever').style.setProperty('--finance-fill',index*50+'%');$('#financeLever').setAttribute('aria-valuetext',financeInsights[mode][0]);
  selectWithin('[data-finance]',$(`[data-finance="${mode}"]`));makeFinance(mode);
  $('#financeChartTitle').textContent=financeInsights[mode][0];$('#financeInsightTitle').textContent=financeInsights[mode][1];$('#financeInsight').textContent=financeInsights[mode][2];prepareReactiveNumber($('#financeInsightTitle'));
  $('#financeBusinessLabels').hidden=mode!=='segments';$('#financeMetricOpen').hidden=mode==='segments';
  $('#financeChartHint').textContent=mode==='segments'?'사업 이름이나 막대를 눌러 세부 내용을 확인하세요.':'그래프를 누르면 비용과 현금흐름의 세부 내용이 열립니다.';
  $('#financeChart').setAttribute('aria-label',financeInsights[mode][0]+' · 클릭 또는 Enter로 세부 내용 보기');
 }
 window.financeDetails={chartClick(event,elements,chart){
  const a=chart.chartArea;if(!a||event.x<a.left||event.x>a.right||event.y<a.top||event.y>a.bottom)return;
  if(mode==='segments'){const index=elements[0]?.index??Math.min(2,Math.max(0,Math.floor((event.x-a.left)/(a.right-a.left)*3)));openBusiness(index,chart.canvas)}else openMetric(chart.canvas);
 }};
 $('#financeRevenueTrigger').addEventListener('click',event=>openRevenue(event.currentTarget));
 $('#financeRevenueTrigger').addEventListener('keydown',event=>{if(window.deckEditor?.active&&event.target.closest('[contenteditable="true"]'))return;if(['Enter',' '].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();openRevenue(event.currentTarget)}},true);
 $$('[data-fin-business-open]').forEach(b=>b.addEventListener('click',()=>openBusiness(+b.dataset.finBusinessOpen,b)));
 $$('[data-fin-business]').forEach(b=>b.addEventListener('click',()=>openBusiness(+b.dataset.finBusiness,openers.get($('#financeSectorSheet')))));
 $$('[data-finance]').forEach(b=>b.addEventListener('click',()=>selectMode(modes.indexOf(b.dataset.finance))));
 $('#financeLever').addEventListener('input',event=>selectMode(event.target.value));
 $('#financeLever').addEventListener('keydown',event=>{let i=modes.indexOf(mode);if(['ArrowRight','ArrowUp'].includes(event.key))i++;else if(['ArrowLeft','ArrowDown'].includes(event.key))i--;else if(event.key==='Home')i=0;else if(event.key==='End')i=2;else return;event.preventDefault();event.stopPropagation();selectMode(i)});
 $('#financeMetricOpen').addEventListener('click',event=>openMetric(event.currentTarget));
 $('#financeChart').setAttribute('role','button');$('#financeChart').setAttribute('aria-haspopup','dialog');$('#financeChart').setAttribute('aria-description','사업별 매출은 사업 상세 패널, 영업이익과 현금흐름은 상세 팝업을 엽니다.');
 $('#financeChart').addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();if(mode==='segments')openBusiness(selectedBusiness,event.currentTarget);else openMetric(event.currentTarget)}});
 dialogs.forEach(dialog=>dialog.querySelectorAll('[data-fin-source]').forEach(a=>a.href=source));
 if(charts.finance){charts.finance.options.onClick=window.financeDetails.chartClick;charts.finance.options.scales.x.ticks.display=false;charts.finance.update('none')}
})();
