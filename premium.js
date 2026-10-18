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
 const art=document.createElement('figure');art.className='premium-art';art.setAttribute('aria-hidden','true');art.innerHTML='<span class="art-label">ANATOMY / BONE ATLAS</span><img src="skeleton.png" alt="" decoding="async"><figcaption>人体骨骼 · 前面观<small>Mikael Häggström · 公有领域</small></figcaption>';heading.append(art);
 const notice=document.getElementById('hosted-notice'),setup=document.getElementById('online-ai-setup');
 if(notice){const p=notice.querySelector('p');if(p)p.textContent='无需登录即可学习；记录保存在当前浏览器，换设备前请导出备份。';}
 if(setup){
  setup.open=location.hash==='#connect';
  const connect=document.createElement('button');connect.className='premium-connect';connect.textContent='连接个人 AI ↗';connect.onclick=()=>{setup.open=true;setup.scrollIntoView({behavior:'smooth',block:'start'});};workflow?.append(connect);
 }
 const note=document.createElement('p');note.className='premium-footer-note';note.textContent='ZHIGU  /  ANATOMY & INTELLIGENT LEARNING';document.querySelector('footer')?.before(note);
})();
