'use strict';
(() => {
 const main=document.querySelector('main'),heading=document.querySelector('.heading'),workflow=document.querySelector('.workflow');
 if(!main||!heading)return;
 main.prepend(heading);if(workflow)heading.after(workflow);
 const count=window.CURRICULUM;
 const overview=document.createElement('div');overview.className='premium-overview';overview.setAttribute('aria-label','课程内容概览');
 overview.innerHTML=`<span><b>${count?.modules?.length||4}</b><small>教学模块</small></span><span><b>${count?.structures?.length||36}</b><small>学习条目</small></span><span><b>${count?.questions?.length||96}</b><small>练习题目</small></span>`;
 heading.querySelector('div').append(overview);
 const jump=document.createElement('button');jump.className='premium-start primary';heading.querySelector('.heading-action').append(jump);jump.onclick=()=>document.querySelector(main.dataset.view==='lesson'?'.lesson-work':'#modules')?.scrollIntoView({behavior:'smooth',block:'start'});
 const updateView=name=>{heading.classList.toggle('compact',!['lesson','learn'].includes(name));main.dataset.view=name;jump.hidden=!['lesson','learn'].includes(name);jump.textContent=name==='lesson'?'进入本节伴学 ↓':'浏览课程内容 ↓';};
 document.addEventListener('zhigu:tab',event=>updateView(event.detail));updateView(document.querySelector('nav button.active')?.dataset.tab||'lesson');
 // The atlas uses the existing curriculum's authored landmarks. It is a 2D teaching map.
 const C=window.CURRICULUM, bones=C.structures.filter(s=>s.marker), esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let selected='humerus', filter='all', labels=true, zoom=1, px=0, py=0, drag=null;
 const positions={skull:['left',36],clavicle:['left',102],sternum:['left',166],ribs:['left',224],hip:['left',288],femur:['left',350],patella:['left',416],humerus:['right',166],radius:['right',228],ulna:['right',290],tibia:['right',422],fibula:['right',482]};
 const atlas=document.createElement('section');atlas.className='bone-studio';atlas.setAttribute('aria-label','互动骨骼教学台');
 atlas.innerHTML=`<div class="studio-top"><div><span class="studio-kicker">INTERACTIVE ANATOMY LAB</span><h2>从一块骨，开始一次探索<span>互动骨骼教学台</span></h2></div><span class="studio-version">二维图谱 / 前面观</span></div>
 <div class="studio-grid"><aside class="studio-library"><p class="studio-overline">01 / 选择观察部位</p><div class="studio-filters" aria-label="筛选骨骼模块">${[['all','全部'],['axial','中轴'],['upper','上肢'],['lower','下肢']].map(([id,name])=>`<button data-atlas-filter="${id}" aria-pressed="${id==='all'}">${name}</button>`).join('')}</div><div class="studio-bones"></div><div class="studio-library-note"><b>12 个可点选定位区域</b><p>进入教材可继续学习全部 36 个条目。</p><button class="studio-all">查看完整课程 ↗</button></div></aside>
 <div class="studio-visual"><div class="studio-view-top"><span><i></i> 点选骨骼 · 联动学习</span><button class="studio-label-toggle" aria-pressed="true">隐藏名称</button></div><div class="studio-viewport" tabindex="0" role="group" aria-label="可缩放拖动的人体骨骼图；用下方按钮缩放，方向键平移，左侧列表选择骨骼"><div class="studio-plane"><img src="skeleton.png" alt="人体骨骼前面观；带12个预设定位区域" draggable="false"><svg class="studio-wires" viewBox="0 0 520 560" aria-hidden="true"></svg><div class="studio-hotspots"></div></div></div><div class="studio-controls"><span>拖动平移 · ± 缩放</span><div><button data-atlas-zoom="out" aria-label="缩小骨骼图">−</button><output class="studio-scale" aria-live="polite">100%</output><button data-atlas-zoom="in" aria-label="放大骨骼图">＋</button><button data-atlas-zoom="reset">复位</button></div></div><p class="studio-source">原图：Mikael Häggström · 公有领域 ｜ 区域标记由课程预设</p></div>
 <aside class="studio-insight"><div class="studio-detail" aria-live="polite"></div><div class="studio-route"><p class="studio-overline">把观察，变成判断依据</p><ol><li><b>观察定位</b><span>看部位与相邻关系</span></li><li><b>说出理由</b><span>记录自己的判断依据</span></li><li><b>AI 追问与修正</b><span>连接模型后开展对话</span></li></ol></div></aside></div><div class="studio-bottom"><span>EXPLORE → EXPLAIN → REFLECT</span><p>点击名称或定位点，右侧同步显示学习线索。基础互动无需密钥。</p></div>`;
 heading.after(atlas);
 const plane=atlas.querySelector('.studio-plane'),viewport=atlas.querySelector('.studio-viewport');
 const transform=()=>{const fit=Math.min(1,viewport.clientWidth/520);plane.style.transform=`translate(${px}px,${py}px) scale(${zoom*fit})`;viewport.style.touchAction=zoom>1?'none':'pan-y';atlas.querySelector('.studio-scale').textContent=Math.round(zoom*100)+'%';atlas.querySelector('[data-atlas-zoom="out"]').disabled=zoom<=1;atlas.querySelector('[data-atlas-zoom="in"]').disabled=zoom>=2.5;};
 const reset=()=>{zoom=1;px=py=0;transform();};
 function renderAtlas(){
  const s=C.structures.find(b=>b.id===selected),module=C.modules.find(m=>m.id===s.module),visible=bones.filter(b=>filter==='all'||b.module===filter);
  atlas.querySelector('.studio-bones').innerHTML=visible.map(b=>`<button data-atlas-bone="${b.id}" aria-pressed="${b.id===selected}"><span>${esc(b.name)}<small>${esc(b.english)}</small></span><span class="studio-arrow">↗</span></button>`).join('');
  atlas.querySelectorAll('[data-atlas-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.atlasFilter===filter));
  atlas.querySelector('.studio-wires').innerHTML=visible.map(b=>{const [side,y]=positions[b.id],x=120+b.marker.x*2.8,by=10+b.marker.y*5.4133;return `<path class="${b.id===selected?'selected':''}" d="M ${side==='left'?104:416} ${y+15} L ${side==='left'?115:405} ${y+15} L ${x} ${by}"/>`;}).join('');
  atlas.querySelector('.studio-hotspots').innerHTML=visible.map((b)=>{const [side,y]=positions[b.id],i=bones.indexOf(b)+1;return `<button class="studio-map-label ${side} ${b.id===selected?'selected':''}" style="top:${y}px" data-atlas-bone="${b.id}" aria-pressed="${b.id===selected}" aria-label="选择${esc(b.name)}"><small>${String(i).padStart(2,'0')}</small><span>${labels?esc(b.name):'定位 '+i}</span></button><button class="studio-point ${b.id===selected?'selected':''}" style="left:${120+b.marker.x*2.8}px;top:${10+b.marker.y*5.4133}px" data-atlas-bone="${b.id}" aria-label="${esc(b.name)}定位点" aria-pressed="${b.id===selected}"></button>`;}).join('');
  const lessonId=['radius','ulna','humerus','clavicle'].includes(s.id)?'forearm':['tibia','fibula','patella'].includes(s.id)?'lower-leg':s.id==='hip'?'pelvis':s.id==='femur'?'femoral-landmarks':null;
  const held=new Set(Object.values(C.forms).flat()),question=C.questions.find(q=>q.structureId===s.id&&!held.has(q.id));
  atlas.querySelector('.studio-detail').innerHTML=`<p class="studio-overline">02 / 当前观察 · ${esc(module.name)}</p><h3>${esc(s.name)}<span>${esc(s.english)}</span></h3><p class="studio-category">${esc(s.category)} · 前面观定位</p><div class="studio-clue"><b>观察线索</b><p>${esc(s.tip)}</p></div><details class="studio-more"><summary>展开位置关系与易混提醒</summary><p>${esc(s.position)}</p><p>${esc(s.compare)}</p></details><div class="studio-actions"><button class="primary" data-atlas-study="${s.id}">打开 ${esc(s.name)} 教材 ↗</button>${question?`<button data-atlas-question="${question.id}">练一道相关题</button>`:''}<button class="studio-to-ai" ${lessonId?`data-atlas-lesson="${lessonId}"`:`data-atlas-ask="${s.id}"`}>${lessonId?'进入相关 AI 伴学 →':'围绕这块骨向 AI 提问 →'}</button></div>`;
 }
 function goTab(name){document.querySelector(`nav [data-tab="${name}"]`)?.click();}
 atlas.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.atlasBone){selected=b.dataset.atlasBone;renderAtlas();}
  if(b.dataset.atlasFilter){filter=b.dataset.atlasFilter;const group=bones.filter(s=>filter==='all'||s.module===filter);if(!group.some(s=>s.id===selected))selected=group[0].id;renderAtlas();reset();}
  if(b.classList.contains('studio-label-toggle')){labels=!labels;b.textContent=labels?'隐藏名称':'显示名称';b.setAttribute('aria-pressed',labels);renderAtlas();}
  if(b.dataset.atlasZoom){if(b.dataset.atlasZoom==='reset')reset();else{zoom=Math.max(1,Math.min(2.5,zoom+(b.dataset.atlasZoom==='in'?.25:-.25)));if(zoom===1)px=py=0;transform();}}
  if(b.dataset.atlasStudy||b.classList.contains('studio-all')){window.zhiguLearning.openStructure(b.dataset.atlasStudy||selected);document.getElementById('structure-detail').scrollIntoView({behavior:'smooth',block:'start'});}
  if(b.dataset.atlasQuestion){const trigger=document.createElement('button');trigger.dataset.question=b.dataset.atlasQuestion;trigger.hidden=true;document.body.append(trigger);trigger.click();trigger.remove();document.getElementById('quiz-area').scrollIntoView({behavior:'smooth',block:'start'});}
  if(b.dataset.atlasLesson){goTab('lesson');const sel=document.getElementById('lesson-case');if(sel&&!sel.disabled){sel.value=b.dataset.atlasLesson;sel.dispatchEvent(new Event('change',{bubbles:true}));}document.querySelector('.lesson-work')?.scrollIntoView({behavior:'smooth',block:'start'});}
  if(b.dataset.atlasAsk){goTab('ai');const sel=document.getElementById('ai-structure');sel.value=selected;sel.dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('ai-question').focus();document.querySelector('.ai-layout').scrollIntoView({behavior:'smooth',block:'start'});}
 });
 viewport.addEventListener('pointerdown',ev=>{if(ev.target.closest('button')||ev.button!==0||zoom===1)return;drag={x:ev.clientX,y:ev.clientY,px,py};viewport.setPointerCapture(ev.pointerId);});
 viewport.addEventListener('pointermove',ev=>{if(!drag)return;px=Math.max(-260,Math.min(260,drag.px+ev.clientX-drag.x));py=Math.max(-400,Math.min(400,drag.py+ev.clientY-drag.y));transform();});
 const endDrag=()=>{drag=null;};viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);
 viewport.addEventListener('keydown',ev=>{if(ev.target!==viewport||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key)||zoom===1)return;ev.preventDefault();px=Math.max(-260,Math.min(260,px+(ev.key==='ArrowLeft'?-25:ev.key==='ArrowRight'?25:0)));py=Math.max(-400,Math.min(400,py+(ev.key==='ArrowUp'?-25:ev.key==='ArrowDown'?25:0)));transform();});
 new ResizeObserver(()=>transform()).observe(viewport);renderAtlas();transform();
 const syncAtlas=()=>{atlas.hidden=!['lesson','learn'].includes(main.dataset.view);if(!atlas.hidden)requestAnimationFrame(transform);};document.addEventListener('zhigu:tab',syncAtlas);syncAtlas();
 const notice=document.getElementById('hosted-notice'),setup=document.getElementById('online-ai-setup');
 if(notice){const p=notice.querySelector('p');if(p)p.textContent='无需登录即可学习；记录保存在当前浏览器，换设备前请导出备份。';}
 if(setup){
  setup.open=location.hash==='#connect';
  const connect=document.createElement('button');connect.className='premium-connect';connect.textContent='连接个人 AI ↗';connect.onclick=()=>{setup.open=true;setup.scrollIntoView({behavior:'smooth',block:'start'});};workflow?.append(connect);
 }
 const note=document.createElement('p');note.className='premium-footer-note';note.textContent='ZHIGU  /  ANATOMY & INTELLIGENT LEARNING';document.querySelector('footer')?.before(note);
})();
